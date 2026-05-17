import React from 'react';

export default function TextBlock({ data }: { data: any }) {
  if (!data) return null;

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6 max-w-4xl relative">
        <div className="absolute -left-10 top-0 text-9xl font-serif text-slate-100 -z-10 opacity-50">
          “
        </div>
        
        <div className="space-y-8 relative z-10">
          {data.title && (
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight leading-tight">
              {data.title}
            </h2>
          )}
          
          {data.subtitle && (
            <p className="text-2xl text-indigo-600 font-medium tracking-wide">
              {data.subtitle}
            </p>
          )}
          
          <div className="prose prose-2xl prose-slate max-w-none text-slate-600 leading-relaxed font-light italic">
             {data.text || data.content || data.heading || "No content provided."}
          </div>
          
          {data.author && (
            <div className="flex items-center gap-4 pt-8 border-t border-slate-100">
               <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-600">
                  {data.author[0]}
               </div>
               <div>
                  <p className="font-bold text-slate-900">{data.author}</p>
                  <p className="text-sm text-slate-400 uppercase tracking-widest">{data.role || "Corporate Statement"}</p>
               </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
