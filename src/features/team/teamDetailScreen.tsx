import { Feather } from "@expo/vector-icons";
import { RouteProp, useNavigation, useRoute, NavigationProp } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  useGetLastEventsQuery,
  useGetNextEventsQuery,
} from "../../api/sportsApi";
import { RootStackParamList } from "../../navigation/types";
import EventCard from "./EventCard";
import TeamAbout from "./TeamAbout";
import TeamBadge from "./TeamBadge";
import TeamHeader from "./TeamHeader";
import TeamInfoCard from "./TeamInfoCard";
import TeamSocial from "./TeamSocial";

type TeamDetailScreenRouteProp = RouteProp<RootStackParamList, "TeamDetail">;

export default function TeamDetailScreen() {
  const route = useRoute<TeamDetailScreenRouteProp>();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>(); // FIX: Added type
  const { team } = route.params;
  const [refreshing, setRefreshing] = useState(false);

  // Fetch next and last events
  const {
    data: nextEvents,
    isLoading: isLoadingNext,
    refetch: refetchNext,
  } = useGetNextEventsQuery(team.idTeam);

  const {
    data: lastEvents,
    isLoading: isLoadingLast,
    refetch: refetchLast,
  } = useGetLastEventsQuery(team.idTeam);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refetchNext(), refetchLast()]);
    setRefreshing(false);
  }, [refetchNext, refetchLast]);

  if (!team) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#667eea" />
          <Text style={styles.loadingText}>Loading team details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <TeamHeader team={team} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#667eea"
            colors={["#667eea"]}
          />
        }
      >
        {/* Team Badge */}
        <TeamBadge
          badgeUrl={team.strBadge || team.strTeamBadge}
          teamName={team.strTeam}
        />

        {/* Team Name */}
        <Text style={styles.teamName}>{team.strTeam}</Text>
        <Text style={styles.league}>{team.strLeague}</Text>

        {/* Info Cards */}
        <TeamInfoCard team={team} />

        {/* View Squad Button */}
        <TouchableOpacity
          style={styles.squadButton}
          onPress={() =>
            navigation.navigate("TeamSquad", { teamName: team.strTeam })
          }
        >
          <Feather name="users" size={20} color="#667eea" />
          <Text style={styles.squadButtonText}>View Full Squad</Text>
          <Feather name="chevron-right" size={20} color="#667eea" />
        </TouchableOpacity>

        {/* Next 5 Events */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="calendar" size={20} color="#667eea" />
            <Text style={styles.sectionTitle}>Upcoming Matches</Text>
          </View>

          {isLoadingNext ? (
            <View style={styles.loadingSection}>
              <ActivityIndicator size="small" color="#667eea" />
            </View>
          ) : nextEvents && nextEvents.length > 0 ? (
            nextEvents
              .slice(0, 5)
              .map((event) => (
                <EventCard
                  key={event.idEvent}
                  event={event}
                  isUpcoming={true}
                />
              ))
          ) : (
            <View style={styles.emptySection}>
              <Feather name="inbox" size={40} color="#ddd" />
              <Text style={styles.emptyText}>No upcoming matches</Text>
            </View>
          )}
        </View>

        {/* Last 5 Events */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="clock" size={20} color="#666" />
            <Text style={styles.sectionTitle}>Recent Matches</Text>
          </View>

          {isLoadingLast ? (
            <View style={styles.loadingSection}>
              <ActivityIndicator size="small" color="#667eea" />
            </View>
          ) : lastEvents && lastEvents.length > 0 ? (
            lastEvents
              .slice(0, 5)
              .map((event) => (
                <EventCard
                  key={event.idEvent}
                  event={event}
                  isUpcoming={false}
                />
              ))
          ) : (
            <View style={styles.emptySection}>
              <Feather name="inbox" size={40} color="#ddd" />
              <Text style={styles.emptyText}>No recent matches</Text>
            </View>
          )}
        </View>

        {/* Description */}
        <TeamAbout description={team.strDescriptionEN} />

        {/* Social Links */}
        <TeamSocial team={team} />

        {/* Bottom Padding */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    color: "#666",
    fontSize: 16,
  },
  teamName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    paddingHorizontal: 20,
    marginTop: 8,
  },
  league: {
    fontSize: 16,
    color: "#667eea",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 24,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  loadingSection: {
    padding: 40,
    alignItems: "center",
  },
  emptySection: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    marginTop: 12,
    fontSize: 14,
    color: "#999",
  },
  squadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  squadButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#667eea",
  },
});