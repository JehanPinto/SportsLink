// src/features/players/PlayerDetailsScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation, RouteProp, NavigationProp } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { RootStackParamList } from '../../navigation/types';
import { useLookupPlayerQuery } from '../../api/sportsApi';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { togglePlayerFavourite, selectFavouritePlayers } from '../favourites/favouritesSlice';
import { useTheme } from '../../context/ThemeContext';

type PlayerDetailsScreenRouteProp = RouteProp<RootStackParamList, 'PlayerDetails'>;

export default function PlayerDetailsScreen() {
  const route = useRoute<PlayerDetailsScreenRouteProp>();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const dispatch = useAppDispatch();
  const { playerId } = route.params;
  const { theme, isDark } = useTheme();
  const styles = createStyles(theme, isDark);

  const { data: player, isLoading, error } = useLookupPlayerQuery(playerId);
  const favouritePlayers = useAppSelector(selectFavouritePlayers);
  const isFavourite = favouritePlayers.includes(playerId);

  const handleFavouriteToggle = () => {
    dispatch(togglePlayerFavourite(playerId));
  };

  const openLink = (url: string) => {
    if (url) {
      Linking.openURL(url).catch(() => {
        console.log('Failed to open URL');
      });
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading player details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !player) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.centered}>
          <Feather name="alert-circle" size={50} color={theme.colors.error} />
          <Text style={styles.errorText}>Failed to load player details</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => navigation.goBack()}>
            <Text style={styles.retryText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Player Details</Text>
        <TouchableOpacity onPress={handleFavouriteToggle} style={styles.favouriteButton}>
          <Feather
            name="heart"
            size={24}
            color={isFavourite ? theme.colors.error : theme.colors.disabled}
          />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {player.strThumb && (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: player.strThumb }}
              style={styles.playerImage}
              resizeMode="cover"
            />
            <View style={styles.imageOverlay} />
          </View>
        )}

        <View style={styles.infoCard}>
          <Text style={styles.playerName}>{player.strPlayer}</Text>

          {player.strPosition && (
            <View style={styles.positionBadge}>
              <Feather name="user" size={14} color={theme.colors.primary} />
              <Text style={styles.positionText}>{player.strPosition}</Text>
            </View>
          )}

          {player.strTeam && (
            <View style={styles.teamRow}>
              <Feather name="shield" size={16} color={theme.colors.textSecondary} />
              <Text style={styles.teamText}>{player.strTeam}</Text>
            </View>
          )}

          {player.strNationality && (
            <View style={styles.teamRow}>
              <Feather name="flag" size={16} color={theme.colors.textSecondary} />
              <Text style={styles.teamText}>{player.strNationality}</Text>
            </View>
          )}
        </View>

        <View style={styles.statsGrid}>
          {player.dateBorn && (
            <StatCard icon="calendar" label="Birth Date" value={formatDate(player.dateBorn)} />
          )}
          {player.strHeight && (
            <StatCard icon="trending-up" label="Height" value={player.strHeight} />
          )}
          {player.strWeight && <StatCard icon="activity" label="Weight" value={player.strWeight} />}
          {player.strNumber && <StatCard icon="hash" label="Number" value={player.strNumber} />}
        </View>

        {player.strDescriptionEN && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Feather name="file-text" size={20} color={theme.colors.primary} />
              <Text style={styles.sectionTitle}>Biography</Text>
            </View>
            <View style={styles.bioCard}>
              <Text style={styles.bioText}>{player.strDescriptionEN}</Text>
            </View>
          </View>
        )}

        {(player.strBirthLocation || player.strSigning || player.strWage) && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Feather name="info" size={20} color={theme.colors.primary} />
              <Text style={styles.sectionTitle}>Additional Info</Text>
            </View>
            <View style={styles.infoDetailCard}>
              {player.strBirthLocation && (
                <InfoRow label="Birth Place" value={player.strBirthLocation} />
              )}
              {player.strSigning && <InfoRow label="Signed" value={player.strSigning} />}
              {player.strWage && <InfoRow label="Wage" value={player.strWage} />}
            </View>
          </View>
        )}

        {(player.strFacebook || player.strTwitter || player.strInstagram) && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Feather name="share-2" size={20} color={theme.colors.primary} />
              <Text style={styles.sectionTitle}>Social Media</Text>
            </View>
            <View style={styles.socialContainer}>
              {player.strFacebook && (
                <TouchableOpacity
                  style={styles.socialButton}
                  onPress={() => openLink(player.strFacebook!)}
                >
                  <Feather name="facebook" size={20} color="#1877f2" />
                  <Text style={styles.socialText}>Facebook</Text>
                </TouchableOpacity>
              )}
              {player.strTwitter && (
                <TouchableOpacity
                  style={styles.socialButton}
                  onPress={() => openLink(player.strTwitter!)}
                >
                  <Feather name="twitter" size={20} color="#1da1f2" />
                  <Text style={styles.socialText}>Twitter</Text>
                </TouchableOpacity>
              )}
              {player.strInstagram && (
                <TouchableOpacity
                  style={styles.socialButton}
                  onPress={() => openLink(player.strInstagram!)}
                >
                  <Feather name="instagram" size={20} color="#e4405f" />
                  <Text style={styles.socialText}>Instagram</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function StatCard({ icon, label, value }: { icon: string; label: string; value: string }) {
  const { theme, isDark } = useTheme();
  const styles = statStyles(theme, isDark);

  return (
    <View style={styles.statCard}>
      <Feather name={icon as any} size={24} color={theme.colors.primary} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  const { theme } = useTheme();
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
      }}
    >
      <Text style={{ fontSize: 14, color: theme.colors.textSecondary }}>{label}</Text>
      <Text
        style={{
          fontSize: 14,
          fontWeight: '600',
          color: theme.colors.text,
          flex: 1,
          textAlign: 'right',
        }}
      >
        {value}
      </Text>
    </View>
  );
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

const createStyles = (theme: any, isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    centered: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 40,
    },
    loadingText: {
      marginTop: 12,
      color: theme.colors.textSecondary,
      fontSize: 16,
    },
    errorText: {
      marginTop: 12,
      color: theme.colors.error,
      fontSize: 16,
      textAlign: 'center',
    },
    retryButton: {
      marginTop: 20,
      backgroundColor: theme.colors.primary,
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
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    backButton: {
      width: 40,
      height: 40,
      justifyContent: 'center',
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.colors.text,
    },
    favouriteButton: {
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'flex-end',
    },
    imageContainer: {
      height: 300,
      position: 'relative',
    },
    playerImage: {
      width: '100%',
      height: '100%',
    },
    imageOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0,0,0,0.1)',
    },
    infoCard: {
      backgroundColor: theme.colors.surface,
      marginHorizontal: 20,
      marginTop: -40,
      borderRadius: 20,
      padding: 24,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDark ? 0.5 : 0.1,
      shadowRadius: 12,
      elevation: 5,
    },
    playerName: {
      fontSize: 28,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: 12,
    },
    positionBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      backgroundColor: isDark ? theme.colors.background : '#f0f4ff',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      alignSelf: 'flex-start',
      marginBottom: 16,
    },
    positionText: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.primary,
    },
    teamRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginTop: 8,
    },
    teamText: {
      fontSize: 16,
      color: theme.colors.textSecondary,
    },
    statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingHorizontal: 20,
      marginTop: 20,
      gap: 12,
    },
    section: {
      paddingHorizontal: 20,
      marginTop: 24,
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
      color: theme.colors.text,
    },
    bioCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.4 : 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    bioText: {
      fontSize: 15,
      color: theme.colors.textSecondary,
      lineHeight: 24,
    },
    infoDetailCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      padding: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.4 : 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    socialContainer: {
      flexDirection: 'row',
      gap: 12,
      flexWrap: 'wrap',
    },
    socialButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      backgroundColor: theme.colors.surface,
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.4 : 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    socialText: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.text,
    },
  });

const statStyles = (theme: any, isDark: boolean) =>
  StyleSheet.create({
    statCard: {
      width: '48%',
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      padding: 20,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.4 : 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    statValue: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginTop: 12,
    },
    statLabel: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginTop: 4,
    },
  });
