import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from 'react-native-draggable-flatlist';
import { colors, spacing, borderRadius, fontSizes } from '../theme/colors';
import { Swimlane, Task } from '../types';
import { TaskCard } from './TaskCard';

interface SwimlaneColumnProps {
  swimlane: Swimlane;
  tasks: Task[];
  onTaskPress: (task: Task) => void;
  onAddTask: () => void;
  onDragEnd: (tasks: Task[]) => void;
}

export const SwimlaneColumn: React.FC<SwimlaneColumnProps> = ({
  swimlane,
  tasks,
  onTaskPress,
  onAddTask,
  onDragEnd,
}) => {
  const renderItem = ({ item, drag, isActive }: RenderItemParams<Task>) => (
    <ScaleDecorator>
      <TaskCard
        task={item}
        onPress={() => onTaskPress(item)}
        onLongPress={drag}
        isDragging={isActive}
      />
    </ScaleDecorator>
  );

  return (
    <View style={styles.column}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{swimlane.name}</Text>
        <View style={styles.taskCount}>
          <Text style={styles.taskCountText}>{tasks.length}</Text>
        </View>
      </View>
      
      <DraggableFlatList
        data={tasks}
        onDragEnd={({ data }) => onDragEnd(data)}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        containerStyle={styles.listContainer}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
      
      <TouchableOpacity style={styles.addButton} onPress={onAddTask}>
        <Text style={styles.addButtonText}>+ Add Task</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  column: {
    width: 280,
    backgroundColor: colors.bgSecondary,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.md,
    maxHeight: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    color: colors.primary,
    fontSize: fontSizes.base,
    fontWeight: '600',
    fontFamily: 'monospace',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  taskCount: {
    backgroundColor: colors.gray700,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  taskCountText: {
    color: colors.textSecondary,
    fontSize: fontSizes.xs,
    fontFamily: 'monospace',
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    padding: spacing.sm,
  },
  addButton: {
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    alignItems: 'center',
  },
  addButtonText: {
    color: colors.primary,
    fontSize: fontSizes.sm,
    fontFamily: 'monospace',
    fontWeight: '500',
  },
});
