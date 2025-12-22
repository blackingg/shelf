# **Shelf – Frontend (Next.js + Tailwind CSS)**

Shelf is a student-powered digital library for preserving and sharing academic
notes, past questions, research papers, magazines, novels, comics, and more.
This repository contains the **Next.js + Tailwind CSS frontend**, responsible
for user onboarding, document browsing, folder management, uploading, moderation
UI, and the online reading experience.

---

## 🚀 **Tech Stack**

- **Next.js 16 (App Router)**
- **React 19 + TypeScript**
- **Tailwind CSS**
- **Redux Toolkit** (State Management)
- **PNPM** (preferred package manager)
- **REST API integration**
- Reusable component architecture

---

## 📁 **Project Structure**

```
app/
  app/
    auth/
      login/
      register/
      forgot-password/
    books/
      upload/
      [id]/
        read/
    folders/
      [id]/
        edit/
      edit/
    library/
      categories/
        [category]/
      departments/
        [department]/
      search/
    onboarding/
    profile/
      [username]/
      edit/
    settings/
    search/
  components/
    Department/
    Folders/
    Form/
    Layout/
    Library/
    Notification/
    Onboarding/
    Settings/
    profile/
    PageHeader.tsx
    SearchBar.tsx
    Sidebar.tsx
    UserProfileDropdown.tsx
  context/
    NotificationContext.tsx
  docs/
    privacy/
    terms/
  types/
    book.ts
    categories.ts
    folder.ts
    notification.ts
    schools.ts
    user.ts

public/
  banner.jpg
  logo.svg

globals.css
layout.tsx
page.tsx
```

---

## 🌟 **Key Features**

### **Authentication & Onboarding**

- Email + password auth
- Collects school, department, hobbies
- Drives personalized recommendations

### **Document Management**

- View documents by:
  - Category
  - Department
  - Search
- Document details with preview panel
- Online reader for PDFs

### **Uploading**

- Users can upload/donate documents
- Backend will run SHA-256 hashing to detect duplicates
- Users see their upload status (pending/approved/rejected)

### **Folders & Collaboration**

- **Visibility Options**:
  - **Public**: Visible to everyone.
  - **Private**: Visible only to owner and added collaborators.
  - **Unlisted**: Accessible via link only (optional).

- **Collaboration Roles**:
  - **Owner**: Full control, can delete folder.
  - **Editor**: Can add/remove books and invite viewers.
  - **Viewer**: Read-only access.

### **Moderation**

- Moderators see pending uploads
- Approve or reject documents
- Mods must be recommended by another mod or added by admin

### **Notifications**

- Global notification system for success, error, and info alerts.

---

## 🧭 **Getting Started**

### **1. Clone repo**

```bash
git clone https://github.com/blackingg/shelf.git
cd shelf
pnpm install
```

### **2. Environment Variables**

Create **.env.local**:

```
NEXT_PUBLIC_API_URL=https://your-backend-domain/api
NEXT_PUBLIC_ENV=development
```

### **3. Run dev server**

```bash
pnpm dev
```

---

## 🧪 **Scripts**

```bash
pnpm dev       # Run development server
pnpm build     # Production build
pnpm start     # Start production server
pnpm lint      # Lint
```

---

## 🗂️ **Folder Breakdown**

### **app/**

Main application routes using the Next.js App Router (v16).

### **components/**

Reusable UI building blocks: forms, headers, folder cards, library grids,
onboarding UI, etc.

### **context/**

Global context providers (e.g., NotificationContext).

### **types/**

TypeScript interfaces: folders, books, users, categories, notifications.

### **docs/**

Static pages like privacy policy and terms.

### **public/**

Static assets (logo, banners).

---

## 🤝 **Contributing**

Shelf uses a simple workflow:

1. Checkout the `dev` branch
2. Create a feature branch
3. Follow existing file structure & coding style
4. Test your changes
5. Submit a PR and tag a maintainer

---

## 🛡️ **License**

MIT License

---

## 📞 Contact

**Website:** [https://www.shelf.ng](https://www.shelf.ng)
