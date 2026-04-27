# **Shelf**

<div align="center">
  <img src="public/logo.png" alt="Shelf Logo" width="120" height="120" />
  <h1>Shelf – Student Resource Hub</h1>
  <p>
    <strong>The Future of Digital Libraries</strong>
  </p>
  
  ![License](https://img.shields.io/badge/license-MIT-blue.svg)
  ![Next.js](https://img.shields.io/badge/Next.js-16.0-black)
  ![React](https://img.shields.io/badge/React-19-61dafb)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6)
  ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38bdf8)
  ![PWA](https://img.shields.io/badge/PWA-Ready-059669)

  <br />

  <p>
    Shelf is a <strong>student-powered digital library</strong> designed to preserve and share academic resources. 
    From lecture notes and past questions to research papers and novels, Shelf provides a centralized hub for knowledge exchange.
  </p>

[Explore Website](https://www.shelf.ng) ·
[Report Bug](https://github.com/blackingg/shelf/issues) ·
[Request Feature](https://github.com/blackingg/shelf/issues)

</div>

---

> [!IMPORTANT] **Active Development**: The latest features and codebase are
> currently on the [`dev`](https://github.com/blackingg/shelf/tree/dev) branch.
> The `main` branch is temporarily serving as a waitlist/landing page.

## 🚀 **Overview**

Shelf is a modern **Progressive Web Application (PWA)** built for performance
and accessibility. It allows users to upload, organize, and read documents
seamlessly across devices. 

Designed with a **Mobile-First** approach, Shelf provides a premium reading experience whether you are on a smartphone, tablet, or desktop.

---

## 🌟 **Key Features**

### **🔐 Authentication & Onboarding**
- **Zero-Friction Login**: Secure Email/Password and Google OAuth integration.
- **Personalized Setup**: Tailored onboarding flow collecting university, department, and academic interests.
- **Rich Profiles**: Track your contributions, bookmarks, and reading stats.

### **📚 Digital Library & Discovery**
- **Smart Search**: Find resources instantly by keyword, category, department, or level.
- **Departmental Logic**: Content organized by University structure for easy navigation.
- **Smart Recommendations**: UI-driven suggestions based on your profile and interests.

### **📂 Advanced Collection Management**
- **Public & Private Folders**: Secure your personal notes or share them with the community.
- **Collaboration**: Invite editors or viewers to manage shared academic resources.
- **Personal Bookmarks**: Save books, folders, or pages for quick access later.

### **📖 Premium Reading Experience**
- **Native-Like Reader**: Distraction-free, high-performance document viewer.
- **Offline Mode**: Access your cached library even when the internet is down.
- **PWA Excellence**: Install Shelf on any device for a full-screen, native experience.

### **🛡️ Community Moderation**
- **Trust System**: Dedicated moderator workflow for reviewing and approving contributions.
- **Feedback Loop**: Transparency in the upload process with real-time status updates.

---

## 🛠️ **Tech Stack**

Shelf leverages the latest web technologies to deliver a fast, responsive, and maintainable application.

- **Framework**: [Next.js 16.0](https://nextjs.org/) (App Router & Server Actions)
- **Styling**: [Tailwind CSS v4.0](https://tailwindcss.com/) (Modern CSS features)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/) + [RTK Query](https://redux-toolkit.js.org/rtk-query/overview)
- **Animations**: [Motion](https://motion.dev/) (High-performance micro-interactions)
- **Persistence**: [MongoDB](https://www.mongodb.com/) (via scalable API layer)
- **PWA**: Fully installable via `next-pwa` with custom service workers
- **Type Safety**: 100% [TypeScript](https://www.typescriptlang.org/) for robust development

---

## 📁 **Project Structure**

```bash
app/
├── app/                  # Main Application Routes
│   ├── auth/             # Login, Register, & Recovery
│   ├── bookmarks/        # Saved items & Collections
│   ├── books/            # Reading interface & Book details
│   ├── folders/          # Folder management & CRUD
│   ├── library/          # Discovery (Dept, Category, Search)
│   ├── moderator/        # Content review dashboard
│   ├── onboarding/       # User personalization flow
│   ├── profile/          # User profiles & Stats
│   ├── search/           # Global search results
│   └── settings/         # Account & App preferences
├── components/           # Reusable UI Architecture
│   ├── Auth/             # Login & Registration components
│   ├── Form/             # Generic Inputs, Buttons, & Selects
│   ├── Layout/           # Sidebar, Navbar, & Page wrappers
│   ├── Skeletons/        # loading states
│   └── ...
├── context/              # Global React Contexts
├── store/                # Redux State & RTK Query
│   ├── api/              # Decentralized API services
│   └── authSlice.ts      # Authentication & User state
├── types/                # Centralized TS Interfaces
└── globals.css           # Global Styles & Tailwind v4
```

---

## 🧭 **Getting Started**

### **Prerequisites**
- **Node.js**: v18.0.0 or higher
- **NPM**: Recommended package manager

### **1. Clone the Repository**
```bash
git clone https://github.com/blackingg/shelf.git
cd shelf
git checkout dev # Switch to the active development branch
```

### **2. Install Dependencies**
```bash
npm install
```

### **3. Environment Config**
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_API_URL=https://api.shelf.ng/v1
NEXT_PUBLIC_ENV=development
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
```

### **4. Run Locally**
```bash
npm run dev
```
Explore the app at [http://localhost:3000](http://localhost:3000).

---

## � **Contributing**

We believe in the power of community. To contribute:
1.  **Fork** the repository.
2.  **Checkout `dev`** (`git checkout dev`).
3.  Create a **Feature Branch** (`git checkout -b feature/AmazingFeature`).
4.  Commit your changes (`git commit -m 'Add: AmazingFeature'`).
5.  Push & Open a **Pull Request**.

---

## 🛡️ **License**

Distributed under the MIT License.
