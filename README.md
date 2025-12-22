# SynergyHub 🚀

> **Ai-Powered Team Formation & Project Collaboration Platform**

SynergyHub connects skills developers, designers, and innovators with the perfect projects. Our intelligent platform uses AI matching to assemble high-performing teams for hackathons, startups, and social impact initiatives.

## ✨ Key Features

- **🧠 smart AI Matching**: automatic algorithm that connects users with projects based on skills, availability, and experience level.
- **🎨 Modern Aesthetic**: exquisite "Deep Space" dark theme with neon violet accents, glassmorphism effects, and fluid animations.
- **👥 Collaborative Workspaces**: Dedicated spaces for teams to manage tasks, chat, and share resources.
- **👤 Advanced Profiles**:
    - **Customizable**: upload profile photos, add social links (GitHub, LinkedIn, Portfolio).
    - **Skill Verification**: Badges and expert/learner modes.
- **🛡 Secure Authentication**: built with **NextAuth.js** supporting Google & Credentials login.
- **📱 Fully Responsive**: Optimized for all devices with a mobile-first approach.

## 🛠 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [Shadcn UI](https://ui.shadcn.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) + [Mongoose](https://mongoosejs.com/)
- **Auth**: [NextAuth.js](https://next-auth.js.org/)
- **State**: React Context + Hooks
- **Icons**: [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

- Node.js 18+
- MongoDB Database (Local or Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/synergyhub.git
   cd synergyhub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Environment Variables**
   Create a `.env.local` file in the root directory and add the following:
   ```env
   # Database
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/synergyhub

   # Authentication
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_super_secret_key_here

   # OAuth (Optional - for Google Login)
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open the app**
   Visit [http://localhost:3000](http://localhost:3000) to see the application in action.

## 📂 Project Structure

```bash
src/
├── app/                  # App Router pages & API routes
│   ├── (app)/            # Authenticated app routes (dashboard, projects)
│   ├── (auth)/           # Authentication routes (login, register)
│   ├── api/              # Backend API endpoints
│   └── layout.tsx        # Root layout
├── components/           # Reusable UI components
├── lib/                  # Utilities, types, and data mocks
├── models/               # MongoDB Schemas (Mongoose)
└── hooks/                # Custom React hooks
```

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

Built with ❤️ by the SynergyHub Team.
