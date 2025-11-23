# 📡 API Documentation

## Overview

Sportify integrates with two main APIs:
1. **TheSportsDB API** - Sports data
2. **DummyJSON API** - Authentication (demo)

---

## 🏅 TheSportsDB API

Base URL: `https://www.thesportsdb.com/api/v1/json/3/`

### Endpoints

#### 1. List League Teams
```typescript
GET /search_all_teams.php?l={leagueName}
```

**Parameters:**
- `leagueName` (string) - Name of the league

**Response:**
```json
{
  "teams": [
    {
      "idTeam": "133604",
      "strTeam": "Arsenal",
      "strTeamBadge": "https://...",
      "strStadium": "Emirates Stadium",
      // ... more fields
    }
  ]
}
```

**Usage:**
```typescript
const { data, isLoading } = useListLeagueTeamsQuery('English Premier League');
```

---

#### 2. Search Teams
```typescript
GET /searchteams.php?t={teamName}
```

**Parameters:**
- `teamName` (string) - Team name to search

**Usage:**
```typescript
const { data } = useSearchTeamsQuery('Arsenal');
```

---

#### 3. Lookup Team
```typescript
GET /lookupteam.php?id={teamId}
```

**Parameters:**
- `teamId` (string) - Team ID

**Usage:**
```typescript
const { data } = useLookupTeamQuery('133604');
```

---

#### 4. List Team Events
```typescript
GET /searchevents.php?e={teamName}
```

**Parameters:**
- `teamName` (string) - Team name

**Usage:**
```typescript
const { data } = useListTeamEventsQuery('Arsenal');
```

---

#### 5. Lookup Event
```typescript
GET /lookupevent.php?id={eventId}
```

**Parameters:**
- `eventId` (string) - Event ID

**Usage:**
```typescript
const { data } = useLookupEventQuery('1234567');
```

---

#### 6. List Team Players
```typescript
GET /searchplayers.php?t={teamName}
```

**Parameters:**
- `teamName` (string) - Team name

**Usage:**
```typescript
const { data } = useListTeamPlayersQuery('Arsenal');
```

---

#### 7. Lookup Player
```typescript
GET /lookupplayer.php?id={playerId}
```

**Parameters:**
- `playerId` (string) - Player ID

**Usage:**
```typescript
const { data } = useLookupPlayerQuery('34145937');
```

---

## 🔐 Authentication API

Base URL: `https://dummyjson.com/`

### Login
```typescript
POST /auth/login
```

**Request Body:**
```json
{
  "username": "emilys",
  "password": "emilyspass"
}
```

**Response:**
```json
{
  "id": "1",
  "username": "emilys",
  "email": "emily.johnson@x.dummyjson.com",
  "firstName": "Emily",
  "lastName": "Johnson",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Usage:**
```typescript
const [login, { isLoading }] = useLoginMutation();

const result = await login({ username, password }).unwrap();
```

---

## 💾 Local Storage API

For offline authentication and user management.

### Register User
```typescript
registerLocalUser(user: Omit<LocalUser, 'id'>): Promise<LocalUser>
```

**Example:**
```typescript
const newUser = await registerLocalUser({
  username: 'johndoe',
  email: 'john@example.com',
  password: 'password123',
  firstName: 'John',
  lastName: 'Doe',
});
```

---

### Login User
```typescript
loginLocalUser(username: string, password: string): Promise<LocalUser | null>
```

**Example:**
```typescript
const user = await loginLocalUser('johndoe', 'password123');
```

---

### Get All Users
```typescript
getLocalUsers(): Promise<LocalUser[]>
```

**Example:**
```typescript
const users = await getLocalUsers();
```

---

## 🔄 RTK Query Hooks

All API hooks automatically handle:
- ✅ Loading states
- ✅ Error handling
- ✅ Caching
- ✅ Refetching
- ✅ Optimistic updates

**Example with loading state:**
```typescript
const { data, isLoading, error } = useListLeagueTeamsQuery('Premier League');

if (isLoading) return <LoadingSpinner />;
if (error) return <ErrorMessage />;
return <TeamList teams={data} />;
```

---

## ⚙️ Configuration

### API Keys
Currently using free tier (key: `3`)

For production, get your own API key from:
- [TheSportsDB](https://www.thesportsdb.com/api.php)

### Rate Limiting
- Free tier: 100 requests/minute
- Caching: 60 seconds default

---

## 🚨 Error Handling

```typescript
try {
  const result = await login({ username, password }).unwrap();
  // Success
} catch (error) {
  if ('status' in error) {
    // API error
    console.error(error.status, error.data);
  } else {
    // Network error
    console.error(error.message);
  }
}
```