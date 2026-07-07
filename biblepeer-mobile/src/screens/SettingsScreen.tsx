import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { api, setToken } from "../api";
import { card, colors, radii } from "../theme";

export function SettingsScreen({
  email,
  hasKey,
  onKeyChanged,
  onSignOut,
}: {
  email: string;
  hasKey: boolean;
  onKeyChanged: () => void;
  onSignOut: () => void;
}) {
  const [value, setValue] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  async function save() {
    if (value.trim().length < 20 || busy) return;
    setBusy(true);
    setMessage(null);
    try {
      await api.saveKey(value.trim());
      setValue("");
      setMessage({ ok: true, text: "Key validated and saved. The companion is ready. 🕯️" });
      onKeyChanged();
    } catch (e) {
      setMessage({
        ok: false,
        text: e instanceof Error ? e.message : "Failed to save key",
      });
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    setBusy(true);
    try {
      await api.removeKey();
      setMessage({ ok: true, text: "Key removed." });
      onKeyChanged();
    } finally {
      setBusy(false);
    }
  }

  async function signOut() {
    await setToken(null);
    onSignOut();
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={[card, styles.section]}>
        <Text style={styles.heading}>Account</Text>
        <Text style={styles.muted}>{email}</Text>
        <TouchableOpacity style={styles.outlineButton} onPress={signOut}>
          <Text style={styles.outlineButtonText}>Sign out</Text>
        </TouchableOpacity>
      </View>

      <View style={[card, styles.section]}>
        <Text style={styles.heading}>🕯️ Study companion (Anthropic API key)</Text>
        <Text style={styles.muted}>
          Optional — powers the AI companion. Circles, reflections, and plans work without
          it. Stored encrypted on the server; get a key at platform.claude.com.
        </Text>
        <Text style={[styles.status, { color: hasKey ? colors.olive : colors.muted }]}>
          {hasKey ? "● Key configured" : "○ No key configured"}
        </Text>
        <TextInput
          value={value}
          onChangeText={setValue}
          placeholder="sk-ant-api03-…"
          placeholderTextColor={colors.muted}
          autoCapitalize="none"
          secureTextEntry
          style={styles.input}
        />
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.button, (busy || value.trim().length < 20) && styles.disabled]}
            onPress={save}
            disabled={busy || value.trim().length < 20}
          >
            <Text style={styles.buttonText}>
              {busy ? "…" : hasKey ? "Replace key" : "Save key"}
            </Text>
          </TouchableOpacity>
          {hasKey && (
            <TouchableOpacity
              style={[styles.dangerButton, busy && styles.disabled]}
              onPress={remove}
              disabled={busy}
            >
              <Text style={styles.dangerText}>Remove</Text>
            </TouchableOpacity>
          )}
        </View>
        {message && (
          <Text style={[styles.message, { color: message.ok ? colors.olive : colors.red }]}>
            {message.text}
          </Text>
        )}
      </View>

      <Text style={styles.footer}>
        BiblePeer · scripture: World English Bible (public domain){"\n"}manage circles at
        biblepeer.com
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, paddingBottom: 40 },
  section: { padding: 18, marginBottom: 14 },
  heading: { fontSize: 17, fontWeight: "700", color: colors.ink, marginBottom: 6 },
  muted: { color: colors.muted, lineHeight: 20, marginBottom: 10 },
  status: { fontWeight: "700", marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.button,
    backgroundColor: colors.background,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: colors.ink,
    marginBottom: 10,
  },
  row: { flexDirection: "row", gap: 10 },
  button: {
    backgroundColor: colors.gold,
    borderRadius: radii.button,
    paddingVertical: 11,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  buttonText: { color: colors.white, fontWeight: "700" },
  dangerButton: {
    borderWidth: 1,
    borderColor: colors.red,
    borderRadius: radii.button,
    paddingVertical: 11,
    paddingHorizontal: 16,
  },
  dangerText: { color: colors.red, fontWeight: "700" },
  disabled: { opacity: 0.5 },
  message: { marginTop: 10, fontWeight: "600" },
  outlineButton: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.button,
    paddingVertical: 10,
    alignItems: "center",
  },
  outlineButtonText: { color: colors.ink, fontWeight: "700" },
  footer: { color: colors.muted, textAlign: "center", fontSize: 12, lineHeight: 18 },
});
