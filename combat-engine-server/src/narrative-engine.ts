// Narrative Engine - Tier 2, Phase 1 (Staged Integration)
// Isolated in-memory tactical/scene store & MCP tool handlers (set_scene_conditions, get_tactical_advantage)
//
// Safe for initial rollout: no mutation of existing core logic, well-documented API shape

// Range between two entities/positions
type RangeKey = string; // e.g. "A-B" or "char123-room7"
type RangeValue = number; // Units are abstract, e.g. meters/grids/feet

interface SceneConditions {
  environment: string; // e.g. "open field", "dense forest"
  cover: "none" | "partial" | "full";
  lighting: "bright" | "dim" | "dark";
  elevation?: "flat" | "high_ground" | "low_ground";
  weather?: string;
  custom?: Record<string, any>;
}

interface SituationalModifierResult {
  modifiers: number;
  reasons: string[];
}

/**
 * NarrativeEngine: Handles ranges, scenes, conditions, and situational modifiers.
 * All state is in-memory and transient until the persistent layer is available.
 */
export class NarrativeEngine {
  private static instance: NarrativeEngine;
  private rangeMap: Map<RangeKey, RangeValue>;
  private sceneConditions: SceneConditions;

  private constructor() {
    this.rangeMap = new Map();
    this.sceneConditions = {
      environment: "default",
      cover: "none",
      lighting: "bright",
    };
  }

  public static getInstance(): NarrativeEngine {
    if (!NarrativeEngine.instance) {
      NarrativeEngine.instance = new NarrativeEngine();
    }
    return NarrativeEngine.instance;
  }

  /**
   * Sets the tactical range between two entities/positions.
   * Key must be deterministic (caller handles entity ID ordering if symmetric).
   */
  setRange(key: RangeKey, value: RangeValue): void {
    if (typeof value !== "number" || value < 0) return;
    this.rangeMap.set(key, value);
  }

  /**
   * Gets the tactical range between two entities/positions.
   * Returns undefined if range is not set.
   */
  getRange(key: RangeKey): RangeValue | undefined {
    return this.rangeMap.get(key);
  }

  /**
   * Sets the current scene conditions.
   * Overwrites previous values, but is always safe (initial tier: in-memory only).
   */
  setSceneConditions(conditions: Partial<SceneConditions>): void {
    this.sceneConditions = { ...this.sceneConditions, ...conditions };
  }

  /**
   * Returns a snapshot of current scene conditions.
   */
  getSceneConditions(): SceneConditions {
    return { ...this.sceneConditions };
  }

  /**
   * Computes situational modifiers for an entity or group, based on scene/cover.
   */
  getSituationalModifiers(actor: { cover: string; isElevated?: boolean; [key: string]: any }): SituationalModifierResult {
    const reasons: string[] = [];
    let modifiers = 0;

    // Cover-based modifier
    if (actor.cover === "full") {
      modifiers += 2;
      reasons.push("Full cover (+2)");
    } else if (actor.cover === "partial") {
      modifiers += 1;
      reasons.push("Partial cover (+1)");
    }

    // Elevation (if supported in current scene)
    if (actor.isElevated && this.sceneConditions.elevation === "high_ground") {
      modifiers += 1;
      reasons.push("High ground (+1)");
    }

    // Lighting penalty
    if (this.sceneConditions.lighting === "dim") {
      modifiers -= 1;
      reasons.push("Dim lighting (-1)");
    } else if (this.sceneConditions.lighting === "dark") {
      modifiers -= 2;
      reasons.push("Darkness (-2)");
    }

    // Additional: customize here as new conditions/actors arise

    return { modifiers, reasons };
  }
}

// MCP Tool Handler Integration (for src/index.ts)
// Exposes two public MCP tools: set_scene_conditions, get_tactical_advantage
// Handlers should be registered in the MCP server bootstrap in src/index.ts

// MCP Tool: set_scene_conditions
// Params: { environment?: string; cover?: "none"|"partial"|"full"; lighting?: ...; ... }
// Returns: { ok: true }
export function handleSetSceneConditions(params: Partial<SceneConditions>): { ok: boolean } {
  const engine = NarrativeEngine.getInstance();
  engine.setSceneConditions(params);
  return { ok: true };
}

// MCP Tool: get_tactical_advantage
// Params: { actor: { cover: string; isElevated?: boolean; ... } }
// Returns: { modifiers: number, reasons: string[] }
export function handleGetTacticalAdvantage(params: { actor: { cover: string; isElevated?: boolean; [key: string]: any } }): SituationalModifierResult {
  const engine = NarrativeEngine.getInstance();
  return engine.getSituationalModifiers(params.actor);
}


/**
 * MCP Tool Exposure Plan for Safe Rollout:
 * - Register set_scene_conditions and get_tactical_advantage in the MCP tool registry
 * - Validate input via schema (in index.ts or dispatcher)
 * - No core combat state is mutated outside NarrativeEngine in this phase
 * - If any error: silently fallback to "no change" behavior and log (add logging in later phases)
 * - Engine state is in-memory/transient, can be reset without risk
 * - Future phases: upgrade to persistence, transactionality, and tight combat integration
 */

// API signatures (TypeScript):
// setRange(key: string, value: number): void
// getRange(key: string): number | undefined
// getSituationalModifiers(actor: { cover: string; isElevated?: boolean; ... }): { modifiers: number; reasons: string[]; }
