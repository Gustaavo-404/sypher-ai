<div align="center">

<img src="src/assets/images/sypherlogo.png" width="120"/>

# Sypher AI

**Premium web platform for AI-powered text refinement — polish your writing for LinkedIn, Twitter/X, email, and more. Sypher AI is written in TypeScript, React/Vite and Node.js/Express**

![Build Status](https://img.shields.io/badge/build-passing-00C49F)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Status](https://img.shields.io/badge/status-active-success)

</div>

---

![Screenshot 1](docs/screenshots/screenshot-1.png)

---

# ⭕ Overview

Sypher AI is a **premium text refinement platform** designed to help professionals, creators, and teams turn rough drafts into polished, high-impact content.

The platform refines text for multiple contexts, including:

- LinkedIn posts
- Twitter/X posts
- Emails
- General professional writing

All refinements are powered by **Google Gemini**, combined with a custom prompt and data abstraction layer tailored to each content format.

---

# ⭕ Tech Stack

Sypher AI was built using a modern full-stack architecture focused on performance, polish, and a premium user experience.

### Frontend

![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![GSAP](https://img.shields.io/badge/GSAP-88CE02?style=for-the-badge&logo=gsap&logoColor=black)
![Motion](https://img.shields.io/badge/Motion-FF0080?style=for-the-badge)
![Recharts](https://img.shields.io/badge/Recharts-8884D8?style=for-the-badge)
![Three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white)
![Lucide Icons](https://img.shields.io/badge/Lucide_Icons-F56565?style=for-the-badge)

### Backend

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![esbuild](https://img.shields.io/badge/esbuild-FFCF00?style=for-the-badge&logo=esbuild&logoColor=black)

### AI Integration

![Gemini](https://img.shields.io/badge/Google_Gemini-8E75FF?style=for-the-badge&logo=googlegemini&logoColor=white)
![Prompt Layer](https://img.shields.io/badge/Prompt_%2F_Data_Layer-FF6B6B?style=for-the-badge)

### DevOps

![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Env Config](https://img.shields.io/badge/Env_Config-4CAF50?style=for-the-badge)
![Vite Build](https://img.shields.io/badge/Vite_%2B_esbuild_Pipeline-646CFF?style=for-the-badge)

---

## 1️⃣ Refine Your Draft

Paste your raw text and let Sypher AI analyze tone, clarity, and structure.

<img src="docs/screenshots/screenshot-1.png" width="900"/>

> **Start with any draft.**
> Sypher AI reads your content and prepares it for refinement based on the target platform.

---

## 2️⃣ Choose the Format

Select the destination for your content: LinkedIn, Twitter/X, email, or general writing.

> Each format has its own tone, length, and structural rules, applied automatically during refinement.

---

## 3️⃣ AI-Powered Refinement

Sypher AI processes your text through the Gemini-powered prompt layer, refining tone, clarity, and impact.

<img src="docs/screenshots/screenshot-2.png" width="900"/>

The refinement evaluates:

- Tone and voice consistency
- Clarity and readability
- Platform-specific structure
- Overall persuasive impact

---

## 4️⃣ Review & Export

Compare the original draft with the refined version and copy the final result.

> The refined text is ready to publish or send, tailored to the chosen format.

---

# 📦 Installation

Clone the repository:

```
git clone https://github.com/your-username/sypher-ai.git
cd sypher-ai
```

Install dependencies:

```
npm install
```

---

# ⚙️ Environment Variables

Create a `.env` file in the project root:

```
GEMINI_API_KEY=your_api_key_here
```

### 🔑 How to get the API Key

You can obtain your Gemini API key via:

- Google AI Studio: https://aistudio.google.com/

---

# ▶️ Running the Development Server

Start the development server:

```
npm run dev
```

Then open:

```
http://localhost:3000
```

The application will automatically reload when changes are made.

---

# 🐳 Running with Docker

1. Build image

```
docker build -t sypher-ai .
```

2. Run container

```
docker run -d -p 3000:3000 --env-file .env --name sypher-ai sypher-ai
```

3. Access

```
http://localhost:3000
```

---

# 📊 Key Features

- **AI-Powered Text Refinement** – Refine drafts using Google Gemini with a custom prompt/data abstraction layer.

- **Multi-Format Support** – Tailored refinement for LinkedIn posts, Twitter/X posts, emails, and general writing.

- **Before/After Comparison** – Instantly compare the original draft with the refined version.

- **Premium Animated Experience** – Smooth, high-end interactions powered by GSAP, Motion, and Three.js.

- **Data Visualization** – Track and visualize refinement metrics with Recharts.

- **Modern, Responsive Interface** – Built with React 19, Vite, and TailwindCSS for a fast, polished experience.

---

# 🧱 Architecture

Sypher AI follows a modular architecture.

```
Frontend (React + Vite)
│
├── Landing / Docs / About Pages
├── Text Refinement Interface
├── AI Demo Preview
└── Data Visualization Layer (Recharts)

Backend (Node.js + Express)
│
├── API Layer
├── Prompt / Data Abstraction Layer
└── Gemini AI Integration
```

---

# 📁 Project Structure

```
src/
├── assets/
│   └── images/
├── components/
│   ├── LandingPage.tsx
│   ├── DocsPage.tsx
│   ├── AboutPage.tsx
│   ├── AppDemoPreview.tsx
│   └── ...
├── data.ts
├── translations.ts
├── types.ts
└── main.tsx

public/
├── gifs/
├── img/icons/
├── decorative-bar.png

docs/
└── screenshots/
    ├── screenshot-1.png
    └── screenshot-2.png
```

---

# 🎯 Use Cases

Sypher AI is designed for:

- content creators
- marketing professionals
- job seekers refining LinkedIn presence
- founders and freelancers
- anyone writing high-stakes professional text

---

# 📈 Future Roadmap

Planned improvements:

- additional platform formats (Instagram, Medium, etc.)
- tone presets and custom voice profiles
- team/collaborative refinement workflows
- refinement history and analytics dashboard
- browser extension for inline refinement

---

# 📄 License

Sypher AI is licensed under the MIT License.

---

⭕ Sypher AI — From Draft to Excellence.
