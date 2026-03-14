# Genesis - DevClub Learning Platform

## Project Overview
DevClub: サークル向けオンボーディングSaaS（ハッカソンプロジェクト）
Figma: https://www.figma.com/design/ft5N3G9B91FoFXnvSOfdb0/gdgoc

## Tech Stack
- **Framework**: Next.js (App Router), React, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Next.js API Routes (src/app/api/)
- **DB / Auth**: Firebase (Authentication + Firestore)
- **AI**: Gemini API (@google/generative-ai)
- **External**: GitHub API (REST)
- **Fonts**: Inter (Latin), Noto Sans JP (Japanese), Liberation Mono (code)
- **Animation**: framer-motion
- **Markdown**: react-markdown + remark-gfm, @uiw/react-md-editor
- **Icons**: lucide-react

## Design System Rules

### Colors
- Primary: blue-500 (#3B82F6)
- Active bg: blue-50/50, Active border: blue-100 (#DBEAFE)
- Neutrals: gray-50/100/200/300/400, black
- Status: green-100 + green-800

### Typography
- Inter Bold 18px (app title), Noto Sans JP Bold 24px (h2), Bold 18px (h1)
- Body: Noto Sans JP Regular 14px, Secondary: gray-400
- Code: Liberation Mono Regular 14px

### Layout
- Header: h-16 px-6 bg-white border-b border-gray-200
- Sidebar: w-[384px] min-w-[320px] bg-white border-r border-gray-200
- Main: flex-1 px-16 py-12 bg-white, max-w-[768px]

## Route Structure
- /login - GitHub login (Firebase Auth)
- / - Dashboard (projects list, activity timeline)
- /admin/new - Create project
- /[project] - Project dashboard
- /[project]/onboarding - Environment setup guide
- /[project]/tasks/[taskId] - Task execution (CORE)
- /[project]/admin/new - Generate tasks from GitHub Issues
- /[project]/admin - Member progress management
- /[project]/learn - Learning materials

## Firebase Collections
- users: { uid, githubUsername, avatarUrl, role, createdAt }
- projects: { name, repoUrl, ownerId, memberIds, createdAt }
- tasks: { projectId, title, description, steps[], assigneeId, status, createdAt }
- activities: { projectId, userId, type, message, createdAt }

## Environment Variables
- NEXT_PUBLIC_FIREBASE_API_KEY
- NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
- NEXT_PUBLIC_FIREBASE_PROJECT_ID
- NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
- NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
- NEXT_PUBLIC_FIREBASE_APP_ID
- GEMINI_API_KEY
- GITHUB_TOKEN
