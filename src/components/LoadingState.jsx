import { Command } from 'lucide-react';

import Loader from './kokonutui/loader';

export default function LoadingState({ text = 'Loading...' }) {
 return (
  <div className="flex items-center justify-center w-full h-full min-h-[300px]">
    <Loader title={text} subtitle="Please wait a moment" size="md" />
  </div>
 );
}
