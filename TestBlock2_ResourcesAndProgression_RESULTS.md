# Test Block 2: Resources, Health & Progression – RESULTS

## Summary
Automated QA could not execute resource, health, or progression test cases because none of the core MCP tool handlers (`spend_resource`, `restore_resource`, `gain_resource`, `apply_damage`, `award_xp`, `improve_trait`, `get_trait_improvement_cost`) are registered in the MCP dispatcher in [`game-state-server/src/index.ts`](game-state-server/src/index.ts). The only registered tool (`spend_xp`) is not testable in isolation due to missing characters from Block 1.

---

## Test Results

_All 26 tests in this block fail for the same root cause: no handler for the tool in the MCP dispatcher. All attempts result in:_

```
❌ Unknown tool request.
```

---

## Critical Issue

**No operational MCP handlers for any core tool in this block.**
- All resource, damage, and XP progression tests fail/blocked.
- No integration with character/test data from Block 1.

---

## Recommendations

**Implement and register all tool handlers for the tools defined in the toolDescriptions array:**  
- `spend_resource`, `restore_resource`, `gain_resource`, `apply_damage`, `award_xp`, `improve_trait`, `get_trait_improvement_cost`
- Ensure required dependencies on character creation (from Block 1) are satisfied.

**Re-run this QA block once tool handlers are properly connected and test data is available.**