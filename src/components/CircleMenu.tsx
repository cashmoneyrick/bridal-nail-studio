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

const ITEM_SIZE = 44;
const TRIGGER_SIZE = 52;
const TRIGGER_SIZE_LG = 56;
const RADIUS = 85;
const RADIUS_LG = 95;
const OPEN_STAGGER = 0.06;
const CLOSE_STAGGER = 0.04;

/* ─── Geometry ───────────────────────────────────────────────── */

/** Quarter-arc from 180° (left) to 90° (up) */
const pointOnArc = (index: number, totalItems: number, radius: number) => {
  const startAngle = 180;
  const endAngle = 90;
  const step = totalItems > 1 ? (startAngle - endAngle) / (totalItems - 1) : 0;
  const angleDeg = startAngle - index * step;
  const angleRad = (angleDeg * Math.PI) / 180;
  return {
    x: Math.cos(angleRad) * radius,
    y: -Math.sin(angleRad) * radius,
  };
};

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

  // Responsive radius
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const radius = isDesktop ? RADIUS_LG : RADIUS;

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
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className="fixed bottom-20 right-5 lg:bottom-6 lg:right-6 z-50"
    >
      {/* ─── Menu Items ─────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen &&
          items.map((item, i) => {
            const { x, y } = pointOnArc(i, items.length, radius);

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
                className="absolute bottom-0 right-0 group flex items-center gap-2"
              >
                {/* Tooltip label */}
                <motion.span
                  initial={{ opacity: 0, x: 5 }}
                  animate={{
                    opacity: 1,
                    x: 0,
                    transition: { delay: i * OPEN_STAGGER + 0.15 },
                  }}
                  exit={{ opacity: 0 }}
                  className="pointer-events-none whitespace-nowrap font-studio-body
                    text-[10px] lg:text-[11px] font-medium tracking-wide uppercase
                    bg-white/95 text-foreground/70 px-2.5 py-1 rounded-full
                    shadow-sm border border-border/20
                    lg:opacity-0 lg:group-hover:opacity-100 lg:transition-opacity lg:duration-200"
                >
                  {item.label}
                </motion.span>

                {/* Icon button */}
                <motion.button
                  whileHover={{
                    scale: 1.12,
                    transition: { duration: 0.1, delay: 0 },
                  }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleItemClick(item.id)}
                  className="relative flex items-center justify-center rounded-full border border-border/20"
                  style={{
                    width: ITEM_SIZE,
                    height: ITEM_SIZE,
                    background: "#FDFAF6",
                    boxShadow:
                      "0 2px 12px -2px rgba(90,82,74,0.15), 0 1px 3px rgba(90,82,74,0.06)",
                  }}
                  aria-label={item.label}
                >
                  <item.icon
                    className="w-[18px] h-[18px]"
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
          width: isDesktop ? TRIGGER_SIZE_LG : TRIGGER_SIZE,
          height: isDesktop ? TRIGGER_SIZE_LG : TRIGGER_SIZE,
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
            className="w-[22px] h-[22px] lg:w-6 lg:h-6"
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
    </motion.div>
  );
};

export default CircleMenu;
