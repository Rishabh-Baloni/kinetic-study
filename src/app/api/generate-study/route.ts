import { NextResponse } from "next/server";

const GROQ_API_KEY = process.env.GROQ_API_KEY;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { subject, topic, goal, duration, level, learningStyle, experience, preferredResource } = body;

    console.log("Generating tasks for:", { subject, topic, goal, duration, level, learningStyle, experience, preferredResource });

    const prompt = `You are an AI study coach EXCLUSIVELY for BTech Computer Science students.

SUBJECT: ${subject}
TOPIC: ${topic}
GOAL: ${goal}
DURATION: ${duration} minutes
KNOWLEDGE LEVEL: ${level}
LEARNING STYLE: ${learningStyle}
EXPERIENCE: ${experience}
PREFERRED RESOURCE: ${preferredResource}

CRITICAL: First, validate that the TOPIC matches the SUBJECT:
- DBMS topics: Normalization, Transactions, Indexing, SQL, ACID, Concurrency Control, ER Diagrams
- OS topics: Process Scheduling, Deadlock, Memory Management, Paging, File Systems, Synchronization
- CN topics: TCP/IP, Routing, OSI Model, Subnetting, Network Security, HTTP, DNS
- DSA topics: Sorting, Searching, Trees, Graphs, Dynamic Programming, Hashing, Linked Lists
- OOP topics: Inheritance, Polymorphism, Encapsulation, Design Patterns, Classes, Abstraction
- Math topics: Probability, Linear Algebra, Discrete Math, Calculus, Statistics, Graph Theory

If "${topic}" does NOT match "${subject}", respond with:
{
  "error": "Topic mismatch",
  "message": "The topic '${topic}' belongs to [CORRECT_SUBJECT], not ${subject}. Please select the correct subject or change your topic.",
  "suggestedSubject": "[CORRECT_SUBJECT]"
}

If the topic MATCHES, generate EXACTLY 5 tasks based on the user's profile:

KNOWLEDGE LEVEL ADJUSTMENTS:
${level === "Beginner" 
  ? "- Start with fundamentals and basic concepts\n- Include more theory and explanation\n- Use simple, step-by-step practice problems\n- Add more recall/review tasks"
  : level === "Advanced"
  ? "- Focus on complex problems and edge cases\n- Include advanced topics and optimizations\n- Challenge with harder interview questions\n- Reduce basic theory, more application"
  : "- Balance theory and practice\n- Include moderate difficulty problems\n- Mix concepts with hands-on coding"}

LEARNING STYLE PREFERENCES:
${learningStyle.includes("Visual") 
  ? "- Prioritize WATCH tasks (20-25% of time)\n- Include diagram/visualization resources"
  : learningStyle.includes("Reading")
  ? "- Prioritize READ tasks (30-35% of time)\n- Include documentation and articles"
  : learningStyle.includes("Practice")
  ? "- Prioritize PRACTICE tasks (40-50% of time)\n- More coding problems and exercises"
  : "- Balanced distribution across all task types"}

EXPERIENCE ADJUSTMENTS:
${experience === "First Time" 
  ? "- Start from scratch, assume no prior knowledge\n- More foundational tasks\n- Include prerequisite concepts"
  : experience === "Revision"
  ? "- Focus on key concepts review\n- Quick recap tasks\n- More recall and practice, less reading"
  : "- Deep dive into advanced aspects\n- Focus on nuances and complex scenarios\n- Include research-level content"}

TIME DISTRIBUTIONS (adjust based on preferences):
- READ: 20-25%
- WATCH: 10-15%
- PRACTICE: 30-40%
- RECALL: 10-15%
- INTERVIEW: 15-20%

${goal === "Exam" 
  ? "Focus on theoretical understanding, formula derivation, and conceptual questions."
  : goal === "Placement"
  ? "Focus on coding problems, DSA patterns, and interview questions."
  : "Balance theory for exams and coding practice for placements."}

RECOMMENDED RESOURCES:
${preferredResource !== "No Preference" 
  ? `PRIMARY: ${preferredResource} (prioritize this platform)`
  : ""}
- DBMS: Gate Smashers, GeeksforGeeks, Neso Academy
- OS: Gate Smashers, Jenny's Lectures, Operating System Concepts
- CN: Gate Smashers, Kunal Kushwaha, Computer Networking by Tanenbaum
- DSA: Striver A2Z, Kunal Kushwaha, LeetCode, GeeksforGeeks
- OOP: Apna College, GeeksforGeeks, Head First Design Patterns
- Math: 3Blue1Brown, Khan Academy, NPTEL

Return STRICT JSON (no markdown):
{
  "tasks": [
    { "type": "read", "task": "Read normalization concepts (1NF to BCNF)", "time": 15, "order": 1 },
    { "type": "watch", "task": "Watch Gate Smashers BCNF video", "time": 10, "order": 2 },
    { "type": "practice", "task": "Solve 3 normalization problems on GFG", "time": 25, "order": 3 },
    { "type": "recall", "task": "Write down all normal forms from memory", "time": 5, "order": 4 },
    { "type": "interview", "task": "Explain BCNF to yourself (record or write)", "time": 5, "order": 5 }
  ]
}

Make tasks specific, actionable, and ${subject}-focused. Adjust difficulty for ${level} level. Total time must equal ${duration} minutes.`;

    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      }),
    });

    if (!groqResponse.ok) {
      const err = await groqResponse.text();
      console.error("Groq API error:", err);
      throw new Error(`Groq API error: ${groqResponse.status} ${err}`);
    }

    const data = await groqResponse.json();
    const text = data.choices[0].message.content;
    console.log("AI Response:", text);
    
    const clean = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const parsed = JSON.parse(clean);

    console.log("Parsed response:", parsed);

    // Check if AI returned an error
    if (parsed.error) {
      console.log("AI returned error:", parsed);
      return NextResponse.json(parsed, { status: 400 });
    }

    // Validate tasks exist
    if (!parsed.tasks || !Array.isArray(parsed.tasks) || parsed.tasks.length !== 5) {
      console.error("Invalid tasks:", parsed);
      return NextResponse.json({ 
        error: "Invalid response", 
        message: "AI did not generate valid tasks. Please try again or choose a different topic." 
      }, { status: 400 });
    }

    console.log("Success! Returning tasks:", parsed.tasks.length);
    return NextResponse.json({ success: true, tasks: parsed.tasks });
  } catch (error) {
    console.error("Generate study error:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}