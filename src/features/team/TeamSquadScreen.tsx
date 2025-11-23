// src/features/team/TeamSquadScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation, RouteProp, NavigationProp } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { RootStackParamList } from '../../navigation/types';
import { useSearchPlayersQuery } from '../../api/sportsApi';
import { useTheme } from '../../context/ThemeContext';

type TeamSquadScreenRouteProp = RouteProp<RootStackParamList, 'TeamSquad'>;

export default function TeamSquadScreen() {
  const route = useRoute<TeamSquadScreenRouteProp>();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { teamName } = route.params;
  const { theme } = useTheme();

  const { data: players, isLoading } = useSearchPlayersQuery(teamName);

  const renderPlayer = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[
        styles.card,
        { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
      ]}
      onPress={() => navigation.navigate('PlayerDetails', { playerId: item.idPlayer })}
      activeOpacity={0.8}
    >
      {item.strThumb ? (
        <Image source={{ uri: item.strThumb }} style={styles.playerImage} resizeMode="cover" />
      ) : (
        <View style={[styles.placeholderImage, { backgroundColor: theme.colors.surface }]}>
          <Feather name="user" size={40} color={theme.colors.disabled} />
        </View>
      )}

      <View style={styles.playerInfo}>
        <Text style={[styles.playerName, { color: theme.colors.text }]} numberOfLines={1}>
          {item.strPlayer}
        </Text>
        {item.strPosition && (
          <Text style={[styles.playerPosition, { color: theme.colors.textSecondary }]}>
            {item.strPosition}
          </Text>
        )}
        {item.strNumber && (
          <View style={[styles.numberBadge, { backgroundColor: `${theme.colors.primary}20` }]}>
            <Text style={[styles.numberText, { color: theme.colors.primary }]}>
              #{item.strNumber}
            </Text>
          </View>
        )}
      </View>

      <Feather name="chevron-right" size={20} color={theme.colors.textSecondary} />
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        edges={['top']}
      >
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={['top']}
    >
      {/* Header */}
      <View
        style={[
          styles.header,
          { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border },
        ]}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Feather name="arrow-left" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>{teamName} Squad</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Players List */}
      <FlatList
        data={players || []}
        renderItem={renderPlayer}
        keyExtractor={(item) => item.idPlayer}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Feather name="users" size={50} color={theme.colors.disabled} />
            <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
              No players found
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  list: {
    padding: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  playerImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  placeholderImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  playerPosition: {
    fontSize: 13,
    marginBottom: 4,
  },
  numberBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  numberText: {
    fontSize: 12,
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
  },
});
