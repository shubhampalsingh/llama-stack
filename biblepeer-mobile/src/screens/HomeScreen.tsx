import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { api, type HomeData } from "../api";
import { card, colors, radii } from "../theme";

export function HomeScreen({
  onOpenCircle,
  onOpenPlan,
}: {
  onOpenCircle: (id: string) => void;
  onOpenPlan: (id: string) => void;
}) {
  const [data, setData] = useState<HomeData | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [joinBusy, setJoinBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setData(await api.home());
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function join() {
    if (!joinCode.trim() || joinBusy) return;
    setJoinBusy(true);
    try {
      const res = await api.join(joinCode.trim().toLowerCase());
      setJoinCode("");
      await load();
      onOpenCircle(res.circleId);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not join");
    } finally {
      setJoinBusy(false);
    }
  }

  if (!data) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.gold} size="large" />
        {error && <Text style={styles.error}>{error}</Text>}
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={async () => {
            setRefreshing(true);
            await load();
            setRefreshing(false);
          }}
          tintColor={colors.gold}
        />
      }
    >
      {data.streak > 0 && (
        <View style={[card, styles.streakCard]}>
          <Text style={styles.streakText}>
            🕯️ {data.streak}-day reading streak. Keep the lamp lit.
          </Text>
        </View>
      )}

      <Text style={styles.heading}>Your circles</Text>
      {data.circles.length === 0 ? (
        <View style={[card, styles.empty]}>
          <Text style={styles.emptyEmoji}>🫂</Text>
          <Text style={styles.emptyText}>
            No circles yet. Join one with an invite code below, or start one at
            biblepeer.com.
          </Text>
        </View>
      ) : (
        data.circles.map((c) => (
          <TouchableOpacity
            key={c.id}
            style={[card, styles.circleCard]}
            onPress={() => onOpenCircle(c.id)}
          >
            <Text style={styles.circleName}>
              {c.emoji} {c.name}
              {c.role === "OWNER" && <Text style={styles.shepherd}>  shepherd</Text>}
            </Text>
            <Text style={styles.circleMeta}>
              {c.members} member{c.members === 1 ? "" : "s"} · {c.studies} stud
              {c.studies === 1 ? "y" : "ies"}
              {c.latestStudy ? ` · latest: “${c.latestStudy.title}”` : ""}
            </Text>
          </TouchableOpacity>
        ))
      )}

      {/* Join by code */}
      <View style={[card, styles.joinCard]}>
        <Text style={styles.joinLabel}>Join a circle</Text>
        <View style={styles.joinRow}>
          <TextInput
            value={joinCode}
            onChangeText={setJoinCode}
            placeholder="invite code"
            placeholderTextColor={colors.muted}
            autoCapitalize="none"
            style={styles.joinInput}
          />
          <TouchableOpacity
            style={[styles.joinButton, joinBusy && { opacity: 0.5 }]}
            onPress={join}
            disabled={joinBusy}
          >
            <Text style={styles.joinButtonText}>{joinBusy ? "…" : "Join"}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.heading}>Reading plans</Text>
      {data.plans.map((p) => {
        const pct = Math.round((p.doneDays / p.totalDays) * 100);
        return (
          <TouchableOpacity
            key={p.id}
            style={[card, styles.planCard]}
            onPress={() => onOpenPlan(p.id)}
          >
            <Text style={styles.planName}>
              {p.emoji} {p.name}
            </Text>
            <View style={styles.track}>
              <View style={[styles.fill, { width: `${pct}%` }]} />
            </View>
            <Text style={styles.planMeta}>
              {p.doneDays > 0 ? `${p.doneDays}/${p.totalDays} days · ${pct}%` : `${p.totalDays} days`}
            </Text>
          </TouchableOpacity>
        );
      })}

      {error && <Text style={styles.error}>{error}</Text>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, paddingBottom: 40 },
  loading: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  streakCard: {
    borderColor: colors.goldSoft,
    backgroundColor: "#fdf8ec",
    padding: 14,
    marginBottom: 16,
  },
  streakText: { color: colors.ink, fontWeight: "600" },
  heading: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.ink,
    marginBottom: 10,
    marginTop: 8,
  },
  empty: { padding: 24, alignItems: "center", marginBottom: 14 },
  emptyEmoji: { fontSize: 32, marginBottom: 6 },
  emptyText: { color: colors.muted, textAlign: "center", lineHeight: 20 },
  circleCard: { padding: 16, marginBottom: 10 },
  circleName: { fontSize: 17, fontWeight: "700", color: colors.ink },
  shepherd: { fontSize: 11, color: colors.gold, fontWeight: "700" },
  circleMeta: { color: colors.muted, marginTop: 4, fontSize: 13 },
  joinCard: { padding: 14, marginTop: 4, marginBottom: 18 },
  joinLabel: { fontWeight: "700", color: colors.ink, marginBottom: 8 },
  joinRow: { flexDirection: "row", gap: 8 },
  joinInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.button,
    backgroundColor: colors.background,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: colors.ink,
  },
  joinButton: {
    backgroundColor: colors.lake,
    borderRadius: radii.button,
    paddingHorizontal: 18,
    justifyContent: "center",
  },
  joinButtonText: { color: colors.white, fontWeight: "700" },
  planCard: { padding: 16, marginBottom: 10 },
  planName: { fontSize: 16, fontWeight: "700", color: colors.ink },
  track: {
    height: 6,
    backgroundColor: colors.surface2,
    borderRadius: 3,
    marginTop: 10,
    overflow: "hidden",
  },
  fill: { height: 6, backgroundColor: colors.olive, borderRadius: 3 },
  planMeta: { color: colors.muted, fontSize: 12, marginTop: 6 },
  error: { color: colors.red, marginTop: 12, fontWeight: "600" },
});
