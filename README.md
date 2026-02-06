# RestorApp - Enterprise Restaurant Management System

![Angular](https://img.shields.io/badge/Angular-17-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![SCSS](https://img.shields.io/badge/Sass-CC6699?style=for-the-badge&logo=sass&logoColor=white)
![Status](https://img.shields.io/badge/Status-In%20Development-yellow?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**RestorApp** is a scalable, dual-interface Single Page Application (SPA) designed to streamline the interaction between restaurant customers and administrative staff. It solves the complexity of managing digital orders by offering disjointed yet synchronized environments for distinct user roles.

---

## 📑 Table of Contents

1.  [Project Overview](#project-overview)
2.  [Key Features](#key-features)
3.  [Visual Demonstration](#visual-demonstration)
4.  [Technology Stack](#technology-stack)
5.  [Installation & Setup](#installation--setup)
6.  [Usage & Demo](#usage--demo)
7.  [Project Structure](#project-structure)
8.  [Roadmap](#roadmap)
9.  [Contributing](#contributing)
10. [License](#license)
11. [Contact](#contact)

---

## 🚀 Project Overview

RestorApp bridges the gap between customer convenience and operational efficiency. Ideally suited for fast-casual restaurants, it enables:
-   **Customers** to browse menus, filter by category, manage a shopping cart, and track order status in real-time.
-   **Administrators** to derive insights from a KPI dashboard, manage incoming orders, and update statuses (Preparing, Delivered, etc.).

---

## ✨ Key Features

*   **Role-Based Access Control (RBAC)**: Secure isolation between User and Admin environments.
*   **Multi-Session Architecture**: Support for simultaneous User and Admin sessions via `sessionStorage` isolation.
*   **Reactive State Management**: Utilizes Angular Signals for high-performance UI updates.
*   **Live Order Tracking**: Visual status indicators (Pending, Preparing, Delivered).
*   **Responsive Design**: Optimized for Desktop, Tablet, and Mobile viewports.

---

## 📸 Visual Demonstration

### User Interface (Menu & Cart)
The customer interface focuses on visual appeal and ease of adding items to the cart.

![Menu Screenshot](uploaded_media_1770412700364.png)
*(Replace with actual screenshot path)*

---

## 🛠 Technology Stack

**Core Framework**
*   [Angular 17](https://angular.io) (Standalone Components)
*   [TypeScript 5.4](https://www.typescriptlang.org/)
*   [RxJS](https://rxjs.dev/)

**Styling & UI**
*   SCSS (Sass)
*   CSS Variables (Theming)
*   Modern Flexbox & Grid Layouts

**Authentication & Security**
*   JWT (JSON Web Tokens)
*   `jwt-decode`
*   Route Guards & Interceptors

---

## ⚙️ Installation & Setup

Follow these steps to set up the project locally.

### Prerequisites
*   **Node.js**: v18.13.0 or higher
*   **npm**: v8.0.0 or higher
*   **Angular CLI**: v17.0.0 or higher

### Steps

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/your-username/restor-app.git
    cd Frontend-Angular
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Environment Configuration**
    No `.env` file is required for the mock version. The application defaults to using verified mock services for demonstration.

---

## 🎮 Usage & Demo

### Development Server
Run the following command to start the dev server:

```bash
ng serve
```
Navigate to `http://localhost:4200/`.

### Demo Credentials
To explore the full functionality, use the following pre-configured accounts:

| Role | Email | Password |
| :--- | :--- | :--- |
| **USER** | `user@demo.com` | `123456` |
| **ADMIN** | `admin@demo.com` | `123456` |

---

## 📂 Project Structure

```bash
src/
├── app/
│   ├── auth/         # Login & Register components
│   ├── core/         # Singleton services, guards, models
│   ├── admin/        # Dashboard, Product Management
│   ├── user/         # Menu, My Orders, Profile
│   └── shared/       # Reusable components (Navbar, Cards)
├── assets/           # Images and static files
└── styles.scss       # Global variables and mixins
```

---

## 🗺 Roadmap

*   [x] **Phase 1**: Core Architecture & Authentication
*   [x] **Phase 2**: User Menu & Cart Logic
*   [x] **Phase 3**: Admin Dashboard & Order Management
*   [ ] **Phase 4**: Real Backend Integration (API Connection)
*   [ ] **Phase 5**: Payment Gateway Integration (Stripe/PayPal)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1.  Fork the project.
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

---

## 📝 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

## 📧 Contact

**Jerónimo Restrepo** - [Email](mailto:jerorpo@gmail.com)

Project Link: [https://github.com/jrestepo18/frontend-angular](https://github.com/jrestepo18/frontend-angular)
