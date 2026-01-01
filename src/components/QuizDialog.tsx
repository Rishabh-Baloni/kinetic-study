"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

interface QuizDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subject: string;
  topic: string;
  onComplete: (score: number) => void;
}

export default function QuizDialog({
  open,
  onOpenChange,
  subject,
  topic,
  onComplete,
}: QuizDialogProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    if (open && questions.length === 0) {
      loadQuiz();
    }
  }, [open]);

  const loadQuiz = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, topic }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to generate quiz");
      }

      const data = await response.json();
      setQuestions(data.questions);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowFeedback(true);

    // Wait 1 second to show feedback, then move to next question
    setTimeout(() => {
      const newAnswers = [...userAnswers, answerIndex];
      setUserAnswers(newAnswers);

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowFeedback(false);
      } else {
        // Quiz complete, calculate score
        const score = newAnswers.reduce((acc, answer, idx) => {
          return answer === questions[idx].correctAnswer ? acc + 1 : acc;
        }, 0);
        setShowResult(true);
        onComplete(score);
      }
    }, 1500);
  };

  const getScoreMessage = (score: number) => {
    if (score === 5) return "Perfect! 🎉";
    if (score >= 4) return "Great job! 🌟";
    if (score >= 3) return "Good effort! 👍";
    if (score >= 2) return "Keep learning! 📚";
    return "Review the topic! 💪";
  };

  const reset = () => {
    setQuestions([]);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setUserAnswers([]);
    setShowResult(false);
    setShowFeedback(false);
    setError("");
  };

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] bg-gradient-to-br from-red-950/90 to-pink-950/90 border-red-500/20">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
              Generating Quiz...
            </DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-red-400" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (error) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[600px] bg-gradient-to-br from-red-950/90 to-pink-950/90 border-red-500/20">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-red-400">
              Error
            </DialogTitle>
            <DialogDescription className="text-gray-300">
              {error}
            </DialogDescription>
          </DialogHeader>
          <Button
            onClick={handleClose}
            className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
          >
            Close
          </Button>
        </DialogContent>
      </Dialog>
    );
  }

  if (showResult) {
    const score = userAnswers.reduce((acc, answer, idx) => {
      return answer === questions[idx].correctAnswer ? acc + 1 : acc;
    }, 0);

    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[600px] bg-gradient-to-br from-red-950/90 to-pink-950/90 border-red-500/20">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent text-center">
              {getScoreMessage(score)}
            </DialogTitle>
            <DialogDescription className="text-center text-gray-300 text-lg mt-4">
              You scored {score} out of 5
            </DialogDescription>
          </DialogHeader>
          <div className="py-6">
            <div className="flex justify-center gap-2">
              {[...Array(5)].map((_, idx) => (
                <div
                  key={idx}
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold ${
                    idx < score
                      ? "bg-gradient-to-r from-red-600 to-pink-600 text-white"
                      : "bg-gray-700 text-gray-400"
                  }`}
                >
                  {idx + 1}
                </div>
              ))}
            </div>
          </div>
          <Button
            onClick={handleClose}
            className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
          >
            Done
          </Button>
        </DialogContent>
      </Dialog>
    );
  }

  if (questions.length === 0) return null;

  const question = questions[currentQuestion];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] bg-gradient-to-br from-red-950/90 to-pink-950/90 border-red-500/20">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
            Quiz: {topic}
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            Question {currentQuestion + 1} of {questions.length}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <h3 className="text-lg font-semibold text-white">
            {question.question}
          </h3>

          <div className="space-y-3">
            {question.options.map((option, idx) => {
              const isSelected = selectedAnswer === idx;
              const isCorrect = idx === question.correctAnswer;
              const showCorrect = showFeedback && isCorrect;
              const showWrong = showFeedback && isSelected && !isCorrect;

              return (
                <button
                  key={idx}
                  onClick={() => !showFeedback && handleAnswer(idx)}
                  disabled={showFeedback}
                  className={`w-full p-4 rounded-lg text-left transition-all ${
                    showCorrect
                      ? "bg-green-600/30 border-2 border-green-500"
                      : showWrong
                      ? "bg-red-600/30 border-2 border-red-500"
                      : isSelected
                      ? "bg-red-600/30 border-2 border-red-500"
                      : "bg-white/5 border border-white/10 hover:bg-white/10"
                  } ${showFeedback ? "cursor-not-allowed" : "cursor-pointer"}`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        showCorrect
                          ? "bg-green-600 text-white"
                          : showWrong
                          ? "bg-red-600 text-white"
                          : isSelected
                          ? "bg-red-600 text-white"
                          : "bg-white/10 text-gray-300"
                      }`}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span
                      className={`${
                        showCorrect || showWrong ? "text-white" : "text-gray-200"
                      }`}
                    >
                      {option}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {showFeedback && (
            <div
              className={`p-4 rounded-lg ${
                selectedAnswer === question.correctAnswer
                  ? "bg-green-600/20 text-green-200"
                  : "bg-red-600/20 text-red-200"
              }`}
            >
              {selectedAnswer === question.correctAnswer
                ? "✓ Correct!"
                : `✗ Incorrect. The correct answer is ${String.fromCharCode(
                    65 + question.correctAnswer
                  )}`}
            </div>
          )}
        </div>

        <div className="flex justify-between items-center pt-4">
          <div className="text-sm text-gray-400">
            Progress: {currentQuestion + 1}/{questions.length}
          </div>
          <div className="flex gap-2">
            {[...Array(questions.length)].map((_, idx) => (
              <div
                key={idx}
                className={`w-2 h-2 rounded-full ${
                  idx < currentQuestion
                    ? "bg-red-500"
                    : idx === currentQuestion
                    ? "bg-pink-500"
                    : "bg-gray-600"
                }`}
              />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
