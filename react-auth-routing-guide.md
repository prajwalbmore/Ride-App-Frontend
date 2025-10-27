
# 📘 React + Vite + TailwindCSS Project Setup with Multi-language and Protected Routes

This document explains step-by-step how to build a full React + Vite project with:
- TailwindCSS
- Multi-language support (i18n)
- Cookie-based authentication
- Protected routes

---

## ✅ Step 1: Create Project

```bash
npm create vite@latest my-react-tailwind-app -- --template react
cd my-react-tailwind-app
npm install
```

## ✅ Step 2: Install TailwindCSS

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Configure `tailwind.config.js`
```js
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#007bff'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif']
      }
    },
  },
  plugins: [],
}
```

### In `src/index.css`
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

## ✅ Step 3: Set Up i18n (Multi-Language)

```bash
npm install i18next react-i18next i18next-browser-languagedetector
```

### Create Folder: `src/i18n/`

#### `en.json`
```json
{
  "home": "Home",
  "about": "About",
  "services": "Services",
  "contact": "Contact",
  "getStarted": "Get Started",
  "title": "React + Vite + TailwindCSS"
}
```

#### `hi.json`
```json
{
  "home": "होम",
  "about": "हमारे बारे में",
  "services": "सेवाएं",
  "contact": "संपर्क करें",
  "getStarted": "शुरू करें",
  "title": "रिएक्ट + वाइट + टेलविंडCSS"
}
```

#### `index.js`
```js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./en.json";
import hi from "./hi.json";

i18n.use(LanguageDetector).use(initReactI18next).init({
  resources: {
    en: { translation: en },
    hi: { translation: hi }
  },
  fallbackLng: "en",
  interpolation: { escapeValue: false }
});

export default i18n;
```

### Update `main.jsx`
```js
import './i18n';
```

---

## ✅ Step 4: Setup Routes with `react-router-dom`

```bash
npm install react-router-dom
```

### Folder Structure
```
src/
├── pages/
│   ├── Home.jsx
│   ├── Login.jsx
│   └── Dashboard.jsx
├── routes/
│   └── ProtectedRoute.jsx
```

---

## ✅ Step 5: Setup Cookie-based Authentication

```bash
npm install js-cookie
```

### `ProtectedRoute.jsx`
```js
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

export default function ProtectedRoute({ children }) {
  const token = Cookies.get("auth_token");
  return token ? children : <Navigate to="/login" replace />;
}
```

### `Login.jsx`
```js
import Cookies from "js-cookie";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("auth_token");
    if (token) navigate("/dashboard");
  }, []);

  const handleLogin = () => {
    Cookies.set("auth_token", "token123", { expires: 1 });
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <button onClick={handleLogin} className="bg-primary text-white px-6 py-2 rounded">
        Login
      </button>
    </div>
  );
}
```

### `Dashboard.jsx`
```js
export default function Dashboard() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-3xl font-bold text-blue-600">
        Dashboard <span className="text-sm bg-green-100 px-2 ml-2 rounded">Protected</span>
      </h1>
    </div>
  );
}
```

### `Home.jsx`
```js
export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-3xl font-bold text-green-600">Public Home Page</h1>
    </div>
  );
}
```

---

## ✅ Step 6: Set Up App Routes (`App.jsx`)

```js
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import ProtectedRoute from "./routes/ProtectedRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
```

---

## ✅ Done!

Now your site has:
- TailwindCSS styling
- Language switcher (`EN` / `HI`)
- Protected Routes with cookie auth
- Clean folder structure

Bolo bhai — agar `logout`, role-based routes, ya backend token verify bhi chahiye toh next step chalu karun? 🔐🚀
