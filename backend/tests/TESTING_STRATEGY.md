# Testing Strategy Overview

## What to Test

Since you're using Prisma (which generates the client from your schema), you don't have traditional "model" files. Instead, you should test:

### 1. **Service Layer** (Business Logic)

- **What**: Your service functions that contain business logic
- **Why**: These are where your core application logic lives
- **How**:
  - **Unit tests**: Mock Prisma client
  - **Integration tests**: Use real test database

**Example**: `userService.getAllUsers()`, `taskService.createTask()`

### 2. **Controller Layer** (HTTP Handling)

- **What**: Request/response handling, status codes, error handling
- **Why**: Ensures API contracts are correct
- **How**: Mock the service layer

**Example**: `userController.getAllUsers()`, `taskController.createTask()`

### 3. **Middleware** (Request Processing)

- **What**: Authentication, authorization, request validation
- **Why**: Critical security and request handling logic
- **How**: Mock dependencies (JWT, Prisma)

**Example**: `authMiddleware.authenticate()`, `adminMiddleware.requireAdmin()`

### 4. **Utilities** (Helper Functions)

- **What**: Pure functions, data transformations
- **Why**: Reusable logic that needs to work correctly
- **How**: Direct unit tests (no mocking needed)

**Example**: `pickFields()`, `jwt.generateToken()`

### 5. **Routes** (API Endpoints)

- **What**: Full HTTP request/response cycle
- **Why**: End-to-end verification of API behavior
- **How**: Use `supertest` to make HTTP requests

**Example**: `GET /api/users/me`, `POST /api/tasks`

## Test Types Explained

### Unit Tests

- **Isolation**: Test one function/module at a time
- **Speed**: Very fast (no I/O)
- **Dependencies**: All mocked
- **Use Case**: Test business logic, edge cases, error handling
- **Location**: `tests/unit/`

### Integration Tests (Services)

- **Scope**: Test service layer with real database
- **Speed**: Moderate (database I/O)
- **Dependencies**: Real database, mocked external services
- **Use Case**: Verify Prisma queries work, test database constraints
- **Location**: `tests/integration/services/`

### API/Integration Tests (End-to-End)

- **Scope**: Test complete request/response cycle
- **Speed**: Slower (full stack)
- **Dependencies**: Real database, real services
- **Use Case**: Verify API contracts, authentication flows, status codes
- **Location**: `tests/integration/api/`

## What NOT to Test

1. **Prisma Client itself** - Prisma is already tested
2. **Express.js** - Framework is already tested
3. **Third-party libraries** - They have their own tests
4. **Generated code** - Prisma generates this, you don't maintain it

## Testing Patterns

### Pattern 1: Service Unit Test

```javascript
// Mock Prisma
jest.mock("../../../db", () => createPrismaMock());

// Test service logic
it("should return users", async () => {
  mockPrisma.user.findMany.mockResolvedValue([...]);
  const result = await userService.getAllUsers();
  expect(result).toEqual([...]);
});
```

### Pattern 2: Controller Unit Test

```javascript
// Mock service
jest.mock("../../../services/userService");

// Test HTTP handling
it("should return 200 with users", async () => {
  userService.getAllUsers.mockResolvedValue([...]);
  await controller.getAllUsers(req, res);
  expect(res.json).toHaveBeenCalledWith([...]);
});
```

### Pattern 3: Integration Test

```javascript
// Use real database
jest.mock("../../../db", () => getTestPrisma());

// Test with real data
it("should create and retrieve user", async () => {
  const user = await testPrisma.user.create({...});
  const result = await userService.getUserById(user.id);
  expect(result).toEqual(user);
});
```

### Pattern 4: API Test

```javascript
// Create Express app
const app = express();
app.use("/api/users", userRoutes);

// Make HTTP request
it("should return user", async () => {
  await request(app)
    .get("/api/users/me")
    .set("Authorization", `Bearer ${token}`)
    .expect(200);
});
```

## Coverage Goals

- **Services**: 80%+ coverage (core business logic)
- **Controllers**: 70%+ coverage (error handling, status codes)
- **Middleware**: 90%+ coverage (security-critical)
- **Utils**: 90%+ coverage (pure functions, easy to test)
- **Routes**: 60%+ coverage (happy paths and common errors)

## Running Tests

```bash
# All tests
npm test

# Unit tests only (fast)
npm test -- tests/unit

# Integration tests (requires database)
npm test -- tests/integration

# With coverage
npm test -- --coverage

# Watch mode
npm test -- --watch
```

## Next Steps

1. **Set up test database**: Create a separate database for testing
2. **Add more tests**: Expand coverage for all services/controllers
3. **Add test scripts**: Consider separate scripts for unit vs integration
4. **CI/CD**: Configure tests to run in your CI pipeline
5. **Test data factories**: Create helpers for generating test data

## Common Scenarios to Test

### Services

- ✅ Successful operations
- ✅ Not found errors
- ✅ Validation errors
- ✅ Duplicate entries
- ✅ Database constraint violations

### Controllers

- ✅ 200 OK responses
- ✅ 400 Bad Request
- ✅ 401 Unauthorized
- ✅ 403 Forbidden
- ✅ 404 Not Found
- ✅ 500 Internal Server Error

### Middleware

- ✅ Valid tokens
- ✅ Invalid tokens
- ✅ Missing tokens
- ✅ Expired tokens
- ✅ Admin vs regular users

### API

- ✅ Authentication flows
- ✅ Authorization checks
- ✅ Request validation
- ✅ Response formats
- ✅ Error responses
