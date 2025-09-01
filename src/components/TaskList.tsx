import { Task } from '@/types/task';
import { TaskItem } from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
  onToggleComplete: (id: string) => void;
}

export const TaskList = ({ tasks, onUpdateTask, onDeleteTask, onToggleComplete }: TaskListProps) => {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-card rounded-xl shadow-[var(--shadow-card)] p-8">
          <div className="text-muted-foreground text-lg mb-2">No tasks yet</div>
          <div className="text-muted-foreground">Create your first task to get started!</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onUpdate={onUpdateTask}
          onDelete={onDeleteTask}
          onToggleComplete={onToggleComplete}
        />
      ))}
    </div>
  );
};