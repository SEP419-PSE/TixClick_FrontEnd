"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";
import { Ticket } from "lucide-react";
import { Button } from "../ui/button";

export default function HeroSection() {
  useEffect(() => {
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
    });
  }, []);

  return (
    <section className="relative h-[400px] flex items-center justify-center bg-[#ff8a00] text-white p-8 overflow-hidden">
      {/* Light glowing background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.2),_transparent)] animate-pulse" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center max-w-2xl z-10"
      >
        <motion.h1
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl font-extrabold mb-6 leading-tight text-glow-orange"
        >
          Đặt vé sự kiện dễ dàng, nhanh chóng và an toàn
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="text-lg mb-8"
        >
          Khám phá các sự kiện hot nhất và mua vé chỉ với vài cú click.
        </motion.p>

        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
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
