"use client";

import { useState } from "react";
import { CheckCircle } from "lucide-react";
import { SITE } from "@/lib/constants";

const input =
  "w-full bg-[#F5F5F7] border border-gray-200 rounded-lg text-[#1C1C1E] placeholder-gray-400 px-4 py-3 text-sm focus:outline-none focus:border-[#E85A00] focus:bg-white transition-colors";
const label = "block text-sm font-medium text-[#1C1C1E] mb-1.5";
const phoneOk = (v: string) => v.replace(/\D/g, "").length >= 10;

/** Formulário de pedido de peças. Hoje abre o WhatsApp com os dados; será trocado por envio de e-mail. */
export default function ServiceRequestForm() {
  const [sent, setSent] = useState(false);
  const [touched, setTouched] = useState(false);
  const [f, setF] = useState({ nome: "", empresa: "", telefone: "", maquina: "", serie: "", detalhe: "" });

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setF((p) => ({ ...p, [e.target.name]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!phoneOk(f.telefone)) return;
    const linhas = [
      "Olá! Quero solicitar uma peça.",
      "",
      `*Nome:* ${f.nome}`,
      `*Empresa:* ${f.empresa}`,
      `*Telefone:* ${f.telefone}`,
      `*Máquina (marca/modelo):* ${f.maquina}`,
      f.serie && `*Nº de série:* ${f.serie}`,
      `*Peça desejada:* ${f.detalhe}`,
    ];
    window.open(`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(linhas.filter(Boolean).join("\n"))}`, "_blank");
    setSent(true);
  };

  if (sent) {
    return (
      <div className="flex min-h-[360px] flex-col items-center justify-center gap-4 rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <CheckCircle size={52} className="text-[#E85A00]" />
        <h3 className="text-2xl font-bold text-[#1C1C1E]">Solicitação enviada!</h3>
        <p className="max-w-sm text-gray-500">O WhatsApp foi aberto com os seus dados. Nossa equipe retorna em seguida.</p>
        <button onClick={() => { setSent(false); setTouched(false); }} className="mt-1 text-sm text-[#E85A00] hover:underline">
          Fazer outra solicitação
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-col gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={label} htmlFor="sr-nome">Nome completo</label>
            <input id="sr-nome" name="nome" value={f.nome} onChange={onChange} required placeholder="João Silva" className={input} />
          </div>
          <div>
            <label className={label} htmlFor="sr-empresa">Empresa</label>
            <input id="sr-empresa" name="empresa" value={f.empresa} onChange={onChange} placeholder="Razão social" className={input} />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={label} htmlFor="sr-tel">Telefone <span className="text-[#E85A00]">*</span></label>
            <input
              id="sr-tel" name="telefone" value={f.telefone} onChange={onChange} required placeholder="(92) 9 0000-0000"
              className={`${input} ${touched && !phoneOk(f.telefone) ? "border-[#E85A00]" : ""}`}
            />
            {touched && !phoneOk(f.telefone) && <p className="mt-1.5 text-xs text-[#E85A00]">Informe um telefone válido com DDD.</p>}
          </div>
          <div>
            <label className={label} htmlFor="sr-maq">Máquina (marca e modelo) <span className="text-[#E85A00]">*</span></label>
            <input id="sr-maq" name="maquina" value={f.maquina} onChange={onChange} required placeholder="Ex.: STILL RX 20" className={input} />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={label} htmlFor="sr-serie">Número de série</label>
            <input id="sr-serie" name="serie" value={f.serie} onChange={onChange} placeholder="Está na placa da máquina" className={input} />
          </div>
        </div>

        <div>
          <label className={label} htmlFor="sr-det">
            Qual peça você precisa? <span className="text-[#E85A00]">*</span>
          </label>
          <textarea
            id="sr-det" name="detalhe" value={f.detalhe} onChange={onChange} required rows={4}
            placeholder="Nome da peça, código ou onde ela é usada na máquina"
            className={`${input} resize-y`}
          />
        </div>

        <button type="submit" className="w-full rounded-xl bg-[#E85A00] py-3.5 font-semibold text-white transition-colors hover:bg-[#C44A00]">
          Enviar solicitação →
        </button>
      </div>
    </form>
  );
}
