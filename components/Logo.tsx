import Image from "next/image";
import Link from "next/link";

/**
 * Logo do site. `marca="x"` mostra a logo Empilhatec-X Locadora (páginas da Empilhatex), na versão branca
 * para a barra escura do topo. A logo da Empilhatec foi extraída do Instagram oficial.
 */
export default function Logo({
  variant = "dark",
  marca = "empilhatec",
}: {
  variant?: "dark" | "light";
  marca?: "empilhatec" | "x";
}) {
  const x = marca === "x";
  return (
    <Link
      href="/"
      aria-label="Empilhatec Empilhadeiras da Amazônia, página inicial"
      className="flex flex-shrink-0 items-center"
    >
      {x ? (
        <Image
          src="/images/empilhatex/logo-empilhatex-branca.png"
          alt="Empilhatec-X Locadora"
          width={1600}
          height={366}
          priority
          className="h-11 w-auto lg:h-16"
        />
      ) : (
        <Image
          src="/images/logo-empilhatec.png"
          alt="Empilhatec Empilhadeiras da Amazônia"
          width={664}
          height={522}
          priority
          className={variant === "light" ? "h-20 w-auto" : "h-14 w-auto lg:h-[4.5rem]"}
        />
      )}
    </Link>
  );
}
