import { useState, useEffect, useRef, useCallback } from "react";
import { X, Send, Mail, Trash2, Sparkles, Search, Heart, ShoppingBag, Paintbrush, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { logError } from "@/lib/logger";
import CircleMenu from "@/components/CircleMenu";
import type { CircleMenuItem } from "@/components/CircleMenu";
import { useMenuStore } from "@/stores/menuStore";
import { useCartStore } from "@/stores/cartStore";
import { useFavoritesStore } from "@/stores/favoritesStore";

/* ─── Types ──────────────────────────────────────────────────── */

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

/* ─── Constants ──────────────────────────────────────────────── */

const QUICK_REPLIES = [
  { label: "Shipping", message: "What are your shipping options and delivery times?" },
  { label: "How to Apply", message: "How do I apply press-on nails properly?" },
  { label: "Sizing Help", message: "How do I find my nail size?" },
  { label: "Returns", message: "What is your return policy?" },
];

const STORAGE_KEY = "yourprettysets-chat-history";
const HAS_OPENED_KEY = "yourprettysets-chat-opened";

const DEFAULT_MESSAGE: Message = {
  role: "assistant",
  content: "Hi! I'm here to help with any questions about YourPrettySets. What can I help you with?",
  timestamp: Date.now(),
};

const GRAIN_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`;

/* ─── Circle Menu Items (static base — badges injected at render) ── */

const CIRCLE_ITEMS_BASE: Omit<CircleMenuItem, "badge">[] = [
  { id: "search", label: "Search", icon: Search },
  { id: "favorites", label: "Favorites", icon: Heart },
  { id: "cart", label: "Cart", icon: ShoppingBag },
  { id: "chat", label: "Chat", icon: MessageCircle },
  { id: "create", label: "Create", icon: Paintbrush },
];

/* ─── Helpers ────────────────────────────────────────────────── */

const loadMessages = (): Message[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Backfill timestamps for old messages that don't have them
        return parsed.map((m: Message) => ({
          ...m,
          timestamp: m.timestamp || Date.now(),
        }));
      }
    }
  } catch (e) {
    logError("Failed to load chat history:", e);
  }
  return [DEFAULT_MESSAGE];
};

const relativeTime = (ts: number): string => {
  if (!ts || isNaN(ts)) return "";
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

const renderMarkdown = (text: string) => {
  const paragraphs = text.split(/\n\n/);
  return paragraphs.map((p, i) => {
    const parts = p.split(/(\*\*.*?\*\*)/g);
    const rendered = parts.map((part, j) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={j} className="font-semibold">{part.slice(2, -2)}</strong>;
      }
      return <span key={j}>{part}</span>;
    });
    return <p key={i} className={i > 0 ? "mt-1.5" : ""}>{rendered}</p>;
  });
};

/* ─── Animations ─────────────────────────────────────────────── */

const windowVariants = {
  hidden: { opacity: 0, scale: 0.92, y: 20 },
  visible: {
    opacity: 1, scale: 1, y: 0,
    transition: { type: "spring", stiffness: 400, damping: 30 },
  },
  exit: {
    opacity: 0, scale: 0.95, y: 12,
    transition: { duration: 0.15, ease: "easeIn" },
  },
};

const messageVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 500, damping: 35 } },
};

const chipVariants = {
  hidden: { opacity: 0, y: 4 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, type: "spring", stiffness: 500, damping: 35 },
  }),
};

/* ─── Typing Dots ────────────────────────────────────────────── */

const TypingDots = () => (
  <div className="flex items-center gap-1 px-4 py-3">
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40"
        style={{
          animation: `typing-fade 1.2s ease-in-out ${i * 0.2}s infinite`,
        }}
      />
    ))}
    <style>{`
      @keyframes typing-fade {
        0%, 60%, 100% { opacity: 0.3; transform: scale(0.85); }
        30% { opacity: 1; transform: scale(1); }
      }
    `}</style>
  </div>
);

/* ─── Auto-growing Textarea ──────────────────────────────────── */

const AutoTextarea = ({
  value,
  onChange,
  onSubmit,
  disabled,
  inputRef,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  disabled: boolean;
  inputRef: React.RefObject<HTMLTextAreaElement>;
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
    // auto-grow
    const el = e.target;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 72) + "px"; // 3 lines max ~72px
  };

  return (
    <textarea
      ref={inputRef}
      value={value}
      onChange={handleInput}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      rows={1}
      placeholder="Ask anything..."
      className="flex-1 bg-transparent border-0 outline-none resize-none font-studio-body text-sm text-foreground placeholder:text-muted-foreground/50 leading-snug py-2.5 px-1 max-h-[72px]"
      style={{ scrollbarWidth: "none" }}
    />
  );
};

/* ─── Main Component ─────────────────────────────────────────── */

const FaqChatbot = () => {
  const [isWheelOpen, setIsWheelOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(loadMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(() => loadMessages().length <= 1);
  const [hasOpened, setHasOpened] = useState(() => localStorage.getItem(HAS_OPENED_KEY) === "true");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null!);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const isMobileNavOpen = useMenuStore(state => state.isMobileNavOpen);
  const setSearchOpen = useMenuStore(state => state.setSearchOpen);
  const isOpen = useMenuStore(state => state.isChatOpen);
  const setIsOpen = useMenuStore(state => state.setChatOpen);
  const totalCartItems = useCartStore(state => state.getTotalItems());
  const favoritesCount = useFavoritesStore(state => state.items.length);

  // Inject live badge counts into menu items
  const circleItems: CircleMenuItem[] = CIRCLE_ITEMS_BASE.map((item) => ({
    ...item,
    badge: item.id === "cart" ? totalCartItems : item.id === "favorites" ? favoritesCount : undefined,
  }));

  // Persist messages
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen]);

  // Close FAB wheel when mobile nav opens
  useEffect(() => {
    if (isMobileNavOpen && isWheelOpen) {
      setIsWheelOpen(false);
    }
  }, [isMobileNavOpen, isWheelOpen]);

  // Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isOpen) setIsOpen(false);
        if (isWheelOpen) setIsWheelOpen(false);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, isWheelOpen]);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
    if (!hasOpened) {
      setHasOpened(true);
      localStorage.setItem(HAS_OPENED_KEY, "true");
    }
  }, [hasOpened]);

  const handleCircleAction = useCallback((id: string) => {
    setIsWheelOpen(false);
    switch (id) {
      case "chat":
        setTimeout(() => handleOpen(), 150);
        break;
      case "search":
        setTimeout(() => setSearchOpen(true), 150);
        break;
      case "favorites":
        navigate("/favorites");
        break;
      case "cart":
        navigate("/cart");
        break;
      case "create":
        navigate("/create");
        break;
    }
  }, [navigate, handleOpen, setSearchOpen]);

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    setShowQuickReplies(false);
    setInput("");
    // reset textarea height
    if (inputRef.current) inputRef.current.style.height = "auto";
    setMessages((prev) => [...prev, { role: "user", content: messageText, timestamp: Date.now() }]);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("faq-chat", {
        body: { message: messageText },
      });
      if (error) throw error;
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply, timestamp: Date.now() }]);
    } catch (error: unknown) {
      logError("Chat error:", error);
      toast({ title: "Couldn't send message", description: "Please try again in a moment.", variant: "destructive" });
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I'm having trouble right now. Please try again or email us at hello@yourprettysets.com", timestamp: Date.now() },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = () => sendMessage(input);

  const handleEscalate = () => {
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: "No problem! Our team is happy to help. You can reach us at:\n\n**hello@yourprettysets.com**\n\nWe typically respond within 24 hours.",
        timestamp: Date.now(),
      },
    ]);
    setShowQuickReplies(false);
  };

  const handleClearChat = () => {
    setMessages([{ ...DEFAULT_MESSAGE, timestamp: Date.now() }]);
    setShowQuickReplies(true);
  };

  return (
    <>
      {/* ─── Wheel Backdrop ──────────────────────────────────── */}
      <AnimatePresence>
        {isWheelOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.2 } }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-[6px]"
            onClick={() => setIsWheelOpen(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* ─── Circle Menu Navigation ────────────────────────────── */}
      <AnimatePresence>
        {!isOpen && !isMobileNavOpen && (
          <CircleMenu
            items={circleItems}
            isOpen={isWheelOpen}
            onToggle={() => setIsWheelOpen((prev) => !prev)}
            onAction={handleCircleAction}
            showBadge={!hasOpened && !isWheelOpen}
          />
        )}
      </AnimatePresence>

      {/* ─── Chat Window ─────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={windowVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed z-50 flex flex-col overflow-hidden rounded-2xl
              inset-x-3 bottom-3 h-[75vh] max-h-[600px]
              sm:inset-auto sm:bottom-6 sm:right-6 sm:w-[380px] sm:h-[540px]"
            style={{
              background: "#FDFAF6",
              border: "1px solid rgba(125,152,135,0.15)",
              boxShadow: "0 25px 60px -12px rgba(90,82,74,0.25), 0 4px 16px -4px rgba(90,82,74,0.1)",
              transformOrigin: "bottom right",
            }}
          >
            {/* Grain overlay */}
            <div
              className="absolute inset-0 z-[1] pointer-events-none opacity-[0.03]"
              style={{ backgroundImage: GRAIN_SVG }}
            />

            {/* ─── Header ────────────────────────────────────── */}
            <div className="relative z-10 flex items-center justify-between px-5 pt-4 pb-3 border-b border-border/30">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-primary/70" strokeWidth={1.8} />
                <div>
                  <h3 className="font-studio-display text-[17px] font-medium text-foreground leading-tight">
                    Chat with us
                  </h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ background: "#6B9E6F" }}
                    />
                    <span className="font-studio-body text-[11px] text-muted-foreground leading-none">
                      Online now
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={handleClearChat}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                  aria-label="Clear chat"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                  aria-label="Close chat"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* ─── Messages ──────────────────────────────────── */}
            <div
              ref={scrollContainerRef}
              className="relative z-10 flex-1 overflow-y-auto px-4 py-4"
              style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(0,0,0,0.08) transparent" }}
              aria-live="polite"
            >
              <div className="flex flex-col gap-3">
                {messages.map((msg, idx) => {
                  const isUser = msg.role === "user";
                  const prevMsg = messages[idx - 1];
                  const showTimestamp = idx === 0 || (msg.timestamp - (prevMsg?.timestamp || 0)) > 300000; // 5min gap

                  return (
                    <div key={idx}>
                      {showTimestamp && relativeTime(msg.timestamp) && (
                        <div className="text-center mb-3 mt-1">
                          <span className="text-[10px] text-muted-foreground/50 font-studio-body">
                            {relativeTime(msg.timestamp)}
                          </span>
                        </div>
                      )}
                      <motion.div
                        variants={messageVariants}
                        initial="hidden"
                        animate="visible"
                        className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[82%] px-4 py-2.5 font-studio-body text-[13.5px] leading-relaxed whitespace-pre-wrap ${
                            isUser
                              ? "bg-primary text-primary-foreground rounded-2xl rounded-br-sm"
                              : "rounded-2xl rounded-bl-sm"
                          }`}
                          style={!isUser ? { background: "#F0EDE8" } : undefined}
                        >
                          {isUser ? msg.content : renderMarkdown(msg.content)}
                        </div>
                      </motion.div>
                    </div>
                  );
                })}

                {/* Typing indicator */}
                {isLoading && (
                  <motion.div
                    variants={messageVariants}
                    initial="hidden"
                    animate="visible"
                    className="flex justify-start"
                  >
                    <div className="rounded-2xl rounded-bl-sm" style={{ background: "#F0EDE8" }}>
                      <TypingDots />
                    </div>
                  </motion.div>
                )}

                {/* Quick Replies */}
                {showQuickReplies && !isLoading && (
                  <div className="pt-1">
                    <p className="text-[10px] text-muted-foreground/50 font-studio-body uppercase tracking-widest mb-2.5">
                      Popular questions
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {QUICK_REPLIES.map((reply, idx) => (
                        <motion.button
                          key={idx}
                          custom={idx}
                          variants={chipVariants}
                          initial="hidden"
                          animate="visible"
                          onClick={() => sendMessage(reply.message)}
                          className="font-studio-body text-[11px] font-medium tracking-wide uppercase px-3.5 py-2 rounded-full border transition-colors"
                          style={{
                            borderColor: "rgba(133,153,135,0.25)",
                            color: "hsl(125 9% 45%)",
                          }}
                          onMouseEnter={(e) => {
                            (e.target as HTMLElement).style.background = "rgba(133,153,135,0.08)";
                          }}
                          onMouseLeave={(e) => {
                            (e.target as HTMLElement).style.background = "transparent";
                          }}
                        >
                          {reply.label}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* ─── Input Area ────────────────────────────────── */}
            <div className="relative z-10 px-3 pb-3">
              {/* Escalate link */}
              <button
                onClick={handleEscalate}
                className="w-full flex items-center justify-center gap-1.5 font-studio-body text-[11px] text-muted-foreground/60 hover:text-foreground py-1.5 mb-2 transition-colors"
              >
                <Mail className="w-3 h-3" />
                Email us instead
              </button>

              {/* Input container */}
              <div
                className="flex items-end gap-2 rounded-xl px-3"
                style={{ background: "#F0EDE8" }}
              >
                <AutoTextarea
                  value={input}
                  onChange={setInput}
                  onSubmit={handleSubmit}
                  disabled={isLoading}
                  inputRef={inputRef}
                />
                <button
                  onClick={handleSubmit}
                  disabled={isLoading || !input.trim()}
                  className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center mb-0.5 transition-all duration-200"
                  style={{
                    background: input.trim() ? "hsl(125 9% 56%)" : "transparent",
                    color: input.trim() ? "#fff" : "hsl(30 6% 60%)",
                  }}
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" style={{ transform: "translateX(0.5px)" }} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FaqChatbot;
