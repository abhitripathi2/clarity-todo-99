import { useState, useMemo } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TaskList } from './TaskList';
import { AddTaskDialog } from './AddTaskDialog';
import { Task, Priority } from '@/types/task';

export const TodoApp = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'created' | 'priority'>('created');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredAndSortedTasks = useMemo(() => {
    let filtered = tasks.filter(task =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (sortBy === 'priority') {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      filtered.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
    } else {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return filtered;
  }, [tasks, searchQuery, sortBy]);

  const addTask = (title: string, description: string, priority: Priority) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      description,
      priority,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task =>
      task.id === id ? { ...task, ...updates, updatedAt: new Date().toISOString() } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const toggleComplete = (id: string) => {
    setTasks(prev => prev.map(task =>
      task.id === id ? { ...task, completed: !task.completed, updatedAt: new Date().toISOString() } : task
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Task Manager
          </h1>
          <p className="text-muted-foreground text-lg">
            Stay organized and boost your productivity
          </p>
        </div>

        {/* Controls */}
        <div className="bg-card rounded-xl shadow-[var(--shadow-card)] p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={sortBy} onValueChange={(value: 'created' | 'priority') => setSortBy(value)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created">Recent</SelectItem>
                  <SelectItem value="priority">Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Add Task Button */}
            <Button 
              onClick={() => setIsAddDialogOpen(true)}
              className="bg-gradient-to-r from-primary to-primary-glow hover:shadow-[var(--shadow-elegant)] transition-all duration-300"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </div>
        </div>

        {/* Task List */}
        <TaskList
          tasks={filteredAndSortedTasks}
          onUpdateTask={updateTask}
          onDeleteTask={deleteTask}
          onToggleComplete={toggleComplete}
        />

        {/* Add Task Dialog */}
        <AddTaskDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onAddTask={addTask}
        />
      </div>
    </div>
  );
};