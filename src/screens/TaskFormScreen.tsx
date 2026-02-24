import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Text,
  Switch,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import { colors, spacing, borderRadius, fontSizes } from '../theme/colors';
import { Task, RootStackParamList } from '../types';
import { tasksApi } from '../services/api';
import { Header, Input, Button, Loading } from '../components';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RouteType = RouteProp<RootStackParamList, 'TaskForm'>;

export const TaskFormScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteType>();
  const { taskId, projectId, boardId, swimlaneId } = route.params;

  const isEditing = !!taskId;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [premium, setPremium] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);

  const loadTask = useCallback(async () => {
    if (!taskId) return;
    
    try {
      const { data, error } = await tasksApi.getById(taskId);
      if (data) {
        setTitle(data.title);
        setDescription(data.description || '');
        setPremium(data.premium);
        setImages(data.images || []);
      }
    } catch (error) {
      console.error('Error loading task:', error);
    } finally {
      setLoading(false);
    }
  }, [taskId]);

  useEffect(() => {
    if (isEditing) {
      loadTask();
    }
  }, [isEditing, loadTask]);

  const handlePickImage = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Please allow access to your photo library to upload images.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImages([...images, result.assets[0].uri]);
    }
  }, [images]);

  const handleRemoveImage = useCallback((index: number) => {
    setImages(images.filter((_, i) => i !== index));
  }, [images]);

  const handleSubmit = useCallback(async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }

    setSubmitting(true);

    try {
      const taskData: Partial<Task> = {
        title: title.trim(),
        description: description.trim(),
        premium,
        images,
        project_id: projectId,
        board_id: boardId,
        swimlane_id: swimlaneId,
      };

      if (isEditing && taskId) {
        await tasksApi.update(taskId, taskData);
      } else {
        taskData.order = 0; // New tasks go to top
        await tasksApi.create(taskData);
      }

      navigation.goBack();
    } catch (error) {
      console.error('Error saving task:', error);
      Alert.alert('Error', 'Failed to save task. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }, [
    title,
    description,
    premium,
    images,
    projectId,
    boardId,
    swimlaneId,
    isEditing,
    taskId,
    navigation,
  ]);

  if (loading) {
    return <Loading fullScreen message="Loading task..." />;
  }

  return (
    <View style={styles.container}>
      <Header
        title={isEditing ? 'Edit Task' : 'New Task'}
        showBack
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        <Input
          label="Title"
          placeholder="Enter task title"
          value={title}
          onChangeText={setTitle}
          autoFocus={!isEditing}
        />

        <Input
          label="Description"
          placeholder="Enter task description"
          value={description}
          onChangeText={setDescription}
          multiline
        />

        {/* Premium Toggle */}
        <View style={styles.premiumToggle}>
          <View style={styles.toggleInfo}>
            <Text style={styles.toggleLabel}>Premium Task</Text>
            <Text style={styles.toggleHint}>Mark this as a priority task</Text>
          </View>
          <Switch
            value={premium}
            onValueChange={setPremium}
            trackColor={{ false: colors.gray600, true: colors.secondaryDim }}
            thumbColor={premium ? colors.secondary : colors.gray400}
          />
        </View>

        {/* Images Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Attachments</Text>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {images.map((uri, index) => (
              <View key={index} style={styles.imageWrapper}>
                <Image source={{ uri }} style={styles.image} resizeMode="cover" />
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => handleRemoveImage(index)}
                >
                  <Text style={styles.removeText}>×</Text>
                </TouchableOpacity>
              </View>
            ))}
            
            <TouchableOpacity style={styles.addImageButton} onPress={handlePickImage}>
              <Text style={styles.addImageIcon}>📷</Text>
              <Text style={styles.addImageText}>Add Image</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Submit Button */}
        <View style={styles.footer}>
          <Button
            title={isEditing ? 'Save Changes' : 'Create Task'}
            onPress={handleSubmit}
            loading={submitting}
            disabled={!title.trim()}
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
  toggleInfo: {
    flex: 1,
  },
  toggleLabel: {
    color: colors.textPrimary,
    fontSize: fontSizes.base,
    fontFamily: 'monospace',
    fontWeight: '500',
  },
  toggleHint: {
    color: colors.textSecondary,
    fontSize: fontSizes.sm,
    fontFamily: 'monospace',
    marginTop: spacing.xs,
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
  imageWrapper: {
    marginRight: spacing.sm,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    position: 'relative',
  },
  image: {
    width: 100,
    height: 100,
  },
  removeButton: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    backgroundColor: colors.error,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 20,
  },
  addImageButton: {
    width: 100,
    height: 100,
    backgroundColor: colors.bgInteractive,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addImageIcon: {
    fontSize: 24,
    marginBottom: spacing.xs,
  },
  addImageText: {
    color: colors.textSecondary,
    fontSize: fontSizes.xs,
    fontFamily: 'monospace',
  },
  footer: {
    marginTop: spacing.xl,
  },
});
