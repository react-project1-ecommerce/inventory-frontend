
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { auth } from "../firebase";
import Header from "../header/Header";
import Sidebar from "../header/Sidebar";

const AIAssistant = () => {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const recognitionRef = useRef(null);
  const stopRequestedRef = useRef(false);

  const [listening, setListening] = useState(false);  //voice dictation


  useEffect(() => {
  const handleEscape = (event) => {
    if (event.key === "Escape" && recognitionRef.current) {
      stopRequestedRef.current = true;
      recognitionRef.current.stop();
    }
  };

  window.addEventListener("keydown", handleEscape);

  return () => {
    window.removeEventListener("keydown", handleEscape);
  };
}, []);

  //dictation function

const handleDictate = () => {

  // Stop dictation when the microphone is clicked again

  if (listening && recognitionRef.current) {
    stopRequestedRef.current = true; 
    recognitionRef.current.stop();
    return;
  }

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Speech recognition is not supported in this browser.");
    return;
  }

  const recognition = new SpeechRecognition();

  recognitionRef.current = recognition;
  stopRequestedRef.current = false;

  recognition.lang = "en-IN";
  recognition.continuous = true;
  recognition.interimResults = false;

  recognition.onstart = () => setListening(true);

  recognition.onresult = (event) => {
    let transcript = "";

    for (let i = event.resultIndex; i < event.results.length; i++) {
      if (event.results[i].isFinal) {
        transcript += event.results[i][0].transcript;
      }
    }

    transcript = transcript.trim();

    if (transcript) {
      setQuestion((prev) => (prev ? prev + " " : "") + transcript);
    }
  };

  recognition.onerror = () => {
    stopRequestedRef.current = true;
  };

  recognition.onend = () => {
    recognitionRef.current = null;
    setListening(false);

    if (stopRequestedRef.current) {
      setQuestion((prev) => {
        const trimmed = prev.trim();

        return !trimmed || /[?!.]$/.test(trimmed)
          ? trimmed
          : trimmed + "?";
      });

      stopRequestedRef.current = false;
    }
  };

  recognition.start();
};


  const handleAsk = async (e) => {
    e.preventDefault();

    if (!question.trim()) return;

    const userQuestion = question.trim();

    setMessages((prev) => [
      ...prev,
      { role: "user", text: userQuestion },
    ]);

    setQuestion("");
    setLoading(true);

    try {
      const user = auth.currentUser;

      if (!user) {
        throw new Error("Please log in to use the AI Assistant.");
      }

      const token = await user.getIdToken();

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/aiassistant`,
        { question: userQuestion },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: response.data.answer },
      ]);
    } catch (err) {
      console.error("AI Assistant request failed:", err);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text:
            err.response?.data?.error ||
            err.message ||
            "Unable to get a response. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
     <Sidebar />

      <div className="flex-1">
      <Header />
      

      <main className="p-6">
        <div className="mx-auto max-w-3xl rounded-xl bg-white p-6 shadow">
          <h1 className="mb-2 text-2xl font-bold">
            AI Inventory Assistant
          </h1>

          <p className="mb-6 text-gray-600">
            Ask a question and get help from your AI assistant.
          </p>

          <div className="mb-6 min-h-48 space-y-4">
            {messages.length === 0 && (
              <p className="text-gray-500">
                Try asking: "How can I manage my inventory?"
              </p>
            )}

            {messages.map((message, index) => (
              <div
                key={index}
                className={`rounded-lg p-3 ${
                  message.role === "user"
                    ? "ml-8 bg-blue-100"
                    : "mr-8 bg-gray-100"
                }`}
              >
                <p className="mb-1 text-sm font-semibold">
                  {message.role === "user" ? "You" : "AI Assistant"}
                </p>
                <p className="whitespace-pre-wrap">{message.text}</p>
              </div>
            ))}

            {loading && (
              <p className="text-sm text-gray-500">
                AI is thinking...
              </p>
            )}
          </div>

          <form onSubmit={handleAsk} className="flex items-center gap-2 rounded-2xl border border-gray-300 bg-white px-3 py-2 shadow-sm">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Type your question..."
              className="min-w-0 flex-1 border-none bg-transparent px-2 py-2 outline-none focus:ring-0"
              disabled={loading}
            />

           {/* <button
              type="submit"
              disabled={loading || !question.trim()}
              className="rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              Ask
            </button>*/}

            <button
  type="button"
  onClick={handleDictate}
  disabled={loading}
  className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-white ${
    listening ? "bg-red-600" : "bg-gray-600 hover:bg-gray-700"
  } disabled:opacity-50`}
 // title={listening ? "Listening..." : "Dictate"}
  title={listening ? "Stop Dictation" : "Dictate"}  //for Stop Dictation
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className="h-4 w-4"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3m-4.5 0h9M12 15a3 3 0 0 0 3-3V5.25a3 3 0 1 0-6 0V12a3 3 0 0 0 3 3Z"
    />
  </svg>
</button>

            <button
  type="submit"
  disabled={loading || !question.trim()}
  className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
  aria-label="Send message"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2.5}
    stroke="currentColor"
    className="h-4 w-4"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 19V5m-7 7 7-7 7 7"
    />
  </svg>
</button>
          </form>
        </div>
      </main>

      </div>
    </div>
  );
};

export default AIAssistant;
