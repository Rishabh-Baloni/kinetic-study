# 📚 Kinetic Study – BTech CS Study Session Generator

<p align="center">
  <strong>AI-powered study session generator for BTech Computer Science</strong><br/>
  Generate personalized study sessions with curated tasks, AI quizzes, and smart revision scheduling
</p>

---

## ✨ Features

### 🎯 Personalized Study Sessions
- **8-Question Assessment**: Subject, Topic, Goal, Duration, Knowledge Level, Learning Style, Experience, Preferred Resources
- **AI Task Generation**: Creates 5 diverse tasks (Read, Watch, Practice, Recall, Interview) tailored to your profile
- **Smart Validation**: AI prevents topic-subject mismatches (e.g., "Sorting Algorithms" for DBMS)

### 📊 5 Task Types
- **◣ Read**: Theory, documentation, concept explanations
- **▶ Watch**: Video tutorials from Gate Smashers, Striver, etc.
- **⟨⟩ Practice**: Coding problems, exercises, hands-on tasks
- **◈ Recall**: Memory testing, flashcards, self-assessment
- **◉ Interview**: Explain concepts, Q&A preparation

### 🎓 Post-Session Quiz
- **5 MCQ Questions**: AI-generated based on topic studied
- **Instant Feedback**: Green ✓ for correct, red ✗ with answer shown
- **Score Tracking**: Quiz scores saved with session history

### 📅 Smart Revision System
- **Automatic Scheduling**: Day +2 and Day +7 revisions auto-created
- **Spaced Repetition**: Science-backed intervals for better retention
- **Track Progress**: Mark revisions complete, view upcoming schedule

### 📈 Analytics Dashboard
- **Session Stats**: Total sessions, minutes studied, average confidence
- **Study Streaks**: Track consecutive study days with 🔥
- **History View**: See all past sessions with confidence and quiz scores
- **Confidence Rating**: 5-level rating with gradient bars

## 🛠 Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS 4
- **Backend**: Convex (Real-time database)
- **Authentication**: Clerk
- **AI**: Groq (Llama 3.3 70B Versatile)
- **UI**: Shadcn/ui, Custom animations, Red/Pink gradient theme

## 🎨 Design

- **Color Scheme**: Red (#dc2626) / Pink (#ec4899) cyber aesthetic
- **Typography**: Geist Sans & Geist Mono
- **Effects**: Glassmorphism, scanline animations, gradient borders
- **Responsive**: Mobile-first design

## 🚀 Setup

### Prerequisites
- Node.js 18+ and npm
- Clerk account (for authentication)
- Convex account (for database)
- Groq API key (for AI)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/kinetic-study.git
cd kinetic-study
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create `.env.local` file in the root directory:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key
CLERK_SECRET_KEY=sk_test_your_secret_key
CLERK_ISSUER=https://your-clerk-subdomain.clerk.accounts.dev

# Groq AI API
GROQ_API_KEY=gsk_your_groq_api_key

# Convex Database
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
CONVEX_DEPLOYMENT=dev:your-deployment-name
```

4. **Set up Clerk**
   - Create a Clerk application at [dashboard.clerk.com](https://dashboard.clerk.com/)
   - **IMPORTANT**: Create a JWT template named "convex" with custom claim: `{"aud": "convex"}`
   - Copy your publishable and secret keys

5. **Set up Convex**
   - Create a Convex project at [dashboard.convex.dev](https://dashboard.convex.dev/)
   - Link your project: `npx convex dev`
   - Deploy schema: Files in `convex/` will auto-deploy

6. **Set up Groq**
   - Get API key from [console.groq.com](https://console.groq.com/)

7. **Run development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📦 Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/kinetic-study)

1. Push your code to GitHub
2. Import project to Vercel
3. Add environment variables in Vercel dashboard (same as `.env.local`)
4. Deploy!

**Important**: Make sure to set `CLERK_ISSUER` in production to match your Clerk domain.

### Manual Deployment

```bash
npm run build
npm start
```

## 🏗 Project Structure

```
kinetic-study/
├── convex/              # Convex backend
│   ├── schema.ts        # Database schema
│   ├── study.ts         # Study session functions
│   ├── users.ts         # User management
│   └── auth.config.ts   # Clerk integration
├── src/
│   ├── app/
│   │   ├── page.tsx            # Homepage
│   │   ├── generate-study/     # Session generator
│   │   ├── profile/            # Dashboard
│   │   └── api/
│   │       ├── generate-study/ # AI task generation
│   │       └── generate-quiz/  # AI quiz generation
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── QuizDialog.tsx
│   │   └── TerminalOverlay.tsx
│   └── providers/
│       └── ConvexClerkProvider.tsx
├── public/
│   ├── hero-ai.png
│   └── ai-avatar.png
└── package.json
```

## 📝 Supported Subjects

- **DBMS**: Normalization, Transactions, Indexing, SQL, ACID
- **DSA**: Sorting, Trees, Graphs, Dynamic Programming, Hashing
- **OS**: Process Scheduling, Deadlock, Memory Management, Paging
- **CN**: TCP/IP, Routing, OSI Model, Network Security, HTTP
- **OOP**: Inheritance, Polymorphism, Design Patterns, Encapsulation
- **Math**: Probability, Linear Algebra, Discrete Math, Calculus

## 🔧 Troubleshooting

### "Not authenticated" errors
- Verify Clerk JWT template "convex" exists with `{"aud": "convex"}` claim
- Check `CLERK_ISSUER` matches your Clerk domain (no trailing slash)

### AI task generation fails
- Verify `GROQ_API_KEY` is valid
- Check Groq API quota/limits

### Database errors
- Run `npx convex dev` to sync schema
- Verify `NEXT_PUBLIC_CONVEX_URL` is correct

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Rishabh Baloni**
- GitHub: [@Rishabh-Baloni](https://github.com/Rishabh-Baloni)

---

<p align="center">Made with ❤️ for BTech CS students</p>