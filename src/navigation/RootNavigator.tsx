import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAppSelector } from '../hooks';
import { selectIsAuthenticated } from '../features/auth/authSlice';
import LoginScreen from '../features/auth/LoginScreen';
import RegisterScreen from '../features/auth/RegisterScreen';
import TabNavigator from './TabNavigator';
import TeamDetailScreen from '../features/team/teamDetailScreen';
import { RootStackParamList } from './types';
import MatchDetailsScreen from '../features/matches/MatchDetailsScreen';
import PlayerDetailsScreen from '../features/players/PlayerDetailsScreen.tsx';
import TeamSquadScreen from '../features/team/TeamSquadScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Home" component={TabNavigator} />
          <Stack.Screen name="TeamDetail" component={TeamDetailScreen} />
          <Stack.Screen name="MatchDetails" component={MatchDetailsScreen} /> 
          <Stack.Screen name="PlayerDetails" component={PlayerDetailsScreen} />
          <Stack.Screen name="TeamSquad" component={TeamSquadScreen} /> 
        </>
      )}
    </Stack.Navigator>
  );
}