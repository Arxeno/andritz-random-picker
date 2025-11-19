# Prize Status Migration Instructions

## Overview
This migration adds a `status` field to the prizes table to track whether a prize has been won or is still available.

## Steps to Migrate

### 1. Push Schema Changes
The schema has been updated in `convex/schema.ts`. Push the changes to your Convex deployment:

```bash
npx convex dev
```

This will automatically update the database schema.

### 2. Run Migration Function
After the schema is deployed, run the migration function to add the `status` field to existing prizes:

```bash
npx convex run prizes:migrateAddStatusToPrizes
```

This will:
- Find all existing prizes without a `status` field
- Set their status to `"available"`
- Return a count of updated prizes

### 3. Verify Migration
Check that all prizes now have a status field:

```bash
npx convex run prizes:listPrizes
```

All prizes should now have `status: "available"` or `status: "won"`.

## What Changed

### Schema Changes
- Added `status` field to prizes table with values `"available"` or `"won"`
- Added index `by_status` for efficient querying of available prizes

### Backend Changes
1. **convex/prizes.ts**
   - `addPrize`: New prizes are created with `status: "available"`
   - `listAvailablePrizes`: New query to fetch only available prizes
   - `migrateAddStatusToPrizes`: Migration function to update existing prizes

2. **convex/winners.ts**
   - `confirmWinner`: Now marks the prize as `"won"` when a winner is confirmed
   - Validates that a prize hasn't already been won before confirming

### Frontend Changes
1. **components/prize-selector.tsx**
   - Now uses `listAvailablePrizes` instead of `listPrizes`
   - Only shows prizes that haven't been won yet

2. **components/prize-table.tsx**
   - Added "Status" column with visual badges
   - Shows "Won" (yellow) or "Available" (green) status for each prize

3. **app/dummy-spin/page.tsx**
   - Tracks prize status in local state
   - Filters to show only available prizes in carousel
   - Marks prizes as won after confirmation
   - Disables spin button when no prizes are available
   - Shows warning message when all prizes have been won

4. **lib/dummy-data.ts**
   - Added `status` field to `DummyPrize` interface
   - All dummy prizes initialized with `status: "available"`

## Behavior After Migration

### Admin Experience
- Prize management page shows status badges for each prize
- Can see at a glance which prizes have been won
- Prize selector only shows available prizes when confirming winners

### Spin Page
- Only available prizes are shown in the prize carousel
- Once a prize is confirmed for a winner, it's marked as "won"
- Cannot select the same prize for multiple winners
- Spin button is disabled when all prizes have been won
- Clear visual feedback when no prizes are available

## Rollback (if needed)
If you need to rollback:
1. The `status` field is optional in queries, so old code will continue to work
2. To remove the field, you would need to:
   - Remove the `status` field from the schema
   - Remove the `by_status` index
   - Revert the code changes
   - Push the schema changes

## Notes
- Existing prizes will be set to "available" by default
- The migration is idempotent - running it multiple times won't cause issues
- Prize status is automatically managed when confirming winners
- No manual status updates are needed in normal operation

