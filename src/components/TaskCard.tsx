import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { colors, spacing, borderRadius, fontSizes } from '../theme/colors';
import { Task } from '../types';

interface TaskCardProps {
  task: Task;
  onPress: () => void;
  onLongPress?: () => void;
  isDragging?: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onPress,
  onLongPress,
  isDragging,
}) => {
  const hasImages = task.images && task.images.length > 0;

  return (
    <TouchableOpacity
      style={[
        styles.card,
        task.premium && styles.premiumCard,
        isDragging && styles.dragging,
      ]}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.7}
    >
      {task.premium && (
        <View style={styles.premiumIndicator}>
          <Text style={styles.premiumIcon}>⭐</Text>
        </View>
      )}
      
      <Text style={styles.title} numberOfLines={2}>
        {task.title}
      </Text>
      
      {task.description ? (
        <Text style={styles.description} numberOfLines={2}>
          {task.description}
        </Text>
      ) : null}
      
      {hasImages && (
        <View style={styles.imagePreview}>
          <Image
            source={{ uri: task.images[0] }}
            style={styles.thumbnail}
            resizeMode="cover"
          />
          {task.images.length > 1 && (
            <View style={styles.moreImages}>
              <Text style={styles.moreImagesText}>+{task.images.length - 1}</Text>
            </View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bgInteractive,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  premiumCard: {
    borderColor: colors.secondary,
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  dragging: {
    opacity: 0.8,
    transform: [{ scale: 1.02 }],
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  premiumIndicator: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
  },
  premiumIcon: {
    fontSize: 14,
  },
  title: {
    color: colors.textPrimary,
    fontSize: fontSizes.base,
    fontWeight: '500',
    fontFamily: 'monospace',
    marginBottom: spacing.xs,
    paddingRight: spacing.lg,
  },
  description: {
    color: colors.textSecondary,
    fontSize: fontSizes.sm,
    lineHeight: 18,
  },
  imagePreview: {
    flexDirection: 'row',
    marginTop: spacing.sm,
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.sm,
  },
  moreImages: {
    width: 40,
    height: 60,
    backgroundColor: colors.gray700,
    borderRadius: borderRadius.sm,
    marginLeft: spacing.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreImagesText: {
    color: colors.textSecondary,
    fontSize: fontSizes.sm,
    fontFamily: 'monospace',
  },
});
