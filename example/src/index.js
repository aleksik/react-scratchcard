import React from 'react';
import { render } from 'react-dom';

import ScratchCard from '../../src';
import cardImage from './card.jpg';

function App() {
  return (
    <ScratchCard
      width={640}
      height={480}
      image={cardImage}
      finishPercent={50}
      onComplete={() => console.log('The card is now clear!')}
    >
      <div style={congratsStyles}>Congratulations! You WON!</div>
    </ScratchCard>
  );
}

const congratsStyles = {
  position: 'absolute',
  top: 0, right: 0, bottom: 0, left: 0,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#000',
  color: '#fff',
  fontFamily: 'sans-serif',
  fontSize: '40px'
}

render(<App />, document.getElementById('root'))
