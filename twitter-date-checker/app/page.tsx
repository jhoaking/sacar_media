'use client';

import { useState } from 'react';

export default function TwitterDateChecker() {
  const [tweetUrl, setTweetUrl] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  function extractTweetId(input: string): string {
    const trimmed = input.trim();
    
    // Si es solo números, es el ID directo
    if (/^\d+$/.test(trimmed)) {
      return trimmed;
    }
    
    // Extraer ID de la URL
    const patterns = [
      /(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)/i,
      /status\/(\d+)/i
    ];
    
    for (const pattern of patterns) {
      const match = trimmed.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    
    throw new Error('No se pudo extraer el ID del tweet');
  }

  function getTweetDate(tweetId: string): string {
    try {
      const id = tweetId.trim();
      if (!/^\d+$/.test(id)) {
        throw new Error('ID inválido');
      }
      
      const twitterEpoch = BigInt('1288834974657');
      const tweetIdBigInt = BigInt(id);
      const timestamp = (tweetIdBigInt >> BigInt(22)) + twitterEpoch;
      const date = new Date(Number(timestamp));
      
      return date.toLocaleString('es-ES', {
        dateStyle: 'full',
        timeStyle: 'long'
      });
    } catch (err) {
      throw new Error('ID inválido');
    }
  }

  const handleSubmit = () => {
    setError('');
    setResult('');

    if (!tweetUrl.trim()) {
      setError('Por favor ingresa una URL o ID de tweet');
      return;
    }

    try {
      const tweetId = extractTweetId(tweetUrl);
      const date = getTweetDate(tweetId);
      setResult(date);
    } catch (err) {
      setError('La URL o ID ingresado no es válido. Asegúrate de usar una URL válida de Twitter/X o un ID numérico.');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setTweetUrl(text);
    } catch (err) {
      // Si falla el clipboard, no hacer nada
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="flex items-center justify-center mb-6">
          <div className="bg-blue-500 p-3 rounded-full">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-2">
          Twitter Date Checker
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Descubre la fecha exacta de publicación de cualquier tweet
        </p>

        <div className="space-y-4">
          <div>
            <label htmlFor="tweetUrl" className="block text-sm font-medium text-gray-700 mb-2">
              URL o ID del Tweet
            </label>
            <div className="relative">
              <input
                id="tweetUrl"
                type="text"
                value={tweetUrl}
                onChange={(e) => setTweetUrl(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="https://x.com/usuario/status/123456..."
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
              <button
                onClick={handlePaste}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 transition"
                title="Pegar desde portapapeles"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Pega la URL completa o solo el ID numérico del tweet
            </p>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Verificar Fecha
          </button>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {result && (
          <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
            <p className="text-xs font-semibold text-gray-600 mb-2">FECHA DE PUBLICACIÓN</p>
            <p className="text-lg font-bold text-gray-800">{result}</p>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Los IDs de Twitter usan codificación Snowflake de 64 bits
          </p>
        </div>
      </div>
    </div>
  );
}