# 🎶 TuneFlow

TuneFlow is a full-stack music streaming and playlist management web application built with the MERN stack.
It allows users to explore music, create playlists, and enjoy a clean, modern listening experience, while admins can manage songs through a dedicated dashboard.


---

## 🚀 Features

👤 User

User authentication (Login & Signup)

Browse and play songs

Custom music player (play, pause, next, previous, seek)

Create playlists

Add songs to playlists



🔐 Authentication

JWT-based authentication

Forgot password & reset password flow (token-based, dev mode)

Role-based access (User / Admin)


 🛠 Admin

Admin dashboard

Upload songs (title & artist)

Edit song details

Delete songs

Protected admin routes



## 🧰 Tech Stack

Frontend

React (Vite)

React Router

CSS 


Backend

Node.js

Express.js

MongoDB

Mongoose

JWT Authentication





## 📁 Project Structure

TuneFlow
├── client/        # React frontend
├── server/        # Express backend
│   ├── routes
│   ├── controllers
│   ├── models
│   ├── middleware
│   └── uploads    # Ignored in Git (.gitignore)
└── README.md




## 🔒 Roles

User: Can listen to music and manage playlists

Admin: Can upload, edit, and delete songs




## 📌 Notes

Uploaded audio files are ignored in Git using .gitignore

Admin-only routes are protected using middleware

Navbar content changes based on authentication state

Navbar is hidden on authentication pages (login, signup, forgot password)




## 🌱 Future Improvements

Remove songs from playlist

Rename playlists

Song search & filtering

Album artwork upload

Email-based password reset





## ❤️ Built With Passion

This project was built as a learning-focused full-stack application to understand real-world authentication, role-based access, and frontend-backend integration.

