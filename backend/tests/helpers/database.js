/**
 * Database Helper for Integration Tests
 * 
 * This helper manages a test database connection and provides utilities
 * for setting up and tearing down test data.
 * 
 * Note: For integration tests, you'll need a separate test database.
 * Set TEST_DATABASE_URL in your .env file or environment.
 */

const { PrismaClient } = require("@prisma/client");

let prisma;

/**
 * Get or create a Prisma client instance for testing
 */
function getTestPrisma() {
  if (!prisma) {
    prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.TEST_DATABASE_URL, // || process.env.DATABASE_URL,
        },
      },
    });
  }
  return prisma;
}

/**
 * Clean up all test data from the database
 * This should be called before/after test suites
 */
async function cleanupDatabase() {
  const testPrisma = getTestPrisma();
  
  // Delete in order to respect foreign key constraints
  await testPrisma.userTaskCompletion.deleteMany();
  await testPrisma.userTask.deleteMany();
  await testPrisma.userLog.deleteMany();
  await testPrisma.userStat.deleteMany();
  await testPrisma.userAchievement.deleteMany();
  await testPrisma.task.deleteMany();
  await testPrisma.achievement.deleteMany();
  await testPrisma.category.deleteMany();
  await testPrisma.user.deleteMany();
}

/**
 * Disconnect from the test database
 */
async function disconnectDatabase() {
  if (prisma) {
    await prisma.$disconnect();
    prisma = null;
  }
}

/**
 * Seed test data (optional - customize as needed)
 */
async function seedTestData() {
  const testPrisma = getTestPrisma();
  
  // Example: Create a test category
  const category = await testPrisma.category.upsert({
    where: { name: "Test Category" },
    update: {},
    create: {
      name: "Test Category",
      description: "Category for testing",
    },
  });

  return { category };
}

module.exports = {
  getTestPrisma,
  cleanupDatabase,
  disconnectDatabase,
  seedTestData,
};

