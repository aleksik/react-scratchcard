import React, { PropTypes, Component } from 'react';
import classnames from "classnames"

class ScratchCard extends Component {

  constructor(props) {
    super(props);
    this.state = { loaded: false }
  }

  componentDidMount() {
    const { cover } = this.props
    this.isDrawing = false;
    this.lastPoint = null;
    this.ctx = this.canvas.getContext('2d');

    const isColorCover = this.checkColorCover(cover)

    if (!isColorCover) {
      const image = new Image();
      image.crossOrigin = "Anonymous";
      image.onload = () => {
        this.ctx.drawImage(image, 0, 0);
        this.setState({ loaded: true });
      }
      image.src = cover;
    } else {
      const { width, height } = this.canvas
      this.ctx.save()
      this.ctx.fillStyle = cover
      this.ctx.beginPath()
      this.ctx.rect(0, 0, width, height)
      this.ctx.fill()
      this.ctx.restore()
      this.setState({ loaded: true });
    }

  }

  checkColorCover(cover) {
    return (/^#(\d|\w){3,6}$/.test(cover) || /^rgba?\(.*\)/.test(cover))
  }

  getFilledInPixels(stride) {
    if (!stride || stride < 1) {
      stride = 1;
    }

    const pixels = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    const total = pixels.data.length / stride;
    let count = 0;

    for (let i = 0; i < pixels.data.length; i += stride) {
      if (parseInt(pixels.data[i], 10) === 0) {
        count++;
      }
    }

    return Math.round((count / total) * 100);
  }

  getMouse(e, canvas) {
    const { top, left } = canvas.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

    return {
      x: (e.pageX || e.touches[0].clientX) - left - scrollLeft,
      y: (e.pageY || e.touches[0].clientY) - top - scrollTop
    }
  }

  distanceBetween(point1, point2) {
    return Math.sqrt(
      Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2)
    );
  }

  angleBetween(point1, point2) {
    return Math.atan2(point2.x - point1.x, point2.y - point1.y);
  }

  handlePercentage(filledInPixels = 0) {
    if (filledInPixels > this.props.finishPercent) {
      this.canvas.parentNode.removeChild(this.canvas);
      this.setState({ finished: true });
      if (this.props.onComplete) {
        this.props.onComplete();
      }
    }
  }

  handleMouseDown = (e) => {
    this.isDrawing = true;
    this.lastPoint = this.getMouse(e, this.canvas);
  }

  handleMouseMove = (e) => {
    if (!this.isDrawing) return;

    e.preventDefault();

    const currentPoint = this.getMouse(e, this.canvas);
    const distance = this.distanceBetween(this.lastPoint, currentPoint);
    const angle = this.angleBetween(this.lastPoint, currentPoint);

    let x, y;

    for (let i = 0; i < distance; i++) {
      x = this.lastPoint.x + (Math.sin(angle) * i);
      y = this.lastPoint.y + (Math.cos(angle) * i);
      this.ctx.globalCompositeOperation = 'destination-out';
      this.ctx.beginPath();
      this.ctx.arc(x, y, 25, 0, 2 * Math.PI, false);
      this.ctx.fill();
    }

    this.lastPoint = currentPoint;
    this.handlePercentage(this.getFilledInPixels(32));

  }

  handleMouseUp = () => {
    this.isDrawing = false;
  }

  render() {
    const {
      width,
      height,
      cover,
      finishPercent,
      onComplete,
      className,
      ...attr
    } = this.props

    const { loaded } = this.state

    const containerStyle = {
      width,
      height,
      position: 'relative',
      WebkitUserSelect: 'none',
      MozUserSelect: 'none',
      msUserSelect: 'none',
      userSelect: 'none'
    }

    const canvasStyle = {
      position: 'absolute',
      top: 0,
      zIndex: 1
    }

    const resultStyle = {
      visibility: loaded ? 'visible' : 'hidden'
    }

    const canvasProps = {
      ref: (ref) => this.canvas = ref,
      className: 'ScratchCard__Canvas',
      style: canvasStyle,
      width,
      height,
      onMouseDown: this.handleMouseDown,
      onTouchStart: this.handleMouseDown,
      onMouseMove: this.handleMouseMove,
      onTouchMove: this.handleMouseMove,
      onMouseUp: this.handleMouseUp,
      onTouchEnd: this.handleMouseUp
    }

    return (
      <div
        className={classnames("ScratchCard__Container", className)}
        style={containerStyle}
        {...attr}
      >
        <canvas {...canvasProps}></canvas>
        <div className="ScratchCard__Result" style={resultStyle}>
          {this.props.children}
        </div>
      </div>
    );
  }

}

ScratchCard.propTypes = {
  cover: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  finishPercent: PropTypes.number.isRequired,
  onComplete: PropTypes.func
}

export default ScratchCard;
