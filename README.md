# Web Pacific - Japanese Studies Faculty Website

A full-stack website for a Japanese Language & Studies Faculty, featuring multilingual support (Vietnamese / English / Japanese), JLPT practice tests, research publications, programs, news, and an admin panel.

---

## Tech Stack

| Layer     | Technology                                  |
|-----------|---------------------------------------------|
| Backend   | Node.js + Express + MongoDB (Mongoose)      |
| Auth      | JWT (jsonwebtoken) + bcryptjs               |
| Upload    | Multer                                      |
| Mail      | Nodemailer                                  |
| Frontend  | React 18 + Vite + Tailwind CSS (to be built)|

---

## Prerequisites

- Node.js >= 18
- MongoDB running locally on `mongodb://localhost:27017`
- npm >= 9

---

## Quick Start

### 1. Install dependencies
```
install.bat
```
Or manually:
```bash
cd backend && npm install
cd ../frontend && npm install
```

### 2. Configure environment
The `.env` file is pre-configured with defaults:
```
PORT=5010
MONGODB_URI=mongodb://localhost:27017/web_pacific
JWT_SECRET=web_pacific_secret_2024
JWT_EXPIRES_IN=7d
ADMIN_EMAIL=admin@japanesefaculty.edu.vn
```

For email notifications, add your SMTP credentials in `backend/.env`.

### 3. Seed the database
```bash
cd backend
npm run seed
```

### 4. Start the application
```
start.bat
```
Or manually:
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

---

## Demo Accounts

| Role       | Email                                    | Password   |
|------------|------------------------------------------|------------|
| Admin      | admin@japanesefaculty.edu.vn             | Admin@123  |
| Moderator  | moderator@japanesefaculty.edu.vn         | Mod@123    |
| User       | user1@japanesefaculty.edu.vn             | User@123   |
| User       | user2@japanesefaculty.edu.vn             | User@123   |

---

## API Endpoints

Base URL: `http://localhost:5010/api`

### Auth
| Method | Endpoint                    | Description              | Auth     |
|--------|-----------------------------|--------------------------|----------|
| POST   | /auth/login                 | Login                    | Public   |
| POST   | /auth/register              | Register (user role)     | Public   |
| GET    | /auth/me                    | Get current user         | Required |
| PUT    | /auth/update-profile        | Update profile           | Required |
| PUT    | /auth/change-password       | Change password          | Required |

### Articles
| Method | Endpoint                    | Description              | Auth     |
|--------|-----------------------------|--------------------------|----------|
| GET    | /articles                   | List articles            | Optional |
| GET    | /articles/featured          | Featured articles (6)    | Optional |
| GET    | /articles/:slug             | Get article + views++    | Optional |
| POST   | /articles                   | Create article           | Admin    |
| PUT    | /articles/:id               | Update article           | Admin    |
| DELETE | /articles/:id               | Delete article           | Admin    |

Query params: `?page=1&limit=10&category=news&locale=vi&search=keyword&status=published`

### Programs
| Method | Endpoint                    | Description              | Auth     |
|--------|-----------------------------|--------------------------|----------|
| GET    | /programs                   | List programs            | Optional |
| GET    | /programs/:slug             | Get program              | Optional |
| POST   | /programs                   | Create program           | Admin    |
| PUT    | /programs/:id               | Update program           | Admin    |
| DELETE | /programs/:id               | Delete program           | Admin    |

Query params: `?type=formal|non-formal|postgraduate&locale=vi`

### Research
| Method | Endpoint                    | Description              | Auth     |
|--------|-----------------------------|--------------------------|----------|
| GET    | /research                   | List research            | Optional |
| GET    | /research/:slug             | Get research item        | Optional |
| POST   | /research                   | Create research          | Admin    |
| PUT    | /research/:id               | Update research          | Admin    |
| DELETE | /research/:id               | Delete research          | Admin    |

Query params: `?type=faculty|student&year=2024&tags=tag1,tag2`

### Tests (JLPT Practice)
| Method | Endpoint                    | Description              | Auth     |
|--------|-----------------------------|--------------------------|----------|
| GET    | /tests                      | List tests (no questions)| Optional |
| GET    | /tests/:slug                | Get test with questions  | Optional |
| POST   | /tests/:id/submit           | Submit answers           | Required |
| GET    | /tests/results/my           | My test results          | Required |
| POST   | /tests                      | Create test              | Admin    |
| PUT    | /tests/:id                  | Update test              | Admin    |
| DELETE | /tests/:id                  | Delete test              | Admin    |

### Comments
| Method | Endpoint                        | Description              | Auth        |
|--------|---------------------------------|--------------------------|-------------|
| GET    | /comments/article/:articleId    | Get article comments     | Optional    |
| POST   | /comments                       | Submit comment (pending) | Optional    |
| GET    | /comments                       | All comments (admin)     | Mod/Admin   |
| PUT    | /comments/:id/approve           | Approve comment          | Mod/Admin   |
| PUT    | /comments/:id/reject            | Reject comment           | Mod/Admin   |
| DELETE | /comments/:id                   | Delete comment           | Mod/Admin   |

### Contact
| Method | Endpoint                    | Description              | Auth     |
|--------|-----------------------------|--------------------------|----------|
| POST   | /contact/submit             | Submit contact form      | Public   |
| GET    | /contact                    | List contacts            | Admin    |
| PUT    | /contact/:id/status         | Update status            | Admin    |
| DELETE | /contact/:id                | Delete contact           | Admin    |

### Upload
| Method | Endpoint                    | Description              | Auth     |
|--------|-----------------------------|--------------------------|----------|
| POST   | /upload/image               | Upload single image      | Required |
| POST   | /upload/images              | Upload multiple images   | Required |

### Users (Admin)
| Method | Endpoint                    | Description              | Auth     |
|--------|-----------------------------|--------------------------|----------|
| GET    | /users                      | List all users           | Admin    |
| GET    | /users/:id                  | Get user                 | Admin    |
| PUT    | /users/:id                  | Update user              | Admin    |
| DELETE | /users/:id                  | Delete user              | Admin    |
| POST   | /users/create-staff         | Create staff account     | Admin    |

---

## Seed Data Summary

- **Users:** 1 admin, 1 moderator, 2 regular users
- **Articles:** 10 articles (news, events, internship, conference, research, student) with VI/EN/JP translations
- **Programs:** 6 programs:
  - 3 Formal: Cử nhân Ngôn ngữ Nhật, Cử nhân Sư phạm, Cử nhân Biên phiên dịch
  - 1 Non-formal: Tiếng Nhật giao tiếp (người đi làm)
  - 2 Postgraduate: Thạc sĩ, Tiến sĩ
- **Research:** 4 items (2 faculty, 2 student) with VI/EN/JP translations
- **Tests:** 3 tests with real Japanese vocabulary/grammar questions:
  - N5 Practice (10 questions - beginner vocabulary)
  - N4 Practice (10 questions - intermediate grammar)
  - General Culture (10 questions - Japanese culture/society)
- **Comments:** 5 sample approved comments

---

## Multilingual API Usage

All public GET endpoints support `?locale=vi|en|jp` query parameter.

Example: `GET /api/articles?locale=jp` returns articles with Japanese translations.

Response shape includes a `translation` field with the selected locale's content.

---

## File Structure

```
backend/
├── server.js              # Express app entry point
├── package.json
├── .env                   # Environment variables
├── .env.example           # Environment template
├── uploads/               # Uploaded files (served statically)
├── seed/
│   └── index.js           # Database seeder
└── src/
    ├── middleware/
    │   └── auth.js        # JWT auth, role guards
    ├── models/
    │   ├── User.js
    │   ├── Article.js
    │   ├── Program.js
    │   ├── Research.js
    │   ├── Test.js
    │   ├── TestResult.js
    │   ├── Comment.js
    │   └── Contact.js
    ├── controllers/
    │   ├── authController.js
    │   ├── articleController.js
    │   ├── programController.js
    │   ├── researchController.js
    │   ├── testController.js
    │   ├── commentController.js
    │   ├── contactController.js
    │   ├── uploadController.js
    │   └── userController.js
    └── routes/
        ├── auth.js
        ├── articles.js
        ├── programs.js
        ├── research.js
        ├── tests.js
        ├── comments.js
        ├── contact.js
        ├── upload.js
        └── users.js
```
