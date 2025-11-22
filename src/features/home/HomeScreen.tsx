import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  StatusBar,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/types';
import { useListLeagueTeamsQuery, useSearchTeamsQuery } from '../../api/sportsApi';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { logout, selectCurrentUser } from '../auth/authSlice';
import { selectFavouriteTeams } from '../favourites/favouritesSlice';
import { deleteToken } from '../../utils/storage';
import MatchCard from './MatchCard';
import { useTheme } from '../../context/ThemeContext';

const DEFAULT_LEAGUE = 'English Premier League';

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  const favouriteTeams = useAppSelector(selectFavouriteTeams);
  const { theme, isDark } = useTheme();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [tempQuery, setTempQuery] = useState('');

  // Fetch default league teams
  const { 
    data: leagueTeams, 
    isLoading: isLoadingLeague, 
    refetch: refetchLeague 
  } = useListLeagueTeamsQuery(DEFAULT_LEAGUE);

  // Fetch search results (only when searchQuery is not empty)
  const { 
    data: searchResults, 
    isLoading: isLoadingSearch, 
    error: searchError 
  } = useSearchTeamsQuery(searchQuery, {
    skip: !searchQuery,
  });

  // Determine which data to show
  const teams = searchQuery ? searchResults : leagueTeams;
  const isLoading = searchQuery ? isLoadingSearch : isLoadingLeague;
  const error = searchQuery ? searchError : null;

  const handleLogout = async () => {
    await deleteToken('auth_token');
    dispatch(logout());
  };

  const handleSearch = () => {
    if (tempQuery.trim()) {
      setSearchQuery(tempQuery.trim());
    }
  };

  const handleClearSearch = () => {
    setTempQuery('');
    setSearchQuery('');
  };

  const handleTeamPress = (team: any) => {
    navigation.navigate('TeamDetail', { team });
  };

  const handleRefresh = () => {
    if (searchQuery) {
      const temp = searchQuery;
      setSearchQuery('');
      setTimeout(() => setSearchQuery(temp), 0);
    } else {
      refetchLeague();
    }
  };

  const styles = createStyles(theme, isDark);

  if (isLoading && !teams) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading teams...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      
      {/* Header Section */}
      <ImageBackground
        source={require('../../../assets/headerback2.jpg')}
        style={styles.headerGradient}
        imageStyle={styles.headerImage}
      >
        <View style={styles.overlay} />
        <SafeAreaView edges={['top']} style={styles.safeHeader}>
          {/* Title and Logout */}
          <View style={styles.topBar}>
            <View>
              <Text style={styles.appTitle}>Sportify</Text>
              <Text style={styles.welcomeText}>
                Welcome, {user?.firstName || user?.username}! 👋
              </Text>
            </View>
            <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
              <Feather name="log-out" size={22} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View style={styles.searchWrapper}>
            <View style={styles.searchBox}>
              <Feather name="search" size={18} color={theme.colors.placeholder} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search teams..."
                placeholderTextColor={theme.colors.placeholder}
                value={tempQuery}
                onChangeText={setTempQuery}
                onSubmitEditing={handleSearch}
                returnKeyType="search"
              />
              {searchQuery ? (
                <TouchableOpacity onPress={handleClearSearch}>
                  <Feather name="x-circle" size={22} color={theme.colors.error} />
                </TouchableOpacity>
              ) : tempQuery !== searchQuery && tempQuery !== '' ? (
                <TouchableOpacity onPress={handleSearch}>
                  <Feather name="arrow-right-circle" size={22} color={theme.colors.textSecondary} />
                </TouchableOpacity>
              ) : null}
            </View>
          </View>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Feather name="shield" size={18} color="#fff" />
              <Text style={styles.statValue}>{teams?.length || 0}</Text>
              <Text style={styles.statLabel}>Teams</Text>
            </View>
            <View style={styles.statBox}>
              <Feather name="heart" size={18} color="#ff3b30" />
              <Text style={styles.statValue}>{favouriteTeams.length}</Text>
              <Text style={styles.statLabel}>Favorites</Text>
            </View>
            <View style={styles.statBox}>
              <Feather name="award" size={18} color="#ffd700" />
              <Text style={styles.statValue}>EPL</Text>
              <Text style={styles.statLabel}>League</Text>
            </View>
          </View>
        </SafeAreaView>
      </ImageBackground>

      {/* Teams List */}
      <FlatList
        data={teams || []}
        keyExtractor={(item) => item.idTeam}
        renderItem={({ item }) => (
          <MatchCard 
            team={item} 
            onPress={() => handleTeamPress(item)}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.listHeader}>
            <Text style={styles.sectionTitle}>
              {searchQuery 
                ? `Search: "${searchQuery}"` 
                : `${DEFAULT_LEAGUE} Teams`}
            </Text>
            {error && (
              <View style={styles.errorBadge}>
                <Feather name="alert-circle" size={12} color={theme.colors.warning} />
                <Text style={styles.errorLabel}>Error</Text>
              </View>
            )}
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Feather name="inbox" size={50} color={theme.colors.disabled} />
            <Text style={styles.emptyTitle}>No teams found</Text>
            <Text style={styles.emptyDesc}>
              {searchQuery 
                ? `No results for "${searchQuery}"`
                : 'No teams available'}
            </Text>
            {searchQuery && (
              <TouchableOpacity 
                style={styles.resetBtn}
                onPress={handleClearSearch}
              >
                <Text style={styles.resetBtnText}>Clear Search</Text>
              </TouchableOpacity>
            )}
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={handleRefresh}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const createStyles = (theme: any, isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  loadingText: {
    marginTop: 12,
    color: theme.colors.textSecondary,
    fontSize: 16,
  },
  headerGradient: {
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    overflow: 'hidden',
  },
  headerImage: {
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: isDark ? 'rgba(0, 0, 0, 0.8)' : 'rgba(30, 7, 32, 0.7)',
  },
  safeHeader: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  appTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  welcomeText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 4,
  },
  logoutBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 10,
    borderRadius: 10,
  },
  searchWrapper: {
    marginBottom: 30,
    marginTop: 5,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 10,
    borderWidth: isDark ? 1 : 0,
    borderColor: isDark ? theme.colors.border : 'transparent',
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: theme.colors.text,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statBox: {
    flex: 1,
    backgroundColor: isDark ? 'rgba(139, 156, 255, 0.15)' : 'rgba(23, 11, 3, 0.45)',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    gap: 6,
    borderWidth: isDark ? 1 : 0,
    borderColor: isDark ? 'rgba(139, 156, 255, 0.3)' : 'transparent',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.95)',
  },
  listContent: {
    padding: 16,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  errorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: isDark ? 'rgba(255, 214, 10, 0.2)' : '#fff3cd',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: isDark ? 1 : 0,
    borderColor: isDark ? theme.colors.warning : 'transparent',
  },
  errorLabel: {
    fontSize: 11,
    color: theme.colors.warning,
    fontWeight: '600',
  },
  emptyBox: {
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginTop: 14,
  },
  emptyDesc: {
    fontSize: 13,
    color: theme.colors.placeholder,
    marginTop: 6,
  },
  resetBtn: {
    marginTop: 20,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 28,
    paddingVertical: 10,
    borderRadius: 20,
  },
  resetBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});