import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { api, getToken, setToken } from "./src/api";
import { colors } from "./src/theme";
import { SignInScreen } from "./src/screens/SignInScreen";
import { HomeScreen } from "./src/screens/HomeScreen";
import { CircleScreen } from "./src/screens/CircleScreen";
import { StudyScreen } from "./src/screens/StudyScreen";
import { PlanScreen } from "./src/screens/PlanScreen";
import { CompanionScreen } from "./src/screens/CompanionScreen";
import { SettingsScreen } from "./src/screens/SettingsScreen";

type Tab = "home" | "companion" | "settings";
type Overlay =
  | { kind: "circle"; id: string }
  | { kind: "study"; id: string }
  | { kind: "plan"; id: string }
  | null;

export default function App() {
  const [booted, setBooted] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [tab, setTab] = useState<Tab>("home");
  const [overlay, setOverlay] = useState<Overlay>(null);
  const [profile, setProfile] = useState<{ email: string; hasKey: boolean }>({
    email: "",
    hasKey: false,
  });
  // Bumped to force HomeScreen to remount (and refetch) after auth/key changes.
  const [homeEpoch, setHomeEpoch] = useState(0);

  const loadProfile = useCallback(async () => {
    try {
      const home = await api.home();
      setProfile({ email: home.user.email, hasKey: home.user.hasKey });
      return true;
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    (async () => {
      const token = await getToken();
      if (token) {
        const ok = await loadProfile();
        if (ok) setSignedIn(true);
        else await setToken(null); // expired token — back to sign-in
      }
      setBooted(true);
    })();
  }, [loadProfile]);

  if (!booted) {
    return (
      <View style={styles.boot}>
        <ActivityIndicator color={colors.gold} size="large" />
      </View>
    );
  }

  if (!signedIn) {
    return (
      <>
        <StatusBar style="dark" />
        <SignInScreen
          onSignedIn={async () => {
            await loadProfile();
            setSignedIn(true);
            setHomeEpoch((e) => e + 1);
          }}
        />
      </>
    );
  }

  const overlayTitle =
    overlay?.kind === "circle" ? "Circle" : overlay?.kind === "study" ? "Study" : "Plan";

  return (
    <SafeAreaView style={styles.app}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        {overlay ? (
          <TouchableOpacity onPress={() => setOverlay(null)} style={styles.backButton}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.brand}>
            🕊️ Bible<Text style={{ color: colors.gold }}>Peer</Text>
          </Text>
        )}
        {overlay && <Text style={styles.headerTitle}>{overlayTitle}</Text>}
        <View style={styles.headerSpacer} />
      </View>

      {/* Body */}
      <View style={styles.body}>
        {overlay?.kind === "circle" && (
          <CircleScreen
            circleId={overlay.id}
            onOpenStudy={(id) => setOverlay({ kind: "study", id })}
          />
        )}
        {overlay?.kind === "study" && (
          <StudyScreen studyId={overlay.id} hasKey={profile.hasKey} />
        )}
        {overlay?.kind === "plan" && <PlanScreen planId={overlay.id} />}

        {!overlay && tab === "home" && (
          <HomeScreen
            key={homeEpoch}
            onOpenCircle={(id) => setOverlay({ kind: "circle", id })}
            onOpenPlan={(id) => setOverlay({ kind: "plan", id })}
          />
        )}
        {!overlay && tab === "companion" && <CompanionScreen hasKey={profile.hasKey} />}
        {!overlay && tab === "settings" && (
          <SettingsScreen
            email={profile.email}
            hasKey={profile.hasKey}
            onKeyChanged={() => void loadProfile()}
            onSignOut={() => {
              setSignedIn(false);
              setOverlay(null);
              setTab("home");
            }}
          />
        )}
      </View>

      {/* Tab bar */}
      {!overlay && (
        <View style={styles.tabBar}>
          {(
            [
              { key: "home", label: "Home", icon: "🫂" },
              { key: "companion", label: "Companion", icon: "🕯️" },
              { key: "settings", label: "Settings", icon: "⚙️" },
            ] as const
          ).map((t) => (
            <TouchableOpacity key={t.key} style={styles.tabItem} onPress={() => setTab(t.key)}>
              <Text style={styles.tabIcon}>{t.icon}</Text>
              <Text style={[styles.tabLabel, tab === t.key && styles.tabActive]}>
                {t.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  boot: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  app: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  brand: { fontSize: 18, fontWeight: "800", color: colors.ink },
  backButton: { paddingVertical: 4, paddingRight: 12 },
  backText: { color: colors.lake, fontWeight: "700", fontSize: 15 },
  headerTitle: { fontSize: 16, fontWeight: "700", color: colors.ink },
  headerSpacer: { flex: 1 },
  body: { flex: 1 },
  tabBar: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
    paddingBottom: 4,
  },
  tabItem: { flex: 1, alignItems: "center", paddingVertical: 8 },
  tabIcon: { fontSize: 20 },
  tabLabel: { fontSize: 11, color: colors.muted, marginTop: 2, fontWeight: "600" },
  tabActive: { color: colors.gold, fontWeight: "800" },
});
