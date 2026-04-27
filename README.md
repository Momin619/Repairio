# Repairio

**Repairio** is a full-stack MERN application that helps repair shop owners manage repair jobs, track item status, and communicate with customers through automated WhatsApp links.

It also includes an admin system for seller approval and subscription management.

---

## Main Idea

The system has two main user roles:

- **Admin** — approves sellers, manages their subscriptions, and monitors all users.
- **Seller** (repair shop owner) — registers repair items, tracks their progress, and communicates with customers.

Each repair item gets a **unique tracking link** that can be shared with the customer so they can check their repair status themselves — no need to call the shop.

---

## Key Features

1. **Seller Approval System** — Only admin-approved sellers can access the platform
2. **Subscription Management** — Admin controls 30-day seller subscriptions
3. **Live Repair Tracking** — Customers track their repair status via a unique link
4. **WhatsApp Notifications** — Auto-generated message links keep customers updated
5. **Repair Status Pipeline** — Jobs flow through Pending → In-Repair → Completed stages
6. **Revenue Dashboard** — Sellers view monthly earnings from completed repairs

---

## How the Core Logic Works

### 1. Seller Registration & Approval
- A seller signs up on the platform.
- The account is **inactive by default**.
- The admin reviews the signup and **activates the account** by creating a subscription.

### 2. Subscription System
- Subscriptions are **30-day periods**, managed by the admin.
- If a subscription expires, the seller **cannot log in** or perform any actions.
- The admin can **extend** an active subscription or **renew** an expired one.

### 3. Creating a Repair Item
- The seller fills out a form with:
  - Item name and problem description
  - Repair cost
  - Customer name and phone number
  - Optional image upload
- A **unique tracking token** is auto-generated for the item.
- The system creates a **WhatsApp message link** so the seller can notify the customer instantly.

### 4. Repair Status Flow
```
pending → in-repair → completed
```
- **Pending**: Item just registered.
- **In-Repair**: Seller has started working on it.
- **Completed**: Repair is done. A WhatsApp link is generated to notify the customer.

### 5. Customer Tracking
- Every repair item has a unique URL like `/track/<token>`.
- The customer can open this link to see the current status of their item — no login required.

### 6. Revenue Tracking
- The seller can view their **monthly revenue** broken into 30-day rolling cycles.
- Data is calculated from completed repair items and their costs.

---

## Technologies Used

### Backend
| Tool | Purpose |
|---|---|
| Node.js + Express.js | Server and API |
| MongoDB + Mongoose | Database and data modeling |
| JSON Web Tokens (JWT) | Authentication (separate secrets for admin and seller) |
| bcryptjs | Password hashing |
| Cloudinary + Multer | Image upload and storage |
| cookie-parser | Reading auth tokens from cookies |
| dotenv | Managing environment variables |
| cors | Allowing frontend to communicate with backend |

### Frontend
| Tool | Purpose |
|---|---|
| React (Vite) | UI framework |
| Tailwind CSS | Styling |
| shadcn/ui | Pre-built UI components |
| Material UI (MUI) | Data tables |
| React Context API | Global state (auth, theme) |
| React Router | Page navigation and protected routes |

---

## Running the Project Locally

### Prerequisites
- Node.js (v18 or above)
- A MongoDB Atlas account (or local MongoDB)
- A Cloudinary account (for image uploads)

---

### 1. Clone the Repository

```bash
git clone https://github.com/momin619/repairio.git
cd repairio
```

---

### 2. Set Up the Backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend/` folder:

```env
PORT=4500
MONGO_URI=your_mongodb_connection_string
JWT_SECRET_SELLER=your_seller_jwt_secret
JWT_SECRET_ADMIN=your_admin_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

Start the backend server:

```bash
npm run dev
```

The server will run at `http://localhost:4500`.

---

### 3. Set Up the Frontend

```bash
cd ../frontend
npm install
npm run dev
```

The frontend will run at `http://localhost:5173`.

---

### 4. (Optional) Seed Sample Data

To populate the database with sample repair items for testing:

```bash
cd backend
node seed.js
```

> ⚠️ Make sure to update the `MONGO_URI` and `SELLER_ID` values inside `seed.js` before running it.

---

## Example Workflow

Here is a typical flow from start to finish:

1. **Admin signs up** and logs into the admin dashboard.
2. **A repair shop owner (seller) signs up** — they see a "Account not active" message.
3. **Admin approves the seller** by creating a 30-day subscription for them.
4. **Seller logs in** and is redirected to their dashboard.
5. **Seller adds a new repair item** — fills in item details and customer info.
6. **System generates a tracking link** — seller shares it with the customer via WhatsApp.
7. **Seller updates the status** to "in-repair" when work begins.
8. **Seller marks the item as completed** — another WhatsApp message is generated for the customer.
9. **Customer visits the tracking link** anytime to see the current status.
10. **Seller views the Revenue page** to see monthly earnings from completed repairs.

---

## Folder Structure

```
repairio/
├── backend/
│   ├── server.js              # App entry point
│   ├── seed.js                # Sample data seeder
│   ├── controller/            # Business logic
│   │   ├── admin.js
│   │   ├── adminUserManagment.js
│   │   ├── repairItem.js
│   │   ├── subscription.js
│   │   └── user.js
│   ├── middlewares/
│   │   └── auth.js            # JWT auth + role checks
│   ├── model/                 # MongoDB schemas
│   │   ├── admin.js
│   │   ├── repairItem.js
│   │   ├── subscription.js
│   │   └── user.js
│   ├── routes/                # API route definitions
│   └── utils/                 # Helpers (Cloudinary, token, WhatsApp, etc.)
│
└── frontend/
    └── src/
        ├── components/        # Reusable UI components
        │   ├── Auth/          # Login & Signup forms
        │   ├── Dashboard/     # Admin and User dashboards
        │   ├── HomePage/      # Landing page sections
        │   └── ui/            # Navbar, Footer, Tables, etc.
        ├── context/           # AuthContext, ThemeContext
        ├── hooks/             # Custom hooks
        ├── pages/             # Page-level components
        └── styles/            # CSS files
```

---

## 📄 License

This project is licensed under the **ISC License**.

---

> Built with ❤️ for local repair shop owners.
