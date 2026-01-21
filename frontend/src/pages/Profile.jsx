import { AppShell } from "../components/layout/AppShell";
import { Card } from "../components/ui/Card";
import { CharacterAvatar } from "../components/progression/CharacterAvatar";
import { useStats } from "../hooks/useStats";
import { useUserInfo } from "../hooks/useUser";

export default function Profile() {
  const { stats } = useStats();
  const { userInfo } = useUserInfo();
  console.log("USERINFO: ", userInfo);

  // Calculate average level
  const averageLevel =
    stats && stats.length > 0
      ? Math.floor(
          stats.reduce((sum, stat) => sum + stat.statLevel, 0) / stats.length
        )
      : 1;

  return (
    <AppShell>
      <div className="space-y-6">
        <h1 className="font-pixel text-2xl text-primary">Profile</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <h2 className="font-pixel text-sm text-white mb-4">Character</h2>
            <CharacterAvatar level={averageLevel} />
          </Card>

          <Card>
            <h2 className="font-pixel text-sm text-white mb-4">Account Info</h2>
            <div className="space-y-2">
              <div>
                <span className="font-pixel text-xs text-white opacity-80">
                  Email:
                </span>
                <p className="font-pixel text-xs text-primary">
                  {userInfo ? userInfo?.email : "N/A"}
                </p>
              </div>
              <div>
                <span className="font-pixel text-xs text-white opacity-80">
                  First Name:
                </span>
                <p className="font-pixel text-xs text-primary">
                  {userInfo ? userInfo?.firstName : "N/A"}
                </p>
              </div>
              <div>
                <span className="font-pixel text-xs text-white opacity-80">
                  Last Name:
                </span>
                <p className="font-pixel text-xs text-primary">
                  {userInfo ? userInfo?.lastName : "N/A"}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
