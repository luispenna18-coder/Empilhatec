import Image from "next/image";
import Link from "next/link";

/** Logo da Empilhatec. Arquivo extraído do Instagram oficial; trocar por versão vetorial quando o cliente enviar. */
export default function Logo({ variant = "dark" }: { variant?: "dark" | "light" }) {
  return (
    <Link href="/" aria-label="Empilhatec Empilhadeiras da Amazônia, página inicial" className="flex flex-shrink-0 items-center">
      <Image
        src="/images/logo-empilhatec.png"
        alt="Empilhatec Empilhadeiras da Amazônia"
        width={664}
        height={522}
        priority
        className={variant === "light" ? "h-20 w-auto" : "h-11 w-auto lg:h-14"}
      />
    </Link>
  );
}
