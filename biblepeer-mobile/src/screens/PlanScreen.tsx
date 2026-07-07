import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { api, type PlanData } from "../api";
import { card, colors } from "../theme";

export function PlanScreen({ planId }: { planId: string }) {
  const [data, setData] = useState<PlanData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busyDay, setBusyDay] = useState<number | null>(null);

  useEffect(() => {
    api
      .plan(planId)
      .then(setData)
      .catch((e) => setError(e instanceof Error ? e.message : "Could not load"));
  }, [planId]);

  async function toggle(day: number) {
    if (!data || busyDay !== null) return;
    setBusyDay(day);
    const wasDone = data.doneDays.includes(day);
    setData({
      ...data,
      doneDays: wasDone ? data.doneDays.filter((d) => d !== day) : [...data.doneDays, day],
    });
    try {
      await api.toggleDay(planId, day);
    } catch {
      setData((d) =>
        d
          ? {
              ...d,
              doneDays: wasDone ? [...d.doneDays, day] : d.doneDays.filter((x) => x !== day),
            }
          : d
      );
    } finally {
      setBusyDay(null);
    }
  }

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

  const nextDay = data.days.find((d) => !data.doneDays.includes(d.day))?.day;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>
        {data.emoji} {data.name}
      </Text>
      <Text style={styles.description}>{data.description}</Text>
      {data.streak > 0 && <Text style={styles.streak}>🕯️ {data.streak}-day streak</Text>}

      <View style={{ marginTop: 16 }}>
        {data.days.map((d) => {
          const isDone = data.doneDays.includes(d.day);
          const isNext = d.day === nextDay;
          return (
            <TouchableOpacity
              key={d.day}
              style={[
                card,
                styles.dayRow,
                isNext && { borderColor: colors.gold },
                isDone && { opacity: 0.65 },
              ]}
              onPress={() => toggle(d.day)}
              disabled={busyDay !== null}
            >
              <View style={[styles.check, isDone && styles.checkDone]}>
                {isDone && <Text style={styles.checkMark}>✓</Text>}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.dayTitle, isDone && styles.strike]}>
                  Day {d.day}: <Text style={styles.dayRef}>{d.reference}</Text>
                </Text>
                {d.note ? <Text style={styles.dayNote}>{d.note}</Text> : null}
              </View>
              {isNext && <Text style={styles.today}>today</Text>}
            </TouchableOpacity>
          );
        })}
      </View>
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
  title: { fontSize: 24, fontWeight: "700", color: colors.ink },
  description: { color: colors.muted, marginTop: 6, lineHeight: 21 },
  streak: { color: colors.gold, fontWeight: "700", marginTop: 8 },
  dayRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    marginBottom: 8,
  },
  check: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  checkDone: { backgroundColor: colors.olive, borderColor: colors.olive },
  checkMark: { color: colors.white, fontWeight: "800" },
  dayTitle: { color: colors.ink, fontWeight: "600", fontSize: 14 },
  dayRef: { color: colors.lake },
  strike: { textDecorationLine: "line-through" },
  dayNote: { color: colors.muted, fontSize: 12, fontStyle: "italic", marginTop: 2 },
  today: {
    color: colors.gold,
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  error: { color: colors.red, fontWeight: "600", padding: 20, textAlign: "center" },
});
