const express = require("express");
const OpenAI = require("openai");
const path = require("path");

const app = express();

app.use(express.json({ limit: "1mb" }));

// Serve the LaunchKit website
app.use(express.static(path.join(__dirname, "public")));

// Serve the homepage from the repository root
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const jobs = {
  opportunity:
    "Analyze this opportunity against the user's real background. Return: Fit summary, strongest matches, gaps/risks, requirements checklist, and next actions. Never invent qualifications.",

  cv:
    "Tailor the user's CV content to the opportunity. Return a concise professional summary, prioritized skills, and rewritten achievement bullets. Never invent experience, metrics, titles, or credentials.",

  bullet:
    "Turn the user's real achievements into strong CV/application bullets. Use action + evidence + outcome where supported. Never fabricate numbers or impact.",

  statement:
    "Draft a compelling personal statement using only facts supplied by the user. Preserve authenticity and flag any important missing evidence instead of inventing it.",

  interview:
    "Act as an interview coach. Generate likely questions tailored to the opportunity, strong answer frameworks grounded in the user's background, and specific preparation advice.",

  email:
    "Draft a polished professional email for the stated goal using the supplied context. Keep it natural, specific, and concise.",

  qa:
    "Audit the application against the official requirements. Return missing items, weak areas, contradictions/unsupported claims, improvements, and a final submission checklist."
};

app.post("/api/generate", async (req, res) => {
  try {
    const {
      mode,
      target,
      requirements,
      background,
      extra
    } = req.body || {};

    if (!target && !requirements && !background) {
      return res
        .status(400)
        .json({ error: "Add some application information first." });
    }

    const task = jobs[mode] || jobs.opportunity;

    const input = `You are LaunchKit AI, an application assistant for students and young professionals.

TASK:
${task}

TARGET/GOAL:
${target || "(not provided)"}

OFFICIAL DESCRIPTION/REQUIREMENTS:
${requirements || "(not provided)"}

USER'S REAL BACKGROUND:
${background || "(not provided)"}

EXTRA INSTRUCTIONS:
${extra || "(none)"}

Rules:
- Be practical and specific.
- Never invent facts.
- Clearly distinguish suggestions from facts.
- Do not claim eligibility when official requirements are missing.
- Produce the useful final result directly, not a prompt for another AI.`;

    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5.6-luna",
      input
    });

    res.json({
      output: response.output_text
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error:
        "AI request failed. Check the server API key and billing configuration."
    });
  }
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`LaunchKit running on http://localhost:${port}`);
});
