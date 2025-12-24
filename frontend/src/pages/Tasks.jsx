import { useState } from "react";
import { AppShell } from "../components/layout/AppShell";
import { TaskList } from "../components/tasks/TaskList";
import { TaskForm } from "../components/tasks/TaskForm";
import { Button } from "../components/ui/Button";
import { useTasks } from "../hooks/useTasks";
import { useUserTasks } from "../hooks/useUserTasks";

export default function Tasks() {
  const { tasks, loading: tasksLoading, createTask } = useTasks();
  const {
    userTasks,
    loading: userTasksLoading,
    assignTask,
    completeTask,
    refresh: refreshUserTasks,
  } = useUserTasks();
  const [showTaskForm, setShowTaskForm] = useState(false);

  const handleAssignTask = async (taskId) => {
    try {
      await assignTask(taskId);
      await refreshUserTasks();
    } catch (error) {
      console.error("Failed to assign task:", error);
    }
  };

  const handleCompleteTask = async (taskId) => {
    try {
      await completeTask(taskId);
      await refreshUserTasks();
    } catch (error) {
      console.error("Failed to complete task:", error);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      await createTask(taskData);
      setShowTaskForm(false);
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="font-pixel text-2xl text-primary">Tasks</h1>
          <Button variant="accent" onClick={() => setShowTaskForm(true)}>
            + Create Task
          </Button>
        </div>

        <TaskList
          tasks={tasks}
          userTasks={userTasks}
          onAssign={handleAssignTask}
          onComplete={handleCompleteTask}
          loading={tasksLoading || userTasksLoading}
        />
      </div>

      <TaskForm
        isOpen={showTaskForm}
        onClose={() => setShowTaskForm(false)}
        onSubmit={handleCreateTask}
      />
    </AppShell>
  );
}
