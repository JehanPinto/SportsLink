import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface TeamInfoCardProps {
  team: any;
}

export default function TeamInfoCard({ team }: TeamInfoCardProps) {
  const openMap = () => {
    if (team.strStadium) {
      const query = encodeURIComponent(
        `${team.strStadium} ${team.strLocation || ''}`
      );
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
        ? parseInt(team.intStadiumCapacity).toLocaleString()
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

  return (
    <View style={styles.infoSection}>
      {infoItems.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.infoCard}
          onPress={item.onPress}
          disabled={!item.onPress}
          activeOpacity={item.onPress ? 0.7 : 1}
        >
          <View style={styles.iconCircle}>
            <Feather name={item.icon as any} size={20} color="#667eea" />
          </View>
          <View style={styles.infoText}>
            <Text style={styles.infoLabel}>{item.label}</Text>
            <Text style={styles.infoValue}>{item.value}</Text>
          </View>
          {item.onPress && (
            <Feather name="external-link" size={16} color="#999" />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  infoSection: {
    paddingHorizontal: 16,
    gap: 12,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f0f4ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoText: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
});