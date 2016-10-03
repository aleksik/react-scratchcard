# react-scratchcard

A react component for displaying scratch card in your web app.

## Demo

http://allu.io/react-scratchcard

## Installation

```
$ npm install react-scratchcard
```

## Example

```javascript
import React from 'react';
import ScratchCard from 'react-scratchcard';

const settings = {
  width: 640,
  height: 480,
  image: 'image.jpg',
  finishPercent: 50,
  onComplete: () => console.log('The card is now clear!')
};

const Example = () =>
  <ScratchCard {...settings}>
    Congratulations! You WON!
  </ScratchCard>;
```

## Credits

Heavily inspired by [this pen by André Ruffert](https://codepen.io/andreruffert/pen/pvqly).

Image used in the example by [webtreats](https://www.flickr.com/photos/webtreatsetc/).
