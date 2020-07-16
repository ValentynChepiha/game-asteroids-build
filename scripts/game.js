(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
  } else {
    obj[key] = value;
  }return obj;
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var Base = function () {
  function Base() {
    _classCallCheck(this, Base);
  }

  _createClass(Base, [{
    key: "coefficientK",
    value: function coefficientK(x1, y1, x2, y2) {
      return (y2 - y1) / (x2 - x1);
    }
  }, {
    key: "calculateDX",
    value: function calculateDX(speed, coefficientK) {
      return (speed ** 2 / (1 + coefficientK ** 2)) ** 0.5;
    }
  }, {
    key: "calculateDY",
    value: function calculateDY(dx, coefficientK) {
      return dx * coefficientK;
    }
  }, {
    key: "coefficientB",
    value: function coefficientB(x1, y1, x2, y2) {
      return y1 - x1 * this.coefficientK(x1, y1, x2, y2);
    }
  }, {
    key: "length",
    value: function length(x1, y1, x2, y2) {
      return ((x1 - x2) ** 2 + (y1 - y2) ** 2) ** 0.5;
    }
  }, {
    key: "toRadian",
    value: function toRadian(angle) {
      return angle * Math.PI / 180;
    }
  }, {
    key: "rotate",
    value: function rotate(x0, y0, x, y, angle) {
      return {
        x: x0 + (x - x0) * Math.cos(this.toRadian(angle)) - (y - y0) * Math.sin(this.toRadian(angle)),
        y: y0 + (x - x0) * Math.sin(this.toRadian(angle)) + (y - y0) * Math.cos(this.toRadian(angle))
      };
    }
  }, {
    key: "pointInc",
    value: function pointInc(point, dx, dy) {
      return { x: point.x + dx, y: point.y + dy };
    }
  }, {
    key: "pointDec",
    value: function pointDec(point, dx, dy) {
      return { x: point.x - dx, y: point.y - dy };
    }
  }, {
    key: "changeValue",
    value: function changeValue(flag, value, delta) {
      return value += flag ? -1 * delta : delta;
    }
  }, {
    key: "mutateObject",
    value: function mutateObject(object, ind, fn) {
      return object.map(function (el) {
        return _defineProperty({ x: el.x, y: el.y }, ind, fn(el[ind]));
      });
    }
  }, {
    key: "createObject",
    value: function createObject(tmpl, center) {
      var radius = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

      return tmpl.map(function (point) {
        return {
          x: center.x + point.x * radius,
          y: center.y + point.y * radius
        };
      });
    }
  }, {
    key: "pointBetweenTwoPoints",
    value: function pointBetweenTwoPoints(asteroid, line) {
      return this.betweenTwoValues(asteroid.x, line[0].x, line[1].x) || this.betweenTwoValues(asteroid.y, line[0].y, line[1].y);
    }
  }, {
    key: "betweenTwoValues",
    value: function betweenTwoValues(a, b, c) {
      var _ref2 = [Math.min(b, c), Math.max(b, c)];
      b = _ref2[0];
      c = _ref2[1];

      return a >= b && a <= c;
    }
  }, {
    key: "lineAcrossAsteroid",
    value: function lineAcrossAsteroid(asteroid, line) {
      var dx1 = line[0].x - asteroid.x;
      var dy1 = line[0].y - asteroid.y;

      var dx2 = line[1].x - asteroid.x;
      var dy2 = line[1].y - asteroid.y;

      var dx = dx1 - dx2;
      var dy = dy1 - dy2;

      var a = dx ** 2 + dy ** 2;
      var b = 2 * (dx1 * dx + dy1 * dy);
      var c = dx1 ** 2 + dy1 ** 2 - (asteroid.radius * 0.9) ** 2;

      var d = b ** 2 - 4 * a * c;

      if (d < 0) {
        return false;
      }

      var x1 = (-b + d ** 0.5) / (4 * a);
      var x2 = (-b - d ** 0.5) / (4 * a);

      return (x1 >= 0 && x1 <= 1 || x1 >= 0 && x2 <= 1) && d > 0;
    }
  }]);

  return Base;
}();

exports.default = Base;

},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var COLOR_ASTEROID = exports.COLOR_ASTEROID = "#959595";
var COLOR_SHIP = exports.COLOR_SHIP = "#6e7bd0";
var COLOR_FIRE = exports.COLOR_FIRE = "#d05018";
var COLOR_BULLET = exports.COLOR_BULLET = "#fff805";
var COLOR_TEXT = exports.COLOR_TEXT = "#06ff4c";
var COLOR_BOOM = exports.COLOR_BOOM = "#ff921a";

var COUNT_LIVE = exports.COUNT_LIVE = 3;

var LENGTH_PATH_BULLET = exports.LENGTH_PATH_BULLET = 400;

var SPEED_BULLET = exports.SPEED_BULLET = 5;
var SPEED_SPACE_SHIP = exports.SPEED_SPACE_SHIP = 3;
var SPEED_ROTATION_SHIP = exports.SPEED_ROTATION_SHIP = 3;

var LIST_RADIUS = exports.LIST_RADIUS = [10, 20, 30];
var START_ANGLE = exports.START_ANGLE = 180;

var SHOW_DIED_ASTEROID = exports.SHOW_DIED_ASTEROID = 100;
var SHOW_BORN_SPACE_SHIP = exports.SHOW_BORN_SPACE_SHIP = 1000;

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

var _spaceShip = require("../objects/spaceShip");

var _spaceShip2 = _interopRequireDefault(_spaceShip);

var _cloud = require("../objects/cloud");

var _cloud2 = _interopRequireDefault(_cloud);

var _constants = require("./constants");

var CONST = _interopRequireWildcard(_constants);

var _levels = require("./levels");

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  } else {
    var newObj = {};if (obj != null) {
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
      }
    }newObj.default = obj;return newObj;
  }
}

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _toConsumableArray(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }return arr2;
  } else {
    return Array.from(arr);
  }
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var Game = function () {
  function Game() {
    _classCallCheck(this, Game);

    this.container = document.getElementById("content");
    this.canvas = document.getElementById("canvas");
    this.ctx = this.canvas.getContext("2d");

    this.footer = document.getElementById("footer");
    this.playAgain = document.getElementById("play-again");

    this.prevUpdateTime = 0;
    this.height = 0;
    this.width = 0;

    this.level = 0;
    this.live = CONST.COUNT_LIVE;
    this.score = 0;

    this.asteroids = [];
    this.bullets = [];

    this.showSpaseShip = true;
    this.animation = '';

    this.init();
  }

  _createClass(Game, [{
    key: "init",
    value: function init() {
      var _this = this;

      window.addEventListener("resize", function (x) {
        return _this.onResize();
      });
      this.playAgain.addEventListener('click', function (e) {
        return _this.restart();
      });

      this.start();
    }
  }, {
    key: "start",
    value: function start() {
      var _this2 = this;

      this.footer.style.display = "none";

      window.addEventListener("keydown", function (e) {
        return _this2.onKeydown(e);
      });
      window.addEventListener("keyup", function (e) {
        return _this2.onKeyup(e);
      });
      this.onResize();

      this.ctx.clearRect(0, 0, this.width, this.height);
      this.cloud = new _cloud2.default(this.width, this.height, _levels.LEVELS[this.level]);
      this.asteroids = this.cloud.asteroids;
      this.spaceShip = new _spaceShip2.default(this.width / 2, this.height / 2);

      requestAnimationFrame(function (time) {
        return _this2.update(time);
      });
    }
  }, {
    key: "restart",
    value: function restart() {

      window.location.reload();
    }
  }, {
    key: "draw",
    value: function draw() {
      var _this3 = this;

      if (!this.live) {
        this.gameOver();
        return this;
      }

      if (this.score > _levels.LEVELS[this.level].score) {
        this.level += 1;
      }

      var newAsteroids = [];

      if (!this.asteroids.length) {
        this.asteroids = this.cloud.refresh(this.width, this.height, _levels.LEVELS[this.level]).asteroids;
      }

      if (this.spaceShip.born) {
        this.showSpaseShip = !this.showSpaseShip;
        if (this.prevUpdateTime - this.spaceShip.born >= CONST.SHOW_BORN_SPACE_SHIP) {
          this.spaceShip.born = 0;
          this.showSpaseShip = true;
        }
      }

      if (this.spaceShip.died) {
        this.live -= 1;
        this.spaceShip = new _spaceShip2.default(this.width / 2, this.height / 2);
        this.spaceShip.born = this.prevUpdateTime;
      }

      for (var i = 0; i < this.asteroids.length; i += 1) {
        this.asteroids[i].move(this.width, this.height);
        if (this.asteroids[i].died && !this.asteroids[i].timeDied) {
          this.asteroids[i].timeDied = this.prevUpdateTime;
          newAsteroids.push.apply(newAsteroids, _toConsumableArray(this.createFragmentsAsteroid(this.asteroids[i])));
        }
        this.drawPolygon(this.asteroids[i].body, this.asteroids[i].currentColor);
      }

      if (newAsteroids.length) {
        var _asteroids;

        (_asteroids = this.asteroids).push.apply(_asteroids, newAsteroids);
      }

      this.asteroids = this.asteroids.filter(function (asteroid) {
        return !asteroid.died || asteroid.died && _this3.prevUpdateTime - asteroid.timeDied < CONST.SHOW_DIED_ASTEROID;
      });

      this.spaceShip.move(this.width, this.height);

      if (this.showSpaseShip) {
        this.drawSpaceShip();
      }

      this.bullets = this.bullets.filter(function (bullet) {
        return bullet.alive;
      });

      for (var _i = 0; _i < this.bullets.length; _i += 1) {
        this.bullets[_i].move(this.width, this.height);
        this.drawPolygon(this.bullets[_i].body, CONST.COLOR_BULLET);
      }

      this.drawLives();
      this.drawScore();

      this.collisions();
    }
  }, {
    key: "drawSpaceShip",
    value: function drawSpaceShip() {
      this.drawPolygon(this.spaceShip.body, this.spaceShip.colorBody);
      if (this.spaceShip.isMoving) {
        this.drawPolygon(this.spaceShip.fire, this.spaceShip.colorFire);
      }
    }
  }, {
    key: "createFragmentsAsteroid",
    value: function createFragmentsAsteroid(asteroid) {
      var currentRadius = asteroid.currentRadius;
      var newIndex = CONST.LIST_RADIUS.indexOf(currentRadius) - 1;
      this.score += currentRadius;
      if (newIndex > -1) {
        var newRadius = CONST.LIST_RADIUS[newIndex];
        return [this.cloud.newAsteroid(asteroid.center, newRadius), this.cloud.newAsteroid(asteroid.center, newRadius)];
      }
      return [];
    }
  }, {
    key: "collisions",
    value: function collisions() {
      for (var i = 0; i < this.asteroids.length; i += 1) {
        if (this.asteroids[i].died) {
          continue;
        }
        for (var j = 0; j < this.bullets.length; j += 1) {
          var flag = this.collisionAsteroidBullet(this.asteroids[i], this.bullets[j]);
          if (flag) {
            this.asteroids[i].hitInc = 1;
            this.bullets[j].died = flag;
          }
        }

        if (!this.spaceShip.born || this.prevUpdateTime - this.spaceShip.born >= CONST.SHOW_BORN_SPACE_SHIP) {
          this.collisionAsteroidShip(this.asteroids[i], this.spaceShip);
        }
      }
    }
  }, {
    key: "collisionAsteroidBullet",
    value: function collisionAsteroidBullet(asteroid, bullet) {
      var ab = bullet.length(asteroid.x, asteroid.y, bullet.x, bullet.y);
      return ab < asteroid.radius + bullet.radius + 2;
    }
  }, {
    key: "collisionAsteroidShip",
    value: function collisionAsteroidShip(asteroid, spaceShip) {
      var lines = spaceShip.lines;
      for (var i = 0; i < lines.length; i += 1) {
        if (asteroid.pointBetweenTwoPoints(asteroid, lines[i])) {
          if (asteroid.lineAcrossAsteroid(asteroid, lines[i])) {
            spaceShip.died = true;
          }
        }
      }
    }
  }, {
    key: "drawPolygon",
    value: function drawPolygon(polygon, color) {
      this.ctx.beginPath();
      this.ctx.fillStyle = color;
      this.ctx.moveTo(polygon[polygon.length - 1].x, polygon[polygon.length - 1].y);
      for (var i = 0; i < polygon.length; i += 1) {
        this.ctx.lineTo(polygon[i].x, polygon[i].y);
      }
      this.ctx.fill();
      this.ctx.closePath();
    }
  }, {
    key: "drawScore",
    value: function drawScore() {
      this.ctx.textAlign = "left";
      this.ctx.font = "24px Arial";
      this.ctx.fillStyle = CONST.COLOR_TEXT;
      this.ctx.fillText("Score: " + this.score, 8, 30);
    }
  }, {
    key: "drawLives",
    value: function drawLives() {
      this.ctx.textAlign = "left";
      this.ctx.font = "24px Arial";
      this.ctx.fillStyle = CONST.COLOR_TEXT;
      this.ctx.fillText("Lives: " + this.live, this.width - 110, 30);
    }
  }, {
    key: "onResize",
    value: function onResize() {
      this.width = this.container.clientWidth;
      this.height = this.container.clientHeight;

      this.canvas.width = this.width;
      this.canvas.height = this.height;
    }
  }, {
    key: "onKeydown",
    value: function onKeydown(e) {
      if (e.code === "Space") {
        this.bullets.push(this.spaceShip.shot());
      }
      if (e.code === "ArrowLeft") {
        this.spaceShip.isTurnLeft = true;
      }
      if (e.code === "ArrowRight") {
        this.spaceShip.isTurnRight = true;
      }
      if (e.code === "ArrowUp") {
        this.spaceShip.isMoving = true;
      }
    }
  }, {
    key: "onKeyup",
    value: function onKeyup(e) {
      if (e.code === "ArrowLeft") {
        this.spaceShip.isTurnLeft = false;
      }
      if (e.code === "ArrowRight") {
        this.spaceShip.isTurnRight = false;
      }
      if (e.code === "ArrowUp") {
        this.spaceShip.isMoving = false;
      }
    }
  }, {
    key: "update",
    value: function update(time) {
      var _this4 = this;

      var dt = time - this.prevUpdateTime;
      this.prevUpdateTime = time;
      this.ctx.clearRect(0, 0, this.width, this.height);
      this.draw();
      this.animation = requestAnimationFrame(function (time) {
        return _this4.update(time);
      });
    }
  }, {
    key: "gameOver",
    value: function gameOver() {
      var _this5 = this;

      window.cancelAnimationFrame(this.animation);
      window.removeEventListener("keydown", function (e) {
        return _this5.onKeydown(e);
      });
      window.removeEventListener("keyup", function (e) {
        return _this5.onKeyup(e);
      });

      this.footer.style.display = "block";

      this.ctx.clearRect(0, 0, this.width, this.height);
      this.ctx.font = "48px Arial";
      this.ctx.fillStyle = CONST.COLOR_TEXT;
      this.ctx.textAlign = "center";
      this.ctx.fillText("You score: " + this.score, this.width / 2, this.height / 2 - 80);
      this.ctx.font = "72px Arial";
      this.ctx.fillStyle = CONST.COLOR_TEXT;
      this.ctx.fillText("Game over", this.width / 2, this.height / 2);
    }
  }]);

  return Game;
}();

exports.default = Game;

},{"../objects/cloud":9,"../objects/spaceShip":10,"./constants":2,"./levels":4}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var LEVELS = exports.LEVELS = [{
  count: 7,
  maxSpeed: 2,
  score: 500
}, {
  count: 8,
  maxSpeed: 2,
  score: 1000
}, {
  count: 8,
  maxSpeed: 3,
  score: 2000
}, {
  count: 10,
  maxSpeed: 3,
  score: 3000
}, {
  count: 13,
  maxSpeed: 4,
  score: Infinity
}];

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var TMPL_ASTEROID = exports.TMPL_ASTEROID = [{ x: 6, y: -7 }, { x: 7, y: -6 }, { x: 8, y: -5 }, { x: 9, y: -4 }, { x: 8, y: 6 }, { x: -6, y: 8 }, { x: -5, y: 6 }, { x: -7, y: 7 }, { x: -8, y: 1 }, { x: -8, y: -2 }, { x: -8, y: -6 }, { x: -4, y: -9 }];

var TMPL_BOOM = exports.TMPL_BOOM = [{ x: 7, y: -1 }, { x: 2, y: 1 }, { x: 5, y: 5 }, { x: 1, y: 2 }, { x: 0, y: 8 }, { x: -1, y: 2 }, { x: -4, y: 4 }, { x: -2, y: 1 }, { x: -8, y: 0 }, { x: -2, y: -1 }, { x: -5, y: -4 }, { x: -1, y: -3 }, { x: 1, y: -9 }, { x: 1, y: -2 }, { x: 5, y: -5 }, { x: 2, y: -1 }];

var TMPL_SPACE_SHIP = exports.TMPL_SPACE_SHIP = [{ x: 0, y: -20 }, { x: 15, y: 17 }, { x: 7, y: 10 }, { x: -7, y: 10 }, { x: -15, y: 17 }];

var TMPL_FIRE = exports.TMPL_FIRE = [{ x: 5, y: 10 }, { x: 0, y: 20 }, { x: -5, y: 10 }];

var TMPL_BULLET = exports.TMPL_BULLET = [{ x: 2, y: -2 }, { x: -2, y: -2 }, { x: -2, y: 2 }, { x: 2, y: 2 }];

},{}],6:[function(require,module,exports){
'use strict';

var _game = require('./core/game');

var _game2 = _interopRequireDefault(_game);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

new _game2.default();

},{"./core/game":3}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

var _base = require("../core/base");

var _base2 = _interopRequireDefault(_base);

var _objects = require("../core/objects");

var _constants = require("../core/constants");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }return call && (typeof call === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var Asteroid = function (_Base) {
  _inherits(Asteroid, _Base);

  function Asteroid(x, y, radius, angle, maxSpeed) {
    _classCallCheck(this, Asteroid);

    var _this = _possibleConstructorReturn(this, (Asteroid.__proto__ || Object.getPrototypeOf(Asteroid)).call(this));

    _this.x = x;
    _this.y = y;
    _this.radius = radius;
    _this.angle = angle;
    _this.maxSpeed = maxSpeed;
    _this.health = String(_this.radius)[0] * 1;
    _this.hit = 0;

    _this.speed = {};
    _this.isDied = false;
    _this.time = 0;
    _this.color = _constants.COLOR_ASTEROID;
    _this.init();
    return _this;
  }

  _createClass(Asteroid, [{
    key: "init",
    value: function init() {
      var dir = Math.random() > 0.5 ? -1 : 1;
      var value = Math.ceil(Math.random() * this.maxSpeed);
      this.speed.moveX = dir * value;

      dir = Math.random() > 0.5 ? -1 : 1;
      value = Math.ceil(Math.random() * this.maxSpeed);
      this.speed.moveY = dir * value;

      value = Math.ceil(Math.random() * 11);
      this.speed.rotation = dir * value;
    }
  }, {
    key: "moveX",
    value: function moveX(maxX) {
      if (!this.speed.moveX) {
        return this;
      }

      this.x += this.speed.moveX;
      if (this.x > maxX) {
        this.x = 0;
      }

      if (this.x < 0) {
        this.x = maxX;
      }
      return this;
    }
  }, {
    key: "moveY",
    value: function moveY(maxY) {
      if (!this.speed.moveY) {
        return this;
      }

      this.y += this.speed.moveY;
      if (this.y > maxY) {
        this.y = 0;
      }

      if (this.y < 0) {
        this.y = maxY;
      }

      return this;
    }
  }, {
    key: "calculateBody",
    value: function calculateBody() {
      var _this2 = this;

      this.angle += this.speed.rotation;
      this.angle = this.angle % 360;

      this.bodyCoord = this.createObject(_objects.TMPL_ASTEROID, this, this.health);
      this.bodyCoord = this.bodyCoord.map(function (el) {
        return _this2.rotate(_this2.x, _this2.y, el.x, el.y, _this2.angle);
      });
      return this;
    }
  }, {
    key: "calculateBoom",
    value: function calculateBoom() {
      this.bodyCoord = this.createObject(_objects.TMPL_BOOM, this, this.health);
    }
  }, {
    key: "move",
    value: function move(maxX, maxY) {
      if (this.hit >= this.health) {
        this.isDied = true;
        this.color = _constants.COLOR_BOOM;
        this.calculateBoom();
        return this;
      }

      return this.moveX(maxX).moveY(maxY).calculateBody();
    }
  }, {
    key: "hitInc",
    set: function set(value) {
      this.hit += value;
    }
  }, {
    key: "body",
    get: function get() {
      return this.bodyCoord;
    }
  }, {
    key: "died",
    get: function get() {
      return this.isDied;
    }
  }, {
    key: "timeDied",
    get: function get() {
      return this.time;
    },
    set: function set(time) {
      this.time = time;
    }
  }, {
    key: "center",
    get: function get() {
      return { x: this.x, y: this.y };
    }
  }, {
    key: "currentRadius",
    get: function get() {
      return this.radius;
    }
  }, {
    key: "currentColor",
    get: function get() {
      return this.color;
    }
  }]);

  return Asteroid;
}(_base2.default);

exports.default = Asteroid;

},{"../core/base":1,"../core/constants":2,"../core/objects":5}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

var _base = require("../core/base");

var _base2 = _interopRequireDefault(_base);

var _constants = require("../core/constants");

var _objects = require("../core/objects");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }return call && (typeof call === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var Bullet = function (_Base) {
  _inherits(Bullet, _Base);

  function Bullet(_ref, x0, y0) {
    var x = _ref.x,
        y = _ref.y;

    _classCallCheck(this, Bullet);

    var _this = _possibleConstructorReturn(this, (Bullet.__proto__ || Object.getPrototypeOf(Bullet)).call(this));

    _this.x = x;
    _this.y = y;
    _this.ship = { x0: x0, y0: y0 };
    _this.speed = _constants.SPEED_BULLET;

    _this.dx = 0;
    _this.dy = 0;

    _this.isDied = false;
    _this.maxLengthPath = _constants.LENGTH_PATH_BULLET;
    _this.lengthPath = 0;

    _this.init();
    return _this;
  }

  _createClass(Bullet, [{
    key: "init",
    value: function init() {
      this.bulletCoord = this.calculateBody();
      this.k = this.coefficientK(this.ship.x0, this.ship.y0, this.x, this.y);
      this.calculateDelta(this.k);
    }
  }, {
    key: "calculateDelta",
    value: function calculateDelta(coefficientK) {
      var dirCondition = void 0;

      if (Math.abs(coefficientK) === Infinity) {
        dirCondition = this.ship.y0 > this.y;
        this.dx = 0;
        this.dy = this.speed * (dirCondition ? -1 : 1);
        return;
      }

      dirCondition = this.ship.x0 > this.x;

      if (!coefficientK) {
        this.dx = this.speed * (dirCondition ? -1 : 1);
        this.dy = 0;
        return;
      }

      this.dx = (dirCondition ? -1 : 1) * this.calculateDX(this.speed, coefficientK);
      this.dy = this.calculateDY(this.dx, coefficientK);
    }
  }, {
    key: "calculateBody",
    value: function calculateBody() {
      return this.createObject(_objects.TMPL_BULLET, this);
    }
  }, {
    key: "beforeZero",
    value: function beforeZero(ind, max) {
      if (this[ind] < 0) {
        this.bulletCoord = this.mutateObject(this.bulletCoord, ind, function (value) {
          return max + value;
        });
        this[ind] = max;
      }
      return this;
    }
  }, {
    key: "afterMax",
    value: function afterMax(ind, max) {
      if (this[ind] > max) {
        this.bulletCoord = this.mutateObject(this.bulletCoord, ind, function (value) {
          return value - max;
        });
        this[ind] = 0;
      }
      return this;
    }
  }, {
    key: "move",
    value: function move(maxX, maxY) {
      var _this2 = this;

      if (this.lengthPath > this.maxLengthPath) {
        this.isDied = true;
        return;
      }

      this.beforeZero("x", maxX).afterMax("x", maxX).beforeZero("y", maxY).afterMax("y", maxY);

      this.lengthPath += this.speed;
      this.bulletCoord = this.bulletCoord.map(function (el) {
        return _this2.pointInc(el, _this2.dx, _this2.dy);
      });
      this.x += this.dx;
      this.y += this.dy;
    }
  }, {
    key: "died",
    set: function set(flag) {
      this.isDied = flag;
    }
  }, {
    key: "body",
    get: function get() {
      return this.bulletCoord;
    }
  }, {
    key: "alive",
    get: function get() {
      return !this.isDied;
    }
  }, {
    key: "radius",
    get: function get() {
      return this.length(this.x, this.y, this.bulletCoord[0].x, this.bulletCoord[0].y);
    }
  }]);

  return Bullet;
}(_base2.default);

exports.default = Bullet;

},{"../core/base":1,"../core/constants":2,"../core/objects":5}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

var _asteroid = require("./asteroid");

var _asteroid2 = _interopRequireDefault(_asteroid);

var _constants = require("../core/constants");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _toConsumableArray(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }return arr2;
  } else {
    return Array.from(arr);
  }
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var Cloud = function () {
  function Cloud(width, height, params) {
    _classCallCheck(this, Cloud);

    this.count = params.count;
    this.maxSpeed = params.maxSpeed;
    this.cloud = [];
    this.width = width;
    this.height = height;
    this.listRadius = _constants.LIST_RADIUS;
    this.startAngle = _constants.START_ANGLE;
    this.init();
  }

  _createClass(Cloud, [{
    key: "init",
    value: function init() {
      this.generate(this.count);
    }
  }, {
    key: "refresh",
    value: function refresh(width, height, params) {
      this.count = params.count;
      this.maxSpeed = params.maxSpeed;
      this.width = width;
      this.height = height;
      this.cloud.length = 0;
      this.init();
      return this;
    }
  }, {
    key: "generate",
    value: function generate(n) {
      this.cloud.length = 0;
      for (var i = 0; i < n; i += 1) {
        this.cloud.push(this.addAsteroid());
      }
    }
  }, {
    key: "addAsteroid",
    value: function addAsteroid() {
      var radius = this.listRadius[Math.trunc(Math.random() * this.listRadius.length)];
      var angle = Math.trunc(Math.random() * this.startAngle);
      var x = 0;
      var y = 0;

      var variant = Math.random() > 0.5 ? 1 : 0;

      if (variant) {
        x = Math.random() > 0.5 ? this.width : 0;
        y = Math.random() * this.height;
      } else {
        x = Math.random() * this.width;
        y = Math.random() > 0.5 ? this.height : 0;
      }

      return new _asteroid2.default(x, y, radius, angle, this.maxSpeed);
    }
  }, {
    key: "newAsteroid",
    value: function newAsteroid(center, radius) {
      var angle = Math.trunc(Math.random() * this.startAngle);
      return new _asteroid2.default(center.x, center.y, radius, angle, this.maxSpeed);
    }
  }, {
    key: "asteroids",
    get: function get() {
      return [].concat(_toConsumableArray(this.cloud));
    }
  }]);

  return Cloud;
}();

exports.default = Cloud;

},{"../core/constants":2,"./asteroid":7}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

var _bullet = require("./bullet");

var _bullet2 = _interopRequireDefault(_bullet);

var _base = require("../core/base");

var _base2 = _interopRequireDefault(_base);

var _constants = require("../core/constants");

var _objects = require("../core/objects");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }return call && (typeof call === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var SpaceShip = function (_Base) {
  _inherits(SpaceShip, _Base);

  function SpaceShip(x, y) {
    _classCallCheck(this, SpaceShip);

    var _this = _possibleConstructorReturn(this, (SpaceShip.__proto__ || Object.getPrototypeOf(SpaceShip)).call(this));

    _this.x = x;
    _this.y = y;
    _this.speed = _constants.SPEED_SPACE_SHIP;
    _this.rotation = _constants.SPEED_ROTATION_SHIP;

    _this.colorBody = _constants.COLOR_SHIP;
    _this.colorFire = _constants.COLOR_FIRE;

    _this.timeBorn = 0;
    _this.isDied = false;
    _this.isMoving = false;
    _this.isTurnLeft = false;
    _this.isTurnRight = false;
    _this.init();
    return _this;
  }

  _createClass(SpaceShip, [{
    key: "init",
    value: function init() {
      this.calculateBody().calculateFire();
    }
  }, {
    key: "calculateBody",
    value: function calculateBody() {
      this.bodyCoord = this.createObject(_objects.TMPL_SPACE_SHIP, this);
      return this;
    }
  }, {
    key: "calculateFire",
    value: function calculateFire() {
      this.fireCoord = this.createObject(_objects.TMPL_FIRE, this);
      return this;
    }
  }, {
    key: "shot",
    value: function shot() {
      return new _bullet2.default(this.bodyCoord[0], this.x, this.y);
    }
  }, {
    key: "move",
    value: function move(maxX, maxY) {
      if (this.isDied) {
        this.bodyCoord = this.createObject(_objects.TMPL_BOOM, this, _constants.LIST_RADIUS[_constants.LIST_RADIUS.length - 1]);
        this.fireCoord = this.createObject(_objects.TMPL_BOOM, this, _constants.LIST_RADIUS[0]);
        this.colorBody = _constants.COLOR_BOOM;
        return this;
      }

      if (this.isMoving) {
        this.calculateMove(maxX, maxY);
      }
      if (this.isTurnLeft) {
        this.rotateLeft();
      }
      if (this.isTurnRight) {
        this.rotateRight();
      }
    }
  }, {
    key: "rotateRight",
    value: function rotateRight() {
      var _this2 = this;

      this.bodyCoord = this.bodyCoord.map(function (el) {
        return _this2.rotate(_this2.x, _this2.y, el.x, el.y, _this2.rotation);
      });
      this.fireCoord = this.fireCoord.map(function (el) {
        return _this2.rotate(_this2.x, _this2.y, el.x, el.y, _this2.rotation);
      });
      return this;
    }
  }, {
    key: "rotateLeft",
    value: function rotateLeft() {
      var _this3 = this;

      this.bodyCoord = this.bodyCoord.map(function (el) {
        return _this3.rotate(_this3.x, _this3.y, el.x, el.y, -1 * _this3.rotation);
      });
      this.fireCoord = this.fireCoord.map(function (el) {
        return _this3.rotate(_this3.x, _this3.y, el.x, el.y, -1 * _this3.rotation);
      });
      return this;
    }
  }, {
    key: "beforeZero",
    value: function beforeZero(ind, max) {
      if (this[ind] < 0) {
        this.bodyCoord = this.mutateObject(this.bodyCoord, ind, function (value) {
          return max + value;
        });
        this.fireCoord = this.mutateObject(this.fireCoord, ind, function (value) {
          return max + value;
        });
        this[ind] = max;
      }
      return this;
    }
  }, {
    key: "afterMax",
    value: function afterMax(ind, max) {
      if (this[ind] > max) {
        this.bodyCoord = this.mutateObject(this.bodyCoord, ind, function (value) {
          return value - max;
        });
        this.fireCoord = this.mutateObject(this.fireCoord, ind, function (value) {
          return value - max;
        });
        this[ind] = 0;
      }
      return this;
    }
  }, {
    key: "calculateMove",
    value: function calculateMove(maxX, maxY) {
      this.beforeZero("x", maxX).afterMax("x", maxX).beforeZero("y", maxY).afterMax("y", maxY);

      var coefficientK = this.coefficientK(this.x, this.y, this.bodyCoord[0].x, this.bodyCoord[0].y);

      if (Math.abs(coefficientK) === Infinity) {
        this.lineX();
        return this;
      }
      if (!coefficientK) {
        this.lineY();
        return this;
      }
      this.lineXY(coefficientK);

      return this;
    }
  }, {
    key: "lineXY",
    value: function lineXY(coefficientK) {
      var _this4 = this;

      var dx = this.calculateDX(this.speed, coefficientK);
      var dy = this.calculateDY(dx, coefficientK);

      var dirCondition = this.x > this.bodyCoord[0].x;

      this.bodyCoord = this.bodyCoord.map(function (el) {
        return dirCondition ? _this4.pointDec(el, dx, dy) : _this4.pointInc(el, dx, dy);
      });
      this.fireCoord = this.fireCoord.map(function (el) {
        return dirCondition ? _this4.pointDec(el, dx, dy) : _this4.pointInc(el, dx, dy);
      });

      this.x = this.changeValue(dirCondition, this.x, dx);
      this.y = this.changeValue(dirCondition, this.y, dy);
    }
  }, {
    key: "lineX",
    value: function lineX() {
      var _this5 = this;

      var dirCondition = this.y > this.bodyCoord[0].y;

      this.bodyCoord = this.mutateObject(this.bodyCoord, "y", function (value) {
        return _this5.changeValue(dirCondition, value, _this5.speed);
      });

      this.fireCoord = this.mutateObject(this.fireCoord, "y", function (value) {
        return _this5.changeValue(dirCondition, value, _this5.speed);
      });

      this.y = this.changeValue(dirCondition, this.y, this.speed);
    }
  }, {
    key: "lineY",
    value: function lineY() {
      var _this6 = this;

      var dirCondition = this.x > this.bodyCoord[0].x;

      this.bodyCoord = this.mutateObject(this.bodyCoord, "x", function (value) {
        return _this6.changeValue(dirCondition, value, _this6.speed);
      });

      this.fireCoord = this.mutateObject(this.fireCoord, "x", function (value) {
        return _this6.changeValue(dirCondition, value, _this6.speed);
      });

      this.x = this.changeValue(dirCondition, this.x, this.speed);
    }
  }, {
    key: "lines",
    get: function get() {
      return [[this.bodyCoord[0], this.bodyCoord[1]], [this.bodyCoord[1], this.bodyCoord[this.bodyCoord.length - 1]], [this.bodyCoord[this.bodyCoord.length - 1], this.bodyCoord[0]]];
    }
  }, {
    key: "body",
    get: function get() {
      return this.bodyCoord;
    }
  }, {
    key: "fire",
    get: function get() {
      return this.fireCoord;
    }
  }, {
    key: "died",
    set: function set(flag) {
      this.isDied = flag;
    },
    get: function get() {
      return this.isDied;
    }
  }, {
    key: "born",
    set: function set(time) {
      this.timeBorn = time;
    },
    get: function get() {
      return this.timeBorn;
    }
  }]);

  return SpaceShip;
}(_base2.default);

exports.default = SpaceShip;

},{"../core/base":1,"../core/constants":2,"../core/objects":5,"./bullet":8}]},{},[6])
//# sourceMappingURL=game.js.map
