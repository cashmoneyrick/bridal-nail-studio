import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useAnimationControls } from "framer-motion";
import { Plus } from "lucide-react";

/* ─── Types ──────────────────────────────────────────────────── */

export interface CircleMenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{
    className?: string;
    strokeWidth?: number;
    style?: React.CSSProperties;
  }>;
}

interface CircleMenuProps {
  items: CircleMenuItem[];
  isOpen: boolean;
  onToggle: () => void;
  onAction: (id: string) => void;
  showBadge?: boolean;
}

/* ─── Constants ──────────────────────────────────────────────── */

const ITEM_SIZE = 52;
const ITEM_SIZE_LG = 46;
const TRIGGER_SIZE = 58;
const TRIGGER_SIZE_LG = 56;
const ITEM_GAP = 16;
const ITEM_GAP_LG = 14;
const OPEN_STAGGER = 0.06;
const CLOSE_STAGGER = 0.04;

/* ─── Geometry ───────────────────────────────────────────────── */

/** Vertical stack: items rise upward from the trigger */
const stackOffset = (index: number, triggerSize: number, itemSize: number, gap: number) => ({
  x: -(triggerSize - itemSize) / 2,
  y: -(itemSize + gap) * (index + 1),
});

/* ─── Component ──────────────────────────────────────────────── */

const CircleMenu = ({
  items,
  isOpen,
  onToggle,
  onAction,
  showBadge = false,
}: CircleMenuProps) => {
  const triggerControls = useAnimationControls();
  const itemsControls = useAnimationControls();

  // Responsive sizing
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const triggerSize = isDesktop ? TRIGGER_SIZE_LG : TRIGGER_SIZE;
  const itemSize = isDesktop ? ITEM_SIZE_LG : ITEM_SIZE;
  const itemGap = isDesktop ? ITEM_GAP_LG : ITEM_GAP;

  // Close with shake animation
  const handleClose = useCallback(async () => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!prefersReducedMotion) {
      await triggerControls.start({
        rotate: [0, -8, 8, -4, 4, 0],
        scale: [1, 1.15, 1],
        transition: { duration: 0.35, ease: "easeInOut" },
      });
    }

    onToggle();
  }, [onToggle, triggerControls]);

  const handleToggle = useCallback(() => {
    if (isOpen) {
      handleClose();
    } else {
      onToggle();
    }
  }, [isOpen, handleClose, onToggle]);

  const handleItemClick = useCallback(
    (id: string) => {
      onAction(id);
    },
    [onAction]
  );

  return (
    <div className="fixed bottom-20 right-5 lg:bottom-6 lg:right-6 z-50">
      {/* ─── Backdrop Glow ───────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="glow"
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 280,
              height: 280,
              right: -40,
              bottom: -40,
              background:
                "radial-gradient(circle, hsla(125,9%,56%,0.08) 0%, transparent 70%)",
              filter: "blur(20px)",
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>

      {/* ─── Menu Items ─────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen &&
          items.map((item, i) => {
            const { x, y } = stackOffset(i, triggerSize, itemSize, itemGap);

            return (
              <motion.div
                key={item.id}
                initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                animate={{
                  x,
                  y,
                  scale: 1,
                  opacity: 1,
                  transition: {
                    type: "spring",
                    stiffness: 400,
                    damping: 22,
                    delay: i * OPEN_STAGGER,
                  },
                }}
                exit={{
                  x: 0,
                  y: 0,
                  scale: 0,
                  opacity: 0,
                  transition: {
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                    delay: (items.length - 1 - i) * CLOSE_STAGGER,
                  },
                }}
                className="absolute bottom-0 right-0 group flex items-center gap-2.5"
              >
                {/* Editorial label */}
                <motion.span
                  initial={{ opacity: 0, x: 8 }}
                  animate={{
                    opacity: 1,
                    x: 0,
                    transition: {
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                      delay: i * OPEN_STAGGER + 0.15,
                    },
                  }}
                  exit={{ opacity: 0, x: 4, transition: { duration: 0.1 } }}
                  className="pointer-events-none whitespace-nowrap font-body
                    text-xs lg:text-xs font-medium tracking-wide text-foreground/70 px-3.5 py-1.5 lg:px-3 lg:py-1 rounded-full
                    shadow-sm border border-border/15
                    lg:opacity-0 lg:group-hover:opacity-100 lg:transition-opacity lg:duration-200"
                  style={{
                    background: "hsla(0,0%,100%,0.8)",
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
                  }}
                >
                  {item.label}
                </motion.span>

                {/* Frosted glass icon button */}
                <motion.button
                  whileHover={{
                    scale: 1.08,
                    y: -2,
                    transition: { type: "spring", stiffness: 400, damping: 15 },
                  }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => handleItemClick(item.id)}
                  className="relative flex items-center justify-center rounded-full"
                  style={{
                    width: itemSize,
                    height: itemSize,
                    background: "hsla(30,6%,97%,0.8)",
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
                    border: "1px solid hsla(30,6%,86%,0.3)",
                    boxShadow:
                      "0 2px 16px -2px rgba(90,82,74,0.12), 0 1px 4px rgba(90,82,74,0.06)",
                  }}
                  aria-label={item.label}
                >
                  <item.icon
                    className="w-5 h-5 lg:w-[18px] lg:h-[18px]"
                    strokeWidth={1.6}
                    style={{ color: "hsl(125 9% 50%)" }}
                  />
                </motion.button>
              </motion.div>
            );
          })}
      </AnimatePresence>

      {/* ─── Trigger Button ─────────────────────────────────── */}
      <motion.button
        animate={triggerControls}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={handleToggle}
        className="relative rounded-full flex items-center justify-center"
        style={{
          width: triggerSize,
          height: triggerSize,
          background: isOpen ? "hsl(125 9% 56%)" : "#F5F0EB",
          boxShadow:
            "0 4px 20px -2px rgba(90,82,74,0.2), 0 1px 4px rgba(90,82,74,0.08)",
          transition: "background 0.3s ease",
        }}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <Plus
            className="w-6 h-6 lg:w-6 lg:h-6"
            strokeWidth={2}
            style={{
              color: isOpen ? "#FDFAF6" : "hsl(125 9% 50%)",
              transition: "color 0.3s ease",
            }}
          />
        </motion.div>

        {/* Unread badge */}
        {showBadge && (
          <span
            className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white"
            style={{
              background: "#C26871",
              animation: "pulse 2s ease-in-out infinite",
            }}
          />
        )}
      </motion.button>
    </div>
  );
};

export default CircleMenu;
