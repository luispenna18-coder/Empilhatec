import Image from "next/image";
import Link from "next/link";
import { type Product } from "@/lib/products";

export default function MachineCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/maquinas/${product.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-[#E85A00]/40 hover:shadow-xl"
    >
      <div className="relative aspect-[4/3] border-b border-gray-100 bg-white">
        <Image
          src={product.image}
          alt={`${product.brand} ${product.name}`}
          fill
          sizes="(min-width:1280px) 22vw, (min-width:768px) 33vw, 100vw"
          className="object-contain p-5 transition-transform duration-300 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#1C1C1E] shadow-sm">
          {product.brand}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-sans text-lg font-bold text-[#1C1C1E]">{product.name}</h3>

        <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
          <div>
            <dt className="text-[11px] uppercase tracking-wide text-gray-400">Capacidade</dt>
            <dd className="font-semibold text-[#1C1C1E]">{product.capacity}</dd>
          </div>
          {product.liftHeight && (
            <div>
              <dt className="text-[11px] uppercase tracking-wide text-gray-400">Elevação</dt>
              <dd className="font-semibold text-[#1C1C1E]">{product.liftHeight}</dd>
            </div>
          )}
        </dl>

        <div className="mb-auto mt-4 flex flex-wrap gap-2">
          {product.energy && (
            <span className="rounded bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">{product.energy}</span>
          )}
          {product.available?.includes("locacao") && (
            <span className="rounded bg-[#E85A00]/10 px-2.5 py-1 text-xs font-semibold text-[#E85A00]">Locação</span>
          )}
          {product.available?.includes("venda") && (
            <span className="rounded bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">Venda</span>
          )}
        </div>

        <span className="mt-5 text-sm font-semibold text-[#E85A00] group-hover:underline">Ver detalhes →</span>
      </div>
    </Link>
  );
}
