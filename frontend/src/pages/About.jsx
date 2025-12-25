import { AppShell } from "../components/layout/AppShell";
import { Card } from "../components/ui/Card";

export default function About() {
  return (
    <AppShell>
      <div className="space-y-6 max-w-3xl mx-auto">
        <h1 className="font-pixel text-2xl text-primary">About ARISE</h1>

        <Card>
          <h2 className="font-pixel text-sm text-primary mb-3">
            What is ARISE?
          </h2>
          <p className="text-white text-sm opacity-80 mb-4">
            ARISE is a gamified task management system that transforms your
            daily habits into an RPG adventure. Complete tasks, gain XP, level
            up your stats, and unlock achievements as you progress.
          </p>
        </Card>

        <Card>
          <h2 className="font-pixel text-sm text-primary mb-3">How It Works</h2>
          <ol className="list-decimal list-inside space-y-2 text-white text-sm opacity-80">
            <li>Browse available task templates or create your own</li>
            <li>Assign tasks to yourself</li>
            <li>Complete tasks in real life</li>
            <li>Mark tasks as complete to earn XP</li>
            <li>Watch your stats grow and unlock achievements</li>
          </ol>
        </Card>

        <Card>
          <h2 className="font-pixel text-sm text-primary mb-3">Stats System</h2>
          <p className="text-white text-sm opacity-80 mb-2">
            Each task is assigned to one of five stats:
          </p>
          <ul className="list-disc list-inside space-y-1 text-white text-sm opacity-80">
            <li>
              <strong>Strength</strong> - Physical activities and challenges
            </li>
            <li>
              <strong>Intelligence</strong> - Learning, reading, problem-solving
            </li>
            <li>
              <strong>Vitality</strong> - Health, wellness, self-care
            </li>
            <li>
              <strong>Agility</strong> - Speed, flexibility, quick tasks
            </li>
            <li>
              <strong>Perception</strong> - Observation, awareness, mindfulness
            </li>
          </ul>
        </Card>

        <Card>
          <h2 className="font-pixel text-sm text-primary mb-3">
            XP & Leveling
          </h2>
          <p className="text-white text-sm opacity-80">
            Every task completion grants XP. When you reach 1000 XP in a stat,
            you level up! XP resets after leveling, and the journey continues.
          </p>
        </Card>
      </div>
    </AppShell>
  );
}
