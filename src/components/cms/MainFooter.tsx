import React from "react";
import Link from "next/link";
import { Facebook, Instagram, Youtube, Linkedin } from "lucide-react";

export default function MainFooter() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5006/api';
  const BASE_URL = API_BASE_URL.endsWith('/api') ? API_BASE_URL.slice(0, -4) : 'http://127.0.0.1:5006';

  return (
    <footer className="w-full bg-[#f5f7f8] border-t border-[#e5e7ea] font-sans">
      <div className="max-w-[1200px] mx-auto px-10 pt-[90px] pb-[35px]">
        {/* TOP SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-[60px] mt-[10px]">
          
          {/* LOGO & BRAND */}
          <div className="md:mt-[65px] md:ml-[35px]">
            <div className="flex flex-row items-center gap-3 mb-[25px]">
              <img 
                src={`${BASE_URL}/static/images/logo/vijayalakshmi-mark.png`} 
                alt="Logo Mark" 
                className="h-[46px] w-auto"
              />
              <div className="flex flex-col leading-[1.1]">
                <span className="text-[16px] font-bold text-black tracking-[0.5px] uppercase">
                  Vijayalakshmi Group
                </span>
                <span className="text-[10px] font-semibold text-[#666] tracking-[1.5px]">
                  OF COMPANIES
                </span>
              </div>
            </div>

            <div className="inline-flex gap-[14px] md:-mt-[10px] md:ml-[58px] py-1 border-t border-b border-[#7030a0]">
              <a href="#" className="text-black hover:opacity-60 transition-opacity"><Facebook size={14} /></a>
              <a href="#" className="text-black hover:opacity-60 transition-opacity"><Instagram size={14} /></a>
              <a href="#" className="text-black hover:opacity-60 transition-opacity"><Youtube size={14} /></a>
              <a href="#" className="text-black hover:opacity-60 transition-opacity"><Linkedin size={14} /></a>
            </div>
          </div>

          {/* ABOUT */}
          <div className="flex flex-col">
            <h5 className="text-[14px] font-semibold mb-4 text-black">About Us</h5>
            <ul className="list-none p-0 m-0 space-y-[10px]">
              <li><Link href="/about" className="text-[12px] text-[#666] hover:text-black transition-colors">About Company</Link></li>
              <li><Link href="/about" className="text-[12px] text-[#666] hover:text-black transition-colors">Chairman’s Office</Link></li>
              <li><Link href="/services" className="text-[12px] text-[#666] hover:text-black transition-colors">Leadership</Link></li>
              <li><Link href="/about" className="text-[12px] text-[#666] hover:text-black transition-colors">Our Journey</Link></li>
              <li><Link href="/services" className="text-[12px] text-[#666] hover:text-black transition-colors">Awards</Link></li>
            </ul>
          </div>

          {/* BUSINESS */}
          <div className="flex flex-col">
            <h5 className="text-[14px] font-semibold mb-4 text-black">Businesses</h5>
            <ul className="list-none p-0 m-0 space-y-[10px]">
              <li><Link href="/services" className="text-[12px] text-[#666] hover:text-black transition-colors">Infrastructure</Link></li>
              <li><Link href="/services" className="text-[12px] text-[#666] hover:text-black transition-colors">Energy & Utilities</Link></li>
              <li><Link href="/services" className="text-[12px] text-[#666] hover:text-black transition-colors">Transport & Logistics</Link></li>
              <li><Link href="/services" className="text-[12px] text-[#666] hover:text-black transition-colors">Consumer Products</Link></li>
              <li><Link href="/services" className="text-[12px] text-[#666] hover:text-black transition-colors">Real Estate</Link></li>
              <li><Link href="/services" className="text-[12px] text-[#666] hover:text-black transition-colors">Healthcare</Link></li>
            </ul>
          </div>

          {/* QUICK LINKS */}
          <div className="flex flex-col">
            <h5 className="text-[14px] font-semibold mb-4 text-black">Quick Links</h5>
            <ul className="list-none p-0 m-0 space-y-[10px]">
              <li><Link href="/services" className="text-[12px] text-[#666] hover:text-black transition-colors">Sustainability</Link></li>
              <li><Link href="/" className="text-[12px] text-[#666] hover:text-black transition-colors">Investors</Link></li>
              <li><Link href="/" className="text-[12px] text-[#666] hover:text-black transition-colors">Newsroom</Link></li>
              <li><Link href="/about" className="text-[12px] text-[#666] hover:text-black transition-colors">Careers</Link></li>
              <li><Link href="/" className="text-[12px] text-[#666] hover:text-black transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="border-t border-[#e5e7ea] mt-[50px] pt-5 flex flex-col md:flex-row justify-between items-center gap-[10px] text-[12px] text-[#666]">
          <div className="flex items-center gap-2">
            <img 
              src={`${BASE_URL}/static/images/logo/vijayalakshmi-mark.png`} 
              alt="Mark" 
              className="h-5 w-auto"
            />
            <span>© 2026 Vijayalakshmi Group</span>
          </div>

          <div className="flex flex-wrap justify-center gap-[25px] md:ml-auto md:pl-[100px]">
            <Link href="#" className="hover:text-black transition-colors">Legal Disclaimer</Link>
            <Link href="#" className="hover:text-black transition-colors">Privacy Notice</Link>
            <Link href="#" className="hover:text-black transition-colors">Terms & Conditions</Link>
            <Link href="#" className="hover:text-black transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
