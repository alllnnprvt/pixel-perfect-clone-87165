import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS")
    return new Response(null, { headers: corsHeaders });

  try {
    const { noteText } = await req.json();
    if (!noteText) throw new Error("noteText is required");

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const callAI = async (prompt: string, toolName: string, schema: Record<string, unknown>) => {
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: "You are a study materials generator. Extract information from the provided notes and return structured data." },
            { role: "user", content: prompt },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: toolName,
                description: `Generate ${toolName}`,
                parameters: schema,
              },
            },
          ],
          tool_choice: { type: "function", function: { name: toolName } },
        }),
      });

      if (res.status === 429) throw new Error("Rate limited. Please try again in a moment.");
      if (res.status === 402) throw new Error("AI credits exhausted. Please add funds in Settings → Workspace → Usage.");
      if (!res.ok) {
        const t = await res.text();
        console.error("AI error:", res.status, t);
        throw new Error("AI generation failed");
      }

      const data = await res.json();
      const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
      if (!toolCall) throw new Error("No tool call in response");
      return JSON.parse(toolCall.function.arguments);
    };

    // Generate flashcards
    const flashcardsResult = await callAI(
      `Generate 10 flashcard question-answer pairs from these notes:\n\n${noteText}`,
      "generate_flashcards",
      {
        type: "object",
        properties: {
          flashcards: {
            type: "array",
            items: {
              type: "object",
              properties: {
                question: { type: "string" },
                answer: { type: "string" },
              },
              required: ["question", "answer"],
            },
          },
        },
        required: ["flashcards"],
      }
    );

    // Generate quiz
    const quizResult = await callAI(
      `Generate 5 multiple choice questions from these notes:\n\n${noteText}`,
      "generate_quiz",
      {
        type: "object",
        properties: {
          quiz: {
            type: "array",
            items: {
              type: "object",
              properties: {
                question: { type: "string" },
                options: { type: "array", items: { type: "string" } },
                answer: { type: "string" },
              },
              required: ["question", "options", "answer"],
            },
          },
        },
        required: ["quiz"],
      }
    );

    // Generate explanations
    const explanationsResult = await callAI(
      `Find the 3 hardest concepts in these notes and explain each simply:\n\n${noteText}`,
      "generate_explanations",
      {
        type: "object",
        properties: {
          explanations: {
            type: "array",
            items: {
              type: "object",
              properties: {
                concept: { type: "string" },
                explanation: { type: "string" },
              },
              required: ["concept", "explanation"],
            },
          },
        },
        required: ["explanations"],
      }
    );

    return new Response(
      JSON.stringify({
        flashcards: flashcardsResult.flashcards,
        quiz: quizResult.quiz,
        explanations: explanationsResult.explanations,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("generate-study-materials error:", e);
    const status = e.message?.includes("Rate limited") ? 429 : e.message?.includes("credits") ? 402 : 500;
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
