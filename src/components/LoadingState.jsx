import { Command } from 'lucide-react';

import Loader from './kokonutui/loader';

export default function LoadingState({ text = 'Loading...' }) {
 return (
  <div className="flex flex-col items-center justify-center w-full h-full min-h-[calc(100vh-8rem)]">
    <Loader title={text} subtitle="Please wait a moment" size="md" />
  </div>
 );
}
