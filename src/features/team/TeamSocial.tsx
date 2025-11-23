// src/features/team/TeamSocial.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../..//context/ThemeContext';
interface Team {
  strWebsite?: string;
  strFacebook?: string;
  strTwitter?: string;
  strInstagram?: string;
  strYoutube?: string;
  [key: string]: any;
}

interface TeamSocialProps {
  team: Team;
}

export default function TeamSocial({ team }: TeamSocialProps) {
  const { theme, isDark } = useTheme();

  const openUrl = (url?: string) => {
    if (!url) return;
    const fullUrl = url.startsWith('http') ? url : `https://${url}`;
    Linking.openURL(fullUrl).catch((err) => console.warn('Error opening URL:', err));
  };

  const socialLinks = [
    { icon: 'globe', label: 'Website', url: team.strWebsite },
    { icon: 'facebook', label: 'Facebook', url: team.strFacebook },
    { icon: 'twitter', label: 'Twitter', url: team.strTwitter },
    { icon: 'instagram', label: 'Instagram', url: team.strInstagram },
    { icon: 'youtube', label: 'YouTube', url: team.strYoutube },
  ].filter((l) => l.url);

  if (socialLinks.length === 0) return null;

  const styles = createStyles(theme, isDark);

  return (
    <View style={styles.socialSection}>
      <Text style={styles.sectionTitle}>Connect</Text>
      <View style={styles.socialButtons}>
        {socialLinks.map((link, index) => (
          <TouchableOpacity
            key={index}
            style={styles.socialBtn}
            onPress={() => openUrl(link.url)}
            activeOpacity={0.75}
          >
            <Feather name={link.icon as any} size={18} color={theme.colors.primary} />
            <Text style={styles.socialText}>{link.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const createStyles = (theme: any, isDark: boolean) =>
  StyleSheet.create({
    socialSection: {
      padding: 16,
      paddingBottom: 32,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: 12,
    },
    socialButtons: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    socialBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 12,
      gap: 8,
      marginRight: 8,
      marginBottom: 8,
      shadowColor: isDark ? '#000' : '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.06 : 0.04,
      shadowRadius: 8,
      elevation: 2,
      borderWidth: isDark ? 1 : 0,
      borderColor: isDark ? theme.colors.border : 'transparent',
    },
    socialText: {
      fontSize: 14,
      color: theme.colors.text,
      fontWeight: '600',
      marginLeft: 8,
    },
  });
