import React, { useState } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface TeamBadgeProps {
  badgeUrl?: string;
  teamName: string;
}

export default function TeamBadge({ badgeUrl }: TeamBadgeProps) {
  const [imageError, setImageError] = useState(false);

  if (!badgeUrl || imageError) {
    return (
      <View style={styles.badgeContainer}>
        <View style={styles.placeholderBadge}>
          <Feather name="shield" size={80} color="#ccc" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.badgeContainer}>
      <Image
        source={{ uri: badgeUrl }}
        style={styles.badge}
        resizeMode="contain"
        onError={() => setImageError(true)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  badgeContainer: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: '#fff',
  },
  badge: {
    width: 150,
    height: 150,
  },
  placeholderBadge: {
    width: 150,
    height: 150,
    backgroundColor: '#f0f0f0',
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
