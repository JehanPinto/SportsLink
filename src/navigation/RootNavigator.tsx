import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAppSelector } from '../hooks';
import { selectIsAuthenticated } from '../features/auth/authSlice';
import LoginScreen from '../features/auth/LoginScreen';
import RegisterScreen from '../features/auth/RegisterScreen';
import HomeScreen from '../features/home/HomeScreen';
import TeamDetailScreen from '../features/team/teamDetailScreen'; // <- capitalize the file name if needed
import { RootStackParamList } from './types'; // <- new

const Stack = createNativeStackNavigator<RootStackParamList>(); // <- typed stack

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
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="TeamDetail" component={TeamDetailScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
