import React from 'react';
import { render } from 'react-dom';

import ScratchCard from '../../src';
import cardImage from './card.jpg';

const settings = {
  width: 640,
  height: 480,
  image: cardImage,
  finishPercent: 50,
  onComplete: () => console.log('The card is now clear!')
};

const Example = () =>
  <ScratchCard {...settings}>
    Congratulations! You WON!
  </ScratchCard>;

render(<Example />, document.getElementById('root'));
