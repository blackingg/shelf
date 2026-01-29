# **Shelf**

<div align="center">
  <img src="public/logo.svg" alt="Shelf Logo" width="120" height="120" />
  <h1>Shelf – Student Resource Hub</h1>
  <p>
    <strong>Next.js 16 · Tailwind CSS 4 · PWA · Redux Toolkit</strong>
  </p>
  
  ![License](https://img.shields.io/badge/license-MIT-blue.svg)
  ![Next.js](https://img.shields.io/badge/Next.js-16.0-black)
  ![React](https://img.shields.io/badge/React-19-61dafb)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6)
  ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38bdf8)

  <br />

  <p>
    Shelf is a <strong>student-powered digital library<strong/> designed to preserve and share academic resources. 
    From lecture notes and past questions to research papers and novels, Shelf provides a centralized hub for knowledge exchange.
  </p>

[Explore Website](https://www.shelf.ng) ·
[Report Bug](https://github.com/blackingg/shelf/issues) ·
[Request Feature](https://github.com/blackingg/shelf/issues)

</div>

---

## 🚀 **Overview**

Shelf is a modern **Progressive Web Application (PWA)** built for performance
and accessibility. It allows users to upload, organize, and read documents
seamlessly across devices.

### **Core Functionality**

- **Digital Library**: Browse academic and leisure content organized by
  department and category.
- **Smart Reading**: Built-in online reader for PDFs with a focus on user
  experience.
- **Community Driven**: Students actively contribute by uploading and moderating
  content.

---

## � **Tech Stack**

Shelf is built with the latest web technologies to ensure a fast, responsive, and premium user experience.

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **Animations**: [Motion](https://motion.dev/) (formerly Framer Motion)
- **Authentication**: Custom Auth + [Google OAuth](https://react-oauth.vercel.app/)
- **PWA**: Fully installable via `next-pwa`
- **Dark Mode**: Native support via `next-themes`

---

## 🌟 **Key Features**

### **🔐 Authentication & Onboarding**

- Secure Email/Password and Google Login.
- Personalized onboarding flow collecting school, department, and interests.
- Custom profile management with avatars and bio.

### **📚 Document Management**

- **Smart Search**: Find resources by keyword, category, or department.
- **Organization**: Filter by 'School', 'Department', 'Level', and 'Course'.
- **Interactive Reader**: A distraction-free reading environment.

### **📂 Folders & Collaboration**

Create and manage personal or shared collections.

- **Public Folders**: Open to the community.
- **Private Folders**: Personal archives.
- **Collaborative Folders**: Invite 'Editors' or 'Viewers' to manage content together.

### **🛡️ Moderation System**

- Community moderation workflow.
- Trusted users (Moderators) can review, approve, or reject pending uploads.
- Dashboard for tracking upload status and history.

### **📱 Progressive Web App (PWA)**

- Install Shelf on your phone or desktop.
- Native-like experience with offline capabilities (caching).

---

## 📁 **Project Structure**

```bash
app/
├── app/                  # Main Application Routes (Authenticated)
│   ├── auth/             # Login, Register, Forgot Password
│   ├── books/            # Book Details, Reading Interface, Upload
│   ├── folders/          # Folder Management & Editing
│   ├── library/          # Browsing (Dept, Category, Search)
│   ├── onboarding/       # User Setup Flow
│   ├── profile/          # User Profiles
│   └── settings/         # App Settings
├── components/           # Reusable UI Components
│   ├── Form/             # Inputs, Buttons, Selects
│   ├── Layout/           # Sidebar, Navbar, Wrappers
│   └── ...
├── context/              # Global Contexts (Notifications, etc.)
├── store/                # Redux Slices & Services
├── types/                # TypeScript Definitions
├── globals.css           # Global Styles & Tailwind Directives
└── page.tsx              # Landing Page
```

---

## 🧭 **Getting Started**

Follow these steps to set up Shelf locally.

### **Prerequisites**

- **Node.js**: v18 or higher
- **PNPM**: Preferred package manager

### **1. Clone the Repository**

```bash
git clone https://github.com/blackingg/shelf.git
cd shelf
```

### **2. Install Dependencies**

```bash
pnpm install
```

### **3. Environment Variables**

Create a `.env.local` file in the root directory and add the following:

```env
NEXT_PUBLIC_API_URL=https://api.shelf.ng/v1
NEXT_PUBLIC_ENV=development
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
# Add other keys as required
```

### **4. Run Development Server**

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

---

## 🧪 **Available Scripts**

| Script       | Description                                  |
| :----------- | :------------------------------------------- |
| `pnpm dev`   | Starts the development server with TurboPack |
| `pnpm build` | Builds the application for production        |
| `pnpm start` | Runs the built production application        |
| `pnpm lint`  | Runs ESLint to check for code quality issues |

---

## 🤝 **Contributing**

We welcome contributions! Please follow these steps:

1.  **Fork** the repository.
2.  Create a **Feature Branch** (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a **Pull Request**.

---

## 🛡️ **License**

Distributed under the MIT License. See `LICENSE` for more information.
