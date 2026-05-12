import { useState } from "react";
import axios from "axios";

function App() {
  const [transcript, setTranscript] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const runAnalysis = async () => {
    if (!transcript.trim()) {
      alert("Please paste a transcript");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:5000/analyze",
        {
          transcript,
        }
      );

      setResult(response.data);

    } catch (error) {
      console.log(error);
      alert("Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-4xl font-bold mb-2">
          Trinethra Feedback Analyzer
        </h1>

        <p className="text-gray-600 mb-6">
          AI-assisted supervisor transcript analysis tool
        </p>

        <div className="bg-white p-6 rounded-xl shadow">

          <textarea
            className="w-full h-64 border rounded-lg p-4"
            placeholder="Paste supervisor transcript here..."
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
          />

          <button
            onClick={runAnalysis}
            className="mt-4 bg-black text-white px-6 py-3 rounded-lg"
          >
            {loading ? "Analyzing..." : "Run Analysis"}
          </button>
        </div>

        {result && (
          <div className="mt-8 space-y-6">

            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-2xl font-bold mb-4">
                Extracted Evidence
              </h2>

              {result.evidence?.map((item, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 mb-3"
                >
                  <p>{item.quote}</p>

                  <span className="text-sm text-gray-500">
                    {item.sentiment}
                  </span>
                </div>
              ))}
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-2xl font-bold mb-4">
                Rubric Score
              </h2>

              <p className="text-5xl font-bold">
                {result.rubricScore?.score}/10
              </p>

              <p className="mt-4">
                {result.rubricScore?.justification}
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-2xl font-bold mb-4">
                KPI Mapping
              </h2>

              <ul className="list-disc pl-6">
                {result.kpiMapping?.map((kpi, index) => (
                  <li key={index}>{kpi}</li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-2xl font-bold mb-4">
                Gap Analysis
              </h2>

              <ul className="list-disc pl-6">
                {result.gapAnalysis?.map((gap, index) => (
                  <li key={index}>{gap}</li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-2xl font-bold mb-4">
                Follow-up Questions
              </h2>

              <ul className="list-disc pl-6">
                {result.followUpQuestions?.map((question, index) => (
  <li key={index}>
    {typeof question === "object"
      ? JSON.stringify(question)
      : question}
  </li>
))}
              </ul>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

export default App;