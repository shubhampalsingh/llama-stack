import { useEffect, useState } from "react";
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
import { api, type ChatMsg, type StudyData } from "../api";
import { card, colors, radii } from "../theme";

export function StudyScreen({ studyId, hasKey }: { studyId: string; hasKey: boolean }) {
  const [data, setData] = useState<StudyData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Reflection form
  const [text, setText] = useState("");
  const [posting, setPosting] = useState(false);

  // Companion
  const [chat, setChat] = useState<ChatMsg[]>([]);
  const [question, setQuestion] = useState("");
  const [asking, setAsking] = useState(false);

  useEffect(() => {
    api
      .study(studyId)
      .then(setData)
      .catch((e) => setError(e instanceof Error ? e.message : "Could not load"));
  }, [studyId]);

  async function postReflection() {
    if (!data || !text.trim() || posting) return;
    setPosting(true);
    try {
      const r = await api.postReflection(studyId, text.trim());
      setData({ ...data, reflections: [...data.reflections, r] });
      setText("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not post");
    } finally {
      setPosting(false);
    }
  }

  async function ask() {
    if (!data || !question.trim() || asking) return;
    const q = question.trim();
    setQuestion("");
    setAsking(true);
    const history: ChatMsg[] = [...chat, { role: "user", content: q }];
    setChat(history);
    try {
      const res = await api.companion(
        history.slice(-10),
        data.passageText.slice(0, 15000),
        data.reference
      );
      setChat([...history, { role: "assistant", content: res.reply }]);
    } catch (e) {
      setChat(history);
      setError(e instanceof Error ? e.message : "The companion is unavailable");
    } finally {
      setAsking(false);
    }
  }

  if (error && !data) {
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
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>{data.title}</Text>
        <Text style={styles.reference}>
          {data.reference} · {data.translation}
        </Text>

        {/* Scripture */}
        <View style={[card, styles.scriptureCard]}>
          <Text style={styles.scripture}>{data.passageText}</Text>
          <Text style={styles.ornament}>✦</Text>
        </View>

        {/* Reflections */}
        <Text style={styles.heading}>💬 Reflections ({data.reflections.length})</Text>
        {data.reflections.length === 0 && (
          <Text style={styles.muted}>What stood out to you in this passage?</Text>
        )}
        {data.reflections.map((r) => (
          <View key={r.id} style={[card, styles.reflection]}>
            <Text style={styles.reflectionText}>{r.content}</Text>
            <Text style={styles.reflectionMeta}>
              — {r.userName} · {new Date(r.createdAt).toLocaleDateString()}
            </Text>
          </View>
        ))}

        {data.isMember && (
          <View style={[card, styles.form]}>
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="Share what this passage says to you…"
              placeholderTextColor={colors.muted}
              multiline
              style={styles.textarea}
            />
            <TouchableOpacity
              style={[styles.button, (posting || !text.trim()) && styles.disabled]}
              onPress={postReflection}
              disabled={posting || !text.trim()}
            >
              <Text style={styles.buttonText}>
                {posting ? "Sharing…" : "Share reflection"}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Companion */}
        <Text style={styles.heading}>🕯️ Study companion</Text>
        {!hasKey ? (
          <Text style={styles.muted}>
            The companion uses your Anthropic API key — add it in Settings.
          </Text>
        ) : (
          <>
            {chat.map((m, i) => (
              <View
                key={i}
                style={[
                  card,
                  styles.chatBubble,
                  m.role === "user" ? styles.userBubble : null,
                ]}
              >
                <Text style={styles.chatText}>{m.content}</Text>
              </View>
            ))}
            {asking && (
              <View style={[card, styles.chatBubble]}>
                <ActivityIndicator color={colors.gold} />
              </View>
            )}
            <View style={styles.askRow}>
              <TextInput
                value={question}
                onChangeText={setQuestion}
                placeholder="Ask about this passage…"
                placeholderTextColor={colors.muted}
                style={styles.askInput}
              />
              <TouchableOpacity
                style={[styles.askButton, (asking || !question.trim()) && styles.disabled]}
                onPress={ask}
                disabled={asking || !question.trim()}
              >
                <Text style={styles.buttonText}>Ask</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {error && <Text style={styles.error}>{error}</Text>}
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
  },
  title: { fontSize: 24, fontWeight: "700", color: colors.ink },
  reference: { color: colors.gold, fontWeight: "600", marginTop: 4, marginBottom: 14 },
  scriptureCard: { padding: 20, marginBottom: 20 },
  scripture: { fontSize: 17, lineHeight: 30, color: colors.ink },
  ornament: { color: colors.gold, textAlign: "center", marginTop: 14 },
  heading: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.ink,
    marginBottom: 10,
    marginTop: 8,
  },
  muted: { color: colors.muted, marginBottom: 12, lineHeight: 20 },
  reflection: { padding: 14, marginBottom: 8 },
  reflectionText: { color: colors.ink, lineHeight: 22 },
  reflectionMeta: { color: colors.muted, fontSize: 11, marginTop: 6 },
  form: { padding: 12, marginTop: 6, marginBottom: 16 },
  textarea: { minHeight: 60, color: colors.ink, fontSize: 15, padding: 6 },
  button: {
    backgroundColor: colors.lake,
    borderRadius: radii.button,
    paddingVertical: 11,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: { color: colors.white, fontWeight: "700" },
  disabled: { opacity: 0.5 },
  chatBubble: { padding: 12, marginBottom: 8 },
  userBubble: { backgroundColor: "#e8edf5", marginLeft: 32 },
  chatText: { color: colors.ink, lineHeight: 22 },
  askRow: { flexDirection: "row", gap: 8, marginTop: 6 },
  askInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.button,
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: colors.ink,
  },
  askButton: {
    backgroundColor: colors.lake,
    borderRadius: radii.button,
    paddingHorizontal: 18,
    justifyContent: "center",
  },
  error: { color: colors.red, fontWeight: "600", marginTop: 12 },
});
