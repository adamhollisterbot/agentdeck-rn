import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
  RefreshControl,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing, borderRadius, fontSizes } from '../theme/colors';
import { Project, Board, RootStackParamList } from '../types';
import { projectsApi, boardsApi } from '../services/api';
import { Header, Loading, EmptyState, Button } from '../components';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RouteType = RouteProp<RootStackParamList, 'ProjectDetail'>;

export const ProjectDetailScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteType>();
  const { projectId } = route.params;

  const [project, setProject] = useState<Project | null>(null);
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadProject = useCallback(async () => {
    try {
      const [projectResult, boardsResult] = await Promise.all([
        projectsApi.getById(projectId),
        boardsApi.getByProject(projectId),
      ]);

      if (projectResult.data) {
        setProject(projectResult.data);
      }
      if (boardsResult.data) {
        setBoards(boardsResult.data);
      }
    } catch (error) {
      console.error('Error loading project:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [projectId]);

  useEffect(() => {
    loadProject();
  }, [loadProject]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadProject();
  }, [loadProject]);

  const handleBoardPress = useCallback((board: Board) => {
    navigation.navigate('BoardDetail', { projectId, boardId: board.id });
  }, [navigation, projectId]);

  const handleCreateBoard = useCallback(async () => {
    Alert.prompt(
      'Create Board',
      'Enter board name',
      async (name) => {
        if (!name?.trim()) return;
        try {
          await boardsApi.create({
            project_id: projectId,
            name: name.trim(),
          });
          loadProject();
        } catch (error) {
          console.error('Error creating board:', error);
        }
      },
      'plain-text'
    );
  }, [projectId, loadProject]);

  const handleDeleteBoard = useCallback(async (board: Board) => {
    Alert.alert(
      'Delete Board',
      `Are you sure you want to delete "${board.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await boardsApi.delete(board.id);
              loadProject();
            } catch (error) {
              console.error('Error deleting board:', error);
            }
          },
        },
      ]
    );
  }, [loadProject]);

  const renderBoard = useCallback(({ item }: { item: Board }) => {
    const swimlaneCount = item.swimlanes?.length || 0;
    
    return (
      <TouchableOpacity
        style={styles.boardCard}
        onPress={() => handleBoardPress(item)}
        onLongPress={() => handleDeleteBoard(item)}
        activeOpacity={0.7}
      >
        <View style={styles.boardIcon}>
          <Text style={styles.boardIconText}>📋</Text>
        </View>
        <Text style={styles.boardName}>{item.name}</Text>
        <Text style={styles.boardInfo}>
          {swimlaneCount} swimlane{swimlaneCount !== 1 ? 's' : ''}
        </Text>
      </TouchableOpacity>
    );
  }, [handleBoardPress, handleDeleteBoard]);

  if (loading) {
    return <Loading fullScreen message="Loading project..." />;
  }

  if (!project) {
    return (
      <View style={styles.container}>
        <Header
          title="Project"
          showBack
          onBack={() => navigation.goBack()}
        />
        <EmptyState
          icon="❌"
          title="Project Not Found"
          message="This project doesn't exist or has been deleted"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title={project.title}
        subtitle={project.description}
        showBack
        onBack={() => navigation.goBack()}
        rightAction={{
          icon: '+',
          onPress: handleCreateBoard,
        }}
      />

      {boards.length === 0 ? (
        <EmptyState
          icon="📋"
          title="No Boards"
          message="Create your first board to organize tasks"
          action={{
            title: 'Create Board',
            onPress: handleCreateBoard,
          }}
        />
      ) : (
        <FlatList
          data={boards}
          keyExtractor={(item) => item.id}
          renderItem={renderBoard}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={colors.primary}
            />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  list: {
    padding: spacing.lg,
  },
  boardCard: {
    backgroundColor: colors.bgElevated,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  boardIcon: {
    width: 48,
    height: 48,
    backgroundColor: colors.gray700,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  boardIconText: {
    fontSize: 24,
  },
  boardName: {
    color: colors.textPrimary,
    fontSize: fontSizes.lg,
    fontWeight: '600',
    fontFamily: 'monospace',
    flex: 1,
  },
  boardInfo: {
    color: colors.textSecondary,
    fontSize: fontSizes.sm,
    fontFamily: 'monospace',
  },
});
