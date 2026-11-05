const BRANDS = [
  { name: "STILL", note: "Representante autorizado" },
  { name: "Linde", note: "Representante autorizado" },
  { name: "Baoli", note: "KION Group" },
  { name: "Skyjack", note: "Plataformas elevatórias" },
];

export default function BrandsBar() {
  return (
    <section className="border-b border-gray-200 bg-white" aria-label="Marcas que representamos">
      <div className="site-container py-9">
        <p className="mb-6 text-center text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">
          Marcas que representamos
        </p>
        <ul className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {BRANDS.map((b) => (
            <li key={b.name} className="text-center">
              <p className="text-3xl font-extrabold uppercase tracking-[0.12em] text-[#1C1C1E] sm:text-4xl">{b.name}</p>
              <p className="mt-1 text-xs text-gray-500">{b.note}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
