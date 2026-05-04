import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { ArrowLeft, ChevronDown, Send, Sparkles, MessageCircle, PenLine, Coffee } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { appCopy, getFreeTextReply, getInitialMessage, getPresetAnswer, getReply, members, presetQuestions, quickCards, recentStatus } from "./data/content.js";
import "./style.css";

const cardIcons = {
  coffee: Coffee,
  messageCircle: MessageCircle,
  penLine: PenLine,
  sparkles: Sparkles
};

const apiErrorReply = "我这会儿有点卡住啦，你可以先把想说的话微信发给旺旺，写清楚重点就好。";
const tooLongReply = "这段有点长，可以分几句慢慢说～";
const maxInputLength = 200;
const loadingText = "我想想怎么说更合适…";

function waitForLocalReply() {
  return new Promise((resolve) => {
    window.setTimeout(resolve, 900 + Math.floor(Math.random() * 500));
  });
}

function Avatar({ large = false }) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <div className={`avatar ${large ? "heroAvatar" : ""}`}>
      {!imageFailed && <img className="avatarImage" src="/avatar-red.jpg" alt="" onError={() => setImageFailed(true)} />}
    </div>
  );
}

async function requestChatReply(member, message) {
  let response;

  try {
    response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        member,
        message,
        recentStatus
      })
    });
  } catch (error) {
    error.useLocalFallback = true;
    throw error;
  }

  const data = await response.json().catch(() => null);

  if (data?.reply) {
    return data.reply;
  }

  if (!response.ok) {
    const error = new Error(data?.error || "chat request failed");
    error.useLocalFallback = response.status === 404;
    throw error;
  }

  return apiErrorReply;
}

function App() {
  const [member, setMember] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [showPresets, setShowPresets] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const chatAreaRef = useRef(null);
  const thinkingRef = useRef(false);

  const selectedMember = members.find((item) => item.id === member);

  const visibleCards = useMemo(() => {
    return quickCards.filter((card) => {
      if (card.type === "general") return true;
      if (card.type === "grandma") return member === "grandma";
      if (card.type === "grandpa") return member === "grandpa";
      return false;
    });
  }, [member]);

  useEffect(() => {
    if (!chatAreaRef.current) return;
    chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
  }, [messages, showPresets]);

  const startChat = (memberId) => {
    const target = members.find((item) => item.id === memberId);
    setMember(memberId);
    setInput("");
    setShowPresets(false);
    setIsThinking(false);
    thinkingRef.current = false;
    setMessages([
      {
        role: "bot",
        text: getInitialMessage(target.label)
      }
    ]);
  };

  const backToHome = () => {
    setMember(null);
    setInput("");
    setShowPresets(false);
    setIsThinking(false);
    thinkingRef.current = false;
    setMessages([]);
  };

  const sendWithLoading = async (userText, getBotText) => {
    if (!member) return;
    if (thinkingRef.current) return;
    thinkingRef.current = true;
    setIsThinking(true);
    const loadingId = `loading-${Date.now()}-${Math.random().toString(16).slice(2)}`;

    setMessages((prev) => [
      ...prev,
      { role: "user", text: userText },
      { id: loadingId, role: "bot", text: loadingText, status: "loading" }
    ]);

    try {
      const botText = await getBotText();
      setMessages((prev) => prev.map((msg) => (msg.id === loadingId ? { role: "bot", text: botText } : msg)));
    } finally {
      thinkingRef.current = false;
      setIsThinking(false);
    }
  };

  const sendCard = (card) => {
    if (!member) return;
    sendWithLoading(card.title, async () => {
      await waitForLocalReply();
      return getReply(member, card.id, input);
    });
  };

  const sendPreset = (preset) => {
    if (!member) return;
    setShowPresets(false);
    sendWithLoading(preset.question, async () => {
      await waitForLocalReply();
      return getPresetAnswer(member, preset.id);
    });
  };

  const sendInput = async () => {
    if (!member) return;
    if (thinkingRef.current) return;
    if (!input.trim()) return;
    const userText = input.trim();
    setInput("");

    if (Array.from(userText).length > maxInputLength) {
      sendWithLoading(userText, async () => {
        await waitForLocalReply();
        return tooLongReply;
      });
      return;
    }

    sendWithLoading(userText, async () => {
      try {
        return await requestChatReply(member, userText);
      } catch (error) {
        return error.useLocalFallback ? getFreeTextReply(member, userText) : apiErrorReply;
      }
    });
  };

  return (
    <div className="page">
      <div className="phone">
        <div className="softGlow glowA" />
        <div className="softGlow glowB" />

        <AnimatePresence mode="wait">
          {!member ? (
            <motion.main
              key="home"
              className="screen homeScreen"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22 }}
            >
              <header className="heroHeader">
                <Avatar large />
                <p className="eyebrow">{appCopy.eyebrow}</p>
                <h1>{appCopy.homeTitle}</h1>
                <p>{appCopy.homeSubtitle}</p>
              </header>

              <section className="identityGrid" aria-label={appCopy.identityLabel}>
                {members.map((item, index) => (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.06 + index * 0.06, duration: 0.22 }}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    key={item.id}
                    className="identityButton"
                    onClick={() => startChat(item.id)}
                  >
                    {item.label}
                  </motion.button>
                ))}
              </section>

              <p className="homeNote">{appCopy.homeNote}</p>
            </motion.main>
          ) : (
            <motion.main
              key="chat"
              className="screen chatScreen"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22 }}
            >
              <header className="topBar">
                <button className="backButton" onClick={backToHome} aria-label={appCopy.backLabel}>
                  <ArrowLeft size={20} />
                </button>
                <Avatar />
                <div>
                  <h1>{appCopy.chatTitle}</h1>
                  <p>
                    {appCopy.chatStatusPrefix}
                    {selectedMember?.label}
                    {appCopy.chatStatusSuffix}
                  </p>
                </div>
              </header>

              <section className="quickGrid">
                {visibleCards.map((card) => {
                  const Icon = cardIcons[card.icon];
                  return (
                    <motion.button
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      key={card.id}
                      className="quickCard"
                      disabled={isThinking}
                      onClick={() => sendCard(card)}
                    >
                      <div className="iconBubble">
                        <Icon size={18} />
                      </div>
                      <span>{card.chipLabel || card.title}</span>
                    </motion.button>
                  );
                })}
              </section>

              <section className="chatArea" aria-label={appCopy.chatAreaLabel} ref={chatAreaRef}>
                <AnimatePresence initial={false}>
                  {messages.map((msg, idx) => (
                    <motion.div
                      key={msg.id || `${msg.role}-${idx}`}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className={`bubble ${msg.role} ${msg.status === "loading" ? "loading" : ""}`}
                    >
                      <span>{msg.text}</span>
                      {msg.status === "loading" && (
                        <span className="typingDots" aria-hidden="true">
                          <i />
                          <i />
                          <i />
                        </span>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </section>

              <section className={`presetPanel ${showPresets ? "open" : ""}`}>
                <button className="presetToggle" onClick={() => setShowPresets((value) => !value)} aria-expanded={showPresets} disabled={isThinking}>
                  <span>{appCopy.presetToggle}</span>
                  <ChevronDown size={18} />
                </button>

                <AnimatePresence initial={false}>
                  {showPresets && (
                    <motion.div
                      className="presetList"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.18 }}
                    >
                      {presetQuestions.map((preset) => (
                        <button key={preset.id} className="presetQuestion" onClick={() => sendPreset(preset)} disabled={isThinking}>
                          {preset.question}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </section>

              <footer className="inputBar">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={appCopy.inputPlaceholder}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.nativeEvent.isComposing) {
                      sendInput();
                    }
                  }}
                />
                <button onClick={sendInput} aria-label={appCopy.sendLabel} disabled={isThinking}>
                  <Send size={18} />
                </button>
              </footer>
            </motion.main>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
