import { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({ open, isOpen, onClose, title, children, footer, size = 'md' }) {
 const visible = open ?? isOpen;
 const sizeClass = size === 'lg' ? 'max-w-2xl' : 'max-w-lg';

 useEffect(() => {
 if (visible) {
 document.body.style.overflow = 'hidden';
 } else {
 document.body.style.overflow = '';
 }
 return () => {
 document.body.style.overflow = '';
 };
 }, [visible]);

 if (!visible) return null;

 return (
 <div className="fixed inset-0 z-50 flex items-center justify-center">
 <button
 type="button"
 className="absolute inset-0 bg-black/40"
 onClick={onClose}
 aria-label="Close modal"
 />
 <div
 className={`relative z-10 w-[92vw] ${sizeClass} bg-card border border-border rounded-lg p-6 shadow-lg`}
 onClick={(e) => e.stopPropagation()}
 role="dialog"
 aria-modal="true"
 aria-label={title}
 >
 {title ? (
 <div className="flex items-center justify-between gap-6 border-b border-border pb-4">
 <h2 className="text-base font-semibold">{title}</h2>
 <button type="button" onClick={onClose} className="btn btn-ghost btn-sm" aria-label="Close">
 <X size={16} strokeWidth={1.75} />
 </button>
 </div>
 ) : (
 <button type="button" onClick={onClose} className="btn btn-ghost btn-sm absolute right-4 top-4 z-20" aria-label="Close">
 <X size={16} strokeWidth={1.75} />
 </button>
 )}
 <div className={title ?"pt-5" :"pt-2"}>{children}</div>
 {footer && <div className="pt-6">{footer}</div>}
 </div>
 </div>
 );
}
