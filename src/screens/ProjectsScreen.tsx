import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  Alert,
  Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing } from '../theme/colors';
import { Project, RootStackParamList } from '../types';
import { projectsApi } from '../services/api';
import { Header, ProjectCard, Loading, EmptyState, Button, Input } from '../components';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const ProjectsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');

  const loadProjects = useCallback(async () => {
    try {
      const { data, error } = await projectsApi.getAll();
      if (error) {
        console.error('Error loading projects:', error);
        return;
      }
      setProjects(data || []);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadProjects();
  }, [loadProjects]);

  const handleProjectPress = useCallback((project: Project) => {
    navigation.navigate('ProjectDetail', { projectId: project.id });
  }, [navigation]);

  const handleDeleteProject = useCallback(async (project: Project) => {
    Alert.alert(
      'Delete Project',
      `Are you sure you want to delete "${project.title}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await projectsApi.delete(project.id);
              loadProjects();
            } catch (error) {
              console.error('Error deleting project:', error);
            }
          },
        },
      ]
    );
  }, [loadProjects]);

  const handleCreateProject = useCallback(async () => {
    if (!newProjectTitle.trim()) return;

    try {
      await projectsApi.create({
        title: newProjectTitle.trim(),
        description: newProjectDesc.trim(),
      });
      setNewProjectTitle('');
      setNewProjectDesc('');
      setModalVisible(false);
      loadProjects();
    } catch (error) {
      console.error('Error creating project:', error);
    }
  }, [newProjectTitle, newProjectDesc, loadProjects]);

  const renderItem = useCallback(({ item }: { item: Project }) => (
    <ProjectCard
      project={item}
      onPress={() => handleProjectPress(item)}
      onLongPress={() => handleDeleteProject(item)}
    />
  ), [handleProjectPress, handleDeleteProject]);

  if (loading) {
    return <Loading fullScreen message="Loading projects..." />;
  }

  return (
    <View style={styles.container}>
      <Header
        title="AgentDeck"
        subtitle="Project Management"
        rightAction={{
          icon: '+',
          onPress: () => setModalVisible(true),
        }}
      />

      {projects.length === 0 ? (
        <EmptyState
          icon="📁"
          title="No Projects"
          message="Create your first project to get started"
          action={{
            title: 'Create Project',
            onPress: () => setModalVisible(true),
          }}
        />
      ) : (
        <FlatList
          data={projects}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={[
            styles.list,
            { paddingBottom: insets.bottom + spacing.lg },
          ]}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={colors.primary}
            />
          }
        />
      )}

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Button
                title="Cancel"
                variant="ghost"
                size="sm"
                onPress={() => setModalVisible(false)}
              />
              <Button
                title="Create"
                variant="primary"
                size="sm"
                onPress={handleCreateProject}
                disabled={!newProjectTitle.trim()}
              />
            </View>
            
            <Input
              label="Project Title"
              placeholder="Enter project title"
              value={newProjectTitle}
              onChangeText={setNewProjectTitle}
              autoFocus
            />
            
            <Input
              label="Description"
              placeholder="Enter project description"
              value={newProjectDesc}
              onChangeText={setNewProjectDesc}
              multiline
            />
          </View>
        </View>
      </Modal>
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
  row: {
    justifyContent: 'space-between',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.bgElevated,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
});
