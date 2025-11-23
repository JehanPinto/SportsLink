import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';

interface FavouritesState {
  teamIds: string[];
  eventIds: string[];
  playerIds: string[];
  isLoaded: boolean;
}

const initialState: FavouritesState = {
  teamIds: [],
  eventIds: [],
  playerIds: [],
  isLoaded: false,
};

const favouritesSlice = createSlice({
  name: 'favourites',
  initialState,
  reducers: {
    toggleTeamFavourite: (state, action: PayloadAction<string>) => {
      const index = state.teamIds.indexOf(action.payload);
      if (index > -1) {
        state.teamIds.splice(index, 1);
      } else {
        state.teamIds.push(action.payload);
      }
    },
    toggleEventFavourite: (state, action: PayloadAction<string>) => {
      const index = state.eventIds.indexOf(action.payload);
      if (index > -1) {
        state.eventIds.splice(index, 1);
      } else {
        state.eventIds.push(action.payload);
      }
    },
    togglePlayerFavourite: (state, action: PayloadAction<string>) => {
      const index = state.playerIds.indexOf(action.payload);
      if (index > -1) {
        state.playerIds.splice(index, 1);
      } else {
        state.playerIds.push(action.payload);
      }
    },
    clearAllFavourites: (state) => {
      state.teamIds = [];
      state.eventIds = [];
      state.playerIds = [];
    },
    clearTeamFavourites: (state) => {
      state.teamIds = [];
    },
    clearEventFavourites: (state) => {
      state.eventIds = [];
    },
    clearPlayerFavourites: (state) => {
      state.playerIds = [];
    },
    // NEW: Load favourites from storage
    loadFavouritesFromStorage: (state, action: PayloadAction<FavouritesState | null>) => {
      if (action.payload) {
        state.teamIds = action.payload.teamIds || [];
        state.eventIds = action.payload.eventIds || [];
        state.playerIds = action.payload.playerIds || [];
      }
      state.isLoaded = true;
    },
  },
});

export const {
  toggleTeamFavourite,
  toggleEventFavourite,
  togglePlayerFavourite,
  clearAllFavourites,
  clearTeamFavourites,
  clearEventFavourites,
  clearPlayerFavourites,
  loadFavouritesFromStorage,
} = favouritesSlice.actions;

export const selectFavouriteTeams = (state: RootState) => state.favourites.teamIds;
export const selectFavouriteEvents = (state: RootState) => state.favourites.eventIds;
export const selectFavouritePlayers = (state: RootState) => state.favourites.playerIds;
export const selectFavouritesLoaded = (state: RootState) => state.favourites.isLoaded;

export default favouritesSlice.reducer;
