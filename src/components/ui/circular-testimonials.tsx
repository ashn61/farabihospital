"use client";
import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

/** How long a slide stays up before autoplay advances. */
const AUTOPLAY_INTERVAL_MS = 5000;
/**
 * Budget for revealing a quote word-by-word. Must stay comfortably under
 * AUTOPLAY_INTERVAL_MS, or a long announcement rotates away mid-reveal and its
 * ending is never readable.
 */
const QUOTE_REVEAL_BUDGET_S = 1.6;

interface Testimonial {
  quote: string;
  name: string;
  designation: string;
  src: string;
}

interface Colors {
  name?: string;
  designation?: string;
  testimony?: string;
  arrowBackground?: string;
  arrowForeground?: string;
  arrowHoverBackground?: string;
}

interface FontSizes {
  name?: string;
  designation?: string;
  quote?: string;
}

interface CircularTestimonialsProps {
  testimonials: Testimonial[];
  autoplay?: boolean;
  colors?: Colors;
  fontSizes?: FontSizes;
}

function calculateGap(width: number) {
  const minWidth = 1024;
  const maxWidth = 1456;
  const minGap = 60;
  const maxGap = 86;
  if (width <= minWidth) return minGap;
  if (width >= maxWidth)
    return Math.max(minGap, maxGap + 0.06018 * (width - maxWidth));
  return minGap + (maxGap - minGap) * ((width - minWidth) / (maxWidth - minWidth));
}

export const CircularTestimonials = ({
  testimonials,
  autoplay = true,
  colors = {},
  fontSizes = {},
}: CircularTestimonialsProps) => {
  // Color & font config
  const colorName = colors.name ?? "#000";
  const colorDesignation = colors.designation ?? "#6b7280";
  const colorTestimony = colors.testimony ?? "#4b5563";
  const colorArrowBg = colors.arrowBackground ?? "#141414";
  const colorArrowFg = colors.arrowForeground ?? "#f1f1f7";
  const colorArrowHoverBg = colors.arrowHoverBackground ?? "#00a6fb";
  const fontSizeName = fontSizes.name ?? "1.5rem";
  const fontSizeDesignation = fontSizes.designation ?? "0.925rem";
  const fontSizeQuote = fontSizes.quote ?? "1.125rem";

  // State
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoverPrev, setHoverPrev] = useState(false);
  const [hoverNext, setHoverNext] = useState(false);
  const [containerWidth, setContainerWidth] = useState(1200);

  const imageContainerRef = useRef<HTMLDivElement>(null);
  const autoplayIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const testimonialsLength = useMemo(() => testimonials ? testimonials.length : 0, [testimonials]);
  const activeTestimonial = useMemo(
    () => testimonials && testimonials.length > 0 ? testimonials[activeIndex] : null,
    [activeIndex, testimonials]
  );

  // Responsive gap calculation
  useEffect(() => {
    function handleResize() {
      if (imageContainerRef.current) {
        setContainerWidth(imageContainerRef.current.offsetWidth);
      }
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Autoplay
  useEffect(() => {
    if (autoplay && testimonialsLength > 0) {
      autoplayIntervalRef.current = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % testimonialsLength);
      }, AUTOPLAY_INTERVAL_MS);
    }
    return () => {
      if (autoplayIntervalRef.current) clearInterval(autoplayIntervalRef.current);
    };
  }, [autoplay, testimonialsLength]);

  // Navigation handlers
  const handleNext = useCallback(() => {
    if (testimonialsLength > 0) {
      setActiveIndex((prev) => (prev + 1) % testimonialsLength);
    }
    if (autoplayIntervalRef.current) clearInterval(autoplayIntervalRef.current);
  }, [testimonialsLength]);
  const handlePrev = useCallback(() => {
    if (testimonialsLength > 0) {
      setActiveIndex((prev) => (prev - 1 + testimonialsLength) % testimonialsLength);
    }
    if (autoplayIntervalRef.current) clearInterval(autoplayIntervalRef.current);
  }, [testimonialsLength]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
    // eslint-disable-next-line
  }, [activeIndex, testimonialsLength]);

  // Compute transforms for each image (always show 3: left, center, right)
  function getImageStyle(index: number): React.CSSProperties {
    if (testimonialsLength === 0) return {};
    const gap = calculateGap(containerWidth);
    const maxStickUp = gap * 0.8;
    const isActive = index === activeIndex;
    const isLeft = (activeIndex - 1 + testimonialsLength) % testimonialsLength === index;
    const isRight = (activeIndex + 1) % testimonialsLength === index;
    if (isActive) {
      return {
        zIndex: 3,
        opacity: 1,
        pointerEvents: "auto",
        transform: `translateX(0px) translateY(0px) scale(1) rotateY(0deg)`,
        transition: "all 0.8s cubic-bezier(.4,2,.3,1)",
      };
    }
    if (isLeft) {
      return {
        zIndex: 2,
        opacity: 1,
        pointerEvents: "auto",
        transform: `translateX(-${gap}px) translateY(-${maxStickUp}px) scale(0.85) rotateY(15deg)`,
        transition: "all 0.8s cubic-bezier(.4,2,.3,1)",
      };
    }
    if (isRight) {
      return {
        zIndex: 2,
        opacity: 1,
        pointerEvents: "auto",
        transform: `translateX(${gap}px) translateY(-${maxStickUp}px) scale(0.85) rotateY(-15deg)`,
        transition: "all 0.8s cubic-bezier(.4,2,.3,1)",
      };
    }
    // Hide all other images
    return {
      zIndex: 1,
      opacity: 0,
      pointerEvents: "none",
      transform: `translateX(0px) translateY(0px) scale(0.5) rotateY(0deg)`,
      transition: "all 0.8s cubic-bezier(.4,2,.3,1)",
    };
  }

  // Framer Motion variants for quote.
  // Keep the y translate: the per-word spans below inherit this parent's
  // variant labels, and dropping y here leaves them stuck at opacity 0.
  const quoteVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  // Announcement bodies range from ~130 to ~1500 characters. At a flat 0.025s
  // per word the longest one's last word landed at 5.6s — past the 5s autoplay
  // rotation, so its ending was never seen. Spread the reveal over a fixed
  // budget instead: short quotes keep the snappy per-word feel, long ones
  // always finish well inside the window.
  const quoteWords = activeTestimonial?.quote.split(" ") ?? [];
  const wordStagger = Math.min(0.025, QUOTE_REVEAL_BUDGET_S / Math.max(quoteWords.length, 1));

  if (!testimonials || testimonials.length === 0 || !activeTestimonial) {
    return (
      <div className="w-full max-w-4xl p-8 text-center glass-panel border rounded-3xl">
        <p className="text-sm font-black text-slate-400 uppercase tracking-widest">
          Haber veya duyuru bulunmamaktadır.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full p-4 sm:p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 sm:gap-16 md:items-start">
        {/* Images */}
        <div
          className="relative w-full h-[18rem] sm:h-[26rem] [perspective:1000px]"
          ref={imageContainerRef}
        >
          {testimonials.map((testimonial, index) => (
            <img
              key={`${testimonial.src}-${index}`}
              src={testimonial.src}
              alt={testimonial.name}
              className="absolute inset-0 w-full h-full object-cover rounded-3xl shadow-lg border border-neutral-200/20"
              data-index={index}
              style={getImageStyle(index)}
            />
          ))}
        </div>
        {/* Content — fixed height matching the image so every slide is the same
            size. Announcement bodies range from ~130 to ~1500 characters, so
            without this the box resizes on every rotation; long ones scroll. */}
        <div className="flex flex-col md:h-[26rem]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              variants={quoteVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="flex-1 min-h-0 flex flex-col space-y-4"
            >
              <div>
                <h3
                  className="font-bold tracking-tight"
                  style={{ color: colorName, fontSize: fontSizeName }}
                >
                  {activeTestimonial.name}
                </h3>
                <p
                  className="font-semibold mt-1"
                  style={{ color: colorDesignation, fontSize: fontSizeDesignation }}
                >
                  {activeTestimonial.designation}
                </p>
              </div>
              <motion.p
                tabIndex={0}
                role="region"
                aria-label={activeTestimonial.name}
                className="leading-relaxed font-semibold flex-1 min-h-0 overflow-y-auto pr-3"
                style={{ color: colorTestimony, fontSize: fontSizeQuote }}
              >
                {quoteWords.map((word, i) => (
                  <motion.span
                    key={i}
                    initial={{
                      filter: "blur(10px)",
                      opacity: 0,
                      y: 5,
                    }}
                    animate={{
                      filter: "blur(0px)",
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.22,
                      ease: "easeInOut",
                      delay: i * wordStagger,
                    }}
                    style={{ display: "inline-block" }}
                  >
                    {word}&nbsp;
                  </motion.span>
                ))}
              </motion.p>
            </motion.div>
          </AnimatePresence>
          <div className="flex gap-4 pt-8 shrink-0">
            <button
              className="w-11 h-11 rounded-full flex items-center justify-center cursor-pointer transition-colors duration-300 border-none outline-none shadow-sm hover:scale-105 active:scale-95"
              onClick={handlePrev}
              style={{
                backgroundColor: hoverPrev ? colorArrowHoverBg : colorArrowBg,
              }}
              onMouseEnter={() => setHoverPrev(true)}
              onMouseLeave={() => setHoverPrev(false)}
              aria-label="Previous testimonial"
            >
              <FaArrowLeft size={18} color={colorArrowFg} />
            </button>
            <button
              className="w-11 h-11 rounded-full flex items-center justify-center cursor-pointer transition-colors duration-300 border-none outline-none shadow-sm hover:scale-105 active:scale-95"
              onClick={handleNext}
              style={{
                backgroundColor: hoverNext ? colorArrowHoverBg : colorArrowBg,
              }}
              onMouseEnter={() => setHoverNext(true)}
              onMouseLeave={() => setHoverNext(false)}
              aria-label="Next testimonial"
            >
              <FaArrowRight size={18} color={colorArrowFg} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CircularTestimonials;
