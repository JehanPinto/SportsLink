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
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useSearchTeamsQuery } from '../../api/sportsApi';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { logout, selectCurrentUser } from '../auth/authSlice';
import { selectFavouriteTeams } from '../favourites/favouritesSlice';
import { deleteToken } from '../../utils/storage';
import MatchCard from './MatchCard';

export default function HomeScreen() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  const favouriteTeams = useAppSelector(selectFavouriteTeams);
  const [searchQuery, setSearchQuery] = useState('Arsenal');
  const [tempQuery, setTempQuery] = useState('Arsenal');
  const { data: teams, isLoading, error, refetch } = useSearchTeamsQuery(searchQuery);

  const handleLogout = async () => {
    await deleteToken('auth_token');
    dispatch(logout());
  };

  const handleSearch = () => {
    if (tempQuery.trim()) {
      setSearchQuery(tempQuery.trim());
    }
  };

  if (isLoading && !teams) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#667eea" />
        <Text style={styles.loadingText}>Loading teams...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
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
              <Feather name="search" size={18} color="#999" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search teams..."
                placeholderTextColor="#999"
                value={tempQuery}
                onChangeText={setTempQuery}
                onSubmitEditing={handleSearch}
                returnKeyType="search"
              />
              {tempQuery !== searchQuery && (
                <TouchableOpacity onPress={handleSearch}>
                  <Feather name="arrow-right-circle" size={22} color="#929292" />
                </TouchableOpacity>
              )}
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
        renderItem={({ item }) => <MatchCard team={item} />}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.listHeader}>
            <Text style={styles.sectionTitle}>
              {searchQuery ? `${searchQuery} Teams` : 'Popular Teams'}
            </Text>
            {error && (
              <View style={styles.errorBadge}>
                <Feather name="alert-circle" size={12} color="#ff9500" />
                <Text style={styles.errorLabel}>Error</Text>
              </View>
            )}
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Feather name="inbox" size={50} color="#ccc" />
            <Text style={styles.emptyTitle}>No teams found</Text>
            <Text style={styles.emptyDesc}>Try searching for a different team</Text>
            <TouchableOpacity 
              style={styles.resetBtn}
              onPress={() => {
                setTempQuery('Arsenal');
                setSearchQuery('Arsenal');
              }}
            >
              <Text style={styles.resetBtnText}>Search Arsenal</Text>
            </TouchableOpacity>
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refetch}
            tintColor="#667eea"
            colors={['#667eea']}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
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
    backgroundColor: 'rgba(30, 7, 32, 0.7)', // Dark navy/black 
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
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#333',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statBox: {
    flex: 1,
    backgroundColor: 'rgba(23, 11, 3, 0.45)',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    gap: 6,
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
    color: '#333',
  },
  errorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#fff3cd',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  errorLabel: {
    fontSize: 11,
    color: '#ff9500',
    fontWeight: '600',
  },
  emptyBox: {
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#999',
    marginTop: 14,
  },
  emptyDesc: {
    fontSize: 13,
    color: '#bbb',
    marginTop: 6,
  },
  resetBtn: {
    marginTop: 20,
    backgroundColor: '#667eea',
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