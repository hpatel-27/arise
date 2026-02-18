const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seed...");

  // ============================================
  // CATEGORIES (Stat Categories)
  // ============================================
  console.log("Seeding Categories...");

  const categories = [
    {
      name: "Strength",
      description: "Physical power tasks (e.g., gym workouts, pushups)",
    },
    {
      name: "Agility",
      description:
        "Movement, endurance, and flexibility tasks (e.g., running, yoga)",
    },
    {
      name: "Intelligence",
      description: "Cognitive and learning tasks (e.g., LeetCode, reading)",
    },
    {
      name: "Vitality",
      description: "Health and self-care tasks (e.g., hydration, sleep)",
    },
    {
      name: "Perception",
      description:
        "Awareness and reflection tasks (e.g., meditation, journaling)",
    },
    // Add more categories here following the same format
    // {
    //   name: 'Agility',
    //   description: 'Speed, flexibility, and coordination',
    // },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    });
    console.log(`✓ Category: ${category.name}`);
  }

  // ============================================
  // TASKS
  // ============================================
  console.log("\nSeeding Tasks...");

  // Get category IDs for task creation
  const strengthCategory = await prisma.category.findUnique({
    where: { name: "Strength" },
  });

  const agilityCategory = await prisma.category.findUnique({
    where: { name: "Agility" },
  });

  const intelligenceCategory = await prisma.category.findUnique({
    where: { name: "Intelligence" },
  });

  const vitalityCategory = await prisma.category.findUnique({
    where: { name: "Vitality" },
  });

  const perceptionCategory = await prisma.category.findUnique({
    where: { name: "Perception" },
  });

  const tasks = [
    {
      categoryId: agilityCategory.id,
      name: "Morning Walk",
      requirement: "Go for a 30-minute walk or light job",
      xpValue: 100,
    },
    {
      categoryId: agilityCategory.id,
      name: "Run 3 Miles",
      requirement: "Complete a 3-mile outdoor or treadmill run.",
      xpValue: 200,
    },
    {
      categoryId: agilityCategory.id,
      name: "Stretch & Mobility",
      requirement: "Spend at least 15 minutes stretching or doing yoga.",
      xpValue: 100,
    },
    {
      categoryId: intelligenceCategory.id,
      name: "Solve a LeetCode",
      requirement: "Complete at least one LeetCode or coding challenge.",
      xpValue: 150,
    },
    {
      categoryId: intelligenceCategory.id,
      name: "Read a Chapter",
      requirement: "Read one chapter of a book (fiction or non-fiction).",
      xpValue: 120,
    },
    {
      categoryId: intelligenceCategory.id,
      name: "Watch Educational Video",
      requirement:
        "Watch one educational or documentary-style video (YouTube, course, etc.).",
      xpValue: 140,
    },
    {
      categoryId: vitalityCategory.id,
      name: "Sleep 8 Hours",
      requirement: "Get a full, quality night's sleep.",
      xpValue: 200,
    },
    {
      categoryId: vitalityCategory.id,
      name: "Stay Hydrated",
      requirement: "Drink at least 2 liters (8 cups) of water today.",
      xpValue: 150,
    },
    {
      categoryId: vitalityCategory.id,
      name: "Healthy Meal",
      requirement: "Cook or eat a nutritious, balanced meal.",
      xpValue: 150,
    },
    {
      categoryId: perceptionCategory.id,
      name: "Digital Detox",
      requirement: "Spend at least 2 hours without your phone or distractions.",
      xpValue: 200,
    },
    {
      categoryId: perceptionCategory.id,
      name: "Meditate",
      requirement: "Meditate or practice mindfulness for 10-15 minutes.",
      xpValue: 100,
    },
    {
      categoryId: perceptionCategory.id,
      name: "Reflection",
      requirement: "Reflect upon your day or goals.",
      xpValue: 120,
    },
    {
      categoryId: strengthCategory.id,
      name: "Gym Session",
      requirement:
        "Complete a full gym workout (weight training or resistance training).",
      xpValue: 200,
    },
    {
      categoryId: strengthCategory.id,
      name: "Bodyweight Workout",
      requirement:
        "Do a structured bodyweight session (pushups, squats, planks).",
      xpValue: 150,
    },
    {
      categoryId: strengthCategory.id,
      name: "Pushup Challenge",
      requirement: "Complete 100 pushups total throughout the day.",
      xpValue: 120,
    },
    {
      categoryId: strengthCategory.id,
      name: "Squat Challenge",
      requirement: "Complete 100 squats total throughout the day.",
      xpValue: 120,
    },
    {
      categoryId: strengthCategory.id,
      name: "Lunge Challenge",
      requirement: "Complete 100 lunges total throughout the day.",
      xpValue: 120,
    },
    {
      categoryId: vitalityCategory.id,
      name: "Watch a movie",
      requirement: "Take a break and relax by watching a movie of your choice.",
      xpValue: 140,
    },
    // Add more tasks here following the same format
    // {
    //   categoryId: strengthCategory.id,
    //   name: 'Do 50 push-ups',
    //   requirement: 'Complete 50 push-ups in a single session',
    //   xpValue: 75,
    //   targetValue: 50,
    // },
  ];

  for (const task of tasks) {
    await prisma.task.upsert({
      where: { name: task.name },
      update: {},
      create: task,
    });
    console.log(`✓ Task: ${task.name}`);
  }

  // ============================================
  // ACHIEVEMENTS
  // ============================================
  console.log("\nSeeding Achievements...");

  const achievements = [
    {
      name: "First Steps",
      description: "Complete your first task",
      iconPath: "/icons/first-steps.png",
      category: "PROGRESS",
      metric: "task_completed",
      targetValue: 1,
    },
    {
      name: "Level Up!",
      description: "Reach Level 5",
      iconPath: null,
      category: "PROGRESS",
    },
    {
      name: "Climbing Higher",
      description: "Reach Level 10",
      iconPath: null,
      category: "PROGRESS",
    },
    {
      name: "The Journey Continues",
      description: "Earn 1,000 XP",
      iconPath: null,
      category: "PROGRESS",
    },
    {
      name: "A New Beginning",
      description: "Login to your character",
      iconPath: null,
      category: "CONSISTENCY",
    },
    {
      name: "Daily Grind",
      description: "Complete tasks 7 days in a row",
      iconPath: null,
      category: "CONSISTENCY",
    },
    {
      name: "Unstoppable",
      description: "Maintain a 30-day streak",
      iconPath: null,
      category: "CONSISTENCY",
    },
    {
      name: "Balanced Hero",
      description:
        "Complete at least one task in 3 different areas in the same day",
      iconPath: null,
      category: "CONSISTENCY",
    },
    {
      name: "Code Novice",
      description: "Solve a LeetCode problem",
      iconPath: null,
      category: "LEARNING",
    },
    {
      name: "Problem Solver",
      description: "Solve 10 coding problems",
      iconPath: null,
      category: "LEARNING",
    },
    {
      name: "Polyglot in Training",
      description: "Learn 20 new words in a language",
      iconPath: null,
      category: "LEARNING",
    },
    {
      name: "Knowledge Collector",
      description:
        "Log tasks in 3 different learning categories (e.g., coding, language, reading)",
      iconPath: null,
      category: "LEARNING",
    },
    {
      name: "Explorer",
      description: "Try a new activity for the first time",
      iconPath: null,
      category: "EXPLORATION",
    },
    {
      name: "Jack of All Trades",
      description: "Log at least 5 different kinds of tasks",
      iconPath: null,
      category: "EXPLORATION",
    },
    {
      name: "Treasure Hunter",
      description: "Open your first crate",
      iconPath: null,
      category: "LOOT",
    },
    {
      name: "Collector",
      description: "Open 10 crates",
      iconPath: null,
      category: "LOOT",
    },
    {
      name: "Rare Find",
      description: "Discover a rare item from a crate",
      iconPath: null,
      category: "LOOT",
    },
    {
      name: "Oh Wow!",
      description: "Open a EPIC rarity crate",
      iconPath: null,
      category: "LOOT",
    },
    {
      name: "Resolution Keeper",
      description: "Complete 30 tasks in January",
      iconPath: null,
      category: "EVENT",
    },
    {
      name: "Summer Streak",
      description: "Log tasks every week during the summer months",
      iconPath: null,
      category: "EVENT",
    },
    {
      name: "Night Owl",
      description: "Complete a task after 2:00 AM",
      iconPath: null,
      category: "HIDDEN",
    },
    {
      name: "Overachiever",
      description: "Complete 10+ tasks in a single day",
      iconPath: null,
      category: "HIDDEN",
    },
    // Add more achievements here following the same format
    // {
    //   name: '7-Day Streak',
    //   description: 'Log in for 7 consecutive days',
    //   iconPath: '/icons/7-day-streak.png',
    //   category: 'Consistency',
    //   metric: 'login',
    //   targetValue: 7,
    // },
  ];

  for (const achievement of achievements) {
    await prisma.achievement.upsert({
      where: { name: achievement.name },
      update: {},
      create: achievement,
    });
    console.log(`✓ Achievement: ${achievement.name}`);
  }

  console.log("\n✅ Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
