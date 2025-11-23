// src/features/team/TeamInfoCard.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

interface Team {
  idTeam?: string;
  strStadium?: string;
  strLocation?: string;
  intStadiumCapacity?: string | number;
  intFormedYear?: string | number;
  [key: string]: any;
}

interface TeamInfoCardProps {
  team: Team;
}

export default function TeamInfoCard({ team }: TeamInfoCardProps) {
  const { theme, isDark } = useTheme();

  const openMap = () => {
    if (team.strStadium) {
      const query = encodeURIComponent(`${team.strStadium} ${team.strLocation || ''}`);
      const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
      Linking.openURL(url).catch((err) => console.warn('Error opening map:', err));
    }
  };

  const infoItems = [
    {
      icon: 'map-pin',
      label: 'Stadium',
      value: team.strStadium,
      onPress: openMap,
    },
    {
      icon: 'users',
      label: 'Capacity',
      value: team.intStadiumCapacity
        ? Number(team.intStadiumCapacity).toLocaleString()
        : null,
    },
    {
      icon: 'calendar',
      label: 'Founded',
      value: team.intFormedYear,
    },
    {
      icon: 'map',
      label: 'Location',
      value: team.strLocation,
    },
  ].filter((item) => item.value);

  if (infoItems.length === 0) return null;

  const styles = createStyles(theme, isDark);

  return (
    <View style={styles.infoSection}>
      {infoItems.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.infoCard}
          onPress={item.onPress}
          disabled={!item.onPress}
          activeOpacity={item.onPress ? 0.75 : 1}
        >
          <View style={[styles.iconCircle, { backgroundColor: theme.colors.card }]}>
            <Feather name={item.icon as any} size={18} color={theme.colors.primary} />
          </View>

          <View style={styles.infoText}>
            <Text style={styles.infoLabel}>{item.label}</Text>
            <Text style={styles.infoValue}>{item.value}</Text>
          </View>

          {item.onPress && (
            <Feather name="external-link" size={16} color={theme.colors.textSecondary} />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
}

const createStyles = (theme: any, isDark: boolean) =>
  StyleSheet.create({
    infoSection: {
      paddingHorizontal: 16,
      gap: 12,
    },
    infoCard: {
      flexDirection: 'row',
      backgroundColor: theme.colors.surface,
      padding: 16,
      borderRadius: 16,
      alignItems: 'center',
      gap: 12,
      // subtle shadow / border depending on platform and theme
      shadowColor: isDark ? '#000' : '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.08 : 0.06,
      shadowRadius: 8,
      elevation: 2,
      borderWidth: isDark ? 1 : 0,
      borderColor: isDark ? theme.colors.border : 'transparent',
    },
    iconCircle: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: 'center',
      alignItems: 'center',
    },
    infoText: {
      flex: 1,
    },
    infoLabel: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginBottom: 4,
    },
    infoValue: {
      fontSize: 16,
      color: theme.colors.text,
      fontWeight: '600',
    },
  });
