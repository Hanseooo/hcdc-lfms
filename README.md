# Lost and Found Management System

A web-based **Lost and Found Management System** that allows users to post **lost** or **found** items, interact with potential matches, and receive notifications when someone claims an item or reports finding it. An **admin dashboard** is used to manage, review, and moderate reports.

---

## 📌 Overview

This is built as an **Academic Project** (school purposes). This system centralizes lost and found reporting within an organization or community. It streamlines item recovery by allowing users to:

- Report lost items
- Report found items
- Claim items that match their lost reports
- Receive notifications for claims or updates
- Manage their profile and preferences

Admins oversee the platform to ensure reports are valid and properly handled.

---

## ✨ Features

### User Features
- User authentication (login & registration)
- Create **Lost Item** and **Found Item** reports
- Upload item photos
- View and manage own reports
- Receive notifications for:
  - Item claims
  - Status updates (resolution logs and activity logs)
- Comment on reports
- Edit profile information
- Change password
- UI preferences (Light / Dark / System)

### Admin Features
- Review submitted reports
- Approve, reject, or resolve reports
- Moderate platform content
- Manage report statuses
- assign other users to the admin role

---

## 🧭 User Flow

1. **User Authentication**
   - User logs in or registers

2. **Dashboard**
   - Access navigation (Home, Explore, Admin for admins)
   - View recent activity

3. **Create Report**
   - Choose **Lost** or **Found**
   - Fill in item details (name, category, description, location, date, photo)
   - Submit report

4. **Explore**
   - Browse existing reports
   - View report details
   - Claim matching items

5. **Notifications**
   - User is notified when:
     - Someone claims their item
     - An admin updates report status

6. **Admin Review**
   - Admin validates and manages reports

---

## 🛠 Tech Stack

### Frontend
- **React**
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui**
- **Lucide Icons**

### Backend
- **Django**
- **PostgreSQL**
- **Django REST Framework**

### Media & Storage
- **Cloudinary** (image uploads)

---

## 🎨 UI & Design Principles

- Clean, modern, and responsive layout
- Neutral base colors with an accent theme
- Glassmorphism for dark mode
- Accessible and mobile-friendly
- Component-driven design using shadcn/ui


