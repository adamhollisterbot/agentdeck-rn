export interface Project {
  id: string;
  title: string;
  description: string;
  context?: string;
  created_at: string;
  updated_at: string;
  boards?: Board[];
}

export interface Board {
  id: string;
  project_id: string;
  name: string;
  context?: string;
  swimlanes?: Swimlane[];
}

export interface Swimlane {
  id: string;
  board_id: string;
  name: string;
  context?: string;
  order: number;
}

export interface Task {
  id: string;
  project_id: string;
  board_id: string;
  swimlane_id: string;
  title: string;
  description: string;
  premium: boolean;
  images: string[];
  order: number;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: string;
  task_id: string;
  author_type: 'human' | 'agent';
  author_id: string;
  author_name: string;
  content: string;
  created_at: string;
}

export type RootStackParamList = {
  Main: undefined;
  ProjectDetail: { projectId: string };
  BoardDetail: { projectId: string; boardId: string };
  TaskDetail: { taskId: string };
  TaskForm: { taskId?: string; projectId: string; boardId: string; swimlaneId: string };
};

export type BottomTabParamList = {
  Projects: undefined;
  Settings: undefined;
};
