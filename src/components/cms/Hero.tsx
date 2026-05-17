import React from 'react';

export default function Hero({ data }: { data: any }) {
  const BASE_URL = "http://127.0.0.1:5000";
  
  if (!data) return null;

  return (
    <section className="relative h-[85vh] flex items-center justify-center overflow-hidden bg-slate-900">
      {data.video_url ? (
        <video 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
          autoPlay loop muted playsInline
          src={data.video_url.startsWith('http') ? data.video_url : `${BASE_URL}${data.video_url}`}
        />
      ) : data.image_url ? (
        <img 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
          src={data.image_url.startsWith('http') ? data.image_url : `${BASE_URL}${data.image_url}`}
          alt="Hero background"
        />
      ) : null}
      
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
      
      <div className="relative z-10 text-center text-white px-6 max-w-5xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight drop-shadow-2xl">
          {data.title}
        </h1>
        <p className="text-xl md:text-2xl font-medium max-w-3xl mx-auto drop-shadow-lg leading-relaxed opacity-90">
          {data.subtitle}
        </p>
        
        {data.cta_text && (
          <div className="mt-10">
            <button className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-bold text-lg transition-all hover:scale-105 shadow-xl">
              {data.cta_text}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
