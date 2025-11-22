import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/types';
import TeamHeader from './TeamHeader';
import TeamBadge from './TeamBadge';
import TeamInfoCard from './TeamInfoCard';
import TeamAbout from './TeamAbout';
import TeamSocial from './TeamSocial';

type TeamDetailScreenRouteProp = RouteProp<RootStackParamList, 'TeamDetail'>;

export default function TeamDetailScreen() {
  const route = useRoute<TeamDetailScreenRouteProp>();
  const { team } = route.params;
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    // Simulate refresh - in real app, refetch team data from API
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  }, []);

  if (!team) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#667eea" />
          <Text style={styles.loadingText}>Loading team details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <TeamHeader team={team} />
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#667eea"
            colors={['#667eea']}
          />
        }
      >
        {/* Team Badge */}
        <TeamBadge 
          badgeUrl={team.strBadge || team.strTeamBadge} 
          teamName={team.strTeam}
        />

        {/* Team Name */}
        <Text style={styles.teamName}>{team.strTeam}</Text>
        <Text style={styles.league}>{team.strLeague}</Text>

        {/* Info Cards */}
        <TeamInfoCard team={team} />

        {/* Description */}
        <TeamAbout description={team.strDescriptionEN} />

        {/* Social Links */}
        <TeamSocial team={team} />
      </ScrollView>
    </SafeAreaView>
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
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
    fontSize: 16,
  },
  teamName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    paddingHorizontal: 20,
    marginTop: 8,
  },
  league: {
    fontSize: 16,
    color: '#667eea',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
});