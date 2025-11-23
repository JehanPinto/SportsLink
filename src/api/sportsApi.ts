import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = 'https://www.thesportsdb.com/api/v1/json/3/';

// Team Interface
export interface TeamData {
  idTeam: string;
  strTeam: string;
  strTeamShort?: string;
  strAlternate?: string;
  intFormedYear?: string;
  strSport?: string;
  strLeague?: string;
  idLeague?: string;
  strDivision?: string;
  strManager?: string;
  strStadium?: string;
  strStadiumThumb?: string;
  strStadiumDescription?: string;
  strStadiumLocation?: string;
  intStadiumCapacity?: string;
  strWebsite?: string;
  strFacebook?: string;
  strTwitter?: string;
  strInstagram?: string;
  strDescriptionEN?: string;
  strTeamBadge?: string;
  strTeamJersey?: string;
  strTeamLogo?: string;
  strCountry?: string;
}

// Event Interface
export interface EventData {
  idEvent: string;
  strEvent?: string;
  strEventAlternate?: string;
  strFilename?: string;
  strSport?: string;
  idLeague?: string;
  strLeague?: string;
  strSeason?: string;
  strDescriptionEN?: string;
  strHomeTeam?: string;
  strAwayTeam?: string;
  intHomeScore?: string;
  intAwayScore?: string;
  intSpectators?: string;
  strHomeGoalDetails?: string;
  strHomeRedCards?: string;
  strHomeYellowCards?: string;
  strHomeLineupGoalkeeper?: string;
  strHomeLineupDefense?: string;
  strHomeLineupMidfield?: string;
  strHomeLineupForward?: string;
  strHomeLineupSubstitutes?: string;
  strHomeFormation?: string;
  strAwayRedCards?: string;
  strAwayYellowCards?: string;
  strAwayGoalDetails?: string;
  strAwayLineupGoalkeeper?: string;
  strAwayLineupDefense?: string;
  strAwayLineupMidfield?: string;
  strAwayLineupForward?: string;
  strAwayLineupSubstitutes?: string;
  strAwayFormation?: string;
  intHomeShots?: string;
  intAwayShots?: string;
  dateEvent?: string;
  strDate?: string;
  strTime?: string;
  strTimeLocal?: string;
  strTVStation?: string;
  idHomeTeam?: string;
  idAwayTeam?: string;
  strResult?: string;
  strVenue?: string;
  strCountry?: string;
  strCity?: string;
  strPoster?: string;
  strSquare?: string;
  strFanart?: string;
  strThumb?: string;
  strBanner?: string;
  strMap?: string;
  strTweet1?: string;
  strTweet2?: string;
  strTweet3?: string;
  strVideo?: string;
  strStatus?: string;
  strPostponed?: string;
  strLocked?: string;
}

// Player Interface
export interface Player {
  idPlayer: string;
  strPlayer: string;
  strPosition?: string;
  dateBorn?: string;
  strNationality?: string;
  strHeight?: string;
  strWeight?: string;
  strDescriptionEN?: string;
  strThumb?: string;
  strCutout?: string;
}

export const sportsApi = createApi({
  reducerPath: 'sportsApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  endpoints: (builder) => ({
    listLeagueTeams: builder.query<TeamData[], string>({
      query: (leagueName) => `search_all_teams.php?l=${leagueName}`,
      transformResponse: (response: { teams: TeamData[] | null }) => {
        return response.teams || [];
      },
    }),
    searchTeams: builder.query<TeamData[], string>({
      query: (teamName) => `searchteams.php?t=${teamName}`,
      transformResponse: (response: { teams: TeamData[] | null }) => {
        return response.teams || [];
      },
    }),
    lookupTeam: builder.query<TeamData, string>({
      query: (teamId) => `lookupteam.php?id=${teamId}`,
      transformResponse: (response: { teams: TeamData[] | null }) => {
        return response.teams?.[0] || ({} as TeamData);
      },
    }),
    listTeamEvents: builder.query<EventData[], string>({
      query: (teamName) => `searchevents.php?e=${teamName}`,
      transformResponse: (response: { event: EventData[] | null }) => {
        return response.event || [];
      },
    }),
    lookupEvent: builder.query<EventData, string>({
      query: (eventId) => `lookupevent.php?id=${eventId}`,
      transformResponse: (response: { events: EventData[] | null }) => {
        return response.events?.[0] || ({} as EventData);
      },
    }),
    listTeamPlayers: builder.query<Player[], string>({
      query: (teamName) => `searchplayers.php?t=${teamName}`,
      transformResponse: (response: { player: Player[] | null }) => {
        return response.player || [];
      },
    }),
    lookupPlayer: builder.query<Player, string>({
      query: (playerId) => `lookupplayer.php?id=${playerId}`,
      transformResponse: (response: { players: Player[] | null }) => {
        return response.players?.[0] || ({} as Player);
      },
    }),
  }),
});

export const {
  useListLeagueTeamsQuery,
  useSearchTeamsQuery,
  useLookupTeamQuery,
  useListTeamEventsQuery,
  useLookupEventQuery,
  useListTeamPlayersQuery,
  useLookupPlayerQuery,
} = sportsApi;