import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/types';

interface Event {
  idEvent: string;
  strEvent: string;
  strHomeTeam: string;
  strAwayTeam: string;
  intHomeScore: string | null;
  intAwayScore: string | null;
  dateEvent: string;
  strStatus: string;
}

interface EventCardProps {
  event: Event;
  isUpcoming?: boolean;
}

export default function EventCard({ event, isUpcoming = false }: EventCardProps) {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handlePress = () => {
    navigation.navigate('MatchDetails', { eventId: event.idEvent });
  };

  const hasScore = event.intHomeScore !== null && event.intAwayScore !== null;

  return (
    <TouchableOpacity 
      style={styles.card}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      {/* Date Badge */}
      <View style={styles.dateBadge}>
        <Feather 
          name={isUpcoming ? 'calendar' : 'clock'} 
          size={14} 
          color={isUpcoming ? '#667eea' : '#666'} 
        />
        <Text style={[styles.dateText, isUpcoming && styles.upcomingDate]}>
          {formatDate(event.dateEvent)}
        </Text>
      </View>

      {/* Teams */}
      <View style={styles.matchInfo}>
        {/* Home Team */}
        <View style={styles.teamContainer}>
          <Text style={styles.teamName} numberOfLines={1}>
            {event.strHomeTeam}
          </Text>
          {hasScore && (
            <View style={styles.scoreBox}>
              <Text style={styles.score}>{event.intHomeScore}</Text>
            </View>
          )}
        </View>

        {/* VS or Score Separator */}
        <View style={styles.separator}>
          <Text style={styles.vsText}>{hasScore ? '-' : 'VS'}</Text>
        </View>

        {/* Away Team */}
        <View style={styles.teamContainer}>
          {hasScore && (
            <View style={styles.scoreBox}>
              <Text style={styles.score}>{event.intAwayScore}</Text>
            </View>
          )}
          <Text style={styles.teamName} numberOfLines={1}>
            {event.strAwayTeam}
          </Text>
        </View>
      </View>

      {/* Status Badge */}
      {isUpcoming && (
        <View style={styles.statusBadge}>
          <View style={styles.dot} />
          <Text style={styles.statusText}>Upcoming</Text>
        </View>
      )}

      {/* Tap Indicator */}
      <View style={styles.tapIndicator}>
        <Feather name="chevron-right" size={16} color="#999" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  dateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  dateText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  upcomingDate: {
    color: '#667eea',
    fontWeight: '600',
  },
  matchInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  teamContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  teamName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  scoreBox: {
    backgroundColor: '#f0f4ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    minWidth: 40,
    alignItems: 'center',
  },
  score: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#667eea',
  },
  separator: {
    paddingHorizontal: 12,
  },
  vsText: {
    fontSize: 12,
    color: '#999',
    fontWeight: '600',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#667eea',
  },
  statusText: {
    fontSize: 12,
    color: '#667eea',
    fontWeight: '600',
  },
  tapIndicator: {
    position: 'absolute',
    right: 16,
    top: '50%',
    transform: [{ translateY: -8 }],
  },
});