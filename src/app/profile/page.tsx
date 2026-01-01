"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import ProfileHeader from "@/components/ProfileHeader";
import QuizDialog from "@/components/QuizDialog";
import { Id } from "../../../convex/_generated/dataModel";

const ProfilePage = () => {
  const { user } = useUser();
  const router = useRouter();

  const session = useQuery(api.study.getActiveSession);
  const stats = useQuery(api.study.getUserStats);
  const revisions = useQuery(api.study.getRevisionSchedule);
  const sessionHistory = useQuery(api.study.getSessionHistory);

  const completeTask = useMutation(api.study.completeTask);
  const completeSession = useMutation(api.study.completeSession);
  const completeRevision = useMutation(api.study.completeRevision);
  const syncUser = useMutation(api.users.syncUser);

  const [showConfidenceDialog, setShowConfidenceDialog] = useState(false);
  const [selectedConfidence, setSelectedConfidence] = useState<number | null>(null);
  const [showQuizDialog, setShowQuizDialog] = useState(false);
  const [currentSessionData, setCurrentSessionData] = useState<{subject: string, topic: string, sessionId: Id<"studySessions">} | null>(null);

  // Sync user on mount
  useEffect(() => {
    if (user) {
      syncUser({
        name: user.fullName || user.firstName || "Student",
        email: user.primaryEmailAddress?.emailAddress || "",
        clerkId: user.id,
        image: user.imageUrl,
      });
    }
  }, [user, syncUser]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-zinc-400">Please log in</p>
      </div>
    );
  }

  const handleTaskComplete = async (taskIndex: number) => {
    if (!session?._id) return;

    await completeTask({
      sessionId: session._id as Id<"studySessions">,
      taskIndex,
    });
  };

  const handleSessionComplete = () => {
    setShowConfidenceDialog(true);
  };

  const handleConfidenceSubmit = async () => {
    if (!session?._id || !selectedConfidence) return;

    // Store session data for quiz
    setCurrentSessionData({
      subject: session!.subject,
      topic: session!.topic,
      sessionId: session!._id as Id<"studySessions">,
    });

    setShowConfidenceDialog(false);
    setShowQuizDialog(true);
  };

  const handleQuizComplete = async (score: number) => {
    if (!currentSessionData) return;

    await completeSession({
      sessionId: currentSessionData.sessionId,
      confidenceScore: selectedConfidence!,
      quizScore: score,
    });

    setShowQuizDialog(false);
    setSelectedConfidence(null);
    setCurrentSessionData(null);
  };

  const handleSkipQuiz = async () => {
    if (!currentSessionData) return;

    await completeSession({
      sessionId: currentSessionData.sessionId,
      confidenceScore: selectedConfidence!,
    });

    setShowQuizDialog(false);
    setSelectedConfidence(null);
    setCurrentSessionData(null);
  };

  const handleRevisionComplete = async (revisionId: string) => {
    await completeRevision({
      revisionId: revisionId as Id<"revisionSchedule">,
    });
  };

  const isTaskCompleted = (taskIndex: number) => {
    return session?.completions?.some((c) => c.taskIndex === taskIndex);
  };

  const allTasksCompleted = session?.tasks.every((_, idx: number) =>
    isTaskCompleted(idx)
  );

  const getTaskIcon = (type: string) => {
    switch (type) {
      case "read": return "▣";
      case "watch": return "▶︎";
      case "practice": return "⟨⟩";
      case "recall": return "◈";
      case "interview": return "◉";
      default: return "✓";
    }
  };

  if (session === undefined || stats === undefined || revisions === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
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

      <div className="relative z-10 container mx-auto px-4 py-8">
        <ProfileHeader
          name={user.fullName || user.firstName || "Student"}
          image={user.imageUrl}
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur-sm p-6">
            <div className="text-sm text-zinc-400 mb-1">Total Sessions</div>
            <div className="text-3xl font-bold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
              {stats?.totalSessions || 0}
            </div>
          </Card>

          <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur-sm p-6">
            <div className="text-sm text-zinc-400 mb-1">Total Minutes</div>
            <div className="text-3xl font-bold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
              {stats?.totalMinutes || 0}
            </div>
          </Card>

          <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur-sm p-6">
            <div className="text-sm text-zinc-400 mb-1">Avg Confidence</div>
            <div className="text-3xl font-bold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
              {stats?.averageConfidence?.toFixed(1) || "0.0"}/5
            </div>
          </Card>

          <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur-sm p-6">
            <div className="text-sm text-zinc-400 mb-1">Current Streak</div>
            <div className="text-3xl font-bold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
              {stats?.streak || 0} 🔥
            </div>
          </Card>
        </div>

        {/* Active Session or No Session */}
        {!session ? (
          <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur-sm p-12 text-center">
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-2xl font-bold mb-2">No Active Study Session</h2>
            <p className="text-zinc-400 mb-6">
              Generate a new study session to get started
            </p>
            <Button
              onClick={() => router.push("/generate-study")}
              className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
            >
              Generate Study Session
            </Button>
          </Card>
        ) : (
          <>
            {/* Active Session Header */}
            <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur-sm p-6 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold">{session.subject}</h2>
                    <span className="px-3 py-1 bg-red-600/20 border border-red-600/50 rounded-full text-sm">
                      {session.goal}
                    </span>
                  </div>
                  <p className="text-zinc-400">{session.topic}</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
                    {session.totalDuration} min
                  </div>
                  <div className="text-sm text-zinc-400">
                    {session.completions?.length || 0}/{session.tasks.length} tasks
                  </div>
                </div>
              </div>
            </Card>

            {/* Tasks List */}
            <div className="space-y-3 mb-6">
              {session.tasks.map((task, index: number) => {
                const completed = isTaskCompleted(index);
                return (
                  <Card
                    key={index}
                    className={`border-zinc-800 p-4 transition-all ${
                      completed
                        ? "bg-green-900/20 border-green-600/50"
                        : "bg-zinc-900/50 backdrop-blur-sm hover:bg-zinc-900/70"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-3xl">{getTaskIcon(task.type)}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 bg-red-600/20 border border-red-600/50 rounded text-xs uppercase">
                            {task.type}
                          </span>
                          <span className="text-sm text-zinc-400">{task.time} min</span>
                        </div>
                        <p className={completed ? "text-zinc-400 line-through" : "text-white"}>
                          {task.task}
                        </p>
                      </div>
                      {!completed && (
                        <Button
                          onClick={() => handleTaskComplete(index)}
                          variant="outline"
                          size="sm"
                          className="border-green-600 text-green-400 hover:bg-green-600/20"
                        >
                          Complete
                        </Button>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Complete Session Button */}
            {allTasksCompleted && (
              <Button
                onClick={handleSessionComplete}
                className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-lg py-6"
              >
                Complete Session & Rate Confidence
              </Button>
            )}
          </>
        )}

        {/* Revisions Section */}
        {revisions && revisions.length > 0 && (
          <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur-sm p-6 mt-8">
            <h2 className="text-xl font-bold mb-4">📅 Upcoming Revisions</h2>
            <div className="space-y-3">
              {revisions.slice(0, 5).map((revision) => (
                <div
                  key={revision._id}
                  className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg"
                >
                  <div>
                    <div className="font-semibold">{revision.subject} - {revision.topic}</div>
                    <div className="text-sm text-zinc-400">
                      {new Date(revision.scheduledFor).toLocaleDateString()} ({revision.type})
                    </div>
                  </div>
                  <Button
                    onClick={() => handleRevisionComplete(revision._id)}
                    size="sm"
                    variant="outline"
                    className="border-red-600 text-red-400"
                  >
                    Mark Done
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Session History */}
        {sessionHistory && sessionHistory.length > 0 && (
          <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur-sm p-6 mt-8">
            <h2 className="text-xl font-bold mb-4">📊 Recent History</h2>
            <div className="space-y-2">
              {sessionHistory.slice(0, 5).map((s) => (
                <div
                  key={s._id}
                  className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg text-sm"
                >
                  <div>
                    <span className="font-semibold">{s.subject}</span> - {s.topic}
                  </div>
                  <div className="flex items-center gap-4 text-zinc-400">
                    <span>{s.totalDuration} min</span>
                    {s.confidenceScore && (
                      <span className="text-red-400">{s.confidenceScore}/5 ⭐</span>
                    )}
                    {s.quizScore !== undefined && (
                      <span className="text-pink-400">{s.quizScore}/5 🎯</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      {/* Confidence Dialog */}
      <Dialog open={showConfidenceDialog} onOpenChange={setShowConfidenceDialog}>
        <DialogContent className="bg-gradient-to-br from-red-950/90 to-pink-950/90 border-red-500/20">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
              How confident do you feel?
            </DialogTitle>
            <DialogDescription className="text-gray-300">
              Rate your understanding of this topic
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-5 gap-3 py-4">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                onClick={() => setSelectedConfidence(rating)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedConfidence === rating
                    ? "border-red-500 bg-red-600/30"
                    : "border-gray-600 bg-gray-800/50 hover:border-gray-500"
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-1 h-6 rounded-sm ${
                          i < rating
                            ? "bg-gradient-to-t from-red-600 to-pink-500"
                            : "bg-gray-700"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-xs text-gray-400">{rating}/5</div>
                </div>
              </button>
            ))}
          </div>
          <Button
            onClick={handleConfidenceSubmit}
            disabled={!selectedConfidence}
            className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
          >
            Continue to Quiz
          </Button>
        </DialogContent>
      </Dialog>

      {/* Quiz Dialog */}
      {currentSessionData && (
        <QuizDialog
          open={showQuizDialog}
          onOpenChange={(open) => {
            if (!open) handleSkipQuiz();
            setShowQuizDialog(open);
          }}
          subject={currentSessionData.subject}
          topic={currentSessionData.topic}
          onComplete={handleQuizComplete}
        />
      )}

    </div>
  );
};

export default ProfilePage;
