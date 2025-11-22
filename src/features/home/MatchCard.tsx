// src/features/home/MatchCard.tsx
import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppDispatch, useAppSelector } from '../../hooks';
import {
  toggleTeamFavourite,
  selectFavouriteTeams,
} from '../favourites/favouritesSlice';
import { useTheme } from '../../context/ThemeContext';

interface Team {
  idTeam: string;
  strTeam: string;
  strBadge: string;
  strTeamBadge?: string;
  strStadium: string;
  strLeague: string;
  strDescriptionEN: string;
}

interface MatchCardProps {
  team: Team;
  onPress?: () => void;
}

export default function MatchCard({ team, onPress }: MatchCardProps) {
  const dispatch = useAppDispatch();
  const favouriteTeams = useAppSelector(selectFavouriteTeams);
  const isFavourite = favouriteTeams.includes(team.idTeam);
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const { theme, isDark } = useTheme();
  const styles = createStyles(theme, isDark);

  const handleToggleFavourite = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.3,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    dispatch(toggleTeamFavourite(team.idTeam));
  };

  const badgeUrl = team.strBadge || team.strTeamBadge;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <LinearGradient
        colors={
          isDark
            ? [theme.colors.surface, theme.colors.background]
            : ['#ffffff', '#f8f9fa']
        }
        style={styles.gradient}
      />

      <TouchableOpacity
        style={styles.favouriteButton}
        onPress={handleToggleFavourite}
        activeOpacity={0.7}
      >
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <Feather
            name="heart"
            size={24}
            color={isFavourite ? theme.colors.error : theme.colors.disabled}
          />
        </Animated.View>
      </TouchableOpacity>

      <View style={styles.imageContainer}>
        {badgeUrl ? (
          <Image
            source={{ uri: badgeUrl }}
            style={styles.image}
            resizeMode="contain"
          />
        ) : (
          <View style={styles.placeholderImage}>
            <Feather name="shield" size={48} color={theme.colors.disabled} />
          </View>
        )}
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {team.strTeam}
        </Text>

        <View style={styles.leagueContainer}>
          <Feather name="award" size={14} color={theme.colors.primary} />
          <Text style={styles.league} numberOfLines={1}>
            {team.strLeague}
          </Text>
        </View>

        {team.strStadium && (
          <View style={styles.stadiumBadge}>
            <Feather name="map-pin" size={12} color={theme.colors.textSecondary} />
            <Text style={styles.stadiumText} numberOfLines={1}>
              {team.strStadium}
            </Text>
          </View>
        )}

        {team.strDescriptionEN && (
          <Text style={styles.description} numberOfLines={2}>
            {team.strDescriptionEN}
          </Text>
        )}

        <TouchableOpacity style={styles.viewButton} onPress={onPress}>
          <Text style={styles.viewButtonText}>View Details</Text>
          <Feather name="arrow-right" size={16} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const createStyles = (theme: any, isDark: boolean) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: 20,
      marginBottom: 16,
      shadowColor: isDark ? '#000' : '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDark ? 0.5 : 0.1,
      shadowRadius: 12,
      elevation: 5,
      overflow: 'hidden',
    },
    gradient: {
      ...StyleSheet.absoluteFillObject,
      opacity: isDark ? 0.5 : 1,
    },
    favouriteButton: {
      position: 'absolute',
      top: 16,
      right: 16,
      zIndex: 10,
      backgroundColor: theme.colors.surface,
      borderRadius: 20,
      padding: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    imageContainer: {
      alignItems: 'center',
      paddingTop: 24,
      paddingBottom: 16,
    },
    image: {
      width: 100,
      height: 100,
    },
    placeholderImage: {
      width: 100,
      height: 100,
      backgroundColor: isDark ? theme.colors.background : '#f5f5f5',
      borderRadius: 50,
      justifyContent: 'center',
      alignItems: 'center',
    },
    content: {
      padding: 20,
      paddingTop: 0,
    },
    title: {
      fontSize: 22,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: 8,
    },
    leagueContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginBottom: 12,
    },
    league: {
      fontSize: 14,
      color: theme.colors.primary,
      fontWeight: '600',
      flex: 1,
    },
    stadiumBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      backgroundColor: isDark ? theme.colors.background : '#f0f0f0',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
      alignSelf: 'flex-start',
      marginBottom: 12,
    },
    stadiumText: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      fontWeight: '500',
    },
    description: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      lineHeight: 20,
      marginBottom: 16,
    },
    viewButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      backgroundColor: isDark ? theme.colors.background : '#f0f4ff',
      paddingVertical: 12,
      borderRadius: 12,
    },
    viewButtonText: {
      color: theme.colors.primary,
      fontSize: 15,
      fontWeight: '600',
    },
  });
