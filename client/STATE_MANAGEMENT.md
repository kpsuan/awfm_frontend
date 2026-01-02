# AWFM Frontend State Management Architecture

**Aligned with:** AWFM Platform Evolution Roadmap v5.0

## Overview

The frontend uses a **two-tier state management approach** as specified in the roadmap:

1. **React Query** - Server state (API data from Django backend)
2. **React Context + useReducer** - UI state (navigation, user selections)

This separation follows best practices and matches the roadmap specification:
- Line 782: `@tanstack/react-query | ^5.0.0 | Server state`
- Line 799: `Frontend state management (Zustand or Context) for notification center`

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                   App.jsx                            │
│  ┌───────────────────────────────────────────────┐  │
│  │  QueryClientProvider (React Query)            │  │
│  │  ┌─────────────────────────────────────────┐  │  │
│  │  │  QuestionnaireProvider (Context)        │  │  │
│  │  │  ┌───────────────────────────────────┐  │  │  │
│  │  │  │   Router & Components             │  │  │  │
│  │  │  └───────────────────────────────────┘  │  │  │
│  │  └─────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

## State Separation

### React Query (Server State)

**Manages:** Data from Django API
**Location:** `src/hooks/useQuestions.js`

**Responsibilities:**
- Fetching questions from Django
- Fetching checkpoints and options
- Fetching PPR patterns
- Caching API responses
- Automatic refetching
- Loading/error states for API calls

**Custom Hooks:**
```javascript
useMainQuestion()      // Fetch main screen question
useQuestions()         // Fetch all questions
useQuestion(id)        // Fetch specific question
useQ1Choices()         // Fetch Checkpoint 1 choices
useQ2Choices()         // Fetch Checkpoint 2 choices
useQ3Choices()         // Fetch Checkpoint 3 choices
usePPRPatterns(id)     // Fetch PPR patterns
```

**Configuration:** `src/lib/queryClient.js`
- Stale time: 5 minutes
- Cache time: 10 minutes
- Retry: 1 attempt
- No refetch on window focus

### React Context (UI State)

**Manages:** Local UI state
**Location:** `src/context/QuestionnaireContext.jsx`

**Responsibilities:**
- Current question/section/checkpoint navigation
- User responses (before saving to server)
- UI loading/error states
- Navigation flow

**State:**
```javascript
{
  currentQuestion: null,
  currentSection: 1,
  currentCheckpoint: 1,
  responses: {},
  loading: false,
  error: null
}
```

**Actions:**
```javascript
setCurrentQuestion(question)
setCurrentSection(sectionId)
setCurrentCheckpoint(checkpointNum)
saveResponse(questionId, value)
clearResponses()
setLoading(loading)
setError(error)
```

## How to Use in Components

### Fetching Server Data (React Query)

```javascript
import { useQ1Choices } from '../hooks';

function CheckpointOne() {
  const { data: choices, isLoading, error } = useQ1Choices();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {choices.map(choice => (
        <ChoiceCard key={choice.id} choice={choice} />
      ))}
    </div>
  );
}
```

### Managing UI State (Context)

```javascript
import { useQuestionnaire } from '../context';

function Navigation() {
  const { state, setCurrentCheckpoint } = useQuestionnaire();

  return (
    <div>
      Current Checkpoint: {state.currentCheckpoint}
      <button onClick={() => setCurrentCheckpoint(2)}>
        Go to Checkpoint 2
      </button>
    </div>
  );
}
```

## Data Flow

### Question Flow

```
1. Component renders
   ↓
2. useQ1Choices() hook called
   ↓
3. React Query checks cache
   ↓
4. If stale/missing → Fetch from Django API
   ↓
5. Transform data (dataTransform.js)
   ↓
6. Cache result
   ↓
7. Return to component
```

### User Selection Flow

```
1. User selects option
   ↓
2. saveResponse(questionId, value)
   ↓
3. Update Context state (local)
   ↓
4. TODO: Persist to Django (mutation)
```

## Files

### React Query
- `src/lib/queryClient.js` - Query client configuration
- `src/hooks/useQuestions.js` - Custom data fetching hooks
- `src/hooks/index.js` - Hooks export

### Context
- `src/context/QuestionnaireContext.jsx` - UI state management
- `src/context/index.js` - Context export

### Integration
- `src/App.jsx` - Providers setup
- `src/services/dataTransform.js` - Django → Frontend data transformation

## Backend Integration

### API Base URL
Set in `.env`:
```
REACT_APP_API_URL=http://localhost:8000/api/v1/content
```

### Data Transformation

Django returns nested data:
```json
{
  "checkpoints": [
    {
      "options": [
        {
          "components": [
            { "component_type": "C1", "component_text": "..." }
          ]
        }
      ]
    }
  ]
}
```

Frontend expects flat structure:
```json
{
  "id": "q1_1",
  "title": "...",
  "description": "...",  // C3
  "whyThisMatters": "...", // C2
}
```

Transformation handled by `src/services/dataTransform.js`

## Future Enhancements (Batch 3+)

Per roadmap Line 799:
- **Batch 3:** State management for notification center
- **Decision:** Zustand or Context (TBD)
- **Current:** Context already in place, can migrate to Zustand if needed

## Roadmap Alignment

✅ **Pre-MVP Stack (Lines 774-785):**
- React 18 ✅
- React Query 5.x ✅
- axios ✅

✅ **Architecture:**
- Server state: React Query
- UI state: Context + useReducer
- Ready for Batch 3 notification center

## Migration from Old Architecture

**Before:**
- Context fetched data on mount
- Mixed server + UI state

**After:**
- React Query fetches data on demand
- Context handles UI state only
- Better caching and performance
- Matches roadmap specification
