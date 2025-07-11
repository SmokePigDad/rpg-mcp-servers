# Debug Report: Test Failures and Anomalies (Based on [`test-results.md`](test-results.md:1))

---

## 1. Character & Antagonist Lifecycle

### 1.1. Splat-Specific Trait Update Failures

- **Observed Failure:**  
  Updates to splat-specific character traits (e.g., Humanity) produced `"no such column"` schema errors. Regular (basic) field updates worked.

- **Root Cause Analysis:**  
  - Code attempting to update splat-specific traits (e.g., `humanity`, `path_rating`), but corresponding database columns are missing or misnamed in the character schema.
  - Schema migrations likely did not include all splat variants.  
  - Trait update logic does not dynamically handle splat-specific columns and does not fail gracefully.

- **Contributing Factors:**  
  - Partial or incomplete character table schema.
  - Lack of unified approach for splat traits (e.g., Vampire has `humanity`, Werewolf has `rage`).
  - Insufficient pre-update trait/schema validation.

- **Recommendations:**  
  - Audit and update DB schema to include columns for all supported splat-specific traits.
  - Add runtime trait-to-column mapping and validation.
  - Improve migration scripts to cover all splat requirements.
  - Add test coverage for all trait types across splats.

---

### 1.2. Antagonist Removal Foreign Key Constraint Error

- **Observed Failure:**  
  `remove_antagonist` failed with a foreign key constraint error.

- **Root Cause Analysis:**  
  - Attempted deletion of antagonist with dependent or referencing records (e.g., combat logs, scene participation, items, or other relations).
  - The foreign key constraint was not handled (e.g., missing `ON DELETE CASCADE` in relevant tables).
  - Application logic does not pre-check for or handle existing dependencies.

- **Contributing Factors:**  
  - Missing referential logic to safely remove antagonists.
  - Other tables/entities reference antagonists directly.
  - Incomplete backend error catching/handling.

- **Recommendations:**  
  - Audit database relations on antagonist tables.
  - Add proper cascade or restrict/delete handling in schema and logic.
  - Application should check for dependencies and reject with a clear, custom error if blocking references exist.
  - Add documentation and recovery steps for failed deletes.

---

## 2. State Management

### 2.1. Health & Damage System: Complete Failure

- **Observed Failures:**
  - All health/damage (`apply_damage`) operations had no effect; state unmodified.
  - Lethal damage tests failed with a serialization error: `"Unexpected token '/', '//' is not valid JSON"`.

- **Root Cause Analysis:**  
  - MCP backend failed to serialize/deserialize health state due to invalid JSON (probably using non-JSON-compliant health state strings, e.g. `//` to represent bashing).
  - Health/damage logic may store state in string format that isn't sanitized or valid JSON, breaking compatibility with tool protocols.
  - Because initial health updates failed, all follow-on damage/overflow/agg tests were untestable.

- **Contributing Factors:**  
  - Health/damage tracker relies on legacy or proprietary encoding instead of standardized JSON or denormalized schema.
  - Test suite did not anticipate serialization errors at this stage ("happy path" not robust).
  - No automated fallback when serialization fails.

- **Recommendations:**  
  - Refactor health/damage system to use standardized, valid JSON schema for state.
  - Add robust serialization/deserialization validation in backend and handler code.
  - Update tests to assert valid JSON at all stages.
  - Document expected health track format and enforce it across tooling.

---

### 2.2. Resource Gain (Blood Pool): Column Not Found

- **Observed Failure:**  
  `gain_resource` failed for blood pool: `"no such column: blood_pool"` and `"blood_pool_current"`.

- **Root Cause Analysis:**  
  - The resource gain logic addressed the wrong or missing column, especially for splat-specific resources like blood.
  - Schema and naming conventions for resources are inconsistent.
  - The gain_resource tool lacks mapping for splat-unique resource names.

- **Contributing Factors:**  
  - Lack of enforced schema for blood pool vs. willpower resources.
  - Hardcoded or splat-agnostic resource update routines.
  - No automated fallback/mapping for missing columns.

- **Recommendations:**  
  - Enforce resource column presence in DB schema for all supported splats.
  - Refactor logic to use configurable mapping for each splat's resources.
  - Add defensive coding to return a splat-appropriate error if resource is missing.
  - Expand DB migrations/documentation for all resource fields.

---

### 2.3. Experience & Progression: Insufficient XP Not Handled Properly

- **Observed Failure:**  
  - Attempting to improve a trait with insufficient XP only generated a missing trait error, not an explicit XP error.

- **Root Cause Analysis:**  
  - Backend logic prioritizes trait existence over XP check, so XP validation may never be reached unless the trait is valid.
  - Test could not exercise the "insufficient XP" path except by removing the trait, which produced a misleading error.

- **Contributing Factors:**  
  - Trait and XP validation paths are incorrectly ordered.
  - No explicit XP-insufficiency test/catch in trait improvement flow.
  - Test coverage does not probe for various negative progression scenarios.

- **Recommendations:**  
  - Adjust logic to validate XP before other error conditions where reasonable.
  - Add explicit XP-insufficient errors and documentation.
  - Expand negative-case test coverage for trait and XP progression.

---

## 3. Inventory, World State, Initiative

### 3.1. Inventory: Update Allows Nonexistent Item IDs

- **Observed Failure:**  
  `update_item` accepted and reported success when given a nonexistent item_id.

- **Root Cause Analysis:**  
  - Update logic does not confirm the target item exists for given ID before returning a success response.
  - DB update statement executes but finds 0 rows (`UPDATE ... WHERE id=999`), but handler always reports success.

- **Contributing Factors:**  
  - Lack of proper row-count check or error throw for missing items.
  - API handler surface area inconsistent with DB reality.
  - Insufficient negative test coverage for bad item IDs.

- **Recommendations:**  
  - Application logic must check affected rows and return error when updating nonexistent items.
  - Add negative test cases and assertion checks for all update flows.
  - Document expected error structure for missing resources.

---

### 3.2. Story Progression & Initiative: Schema/Migration Failures

- **Observed Failures:**  
  - `save_story_progress` → error for missing column (`last_updated`).
  - `set_initiative` → error for missing table (`main.antagonists`).
  - All subsequent initiative and turn-related functions untestable due to prior error.

- **Root Cause Analysis:**  
  - Schema migration scripts failed to create or update all required columns/tables.
  - Application assumes presence of `last_updated` field and `antagonists` table, but production DB is missing them.
  - Tool handlers do not check for schema presence at startup or before operation, so failures are detected only on usage.

- **Contributing Factors:**  
  - Incomplete or out-of-sync migration scripts.
  - Lack of post-migration verification/tests.
  - No schema validation on tool startup.

- **Recommendations:**  
  - Audit/create migration to add missing columns (e.g., `last_updated` to `story_progress`) and missing tables (`antagonists`).
  - Implement schema validation step at application/service startup, with reporting.
  - Add automated migration/version check to CI/CD pipeline.
  - Ensure regression tests for all core schema-dependent operations.

---

## 4. Miscellaneous

- **Health/Damage logic** was marked "blocked" in all later tests, indicating that one core failed component prevented broad functional regression testing.  
- Most negative-case validations work (e.g., add item to bad character ID), but positive/negative error detection is inconsistent.

---

## Global Recommendations

1. **Comprehensive Schema Audit & Migration**  
   - Compare all handler/feature requirements to current schema.
   - Write migrations adding columns, tables, and constraints needed for full test plan coverage.
   - Apply and verify migrations, version lock DB schema with tooling.

2. **Improve Test Coverage**  
   - Augment tests to probe more negative/edge cases (bad IDs, schema faults, invalid states).
   - Add explicit assertions for each failure case, not just success flow.

3. **Error Handling & Reporting**  
   - Standardize error handling for missing DB elements and business logic faults.
   - Always surface errors clearly in API/tool output, including missing resources and schema faults.

4. **Backend Refactoring for Robustness**  
   - Refactor core modules (health, resources, inventory, progression, and initiative) for defensive design: schema checks, graceful fallback, meaningful error returns.
   - Use schema-driven or configuration-driven mappings for splat/resource names, damage state, trait logic.

5. **Documentation and Onboarding**  
   - Update documentation (setup, migrations, API error codes, test result interpretation) to cover these failure modes and required resolutions.

---

### End of Debug Report