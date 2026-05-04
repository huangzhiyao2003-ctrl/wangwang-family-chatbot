import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { ArrowLeft, Send, Sparkles, MessageCircle, Heart, PenLine, Bot, Coffee, UserRound } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { appCopy, getFreeTextReply, getInitialMessage, getReply, members, quickCards } from "./data/content.js";
import "./style.css";

const cardIcons = {
  bot: Bot,
  coffee: Coffee,
  heart: Heart,
  messageCircle: MessageCircle,
  penLine: PenLine,
  sparkles: Sparkles
};

function App() {
  const [member, setMember] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const selectedMember = members.find((item) => item.id === member);

  const visibleCards = useMemo(() => {
    return quickCards.filter((card) => {
      if (card.type === "general") return true;
      if (card.type === "grandma") return member === "grandma";
      if (card.type === "grandpa") return member === "grandpa";
      return false;
    });
  }, [member]);

  const startChat = (memberId) => {
    const target = members.find((item) => item.id === memberId);
    setMember(memberId);
    setInput("");
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
    setMessages([]);
  };

  const sendCard = (card) => {
    if (!member) return;
    const userText = card.title;
    const botText = getReply(member, card.id, input);
    setMessages((prev) => [
      ...prev,
      { role: "user", text: userText },
      { role: "bot", text: botText }
    ]);
  };

  const sendInput = () => {
    if (!member) return;
    if (!input.trim()) return;
    const userText = input.trim();
    const botText = getFreeTextReply(member, userText);
    setMessages((prev) => [
      ...prev,
      { role: "user", text: userText },
      { role: "bot", text: botText }
    ]);
    setInput("");
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
                <div className="avatar heroAvatar">
                  <UserRound size={28} />
                </div>
                <p className="eyebrow">{appCopy.eyebrow}</p>
                <h1>{appCopy.homeTitle}</h1>
                <p>{appCopy.homeSubtitle}</p>
              </header>

              <section className="identityGrid" aria-label={appCopy.identityLabel}>
                {members.map((item) => (
                  <motion.button
                    whileTap={{ scale: 0.97 }}
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
                <div className="avatar">
                  <UserRound size={24} />
                </div>
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
                      whileTap={{ scale: 0.97 }}
                      key={card.id}
                      className="quickCard"
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

              <section className="chatArea" aria-label={appCopy.chatAreaLabel}>
                <AnimatePresence initial={false}>
                  {messages.map((msg, idx) => (
                    <motion.div
                      key={`${msg.role}-${idx}`}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className={`bubble ${msg.role}`}
                    >
                      {msg.text}
                    </motion.div>
                  ))}
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
                <button onClick={sendInput} aria-label={appCopy.sendLabel}>
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
