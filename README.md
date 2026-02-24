# AgentDeck 📱

A React Native mobile companion app for the [Project Management MVP](https://app.projectmanagementmvp.com) website.

![Synthpunk Theme](https://img.shields.io/badge/Theme-Synthpunk-00ffcc?style=flat-square)
![React Native](https://img.shields.io/badge/React%20Native-Expo-ff00ff?style=flat-square)
![Supabase](https://img.shields.io/badge/Database-Supabase-3ecf8e?style=flat-square)

## Features ✨

- **Projects Management** - View and manage all your projects
- **Boards & Swimlanes** - Kanban-style task organization
- **Task CRUD** - Create, read, update, and delete tasks
- **Drag & Drop** - Reorder tasks within swimlanes
- **Premium Tasks** - Mark tasks as premium/priority
- **Image Attachments** - Upload images to tasks
- **Comments** - Add and view comments on tasks
- **Synthpunk Theme** - Cyberpunk aesthetic with neon accents

## Tech Stack 🛠️

- **Framework**: React Native with Expo
- **Navigation**: React Navigation (Stack + Bottom Tabs)
- **Database**: Supabase (same backend as web)
- **Animations**: React Native Reanimated
- **Drag & Drop**: react-native-draggable-flatlist
- **Image Picker**: expo-image-picker

## Design System 🎨

The app uses the **Synthpunk** design system:

- **Primary**: Neon Cyan `#00ffcc`
- **Secondary**: Hot Magenta `#ff00ff`
- **Background**: Pure Black `#000000`
- **Font**: JetBrains Mono (monospace)

## Getting Started 🚀

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI
- iOS Simulator (Mac) or Android Emulator

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/adamhollisterbot/agentdeck.git
   cd agentdeck
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file with Supabase credentials:
   ```
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```

4. Start the development server:
   ```bash
   npx expo start
   ```

5. Run on your preferred platform:
   - Press `i` for iOS Simulator
   - Press `a` for Android Emulator
   - Scan QR code with Expo Go app

## Project Structure 📁

```
src/
├── components/     # Reusable UI components
├── screens/        # Screen components
├── navigation/     # Navigation configuration
├── services/       # API services (Supabase)
├── lib/            # Supabase client
├── theme/          # Colors and styling
├── types/          # TypeScript types
└── hooks/          # Custom hooks
```

## Database Schema 📊

Uses the same Supabase database as the PM MVP website:

- `projects` - Project entities
- `boards` - Boards within projects
- `swimlanes` - Kanban columns within boards
- `tasks` - Task cards
- `comments` - Task comments

## Related Projects 🔗

- [Project Management MVP](https://github.com/adamhollisterbot/project-management-mvp) - Web version
- [Synthpunk Design System](https://github.com/adamhollisterbot/design-system) - UI theme

## License 📄

MIT

---

Built with 💜 and ⚡ by OpenClaw
