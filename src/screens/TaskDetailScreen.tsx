import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
  Text,
  Image,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing, borderRadius, fontSizes } from '../theme/colors';
import { Task, Comment, RootStackParamList } from '../types';
import { tasksApi, commentsApi } from '../services/api';
import { Header, CommentThread, Loading, EmptyState, Button } from '../components';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RouteType = RouteProp<RootStackParamList, 'TaskDetail'>;

export const TaskDetailScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteType>();
  const { taskId } = route.params;

  const [task, setTask] = useState<Task | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadTask = useCallback(async () => {
    try {
      const [taskResult, commentsResult] = await Promise.all([
        tasksApi.getById(taskId),
        commentsApi.getByTask(taskId),
      ]);

      if (taskResult.data) {
        setTask(taskResult.data);
      }
      if (commentsResult.data) {
        setComments(commentsResult.data);
      }
    } catch (error) {
      console.error('Error loading task:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [taskId]);

  useEffect(() => {
    loadTask();
  }, [loadTask]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadTask();
  }, [loadTask]);

  const handleTogglePremium = useCallback(async () => {
    if (!task) return;
    
    try {
      await tasksApi.update(taskId, { premium: !task.premium });
      setTask({ ...task, premium: !task.premium });
    } catch (error) {
      console.error('Error toggling premium:', error);
    }
  }, [task, taskId]);

  const handleDelete = useCallback(() => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await tasksApi.delete(taskId);
              navigation.goBack();
            } catch (error) {
              console.error('Error deleting task:', error);
            }
          },
        },
      ]
    );
  }, [taskId, navigation]);

  const handleEdit = useCallback(() => {
    if (!task) return;
    navigation.navigate('TaskForm', {
      taskId: task.id,
      projectId: task.project_id,
      boardId: task.board_id,
      swimlaneId: task.swimlane_id,
    });
  }, [task, navigation]);

  if (loading) {
    return <Loading fullScreen message="Loading task..." />;
  }

  if (!task) {
    return (
      <View style={styles.container}>
        <Header
          title="Task"
          showBack
          onBack={() => navigation.goBack()}
        />
        <EmptyState
          icon="❌"
          title="Task Not Found"
          message="This task doesn't exist or has been deleted"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title="Task Details"
        showBack
        onBack={() => navigation.goBack()}
        rightAction={{
          icon: '✏️',
          onPress: handleEdit,
        }}
      />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {/* Task Header */}
        <View style={styles.taskHeader}>
          <Text style={styles.taskTitle}>{task.title}</Text>
          
          {task.premium && (
            <View style={styles.premiumBadge}>
              <Text style={styles.premiumText}>⭐ Premium</Text>
            </View>
          )}
        </View>

        {/* Premium Toggle */}
        <View style={styles.premiumToggle}>
          <Text style={styles.toggleLabel}>Premium Task</Text>
          <Switch
            value={task.premium}
            onValueChange={handleTogglePremium}
            trackColor={{ false: colors.gray600, true: colors.secondaryDim }}
            thumbColor={task.premium ? colors.secondary : colors.gray400}
          />
        </View>

        {/* Description */}
        {task.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{task.description}</Text>
          </View>
        )}

        {/* Images */}
        {task.images && task.images.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Attachments</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {task.images.map((imageUrl, index) => (
                <TouchableOpacity key={index} style={styles.imageWrapper}>
                  <Image
                    source={{ uri: imageUrl }}
                    style={styles.image}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Metadata */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Details</Text>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Created:</Text>
            <Text style={styles.metaValue}>
              {new Date(task.created_at).toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Updated:</Text>
            <Text style={styles.metaValue}>
              {new Date(task.updated_at).toLocaleDateString()}
            </Text>
          </View>
        </View>

        {/* Comments */}
        <View style={styles.section}>
          <CommentThread
            taskId={taskId}
            comments={comments}
            onCommentAdded={loadTask}
          />
        </View>

        {/* Delete Button */}
        <View style={styles.dangerZone}>
          <Button
            title="Delete Task"
            variant="danger"
            onPress={handleDelete}
            fullWidth
          />
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
    paddingBottom: spacing.xxl,
  },
  taskHeader: {
    marginBottom: spacing.lg,
  },
  taskTitle: {
    color: colors.textPrimary,
    fontSize: fontSizes['2xl'],
    fontWeight: '700',
    fontFamily: 'monospace',
    marginBottom: spacing.sm,
  },
  premiumBadge: {
    backgroundColor: colors.secondaryDim,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
  },
  premiumText: {
    color: colors.white,
    fontSize: fontSizes.sm,
    fontFamily: 'monospace',
    fontWeight: '600',
  },
  premiumToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.bgElevated,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  toggleLabel: {
    color: colors.textPrimary,
    fontSize: fontSizes.base,
    fontFamily: 'monospace',
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    color: colors.textSecondary,
    fontSize: fontSizes.sm,
    fontFamily: 'monospace',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },
  description: {
    color: colors.textPrimary,
    fontSize: fontSizes.base,
    lineHeight: 24,
  },
  imageWrapper: {
    marginRight: spacing.sm,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  image: {
    width: 150,
    height: 150,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  metaLabel: {
    color: colors.textSecondary,
    fontSize: fontSizes.sm,
    fontFamily: 'monospace',
  },
  metaValue: {
    color: colors.textPrimary,
    fontSize: fontSizes.sm,
    fontFamily: 'monospace',
  },
  dangerZone: {
    marginTop: spacing.xl,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.error,
  },
});
