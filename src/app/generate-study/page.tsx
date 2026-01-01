"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";

const GenerateStudyPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    subject: "",
    topic: "",
    goal: "",
    duration: "",
    level: "",
    learningStyle: "",
    experience: "",
    preferredResource: "",
  });

  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const createStudySession = useMutation(api.study.createStudySession);
  const syncUser = useMutation(api.users.syncUser);

  // Redirect if not signed in
  if (isLoaded && !isSignedIn) {
    router.push("/");
    return null;
  }

  const getTopicExamples = (subject: string) => {
    const examples: Record<string, string> = {
      DBMS: "e.g., Normalization, Transactions, Indexing, SQL Queries, ACID Properties",
      OS: "e.g., Process Scheduling, Deadlock, Memory Management, File Systems, Synchronization",
      CN: "e.g., TCP/IP, Routing Algorithms, OSI Model, Network Security, HTTP/HTTPS",
      DSA: "e.g., Sorting Algorithms, Binary Trees, Dynamic Programming, Graphs, Linked Lists",
      OOP: "e.g., Inheritance, Polymorphism, Encapsulation, Design Patterns, Abstraction",
      Math: "e.g., Probability, Linear Algebra, Discrete Math, Calculus, Graph Theory",
    };
    return examples[subject] || "Enter your topic";
  };

  const questions = [
    {
      question: "Which subject are you studying?",
      placeholder: "Select a subject",
      field: "subject" as keyof typeof formData,
      type: "select",
      options: ["DBMS", "OS", "CN", "DSA", "OOP", "Math"],
    },
    {
      question: "What topic do you want to focus on?",
      placeholder: "e.g., Normalization, Transactions, Indexing...",
      field: "topic" as keyof typeof formData,
      type: "text",
      helper: getTopicExamples(formData.subject),
    },
    {
      question: "What is your goal?",
      placeholder: "Select your goal",
      field: "goal" as keyof typeof formData,
      type: "select",
      options: ["Exam", "Placement", "Both"],
    },
    {
      question: "How much time do you have?",
      placeholder: "Select duration",
      field: "duration" as keyof typeof formData,
      type: "select",
      options: ["60", "90", "120"],
    },
    {
      question: "What is your current knowledge level?",
      placeholder: "Select your level",
      field: "level" as keyof typeof formData,
      type: "select",
      options: ["Beginner", "Intermediate", "Advanced"],
    },
    {
      question: "What's your preferred learning style?",
      placeholder: "Select learning style",
      field: "learningStyle" as keyof typeof formData,
      type: "select",
      options: ["Visual (Videos)", "Reading (Articles)", "Practice (Coding)", "Mixed"],
    },
    {
      question: "Have you studied this topic before?",
      placeholder: "Select experience",
      field: "experience" as keyof typeof formData,
      type: "select",
      options: ["First Time", "Revision", "Deep Dive"],
    },
    {
      question: "Preferred resource platform?",
      placeholder: "Select resource",
      field: "preferredResource" as keyof typeof formData,
      type: "select",
      options: ["Gate Smashers", "Striver", "GeeksforGeeks", "W3Schools", "Official Docs", "No Preference"],
    },
  ];

  const handleInputChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      [questions[currentStep].field]: value,
    }));
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      alert("Please log in first");
      return;
    }

    setIsGenerating(true);
    try {
      // Sync user to Convex first
      await syncUser({
        name: user.fullName || user.firstName || "Student",
        email: user.primaryEmailAddress?.emailAddress || "",
        clerkId: user.id,
        image: user.imageUrl,
      });

      // Call AI API to generate tasks
      const response = await fetch("/api/generate-study", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: formData.subject,
          topic: formData.topic,
          goal: formData.goal,
          duration: formData.duration,
          level: formData.level,
          learningStyle: formData.learningStyle,
          experience: formData.experience,
          preferredResource: formData.preferredResource,
        }),
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { message: "Failed to generate tasks. Please try again." };
        }
        console.error("API Error:", errorData);
        alert(errorData.message || "Failed to generate tasks. Please try again.");
        setIsGenerating(false);
        return;
      }

      const data = await response.json();
      console.log("API Response:", data);

      // Check for errors
      if (data.error || !data.tasks) {
        const errorMsg = data.message || "Failed to generate tasks. Please check if your topic matches the selected subject.";
        alert(errorMsg);
        setIsGenerating(false);
        return;
      }

      // Create session in Convex with authenticated user
      await createStudySession({
        subject: formData.subject,
        topic: formData.topic,
        goal: formData.goal,
        totalDuration: parseInt(formData.duration),
        tasks: data.tasks,
      });

      router.push("/profile");
    } catch (error) {
      console.error("Error generating study session:", error);
      alert("Failed to generate study session. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const currentQuestion = questions[currentStep];
  const isLastStep = currentStep === questions.length - 1;
  const currentValue = formData[currentQuestion.field];

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Grid Background */}
      <div className="fixed inset-0 z-0 opacity-20">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `linear-gradient(rgba(147, 51, 234, 0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(147, 51, 234, 0.1) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-600 to-pink-600 transition-all duration-300"
                style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
              />
            </div>
            <p className="text-sm text-zinc-400 mt-2 text-center">
              Step {currentStep + 1} of {questions.length}
            </p>
          </div>

          {/* Question Card */}
          {!isGenerating ? (
            <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur-sm p-8">
              {/* AI Avatar */}
              <div className="flex items-center gap-4 mb-6">
                <div className="relative size-16 group">
                  <div className="absolute inset-0 bg-primary opacity-10 rounded-full blur-lg animate-pulse group-hover:opacity-20 transition-opacity" />
                  <div className="relative w-full h-full rounded-full bg-card flex items-center justify-center border-2 border-border group-hover:border-primary/50 transition-colors overflow-hidden">
                    <img
                      src="/ai-avatar.png"
                      alt="AI Study Assistant"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div>
                  <h2 className="text-lg font-bold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">Kinetic Study</h2>
                  <p className="text-sm text-muted-foreground">BTech CS Study Coach</p>
                </div>
              </div>

              <h3 className="text-2xl font-bold mb-6 text-white">{currentQuestion.question}</h3>

            {currentQuestion.type === "select" ? (
              <div className="grid grid-cols-1 gap-3">
                {currentQuestion.options?.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleInputChange(option)}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      currentValue === option
                        ? "border-red-600 bg-red-600/20 text-white"
                        : "border-zinc-700 bg-zinc-800/50 text-zinc-300 hover:border-zinc-600"
                    }`}
                  >
                    {option === "60" || option === "90" || option === "120"
                      ? `${option} minutes`
                      : option}
                  </button>
                ))}
              </div>
            ) : (
              <div>
                <input
                  type="text"
                  value={currentValue}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder={currentQuestion.placeholder}
                  className="w-full px-4 py-3 rounded-lg border-2 border-zinc-700 bg-zinc-800/50 text-white placeholder-zinc-500 focus:outline-none focus:border-red-600 transition-all"
                  autoFocus
                />
                {currentQuestion.helper && (
                  <p className="mt-2 text-sm text-zinc-400">{currentQuestion.helper}</p>
                )}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4 mt-8">
              {currentStep > 0 && (
                <Button
                  onClick={handleBack}
                  variant="outline"
                  className="flex-1 border-zinc-700 hover:bg-zinc-800"
                >
                  Back
                </Button>
              )}

              {isLastStep ? (
                <Button
                  onClick={handleSubmit}
                  disabled={!currentValue || isGenerating}
                  className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
                >
                  {isGenerating ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Generating...</span>
                    </div>
                  ) : (
                    "Generate Study Session"
                  )}
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  disabled={!currentValue}
                  className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
                >
                  Next
                </Button>
              )}
            </div>
          </Card>
          ) : (
            <Card className="border-2 border-red-600/30 bg-zinc-900/50 backdrop-blur-sm p-8 shadow-2xl shadow-red-600/20">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="relative size-24">
                  <div className="absolute inset-0 bg-primary opacity-30 rounded-full blur-xl animate-pulse" />
                  <div className="relative w-full h-full rounded-full bg-card flex items-center justify-center border-2 border-primary/50 overflow-hidden animate-spin-slow">
                    <img
                      src="/ai-avatar.png"
                      alt="AI Study Assistant"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <h3 className="text-xl font-semibold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
                  Generating Your Study Session...
                </h3>
                <p className="text-muted-foreground text-center max-w-md">
                  Our AI is creating a personalized BTech CS study session based on your preferences. This will only take a moment!
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenerateStudyPage;
