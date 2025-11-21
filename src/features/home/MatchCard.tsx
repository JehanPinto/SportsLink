import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { toggleTeamFavourite, selectFavouriteTeams } from '../favourites/favouritesSlice';

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

  const handleToggleFavourite = () => {
    // Animate heart
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
      {/* Background Gradient */}
      <LinearGradient
        colors={['#ffffff', '#f8f9fa']}
        style={styles.gradient}
      />

      {/* Favourite Button */}
      <TouchableOpacity
        style={styles.favouriteButton}
        onPress={handleToggleFavourite}
        activeOpacity={0.7}
      >
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <Feather
            name={isFavourite ? 'heart' : 'heart'}
            size={24}
            color={isFavourite ? '#ff3b30' : '#ddd'}
            fill={isFavourite ? '#ff3b30' : 'transparent'}
          />
        </Animated.View>
      </TouchableOpacity>

      {/* Team Badge */}
      <View style={styles.imageContainer}>
        {badgeUrl ? (
          <Image
            source={{ uri: badgeUrl }}
            style={styles.image}
            resizeMode="contain"
          />
        ) : (
          <View style={styles.placeholderImage}>
            <Feather name="shield" size={48} color="#e0e0e0" />
          </View>
        )}
      </View>

      {/* Team Info */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {team.strTeam}
        </Text>
        
        <View style={styles.leagueContainer}>
          <Feather name="award" size={14} color="#667eea" />
          <Text style={styles.league} numberOfLines={1}>
            {team.strLeague}
          </Text>
        </View>

        {team.strStadium && (
          <View style={styles.stadiumBadge}>
            <Feather name="map-pin" size={12} color="#666" />
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

        {/* Action Button */}
        <TouchableOpacity style={styles.viewButton} onPress={onPress}>
          <Text style={styles.viewButtonText}>View Details</Text>
          <Feather name="arrow-right" size={16} color="#667eea" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    overflow: 'hidden',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  favouriteButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    backgroundColor: '#fff',
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
    backgroundColor: '#f5f5f5',
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
    color: '#333',
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
    color: '#667eea',
    fontWeight: '600',
    flex: 1,
  },
  stadiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  stadiumText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    color: '#888',
    lineHeight: 20,
    marginBottom: 16,
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#f0f4ff',
    paddingVertical: 12,
    borderRadius: 12,
  },
  viewButtonText: {
    color: '#667eea',
    fontSize: 15,
    fontWeight: '600',
  },
});