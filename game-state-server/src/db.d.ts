interface EncounterParticipant {
    id: number;
    encounter_id: number;
    participant_type: 'character' | 'npc';
    participant_id: number;
    initiative: number;
    initiative_order?: number | null;
    has_acted: boolean;
    conditions?: string | null;
    is_active: boolean;
    name: string;
    current_hp: number;
    max_hp: number;
}
interface Quest {
    id: number;
    title: string;
    description: string;
    objectives: string;
    rewards: string;
    created_at: string;
}
interface CharacterQuest {
    id: number;
    character_id: number;
    quest_id: number;
    status: 'active' | 'completed' | 'failed';
    progress?: string | null;
    assigned_at: string;
    updated_at: string;
    title?: string;
    description?: string;
    objectives?: string;
    rewards?: string;
}
export declare class GameDatabase {
    private db;
    constructor();
    private initializeSchema;
    createCharacter(data: {
        name: string;
        class: string;
        strength?: number;
        dexterity?: number;
        constitution?: number;
        intelligence?: number;
        wisdom?: number;
        charisma?: number;
    }): unknown;
    getCharacter(id: number): unknown;
    getCharacterByName(name: string): unknown;
    listCharacters(): unknown[];
    updateCharacter(id: number, updates: Record<string, any>): unknown;
    addItem(characterId: number, item: {
        name: string;
        type: string;
        quantity?: number;
        properties?: Record<string, any>;
    }): {
        name: string;
        type: string;
        quantity?: number;
        properties?: Record<string, any>;
        id: number | bigint;
    };
    getInventory(characterId: number): any[];
    updateItem(id: number, updates: {
        quantity?: number;
        equipped?: boolean;
    }): void;
    removeItem(id: number): void;
    saveStoryProgress(characterId: number, data: {
        chapter: string;
        scene: string;
        description?: string;
        flags?: Record<string, any>;
    }): void;
    getLatestStoryProgress(characterId: number): any;
    saveWorldState(characterId: number, data: {
        location: string;
        npcs?: Record<string, any>;
        events?: Record<string, any>;
        environment?: Record<string, any>;
    }): void;
    getWorldState(characterId: number): any;
    logCombat(characterId: number, sessionId: string, action: string, result?: string): void;
    getCombatLog(characterId: number, sessionId?: string): unknown[];
    createNPC(data: {
        name: string;
        template?: string;
        type?: string;
        customStats?: Record<string, any>;
    }): any;
    createNPCGroup(template: string, count: number, namePrefix?: string): any[];
    getNPC(id: number): any;
    listNPCs(type?: string, aliveOnly?: boolean): any[];
    updateNPC(id: number, updates: Record<string, any>): any;
    removeNPC(id: number): void;
    createEncounter(data: {
        character_id: number;
        name: string;
        description?: string;
        environment?: string;
    }): unknown;
    getEncounter(id: number): unknown;
    getActiveEncounter(characterId: number): unknown;
    addEncounterParticipant(encounterId: number, type: string, participantId: number, initiative: number): void;
    updateInitiativeOrder(encounterId: number): void;
    getEncounterParticipants(encounterId: number): EncounterParticipant[];
    nextTurn(encounterId: number): EncounterParticipant | null | undefined;
    endEncounter(id: number, outcome?: string): void;
    applyDamage(targetType: string, targetId: number, damage: number): any;
    addQuest(data: {
        title: string;
        description: string;
        objectives: Record<string, any>[] | string[];
        rewards: Record<string, any>;
    }): Quest | null;
    getQuestById(id: number): Quest | null;
    assignQuestToCharacter(characterId: number, questId: number, status?: 'active' | 'completed' | 'failed'): CharacterQuest | null;
    getCharacterQuestById(characterQuestId: number): CharacterQuest | null;
    getCharacterActiveQuests(characterId: number): CharacterQuest[];
    updateCharacterQuestStatus(characterQuestId: number, status: 'active' | 'completed' | 'failed', progress?: Record<string, any> | null): CharacterQuest | null;
    close(): void;
}
export {};
//# sourceMappingURL=db.d.ts.map