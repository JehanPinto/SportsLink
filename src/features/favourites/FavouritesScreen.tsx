// src/features/favourites/FavouritesScreen.tsx
import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/types';
import { useAppDispatch, useAppSelector } from '../../hooks';
import {
  selectFavouriteTeams,
  clearTeamFavourites,
} from './favouritesSlice';
import { useListLeagueTeamsQuery } from '../../api/sportsApi';
import MatchCard from '../home/MatchCard';
import { useTheme } from '../../context/ThemeContext';

const DEFAULT_LEAGUE = 'English Premier League';

export default function FavouritesScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const dispatch = useAppDispatch();
  const favouriteTeamIds = useAppSelector(selectFavouriteTeams);
  const { theme, isDark } = useTheme();
  const styles = createStyles(theme, isDark);

  const { data: allTeams, isLoading } = useListLeagueTeamsQuery(DEFAULT_LEAGUE);

  const favouriteTeams =
    allTeams?.filter((team) => favouriteTeamIds.includes(team.idTeam)) || [];

  const handleClearAll = () => {
    if (favouriteTeamIds.length > 0) {
      dispatch(clearTeamFavourites());
    }
  };

  const handleTeamPress = (team: any) => {
    navigation.navigate('TeamDetail', { team });
  };

  const handleBrowseTeams = () => {
    navigation.navigate('HomeTab');
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
        <SafeAreaView edges={['top']} style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.titleRow}>
              <Feather name="heart" size={28} color={theme.colors.error} />
              <Text style={styles.title}>My Favourites</Text>
            </View>
          </View>
        </SafeAreaView>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading favourites...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <SafeAreaView edges={['top']} style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.titleRow}>
            <Feather name="heart" size={28} color={theme.colors.error} />
            <Text style={styles.title}>My Favourites</Text>
          </View>
          {favouriteTeamIds.length > 0 && (
            <TouchableOpacity
              onPress={handleClearAll}
              style={styles.clearButton}
            >
              <Feather name="trash-2" size={20} color={theme.colors.error} />
              <Text style={styles.clearText}>Clear All</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statBadge}>
            <Text style={styles.statNumber}>{favouriteTeamIds.length}</Text>
            <Text style={styles.statLabel}>
              {favouriteTeamIds.length === 1 ? 'Team' : 'Teams'}
            </Text>
          </View>
        </View>
      </SafeAreaView>

      {favouriteTeamIds.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconCircle}>
            <Feather name="heart" size={60} color={theme.colors.disabled} />
          </View>
          <Text style={styles.emptyTitle}>No Favourites Yet</Text>
          <Text style={styles.emptyDescription}>
            Start adding teams to your favourites by tapping the heart icon
          </Text>
          <TouchableOpacity
            style={styles.browseButton}
            onPress={handleBrowseTeams}
          >
            <Feather name="search" size={20} color="#fff" />
            <Text style={styles.browseButtonText}>Browse Teams</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={favouriteTeams}
          keyExtractor={(item) => item.idTeam}
          renderItem={({ item }) => (
            <MatchCard team={item} onPress={() => handleTeamPress(item)} />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const createStyles = (theme: any, isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      marginTop: 12,
      color: theme.colors.textSecondary,
      fontSize: 16,
    },
    header: {
      backgroundColor: theme.colors.surface,
      paddingBottom: 20,
      borderBottomLeftRadius: 25,
      borderBottomRightRadius: 25,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.4 : 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    headerContent: {
      paddingHorizontal: 20,
      paddingTop: 10,
    },
    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      marginBottom: 16,
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      color: theme.colors.text,
    },
    clearButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      backgroundColor: isDark ? 'rgba(255, 59, 48, 0.12)' : '#fff0ef',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      alignSelf: 'flex-start',
    },
    clearText: {
      fontSize: 14,
      color: theme.colors.error,
      fontWeight: '600',
    },
    statsContainer: {
      paddingHorizontal: 20,
      marginTop: 12,
    },
    statBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      backgroundColor: isDark ? 'rgba(102, 126, 234, 0.18)' : '#f0f4ff',
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 16,
      alignSelf: 'flex-start',
    },
    statNumber: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.primary,
    },
    statLabel: {
      fontSize: 14,
      color: theme.colors.primary,
      fontWeight: '600',
    },
    listContent: {
      padding: 16,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 40,
    },
    emptyIconCircle: {
      width: 140,
      height: 140,
      borderRadius: 70,
      backgroundColor: isDark ? theme.colors.background : '#f5f5f5',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 24,
    },
    emptyTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: 12,
    },
    emptyDescription: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      lineHeight: 24,
      marginBottom: 32,
    },
    browseButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      backgroundColor: theme.colors.primary,
      paddingHorizontal: 28,
      paddingVertical: 14,
      borderRadius: 25,
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
    },
    browseButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    emptyBox: {
      alignItems: 'center',
      paddingVertical: 50,
    },
  });
