import { Link } from "react-router-dom";
import { AppShell } from "../components/layout/AppShell";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { StatBadge } from "../components/stats/StatBadge";

export default function Landing() {
  const stats = [
    "Strength",
    "Intelligence",
    "Vitality",
    "Agility",
    "Perception",
  ];

  return (
    <AppShell>
      <div className="space-y-12">
        <section className="text-center py-12">
          <h1 className="font-pixel text-4xl text-primary mb-4">ARISE</h1>
          <p className="font-pixel text-sm text-white mb-8 max-w-2xl mx-auto">
            Level up your real life. Complete tasks, gain XP, and grow your
            stats. Transform your daily habits into an epic RPG adventure.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/register">
              <Button variant="primary">Start Your Journey</Button>
            </Link>
            <Link to="/login">
              <Button variant="accent">Login</Button>
            </Link>
          </div>
        </section>

        <section>
          <h2 className="font-pixel text-2xl text-primary mb-6 text-center">
            Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <h3 className="font-pixel text-sm text-primary mb-3">
                ⚔️ Stats System
              </h3>
              <p className="text-white text-xs opacity-80">
                Track 5 core stats: Strength, Intelligence, Vitality, Agility,
                and Perception. Level up through completing tasks.
              </p>
            </Card>

            <Card>
              <h3 className="font-pixel text-sm text-primary mb-3">
                📋 Task Management
              </h3>
              <p className="text-white text-xs opacity-80">
                Create and assign tasks to yourself. Complete them to earn XP
                and progress your stats.
              </p>
            </Card>

            <Card>
              <h3 className="font-pixel text-sm text-primary mb-3">
                🏆 Achievements
              </h3>
              <p className="text-white text-xs opacity-80">
                Unlock achievements as you reach milestones. Track your progress
                and celebrate your wins.
              </p>
            </Card>
          </div>
        </section>

        <section>
          <h2 className="font-pixel text-2xl text-primary mb-6 text-center">
            Your Stats
          </h2>
          <div className="flex justify-center gap-4 flex-wrap">
            {stats.map((stat) => (
              <div key={stat} className="card-pixel text-center">
                <StatBadge statName={stat} size="lg" />
                <p className="font-pixel text-xs text-white mt-2">{stat}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
