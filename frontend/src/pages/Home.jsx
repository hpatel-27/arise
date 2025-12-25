import { useState } from "react";
import { AppShell } from "../components/layout/AppShell";
import { StatGrid } from "../components/stats/StatGrid";
import { useStats } from "../hooks/useStats";
import { useUserTasks } from "../hooks/useUserTasks";
import { useTasks } from "../hooks/useTasks";
import { TaskList } from "../components/tasks/TaskList";
import { Button } from "../components/ui/Button";
import { TaskForm } from "../components/tasks/TaskForm";
import { XpGainAnimation } from "../components/progression/XpGainAnimation";
import { LevelUpAnimation } from "../components/stats/LevelUpAnimation";
import { AchievementNotification } from "../components/achievements/AchievementNotification";

export default function Home() {
  const { stats, loading: statsLoading, refresh: refreshStats } = useStats();
  const {
    userTasks,
    loading: userTasksLoading,
    assignTask,
    completeTask,
    refresh: refreshUserTasks,
  } = useUserTasks();
  const { tasks, loading: tasksLoading, createTask } = useTasks();
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [xpAnimation, setXpAnimation] = useState({
    visible: false,
    amount: 0,
    statName: "",
  });
  const [levelUpAnimation, setLevelUpAnimation] = useState({
    visible: false,
    statName: "",
    newLevel: 0,
  });
  const [achievementNotification, setAchievementNotification] = useState({
    visible: false,
    achievement: null,
  });

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
      const result = await completeTask(taskId);

      // Show XP gain animation
      if (result.xpGained) {
        setXpAnimation({
          visible: true,
          amount: result.xpGained,
          statName: result.statName || "",
        });
        setTimeout(
          () => setXpAnimation({ visible: false, amount: 0, statName: "" }),
          2000
        );
      }

      // Check for level up
      if (result.levelUp) {
        setLevelUpAnimation({
          visible: true,
          statName: result.statName || "",
          newLevel: result.newLevel || 0,
        });
        setTimeout(
          () =>
            setLevelUpAnimation({ visible: false, statName: "", newLevel: 0 }),
          3000
        );
      }

      // Check for achievement unlock
      if (result.achievementUnlocked) {
        setAchievementNotification({
          visible: true,
          achievement: result.achievement,
        });
        setTimeout(
          () =>
            setAchievementNotification({ visible: false, achievement: null }),
          5000
        );
      }

      await refreshStats();
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
      <XpGainAnimation
        isVisible={xpAnimation.visible}
        xpAmount={xpAnimation.amount}
        statName={xpAnimation.statName}
      />
      <LevelUpAnimation
        isVisible={levelUpAnimation.visible}
        statName={levelUpAnimation.statName}
        newLevel={levelUpAnimation.newLevel}
      />
      <AchievementNotification
        isVisible={achievementNotification.visible}
        achievement={achievementNotification.achievement}
        onClose={() =>
          setAchievementNotification({ visible: false, achievement: null })
        }
      />

      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="font-pixel text-2xl text-primary">Dashboard</h1>
          <Button variant="accent" onClick={() => setShowTaskForm(true)}>
            + New Task
          </Button>
        </div>

        <section>
          <h2 className="font-pixel text-lg text-white mb-4">Your Stats</h2>
          {statsLoading ? (
            <p className="font-pixel text-sm text-white">Loading stats...</p>
          ) : (
            <StatGrid stats={stats} />
          )}
        </section>

        <section>
          <h2 className="font-pixel text-lg text-white mb-4">
            Available Tasks
          </h2>
          {userTasksLoading || tasksLoading ? (
            <p className="font-pixel text-sm text-white">Loading tasks...</p>
          ) : (
            <TaskList
              tasks={tasks}
              userTasks={userTasks}
              onAssign={handleAssignTask}
              onComplete={handleCompleteTask}
            />
          )}
        </section>
      </div>

      <TaskForm
        isOpen={showTaskForm}
        onClose={() => setShowTaskForm(false)}
        onSubmit={handleCreateTask}
      />
    </AppShell>
  );
}
