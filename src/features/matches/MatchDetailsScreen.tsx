import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation, RouteProp, NavigationProp } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { RootStackParamList } from '../../navigation/types';
import { useLookupEventQuery } from '../../api/sportsApi';

type MatchDetailsScreenRouteProp = RouteProp<RootStackParamList, 'MatchDetails'>;

export default function MatchDetailsScreen() {
  const route = useRoute<MatchDetailsScreenRouteProp>();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { eventId } = route.params;

  const { data: event, isLoading, error } = useLookupEventQuery(eventId);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#667eea" />
          <Text style={styles.loadingText}>Loading match details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !event) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.centered}>
          <Feather name="alert-circle" size={50} color="#ff3b30" />
          <Text style={styles.errorText}>Failed to load match details</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.retryText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const hasScore = event.intHomeScore !== null && event.intAwayScore !== null;
  const isFinished = event.strStatus === 'Match Finished';
  const isPending = event.strStatus === 'Not Started';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Feather name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Match Details</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Match Status Badge */}
        <View style={styles.statusContainer}>
          <View style={[
            styles.statusBadge,
            isFinished && styles.finishedBadge,
            isPending && styles.pendingBadge,
          ]}>
            <View style={[
              styles.statusDot,
              isFinished && styles.finishedDot,
              isPending && styles.pendingDot,
            ]} />
            <Text style={[
              styles.statusText,
              isFinished && styles.finishedText,
              isPending && styles.pendingText,
            ]}>
              {event.strStatus}
            </Text>
          </View>
        </View>

        {/* Date & Venue */}
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Feather name="calendar" size={16} color="#667eea" />
            <Text style={styles.infoText}>{formatDate(event.dateEvent)}</Text>
          </View>
          {event.strVenue && (
            <View style={styles.infoRow}>
              <Feather name="map-pin" size={16} color="#667eea" />
              <Text style={styles.infoText}>{event.strVenue}</Text>
            </View>
          )}
        </View>

        {/* Teams & Score */}
        <View style={styles.matchCard}>
          {/* Home Team */}
          <View style={styles.teamSection}>
            {event.strThumb && (
              <Image 
                source={{ uri: event.strThumb }} 
                style={styles.teamBadge}
                resizeMode="contain"
              />
            )}
            <Text style={styles.teamName}>{event.strHomeTeam}</Text>
          </View>

          {/* Score */}
          <View style={styles.scoreSection}>
            {hasScore ? (
              <View style={styles.scoreContainer}>
                <Text style={styles.score}>{event.intHomeScore}</Text>
                <Text style={styles.scoreSeparator}>-</Text>
                <Text style={styles.score}>{event.intAwayScore}</Text>
              </View>
            ) : (
              <Text style={styles.vsText}>VS</Text>
            )}
          </View>

          {/* Away Team */}
          <View style={styles.teamSection}>
            {event.strThumb && (
              <Image 
                source={{ uri: event.strThumb }} 
                style={styles.teamBadge}
                resizeMode="contain"
              />
            )}
            <Text style={styles.teamName}>{event.strAwayTeam}</Text>
          </View>
        </View>

        {/* Goal Details */}
        {(event.strHomeGoalDetails || event.strAwayGoalDetails) && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Feather name="target" size={20} color="#667eea" />
              <Text style={styles.sectionTitle}>Goals</Text>
            </View>
            
            {event.strHomeGoalDetails && (
              <View style={styles.goalCard}>
                <Text style={styles.goalTeam}>{event.strHomeTeam}</Text>
                <Text style={styles.goalDetails}>
                  {event.strHomeGoalDetails}
                </Text>
              </View>
            )}

            {event.strAwayGoalDetails && (
              <View style={styles.goalCard}>
                <Text style={styles.goalTeam}>{event.strAwayTeam}</Text>
                <Text style={styles.goalDetails}>
                  {event.strAwayGoalDetails}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Lineups */}
        {(event.strHomeLineupGoalkeeper || event.strAwayLineupGoalkeeper) && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Feather name="users" size={20} color="#667eea" />
              <Text style={styles.sectionTitle}>Lineups</Text>
            </View>

            <View style={styles.lineupsContainer}>
              {/* Home Team Lineup */}
              <View style={styles.lineupColumn}>
                <Text style={styles.lineupTeamName}>{event.strHomeTeam}</Text>
                
                {event.strHomeLineupGoalkeeper && (
                  <LineupSection 
                    title="Goalkeeper"
                    players={event.strHomeLineupGoalkeeper}
                  />
                )}
                {event.strHomeLineupDefense && (
                  <LineupSection 
                    title="Defense"
                    players={event.strHomeLineupDefense}
                  />
                )}
                {event.strHomeLineupMidfield && (
                  <LineupSection 
                    title="Midfield"
                    players={event.strHomeLineupMidfield}
                  />
                )}
                {event.strHomeLineupForward && (
                  <LineupSection 
                    title="Forward"
                    players={event.strHomeLineupForward}
                  />
                )}
              </View>

              {/* Divider */}
              <View style={styles.lineupDivider} />

              {/* Away Team Lineup */}
              <View style={styles.lineupColumn}>
                <Text style={styles.lineupTeamName}>{event.strAwayTeam}</Text>
                
                {event.strAwayLineupGoalkeeper && (
                  <LineupSection 
                    title="Goalkeeper"
                    players={event.strAwayLineupGoalkeeper}
                  />
                )}
                {event.strAwayLineupDefense && (
                  <LineupSection 
                    title="Defense"
                    players={event.strAwayLineupDefense}
                  />
                )}
                {event.strAwayLineupMidfield && (
                  <LineupSection 
                    title="Midfield"
                    players={event.strAwayLineupMidfield}
                  />
                )}
                {event.strAwayLineupForward && (
                  <LineupSection 
                    title="Forward"
                    players={event.strAwayLineupForward}
                  />
                )}
              </View>
            </View>
          </View>
        )}

        {/* Match Info */}
        {event.strLeague && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Feather name="info" size={20} color="#667eea" />
              <Text style={styles.sectionTitle}>Match Info</Text>
            </View>
            
            <View style={styles.infoCard}>
              <InfoRow label="League" value={event.strLeague} />
              {event.strSeason && (
                <InfoRow label="Season" value={event.strSeason} />
              )}
              {event.intRound && (
                <InfoRow label="Round" value={event.intRound} />
              )}
            </View>
          </View>
        )}

        {/* Bottom Padding */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// Helper Components
function LineupSection({ title, players }: { title: string; players: string }) {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const playerList = players.split(';').map(p => p.trim()).filter(p => p);
  
  return (
    <View style={styles.lineupSection}>
      <Text style={styles.lineupTitle}>{title}</Text>
      {playerList.map((player, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => {
            // Note: You'd need to get the playerId somehow
            // For now, we'll just show the player name
            console.log('Player clicked:', player);
          }}
        >
          <Text style={styles.playerName}>
            • {player}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoCardRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
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
    paddingHorizontal: 40,
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
    fontSize: 16,
  },
  errorText: {
    marginTop: 12,
    color: '#ff3b30',
    fontSize: 16,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: '#667eea',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  retryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statusContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  finishedBadge: {
    backgroundColor: '#e8f5e9',
  },
  pendingBadge: {
    backgroundColor: '#fff3cd',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#666',
  },
  finishedDot: {
    backgroundColor: '#4caf50',
  },
  pendingDot: {
    backgroundColor: '#ffc107',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  finishedText: {
    color: '#4caf50',
  },
  pendingText: {
    color: '#f57c00',
  },
  infoContainer: {
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    justifyContent: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
  },
  matchCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  teamSection: {
    alignItems: 'center',
    marginVertical: 12,
  },
  teamBadge: {
    width: 80,
    height: 80,
    marginBottom: 12,
  },
  teamName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  scoreSection: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  score: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#667eea',
  },
  scoreSeparator: {
    fontSize: 32,
    color: '#ddd',
    fontWeight: 'bold',
  },
  vsText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ddd',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  goalCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  goalTeam: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#667eea',
    marginBottom: 8,
  },
  goalDetails: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  lineupsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  lineupColumn: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  lineupDivider: {
    width: 1,
    backgroundColor: '#e0e0e0',
  },
  lineupTeamName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#667eea',
    marginBottom: 16,
    textAlign: 'center',
  },
  lineupSection: {
    marginBottom: 16,
  },
  lineupTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#999',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  playerName: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  infoCardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 14,
    color: '#999',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
});