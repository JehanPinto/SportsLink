import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = 'https://www.thesportsdb.com/api/v1/json/3/';

export interface Team {
  idTeam: string;
  strTeam: string;
  strTeamBadge?: string;
  strBadge: string;
  strLogo?: string;
  strStadium: string;
  strDescriptionEN: string;
  strLeague: string;
  strLocation?: string;
  intStadiumCapacity?: string;
  strWebsite?: string;
  strFacebook?: string;
  strTwitter?: string;
  strInstagram?: string;
  intFormedYear?: string;
  strKeywords?: string;
  strFanart1?: string;
  strBanner?: string;
}
export interface Team {
  idTeam: string;
  strTeam: string;
  strTeamBadge?: string;
  strBadge: string;
  strLogo?: string;
  strStadium: string;
  strDescriptionEN: string;
  strLeague: string;
  strLocation?: string;
  intStadiumCapacity?: string;
  strWebsite?: string;
  strFacebook?: string;
  strTwitter?: string;
  strInstagram?: string;
  intFormedYear?: string;
  strKeywords?: string;
  strFanart1?: string;
  strBanner?: string;
}

interface Event {
  idEvent: string;
  strEvent: string;
  strHomeTeam: string;
  strAwayTeam: string;
  intHomeScore: string | null;
  intAwayScore: string | null;
  dateEvent: string;
  strThumb: string;
  strStatus: string;
  strVenue?: string;
  strLeague?: string;
  strSeason?: string;
  intRound?: string;
  strHomeGoalDetails?: string;
  strAwayGoalDetails?: string;
  strHomeLineupGoalkeeper?: string;
  strHomeLineupDefense?: string;
  strHomeLineupMidfield?: string;
  strHomeLineupForward?: string;
  strAwayLineupGoalkeeper?: string;
  strAwayLineupDefense?: string;
  strAwayLineupMidfield?: string;
  strAwayLineupForward?: string;
}

interface Event {
  idEvent: string;
  strEvent: string;
  strHomeTeam: string;
  strAwayTeam: string;
  intHomeScore: string | null;
  intAwayScore: string | null;
  dateEvent: string;
  strThumb: string;
  strStatus: string;
}

interface Player {
  idPlayer: string;
  idTeam: string;
  strPlayer: string;
  strTeam: string;
  strThumb?: string;
  strCutout?: string;
  strPosition?: string;
  strNationality?: string;
  dateBorn?: string;
  strBirthLocation?: string;
  strHeight?: string;
  strWeight?: string;
  strNumber?: string;
  strDescriptionEN?: string;
  strSigning?: string;
  strWage?: string;
  strFacebook?: string;
  strTwitter?: string;
  strInstagram?: string;
  strStatus?: string;
  strGender?: string;
  strSport?: string;
}

interface SearchTeamsResponse {
  teams: Team[] | null;
}

interface TeamsListResponse {
  teams: Team[] | null;
}

interface EventsResponse {
  events: Event[] | null;
}

interface PlayersResponse {
  player: Player[] | null;  // API returns 'player' not 'players'
}

interface PlayerResponse {
  players: Player[] | null;  // For single player lookup
}

export const sportsApi = createApi({
  reducerPath: 'sportsApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  endpoints: (builder) => ({
    // NEW: list all teams in a given league
    listLeagueTeams: builder.query<Team[], string>({
      query: (leagueName) =>
        `search_all_teams.php?l=${encodeURIComponent(leagueName)}`,
      transformResponse: (response: TeamsListResponse) =>
        response.teams || [],
    }),
    searchTeams: builder.query<Team[], string>({
      query: (teamName) => `searchteams.php?t=${teamName}`,
      transformResponse: (response: SearchTeamsResponse) => response.teams || [],
    }),
    searchEvents: builder.query<Event[], string>({
      query: (eventName) => `searchevents.php?e=${eventName}`,
      transformResponse: (response: EventsResponse) => response.events || [],
    }),
    getNextEvents: builder.query<Event[], string>({
      query: (teamId) => `eventsnext.php?id=${teamId}`,
      transformResponse: (response: EventsResponse) => response.events || [],
    }),
    getLastEvents: builder.query<Event[], string>({
      query: (teamId) => `eventslast.php?id=${teamId}`,
      transformResponse: (response: EventsResponse) => response.events || [],
    }),
    lookupPlayer: builder.query<Player | null, string>({
      query: (playerId) => `lookupplayer.php?id=${playerId}`,
      transformResponse: (response: PlayerResponse) => {
        console.log('Lookup Player Response:', response); // Debug log
        return response.players ? response.players[0] : null;
      },
    }),
    lookupEvent: builder.query<Event | null, string>({
      query: (eventId) => `lookupevent.php?id=${eventId}`,
      transformResponse: (response: EventsResponse) => 
        response.events ? response.events[0] : null,
    }),
    searchPlayers: builder.query<Player[], string>({
      query: (teamName) => `searchplayers.php?t=${encodeURIComponent(teamName)}`,
      transformResponse: (response: PlayersResponse) => {
        console.log('Search Players Response:', response); // Debug log
        return response.player || [];  // Changed from response.players
      },
    }),
  }),
});

export const {
  useListLeagueTeamsQuery,
  useSearchTeamsQuery,
  useSearchEventsQuery,
  useGetNextEventsQuery,
  useGetLastEventsQuery,
  useLookupPlayerQuery,
  useLookupEventQuery,
  useSearchPlayersQuery,
} = sportsApi;
