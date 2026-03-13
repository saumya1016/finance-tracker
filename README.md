# Finance Tracker Web Application (MERN Stack)

A fully functional, responsive Finance Tracker application. This app allows users to manage income and expenses with secure 2-step OTP authentication.

## 📌 Core Features

- **Authenticated Dashboard:** Add transactions (Income/Expense) with descriptions and amounts.
- **Transaction History:** View recent activities with advanced server-side filtering (type, date, amount) and sorting.
- **2-Step Authentication:** - JWT-based authorization.
  - OTP verification for Signup, Signin, Forgot Password, and Change Password.
- **User Profile:** View and update account details, including masked password and secure password resets.
- **Responsive UI:** Clean, modern interface optimized for mobile and desktop using Tailwind CSS.

## 🛠️ Tech Stack

- **Frontend:** React.js, Tailwind CSS, Lucide-React, Axios
- **Backend:** Node.js, Express.js, MongoDB Atlas
- **Auth:** JWT (JSON Web Tokens), Bcrypt.js, Nodemailer (OTP Service)

---

## 🚀 Getting Started

Follow these steps to get a local copy of the project up and running.

### 1. Clone the Repository
```bash
git clone <https://github.com/saumya1016/finance-tracker>
cd <"Finance Tracker">

2. Backend Setup
    1. Navigate to the server folder:
        cd server

    2. Install dependencies:
        npm install

    3. Configuration:
        Locate the .env.txt file in the root of the /server folder.
        Rename it to .env.
        Update the values for MONGO_URI, EMAIL_USER, and EMAIL_PASS (Gmail App Password).

    4. Start the server:
        npm run dev or node server.js

    
3. Frontend Setup
    1. Open a new terminal and navigate to the client folder:
        cd client

    2. Install dependencies:
        npm install

    3. Configuration:
        Locate the .env.txt file in the root of the /client folder.
        Rename it to .env.
        Ensure VITE_API_URL is set to http://localhost:5000/api.

    4. Start the application:
        npm run dev


## 📁 Project Structure

```text
FINANCE TRACKER/
├── client/          # React (Vite) Frontend
│   ├── src/
│   └── .env.txt     # Frontend env template
├── server/          # Node.js/Express Backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── .env.txt     # Backend env template
└── README.md        # Project documentation

   ``` 

  