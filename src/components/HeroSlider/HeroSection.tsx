import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";
import { Ticket } from "lucide-react";
import { Button } from "../ui/button";

export default function HeroSection() {
  const texts = ["Đặt vé sự kiện dễ dàng, nhanh chóng và an toàn"];
  const [displayedText, setDisplayedText] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
    });
  }, []);

  useEffect(() => {
    const currentText = texts[textIndex];
    const typingSpeed = isDeleting ? 30 : 60;

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setDisplayedText(currentText.slice(0, charIndex + 1));
        setCharIndex(charIndex + 1);

        if (charIndex === currentText.length) {
          setTimeout(() => setIsDeleting(true), 1500); // pause before delete
        }
      } else {
        setDisplayedText(currentText.slice(0, charIndex - 1));
        setCharIndex(charIndex - 1);

        if (charIndex === 0) {
          setIsDeleting(false);
          setTextIndex((prev) => (prev + 1) % texts.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, textIndex, texts]);

  return (
    <section className="relative h-screen flex items-center justify-center bg-[#ff8a00] text-white p-8 mb-8 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.2),_transparent)] animate-pulse" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center max-w-2xl z-10"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight text-glow-orange">
          {displayedText}
          <span className="animate-blink">|</span>
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.8 }}
          className="text-lg mb-8"
        >
          Khám phá các sự kiện hot nhất và mua vé chỉ với vài cú click.
        </motion.p>

        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 2.2 }}
        >
          <Button className="text-lg px-6 py-3 rounded-full bg-white text-[#ff8a00] hover:bg-[#fff4e5] font-semibold shadow-md transition-all duration-300 hover:shadow-orange-glow">
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="mr-2"
            >
              <Ticket className="w-5 h-5" />
            </motion.div>
            Khám phá sự kiện
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
