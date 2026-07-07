import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { api, type CircleData } from "../api";
import { card, colors } from "../theme";

export function CircleScreen({
  circleId,
  onOpenStudy,
}: {
  circleId: string;
  onOpenStudy: (id: string) => void;
}) {
  const [data, setData] = useState<CircleData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .circle(circleId)
      .then(setData)
      .catch((e) => setError(e instanceof Error ? e.message : "Could not load"));
  }, [circleId]);

  if (error) {
    return (
      <View style={styles.loading}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }
  if (!data) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.gold} size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>
        {data.emoji} {data.name}
      </Text>
      {data.description ? <Text style={styles.description}>{data.description}</Text> : null}
      <Text style={styles.members}>
        {data.members.length} member{data.members.length === 1 ? "" : "s"}:{" "}
        {data.members.slice(0, 6).join(", ")}
        {data.members.length > 6 ? ` +${data.members.length - 6} more` : ""}
      </Text>

      {data.inviteCode && (
        <View style={[card, styles.inviteCard]}>
          <Text style={styles.inviteLabel}>Invite code — share it with your people</Text>
          <Text style={styles.inviteCode}>{data.inviteCode}</Text>
        </View>
      )}

      <Text style={styles.heading}>Studies</Text>
      {data.studies.length === 0 ? (
        <View style={[card, styles.empty]}>
          <Text style={styles.emptyText}>
            📖 No studies yet. Open one from biblepeer.com — reading and reflections work
            right here.
          </Text>
        </View>
      ) : (
        data.studies.map((s) => (
          <TouchableOpacity
            key={s.id}
            style={[card, styles.studyCard]}
            onPress={() => onOpenStudy(s.id)}
          >
            <View style={styles.studyRow}>
              <Text style={styles.studyTitle}>{s.title}</Text>
              <Text style={styles.studyRef}>{s.reference}</Text>
            </View>
            <Text style={styles.studyMeta}>
              💬 {s.reflections} reflection{s.reflections === 1 ? "" : "s"} ·{" "}
              {new Date(s.createdAt).toLocaleDateString()}
            </Text>
          </TouchableOpacity>
        ))
      )}
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
  title: { fontSize: 26, fontWeight: "700", color: colors.ink },
  description: { color: colors.muted, marginTop: 6, lineHeight: 20 },
  members: { color: colors.muted, fontSize: 12, marginTop: 8, marginBottom: 14 },
  inviteCard: {
    borderColor: colors.goldSoft,
    backgroundColor: "#fdf8ec",
    padding: 14,
    marginBottom: 18,
  },
  inviteLabel: { color: colors.muted, fontSize: 12 },
  inviteCode: {
    color: colors.gold,
    fontWeight: "800",
    fontSize: 22,
    letterSpacing: 3,
    marginTop: 4,
  },
  heading: { fontSize: 19, fontWeight: "700", color: colors.ink, marginBottom: 10 },
  empty: { padding: 20 },
  emptyText: { color: colors.muted, lineHeight: 20 },
  studyCard: { padding: 16, marginBottom: 10 },
  studyRow: { flexDirection: "row", justifyContent: "space-between", gap: 10 },
  studyTitle: { fontSize: 16, fontWeight: "700", color: colors.ink, flexShrink: 1 },
  studyRef: { color: colors.gold, fontWeight: "600", fontSize: 13 },
  studyMeta: { color: colors.muted, fontSize: 12, marginTop: 6 },
  error: { color: colors.red, fontWeight: "600", padding: 20, textAlign: "center" },
});
