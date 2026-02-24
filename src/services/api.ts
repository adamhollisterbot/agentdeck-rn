import { supabase } from '../lib/supabase';
import { Project, Board, Swimlane, Task, Comment } from '../types';

// Projects API
export const projectsApi = {
  getAll: async () => {
    if (!supabase) return { data: null, error: 'Supabase not configured' };
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: true });
    return { data: data as Project[] | null, error };
  },

  getById: async (id: string) => {
    if (!supabase) return { data: null, error: 'Supabase not configured' };
    const { data, error } = await supabase
      .from('projects')
      .select('*, boards(*, swimlanes(*))')
      .eq('id', id)
      .single();
    return { data: data as Project | null, error };
  },

  create: async (project: Partial<Project>) => {
    if (!supabase) return { data: null, error: 'Supabase not configured' };
    const { data, error } = await supabase
      .from('projects')
      .insert([project])
      .select()
      .single();
    return { data: data as Project | null, error };
  },

  update: async (id: string, updates: Partial<Project>) => {
    if (!supabase) return { data: null, error: 'Supabase not configured' };
    const { data, error } = await supabase
      .from('projects')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    return { data: data as Project | null, error };
  },

  delete: async (id: string) => {
    if (!supabase) return { error: 'Supabase not configured' };
    const { error } = await supabase.from('projects').delete().eq('id', id);
    return { error };
  },
};

// Boards API
export const boardsApi = {
  getByProject: async (projectId: string) => {
    if (!supabase) return { data: null, error: 'Supabase not configured' };
    const { data, error } = await supabase
      .from('boards')
      .select('*, swimlanes(*)')
      .eq('project_id', projectId)
      .order('id', { ascending: true });
    return { data: data as Board[] | null, error };
  },

  create: async (board: Partial<Board>) => {
    if (!supabase) return { data: null, error: 'Supabase not configured' };
    const { data, error } = await supabase
      .from('boards')
      .insert([board])
      .select()
      .single();
    return { data: data as Board | null, error };
  },

  update: async (id: string, updates: Partial<Board>) => {
    if (!supabase) return { data: null, error: 'Supabase not configured' };
    const { data, error } = await supabase
      .from('boards')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    return { data: data as Board | null, error };
  },

  delete: async (id: string) => {
    if (!supabase) return { error: 'Supabase not configured' };
    const { error } = await supabase.from('boards').delete().eq('id', id);
    return { error };
  },
};

// Swimlanes API
export const swimlanesApi = {
  getByBoard: async (boardId: string) => {
    if (!supabase) return { data: null, error: 'Supabase not configured' };
    const { data, error } = await supabase
      .from('swimlanes')
      .select('*')
      .eq('board_id', boardId)
      .order('order', { ascending: true });
    return { data: data as Swimlane[] | null, error };
  },

  create: async (swimlane: Partial<Swimlane>) => {
    if (!supabase) return { data: null, error: 'Supabase not configured' };
    const { data, error } = await supabase
      .from('swimlanes')
      .insert([swimlane])
      .select()
      .single();
    return { data: data as Swimlane | null, error };
  },

  update: async (id: string, updates: Partial<Swimlane>) => {
    if (!supabase) return { data: null, error: 'Supabase not configured' };
    const { data, error } = await supabase
      .from('swimlanes')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    return { data: data as Swimlane | null, error };
  },

  delete: async (id: string) => {
    if (!supabase) return { error: 'Supabase not configured' };
    const { error } = await supabase.from('swimlanes').delete().eq('id', id);
    return { error };
  },
};

// Tasks API
export const tasksApi = {
  getAll: async () => {
    if (!supabase) return { data: null, error: 'Supabase not configured' };
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('order', { ascending: true });
    return { data: data as Task[] | null, error };
  },

  getByProject: async (projectId: string) => {
    if (!supabase) return { data: null, error: 'Supabase not configured' };
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('project_id', projectId)
      .order('order', { ascending: true });
    return { data: data as Task[] | null, error };
  },

  getByBoard: async (boardId: string) => {
    if (!supabase) return { data: null, error: 'Supabase not configured' };
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('board_id', boardId)
      .order('order', { ascending: true });
    return { data: data as Task[] | null, error };
  },

  getBySwimlane: async (swimlaneId: string) => {
    if (!supabase) return { data: null, error: 'Supabase not configured' };
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('swimlane_id', swimlaneId)
      .order('order', { ascending: true });
    return { data: data as Task[] | null, error };
  },

  getById: async (id: string) => {
    if (!supabase) return { data: null, error: 'Supabase not configured' };
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', id)
      .single();
    return { data: data as Task | null, error };
  },

  create: async (task: Partial<Task>) => {
    if (!supabase) return { data: null, error: 'Supabase not configured' };
    const { data, error } = await supabase
      .from('tasks')
      .insert([task])
      .select()
      .single();
    return { data: data as Task | null, error };
  },

  update: async (id: string, updates: Partial<Task>) => {
    if (!supabase) return { data: null, error: 'Supabase not configured' };
    const { data, error } = await supabase
      .from('tasks')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    return { data: data as Task | null, error };
  },

  delete: async (id: string) => {
    if (!supabase) return { error: 'Supabase not configured' };
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    return { error };
  },
};

// Comments API
export const commentsApi = {
  getByTask: async (taskId: string) => {
    if (!supabase) return { data: null, error: 'Supabase not configured' };
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('task_id', taskId)
      .order('created_at', { ascending: true });
    return { data: data as Comment[] | null, error };
  },

  create: async (comment: Partial<Comment>) => {
    if (!supabase) return { data: null, error: 'Supabase not configured' };
    const { data, error } = await supabase
      .from('comments')
      .insert([comment])
      .select()
      .single();
    return { data: data as Comment | null, error };
  },

  delete: async (id: string) => {
    if (!supabase) return { error: 'Supabase not configured' };
    const { error } = await supabase.from('comments').delete().eq('id', id);
    return { error };
  },
};
