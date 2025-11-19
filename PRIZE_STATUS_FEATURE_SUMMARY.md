# Prize Status Feature - Implementation Summary

## Feature Overview
Added a comprehensive prize status tracking system that prevents prizes from being awarded multiple times. Each prize now has a status of either "available" or "won", and the system automatically manages this status throughout the application.

## Key Features

### 1. **Prize Status Tracking**
- Each prize has a `status` field: `"available"` or `"won"`
- Status is automatically updated when a winner is confirmed
- Database index for efficient querying of available prizes

### 2. **Automatic Status Management**
- New prizes are created with `status: "available"`
- When a winner is confirmed with a prize, the prize is marked as `"won"`
- Validation prevents assigning already-won prizes to new winners

### 3. **Visual Indicators**
- **Prize Management Page**: Status badges show which prizes are available (green) or won (yellow)
- **Prize Selector**: Only displays available prizes
- **Spin Page**: Shows only available prizes in the carousel
- **Warning Messages**: Clear feedback when no prizes are available

### 4. **Smart UI Behavior**
- Spin button is disabled when all prizes have been won
- Prize carousel only shows available prizes
- Empty state message when no prizes are available
- Prize count updates to show only available prizes

## Files Modified

### Backend (Convex)

#### `convex/schema.ts`
- Added `status` field to prizes table
- Added `by_status` index for efficient queries

#### `convex/prizes.ts`
- **`addPrize`**: Sets `status: "available"` for new prizes
- **`listAvailablePrizes`**: New query to fetch only available prizes
- **`migrateAddStatusToPrizes`**: Migration function for existing prizes

#### `convex/winners.ts`
- **`confirmWinner`**: 
  - Validates prize hasn't been won
  - Marks prize as `"won"` when winner is confirmed
  - Throws error if trying to assign an already-won prize

### Frontend (React/Next.js)

#### `components/prize-selector.tsx`
- Changed to use `listAvailablePrizes` query
- Only shows prizes that haven't been won

#### `components/prize-table.tsx`
- Added "Status" column to prize table
- Visual badges with icons:
  - 🏆 "Won" - Yellow badge for won prizes
  - ✓ "Available" - Green badge for available prizes

#### `app/dummy-spin/page.tsx`
- Tracks prize status in local state
- Filters prizes to show only available ones
- Marks prizes as won after confirmation
- Disables spin button when no prizes available
- Shows warning card when all prizes are won
- Updates prize count to show available prizes only

#### `lib/dummy-data.ts`
- Added `status` field to `DummyPrize` interface
- All dummy prizes initialized with `status: "available"`

## User Experience Improvements

### For Admins
1. **Clear Visibility**: Can see at a glance which prizes have been won
2. **Prevented Errors**: Cannot accidentally assign the same prize twice
3. **Better Planning**: Know how many prizes are still available

### For Spin Operations
1. **No Duplicate Awards**: System prevents assigning won prizes
2. **Clear Feedback**: Visual indicators show prize availability
3. **Automatic Management**: No manual tracking needed
4. **Graceful Handling**: Clear messages when prizes run out

## Migration Required

To use this feature with existing data:

```bash
# 1. Deploy the schema changes
npx convex dev

# 2. Run the migration to update existing prizes
npx convex run prizes:migrateAddStatusToPrizes
```

See `MIGRATION_INSTRUCTIONS.md` for detailed migration steps.

## Technical Details

### Database Schema
```typescript
prizes: defineTable({
  name: v.string(),
  imageStorageId: v.optional(v.id("_storage")),
  status: v.union(v.literal("available"), v.literal("won")),
}).index("by_status", ["status"])
```

### Status Flow
1. **Prize Created** → `status: "available"`
2. **Winner Confirmed with Prize** → `status: "won"`
3. **Prize Selector** → Only shows `status: "available"` prizes
4. **Validation** → Prevents confirming winner with `status: "won"` prize

### Error Handling
- Throws error if trying to confirm winner with already-won prize
- Validates prize exists before marking as won
- Graceful UI degradation when no prizes available

## Testing Recommendations

1. **Test Prize Creation**: Verify new prizes have `status: "available"`
2. **Test Winner Confirmation**: Verify prize status changes to `"won"`
3. **Test Prize Selector**: Verify only available prizes are shown
4. **Test Duplicate Prevention**: Try to assign same prize twice
5. **Test Empty State**: Confirm all prizes and verify UI behavior
6. **Test Migration**: Run migration on test data

## Future Enhancements (Optional)

1. **Prize Reset**: Add ability to reset a prize back to "available"
2. **Prize History**: Track which winner received which prize
3. **Prize Analytics**: Show statistics on prize distribution
4. **Bulk Operations**: Mark multiple prizes as available/won
5. **Prize Reservation**: Temporarily reserve prizes during spin

## Notes

- Migration is idempotent (safe to run multiple times)
- Existing code continues to work during migration
- Status is automatically managed - no manual updates needed
- Feature works in both production and dummy/development modes

