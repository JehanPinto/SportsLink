import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface TeamSocialProps {
  team: any;
}

export default function TeamSocial({ team }: TeamSocialProps) {
  const openUrl = (url: string) => {
    if (url) {
      const fullUrl = url.startsWith('http') ? url : `https://${url}`;
      Linking.openURL(fullUrl).catch((err) =>
        console.warn('Error opening URL:', err)
      );
    }
  };

  const socialLinks = [
    {
      icon: 'globe',
      label: 'Website',
      url: team.strWebsite,
    },
    {
      icon: 'facebook',
      label: 'Facebook',
      url: team.strFacebook,
    },
    {
      icon: 'twitter',
      label: 'Twitter',
      url: team.strTwitter,
    },
    {
      icon: 'instagram',
      label: 'Instagram',
      url: team.strInstagram,
    },
    {
      icon: 'youtube',
      label: 'YouTube',
      url: team.strYoutube,
    },
  ].filter((link) => link.url);

  if (socialLinks.length === 0) return null;

  return (
    <View style={styles.socialSection}>
      <Text style={styles.sectionTitle}>Connect</Text>
      <View style={styles.socialButtons}>
        {socialLinks.map((link, index) => (
          <TouchableOpacity
            key={index}
            style={styles.socialBtn}
            onPress={() => openUrl(link.url)}
          >
            <Feather name={link.icon as any} size={20} color="#667eea" />
            <Text style={styles.socialText}>{link.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  socialSection: {
    padding: 16,
    paddingBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
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
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  socialText: {
    fontSize: 14,
    color: '#667eea',
    fontWeight: '600',
  },
});