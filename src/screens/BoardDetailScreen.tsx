import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing } from '../theme/colors';
import { Board, Swimlane, Task, RootStackParamList } from '../types';
import { boardsApi, swimlanesApi, tasksApi } from '../services/api';
import { Header, SwimlaneColumn, Loading, EmptyState } from '../components';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RouteType = RouteProp<RootStackParamList, 'BoardDetail'>;

export const BoardDetailScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteType>();
  const { projectId, boardId } = route.params;

  const [board, setBoard] = useState<Board | null>(null);
  const [swimlanes, setSwimlanes] = useState<Swimlane[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadBoard = useCallback(async () => {
    try {
      const [boardResult, swimlanesResult, tasksResult] = await Promise.all([
        boardsApi.getByProject(projectId),
        swimlanesApi.getByBoard(boardId),
        tasksApi.getByBoard(boardId),
      ]);

      const currentBoard = boardResult.data?.find(b => b.id === boardId);
      if (currentBoard) {
        setBoard(currentBoard);
      }
      if (swimlanesResult.data) {
        setSwimlanes(swimlanesResult.data);
      }
      if (tasksResult.data) {
        setTasks(tasksResult.data);
      }
    } catch (error) {
      console.error('Error loading board:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [projectId, boardId]);

  useEffect(() => {
    loadBoard();
  }, [loadBoard]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadBoard();
  }, [loadBoard]);

  const handleTaskPress = useCallback((task: Task) => {
    navigation.navigate('TaskDetail', { taskId: task.id });
  }, [navigation]);

  const handleAddTask = useCallback((swimlaneId: string) => {
    navigation.navigate('TaskForm', {
      projectId,
      boardId,
      swimlaneId,
    });
  }, [navigation, projectId, boardId]);

  const handleDragEnd = useCallback(async (swimlaneId: string, reorderedTasks: Task[]) => {
    // Update local state immediately for responsive UI
    setTasks(prevTasks => {
      const otherTasks = prevTasks.filter(t => t.swimlane_id !== swimlaneId);
      return [...otherTasks, ...reorderedTasks.map((t, index) => ({ ...t, order: index }))];
    });

    // Update order in database
    try {
      await Promise.all(
        reorderedTasks.map((task, index) =>
          tasksApi.update(task.id, { order: index })
        )
      );
    } catch (error) {
      console.error('Error updating task order:', error);
      loadBoard(); // Refresh to get correct state
    }
  }, [loadBoard]);

  const handleCreateSwimlane = useCallback(async () => {
    Alert.prompt(
      'Create Swimlane',
      'Enter swimlane name',
      async (name) => {
        if (!name?.trim()) return;
        try {
          await swimlanesApi.create({
            board_id: boardId,
            name: name.trim(),
            order: swimlanes.length,
          });
          loadBoard();
        } catch (error) {
          console.error('Error creating swimlane:', error);
        }
      },
      'plain-text'
    );
  }, [boardId, swimlanes.length, loadBoard]);

  const getTasksForSwimlane = useCallback((swimlaneId: string) => {
    return tasks
      .filter(task => task.swimlane_id === swimlaneId)
      .sort((a, b) => a.order - b.order);
  }, [tasks]);

  if (loading) {
    return <Loading fullScreen message="Loading board..." />;
  }

  if (!board) {
    return (
      <View style={styles.container}>
        <Header
          title="Board"
          showBack
          onBack={() => navigation.goBack()}
        />
        <EmptyState
          icon="❌"
          title="Board Not Found"
          message="This board doesn't exist or has been deleted"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title={board.name}
        showBack
        onBack={() => navigation.goBack()}
        rightAction={{
          icon: '+',
          onPress: handleCreateSwimlane,
        }}
      />

      {swimlanes.length === 0 ? (
        <EmptyState
          icon="📊"
          title="No Swimlanes"
          message="Create swimlanes to organize your tasks"
          action={{
            title: 'Create Swimlane',
            onPress: handleCreateSwimlane,
          }}
        />
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={colors.primary}
            />
          }
        >
          {swimlanes.map(swimlane => (
            <SwimlaneColumn
              key={swimlane.id}
              swimlane={swimlane}
              tasks={getTasksForSwimlane(swimlane.id)}
              onTaskPress={handleTaskPress}
              onAddTask={() => handleAddTask(swimlane.id)}
              onDragEnd={(newTasks) => handleDragEnd(swimlane.id, newTasks)}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  scrollContent: {
    padding: spacing.md,
    paddingRight: spacing.lg,
  },
});
