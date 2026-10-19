"use client";

import { useState } from "react";
import { SITE } from "@/lib/constants";
import { X } from "lucide-react";

export default function WhatsAppFloat() {
  const [tooltip, setTooltip] = useState(true);

  const href = `https://wa.me/${SITE.whatsapp}?text=Olá!%20Gostaria%20de%20falar%20com%20a%20Empilhatec.`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      {tooltip && (
        <div className="flex items-center gap-2 bg-white shadow-lg rounded-full px-4 py-2 text-sm font-medium text-[#1C1C1E] border border-gray-100">
          Entre em contato
          <button
            onClick={() => setTooltip(false)}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Fechar"
          >
            <X size={14} />
          </button>
        </div>
      )}
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 shadow-lg transition-all hover:scale-110 drop-shadow-lg"
        aria-label="WhatsApp"
      >
        <svg viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg" className="w-14 h-14">
          <circle cx="28" cy="28" r="28" fill="#25D366"/>
          <path fill="white" d="M28 10.5C18.34 10.5 10.5 18.34 10.5 28c0 3.07.82 5.95 2.24 8.45L10.5 45.5l9.3-2.21A17.4 17.4 0 0 0 28 45.5c9.66 0 17.5-7.84 17.5-17.5S37.66 10.5 28 10.5Zm0 32.08a14.5 14.5 0 0 1-7.4-2.03l-.53-.32-5.52 1.31 1.34-5.38-.35-.55A14.44 14.44 0 0 1 13.5 28c0-7.99 6.51-14.5 14.5-14.5S42.5 20.01 42.5 28 35.99 42.58 28 42.58Zm7.95-10.83c-.43-.22-2.57-1.27-2.97-1.41-.4-.15-.69-.22-.98.22-.29.43-1.12 1.41-1.37 1.7-.25.29-.51.33-.94.11-.43-.22-1.82-.67-3.47-2.14-1.28-1.14-2.15-2.55-2.4-2.98-.25-.43-.03-.66.19-.88.2-.19.43-.51.65-.76.22-.25.29-.43.43-.72.15-.29.07-.54-.04-.76-.11-.22-.98-2.36-1.34-3.23-.35-.85-.71-.73-.98-.74h-.84c-.29 0-.76.11-1.16.54-.4.43-1.52 1.49-1.52 3.62s1.56 4.2 1.78 4.49c.22.29 3.06 4.67 7.41 6.55 1.04.45 1.85.71 2.48.91.04.01.08.02.12.03.6.19 1.15.16 1.58.1.48-.07 1.48-.6 1.69-1.19.21-.58.21-1.08.14-1.19-.06-.1-.25-.16-.53-.29Z"/>
        </svg>
      </a>
    </div>
  );
}
