import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { subject, topic } = await req.json();

    if (!subject || !topic) {
      return NextResponse.json(
        { error: "Subject and topic are required" },
        { status: 400 }
      );
    }

    const prompt = `You are an expert BTech Computer Science professor creating a quick assessment quiz.

Subject: ${subject}
Topic: ${topic}

Generate exactly 5 multiple-choice questions to test understanding of this topic. Questions should:
- Test conceptual understanding, not just memorization
- Be relevant to BTech CS curriculum
- Include 4 options each (A, B, C, D)
- Have clear correct answers
- Range from easy to moderate difficulty

Return ONLY a valid JSON object in this exact format (no markdown, no explanation):
{
  "questions": [
    {
      "question": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0
    }
  ]
}

Where correctAnswer is the index (0-3) of the correct option.`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 2000,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error("No response from AI");
    }

    // Parse AI response
    const quizData = JSON.parse(response.trim());

    // Validate structure
    if (
      !quizData.questions ||
      !Array.isArray(quizData.questions) ||
      quizData.questions.length !== 5
    ) {
      throw new Error("Invalid quiz format from AI");
    }

    // Validate each question
    quizData.questions.forEach((q: any, idx: number) => {
      if (
        !q.question ||
        !Array.isArray(q.options) ||
        q.options.length !== 4 ||
        typeof q.correctAnswer !== "number" ||
        q.correctAnswer < 0 ||
        q.correctAnswer > 3
      ) {
        throw new Error(`Invalid question format at index ${idx}`);
      }
    });

    return NextResponse.json(quizData);
  } catch (error: any) {
    console.error("Quiz generation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate quiz" },
      { status: 500 }
    );
  }
}
