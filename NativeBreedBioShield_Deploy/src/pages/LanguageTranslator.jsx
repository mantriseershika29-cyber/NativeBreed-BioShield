
import { useState } from "react";
import {
  Languages,
  ArrowLeftRight,
  Mic,
  Volume2,
  Copy,
  LoaderCircle,
} from "lucide-react";

const languages = [
  { name: "English", code: "en-IN" },
  { name: "Telugu", code: "te-IN" },
  { name: "Hindi", code: "hi-IN" },
  { name: "Tamil", code: "ta-IN" },
];

export default function LanguageTranslator({ onBack }) {
  const [source, setSource] = useState("en-IN");
  const [target, setTarget] = useState("te-IN");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function swapLanguages() {
    setSource(target);
    setTarget(source);
    setInput(output);
    setOutput(input);
    setError("");
  }

  function startVoiceInput() {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError("Voice input is not supported in this browser. Try Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = source;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setError("");
    recognition.onresult = (event) => {
      setInput(event.results[0][0].transcript);
    };
    recognition.onerror = () => {
      setError("Could not recognize speech. Please try again.");
    };

    recognition.start();
  }

  async function translateText() {
    if (!input.trim()) {
      setError("Please type or speak something to translate.");
      return;
    }

    setLoading(true);
    setError("");
    setOutput("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_TRANSLATE_API_URL || "/api/translate"}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: input,
            sourceLanguage: source,
            targetLanguage: target,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Translation service is not connected yet.");
      }

      const data = await response.json();

      if (!data.translatedText) {
        throw new Error("The translation service returned no translated text.");
      }

      setOutput(data.translatedText);
    } catch {
      setError(
        "Translation service is not connected. Connect your friend's backend or a translation API to translate text."
      );
    } finally {
      setLoading(false);
    }
  }

  function speakText() {
    if (!output || !("speechSynthesis" in window)) {
      setError("Spoken output is not supported in this browser.");
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(output);
    utterance.lang = target;

    window.speechSynthesis.speak(utterance);
  }

  async function copyText() {
    if (!output) return;

    try {
      await navigator.clipboard.writeText(output);
      setError("Translation copied!");
    } catch {
      setError("Unable to copy. Please select and copy the text manually.");
    }
  }

  return (
    <div className="translator-page">
      <div className="translator-top">
        <div>
          <div className="translator-eyebrow">
            <Languages size={17} />
            FARMER ACCESSIBILITY
          </div>
          <h1>Language Translator</h1>
          <p>
            Understand farming information in your preferred language.
          </p>
        </div>

        {onBack && (
          <button className="translator-back" onClick={onBack}>
            Back to Dashboard
          </button>
        )}
      </div>

      <section className="translator-card">
        <div className="translator-heading">
          <div className="translator-icon">
            <Languages size={25} />
          </div>
          <div>
            <h2>Translate your message</h2>
            <p>Type your message or use the microphone.</p>
          </div>
        </div>

        <div className="translator-language-row">
          <label>
            Translate from
            <select
              value={source}
              onChange={(event) => setSource(event.target.value)}
            >
              {languages.map((language) => (
                <option key={language.code} value={language.code}>
                  {language.name}
                </option>
              ))}
            </select>
          </label>

          <button
            className="translator-swap"
            onClick={swapLanguages}
            title="Swap languages"
            aria-label="Swap languages"
            type="button"
          >
            <ArrowLeftRight size={21} />
          </button>

          <label>
            Translate to
            <select
              value={target}
              onChange={(event) => setTarget(event.target.value)}
            >
              {languages.map((language) => (
                <option key={language.code} value={language.code}>
                  {language.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="translator-panels">
          <div className="translator-panel">
            <div className="translator-panel-heading">
              <span>Original text</span>
              <span>{input.length} characters</span>
            </div>

            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Type a message, farming question, or tap the microphone..."
              rows={7}
            />

            <button
              className="translator-mic"
              onClick={startVoiceInput}
              type="button"
            >
              <Mic size={18} />
              Speak your message
            </button>
          </div>

          <div className="translator-panel translator-result">
            <div className="translator-panel-heading">
              <span>Translated text</span>
              <span>
                {languages.find((language) => language.code === target)?.name}
              </span>
            </div>

            <div className="translator-output">
              {output || "Your translation will appear here..."}
            </div>

            <div className="translator-output-actions">
              <button onClick={speakText} disabled={!output} type="button">
                <Volume2 size={17} />
                Listen
              </button>
              <button onClick={copyText} disabled={!output} type="button">
                <Copy size={16} />
                Copy
              </button>
            </div>
          </div>
        </div>

        <button
          className="translator-submit"
          onClick={translateText}
          disabled={loading}
          type="button"
        >
          {loading ? (
            <>
              <LoaderCircle size={19} />
              Translating...
            </>
          ) : (
            <>
              <Languages size={19} />
              Translate message
            </>
          )}
        </button>

        {error && <p className="translator-message">{error}</p>}

        <p className="translator-note">
          Translation requires a connected translation service. Voice
          recognition and spoken output depend on browser and device support.
        </p>
      </section>
    </div>
  );
}
