import './App.css';
import React from 'react';
import Game from './components/game';

function App() {
  return (
    <div className='body'>
      <h3 className='text-center'>Type The Aplphabet</h3>
      <h5 className='text-center'>Typing Game to see how fasr you type. Timer starts when you do :)</h5>
      <Game />
    </div>
  );
}

export default App;
