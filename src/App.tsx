/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-cyan-400 flex flex-col items-center justify-center p-4 relative overflow-hidden font-digital">
      <div className="static-noise" />
      <div className="scanlines" />

      <header className="z-10 mb-8 text-center">
        <h1 className="glitch-text text-5xl md:text-7xl font-bold mb-2" data-text="SYS.INIT: SNAKE">
          SYS.INIT: SNAKE
        </h1>
        <p className="text-fuchsia-500 tracking-[0.3em] text-xl animate-pulse">
          // WARNING: GLITCH_ART_OVERRIDE_ACTIVE //
        </p>
      </header>

      <main className="z-10 flex flex-col xl:flex-row gap-8 items-start justify-center w-full max-w-6xl">
        <div className="flex-1 flex justify-center w-full">
          <SnakeGame />
        </div>
        
        <div className="w-full xl:w-96 flex flex-col gap-8">
          <MusicPlayer />
          
          <div className="glitch-border bg-black p-6">
            <h3 className="text-2xl font-bold text-fuchsia-500 mb-4 tracking-widest border-b-2 border-fuchsia-500 pb-2">INPUT_MATRIX</h3>
            <ul className="space-y-4 text-lg text-cyan-400">
              <li className="flex justify-between">
                <span>[DIR_VECTORS]</span>
                <span className="text-fuchsia-500">ARROW_KEYS</span>
              </li>
              <li className="flex justify-between">
                <span>[HALT_EXEC]</span>
                <span className="text-fuchsia-500">SPACEBAR</span>
              </li>
              <li className="flex justify-between">
                <span>[AUDIO_CTRL]</span>
                <span className="text-fuchsia-500">SYS_BTNS</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
      
      <footer className="z-10 mt-12 text-sm text-fuchsia-500 tracking-widest">
        END_OF_LINE_ {new Date().getFullYear()}
      </footer>
    </div>
  );
}

