import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { colors, spacing, borderRadius, fontSizes } from '../theme/colors';
import { Comment } from '../types';
import { commentsApi } from '../services/api';

// Agent identity definitions
const AGENT_PROFILES: Record<string, { name: string; avatar: string; color: string }> = {
  planner: { name: 'Planner', avatar: '📋', color: '#00ffcc' },
  builder: { name: 'Builder', avatar: '🔨', color: '#ff00ff' },
  orchestrator: { name: 'Orchestrator', avatar: '🎭', color: '#ffff00' },
  reviewer: { name: 'Reviewer', avatar: '🔍', color: '#00ff88' },
  otacon: { name: 'Otacon', avatar: '🤖', color: '#00ffcc' },
};

interface CommentThreadProps {
  taskId: string;
  comments: Comment[];
  onCommentAdded: () => void;
}

export const CommentThread: React.FC<CommentThreadProps> = ({
  taskId,
  comments,
  onCommentAdded,
}) => {
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!newComment.trim() || submitting) return;

    setSubmitting(true);
    try {
      await commentsApi.create({
        task_id: taskId,
        author_type: 'human',
        author_id: 'mobile-user',
        author_name: 'Mobile User',
        content: newComment.trim(),
      });
      setNewComment('');
      onCommentAdded();
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const getAuthorInfo = (comment: Comment) => {
    if (comment.author_type === 'agent') {
      const profile = AGENT_PROFILES[comment.author_id] || {
        name: comment.author_name,
        avatar: '🤖',
        color: colors.primary,
      };
      return profile;
    }
    return {
      name: comment.author_name || 'User',
      avatar: '👤',
      color: colors.textSecondary,
    };
  };

  const renderComment = ({ item }: { item: Comment }) => {
    const author = getAuthorInfo(item);
    const isAgent = item.author_type === 'agent';
    
    return (
      <View style={[styles.comment, isAgent && styles.agentComment]}>
        <View style={styles.commentHeader}>
          <Text style={styles.avatar}>{author.avatar}</Text>
          <Text style={[styles.authorName, { color: author.color }]}>
            {author.name}
          </Text>
          <Text style={styles.timestamp}>
            {new Date(item.created_at).toLocaleDateString()}
          </Text>
        </View>
        <Text style={styles.commentContent}>{item.content}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Comments</Text>
      
      <FlatList
        data={comments}
        keyExtractor={(item) => item.id}
        renderItem={renderComment}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No comments yet</Text>
        }
        style={styles.list}
      />
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add a comment..."
          placeholderTextColor={colors.textMuted}
          value={newComment}
          onChangeText={setNewComment}
          multiline
        />
        <TouchableOpacity
          style={[styles.submitButton, !newComment.trim() && styles.submitDisabled]}
          onPress={handleSubmit}
          disabled={!newComment.trim() || submitting}
        >
          <Text style={styles.submitText}>↑</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    color: colors.textSecondary,
    fontSize: fontSizes.sm,
    fontFamily: 'monospace',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.md,
  },
  list: {
    flex: 1,
  },
  comment: {
    backgroundColor: colors.bgInteractive,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderLeftWidth: 2,
    borderLeftColor: colors.textSecondary,
  },
  agentComment: {
    borderLeftColor: colors.primary,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  avatar: {
    fontSize: 16,
    marginRight: spacing.xs,
  },
  authorName: {
    fontSize: fontSizes.sm,
    fontFamily: 'monospace',
    fontWeight: '600',
    flex: 1,
  },
  timestamp: {
    color: colors.textMuted,
    fontSize: fontSizes.xs,
    fontFamily: 'monospace',
  },
  commentContent: {
    color: colors.textPrimary,
    fontSize: fontSizes.sm,
    lineHeight: 20,
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: fontSizes.sm,
    fontFamily: 'monospace',
    textAlign: 'center',
    paddingVertical: spacing.lg,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
    marginTop: spacing.sm,
  },
  input: {
    flex: 1,
    backgroundColor: colors.bgInteractive,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: colors.textPrimary,
    fontSize: fontSizes.sm,
    fontFamily: 'monospace',
    maxHeight: 100,
  },
  submitButton: {
    backgroundColor: colors.primary,
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
  submitDisabled: {
    opacity: 0.5,
  },
  submitText: {
    color: colors.black,
    fontSize: 20,
    fontWeight: 'bold',
  },
});
