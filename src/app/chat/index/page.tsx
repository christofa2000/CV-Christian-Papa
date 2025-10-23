"use client";

import Link from "next/link";

export default function ChatIndex() {
  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Sistema de Chat - CV Christian
      </h1>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Chat Simple */}
        <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-3 text-green-600">
            Chat Simple
          </h2>
          <p className="text-gray-600 mb-4">
            Búsqueda básica por palabras clave. Rápido, confiable y sin
            dependencias complejas.
          </p>
          <ul className="text-sm text-gray-500 mb-4 space-y-1">
            <li>✅ Muy rápido</li>
            <li>✅ Sin errores</li>
            <li>✅ Búsqueda por palabras clave</li>
            <li>✅ 100% compatible</li>
          </ul>
          <Link
            href="/chat/simple"
            className="inline-block w-full text-center bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
          >
            Usar Chat Simple
          </Link>
        </div>

        {/* Chat Híbrido */}
        <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-3 text-blue-600">
            Chat Híbrido
          </h2>
          <p className="text-gray-600 mb-4">
            Sistema inteligente que analiza el tipo de pregunta y genera
            respuestas contextuales.
          </p>
          <ul className="text-sm text-gray-500 mb-4 space-y-1">
            <li>✅ Respuestas contextuales</li>
            <li>✅ Análisis de tipo de pregunta</li>
            <li>✅ Búsqueda mejorada</li>
            <li>✅ Sin dependencias problemáticas</li>
          </ul>
          <Link
            href="/chat/hybrid"
            className="inline-block w-full text-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Usar Chat Híbrido
          </Link>
        </div>

        {/* Chat Original */}
        <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-3 text-orange-600">
            Chat Original
          </h2>
          <p className="text-gray-600 mb-4">
            Chat con IA local usando modelos de lenguaje. Puede tener problemas
            de compatibilidad.
          </p>
          <ul className="text-sm text-gray-500 mb-4 space-y-1">
            <li>⚠️ Puede tener errores</li>
            <li>⚠️ Dependencias complejas</li>
            <li>✅ Respuestas de IA</li>
            <li>⚠️ Carga lenta</li>
          </ul>
          <Link
            href="/chat"
            className="inline-block w-full text-center bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 transition-colors"
          >
            Usar Chat Original
          </Link>
        </div>
      </div>

      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <h3 className="font-semibold mb-2">Recomendaciones:</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>
            • <strong>Para uso diario:</strong> Chat Híbrido (mejor balance)
          </li>
          <li>
            • <strong>Para máxima confiabilidad:</strong> Chat Simple
          </li>
          <li>
            • <strong>Para experimentar:</strong> Chat Original (puede fallar)
          </li>
        </ul>
      </div>

      <div className="mt-6 text-center">
        <Link
          href="/"
          className="text-indigo-600 hover:text-indigo-800 underline"
        >
          ← Volver al CV Principal
        </Link>
      </div>
    </div>
  );
}

