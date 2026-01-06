# FeedbackModal Flow Documentation

## Overview
The FeedbackModal asks users "How likely are you to recommend us?" with emoji ratings (1-5) and an optional comment field.

## When the Modal Shows

### When Leaving to Dashboard (from TeamRecordings)
The feedback modal shows **only once** when the user clicks the back button in TeamRecordings to navigate to the dashboard.

Location: `src/components/pages/TeamRecordings/TeamRecordings.jsx` (lines 736-751)

**Why this approach?**
- Users complete multiple actions during a session (recordings, viewing team content, etc.)
- Showing feedback mid-flow is disruptive
- Asking when they're leaving captures their full experience

## Behavior

### Skip vs Submit
- **Skip**: Does NOT mark feedback as submitted - modal will show again next session
- **Submit**: Marks feedback as submitted in localStorage - modal won't show again

### localStorage Key
```
awfm_feedback_submitted = 'true' | null
```

### Helper Functions
```javascript
import { hasFeedbackBeenSubmitted, markFeedbackSubmitted } from './FeedbackModal';

// Check if user has submitted feedback
hasFeedbackBeenSubmitted() // returns boolean

// Mark feedback as submitted (called automatically on submit)
markFeedbackSubmitted()
```

## Testing
To reset and test the modal again:
```javascript
localStorage.removeItem('awfm_feedback_submitted')
```

## Files
- `src/components/common/Modal/FeedbackModal.jsx` - The modal component
- `src/components/common/Modal/FeedbackModal.css` - Styles
- `src/components/pages/TeamRecordings/TeamRecordings.jsx` - Where the modal is used
