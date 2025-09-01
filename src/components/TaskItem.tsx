import { useState } from 'react';
import { Trash2, Edit3, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Task, Priority } from '@/types/task';
import { cn } from '@/lib/utils';

interface TaskItemProps {
  task: Task;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string) => void;
}

const priorityStyles = {
  high: 'border-l-priority-high bg-red-50/50',
  medium: 'border-l-priority-medium bg-yellow-50/50',
  low: 'border-l-priority-low bg-green-50/50',
};

const priorityLabels = {
  high: 'High',
  medium: 'Medium', 
  low: 'Low',
};

export const TaskItem = ({ task, onUpdate, onDelete, onToggleComplete }: TaskItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || '');
  const [editPriority, setEditPriority] = useState<Priority>(task.priority);

  const handleSave = () => {
    onUpdate(task.id, {
      title: editTitle,
      description: editDescription,
      priority: editPriority,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setEditPriority(task.priority);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="bg-card rounded-xl shadow-[var(--shadow-card)] p-4 border-l-4 border-l-primary">
        <div className="space-y-3">
          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Task title..."
            className="font-medium"
          />
          <Textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            placeholder="Description (optional)..."
            className="min-h-[80px] resize-none"
          />
          <div className="flex items-center justify-between">
            <Select value={editPriority} onValueChange={(value: Priority) => setEditPriority(value)}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700"
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCancel}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "bg-card rounded-xl shadow-[var(--shadow-card)] p-4 border-l-4 transition-all duration-300 hover:shadow-lg",
      priorityStyles[task.priority],
      task.completed && "opacity-60"
    )}>
      <div className="flex items-start gap-3">
        <Checkbox
          checked={task.completed}
          onCheckedChange={() => onToggleComplete(task.id)}
          className="mt-1"
        />
        
        <div className="flex-1 min-w-0">
          <h3 className={cn(
            "font-medium text-card-foreground mb-1",
            task.completed && "line-through"
          )}>
            {task.title}
          </h3>
          
          {task.description && (
            <p className={cn(
              "text-muted-foreground text-sm mb-2",
              task.completed && "line-through"
            )}>
              {task.description}
            </p>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={cn(
                "text-xs px-2 py-1 rounded-full font-medium",
                task.priority === 'high' && "bg-red-100 text-red-700",
                task.priority === 'medium' && "bg-yellow-100 text-yellow-700",
                task.priority === 'low' && "bg-green-100 text-green-700"
              )}>
                {priorityLabels[task.priority]}
              </span>
              <span className="text-xs text-muted-foreground">
                {new Date(task.createdAt).toLocaleDateString()}
              </span>
            </div>
            
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsEditing(true)}
                className="h-8 w-8 p-0"
              >
                <Edit3 className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDelete(task.id)}
                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};