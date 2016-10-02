# react-scratchcard

A react component for displaying scratch card in your web app.

## Demo

http://allu.io/react-scratchcard

## Installation

```
$ npm install react-scratchcard
```

## Usage

```javascript
import ScratchCard from 'react-scratchcard'

function Example() {
  return (
    <ScratchCard
      width={500}
      height={500}
      image="/path/to/image.png"
      finishPercent={50}
      onComplete={() => console.log('The card is now clear!')}
    >
      <div>This will be revealed by scratching the card!</div>
    </ScratchCard>  
  )
}
```
