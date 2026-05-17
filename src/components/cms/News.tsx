import React from 'react';

export default function News({ data }: { data: any[] | any }) {
  const BASE_URL = "http://127.0.0.1:5000";

  // Data could be a list of news items or a single object with a list inside
  const newsItems = Array.isArray(data) ? data : (data?.items || []);

  if (!newsItems || newsItems.length === 0) {
    return (
      <div className="py-20 bg-slate-50 text-center text-muted-foreground italic">
        No news articles published yet.
      </div>
    );
  }

  return (
    <section className="py-24 bg-slate-50">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-4xl font-bold text-slate-900 tracking-tight mb-4">
              Media & Newsroom
            </h2>
            <p className="text-lg text-slate-600">
              Stay updated with the latest releases, corporate updates, and media highlights from Vijayalakshmi Group.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsItems.map((item: any, index: number) => (
            <article 
              key={item._card_id || index} 
              className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-slate-200 hover:border-indigo-200 transition-all hover:shadow-2xl hover:-translate-y-1"
            >
              <div className="aspect-[16/10] overflow-hidden relative">
                <img 
                  src={item.image_url?.startsWith('http') ? item.image_url : `${BASE_URL}${item.image_url}`}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4">
                   <span className="px-3 py-1 bg-white/90 backdrop-blur text-[10px] font-bold uppercase tracking-wider text-indigo-600 rounded-full shadow-sm">
                      Latest
                   </span>
                </div>
              </div>
              
              <div className="p-8 flex flex-col flex-1">
                <div className="flex items-center gap-3 text-xs font-semibold text-slate-400 mb-4 uppercase tracking-widest">
                  <span>{item.author || "Corporate"}</span>
                  <span className="h-1 w-1 bg-slate-300 rounded-full"></span>
                  <span>{item.date || "May 2026"}</span>
                </div>
                
                <h3 className="text-2xl font-bold text-slate-900 leading-tight mb-4 group-hover:text-indigo-600 transition-colors">
                  {item.title}
                </h3>
                
                <p className="text-slate-600 line-clamp-3 mb-8 leading-relaxed">
                  {item.description}
                </p>
                
                <div className="mt-auto">
                   <button className="text-indigo-600 font-bold text-sm flex items-center gap-2 group/btn">
                      Read Article 
                      <span className="transition-transform group-hover/btn:translate-x-1">→</span>
                   </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
