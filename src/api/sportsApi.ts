import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = 'https://www.thesportsdb.com/api/v1/json/3/';

interface Team {
  idTeam: string;
  strTeam: string;
  strTeamBadge?: string; // Keep for backward compatibility
  strBadge: string; // This is the actual field from API
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
}

interface Player {
  idPlayer: string;
  strPlayer: string;
  strThumb: string;
  strPosition: string;
  strTeam: string;
  strDescriptionEN: string;
  dateBorn: string;
}

interface SearchTeamsResponse {
  teams: Team[] | null;
}

interface EventsResponse {
  events: Event[] | null;
}

interface PlayerResponse {
  players: Player[] | null;
}

export const sportsApi = createApi({
  reducerPath: 'sportsApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  endpoints: (builder) => ({
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
      transformResponse: (response: PlayerResponse) => 
        response.players ? response.players[0] : null,
    }),
    lookupEvent: builder.query<Event | null, string>({
      query: (eventId) => `lookupevent.php?id=${eventId}`,
      transformResponse: (response: EventsResponse) => 
        response.events ? response.events[0] : null,
    }),
  }),
});

export const {
  useSearchTeamsQuery,
  useSearchEventsQuery,
  useGetNextEventsQuery,
  useGetLastEventsQuery,
  useLookupPlayerQuery,
  useLookupEventQuery,
} = sportsApi;