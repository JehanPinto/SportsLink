// You can later replace `any` with your real Team type from sportsApi
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  TeamDetail: { team: any }; // or { idTeam: string } if you prefer
};
