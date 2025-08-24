# Leaderboard Update: 10-Day Reset System & Total Points Tracking

## New Features Implemented

### 1. **10-Day Leaderboard Reset System**
- Leaderboard now resets every 10 days instead of being cumulative
- Users compete for points within each 10-day period
- Each period starts fresh, encouraging regular participation
- Reset countdown is displayed on both leaderboard and streak pages

### 2. **Total Points Tracking**
- **Current Period Points**: Points earned in the current 10-day period (resets every 10 days)
- **Total Points**: Lifetime points earned across all periods (never resets)
- Points are automatically calculated and added when users complete tests
- Both metrics are displayed prominently on the streak page

### 3. **Enhanced User Experience**
- Real-time score updates during tests
- Visual indicators for days until next reset
- Clear distinction between current period and all-time achievements
- Progress tracking for both short-term and long-term goals

## Database Changes

### New User Model Fields
```javascript
{
  totalPoints: Number,           // Lifetime total points
  currentPeriodPoints: Number,   // Points in current 10-day period
  lastLeaderboardReset: Date     // When the last reset occurred
}
```

### Updated Models
- `userModel.js`: Added new fields for points tracking
- `historyModel.js`: No changes (already tracks individual test scores)
- `streakController.js`: Enhanced to handle points and reset logic
- `leaderboardController.js`: Updated to use current period points
- `historyController.js`: Enhanced to update user points on test completion

## API Changes

### Streak Endpoints
- `GET /api/streak`: Now returns total points, current period points, and days until reset
- `POST /api/streak/update`: Updates points and handles 10-day reset logic

### Leaderboard Endpoints
- `GET /api/leaderboard`: Now returns current period scores and total scores separately
- Includes reset countdown information

### History Endpoints
- `POST /api/history/add`: Now automatically updates user points when tests are completed

## Frontend Changes

### Components Updated
- **Streak Component**: Shows current period points, total points, and reset countdown
- **Leaderboard Page**: Displays both current period and all-time scores
- **Test Page**: Real-time score display with 200-point maximum
- **Result Page**: Enhanced score display with progress indicators

### New UI Elements
- Reset countdown timer on leaderboard and streak pages
- Separate displays for current period vs. all-time points
- Visual indicators for 10-day reset system
- Enhanced score breakdowns and progress bars

## Migration Instructions

### 1. Run Database Migration
```bash
cd server
npm run migrate
```

This will:
- Add new fields to existing users
- Set default values for new fields
- Ensure all users have the required data structure

### 2. Restart Server
```bash
npm run dev
```

### 3. Test the New Features
- Complete a typing test to see points being added
- Check the streak page for total points display
- View the leaderboard to see current period vs. total scores
- Verify the 10-day reset countdown is working

## How It Works

### Point Calculation
1. **Test Completion**: When a user completes a test, points are calculated using the existing formula (70% WPM + 30% Accuracy, capped at 200)
2. **Points Distribution**: Points are added to both `currentPeriodPoints` and `totalPoints`
3. **Reset Logic**: Every 10 days, `currentPeriodPoints` resets to 0, but `totalPoints` continues accumulating

### Leaderboard Ranking
- **Current Period**: Users are ranked by `currentPeriodPoints` (resets every 10 days)
- **All-Time**: Users can see their `totalPoints` for lifetime achievement tracking
- **Reset Schedule**: All users reset together every 10 days from the first user's reset date

### User Experience
- Users see their progress toward the next reset
- Clear distinction between short-term (current period) and long-term (total) achievements
- Motivation to maintain regular participation to stay competitive
- Recognition of both current performance and lifetime dedication

## Benefits

1. **Increased Engagement**: Regular resets encourage consistent participation
2. **Fair Competition**: New users can compete on equal footing every 10 days
3. **Long-term Motivation**: Total points provide a sense of long-term achievement
4. **Clear Goals**: Users have both short-term (10-day) and long-term objectives
5. **Social Competition**: Leaderboard resets create regular competitive cycles

## Technical Notes

- All existing functionality remains intact
- Backward compatible with existing user data
- Automatic migration handles existing users
- Real-time updates maintain responsive user experience
- Error handling ensures graceful degradation if issues occur

## Future Enhancements

- **Seasonal Themes**: Different themes or challenges for each 10-day period
- **Achievement Badges**: Special recognition for consistent high performance
- **Social Features**: Friend challenges and private leaderboards
- **Analytics**: Detailed performance tracking across periods
- **Custom Reset Schedules**: User-configurable reset periods
