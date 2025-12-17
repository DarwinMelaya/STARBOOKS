import { useState, useEffect, useRef } from "react";
import api from "../../utils/api";
import toast from "react-hot-toast";

const ChatBotModal = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Load conversation history when modal opens
  useEffect(() => {
    if (isOpen) {
      loadConversation();
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const loadConversation = async () => {
    try {
      const res = await api.get("/ai/conversation");
      if (res.data?.success && res.data.conversation) {
        setMessages(res.data.conversation);
      }
    } catch (error) {
      console.error("Error loading conversation:", error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || loading) return;

    const userMessage = inputMessage.trim();
    setInputMessage("");
    setLoading(true);
    setIsTyping(true);

    // Add user message immediately
    const newUserMessage = { role: "user", content: userMessage };
    setMessages((prev) => [...prev, newUserMessage]);

    try {
      const res = await api.post("/ai/chat", { message: userMessage });

      if (res.data?.success) {
        const aiMessage = { role: "assistant", content: res.data.response };
        setMessages((prev) => [...prev, aiMessage]);
      } else {
        toast.error(res.data?.error || "Failed to get response");
        // Remove user message if error
        setMessages((prev) => prev.slice(0, -1));
      }
    } catch (error) {
      const msg = error.response?.data?.error || "Failed to send message";
      toast.error(msg);
      // Remove user message if error
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setLoading(false);
      setIsTyping(false);
    }
  };

  const handleResetConversation = async () => {
    if (!confirm("Are you sure you want to reset the conversation?")) return;

    try {
      const res = await api.post("/ai/reset-conversation");
      if (res.data?.success) {
        setMessages([]);
        toast.success("Conversation reset");
      }
    } catch (error) {
      toast.error("Failed to reset conversation");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl h-[85vh] mx-4 flex flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 rounded-2xl shadow-2xl border border-slate-800/80 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.16),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(16,185,129,0.12),transparent_30%),radial-gradient(circle_at_50%_80%,rgba(236,72,153,0.12),transparent_30%)] blur-3xl" />

        <div className="relative flex flex-col h-full backdrop-blur-xl">
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-800/70 bg-slate-900/60">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-800/40">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    DOST Project Assistant
                  </h3>
                  <p className="text-xs text-emerald-100/80 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    Specialized in Marinduque Projects
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleResetConversation}
                  className="px-3 py-1.5 text-xs rounded-lg border border-slate-700/70 bg-slate-800/60 text-slate-200 hover:bg-slate-800/80 hover:border-indigo-400/40 transition-all"
                  title="Reset conversation"
                >
                  Reset
                </button>
                <button
                  onClick={onClose}
                  className="px-3 py-1.5 text-xs rounded-lg border border-slate-700/70 bg-slate-800/60 text-slate-200 hover:bg-slate-800/80 hover:border-red-400/40 transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="mb-4 p-4 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-600/20">
                  <svg
                    className="w-12 h-12 text-indigo-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">
                  Welcome to DOST Project Assistant
                </h4>
                <p className="text-sm text-slate-400 max-w-md">
                  Ask me about DOST projects in Marinduque, Philippines. I can
                  help you with:
                </p>
                <div className="mt-4 grid grid-cols-2 gap-2 max-w-md">
                  <div className="px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700/70 text-xs text-slate-300">
                    GIA Projects
                  </div>
                  <div className="px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700/70 text-xs text-slate-300">
                    SETUP Programs
                  </div>
                  <div className="px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700/70 text-xs text-slate-300">
                    CEST Initiatives
                  </div>
                  <div className="px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700/70 text-xs text-slate-300">
                    SSCP Solutions
                  </div>
                </div>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                      msg.role === "user"
                        ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-800/40"
                        : "bg-slate-800/60 border border-slate-700/70 text-slate-100"
                    }`}
                  >
                    <div className="text-sm whitespace-pre-wrap break-words">
                      {msg.content}
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-slate-800/60 border border-slate-700/70 rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    <span
                      className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <span
                      className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <span
                      className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="px-6 py-4 border-t border-slate-800/70 bg-slate-900/60">
            <form onSubmit={handleSendMessage} className="flex gap-3">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask about DOST projects in Marinduque..."
                className="flex-1 px-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700/70 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400/50 transition-all"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !inputMessage.trim()}
                className="px-6 py-3 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-medium shadow-lg shadow-indigo-800/40 hover:shadow-indigo-800/60 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                    <span>Send</span>
                  </>
                )}
              </button>
            </form>
            <p className="text-xs text-slate-400 mt-2 text-center">
              Ask about GIA, SETUP, CEST, or SSCP programs for Marinduque
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBotModal;
