# Testing Guide

This directory contains comprehensive tests for the backend application, including unit tests, integration tests, and API tests.

## Test Structure

```
tests/
├── helpers/              # Test utilities and helpers
│   ├── prismaMock.js     # Prisma client mock for unit tests
│   ├── testHelpers.js    # Common test utilities (mocks, factories)
│   └── database.js       # Database helpers for integration tests
├── unit/                 # Unit tests (mocked dependencies)
│   ├── services/         # Service layer unit tests
│   ├── controllers/      # Controller layer unit tests
│   ├── middleware/       # Middleware unit tests
│   └── utils/            # Utility function tests
├── integration/          # Integration tests (real database)
│   ├── services/         # Service integration tests
│   └── api/              # API endpoint tests (end-to-end)
└── setup.js              # Global test configuration
```

## Test Types

### 1. Unit Tests (`tests/unit/`)

**Purpose**: Test individual functions/modules in isolation with mocked dependencies.

**Characteristics**:
- Fast execution
- No database connection required
- Mock all external dependencies (Prisma, services, etc.)
- Test business logic, error handling, edge cases

**Example**: Testing a service function with mocked Prisma client.

### 2. Integration Tests (`tests/integration/services/`)

**Purpose**: Test service layer with a real database connection.

**Characteristics**:
- Uses a test database
- Tests actual database operations
- Verifies Prisma queries work correctly
- Slower than unit tests

**Requirements**:
- Set `TEST_DATABASE_URL` in your environment
- Run migrations on test database: `npx prisma migrate deploy`
- Test database should be separate from development database

### 3. API Tests (`tests/integration/api/`)

**Purpose**: Test complete HTTP request/response cycle (end-to-end).

**Characteristics**:
- Tests full stack: Routes → Middleware → Controllers → Services → Database
- Uses `supertest` for HTTP requests
- Verifies status codes, response bodies, headers
- Most comprehensive but slowest

**Requirements**:
- Test database (same as integration tests)
- Server should not be running (tests create their own Express app)

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Specific Test Types
```bash
# Unit tests only
npm test -- tests/unit

# Integration tests only
npm test -- tests/integration

# Specific test file
npm test -- tests/unit/services/userService.test.js
```

### Run Tests with Coverage
```bash
npm test -- --coverage
```

### Run Tests in Watch Mode
```bash
npm test -- --watch
```

## Setting Up Test Environment

### 1. Environment Variables

Create a `.env.test` file or set these environment variables:

```env
NODE_ENV=test
TEST_DATABASE_URL=postgresql://user:password@localhost:5432/test_db
JWT_SECRET=test-secret-key-for-jwt
```

### 2. Test Database Setup

1. Create a separate test database:
   ```sql
   CREATE DATABASE test_db;
   ```

2. Run migrations on test database:
   ```bash
   DATABASE_URL=postgresql://user:password@localhost:5432/test_db npx prisma migrate deploy
   ```

3. Or use Prisma's test database setup:
   ```bash
   npx prisma migrate dev --name test_setup
   ```

## Writing Tests

### Unit Test Example

```javascript
const userService = require("../../../services/userService");
const { createPrismaMock } = require("../../helpers/prismaMock");

jest.mock("../../../db", () => createPrismaMock());

describe("UserService - Unit Tests", () => {
  let mockPrisma;

  beforeEach(() => {
    mockPrisma = require("../../../db");
    jest.clearAllMocks();
  });

  it("should return all users", async () => {
    const mockUsers = [{ id: 1, email: "test@example.com" }];
    mockPrisma.user.findMany.mockResolvedValue(mockUsers);

    const result = await userService.getAllUsers();

    expect(result).toEqual(mockUsers);
  });
});
```

### Integration Test Example

```javascript
const userService = require("../../../services/userService");
const { getTestPrisma, cleanupDatabase } = require("../../helpers/database");

jest.mock("../../../db", () => {
  const { getTestPrisma } = require("../../helpers/database");
  return getTestPrisma();
});

describe("UserService - Integration Tests", () => {
  beforeAll(async () => {
    await cleanupDatabase();
  });

  it("should create and retrieve user", async () => {
    // Test with real database
  });
});
```

### API Test Example

```javascript
const request = require("supertest");
const express = require("express");
const userRoutes = require("../../../routes/users");

describe("Users API", () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use("/api/users", userRoutes);
  });

  it("should return user with valid token", async () => {
    const response = await request(app)
      .get("/api/users/me")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(response.body).toHaveProperty("id");
  });
});
```

## Test Helpers

### `createPrismaMock()`
Creates a mock Prisma client for unit tests. All Prisma methods are mocked as Jest functions.

### `createMockRequest(overrides)`
Creates a mock Express request object with optional overrides.

### `createMockResponse()`
Creates a mock Express response object with mocked methods (status, json, send, etc.).

### `createMockUser(overrides)`
Creates a mock user object for testing.

### `getTestPrisma()`
Gets a Prisma client connected to the test database.

### `cleanupDatabase()`
Cleans all test data from the database.

## Best Practices

1. **Isolation**: Each test should be independent and not rely on other tests.

2. **Cleanup**: Always clean up test data (use `beforeEach`/`afterEach` hooks).

3. **Mocking**: 
   - Unit tests: Mock all external dependencies
   - Integration tests: Use real database but mock external services (APIs, etc.)
   - API tests: Use real database and real services

4. **Naming**: Use descriptive test names that explain what is being tested.

5. **Arrange-Act-Assert**: Structure tests clearly:
   - Arrange: Set up test data
   - Act: Execute the code being tested
   - Assert: Verify the results

6. **Coverage**: Aim for high coverage but focus on testing critical business logic.

## Common Patterns

### Testing Error Cases
```javascript
it("should throw error when user not found", async () => {
  mockPrisma.user.findUnique.mockResolvedValue(null);
  
  await expect(userService.getUserById(999)).rejects.toThrow("User not found");
});
```

### Testing HTTP Responses
```javascript
it("should return 404 for non-existent user", async () => {
  await request(app)
    .get("/api/users/999")
    .expect(404)
    .expect((res) => {
      expect(res.body.error).toBe("User not found");
    });
});
```

### Testing Authentication
```javascript
it("should require authentication", async () => {
  await request(app)
    .get("/api/users/me")
    .expect(401);
});
```

## Troubleshooting

### Tests fail with database connection errors
- Ensure `TEST_DATABASE_URL` is set correctly
- Verify test database exists and is accessible
- Check that migrations have been run

### Mock not working
- Ensure you're mocking before importing the module
- Check that the mock path matches the actual import path
- Use `jest.clearAllMocks()` in `beforeEach` to reset mocks

### Integration tests are slow
- This is expected - they use a real database
- Consider running unit tests separately during development
- Use `test.only()` or `describe.only()` to run specific tests

## CI/CD Integration

For continuous integration, ensure:
1. Test database is set up in CI environment
2. `TEST_DATABASE_URL` is configured as a CI secret
3. Migrations run before tests
4. Tests run in isolated environment

Example GitHub Actions step:
```yaml
- name: Run tests
  env:
    TEST_DATABASE_URL: ${{ secrets.TEST_DATABASE_URL }}
  run: |
    npm test
```

