# 🔎 FindBack BD

> A modern Lost & Found platform designed to help people in Bangladesh report, search, and recover lost items.

FindBack BD is a full-stack web application that connects people who have lost items with people who have found them. Users can create lost/found reports, upload images, search and filter items, communicate through chat, and receive notifications.

---

## 🌐 Live Demo

### Frontend
https://findbackbd73.vercel.app/

### Backend API
https://findback-bd-mern.onrender.com/api/health

---

## 📌 About The Project

Losing personal belongings such as mobile phones, wallets, ID cards, documents, bags, keys, and other valuables is a common problem.

FindBack BD provides a centralized platform where users can:

- Report lost items
- Report found items
- Search for missing belongings
- Filter reports by category, location, date, and status
- Upload item images
- Contact other users
- Receive notifications
- Manage their own reports
- Use an admin dashboard for platform management

The main goal is to make the lost-and-found process faster, easier, and more organized.

---

## ✨ Features

### 👤 Authentication

- User Registration
- User Login
- JWT Authentication
- Password Hashing
- Protected Routes
- User Profile
- Logout

### 📦 Lost & Found Reports

- Create Lost Item Reports
- Create Found Item Reports
- Edit Reports
- Delete Reports
- View Item Details
- Upload Item Images
- Item Status Management

### 🔎 Search & Filtering

Users can search and filter reports based on:

- Item Category
- Location
- Date
- Lost / Found Status
- Keywords

### 💬 Real-Time Chat

FindBack BD includes real-time communication between users using:

- Socket.IO
- User-to-user messaging
- Real-time message delivery
- Conversation management

### 🔔 Notifications

Users can receive notifications for important activities such as:

- New messages
- Item-related activities
- Report updates
- Other platform events

### 🛡️ Admin Panel

Administrators can manage the platform through an admin dashboard.

Admin features include:

- User Management
- Item/Report Management
- Report Monitoring
- Platform Statistics
- Content Management

### 📱 Responsive UI

The application is designed to work across:

- Desktop
- Laptop
- Tablet
- Mobile

---

# 🛠️ Technology Stack

## Frontend

- React.js
- Vite
- Tailwind CSS
- React Router
- Axios
- Socket.IO Client
- JavaScript (ES6+)

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Socket.IO
- Multer
- Express Validator
- CORS

## Database

- MongoDB Atlas

## Deployment

- Vercel — Frontend
- Render — Backend
- MongoDB Atlas — Database

---

# 🏗️ Project Architecture

```text
FindBack BD
│
├── Frontend
│   ├── React
│   ├── Vite
│   ├── Tailwind CSS
│   ├── React Router
│   ├── Axios
│   └── Socket.IO Client
│
│
├── Backend
│   ├── Node.js
│   ├── Express.js
│   ├── JWT Authentication
│   ├── REST API
│   ├── Socket.IO
│   └── Multer
│
│
└── Database
    └── MongoDB Atlas
````

---

# 📂 Project Structure

```text
FindBack-BD/
│
├── frontend/
│   │
│   ├── public/
│   │
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   ├── vite.config.js
│   └── vercel.json
│
│
├── backend/
│   │
│   ├── config/
│   │   ├── db.js
│   │   └── ...
│   │
│   ├── controllers/
│   │   └── ...
│   │
│   ├── middleware/
│   │   └── ...
│   │
│   ├── models/
│   │   └── ...
│   │
│   ├── routes/
│   │   ├── auth.js
│   │   ├── items.js
│   │   ├── chat.js
│   │   ├── notifications.js
│   │   ├── users.js
│   │   └── admin.js
│   │
│   ├── uploads/
│   │
│   ├── server.js
│   ├── package.json
│   └── .env
│
└── README.md
```

---

# 🚀 Getting Started

Follow these steps to run the project locally.

## 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/findback-bd.git
```

Navigate into the project:

```bash
cd findback-bd
```

---

# 💻 Frontend Setup

Navigate to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:5000
```

Start the development server:

```bash
npm run dev
```

Frontend will normally run at:

```text
http://localhost:5173
```

---

# ⚙️ Backend Setup

Open another terminal and navigate to backend:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
PORT=5000

MONGO_URI=your_mongodb_atlas_connection_string

JWT_SECRET=your_jwt_secret

CLIENT_URL=http://localhost:5173
```

Start the backend:

```bash
npm run dev
```

For production:

```bash
npm start
```

Backend will run at:

```text
http://localhost:5000
```

---

# 🗄️ MongoDB Atlas Setup

1. Create a MongoDB Atlas account.
2. Create a cluster.
3. Create a database user.
4. Copy the MongoDB connection string.
5. Add the connection string to `.env`.

Example:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/findbackbd
```

Make sure your IP/network access settings allow your backend server to connect.

---

# 🔐 Environment Variables

## Frontend

```env
VITE_API_URL=http://localhost:5000
```

For production:

```env
VITE_API_URL=https://findback-bd-mern.onrender.com
```

> Do not add `/api` to `VITE_API_URL` because the API service already adds `/api`.

---

## Backend

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

CLIENT_URL=http://localhost:5173
```

For production:

```env
CLIENT_URL=https://findbackbd73.vercel.app
```

---

# 🔗 API Base URL

The backend API uses:

```text
/api
```

Production API:

```text
https://findback-bd-mern.onrender.com/api
```

Health check:

```text
https://findback-bd-mern.onrender.com/api/health
```

---

# 📡 Main API Routes

## Authentication

```text
POST /api/auth/register
POST /api/auth/login
```

## Items

```text
GET    /api/items
GET    /api/items/:id
POST   /api/items
PUT    /api/items/:id
DELETE /api/items/:id
```

## Chat

```text
GET  /api/chat
POST /api/chat
```

## Notifications

```text
GET /api/notifications
```

## Users

```text
GET /api/users
```

## Admin

```text
/api/admin
```

> Available endpoints may vary depending on the current backend implementation.

---

# 🔄 Application Flow

```text
User
 │
 ▼
React Frontend
 │
 │ Axios / Socket.IO
 ▼
Express Backend
 │
 ├── Authentication
 ├── Item Management
 ├── Chat
 ├── Notifications
 └── Admin
 │
 ▼
MongoDB Atlas
```

---

# 🖼️ Image Handling

The application supports item images.

For locally stored images, the backend exposes:

```text
/uploads
```

Example:

```text
https://findback-bd-mern.onrender.com/uploads/image.jpg
```

The frontend should use the backend URL when displaying backend-hosted images.

External image URLs can also be stored in MongoDB and displayed directly:

```json
{
  "image": "https://example.com/image.jpg"
}
```

Example React usage:

```jsx
<img
  src={item.image}
  alt={item.title}
/>
```

---

# 💬 Real-Time Communication

FindBack BD uses Socket.IO for real-time communication.

```text
User A
   │
   │ Message
   ▼
Socket.IO Server
   │
   ▼
User B
```

This allows messages and selected notifications to be delivered without manually refreshing the page.

---

# 🔒 Security

The project uses several security mechanisms:

* JWT Authentication
* Password Hashing with bcryptjs
* Protected API Routes
* Role-Based Access Control
* Input Validation
* CORS Configuration
* Environment Variables
* File Type Validation
* File Size Limits

---

# ☁️ Deployment

## Frontend — Vercel

The React frontend is deployed on Vercel.

Production URL:

```text
https://findbackbd73.vercel.app/
```

Build command:

```bash
npm run build
```

Output directory:

```text
dist
```

---

## Backend — Render

The Express backend is deployed on Render.

Production URL:

```text
https://findback-bd-mern.onrender.com
```

Build command:

```bash
npm install
```

Start command:

```bash
npm start
```

---

# 🔀 React Router & Vercel

Because FindBack BD is a React SPA, Vercel needs a rewrite configuration for direct routes such as:

```text
/onboarding
/login
/register
/dashboard
/items
/profile
```

The frontend contains:

```text
vercel.json
```

with:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

This allows React Router to handle application routes correctly.

---

# 🧪 Development Commands

## Frontend

```bash
npm install
npm run dev
npm run build
npm run preview
```

## Backend

```bash
npm install
npm run dev
npm start
```

---

# 📝 Future Improvements

The following features can be added in future versions:

* ☁️ Cloudinary image storage
* 📍 Google Maps integration
* 🔔 Push Notifications
* 🤖 AI-based item matching
* 📱 Progressive Web App support
* 📊 Advanced admin analytics
* 🔎 Improved similarity-based search
* 🛡️ Advanced fraud/spam detection
* ⚡ Redis caching
* 🌐 Multi-language support

---

# 🎯 Project Objectives

The main objectives of FindBack BD are:

1. Create a centralized Lost & Found platform.
2. Make lost item reporting easier.
3. Help users discover matching found items.
4. Provide communication between item owners and finders.
5. Reduce the difficulty of recovering lost belongings.
6. Provide an organized platform for managing lost and found reports.

---

# 👨‍💻 Developer

**Saiful Islam**

Computer Science & Engineering Student
Bangladesh

### Skills Used

```text
React.js
JavaScript
Tailwind CSS
Node.js
Express.js
MongoDB
Mongoose
JWT
Socket.IO
REST API
Git
GitHub
Vercel
Render
```

---

# 📄 License

This project was developed for educational and academic purposes.

© 2026 FindBack BD


