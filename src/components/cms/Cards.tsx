import React from 'react';

export default function Cards({ data }: { data: any[] }) {
  const BASE_URL = "http://127.0.0.1:5000";
  
  if (!data || !Array.isArray(data)) return null;

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {data.map((card, index) => (
            <div 
              key={card._card_id || index}
              className="group p-10 rounded-[2.5rem] bg-slate-50 border border-slate-100 hover:bg-white hover:border-indigo-100 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
            >
              <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:bg-indigo-600 transition-colors duration-500">
                {card.icon_url ? (
                   <img 
                    src={card.icon_url.startsWith('http') ? card.icon_url : `${BASE_URL}${card.icon_url}`}
                    alt="" 
                    className="h-8 w-8 group-hover:invert transition-all duration-500" 
                  />
                ) : (
                  <div className="h-4 w-4 bg-indigo-500 rounded-full animate-pulse" />
                )}
              </div>
              
              <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-indigo-600 transition-colors">
                {card.title}
              </h3>
              <p className="text-slate-600 leading-relaxed text-lg">
                {card.description}
              </p>
              
              {card.link && (
                <div className="mt-8">
                  <span className="text-indigo-600 font-bold text-sm uppercase tracking-wider group-hover:underline cursor-pointer">
                    Learn More →
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
