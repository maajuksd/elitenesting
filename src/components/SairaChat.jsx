import { useEffect, useRef, useState } from "react";
import "./SairaChat.css";

/* ── Icons ── */
const WhatsAppIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const SendIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const AttachIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
  </svg>
);

/* ── Small bot avatar used inside chat body ── */
const BotAvatar = () => (
  <div className="bot-avatar">
    <img src="/bot.png" alt="Saira" />
  </div>
);

/* ── Quick-reply chips shown on first open ── */
const CHIPS = ["🏡 2BHK / 3BHK", "📍 Locations", "💰 Budget plans"];

export default function SairaChat() {
  const [open, setOpen]       = useState(false);
  const [input, setInput]     = useState("");
  const [step, setStep]       = useState("project"); // project → name → phone → done
  const [typing, setTyping]   = useState(false);
  const [showChips, setShowChips] = useState(true);

  const [customer, setCustomer] = useState({ project: "", name: "", phone: "" });

  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi 👋 I'm Saira from Elite Nesting." },
    { sender: "bot", text: "How can I help you find your dream home today? 🏠" },
  ]);

  const bottomRef = useRef(null);

  /* ── auto-scroll to bottom whenever messages or typing changes ── */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  /* ── helper: show typing indicator then append bot message ── */
  const addBotMessage = (text, delay = 900) => {
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [...prev, { sender: "bot", text }]);
    }, delay);
  };

  /* ── chip tap → send that chip label as the user's message ── */
  const handleChip = (label) => {
    setShowChips(false);
    handleSend(label);
  };

  /* ── core send logic ── */
  const handleSend = (override) => {
    const text = (override ?? input).trim();
    if (!text) return;

    setMessages((prev) => [...prev, { sender: "user", text }]);
    setInput("");
    setShowChips(false);

    if (step === "project") {
      setCustomer((prev) => ({ ...prev, project: text }));
      setStep("name");
      addBotMessage("Wonderful! 😊");
      setTimeout(() => addBotMessage("May I know your name?"), 1200);
      return;
    }

    if (step === "name") {
      setCustomer((prev) => ({ ...prev, name: text }));
      setStep("phone");
      addBotMessage(`Nice to meet you, ${text}! 😊`);
      setTimeout(() => addBotMessage("Please enter your 10-digit mobile number."), 1200);
      return;
    }

    if (step === "phone") {
      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneRegex.test(text)) {
        addBotMessage("Please enter a valid 10-digit Indian mobile number.");
        return;
      }
      setCustomer((prev) => ({ ...prev, phone: text }));
      setStep("done");
      addBotMessage("Perfect! 🎉");
      setTimeout(
        () => addBotMessage("Click the button below to send your enquiry to Elite Nesting on WhatsApp."),
        1200
      );
      return;
    }
  };

  /* ── open WhatsApp with pre-filled message ── */
  const sendWhatsApp = () => {
    const msg = `🏠 *New Website Enquiry*

*Project Details:*
${customer.project}

*Customer Name:*
${customer.name}

*Mobile Number:*
${customer.phone}

Sent from Elite Nesting Website`;

    window.open(
      `https://wa.me/919037216707?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
  };

  const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <>
      {/* ── FLOATING TOGGLE BUTTON ──
          FIX 1: toggle-avatar fills the full 64×64 circle (no padding, overflow hidden) */}
      <button
        className="chat-toggle"
        onClick={() => setOpen(!open)}
        aria-label="Open chat"
      >
        <img src="/bot.png" alt="Chat with Saira" className="toggle-avatar" />
      </button>

      {open && (
        <div className="saira-chat" role="dialog" aria-label="Saira Chat">

          {/* ── HEADER ──
              FIX 2: no online-dot span, no header-bar strip */}
          <div className="chat-header">
            <div className="chat-header-inner">

              <div className="chat-profile">
                {/* Avatar ring — image fills it fully */}
                <div className="avatar-ring">
                  <img src="/bot.png" alt="Saira" />
                  {/* online-dot REMOVED */}
                </div>

                <div className="chat-profile-text">
                  <h3>Saira</h3>
                  {/* FIX 2: only plain text "Online · Elite Nesting Assistant", no green dot element */}
                  <div className="chat-status">
                    <span>Online · Elite Nesting Assistant</span>
                  </div>
                </div>
              </div>

              <button
                className="close-btn"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
              >
                ✕
              </button>
            </div>
            {/* header-bar REMOVED */}
          </div>

          {/* ── CHAT BODY ──
              FIX 3: parent has fixed height (580px), this has flex:1 + overflow-y:auto → scrollable */}
          <div className="chat-body">

            <div className="date-pill"><span>Today</span></div>

            {messages.map((msg, i) => (
              <div key={i} className={`message-row ${msg.sender}`}>

                {msg.sender === "bot" && <BotAvatar />}

                <div className="msg-group">
                  <div className={`message ${msg.sender}`}>
                    {msg.text}
                  </div>
                  {/* Timestamp on the last message only */}
                  {i === messages.length - 1 && (
                    <div className="msg-time">{now}</div>
                  )}
                </div>

              </div>
            ))}

            {/* Quick-reply chips — only at the start before any user input */}
            {showChips && step === "project" && (
              <div className="quick-chips">
                {CHIPS.map((chip) => (
                  <button key={chip} className="chip" onClick={() => handleChip(chip)}>
                    {chip}
                  </button>
                ))}
              </div>
            )}

            {/* Typing indicator */}
            {typing && (
              <div className="message-row bot">
                <BotAvatar />
                <div className="message bot typing">
                  Saira is typing
                  <div className="dot-anim">
                    <span /><span /><span />
                  </div>
                </div>
              </div>
            )}

            {/* Scroll anchor */}
            <div ref={bottomRef} />
          </div>

          {/* ── ENQUIRY SUMMARY — shown above footer at "done" step ── */}
          {step === "done" && (
            <div className="enquiry-summary">
              <div className="enquiry-label">
                <span>🎉 Enquiry ready to send!</span>
              </div>
              <div className="enquiry-card">
                <div><strong>Project:</strong> {customer.project}</div>
                <div><strong>Name:</strong>    {customer.name}</div>
                <div><strong>Phone:</strong>   {customer.phone}</div>
              </div>
            </div>
          )}

          {/* ── INPUT BAR or WHATSAPP FOOTER ── */}
          {step !== "done" ? (

            <div className="chat-input">
              <button className="attach-btn" aria-label="Attach file">
                <AttachIcon />
              </button>

              <input
                type={step === "phone" ? "tel" : "text"}
                value={input}
                placeholder={
                  step === "project" ? "Which project are you interested in?"
                  : step === "name"  ? "Enter your name…"
                  :                    "Enter your mobile number…"
                }
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />

              <button className="send-btn" onClick={() => handleSend()} aria-label="Send">
                <SendIcon />
              </button>
            </div>

          ) : (

            <div className="chat-footer">
              <button className="whatsapp-btn" onClick={sendWhatsApp}>
                <WhatsAppIcon />
                Send Enquiry on WhatsApp
              </button>
              <div className="footer-note">🔒 Your info is safe with us</div>
            </div>

          )}

        </div>
      )}
    </>
  );
}
