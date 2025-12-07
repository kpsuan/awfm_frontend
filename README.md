# AWFM Questionnaire

Advance Care Planning questionnaire application built with MERN stack.

## Quick Start

```bash
cd C:\Users\fran\Projects\awfm-questionnaire
npm run install-all
npm run dev
```

This starts:
- React frontend on http://localhost:3000
- Express backend on http://localhost:5000

## Project Structure

```
awfm-questionnaire/
├── client/                    # React frontend
│   └── src/
│       ├── components/
│       │   ├── common/        # Button, Card, Icons, Navigation, Avatar
│       │   ├── features/      # Choices, Team components
│       │   ├── layout/        # TwoColumnLayout, QuestionPanel, ContentPanel
│       │   └── pages/         # QuestionIntro, CheckpointSelection, ChoiceReview
│       ├── context/           # QuestionnaireContext
│       ├── services/          # API services
│       └── styles/            # CSS variables & globals
└── server/                    # Express backend
    ├── data/                  # Mock data JSON
    └── routes/                # API routes
```

## API Endpoints

- `GET /api/questions` - Get all questions
- `GET /api/checkpoints` - Get all checkpoints  
- `POST /api/responses` - Save response
- `GET /api/users/team` - Get team members
