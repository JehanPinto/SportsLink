// src/features/team/EventCard.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/types';
import { useTheme } from '../../context/ThemeContext';

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
  const { theme, isDark } = useTheme();
  const styles = createStyles(theme, isDark);

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

  const hasScore =
    event.intHomeScore !== null && event.intAwayScore !== null;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.dateBadge}>
        <Feather
          name={isUpcoming ? 'calendar' : 'clock'}
          size={14}
          color={isUpcoming ? theme.colors.primary : theme.colors.textSecondary}
        />
        <Text
          style={[
            styles.dateText,
            isUpcoming && styles.upcomingDate,
          ]}
        >
          {formatDate(event.dateEvent)}
        </Text>
      </View>

      <View style={styles.matchInfo}>
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

        <View style={styles.separator}>
          <Text style={styles.vsText}>{hasScore ? '-' : 'VS'}</Text>
        </View>

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

      {isUpcoming && (
        <View style={styles.statusBadge}>
          <View style={styles.dot} />
          <Text style={styles.statusText}>Upcoming</Text>
        </View>
      )}

      <View style={styles.tapIndicator}>
        <Feather name="chevron-right" size={16} color={theme.colors.disabled} />
      </View>
    </TouchableOpacity>
  );
}

const createStyles = (theme: any, isDark: boolean) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.4 : 0.1,
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
      color: theme.colors.textSecondary,
      fontWeight: '500',
    },
    upcomingDate: {
      color: theme.colors.primary,
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
      color: theme.colors.text,
      flex: 1,
    },
    scoreBox: {
      backgroundColor: isDark ? theme.colors.background : '#f0f4ff',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
      minWidth: 40,
      alignItems: 'center',
    },
    score: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.colors.primary,
    },
    separator: {
      paddingHorizontal: 12,
    },
    vsText: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      fontWeight: '600',
    },
    statusBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginTop: 12,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    dot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: theme.colors.primary,
    },
    statusText: {
      fontSize: 12,
      color: theme.colors.primary,
      fontWeight: '600',
    },
    tapIndicator: {
      position: 'absolute',
      right: 16,
      top: '50%',
      transform: [{ translateY: -8 }],
    },
  });
