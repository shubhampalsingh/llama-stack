import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { api, type ChatMsg } from "../api";
import { card, colors, radii } from "../theme";

export function CompanionScreen({ hasKey }: { hasKey: boolean }) {
  const [ref, setRef] = useState("");
  const [passage, setPassage] = useState<{ reference: string; text: string } | null>(null);
  const [lookupBusy, setLookupBusy] = useState(false);

  const [chat, setChat] = useState<ChatMsg[]>([]);
  const [question, setQuestion] = useState("");
  const [asking, setAsking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function lookup() {
    if (!ref.trim() || lookupBusy) return;
    setLookupBusy(true);
    setError(null);
    try {
      const p = await api.passage(ref.trim());
      setPassage({ reference: p.reference, text: p.text });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not fetch that passage");
    } finally {
      setLookupBusy(false);
    }
  }

  async function ask() {
    if (!question.trim() || asking) return;
    const q = question.trim();
    setQuestion("");
    setAsking(true);
    setError(null);
    const history: ChatMsg[] = [...chat, { role: "user", content: q }];
    setChat(history);
    try {
      const res = await api.companion(
        history.slice(-10),
        passage?.text.slice(0, 15000),
        passage?.reference
      );
      setChat([...history, { role: "assistant", content: res.reply }]);
    } catch (e) {
      setChat(history);
      setError(e instanceof Error ? e.message : "The companion is unavailable");
    } finally {
      setAsking(false);
    }
  }

  if (!hasKey) {
    return (
      <View style={styles.loading}>
        <Text style={styles.bigEmoji}>🕯️</Text>
        <Text style={styles.mutedCenter}>
          The study companion uses your own Anthropic API key.{"\n"}Add it in the Settings
          tab to begin.
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={[card, styles.lookupCard]}>
          <Text style={styles.label}>Open a passage (optional, grounds the answers)</Text>
          <View style={styles.row}>
            <TextInput
              value={ref}
              onChangeText={setRef}
              placeholder="Romans 8:28-39"
              placeholderTextColor={colors.muted}
              autoCapitalize="words"
              style={styles.input}
            />
            <TouchableOpacity
              style={[styles.goldButton, lookupBusy && styles.disabled]}
              onPress={lookup}
              disabled={lookupBusy}
            >
              <Text style={styles.buttonText}>{lookupBusy ? "…" : "Open"}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {passage && (
          <View style={[card, styles.scriptureCard]}>
            <Text style={styles.reference}>{passage.reference}</Text>
            <Text style={styles.scripture}>{passage.text}</Text>
          </View>
        )}

        {chat.map((m, i) => (
          <View
            key={i}
            style={[card, styles.bubble, m.role === "user" ? styles.userBubble : null]}
          >
            <Text style={styles.chatText}>{m.content}</Text>
          </View>
        ))}
        {asking && (
          <View style={[card, styles.bubble]}>
            <ActivityIndicator color={colors.gold} />
          </View>
        )}
        {error && <Text style={styles.error}>{error}</Text>}

        <View style={styles.row}>
          <TextInput
            value={question}
            onChangeText={setQuestion}
            placeholder={
              passage ? `Ask about ${passage.reference}…` : "Ask about any passage…"
            }
            placeholderTextColor={colors.muted}
            style={styles.input}
          />
          <TouchableOpacity
            style={[styles.lakeButton, (asking || !question.trim()) && styles.disabled]}
            onPress={ask}
            disabled={asking || !question.trim()}
          >
            <Text style={styles.buttonText}>Ask</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, paddingBottom: 60 },
  loading: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  bigEmoji: { fontSize: 44, marginBottom: 10 },
  mutedCenter: { color: colors.muted, textAlign: "center", lineHeight: 22 },
  lookupCard: { padding: 14, marginBottom: 14 },
  label: { color: colors.muted, fontSize: 13, marginBottom: 8 },
  row: { flexDirection: "row", gap: 8, marginTop: 4 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.button,
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: colors.ink,
  },
  goldButton: {
    backgroundColor: colors.gold,
    borderRadius: radii.button,
    paddingHorizontal: 18,
    justifyContent: "center",
  },
  lakeButton: {
    backgroundColor: colors.lake,
    borderRadius: radii.button,
    paddingHorizontal: 18,
    justifyContent: "center",
  },
  buttonText: { color: colors.white, fontWeight: "700" },
  disabled: { opacity: 0.5 },
  scriptureCard: { padding: 18, marginBottom: 14 },
  reference: { color: colors.gold, fontWeight: "700", marginBottom: 8 },
  scripture: { fontSize: 16, lineHeight: 28, color: colors.ink },
  bubble: { padding: 12, marginBottom: 8 },
  userBubble: { backgroundColor: "#e8edf5", marginLeft: 32 },
  chatText: { color: colors.ink, lineHeight: 22 },
  error: { color: colors.red, fontWeight: "600", marginBottom: 8 },
});
