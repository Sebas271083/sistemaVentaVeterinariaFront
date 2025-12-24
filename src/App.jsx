import React, { useRef, useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;


// Componente reutilizable para animar al hacer scroll
function RevealOnScroll({ children, className = "" }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect(); // se anima una sola vez
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        } ${className}`}
    >
      {children}
    </div>
  );
}

function FloatingWhatsAppButton() {
  return (
    <a
      href="https://wa.me/54911XXXXXXXXX?text=Hola,%20quiero%20más%20información%20sobre%20el%20sistema%20veterinario"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-40"
    >
      <div className="relative">
        {/* círculo que late */}
        <div className="absolute inset-0 rounded-full bg-emerald-500/30 blur-md animate-ping" />
        {/* botón */}
        <div className="relative h-14 w-14 rounded-full bg-emerald-500 flex items-center justify-center shadow-xl shadow-emerald-500/40 hover:bg-emerald-400 transition">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7 text-slate-950"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M20.52 3.48A11.78 11.78 0 0012 0a11.94 11.94 0 00-10.4 17.94L0 24l6.25-1.63A11.9 11.9 0 0012 24h.01A11.94 11.94 0 0024 12a11.78 11.78 0 00-3.48-8.52zM12 21.3a9.3 9.3 0 01-4.74-1.3l-.34-.2-3.7.96.99-3.6-.22-.37A9.26 9.26 0 1121.3 12 9.3 9.3 0 0112 21.3zm5.09-6.95c-.28-.14-1.65-.81-1.91-.9s-.44-.14-.63.14-.72.9-.89 1.09-.33.21-.61.07a7.59 7.59 0 01-2.23-1.38 8.38 8.38 0 01-1.55-1.93c-.16-.28 0-.43.12-.57s.28-.33.42-.49a1.88 1.88 0 00.28-.47.51.51 0 00-.02-.49c-.07-.14-.63-1.52-.86-2.08s-.46-.48-.63-.49h-.54a1 1 0 00-.72.34 3 3 0 00-.94 2.21 5.23 5.23 0 001.09 2.79 11.86 11.86 0 004.6 4.13A7.92 7.92 0 0015 16a3.18 3.18 0 001.46-.21 2.4 2.4 0 001-.76 1.94 1.94 0 00.13-1.09c-.19-.09-.47-.21-.5-.23z" />
          </svg>
        </div>
      </div>
    </a>
  );
}
function Lightbox({ open, src, alt, onClose }) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    // evitar scroll del body mientras está abierto
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      {/* contenido */}
      <div
        className="relative w-full max-w-5xl"
        onClick={(e) => e.stopPropagation()} // evita cerrar al clickear la imagen
      >
        {/* botón cerrar */}
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 md:top-2 md:right-2 h-10 w-10 rounded-full bg-slate-900/90 border border-slate-700 text-slate-200 hover:text-white hover:border-emerald-400 transition flex items-center justify-center"
          aria-label="Cerrar"
        >
          ✕
        </button>

        {/* imagen */}
        <img
          src={src}
          alt={alt || "Imagen ampliada"}
          className="w-full max-h-[85vh] object-contain rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl"
        />
      </div>
    </div>
  );
}


// Landing completa
export default function App() {

  const [lightbox, setLightbox] = useState({ open: false, src: "", alt: "" });

  const [nombre, setNombre] = useState("")
  const [clinica, setClinica] = useState("")
  const [contacto, setContacto] = useState("")

  const openImg = (src, alt = "") => setLightbox({ open: true, src, alt });
  const closeImg = () => setLightbox({ open: false, src: "", alt: "" });
  console.log(lightbox);

  const enviarFormularioContacto = async (e) => {
    e.preventDefault();


 const form = e.currentTarget;
    const formData = new FormData(e.currentTarget);
    const payload = {
      nombre: formData.get("nombre"),
      clinica: formData.get("clinica"),
      contacto: formData.get("contacto"),
      // mensaje: formData.get("mensaje") || "",
    };

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/contacto`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      const data = text ? JSON.parse(text) : {};

      if (!res.ok) {
        alert(data.error || `Error al enviar (${res.status})`);
        return;
      }

      console.log("Formulario enviado:", data);

      alert("Enviado ✅");
      form.reset();
      // e.currentTarget.reset();
    } catch (err) {
      console.error(err);
      alert("No se pudo conectar con el servidor.");
    }
  };




  return (
    <div className="bg-slate-950 text-slate-100">

      {/* ======================= NAVBAR ======================= */}
      <header className="sticky top-0 z-20 bg-slate-950/90 border-b border-slate-800 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">

          {/* LOGO + TEXTO */}
          <div className="flex items-center gap-5">

            {/* ICONO GRANDE (RECORTE AUTOMÁTICO) */}
            <div className="h-20 w-20 rounded-3xl bg-white shadow-2xl shadow-emerald-500/30 border border-emerald-500/60 overflow-hidden">
              <img
                src="/img/logo.png"
                alt="VetClinic Pro"
                className="h-full w-auto object-cover object-left"
              />
            </div>

            {/* TEXTO DE MARCA */}
            <div className="leading-tight">
              <div className="text-xl font-semibold text-slate-50 tracking-tight">
                VetClinic <span className="text-emerald-400">Pro</span>
              </div>
              <div className="text-[12px] uppercase tracking-[0.3em] text-slate-400">
                Software veterinario
              </div>
            </div>
          </div>

          {/* LINKS */}
          <nav className="hidden md:flex gap-6 text-sm text-slate-300">
            <a href="#modulos" className="hover:text-emerald-400 transition">Módulos</a>
            <a href="#vista" className="hover:text-emerald-400 transition">Vista del sistema</a>
            <a href="#precios" className="hover:text-emerald-400 transition">Precios</a>
            <a href="#faq" className="hover:text-emerald-400 transition">FAQ</a>

            <a
              href="#contacto"
              className="rounded-full bg-emerald-500 px-4 py-2 text-slate-950 font-semibold hover:bg-emerald-400 transition"
            >
              Probar Demo
            </a>
          </nav>
        </div>
      </header>

      {/* ======================= HERO ======================= */}
      <section className="px-4 border-b border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="max-w-6xl mx-auto py-16 md:flex md:items-center md:gap-12">

          {/* TEXTOS */}
          <div className="flex-1 space-y-6">
            <span className="inline-block text-xs px-4 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-400/30 tracking-wider">
              Software para Clínicas Veterinarias
            </span>

            <h1 className="text-4xl md:text-5xl font-bold">
              El sistema veterinario que organiza tu clínica y mejora tu día.
            </h1>

            <p className="text-slate-300 max-w-lg text-sm md:text-base">
              Gestioná pacientes, turnos, stock, historia clínica y caja desde un solo lugar.
              Rápido, simple y 100% online.
            </p>

            <div className="flex flex-wrap gap-3">
              <a
                href="#contacto"
                className="rounded-full bg-emerald-500 px-6 py-3 text-slate-950 font-semibold hover:bg-emerald-400 transition"
              >
                Probar demo gratis
              </a>

              <a
                href="#precios"
                className="rounded-full border border-slate-600 px-6 py-3 text-slate-100 hover:border-emerald-400 hover:text-emerald-300 transition"
              >
                Ver precios
              </a>
            </div>

            <div className="flex flex-wrap gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 bg-emerald-400 rounded-full"></span>
                Sin instalación
              </span>

              <span className="flex items-center gap-2">
                <span className="h-2 w-2 bg-emerald-400 rounded-full"></span>
                Multidispositivo
              </span>

              <span className="flex items-center gap-2">
                <span className="h-2 w-2 bg-emerald-400 rounded-full"></span>
                Datos 100% seguros
              </span>
            </div>
          </div>

          {/* MOCKUP / REEMPLAZAR POR TUS IMÁGENES */}
          <div className="flex-1 mt-12 md:mt-0">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl">
              <img
                src="/img/dashboard.png"
                onClick={() => openImg("/img/dashboard.png", "Dashboard")}
                alt="Dashboard del sistema"
                className="rounded-xl object-cover"
              />
            </div>

            <p className="text-center text-xs text-slate-500 mt-2">
              Panel real del sistema
            </p>
          </div>
        </div>
      </section>

      {/* ======================= FUNCIONES PRINCIPALES ======================= */}
      <section className="px-4 py-20 bg-slate-950 border-b border-slate-800">
        <div className="max-w-6xl mx-auto text-center">

          <h2 className="text-3xl md:text-4xl font-bold text-slate-50">
            Funciones Principales del Sistema
          </h2>
          <p className="mt-3 text-slate-300 max-w-2xl mx-auto text-sm md:text-base">
            Simplificá tu trabajo, optimizá tu tiempo y llevá tu clínica al siguiente nivel.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mt-14">

            {/* GESTIÓN DE CLIENTES */}
            <div className="group flex flex-col items-center text-center
                      transition-transform duration-300 ease-out
                      hover:-translate-y-2 hover:shadow-xl hover:shadow-emerald-500/10">
              <div className="h-20 w-20 rounded-full border border-emerald-500/40 flex items-center justify-center mb-3
                        bg-slate-900/60 group-hover:bg-slate-900
                        transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-emerald-400
                          transition-transform duration-300 group-hover:scale-110 group-hover:animate-pulse"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M15 19.128a9.38 9.38 0 003.5-.856 3 3 0 10-4.238-2.842M15 19.128V21m0-1.872a9.38 9.38 0 01-3 .372 9.38 9.38 0 01-3-.372M12 17.628a9.38 9.38 0 00-3-.372m6 0a9.38 9.38 0 00-3-.372m0 0V21" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-100 text-sm">
                Gestión de Clientes y Pacientes
              </h3>
              <p className="mt-2 text-xs text-slate-400">
                Toda la información al alcance de un clic.
              </p>
            </div>

            {/* HISTORIAS CLÍNICAS */}
            <div className="group flex flex-col items-center text-center
                      transition-transform duration-300 ease-out
                      hover:-translate-y-2 hover:shadow-xl hover:shadow-emerald-500/10">
              <div className="h-20 w-20 rounded-full border border-emerald-500/40 flex items-center justify-center mb-3
                        bg-slate-900/60 group-hover:bg-slate-900
                        transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-emerald-400
                          transition-transform duration-300 group-hover:scale-110 group-hover:animate-pulse"
                  viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                    d="M3 4.5V18a2.25 2.25 0 002.25 2.25h9A2.25 2.25 0 0016.5 18V4.5M3 4.5A2.25 2.25 0 015.25 2.25h9A2.25 2.25 0 0116.5 4.5M3 4.5h13.5M6 8.25h6M6 12h5M6 15.75h4" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-100 text-sm">
                Gestión de Historias Clínicas
              </h3>
              <p className="mt-2 text-xs text-slate-400">
                Consultas ordenadas, completas y accesibles.
              </p>
            </div>

            {/* AGENDA Y TURNOS */}
            <div className="group flex flex-col items-center text-center
                      transition-transform duration-300 ease-out
                      hover:-translate-y-2 hover:shadow-xl hover:shadow-emerald-500/10">
              <div className="h-20 w-20 rounded-full border border-emerald-500/40 flex items-center justify-center mb-3
                        bg-slate-900/60 group-hover:bg-slate-900
                        transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-emerald-400
                          transition-transform duration-300 group-hover:scale-110 group-hover:animate-pulse"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M6.75 3v2.25M17.25 3v2.25M3 8.25h18M4.5 21h15a2.25 2.25 0 002.25-2.25v-9A2.25 2.25 0 0019.5 7.5h-15A2.25 2.25 0 002.25 9.75v9A2.25 2.25 0 004.5 21z" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-100 text-sm">
                Agenda y Turnos
              </h3>
              <p className="mt-2 text-xs text-slate-400">
                Agenda clara, días más productivos.
              </p>
            </div>

            {/* RECORDATORIOS */}
            <div className="group flex flex-col items-center text-center
                      transition-transform duration-300 ease-out
                      hover:-translate-y-2 hover:shadow-xl hover:shadow-emerald-500/10">
              <div className="h-20 w-20 rounded-full border border-emerald-500/40 flex items-center justify-center mb-3
                        bg-slate-900/60 group-hover:bg-slate-900
                        transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-emerald-400
                          transition-transform duration-300 group-hover:scale-110 group-hover:animate-pulse"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M12 6v6h4.5m4.5 0A9 9 0 1112 3v3" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-100 text-sm">
                Recordatorios Automáticos
              </h3>
              <p className="mt-2 text-xs text-slate-400">
                Ahorra tiempo y reduce ausencias.
              </p>
            </div>

            {/* GESTIÓN COMERCIAL */}
            <div className="group flex flex-col items-center text-center
                      transition-transform duration-300 ease-out
                      hover:-translate-y-2 hover:shadow-xl hover:shadow-emerald-500/10">
              <div className="h-20 w-20 rounded-full border border-emerald-500/40 flex items-center justify-center mb-3
                        bg-slate-900/60 group-hover:bg-slate-900
                        transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-emerald-400
                          transition-transform duration-300 group-hover:scale-110 group-hover:animate-pulse"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M3 3v18h18M7.5 15l3-3 4.5 4.5L21 9" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-100 text-sm">
                Gestión Comercial
              </h3>
              <p className="mt-2 text-xs text-slate-400">
                Ventas, servicios y control total.
              </p>
            </div>

            {/* CUENTA CORRIENTE */}
            <div className="group flex flex-col items-center text-center
                      transition-transform duration-300 ease-out
                      hover:-translate-y-2 hover:shadow-xl hover:shadow-emerald-500/10">
              <div className="h-20 w-20 rounded-full border border-emerald-500/40 flex items-center justify-center mb-3
                        bg-slate-900/60 group-hover:bg-slate-900
                        transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-emerald-400
                          transition-transform duration-300 group-hover:scale-110 group-hover:animate-pulse"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M12 8.25v7.5m-3-3.75h6M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-100 text-sm">
                Cuenta Corriente
              </h3>
              <p className="mt-2 text-xs text-slate-400">
                Control de deudas de clientes.
              </p>
            </div>

            {/* ANÁLISIS Y ESTADÍSTICAS */}
            <div className="group flex flex-col items-center text-center
                      transition-transform duration-300 ease-out
                      hover:-translate-y-2 hover:shadow-xl hover:shadow-emerald-500/10">
              <div className="h-20 w-20 rounded-full border border-emerald-500/40 flex items-center justify-center mb-3
                        bg-slate-900/60 group-hover:bg-slate-900
                        transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-emerald-400
                          transition-transform duration-300 group-hover:scale-110 group-hover:animate-pulse"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M3 3v18h18M7.5 15l3-3 4.5 4.5L21 9" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-100 text-sm">
                Análisis y Estadísticas
              </h3>
              <p className="mt-2 text-xs text-slate-400">
                Decisiones basadas en datos reales.
              </p>
            </div>

            {/* CONTROL DE USUARIOS */}
            <div className="group flex flex-col items-center text-center
                      transition-transform duration-300 ease-out
                      hover:-translate-y-2 hover:shadow-xl hover:shadow-emerald-500/10">
              <div className="h-20 w-20 rounded-full border border-emerald-500/40 flex items-center justify-center mb-3
                        bg-slate-900/60 group-hover:bg-slate-900
                        transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-emerald-400
                          transition-transform duration-300 group-hover:scale-110 group-hover:animate-pulse"
                  viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                    d="M12 12a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM4.5 20a7.5 7.5 0 0115 0" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-100 text-sm">
                Control de Usuarios
              </h3>
              <p className="mt-2 text-xs text-slate-400">
                Permisos y accesos personalizados.
              </p>
            </div>

          </div>

          <p className="mt-12 text-slate-400 text-sm">Y mucho más…</p>

        </div>
      </section>


      {/* ======================= MÓDULOS ======================= */}
      <section id="modulos" className="px-4 py-16 border-b border-slate-800 bg-slate-950">
        <div className="max-w-6xl mx-auto">

          <h2 className="text-3xl font-semibold text-center">Todo lo que tu clínica necesita</h2>
          <p className="text-center text-slate-300 mt-2">
            Módulos creados especialmente para veterinarias pequeñas y grandes.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mt-10">

            {/* 1 - Pacientes */}
            <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
              <h3 className="text-xl font-semibold mb-3">🐶 Pacientes y Propietarios</h3>
              <ul className="text-sm text-slate-300 space-y-2">
                <li>• Ficha completa del paciente</li>
                <li>• Información del dueño</li>
                <li>• Vacunas, historial, alergias</li>
                <li>• Adjuntar estudios e imágenes</li>
              </ul>
            </div>

            {/* 2 - Turnos */}
            <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
              <h3 className="text-xl font-semibold mb-3">🕒 Gestión de Turnos</h3>
              <ul className="text-sm text-slate-300 space-y-2">
                <li>• Agenda por profesional</li>
                <li>• Estados: pendiente / confirmado</li>
                <li>• Calendario semanal y mensual</li>
                <li>• Recordatorios automáticos</li>
              </ul>
            </div>

            {/* 3 - Stock */}
            <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
              <h3 className="text-xl font-semibold mb-3">💊 Stock y Farmacia</h3>
              <ul className="text-sm text-slate-300 space-y-2">
                <li>• Control de medicamentos</li>
                <li>• Alertas de stock bajo</li>
                <li>• Movimientos y compras</li>
                <li>• Farmacia integrada</li>
              </ul>
            </div>

            {/* 4 - Historia clínica */}
            <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
              <h3 className="text-xl font-semibold mb-3">📁 Historia Clínica Digital</h3>
              <ul className="text-sm text-slate-300 space-y-2">
                <li>• Evoluciones de cada consulta</li>
                <li>• Diagnóstico y tratamiento</li>
                <li>• Adjuntar documentos</li>
                <li>• Línea de tiempo completa</li>
              </ul>
            </div>
          </div>

        </div>
      </section>

      {/* ========== GALERÍA DE CAPTURAS ========== */}
      <section id="galeria" className="px-4 py-20 bg-slate-950 border-b border-slate-800 ">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center">
            Mirá cómo se ve <span className="text-emerald-400">tu nueva clínica digital</span>
          </h2>
          <p className="text-center text-slate-300 mt-3 max-w-2xl mx-auto text-sm md:text-base">
            Capturas reales del sistema en funcionamiento: sin maquetas ni trucos.
          </p>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {/* Dashboard */}
            <div className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40">
              <img
                src="/img/dashboard.png"
                onClick={() => openImg("/img/dashboard.png", "Dashboard")}
                alt="Dashboard"
                className="w-full h-44 md:h-52 object-cover transition-transform duration-500 group-hover:scale-105 cursor-zoom-in"
              />
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <p className="absolute bottom-3 left-4 pointer-events-none text-xs font-semibold text-slate-100">
                Dashboard con métricas en tiempo real
              </p>
            </div>

            {/* Agenda de turnos */}
            <div className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40 ">
              <img
                src="/img/turnos.png"
                onClick={() => { console.log("CLICK dashboard"); openImg("/img/turnos.png", "Turnos") }}
                alt="Agenda de turnos"
                className="w-full h-44 md:h-52 object-cover transition-transform duration-500 group-hover:scale-105 cursor-zoom-in"
              />
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <p className="absolute bottom-3 left-4 pointer-events-none text-xs font-semibold text-slate-100">
                Agenda de turnos por profesional y estado
              </p>
            </div>

            {/* Ficha de paciente */}
            <div className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40">
              <img
                src="/img/paciente.png"
                onClick={() => openImg("/img/paciente.png", "Paciente")}
                alt="Ficha del paciente"
                className="w-full h-44 md:h-52 object-cover transition-transform duration-500 group-hover:scale-105 rounded-xl object-cover cursor-zoom-in"
              />
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <p className="absolute bottom-3 left-4 pointer-events-none text-xs font-semibold text-slate-100 ">
                Fichas completas de pacientes y propietarios
              </p>
            </div>

            {/* Historia clínica */}
            <div className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40">
              <img
                src="/img/historiaClinica.png"
                onClick={() => openImg("/img/historiaClinica.png", "Historia Clinica")}
                alt="Historia clínica"
                className="w-full h-44 md:h-52 object-cover transition-transform duration-500 group-hover:scale-105 cursor-zoom-in"
              />
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <p className="absolute bottom-3 left-4 pointer-events-none text-xs font-semibold text-slate-100">
                Historia clínica digital con evoluciones
              </p>
            </div>

            {/* Stock */}
            <div className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40">
              <img
                src="/img/farmacia.png"
                onClick={() => openImg("/img/farmacia.png", "Farmacia")}
                alt="Stock"
                className="w-full h-44 md:h-52 object-cover transition-transform duration-500 group-hover:scale-105 cursor-zoom-in"
              />
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <p className="absolute bottom-3 left-4 pointer-events-none text-xs font-semibold text-slate-100">
                Control de stock y farmacia integrada
              </p>
            </div>

            {/* Caja / reportes */}
            <div className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40">
              <img
                src="/img/caja.png"
                onClick={() => openImg("/img/caja.png", "Caja y reportes")}
                alt="Caja y reportes"
                className="w-full h-44 md:h-52 object-cover transition-transform duration-500 group-hover:scale-105 cursor-zoom-in"
              />
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <p className="absolute bottom-3 left-4 pointer-events-none text-xs font-semibold text-slate-100">
                Caja diaria y reportes para tomar decisiones
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== TESTIMONIOS ========== */}
      <section className="px-4 py-20 bg-slate-950 border-b border-slate-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center">
            Clínicas que ya confían en <span className="text-emerald-400">tu sistema</span>
          </h2>
          <p className="text-center text-slate-300 mt-3 max-w-2xl mx-auto text-sm md:text-base">
            Esto es lo que dicen quienes ya organizaron su veterinaria.
          </p>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {/* Testimonio 1 */}
            <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 flex flex-col justify-between">
              <p className="text-xs text-emerald-300 mb-2">⭐⭐⭐⭐⭐</p>
              <p className="text-sm text-slate-200">
                “Pasamos de Excel y WhatsApp a tener todo centralizado. Hoy tenemos los turnos y las historias
                clínicas ordenadas y el equipo trabaja mucho más tranquilo.”
              </p>
              <div className="mt-4 text-xs text-slate-400">
                <p className="font-semibold text-slate-200">Veterinaria Paws</p>
                <p>Villa Urquiza · CABA</p>
              </div>
            </div>

            {/* Testimonio 2 */}
            <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 flex flex-col justify-between">
              <p className="text-xs text-emerald-300 mb-2">⭐⭐⭐⭐⭐</p>
              <p className="text-sm text-slate-200">
                “Los recordatorios automáticos redujeron muchísimo los turnos perdidos. Antes perdíamos
                tiempo llamando uno por uno.”
              </p>
              <div className="mt-4 text-xs text-slate-400">
                <p className="font-semibold text-slate-200">Consultorio Mascotero</p>
                <p>Zona Norte · GBA</p>
              </div>
            </div>

            {/* Testimonio 3 */}
            <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 flex flex-col justify-between">
              <p className="text-xs text-emerald-300 mb-2">⭐⭐⭐⭐⭐</p>
              <p className="text-sm text-slate-200">
                “El módulo de stock y caja nos cambió la cabeza. Ahora sabemos qué se vende, qué falta y cómo
                nos fue cada mes.”
              </p>
              <div className="mt-4 text-xs text-slate-400">
                <p className="font-semibold text-slate-200">Clínica Animalia</p>
                <p>Rosario · Santa Fe</p>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* =================== VENTAJAS (FLIP CARDS + FADE-IN) =================== */}
      <section className="px-4 py-20 bg-slate-950 border-b border-slate-800">
        <div className="max-w-6xl mx-auto">

          <RevealOnScroll className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold">
              ¿La <span className="text-emerald-400">gestión de tu veterinaria</span> te deja sin tiempo?
            </h2>
            <p className="text-slate-300 mt-2">
              No te preocupes, para eso estamos acá.
            </p>
          </RevealOnScroll>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">

            {/* CARD 1 */}
            <RevealOnScroll>
              <div className="group h-48 w-full [perspective:1000px]">
                <div className="relative h-full w-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] bg-slate-900/40 border border-slate-700 rounded-2xl">
                  {/* FRONT */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 [backface-visibility:hidden]">
                    <div className="h-14 w-14 flex items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/30">
                      <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5H4.5" />
                      </svg>
                    </div>
                    <p className="text-sm font-semibold">Nube y Multidispositivo</p>
                  </div>
                  {/* BACK */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center px-4 [transform:rotateY(180deg)] [backface-visibility:hidden] bg-slate-900/90 border border-emerald-500/40 rounded-2xl">
                    <p className="text-xs text-slate-300">
                      Accedé desde cualquier dispositivo, sin instalaciones, siempre online.
                    </p>
                  </div>
                </div>
              </div>
            </RevealOnScroll>

            {/* CARD 2 */}
            <RevealOnScroll>
              <div className="group h-48 w-full [perspective:1000px]">
                <div className="relative h-full w-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] bg-slate-900/40 border border-slate-700 rounded-2xl">
                  {/* FRONT */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 [backface-visibility:hidden]">
                    <div className="h-14 w-14 flex items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/30">
                      <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M3.5 5h17M3.5 10h17M3.5 15h17M3.5 20h17" />
                      </svg>
                    </div>
                    <p className="text-sm font-semibold">Simple y Tecnológica</p>
                  </div>
                  {/* BACK */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center px-4 [transform:rotateY(180deg)] [backface-visibility:hidden] bg-slate-900/90 border border-emerald-500/40 rounded-2xl">
                    <p className="text-xs text-slate-300">
                      Interfaz moderna, intuitiva y fácil para todo el equipo.
                    </p>
                  </div>
                </div>
              </div>
            </RevealOnScroll>

            {/* CARD 3 */}
            <RevealOnScroll>
              <div className="group h-48 w-full [perspective:1000px]">
                <div className="relative h-full w-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] bg-slate-900/40 border border-slate-700 rounded-2xl">
                  {/* FRONT */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 [backface-visibility:hidden]">
                    <div className="h-14 w-14 flex items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/30">
                      <svg className="w-8 h-8 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M12 12l8-4.5-8-4.5-8 4.5 8 4.5zm0 0v9l8-4.5m-8 4.5L4 16.5" />
                      </svg>
                    </div>
                    <p className="text-sm font-semibold">Seguro y Confiable</p>
                  </div>
                  {/* BACK */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center px-4 [transform:rotateY(180deg)] [backface-visibility:hidden] bg-slate-900/90 border border-emerald-500/40 rounded-2xl">
                    <p className="text-xs text-slate-300">
                      Cifrado, backups y seguridad profesional para tus datos.
                    </p>
                  </div>
                </div>
              </div>
            </RevealOnScroll>

            {/* CARD 4 */}
            <RevealOnScroll>
              <div className="group h-48 w-full [perspective:1000px]">
                <div className="relative h-full w-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] bg-slate-900/40 border border-slate-700 rounded-2xl">
                  {/* FRONT */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 [backface-visibility:hidden]">
                    <div className="h-14 w-14 flex items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/30">
                      <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M12 11.25a1.875 1.875 0 100-3.75m0 0V3m0 4.5a1.875 1.875 0 110 3.75M4.5 21h15a2.25 2.25 0 002.25-2.25V12A9.75 9.75 0 0012 2.25" />
                      </svg>
                    </div>
                    <p className="text-sm font-semibold">Soporte de Calidad</p>
                  </div>
                  {/* BACK */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center px-4 [transform:rotateY(180deg)] [backface-visibility:hidden] bg-slate-900/90 border border-emerald-500/40 rounded-2xl">
                    <p className="text-xs text-slate-300">
                      Acompañamiento real por WhatsApp para tu clínica.
                    </p>
                  </div>
                </div>
              </div>
            </RevealOnScroll>

          </div>

          <RevealOnScroll className="mt-12 flex justify-center">
            <a
              href="#contacto"
              className="px-6 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold transition"
            >
              Más información
            </a>
          </RevealOnScroll>

        </div>
      </section>



      {/* ======================= VISTA REAL ======================= */}
      <section id="vista" className="px-4 py-16 border-b border-slate-800 bg-slate-950">
        <div className="max-w-6xl mx-auto">

          <h2 className="text-3xl font-semibold text-center mb-8">Así luce el sistema por dentro</h2>

          <div className="grid md:grid-cols-2 gap-8">

            {/* Imagen 1 */}
            <div>
              <img
                src="/img/turnos.png"
                onClick={() => openImg("/img/turnos.png", "Turnos")}
                className=" rounded-xl object-cover cursor-zoom-in"
              />
              <p className="text-sm text-center mt-2 text-slate-400">Agenda de turnos</p>
            </div>

            {/* Imagen 2 */}
            <div>
              <img
                src="/img/pacientes.jpg"
                className="rounded-2xl border border-slate-800 cursor-zoom-in"
              />
              <p className="text-sm text-center mt-2 text-slate-400">Ficha del paciente</p>
            </div>

            {/* Imagen 3 */}
            <div>
              <img
                src="/img/historia.jpg"
                className="rounded-2xl border border-slate-800"
              />
              <p className="text-sm text-center mt-2 text-slate-400">Historia clínica digital</p>
            </div>

            {/* Imagen 4 */}
            <div>
              <img
                src="/img/stock.jpg"
                className="rounded-2xl border border-slate-800"
              />
              <p className="text-sm text-center mt-2 text-slate-400">Control de stock</p>
            </div>
          </div>
        </div>
      </section>

      {/* ======================= PRECIOS ======================= */}
      <section id="precios" className="px-4 py-16 border-b border-slate-800 bg-slate-950">
        <div className="max-w-6xl mx-auto">

          <h2 className="text-3xl text-center font-semibold">Planes y precios</h2>
          <p className="text-center text-slate-300 mt-2">
            Elegí el plan ideal para tu clínica. Sin contratos.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mt-12">

            {/* PLAN INICIAL */}
            <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl">
              <h3 className="text-lg font-semibold mb-1">Plan Inicial</h3>
              <p className="text-sm text-slate-300">Clínicas pequeñas</p>
              <div className="text-3xl font-bold mt-3">USD 9</div>
              <div className="text-xs text-slate-500">/ mes</div>

              <ul className="text-sm space-y-2 mt-4 text-slate-300">
                <li>• 1 profesional</li>
                <li>• 500 pacientes</li>
                <li>• Turnos + caja</li>
                <li>• Soporte básico</li>
              </ul>

              <a
                href="#contacto"
                className="block mt-6 text-center rounded-full border border-slate-600 py-2 hover:border-emerald-400 hover:text-emerald-300 transition"
              >
                Elegir plan
              </a>
            </div>

            {/* PLAN PROFESIONAL */}
            <div className="p-6 bg-slate-900 border border-emerald-500/50 rounded-2xl shadow-xl shadow-emerald-500/20 relative">
              <span className="absolute -top-3 right-4 bg-emerald-500 text-slate-950 px-3 py-1 text-xs rounded-full">
                Más elegido
              </span>

              <h3 className="text-lg font-semibold mb-1">Plan Profesional</h3>
              <p className="text-sm text-slate-300">Clínicas medianas</p>
              <div className="text-3xl font-bold text-emerald-400 mt-3">USD 19</div>
              <div className="text-xs text-slate-500">/ mes</div>

              <ul className="text-sm space-y-2 mt-4 text-slate-300">
                <li>• Hasta 4 profesionales</li>
                <li>• Pacientes ilimitados</li>
                <li>• Stock + historia clínica</li>
                <li>• Recordatorios automáticos</li>
                <li>• Reportes avanzados</li>
              </ul>

              <a
                href="#contacto"
                className="block mt-6 text-center rounded-full bg-emerald-500 text-slate-950 py-2 hover:bg-emerald-400 transition"
              >
                Elegir este plan
              </a>
            </div>

            {/* PLAN FULL */}
            <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl">
              <h3 className="text-lg font-semibold mb-1">Plan Full</h3>
              <p className="text-sm text-slate-300">Clínicas grandes</p>
              <div className="text-3xl font-bold mt-3">USD 29</div>
              <div className="text-xs text-slate-500">/ mes</div>

              <ul className="text-sm space-y-2 mt-4 text-slate-300">
                <li>• Profesionales ilimitados</li>
                <li>• Todas las funciones activas</li>
                <li>• Importación de datos</li>
                <li>• Soporte prioritario</li>
              </ul>

              <a
                href="#contacto"
                className="block mt-6 text-center rounded-full border border-slate-600 py-2 hover:border-emerald-400 hover:text-emerald-300 transition"
              >
                Contactar ventas
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* ======================= FAQ ======================= */}
      <section id="faq" className="px-4 py-16 border-b border-slate-800 bg-slate-950">
        <div className="max-w-6xl mx-auto">

          <h2 className="text-3xl font-semibold text-center">Preguntas frecuentes</h2>

          <div className="mt-8 grid md:grid-cols-2 gap-8 text-sm text-slate-300">

            <div>
              <h3 className="font-semibold">¿Necesito instalar algo?</h3>
              <p className="mt-1 text-slate-400">No, funciona 100% online.</p>
            </div>

            <div>
              <h3 className="font-semibold">¿Puedo usarlo en varias PCs a la vez?</h3>
              <p className="mt-1 text-slate-400">Sí, acceso ilimitado por usuario.</p>
            </div>

            <div>
              <h3 className="font-semibold">¿Puedo migrar mis datos?</h3>
              <p className="mt-1 text-slate-400">Sí, te asistimos en la importación.</p>
            </div>

            <div>
              <h3 className="font-semibold">¿Funciona desde el celular?</h3>
              <p className="mt-1 text-slate-400">Sí, podés usarlo desde cualquier dispositivo.</p>
            </div>
          </div>

        </div>
      </section>

      {/* ======================= CONTACTO / DEMO ======================= */}
      <section id="contacto" className="px-4 py-16 bg-slate-950">
        <div className="max-w-6xl mx-auto">

          <h2 className="text-3xl font-semibold text-center">Solicitá tu demo</h2>
          <p className="text-center text-slate-300 mt-2">
            Completá este formulario y te contactamos.
          </p>

          <form
            className="max-w-xl mx-auto mt-8 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4"
            onSubmit={enviarFormularioContacto}
          >
            <div>
              <label className="text-xs text-slate-400">Nombre completo</label>
              <input
                name="nombre"
                onChange={(e) => setNombre(e.target.value)}
                className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm focus:border-emerald-400 outline-none"
                placeholder="Ej: Ana Gómez"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400">Clínica / Veterinaria</label>
              <input
                name="clinica"
                onChange={(e) => setClinica(e.target.value)}

                className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm focus:border-emerald-400 outline-none"
                placeholder="Ej: Veterinaria Paws"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400">WhatsApp o email</label>
              <input
                name="contacto"
                onChange={(e) => setContacto(e.target.value)}
                className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm focus:border-emerald-400 outline-none"
                placeholder="Ej: +54 11..."
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-full bg-emerald-500 text-slate-950 py-3 font-semibold hover:bg-emerald-400 transition"
            >
              Quiero ver la demo
            </button>
          </form>

        </div>
      </section>

      {/* ======================= FOOTER ======================= */}
      <footer className="bg-slate-900 text-slate-400 py-12 mt-20">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-10">
          <div>
            <h3 className="text-white font-semibold">VetClinic Pro</h3>
            <p className="text-sm mt-2">Software de gestión para veterinarias.</p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Enlaces</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#modulos">Módulos</a></li>
              <li><a href="#precios">Precios</a></li>
              <li><a href="#faq">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Contacto</h4>
            <p className="text-sm">✉ contacto@vetclinicpro.com</p>
            <p className="text-sm">📱 +54 11 1234 5678</p>
          </div>
        </div>

        <div className="text-center text-xs text-slate-500 mt-10">
          © 2025 VetClinic Pro – Todos los derechos reservados.
        </div>
      </footer>

      <Lightbox
        open={lightbox.open}
        src={lightbox.src}
        alt={lightbox.alt}
        onClose={closeImg}
      />
      <FloatingWhatsAppButton />
    </div>

  );
}
