import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, borderRadius, fontSizes } from '../theme/colors';
import { Header } from '../components';
import { isSupabaseConfigured } from '../lib/supabase';

export const SettingsScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const supabaseConnected = isSupabaseConfigured();

  const handleOpenWebsite = () => {
    // TODO: Update with Cloudflare Pages URL
    Linking.openURL('https://agentdeck.pages.dev');
  };

  return (
    <View style={styles.container}>
      <Header title="Settings" />

      <ScrollView
        style={styles.content}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingBottom: insets.bottom + spacing.xxl },
        ]}
      >
        {/* Connection Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Connection</Text>
          
          <View style={styles.statusCard}>
            <View style={styles.statusRow}>
              <View
                style={[
                  styles.statusDot,
                  supabaseConnected ? styles.statusConnected : styles.statusDisconnected,
                ]}
              />
              <Text style={styles.statusText}>
                Supabase {supabaseConnected ? 'Connected' : 'Disconnected'}
              </Text>
            </View>
            <Text style={styles.statusHint}>
              {supabaseConnected
                ? 'Data syncs with the PM MVP website'
                : 'Check your environment configuration'}
            </Text>
          </View>
        </View>

        {/* Links */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Links</Text>
          
          <TouchableOpacity style={styles.linkCard} onPress={handleOpenWebsite}>
            <Text style={styles.linkIcon}>🌐</Text>
            <View style={styles.linkInfo}>
              <Text style={styles.linkTitle}>Open Web Version</Text>
              <Text style={styles.linkHint}>agentdeck web app</Text>
            </View>
            <Text style={styles.linkArrow}>→</Text>
          </TouchableOpacity>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          
          <View style={styles.aboutCard}>
            <Text style={styles.appName}>AgentDeck</Text>
            <Text style={styles.appVersion}>Version 1.0.0</Text>
            <Text style={styles.appDescription}>
              A mobile companion for AgentDeck. Manage your projects,
              boards, and tasks on the go with the same cyberpunk aesthetic.
            </Text>
          </View>
        </View>

        {/* Theme Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Theme</Text>
          
          <View style={styles.themeCard}>
            <View style={styles.themeRow}>
              <View style={[styles.colorSwatch, { backgroundColor: colors.primary }]} />
              <Text style={styles.colorLabel}>Neon Cyan #00ffcc</Text>
            </View>
            <View style={styles.themeRow}>
              <View style={[styles.colorSwatch, { backgroundColor: colors.secondary }]} />
              <Text style={styles.colorLabel}>Hot Magenta #ff00ff</Text>
            </View>
            <View style={styles.themeRow}>
              <View style={[styles.colorSwatch, { backgroundColor: colors.black }]} />
              <Text style={styles.colorLabel}>Pure Black #000000</Text>
            </View>
          </View>
          <Text style={styles.themeHint}>
            Synthpunk Design System
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.lg,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    color: colors.textSecondary,
    fontSize: fontSizes.sm,
    fontFamily: 'monospace',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },
  statusCard: {
    backgroundColor: colors.bgElevated,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: spacing.sm,
  },
  statusConnected: {
    backgroundColor: colors.success,
    shadowColor: colors.success,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  statusDisconnected: {
    backgroundColor: colors.error,
  },
  statusText: {
    color: colors.textPrimary,
    fontSize: fontSizes.base,
    fontFamily: 'monospace',
    fontWeight: '500',
  },
  statusHint: {
    color: colors.textSecondary,
    fontSize: fontSizes.sm,
    fontFamily: 'monospace',
    marginLeft: 18,
  },
  linkCard: {
    backgroundColor: colors.bgElevated,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
  },
  linkIcon: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  linkInfo: {
    flex: 1,
  },
  linkTitle: {
    color: colors.textPrimary,
    fontSize: fontSizes.base,
    fontFamily: 'monospace',
    fontWeight: '500',
  },
  linkHint: {
    color: colors.primary,
    fontSize: fontSizes.sm,
    fontFamily: 'monospace',
  },
  linkArrow: {
    color: colors.primary,
    fontSize: 20,
  },
  aboutCard: {
    backgroundColor: colors.bgElevated,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  appName: {
    color: colors.primary,
    fontSize: fontSizes['2xl'],
    fontFamily: 'monospace',
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  appVersion: {
    color: colors.textSecondary,
    fontSize: fontSizes.sm,
    fontFamily: 'monospace',
    marginBottom: spacing.md,
  },
  appDescription: {
    color: colors.textPrimary,
    fontSize: fontSizes.sm,
    textAlign: 'center',
    lineHeight: 22,
  },
  themeCard: {
    backgroundColor: colors.bgElevated,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  themeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  colorSwatch: {
    width: 24,
    height: 24,
    borderRadius: 4,
    marginRight: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  colorLabel: {
    color: colors.textPrimary,
    fontSize: fontSizes.sm,
    fontFamily: 'monospace',
  },
  themeHint: {
    color: colors.textMuted,
    fontSize: fontSizes.xs,
    fontFamily: 'monospace',
    marginTop: spacing.sm,
    textAlign: 'center',
  },
});
