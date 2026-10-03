import Link from "next/link";

/**
 * Logotipo PROVISÓRIO em texto. O arquivo do logo (`/images/logo-empilhatec.png`) não está no
 * projeto; quando o cliente enviar, troque este componente por <Image src="/images/logo-empilhatec.png" />.
 */
export default function Logo({ variant = "dark" }: { variant?: "dark" | "light" }) {
  const text = variant === "light" ? "text-white" : "text-[#1C1C1E]";
  return (
    <Link href="/" aria-label="Empilhatec Empilhadeiras — página inicial" className="flex flex-shrink-0 flex-col leading-none">
      <span className={`font-sans text-xl font-extrabold tracking-[0.12em] ${text}`}>
        EMPILHA<span className="text-[#E85A00]">TEC</span>
      </span>
      <span className={`mt-1 text-[10px] font-semibold uppercase tracking-[0.22em] ${variant === "light" ? "text-white/60" : "text-gray-500"}`}>
        Empilhadeiras da Amazônia
      </span>
    </Link>
  );
}
