# Arise - Gamify Your Life

A gamified life-improvement application that turns real-world tasks into RPG-style character progression. Complete tasks, gain XP, level up your stats, and unlock achievements as you improve yourself in real life.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18+-61DAFB.svg)
![Node](https://img.shields.io/badge/Node-16+-339933.svg)

---

## Features

- **RPG-Style Stat System**: 5 core stats (Strength, Intelligence, Vitality, Agility, Perception) that level up as you complete tasks
- **Task Management**: Create custom tasks aligned with your real-life goals
- **XP & Progression**: Earn experience points and watch your character grow (1000 XP = +1 stat level)
- **Achievement System**: Unlock achievements for milestones, streaks, and accomplishments
- **Login Streaks**: Build daily habits with streak tracking
- **Retro Pixel-Art UI**: Nostalgic 8-bit/16-bit aesthetic inspired by classic RPGs
- **Progress Dashboard**: Visualize your growth with charts and metrics

---

## Core Mechanics

### Stats System

Every user starts with **Level 10** in each stat:

- **⚔️ Strength** - Physical fitness, health, discipline
- **📖 Intelligence** - Learning, reading, skill development
- **❤️ Vitality** - Wellbeing, self-care, mental health
- **⚡ Agility** - Speed, efficiency, quick tasks
- **👁️ Perception** - Awareness, mindfulness, observation

### Progression Loop

1. Create a task or assign an existing one to your user
2. Complete the task in real life
3. Mark it complete in the app
4. Gain XP toward that stat (configurable XP value per task)
5. Level up when you reach 1000 XP
6. Unlock achievements along the way

---

## Tech Stack

### Frontend

- **React 18** - UI framework
- **JavaScript** - Core language
- **Tailwind CSS** - Utility-first styling
- **React Router** - Client-side routing
- **Framer Motion** - Animations
- **React Query** _(optional)_ - Server state management
- **React Hook Form** - Form handling

### Backend

- **Node.js** - Runtime
- **Express** - Web framework
- **PostgreSQL** - Database
- **JWT** - Authentication
- **Bcrypt** - Password hashing

---

## Project Structure

```
life-rpg/
├── client/                    # React frontend
│   ├── public/
│   │   └── assets/           # Pixel art images, sprites
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/       # Navbar, Footer, PageLayout
│   │   │   ├── stats/        # StatCard, StatGrid, animations
│   │   │   ├── tasks/        # TaskCard, TaskList, TaskForm
│   │   │   ├── achievements/ # Achievement displays
│   │   │   ├── dashboard/    # Metrics and charts
│   │   │   └── ui/           # Reusable components (Button, Modal, etc.)
│   │   ├── pages/            # Route components
│   │   ├── context/          # AuthContext
│   │   ├── hooks/            # Custom React hooks
│   │   ├── services/         # API service layer
│   │   ├── utils/            # Constants, helpers
│   │   ├── App.jsx
│   │   └── index.jsx
│   └── package.json
│
├── server/                    # Express backend
│   ├── controllers/          # Route handlers
│   ├── models/               # Database models
│   ├── routes/               # API routes
│   ├── middleware/           # Auth, validation
│   ├── services/             # Business logic
│   ├── config/               # Database, environment config
│   └── index.js
│
└── README.md
```

---

## Getting Started

### Prerequisites

- **Node.js** 16+ and npm
- **PostgreSQL** 12+
- Git

### Installation

1. **Clone the repository**

```bash
   git clone https://github.com/yourusername/life-rpg.git
   cd life-rpg
```

2. **Set up the backend**

```bash
   cd server
   npm install
```

3. **Configure environment variables**

   Create a `.env` file in the `server/` directory:

```env
   PORT=3000
   DATABASE_URL=postgresql://username:password@localhost:5432/life_rpg
   JWT_SECRET=your_super_secret_jwt_key_here
   API_PREFIX=/api/v1
   NODE_ENV=development
```

4. **Set up the database**
```bash
   # Initialize Prisma (if not already done)
   npx prisma init
   
   # This creates:
   # - prisma/schema.prisma (your database schema)
   # - .env file (with DATABASE_URL)
   
   # Generate Prisma Client
   npx prisma generate
   
   # Run migrations to create database tables
   npx prisma migrate dev --name init
   
   # (Optional) Seed the database with initial data
   npx prisma db seed
```
   
   **Note**: Make sure your `DATABASE_URL` in `.env` is configured correctly:
```env
   DATABASE_URL="postgresql://username:password@localhost:5432/life_rpg?schema=public"
```
   
   **Useful Prisma Commands:**
```bash
   # View your database in Prisma Studio (GUI)
   npx prisma studio
   
   # Reset database (WARNING: deletes all data)
   npx prisma migrate reset
   
   # Create a new migration after schema changes
   npx prisma migrate dev --name your_migration_name
```

5. **Start the backend server**

```bash
   npm run dev
```

Server will run on `http://localhost:53000`

6. **Set up the frontend**

   Open a new terminal:

```bash
   cd client
   npm install
```

7. **Configure frontend environment**

   Create a `.env` file in the `client/` directory:

```env
   REACT_APP_API_URL=http://localhost:3000
```

8. **Start the frontend**

```bash
   npm start
```

App will open at `http://localhost:3000` (or next available port)

---

## 📡 API Documentation

### Base URL

```
http://localhost:3000/api/v1
```

### Authentication

All authenticated endpoints require the `Authorization` header:

```
Authorization: Bearer <your_jwt_token>
```

### Endpoints

#### **Auth**

- `POST /auth/register` - Create new user account
- `POST /auth/login` - Authenticate and receive JWT token

#### **Users**

- `GET /users/me` - Get current user info
- `PATCH /users/me` - Update current user
- `DELETE /users/me` - Delete account

#### **Categories** (Stat Types)

- `GET /categories` - List all stat categories
- `GET /categories/:id` - Get single category

#### **Stats**

- `GET /stats/me` - Get all stats for current user
- `GET /stats/me/:categoryId` - Get specific stat

#### **Tasks** (Templates)

- `GET /tasks` - List all task templates
- `POST /tasks` - Create new task template
- `GET /tasks/:id` - Get single task
- `PATCH /tasks/:id` - Update task
- `DELETE /tasks/:id` - Delete task

#### **User Tasks**

- `GET /userTasks` - Get user's active tasks
- `POST /userTasks/:taskId/assign` - Assign task to user
- `POST /userTasks/:taskId/complete` - Complete task and gain XP

#### **Achievements**

- `GET /achievements` - List all achievements (shows unlock status if authenticated)
- `GET /achievements/:id` - Get single achievement

---

## Design System

### Typography

- **Headers**: 'Press Start 2P' (pixel font)
- **Body**: 'Pixelify Sans' for readability

### Components

- Chunky pixel borders (`border-4`, `border-8`)
- Minimal rounded corners
- Button pressed states (`active:translate-y-1`)
- Stepped animations (no smooth transitions)
- Blocky progress bars

---

## Roadmap

### Phase 1: MVP (Current)

- [x] User authentication
- [x] Task CRUD operations
- [x] XP and stat leveling system
- [x] Basic achievement system
- [x] Login streak tracking

### Phase 2: Enhanced UX

- [ ] Animated XP gains and level-ups
- [ ] Achievement unlock notifications
- [ ] Dashboard with progress charts
- [ ] Mobile-responsive design
- [ ] Dark mode toggle

### Phase 3: Advanced Features

- [ ] Recurring tasks
- [ ] Task templates library
- [ ] Custom categories
- [ ] Export/import data
- [ ] Task reminders

### Phase 4: Social Features

- [ ] Friend connections
- [ ] View friends' stats
- [ ] Leaderboards
- [ ] Collaborative challenges

---

## Contributing

This is currently a personal project, but suggestions and feedback are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- Inspired by [Habitica](https://habitica.com/) and classic 16-bit RPGs
- Pixel art aesthetic inspired by NES/SNES era games
- Built as a portfolio project to demonstrate full-stack development skills

---

## Contact

**Harsh Patel** - [LinkedIn](https://www.linkedin.com/in/harsh-patel10/) - harshpxv@gmail.com

Project Link: [https://github.com/hpatel-27/arise](https://github.com/hpatel-27/arise)

---

## Tips for Use

### Getting the Most Out of Life RPG

1. **Start Small**: Create 2-3 tasks for your first day, don't overwhelm yourself
2. **Be Honest**: Only mark tasks complete when you actually do them
3. **Balance Stats**: Don't neglect any stat - well-rounded characters are strongest
4. **Custom XP Values**: Give harder tasks more XP (100-500 range)
5. **Daily Login**: Maintain your streak for achievement bonuses
6. **Review Progress**: Check your dashboard weekly to see growth trends

### Task Examples

**Strength (⚔️)**

- 30-minute workout (150 XP)
- Take the stairs (50 XP)
- Meal prep healthy food (100 XP)

**Intelligence (📖)**

- Read for 30 minutes (100 XP)
- Complete online course lesson (200 XP)
- Practice coding problem (150 XP)

**Vitality (❤️)**

- Meditate for 10 minutes (80 XP)
- Get 8 hours of sleep (100 XP)
- Take a walk outside (75 XP)

**Agility (⚡)**

- Clear email inbox (50 XP)
- Organize workspace (100 XP)
- Complete quick errands (75 XP)

**Perception (👁️)**

- Journal for 15 minutes (100 XP)
- Practice mindfulness (80 XP)
- Notice 3 good things today (50 XP)

---

**Level up your life, one task at a time!**
