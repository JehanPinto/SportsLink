
import React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import HomeScreen from '../features/home/HomeScreen';
import FavouritesScreen from '../features/favourites/FavouritesScreen';
import ProfileScreen from '../features/profile/ProfileScreen';
import { useAppSelector } from '../hooks';
import { selectFavouriteTeams } from '../features/favourites/favouritesSlice';
import { useTheme } from '../context/ThemeContext';

type TabParamList = {
  HomeTab: undefined;
  FavouritesTab: undefined;
  ProfileTab: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

export default function TabNavigator() {
  const favouriteTeams = useAppSelector(selectFavouriteTeams);
  const { theme, isDark } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 85 : 60,
          paddingBottom: Platform.OS === 'ios' ? 25 : 8,
          paddingTop: 8,
          borderTopWidth: 1,
          borderTopColor: isDark ? theme.colors.border : '#f0f0f0',
          backgroundColor: theme.colors.surface,
          // add subtle shadow for elevation on Android
          elevation: isDark ? 8 : 2,
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({ color, size }) => (
            <Feather name="home" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="FavouritesTab"
        component={FavouritesScreen}
        options={{
          tabBarLabel: '',
          tabBarBadge:
            favouriteTeams.length > 0 ? favouriteTeams.length : undefined,
          tabBarBadgeStyle: {
            backgroundColor: theme.colors.error,
            color: '#fff',
            fontSize: 10,
            fontWeight: 'bold',
          },
          tabBarIcon: ({ color, size }) => (
            <Feather name="heart" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({ color, size }) => (
            <Feather name="user" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
