'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ScratchCard = function (_Component) {
  _inherits(ScratchCard, _Component);

  function ScratchCard(props) {
    _classCallCheck(this, ScratchCard);

    var _this = _possibleConstructorReturn(this, (ScratchCard.__proto__ || Object.getPrototypeOf(ScratchCard)).call(this, props));

    _this.state = { loaded: false };
    _this.handleMouseDown = _this.handleMouseDown.bind(_this);
    _this.handleMouseMove = _this.handleMouseMove.bind(_this);
    _this.handleMouseUp = _this.handleMouseUp.bind(_this);
    return _this;
  }

  _createClass(ScratchCard, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      this.isDrawing = false;
      this.lastPoint = null;
      this.ctx = this.canvas.getContext('2d');

      this.image = new Image();
      this.image.onload = function () {
        _this2.ctx.drawImage(_this2.image, 0, 0);
        _this2.setState({ loaded: true });
      };
      this.image.src = this.props.image;

      this.canvas.addEventListener('mousedown', this.handleMouseDown, false);
      this.canvas.addEventListener('touchstart', this.handleMouseDown, false);
      this.canvas.addEventListener('mousemove', this.handleMouseMove, false);
      this.canvas.addEventListener('touchmove', this.handleMouseMove, false);
      this.canvas.addEventListener('mouseup', this.handleMouseUp, false);
      this.canvas.addEventListener('touchend', this.handleMouseUp, false);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.canvas.removeEventListener('mousedown', this.handleMouseDown, false);
      this.canvas.removeEventListener('touchstart', this.handleMouseDown, false);
      this.canvas.removeEventListener('mousemove', this.handleMouseMove, false);
      this.canvas.removeEventListener('touchmove', this.handleMouseMove, false);
      this.canvas.removeEventListener('mouseup', this.handleMouseUp, false);
      this.canvas.removeEventListener('touchend', this.handleMouseUp, false);
    }
  }, {
    key: 'getFilledInPixels',
    value: function getFilledInPixels(stride) {
      if (!stride || stride < 1) {
        stride = 1;
      }

      var pixels = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
      var total = pixels.data.length / stride;
      var count = 0;

      for (var i = 0; i < pixels.data.length; i += stride) {
        if (parseInt(pixels.data[i], 10) === 0) {
          count++;
        }
      }

      return Math.round(count / total * 100);
    }
  }, {
    key: 'getMouse',
    value: function getMouse(e, canvas) {
      var offsetX = 0;
      var offsetY = 0;
      var mx = void 0,
          my = void 0;

      if (canvas.offsetParent !== undefined) {
        do {
          offsetX += canvas.offsetLeft;
          offsetY += canvas.offsetTop;
        } while (canvas = canvas.offsetParent);
      }

      mx = (e.pageX || e.touches[0].clientX) - offsetX;
      my = (e.pageY || e.touches[0].clientY) - offsetY;

      return { x: mx, y: my };
    }
  }, {
    key: 'distanceBetween',
    value: function distanceBetween(point1, point2) {
      return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
    }
  }, {
    key: 'angleBetween',
    value: function angleBetween(point1, point2) {
      return Math.atan2(point2.x - point1.x, point2.y - point1.y);
    }
  }, {
    key: 'handlePercentage',
    value: function handlePercentage() {
      var filledInPixels = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

      if (filledInPixels > this.props.finishPercent) {
        this.canvas.parentNode.removeChild(this.canvas);
        this.setState({ finished: true });
        if (this.props.onComplete) {
          this.props.onComplete();
        }
      }
    }
  }, {
    key: 'handleMouseDown',
    value: function handleMouseDown(e) {
      this.isDrawing = true;
      this.lastPoint = this.getMouse(e, this.canvas);
    }
  }, {
    key: 'handleMouseMove',
    value: function handleMouseMove(e) {
      if (!this.isDrawing) {
        return;
      }

      e.preventDefault();

      var currentPoint = this.getMouse(e, this.canvas);
      var distance = this.distanceBetween(this.lastPoint, currentPoint);
      var angle = this.angleBetween(this.lastPoint, currentPoint);

      var x = void 0,
          y = void 0;

      for (var i = 0; i < distance; i++) {
        x = this.lastPoint.x + Math.sin(angle) * i - 25;
        y = this.lastPoint.y + Math.cos(angle) * i - 25;
        this.ctx.globalCompositeOperation = 'destination-out';
        this.ctx.fillRect(x, y, 50, 50);
      }

      this.lastPoint = currentPoint;
      this.handlePercentage(this.getFilledInPixels(32));
    }
  }, {
    key: 'handleMouseUp',
    value: function handleMouseUp() {
      this.isDrawing = false;
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var containerStyle = {
        width: this.props.width + 'px',
        height: this.props.height + 'px',
        position: 'relative',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
        userSelect: 'none'
      };

      var canvasStyle = {
        position: 'absolute',
        top: 0
      };

      var resultStyle = {
        visibility: this.state.loaded ? 'visible' : 'hidden'
      };

      return _react2.default.createElement(
        'div',
        { className: 'ScratchCard__Container', style: containerStyle },
        _react2.default.createElement('canvas', {
          ref: function ref(_ref) {
            return _this3.canvas = _ref;
          },
          className: 'ScratchCard__Canvas',
          style: canvasStyle,
          width: this.props.width,
          height: this.props.height
        }),
        _react2.default.createElement(
          'div',
          { className: 'ScratchCard__Result', style: resultStyle },
          this.props.children
        )
      );
    }
  }]);

  return ScratchCard;
}(_react.Component);

ScratchCard.propTypes = {
  image: _react2.default.PropTypes.string.isRequired,
  width: _react2.default.PropTypes.number.isRequired,
  height: _react2.default.PropTypes.number.isRequired,
  finishPercent: _react2.default.PropTypes.number.isRequired,
  onComplete: _react2.default.PropTypes.func
};

exports.default = ScratchCard;