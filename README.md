# 🪚 Urban Elements Workshop

**Urban Elements Workshop** is a Nairobi-based interior décor and furniture design platform. The business crafts and delivers premium products made from **steel, wood, mirrors, and glass**, with a focus on bespoke customizations and elegant finishes.

This full-stack project is a **portfolio-grade e-commerce-like platform** with both a backend API and a future frontend interface to showcase and manage product offerings.

---

## 🔧 Project Stack

| Layer      | Tech Stack                                     |
|------------|------------------------------------------------|
| Backend    | Node.js, Express.js, MongoDB, Mongoose         |
| Frontend   | (To be added) React.js + Tailwind CSS (planned)|
| Auth       | JWT-based login & role protection              |
| Image Upload | Multer (local) / Cloudinary (optional)      |
| Job Queue  | Bull / Kue for background jobs (optional)      |
| Dev Tools  | Postman, Nodemon, dotenv, Git                  |

---

## 🗂️ Folder Structure

```

urban-elements-workshop/
├── backend/
│   ├── config/                # DB config
│   ├── controllers/           # Route logic
│   ├── middleware/            # Auth & role protection
│   ├── models/                # Mongoose schemas
│   ├── routes/                # Express routes
│   ├── services/              # File/image logic
│   ├── uploads/               # Uploaded images
│   ├── utils/                 # Helpers
│   ├── seeds/                 # DB seeding scripts
│   ├── server.js              # Entry point
│   ├── .env                   # Environment variables
│   └── .gitignore             # Git exclusions
│
├── frontend/                  # (Planned: React app)
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── App.jsx
│       └── index.jsx
│
└── README.md                  # You are here

````

---

## 🌟 Core Features

- 🔐 **User Authentication**
  - Register/Login
  - Admin role protection
- 🛒 **Product Management**
  - View, add, update, delete (admin-only)
- ✨ **Custom Requests**
  - Let users submit custom furniture or decor requests with optional reference images
- 📦 **Order Placement**
  - Users can submit simple product orders (optional cart planned)
- 🖼️ **Image Upload**
  - Using Multer (local storage) for product images and custom request references
- 📬 **Email/Queue System** (planned)
  - Welcome emails and request confirmations

---

## 🧪 Backend Setup (API)

### 📦 Install dependencies

```bash
cd backend
npm install
````

### ⚙️ Create `.env` file

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/urban-elements
JWT_SECRET=your_jwt_secret_key
```

### 🚀 Run the server

```bash
sudo systemctl start mongod  # Start MongoDB
npm start
```

---

## 🌱 Seeding Data

```bash
node seeds/seedProducts.js
```

---

## 🔮 Frontend Plans (coming soon)

* Product listing page
* Product detail page with “Request Custom” or “Order” buttons
* Admin dashboard for managing products and requests
* Responsive design with Tailwind CSS
* Video/product gallery support

---

## 📬 API Endpoints (v1 Preview)

| Method | Endpoint            | Description           | Access |
| ------ | ------------------- | --------------------- | ------ |
| POST   | /api/auth/register  | Register new user     | Public |
| POST   | /api/auth/login     | Login + JWT           | Public |
| GET    | /api/products       | List all products     | Public |
| POST   | /api/products       | Create product        | Admin  |
| PUT    | /api/products/\:id  | Update product        | Admin  |
| DELETE | /api/products/\:id  | Delete product        | Admin  |
| POST   | /api/custom-request | Submit custom request | Public |

---

## ✍️ Author

**Tom Morara**
Backend Developer | ALX SWE Program
📍 Nairobi, Kenya
[GitHub](https://github.com/tommorara) • [LinkedIn](https://linkedin.com/in/tom-nyabuto)
**Keving Mabonga**
Backend Developer | ALX SWE Program

---
