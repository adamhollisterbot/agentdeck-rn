import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { colors, spacing, borderRadius, fontSizes } from '../theme/colors';
import { Project } from '../types';

interface ProjectCardProps {
  project: Project;
  onPress: () => void;
  onLongPress?: () => void;
}

const { width } = Dimensions.get('window');
const cardWidth = (width - spacing.lg * 3) / 2;

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onPress,
  onLongPress,
}) => {
  const boardCount = project.boards?.length || 0;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.7}
    >
      <View style={styles.cardGlow} />
      <View style={styles.cardContent}>
        <Text style={styles.title} numberOfLines={2}>
          {project.title}
        </Text>
        {project.description ? (
          <Text style={styles.description} numberOfLines={3}>
            {project.description}
          </Text>
        ) : null}
        <View style={styles.footer}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{boardCount} board{boardCount !== 1 ? 's' : ''}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: cardWidth,
    minHeight: 150,
    backgroundColor: colors.bgElevated,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  cardGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 5,
  },
  cardContent: {
    padding: spacing.md,
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    color: colors.textPrimary,
    fontSize: fontSizes.lg,
    fontWeight: '600',
    fontFamily: 'monospace',
    marginBottom: spacing.sm,
  },
  description: {
    color: colors.textSecondary,
    fontSize: fontSizes.sm,
    lineHeight: 20,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: spacing.sm,
  },
  badge: {
    backgroundColor: colors.gray700,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  badgeText: {
    color: colors.primary,
    fontSize: fontSizes.xs,
    fontFamily: 'monospace',
  },
});
