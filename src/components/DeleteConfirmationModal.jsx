import React, { useState } from 'react';
import Modal from './Modal';
import { AlertTriangle } from 'lucide-react';

export default function DeleteConfirmationModal({ open, onClose, onConfirm, itemName, type, isDeleting }) {
 const [confirmText, setConfirmText] = useState('');
 
 const expectedText = `delete ${itemName}`;
 const isMatch = confirmText === expectedText;

 const footer = (
 <div className="flex justify-end gap-3 w-full">
 <button onClick={onClose} className="btn btn-outline" disabled={isDeleting}>
 Cancel
 </button>
 <button 
 onClick={onConfirm} 
 disabled={!isMatch || isDeleting}
 className="btn bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50"
 >
 {isDeleting ? 'Deleting...' : 'Delete'}
 </button>
 </div>
 );

 return (
 <Modal open={open} onClose={onClose} title="Are you absolutely sure?" footer={footer}>
 <div className="space-y-4 pt-2">
 <div className="flex items-start gap-3 p-4 bg-destructive/10 text-destructive border border-destructive/20 rounded-xl">
 <AlertTriangle className="shrink-0 mt-0.5" size={20} />
 <p className="text-sm font-medium">
 This action cannot be undone. This will permanently delete the {type} <span className="font-bold">"{itemName}"</span> and remove it from our servers.
 </p>
 </div>

 <div className="space-y-2">
 <label className="text-sm font-medium text-muted-foreground block">
 Please type <span className="font-bold text-foreground select-all">{expectedText}</span> to confirm.
 </label>
 <input
 type="text"
 className="w-full bg-transparent border border-border rounded-xl px-4 py-3 text-sm focus:border-destructive focus:ring-1 focus:ring-destructive outline-none transition-all"
 value={confirmText}
 onChange={(e) => setConfirmText(e.target.value)}
 placeholder={expectedText}
 />
 </div>
 </div>
 </Modal>
 );
}
