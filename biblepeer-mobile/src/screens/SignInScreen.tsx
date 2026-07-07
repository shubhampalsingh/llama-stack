import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { api, setToken } from "../api";
import { card, colors, radii } from "../theme";

export function SignInScreen({ onSignedIn }: { onSignedIn: () => void }) {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [stage, setStage] = useState<"email" | "code">("email");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function sendCode() {
    if (!email.trim() || busy) return;
    setBusy(true);
    setError(null);
    try {
      await api.requestCode(email.trim().toLowerCase());
      setStage("code");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not send the code");
    } finally {
      setBusy(false);
    }
  }

  async function verify() {
    if (code.trim().length !== 6 || busy) return;
    setBusy(true);
    setError(null);
    try {
      const { token } = await api.verifyCode(email.trim().toLowerCase(), code.trim());
      await setToken(token);
      onSignedIn();
    } catch (e) {
      setError(e instanceof Error ? e.message : "That code didn't work");
      setBusy(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <Text style={styles.logo}>🕊️</Text>
      <Text style={styles.title}>BiblePeer</Text>
      <Text style={styles.subtitle}>Study scripture together.</Text>

      <View style={[card, styles.form]}>
        {stage === "email" ? (
          <>
            <Text style={styles.label}>Sign in with your email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              placeholderTextColor={colors.muted}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              style={styles.input}
            />
            <TouchableOpacity
              style={[styles.button, busy && styles.disabled]}
              onPress={sendCode}
              disabled={busy}
            >
              {busy ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={styles.buttonText}>Email me a code</Text>
              )}
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.label}>
              We sent a 6-digit code to {email.trim()}. Enter it below.
            </Text>
            <TextInput
              value={code}
              onChangeText={setCode}
              placeholder="123456"
              placeholderTextColor={colors.muted}
              keyboardType="number-pad"
              maxLength={6}
              style={[styles.input, styles.codeInput]}
            />
            <TouchableOpacity
              style={[styles.button, busy && styles.disabled]}
              onPress={verify}
              disabled={busy}
            >
              {busy ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={styles.buttonText}>Sign in</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setStage("email")}>
              <Text style={styles.link}>Use a different email</Text>
            </TouchableOpacity>
          </>
        )}
        {error && <Text style={styles.error}>{error}</Text>}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  logo: { fontSize: 52 },
  title: { fontSize: 32, fontWeight: "700", color: colors.ink, marginTop: 6 },
  subtitle: { fontSize: 15, color: colors.muted, marginTop: 4, marginBottom: 28 },
  form: { width: "100%", maxWidth: 380, padding: 20 },
  label: { color: colors.ink, fontSize: 14, marginBottom: 12, lineHeight: 20 },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.button,
    backgroundColor: colors.background,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.ink,
    marginBottom: 12,
  },
  codeInput: { textAlign: "center", fontSize: 24, letterSpacing: 8 },
  button: {
    backgroundColor: colors.gold,
    borderRadius: radii.button,
    paddingVertical: 13,
    alignItems: "center",
  },
  disabled: { opacity: 0.5 },
  buttonText: { color: colors.white, fontWeight: "700", fontSize: 16 },
  link: { color: colors.lake, textAlign: "center", marginTop: 14, fontSize: 14 },
  error: { color: colors.red, marginTop: 12, fontSize: 14, fontWeight: "600" },
});
