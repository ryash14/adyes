import { Toaster } from 'react-hot-toast';

export default function Toast() {
 return (
 <Toaster
 position="top-center"
 toastOptions={{
 duration: 4000,
 style: {
 background: 'var(--card)',
 color: 'var(--foreground)',
 border: '1px solid var(--border)',
 borderRadius: '12px',
 boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
 fontSize: '14px',
 fontWeight: '500',
 padding: '12px 16px',
 },
 success: {
 iconTheme: {
 primary: 'var(--foreground)',
 secondary: 'var(--background)',
 },
 },
 error: {
 iconTheme: {
 primary: 'var(--destructive)',
 secondary: 'var(--destructive-foreground)',
 },
 },
 }}
 />
 );
}
