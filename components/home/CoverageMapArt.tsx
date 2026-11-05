"use client";

import { useRef, useSyncExternalStore } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

// camadas geradas por scripts/home/mapa-camadas.mjs a partir da arte em brand_assets (1200 × 1180)
const camada = (nome: string) => `/images/home/mapa-${nome}.webp`;
const SIZES = "(min-width: 704px) 40rem, 100vw";
/** Centro de AM/RR (crescem a partir dele) e posição do ponto de Manaus, em % da arte. */
const ORIGEM_AM_RR = "33.64% 22.3%";
const MANAUS = { left: "43.23%", top: "22.84%" };

function Camada({ nome }: { nome: string }) {
  return <Image src={camada(nome)} alt="" fill sizes={SIZES} quality={90} />;
}

// Preferência "reduzir movimento". O servidor não a conhece: a hidratação usa "sem preferência", para o HTML bater,
// e o React troca para o mapa parado logo depois, se for o caso (useReducedMotion já leria no primeiro render).
const MENOS_MOVIMENTO = "(prefers-reduced-motion: reduce)";
function assinarMenosMovimento(avisar: () => void) {
  const consulta = window.matchMedia(MENOS_MOVIMENTO);
  consulta.addEventListener("change", avisar);
  return () => consulta.removeEventListener("change", avisar);
}
const prefereMenosMovimento = () => window.matchMedia(MENOS_MOVIMENTO).matches;

/**
 * Mapa de atuação que reage à rolagem: o Brasil começa todo cinza e, conforme a seção sobe na tela, o Amazonas e
 * Roraima acendem em laranja, crescem com sombra, o resto do país esmaece e Manaus ganha um pulso.
 * Voltando a rolagem, o efeito volta junto. Quem pede menos movimento vê o mapa pronto, parado.
 */
export default function CoverageMapArt() {
  const ref = useRef<HTMLDivElement>(null);
  const reduzir = useSyncExternalStore(assinarMenosMovimento, prefereMenosMovimento, () => false);
  // 0 quando o topo do mapa entra pela base da tela; 1 quando o centro do mapa chega a 55% da altura da tela
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center 0.55"] });
  const cor = useTransform(scrollYProgress, [0.1, 0.5], [0, 1]);
  const destaque = useTransform(scrollYProgress, [0.35, 0.85], [0, 1]);
  const escala = useTransform(destaque, [0, 1], [1, 1.05]);
  const resto = useTransform(destaque, [0, 1], [1, 0.6]);
  const pulso = useTransform(scrollYProgress, [0.85, 1], [0, 1]);

  return (
    <div
      ref={ref}
      role="img"
      aria-label="Mapa do Brasil com o Amazonas e Roraima em destaque e a sede da Empilhatec em Manaus"
      className="relative mx-auto aspect-[1200/1180] w-full max-w-[40rem]"
    >
      {reduzir ? (
        // a arte original, sem animação
        ["base", "am-rr", "rotulo", "ponto"].map((nome) => (
          <div key={nome} className="absolute inset-0">
            <Camada nome={nome} />
          </div>
        ))
      ) : (
        <>
          <motion.div className="absolute inset-0" style={{ opacity: resto }}>
            <Camada nome="base" />
          </motion.div>
          <motion.div className="absolute inset-0" style={{ opacity: destaque }}>
            <Camada nome="sombra" />
          </motion.div>
          <motion.div className="absolute inset-0" style={{ opacity: cor, scale: escala, transformOrigin: ORIGEM_AM_RR }}>
            <Camada nome="am-rr" />
          </motion.div>
          <motion.div className="absolute inset-0" style={{ opacity: cor }}>
            <Camada nome="rotulo" />
          </motion.div>
          <div className="absolute inset-0">
            <Camada nome="ponto" />
          </div>
          {/* pulso em Manaus: dois anéis brancos defasados saindo do ponto (1,5% da largura = o diâmetro dele) */}
          <motion.span
            className="absolute aspect-square w-[1.5%] -translate-x-1/2 -translate-y-1/2"
            style={{ ...MANAUS, opacity: pulso }}
            aria-hidden
          >
            <span className="map-pulse absolute inset-0 rounded-full border-2 border-white" />
            <span className="map-pulse absolute inset-0 rounded-full border-2 border-white [animation-delay:1s]" />
          </motion.span>
        </>
      )}
    </div>
  );
}
