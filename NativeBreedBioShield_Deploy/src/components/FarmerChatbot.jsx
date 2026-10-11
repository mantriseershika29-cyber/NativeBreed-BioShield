
import { useEffect, useRef, useState } from "react";
import {
  Bot,
  X,
  Send,
  Mic,
  Volume2,
  Languages,
  Sparkles,
  Leaf,
  MicOff,
} from "lucide-react";
import "../index.css";

const LANGUAGES = {
  English: { code: "en-IN", greeting: "Hello! I'm BioShield AI. How can I help your farm today?" },
  Telugu: { code: "te-IN", greeting: "నమస్కారం! మీ వ్యవసాయానికి నేను ఎలా సహాయం చేయగలను?" },
  Hindi: { code: "hi-IN", greeting: "नमस्ते! मैं आपकी खेती में कैसे मदद कर सकता हूँ?" },
  Tamil: { code: "ta-IN", greeting: "வணக்கம்! உங்கள் விவசாயத்திற்கு நான் எப்படி உதவ முடியும்?" },
};

const DEMO_ANSWERS = {
  English:
    "I can help you explore possible crop issues, native cattle breeds, animal care, and farming services. Tell me more about your situation. For serious animal illness, please contact a qualified veterinarian.",
  Telugu:
    "పంట సమస్యలు, దేశీయ పశు జాతులు, పశు సంరక్షణ మరియు వ్యవసాయ సేవల గురించి తెలుసుకోవడంలో నేను సహాయపడగలను. మీ సమస్య గురించి మరింత వివరంగా చెప్పండి. పశువుకు తీవ్రమైన అనారోగ్యం ఉంటే పశువైద్యుడిని సంప్రదించండి.",
  Hindi:
    "मैं फसल की समस्याओं, देशी पशु नस्लों, पशु देखभाल और कृषि सेवाओं के बारे में जानकारी देने में मदद कर सकता हूँ। कृपया अपनी समस्या के बारे में और बताएं। पशु गंभीर रूप से बीमार हो तो पशु चिकित्सक से संपर्क करें।",
  Tamil:
    "பயிர் பிரச்சினைகள், நாட்டுப்புற கால்நடை இனங்கள், கால்நடை பராமரிப்பு மற்றும் விவசாய சேவைகள் பற்றி அறிய நான் உதவ முடியும். உங்கள் பிரச்சினையைப் பற்றி மேலும் கூறுங்கள். கால்நடைக்கு கடுமையான உடல்நலப் பிரச்சினை இருந்தால் கால்நடை மருத்துவரை அணுகவும்.",
};

export default function FarmerChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState("English");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [backendConnected, setBackendConnected] = useState(true);
  const recognitionRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content: LANGUAGES[language].greeting,
        },
      ]);
    }
  }, [language]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
      window.speechSynthesis?.cancel();
    };
  }, []);

  function startListening() {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice input is not supported in this browser. Try Google Chrome.");
      return;
    }

    recognitionRef.current?.stop();

    const recognition = new SpeechRecognition();
    recognition.lang = LANGUAGES[language].code;
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);

    recognition.onerror = () => {
      setListening(false);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };

    recognitionRef.current = recognition;
    recognition.start();
  }

  function speakReply(text) {
    if (!("speechSynthesis" in window)) {
      alert("Spoken replies are not supported in this browser.");
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = LANGUAGES[language].code;
    utterance.rate = 0.95;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }

  async function sendMessage(event) {
    event?.preventDefault();

    const message = input.trim();
    if (!message || loading) return;

    const nextMessages = [...messages, { role: "user", content: message }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      // Connects to your friend's backend at /api/chat.
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          language,
          history: nextMessages.slice(-8),
        }),
      });

      if (!response.ok) {
        throw new Error("Backend is unavailable");
      }

      const data = await response.json();

      if (!data.reply) throw new Error("No reply received");

      setBackendConnected(true);
      setMessages((previous) => [
        ...previous,
        { role: "assistant", content: data.reply },
      ]);
    } catch {
      // Demonstration fallback: this is a sample answer, not a real AI response.
      setBackendConnected(false);
      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content: DEMO_ANSWERS[language],
          demo: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bio-ai-root">
      {isOpen && (
        <section className="bio-ai-window">
          <header className="bio-ai-header">
            <div className="bio-ai-brand">
              <div className="bio-ai-logo">
                <Leaf size={22} />
              </div>
              <div>
                <h3>BioShield AI</h3>
                <p>
                  <span className="bio-ai-status-dot" />
                  {backendConnected
                    ? "Your farming companion"
                    : "Interactive demo mode"}
                </p>
              </div>
            </div>
            <button
              className="bio-ai-icon-button"
              onClick={() => setIsOpen(false)}
              aria-label="Close assistant"
            >
              <X size={21} />
            </button>
          </header>

          <div className="bio-ai-language">
            <Languages size={17} />
            <label htmlFor="bio-ai-language">Chat language</label>
            <select
              id="bio-ai-language"
              value={language}
              onChange={(event) => {
                setLanguage(event.target.value);
                window.speechSynthesis?.cancel();
              }}
            >
              {Object.keys(LANGUAGES).map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="bio-ai-welcome">
            <Sparkles size={19} />
            <div>
              <strong>Ask naturally. Grow confidently.</strong>
              <p>Speak in your preferred language.</p>
            </div>
          </div>

          <div className="bio-ai-messages">
            {messages.map((message, index) => (
              <div
                key={`${index}-${message.role}`}
                className={`bio-ai-message ${
                  message.role === "user" ? "bio-ai-user" : "bio-ai-assistant"
                }`}
              >
                {message.role === "assistant" && (
                  <div className="bio-ai-avatar">
                    <Bot size={17} />
                  </div>
                )}

                <div className="bio-ai-bubble">
                  <p>{message.content}</p>
                  {message.demo && (
                    <small>Sample response · Backend not connected</small>
                  )}
                  {message.role === "assistant" && (
                    <button
                      className="bio-ai-speak"
                      onClick={() => speakReply(message.content)}
                      aria-label="Read response aloud"
                      title="Read response aloud"
                    >
                      <Volume2 size={16} />
                      <span>Listen</span>
                    </button>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="bio-ai-typing">
                <span />
                <span />
                <span />
                <small>BioShield is thinking...</small>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          <div className="bio-ai-quick-prompts">
            {[
              "Cattle care",
              "Crop problems",
              "Native breeds",
            ].map((prompt) => (
              <button
                key={prompt}
                onClick={() => setInput(prompt)}
              >
                {prompt}
              </button>
            ))}
          </div>

          {listening && (
            <div className="bio-ai-listening">
              <span className="bio-ai-pulse" />
              Listening... Speak now
            </div>
          )}

          {speaking && (
            <div className="bio-ai-listening">
              <Volume2 size={16} />
              Speaking your answer...
            </div>
          )}

          <form className="bio-ai-input-area" onSubmit={sendMessage}>
            <button
              type="button"
              className={`bio-ai-mic ${listening ? "is-listening" : ""}`}
              onClick={listening ? () => recognitionRef.current?.stop() : startListening}
              aria-label={listening ? "Stop listening" : "Speak your question"}
              title={listening ? "Stop listening" : "Speak your question"}
            >
              {listening ? <MicOff size={20} /> : <Mic size={20} />}
            </button>

            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about your farm..."
              aria-label="Type your question"
            />

            <button
              type="submit"
              className="bio-ai-send"
              disabled={!input.trim() || loading}
              aria-label="Send message"
            >
              <Send size={18} />
            </button>
          </form>

          <footer className="bio-ai-footer">
            AI guidance can be imperfect. Verify important farm decisions with a qualified expert.
          </footer>
        </section>
      )}

      <button
        className={`bio-ai-launcher ${isOpen ? "is-open" : ""}`}
        onClick={() => setIsOpen((value) => !value)}
        aria-label={isOpen ? "Close BioShield AI" : "Open BioShield AI"}
      >
        {isOpen ? <X size={25} /> : <Bot size={26} />}
        {!isOpen && <span>Ask BioShield AI</span>}
      </button>
    </div>
  );
}
