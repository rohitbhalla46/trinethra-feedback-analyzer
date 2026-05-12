const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/analyze", async (req, res) => {
  try {
    const { transcript } = req.body;
const prompt = `
You are an AI psychology assessment assistant.

Analyze the supervisor transcript carefully.

Return ONLY valid JSON.

Rules:
- Do not leave fields empty.
- Never return empty arrays.
- Always return at least 3 items where possible.
- Rubric score must be between 1 and 10.
- Evidence must contain quote and sentiment.
- KPI mapping must contain meaningful KPI names.
- Follow-up questions must be realistic and professional.

Use this exact JSON format:

{
  "evidence": [
    {
      "quote": "",
      "sentiment": "positive"
    }
  ],
  "rubricScore": {
    "score": 0,
    "justification": ""
  },
  "kpiMapping": [
    "Communication",
    "Leadership",
    "Team Coordination"
  ],
  "gapAnalysis": [
    ""
  ],
  "followUpQuestions": [
    "",
    "",
    ""
  ]
}

Transcript:
${transcript}
`;

    const response = await axios.post(
      "http://localhost:11434/api/generate",
      {
        model: "llama3.2",
        prompt,
        stream: false,
      }
    );

    const rawOutput = response.data.response;

    const cleaned = rawOutput
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(cleaned);

    res.json(parsed);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: "Analysis failed",
    });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});