import React from 'react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#0a0e14]">
      <div className="max-w-[1200px] mx-auto px-6 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-14">
          <div>
            <h4 className="text-[13px] font-semibold text-white/60 mb-4">Product</h4>
            <div className="flex flex-col gap-2.5">
              {['AI Validation', 'Builder Network', 'Workspace', 'Analytics'].map(item => (
                <a key={item} href="#" className="text-[13px] text-white/25 hover:text-white/50 transition-colors">{item}</a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-[13px] font-semibold text-white/60 mb-4">Company</h4>
            <div className="flex flex-col gap-2.5">
              {['About', 'Blog', 'Careers', 'Contact'].map(item => (
                <a key={item} href="#" className="text-[13px] text-white/25 hover:text-white/50 transition-colors">{item}</a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-[13px] font-semibold text-white/60 mb-4">Community</h4>
            <div className="flex flex-col gap-2.5">
              {['Discord', 'Twitter', 'GitHub'].map(item => (
                <a key={item} href="#" className="text-[13px] text-white/25 hover:text-white/50 transition-colors">{item}</a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-[13px] font-semibold text-white/60 mb-4">Legal</h4>
            <div className="flex flex-col gap-2.5">
              {['Privacy', 'Terms', 'Security'].map(item => (
                <a key={item} href="#" className="text-[13px] text-white/25 hover:text-white/50 transition-colors">{item}</a>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/[0.06] gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-[4px] bg-[#FF6363] flex items-center justify-center">
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M6 1L11 6L6 11L1 6L6 1Z" fill="white"/></svg>
            </div>
            <span className="text-[13px] font-semibold text-white/60">adyes</span>
          </div>
          <p className="text-[11px] text-white/15">&copy; {new Date().getFullYear()} adyes. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
