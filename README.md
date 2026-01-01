<h1 align="center">📚 Kinetic Study - Your AI Study Partner 🤖</h1>

<p align="center">
  An AI-powered study application that generates personalized study sessions, tasks, and quizzes based on your BTech CS subjects, goals, and learning preferences.
</p>

## Highlights:

- 🚀 Tech stack: Next.js 15, React 19, TypeScript, Tailwind CSS 4 & Shadcn UI
- 📝 8-Step Personalization Form
- 🧠 LLM Integration (Groq AI - Llama 3.3 70B)
- 📖 5 Task Types (Read, Watch, Practice, Recall, Interview)
- 🎯 AI-Generated Quizzes (5 MCQs with instant feedback)
- ✅ Task Completion Tracker
- 🔥 Study Streak Counter
- 📊 Confidence Rating System
- 📅 Smart Revision Scheduling (Day +2, Day +7)
- 🔒 Authentication & Authorization (Clerk)
- 💾 Real-time Database (Convex)
- 🎨 Modern Red/Pink Gradient Theme

## Features

- **8-Step Questionnaire**: Answer questions about Subject, Topic, Goal, Duration, Knowledge Level, Learning Style, Experience, and Resources
- **AI Task Generation**: Custom tasks (Read, Watch, Practice, Recall, Interview) tailored to your profile and learning preferences
- **Topic Validation**: AI prevents subject-topic mismatches (e.g., "Sorting Algorithms" for DBMS)
- **Post-Session Quiz**: 5 AI-generated MCQs with instant feedback (✓/✗) and score tracking
- **Confidence Rating**: Rate your understanding with 5-level gradient bars
- **Smart Revisions**: Automatic scheduling using spaced repetition (Day +2, Day +7)
- **Study Streaks**: Track consecutive study days with 🔥 to stay motivated
- **Progress Analytics**: View session stats, study minutes, average confidence, and quiz scores
- **User Authentication**: Secure sign-in with GitHub, Google, or email/password
- **Responsive Design**: Beautiful red/pink gradient UI with glassmorphism effects

## Supported Subjects

- **DBMS**: Normalization, Transactions, Indexing, SQL, ACID
- **DSA**: Sorting, Trees, Graphs, Dynamic Programming, Hashing
- **OS**: Process Scheduling, Deadlock, Memory Management, Paging
- **CN**: TCP/IP, Routing, OSI Model, Network Security, HTTP
- **OOP**: Inheritance, Polymorphism, Design Patterns, Encapsulation
- **Math**: Probability, Linear Algebra, Discrete Math, Calculus

## Setup .env file

```js
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_ISSUER=

# Groq AI (Free tier with 30 req/min)
GROQ_API_KEY=

# Convex Database
CONVEX_DEPLOYMENT=
NEXT_PUBLIC_CONVEX_URL=
```

## Getting Started

1. Clone the repository

```shell
git clone https://github.com/Rishabh-Baloni/kinetic-study.git
cd kinetic-study
```

2. Install dependencies:

```shell
npm install
```

3. Set up your environment variables as shown above

4. **Important**: Create Clerk JWT template named "convex" with custom claim: `{"aud": "convex"}`

5. Run the development server:

```shell
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment

This application can be easily deployed to Vercel:

```shell
npm run build
npm run start
```

Or connect your GitHub repository to Vercel for automatic deployments.

**Live Demo**: [https://kinetic-study.vercel.app](https://kinetic-study.vercel.app)

## Technologies Used

- **Next.js 15**: React framework with App Router and Server Components
- **React 19**: Latest React features and optimizations
- **TypeScript 5**: Type-safe development
- **Tailwind CSS 4 & Shadcn UI**: Modern styling and reusable UI components
- **Clerk**: Authentication and user management
- **Groq AI**: Fast LLM inference with Llama 3.3 70B model
- **Convex**: Real-time serverless database with live queries

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [Groq Documentation](https://groq.com/docs)
- [Convex Documentation](https://docs.convex.dev)
- [Tailwind CSS](https://tailwindcss.com/docs)

## Author

Built by [Rishabh Baloni](https://portfolio-three-azure-83.vercel.app/)

## License

This project is licensed under the MIT License.