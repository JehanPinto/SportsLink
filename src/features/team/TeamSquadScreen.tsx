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

type TeamSquadScreenRouteProp = RouteProp<RootStackParamList, 'TeamSquad'>;

export default function TeamSquadScreen() {
  const route = useRoute<TeamSquadScreenRouteProp>();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { teamName } = route.params;

  const { data: players, isLoading } = useSearchPlayersQuery(teamName);

  const renderPlayer = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.playerCard}
      onPress={() => navigation.navigate('PlayerDetails', { playerId: item.idPlayer })}
    >
      {item.strThumb ? (
        <Image 
          source={{ uri: item.strThumb }} 
          style={styles.playerImage}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.placeholderImage}>
          <Feather name="user" size={40} color="#ddd" />
        </View>
      )}
      
      <View style={styles.playerInfo}>
        <Text style={styles.playerName} numberOfLines={1}>
          {item.strPlayer}
        </Text>
        {item.strPosition && (
          <Text style={styles.playerPosition}>{item.strPosition}</Text>
        )}
        {item.strNumber && (
          <View style={styles.numberBadge}>
            <Text style={styles.numberText}>#{item.strNumber}</Text>
          </View>
        )}
      </View>

      <Feather name="chevron-right" size={20} color="#999" />
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#667eea" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Feather name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{teamName} Squad</Text>
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
            <Feather name="users" size={50} color="#ddd" />
            <Text style={styles.emptyText}>No players found</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
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
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  list: {
    padding: 20,
  },
  playerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  playerPosition: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  numberBadge: {
    backgroundColor: '#f0f4ff',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  numberText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#667eea',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: '#999',
  },
});