# 🏆 Sportify

A modern React Native sports application built with Expo, featuring real-time sports data, team information, and user authentication.

![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)
![Redux](https://img.shields.io/badge/Redux-593D88?style=for-the-badge&logo=redux&logoColor=white)

---

## 📱 Screenshots

> Add screenshots here after deployment

---

## ✨ Features

### 🔐 Authentication
- **Dual Login System**: Support for both API-based and local authentication
- **User Registration**: Create account with validation
- **Secure Storage**: Local user data stored with AsyncStorage
- **Profile Management**: View and edit user profile
- **Theme Toggle**: Dark/Light mode support

### 🏅 Sports Features
- **Live Sports Data**: Real-time data from TheSportsDB API
- **Team Information**: Detailed team profiles, stats, and history
- **League Browsing**: Browse teams by league
- **Event Tracking**: View upcoming and past events
- **Player Profiles**: Detailed player information
- **Search Functionality**: Search teams, players, and events
- **Favorites**: Save favorite teams and players

### 🎨 UI/UX
- **Modern Design**: Clean, intuitive interface
- **Responsive Layout**: Optimized for all screen sizes
- **Smooth Animations**: React Native Reanimated
- **Custom Components**: Reusable UI components
- **Loading States**: Skeleton loaders for better UX
- **Error Handling**: User-friendly error messages

---

## 🛠️ Tech Stack

### Core
- **React Native** - Mobile framework
- **Expo** - Development platform
- **TypeScript** - Type safety

### State Management
- **Redux Toolkit** - State management
- **RTK Query** - API data fetching & caching

### Navigation
- **React Navigation** - Navigation library
- **Stack Navigator** - Screen navigation
- **Bottom Tabs** - Tab-based navigation

### UI & Styling
- **React Native Reanimated** - Animations
- **Expo Linear Gradient** - Gradient backgrounds
- **Custom Theme System** - Dark/Light mode

### Form Handling
- **React Hook Form** - Form management
- **Yup** - Schema validation

### Storage
- **AsyncStorage** - Local data persistence

### API
- **TheSportsDB API** - Sports data
- **DummyJSON API** - Authentication (demo)

---

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (Mac) or Android Emulator

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/sportify.git
   cd sportify
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Start the development server**
   ```bash
   npx expo start
   ```

4. **Run on device/emulator**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app on physical device

---

## 🚀 Usage

### Login
Use one of these methods:

**Option 1: API Login (DummyJSON)**
- Username: `emilys`
- Password: `emilyspass`

**Option 2: Local Registration**
- Create a new account via Register screen
- Data stored locally on device

### Explore Sports Data
1. Browse leagues on Home screen
2. Search for teams, players, events
3. View detailed team/player profiles
4. Add favorites for quick access

---

## 📁 Project Structure

```
Sportify/
├── src/
│   ├── api/                  # RTK Query API definitions
│   │   ├── authApi.ts
│   │   └── sportsApi.ts
│   ├── app/                  # Redux store configuration
│   │   └── store.ts
│   ├── components/           # Reusable components
│   │   ├── common/
│   │   └── sports/
│   ├── context/              # React Context (Theme)
│   │   └── ThemeContext.tsx
│   ├── features/             # Feature-based modules
│   │   ├── auth/
│   │   ├── home/
│   │   ├── profile/
│   │   └── sports/
│   ├── navigation/           # Navigation configuration
│   │   ├── AppNavigator.tsx
│   │   └── types.ts
│   ├── types/                # TypeScript types
│   └── utils/                # Utility functions
│       └── localAuthStorage.ts
├── __tests__/                # Test files
├── assets/                   # Images, fonts
├── App.tsx                   # Entry point
├── package.json
└── tsconfig.json
```

---

## 🧪 Testing

### Run Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Generate Coverage Report
```bash
npm run test:coverage
```

### Test Coverage
- **Redux Slices**: 100%
- **Utilities**: 100%
- **Business Logic**: 95%+

---

## 🎨 Theming

The app supports both light and dark themes:

```typescript
// Toggle theme
const { theme, isDark, toggleTheme } = useTheme();

// Use theme colors
<View style={{ backgroundColor: theme.colors.background }}>
  <Text style={{ color: theme.colors.text }}>Hello</Text>
</View>
```

---

## 🔌 API Integration

### TheSportsDB API
```typescript
import { useListLeagueTeamsQuery } from './api/sportsApi';

const { data: teams, isLoading } = useListLeagueTeamsQuery('English Premier League');
```

### Custom Endpoints
- `listLeagueTeams` - Get teams by league
- `searchTeams` - Search teams
- `lookupTeam` - Get team details
- `listTeamEvents` - Get team events
- `lookupEvent` - Get event details
- `listTeamPlayers` - Get team players
- `lookupPlayer` - Get player details

---

## 🐛 Known Issues

- UI component tests skipped due to React Native testing complexity
- Some lint warnings for unused variables in development
- Peer dependency warnings (use `--legacy-peer-deps`)

---

## 🔮 Future Enhancements

- [ ] Push notifications for live scores
- [ ] Social features (share, comments)
- [ ] Offline mode with cached data
- [ ] Video highlights integration
- [ ] Live score updates
- [ ] Betting odds integration
- [ ] Multi-language support
- [ ] Accessibility improvements

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your Name](https://linkedin.com/in/yourname)
- Portfolio: [yourportfolio.com](https://yourportfolio.com)

---

## 🙏 Acknowledgments

- [TheSportsDB](https://www.thesportsdb.com/) - Sports data API
- [DummyJSON](https://dummyjson.com/) - Mock authentication API
- [Expo](https://expo.dev/) - Development platform
- [React Navigation](https://reactnavigation.org/) - Navigation library

---

## 📞 Support

For support, email your.email@example.com or open an issue on GitHub.

---

<div align="center">
  <p>Made with ❤️ and React Native</p>
  <p>⭐ Star this repo if you found it helpful!</p>
</div>