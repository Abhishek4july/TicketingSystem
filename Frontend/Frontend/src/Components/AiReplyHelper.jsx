import React, { useState, useEffect } from "react";
import axios from "axios";
// import React from "react";
function AiReplyHelper({ ticketContent, comments }) {
  const [loading, setLoading] = useState(false); // ✅ This is valid
  const [suggestion, setSuggestion] = useState("");
  const [error, setError] = useState("");

  const fetchAiReply = async () => {
    console.log("🚀 Fetching AI reply...");
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/admin/suggest-reply`,
        { ticketContent, comments },
        { withCredentials: true }
      );

      if (res?.data?.data) {
        setSuggestion(res.data.data); // ✅ no hook here
      } else {
        console.warn("⚠️ Unexpected response format:", res.data);
        setError(res.data.message || "Failed to generate reply");
      }
    } catch (error) {
      console.error("AI API Error:", error?.response || error.message || error);
      setError("AI request failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("🧠 AiReplyHelper component mounted");
    console.log("ticketContent prop:", ticketContent);
    console.log("comments prop:", comments);
  }, []);

  return (
    <div className="p-4 my-4 border rounded-md text-black bg-gray-50 shadow-sm">
      <h2 className="font-semibold text-lg mb-2 text-black">💬 AI Reply Assistant</h2>
      <button
        onClick={() => {
          console.log("✅ Button clicked");
          fetchAiReply();
        }}
        className="bg-blue-600 text-black px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Generating..." : "💡 Suggest AI Reply"}
      </button>

      {error && <p className="mt-2 text-red-600">{error}</p>}

      {suggestion && (
        <div className="mt-4">
          <label className="block font-semibold mb-1 text-black">AI Suggested Reply:</label>
          <textarea
            className="w-full border p-2 rounded"
            rows={5}
            value={suggestion}
            readOnly
          />
        </div>
      )}
    </div>
  );
}

export default AiReplyHelper;
