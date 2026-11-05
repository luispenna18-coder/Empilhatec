"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const STEPS = [
  { n: "01", title: "Preencha o formulário" },
  { n: "02", title: "Proposta em 24h" },
  { n: "03", title: "Operação rodando" },
];

export default function Steps() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(-1);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          STEPS.forEach((_, i) => {
            setTimeout(() => setActive(i), i * 2000);
          });
        }
      },
      { threshold: 0.4 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="flex flex-col mb-8">
      {STEPS.map((step, i) => (
        <div key={step.n} className="flex gap-4">

          {/* Coluna esquerda: círculo + linha vertical */}
          <div className="flex flex-col items-center">
            <motion.div
              className="w-10 h-10 rounded-full border-2 flex items-center justify-center shrink-0"
              animate={
                active >= i
                  ? { borderColor: "#E85A00", backgroundColor: "#E85A00" }
                  : { borderColor: "#E5E5E7", backgroundColor: "transparent" }
              }
              transition={{ duration: 1.6 }}
            >
              <motion.span
                className="text-xs font-bold"
                animate={active >= i ? { color: "#ffffff" } : { color: "#94A3B8" }}
                transition={{ duration: 0.3 }}
              >
                {step.n}
              </motion.span>
            </motion.div>

            {i < STEPS.length - 1 && (
              <div className="w-px flex-1 my-1 bg-gray-200 overflow-hidden relative" style={{ minHeight: 36 }}>
                <motion.div
                  className="absolute top-0 left-0 w-full bg-[#E85A00]"
                  initial={{ height: "0%" }}
                  animate={active >= i + 1 ? { height: "100%" } : { height: "0%" }}
                  transition={{ duration: 1.4, delay: 0.3, ease: "easeInOut" }}
                />
                {active >= i + 1 && (
                  <motion.div
                    className="absolute bottom-0 left-1/2 -translate-x-1/2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.8 }}
                  >
                    <svg width="8" height="6" viewBox="0 0 8 6" fill="#E85A00">
                      <path d="M4 6L0 0h8z" />
                    </svg>
                  </motion.div>
                )}
              </div>
            )}
          </div>

          {/* Coluna direita: título */}
          <motion.div
            className="pb-8 pt-2"
            initial={{ opacity: 0, x: -10 }}
            animate={active >= i ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1.6, ease: "easeOut" }}
          >
            <p
              className="font-normal text-lg"
              style={{ color: active >= i ? "#1C1C1E" : "#A0AEC0" }}
            >
              {step.title}
            </p>
          </motion.div>

        </div>
      ))}
    </div>
  );
}
