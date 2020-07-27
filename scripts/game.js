(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
  } else {
    obj[key] = value;
  }return obj;
}

var buildBase = exports.buildBase = function buildBase() {
  return {
    coefficientK: function coefficientK(x1, y1, x2, y2) {
      return (y2 - y1) / (x2 - x1);
    },

    calculateDX: function calculateDX(speed, coefficientK) {
      return (speed ** 2 / (1 + coefficientK ** 2)) ** 0.5;
    },

    calculateDY: function calculateDY(dx, coefficientK) {
      return dx * coefficientK;
    },

    coefficientB: function coefficientB(x1, y1, x2, y2) {
      return y1 - x1 * this.coefficientK(x1, y1, x2, y2);
    },

    length: function length(x1, y1, x2, y2) {
      return ((x1 - x2) ** 2 + (y1 - y2) ** 2) ** 0.5;
    },

    toRadian: function toRadian(angle) {
      return angle * Math.PI / 180;
    },

    rotate: function rotate(x0, y0, x, y, angle) {
      return {
        x: x0 + (x - x0) * Math.cos(this.toRadian(angle)) - (y - y0) * Math.sin(this.toRadian(angle)),
        y: y0 + (x - x0) * Math.sin(this.toRadian(angle)) + (y - y0) * Math.cos(this.toRadian(angle))
      };
    },

    pointInc: function pointInc(point, dx, dy) {
      return { x: point.x + dx, y: point.y + dy };
    },

    pointDec: function pointDec(point, dx, dy) {
      return { x: point.x - dx, y: point.y - dy };
    },

    changeValue: function changeValue(flag, value, delta) {
      return value += flag ? -1 * delta : delta;
    },

    mutateObject: function mutateObject(object, ind, fn) {
      return object.map(function (el) {
        return _defineProperty({ x: el.x, y: el.y }, ind, fn(el[ind]));
      });
    },

    createObject: function createObject(tmpl, center) {
      var radius = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

      return tmpl.map(function (point) {
        return {
          x: center.x + point.x * radius,
          y: center.y + point.y * radius
        };
      });
    },

    pointBetweenTwoPoints: function pointBetweenTwoPoints(asteroid, line) {
      return this.betweenTwoValues(asteroid.x, line[0].x, line[1].x) || this.betweenTwoValues(asteroid.y, line[0].y, line[1].y);
    },

    betweenTwoValues: function betweenTwoValues(a, b, c) {
      var _ref2 = [Math.min(b, c), Math.max(b, c)];
      b = _ref2[0];
      c = _ref2[1];

      return a >= b && a <= c;
    },

    lineAcrossAsteroid: function lineAcrossAsteroid(_ref3, radius, line) {
      var x = _ref3.x,
          y = _ref3.y;

      var dx1 = line[0].x - x;
      var dy1 = line[0].y - y;

      var dx2 = line[1].x - x;
      var dy2 = line[1].y - y;

      var dx = dx1 - dx2;
      var dy = dy1 - dy2;

      var a = dx ** 2 + dy ** 2;
      var b = 2 * (dx1 * dx + dy1 * dy);
      var c = dx1 ** 2 + dy1 ** 2 - (radius * 0.9) ** 2;

      var d = b ** 2 - 4 * a * c;

      if (d < 0) {
        return false;
      }

      var x1 = (-b + d ** 0.5) / (4 * a);
      var x2 = (-b - d ** 0.5) / (4 * a);

      return (x1 >= 0 && x1 <= 1 || x1 >= 0 && x2 <= 1) && d > 0;
    }
  };
};

},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var buildConstants = exports.buildConstants = function buildConstants() {
    return {
        COLOR_SHIP: "#6e7bd0",
        COLOR_ASTEROID: "#959595",
        COLOR_FIRE: "#d05018",
        COLOR_BULLET: "#fff805",
        COLOR_TEXT: "#06ff4c",
        COLOR_BOOM: "#ff921a",

        COUNT_LIVE: 3,

        LENGTH_PATH_BULLET: 400,
        MAX_SPEED_ROTATION_ASTEROID: 10,

        SPEED_BULLET: 5,
        SPEED_SPACE_SHIP: 3,
        SPEED_ROTATION_SHIP: 3,

        LIST_RADIUS: [10, 20, 30],
        START_ANGLE: 180,

        SHOW_DIED_ASTEROID: 100,
        SHOW_BORN_SPACE_SHIP: 1000
    };
};

},{}],3:[function(require,module,exports){
"use strict";

var _constants = require("./constants");

var _levels = require("./levels");

var _base = require("./base");

var _objects = require("./objects");

var _cloud = require("../objects/cloud");

var _spaceShip = require("../objects/spaceShip");

function _toConsumableArray(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }return arr2;
  } else {
    return Array.from(arr);
  }
}

(function () {
  var Game = Game || {};

  Game.builder = function (namespace, value) {
    var path = namespace.split(".");

    if (path[0] === "Game") {
      path = path.slice(1);
    }

    return path.reduce(function (parent, element) {
      if (typeof parent[element] === "undefined") {
        parent[element] = {};
      }
      return parent[element];
    });
  };

  Game.builder("constants");
  Game.constants = (0, _constants.buildConstants)();
  Game.builder("levels");
  Game.levels = (0, _levels.buildLevels)();
  Game.builder("Game.base");
  Game.base = (0, _base.buildBase)();
  Game.builder("templates");
  Game.templates = (0, _objects.buildObjects)();

  var container = document.getElementById("content");
  var canvas = document.getElementById("canvas");
  var footer = document.getElementById("footer");
  var playAgain = document.getElementById("play-again");

  var ctx = canvas.getContext("2d");

  var asteroids = [];
  var bullets = [];
  var showSpaceShip = true;
  var animation = "";

  var spaceShip = {};
  var cloud = {};

  var prevUpdateTime = 0;
  var height = 0;
  var width = 0;

  var level = 0;
  var score = 0;
  var live = 3;

  Game.init = function () {
    window.addEventListener("resize", function (x) {
      return Game.onResize();
    });
    playAgain.addEventListener("click", function (e) {
      return Game.restart();
    });

    Game.start();
  };

  Game.start = function () {
    var _asteroids;

    footer.style.display = "none";

    window.addEventListener("keydown", function (e) {
      return Game.onKeydown(e);
    });
    window.addEventListener("keyup", function (e) {
      return Game.onKeyup(e);
    });
    Game.onResize();

    ctx.clearRect(0, 0, width, height);

    cloud = (0, _cloud.buildCloud)(Game).init();
    (_asteroids = asteroids).push.apply(_asteroids, _toConsumableArray(cloud.asteroids()));

    spaceShip = (0, _spaceShip.buildSpaceShip)(Game).init();
    requestAnimationFrame(function (time) {
      return Game.update(time);
    });
  };

  Game.restart = function () {
    window.location.reload();
  };

  Game.draw = function () {
    if (!live) {
      Game.gameOver();
      return Game;
    }

    if (score > Game.levels[level].score) {
      level += 1;
    }

    var newAsteroids = [];

    if (!asteroids.length) {
      var _asteroids2;

      cloud.refresh(Game);
      (_asteroids2 = asteroids).push.apply(_asteroids2, _toConsumableArray(cloud.asteroids()));
    }

    if (spaceShip.timeBorn()) {
      showSpaceShip = !showSpaceShip;
      if (prevUpdateTime - spaceShip.timeBorn() >= Game.constants.SHOW_BORN_SPACE_SHIP) {
        spaceShip.born(0);
        showSpaceShip = true;
      }
    }

    if (spaceShip.alive()) {
      live -= 1;
      spaceShip = (0, _spaceShip.buildSpaceShip)(Game).init();
      spaceShip.born(prevUpdateTime);
    }

    for (var i = 0; i < asteroids.length; i += 1) {
      asteroids[i].move(width, height);
      if (asteroids[i].isDied() && !asteroids[i].timeDied()) {
        asteroids[i].setTimeDied(prevUpdateTime);
        newAsteroids.push.apply(newAsteroids, _toConsumableArray(Game.createFragmentsAsteroid(asteroids[i])));
      }
      Game.drawPolygon(asteroids[i].body(), asteroids[i].currentColor());
    }

    if (newAsteroids.length) {
      var _asteroids3;

      (_asteroids3 = asteroids).push.apply(_asteroids3, newAsteroids);
    }

    asteroids = asteroids.filter(function (asteroid) {
      return !asteroid.isDied() || asteroid.isDied() && prevUpdateTime - asteroid.timeDied() < Game.constants.SHOW_DIED_ASTEROID;
    });

    spaceShip.move(width, height);

    if (showSpaceShip) {
      Game.drawSpaceShip();
    }

    bullets = bullets.filter(function (bullet) {
      return bullet.alive();
    });

    for (var _i = 0; _i < bullets.length; _i += 1) {
      bullets[_i].move(width, height);
      Game.drawPolygon(bullets[_i].body(), bullets[_i].color());
    }

    Game.drawText("Score: " + score, 8, 30);
    Game.drawText("Lives: " + live, width - 110, 30);

    Game.collisions();
  };

  Game.drawSpaceShip = function () {
    Game.drawPolygon(spaceShip.body(), spaceShip.colorBody());
    if (spaceShip.isMoving) {
      Game.drawPolygon(spaceShip.fire(), spaceShip.colorFire());
    }
  };

  Game.createFragmentsAsteroid = function (asteroid) {
    var currentRadius = asteroid.currentRadius();
    var newIndex = Game.constants.LIST_RADIUS.indexOf(currentRadius) - 1;
    score += currentRadius;
    if (newIndex > -1) {
      var newRadius = Game.constants.LIST_RADIUS[newIndex];
      return [cloud.newAsteroid(asteroid.center(), newRadius), cloud.newAsteroid(asteroid.center(), newRadius)];
    }
    return [];
  };

  Game.collisions = function () {
    for (var i = 0; i < asteroids.length; i += 1) {
      if (asteroids[i].isDied()) {
        continue;
      }
      for (var j = 0; j < bullets.length; j += 1) {
        var flag = Game.collisionAsteroidBullet(asteroids[i], bullets[j]);
        if (flag) {
          asteroids[i].hitInc(1);
          bullets[j].died(flag);
        }
      }

      if (!spaceShip.timeBorn() || prevUpdateTime - spaceShip.timeBorn() >= Game.constants.SHOW_BORN_SPACE_SHIP) {
        Game.collisionAsteroidShip(asteroids[i], spaceShip);
      }
    }
  };

  Game.collisionAsteroidBullet = function (asteroid, bullet) {
    var ab = Game.base.length(asteroid.center().x, asteroid.center().y, bullet.center().x, bullet.center().y);
    return ab < asteroid.radius() + bullet.radius();
  };

  Game.collisionAsteroidShip = function (asteroid, spaceShip) {
    var lines = spaceShip.lines();
    for (var i = 0; i < lines.length; i += 1) {
      if (Game.base.pointBetweenTwoPoints(asteroid.center(), lines[i]) && Game.base.lineAcrossAsteroid(asteroid.center(), asteroid.radius(), lines[i])) {
        spaceShip.died(true);
      }
    }
  };

  Game.drawPolygon = function (polygon, color) {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.moveTo(polygon[polygon.length - 1].x, polygon[polygon.length - 1].y);
    for (var i = 0; i < polygon.length; i += 1) {
      ctx.lineTo(polygon[i].x, polygon[i].y);
    }
    ctx.fill();
    ctx.closePath();
  };

  Game.drawText = function (text, x, y) {
    ctx.textAlign = "left";
    ctx.font = "24px Arial";
    ctx.fillStyle = Game.constants.COLOR_TEXT;
    ctx.fillText(text, x, y);
  };

  Game.onResize = function () {
    width = container.clientWidth;
    height = container.clientHeight;

    canvas.width = width;
    canvas.height = height;
  };

  Game.onKeydown = function (e) {
    if (e.code === "Space") {
      bullets.push(spaceShip.shot());
    }
    if (e.code === "ArrowLeft") {
      spaceShip.isTurnLeft(true);
    }
    if (e.code === "ArrowRight") {
      spaceShip.isTurnRight(true);
    }
    if (e.code === "ArrowUp") {
      spaceShip.isMoving(true);
    }
  };

  Game.onKeyup = function (e) {
    if (e.code === "ArrowLeft") {
      spaceShip.isTurnLeft(false);
    }
    if (e.code === "ArrowRight") {
      spaceShip.isTurnRight(false);
    }
    if (e.code === "ArrowUp") {
      spaceShip.isMoving(false);
    }
  };

  Game.update = function (time) {
    var dt = time - prevUpdateTime;
    prevUpdateTime = time;
    ctx.clearRect(0, 0, width, height);
    Game.draw();
    animation = requestAnimationFrame(function (time) {
      return Game.update(time);
    });
  };

  Game.gameOver = function () {
    window.cancelAnimationFrame(animation);
    window.removeEventListener("keydown", function (e) {
      return Game.onKeydown(e);
    });
    window.removeEventListener("keyup", function (e) {
      return Game.onKeyup(e);
    });

    footer.style.display = "block";

    ctx.clearRect(0, 0, width, height);
    ctx.font = "48px Arial";
    ctx.fillStyle = Game.constants.COLOR_TEXT;
    ctx.textAlign = "center";
    ctx.fillText("You score: " + score, width / 2, height / 2 - 80);
    ctx.font = "72px Arial";
    ctx.fillStyle = Game.constants.COLOR_TEXT;
    ctx.fillText("Game over", width / 2, height / 2);
  };

  Game.height = function () {
    return height;
  };

  Game.width = function () {
    return width;
  };

  Game.level = function () {
    return level;
  };

  return Game.init();
})();

},{"../objects/cloud":9,"../objects/spaceShip":10,"./base":1,"./constants":2,"./levels":4,"./objects":5}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var buildLevels = exports.buildLevels = function buildLevels() {
  return [{
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
};

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var buildObjects = exports.buildObjects = function buildObjects() {
  return {
    TMPL_ASTEROID: [{ x: 6, y: -7 }, { x: 7, y: -6 }, { x: 8, y: -5 }, { x: 9, y: -4 }, { x: 8, y: 6 }, { x: -6, y: 8 }, { x: -5, y: 6 }, { x: -7, y: 7 }, { x: -8, y: 1 }, { x: -8, y: -2 }, { x: -8, y: -6 }, { x: -4, y: -9 }],

    TMPL_BOOM: [{ x: 7, y: -1 }, { x: 2, y: 1 }, { x: 5, y: 5 }, { x: 1, y: 2 }, { x: 0, y: 8 }, { x: -1, y: 2 }, { x: -4, y: 4 }, { x: -2, y: 1 }, { x: -8, y: 0 }, { x: -2, y: -1 }, { x: -5, y: -4 }, { x: -1, y: -3 }, { x: 1, y: -9 }, { x: 1, y: -2 }, { x: 5, y: -5 }, { x: 2, y: -1 }],

    TMPL_SPACE_SHIP: [{ x: 0, y: -20 }, { x: 15, y: 17 }, { x: 7, y: 10 }, { x: -7, y: 10 }, { x: -15, y: 17 }],

    TMPL_FIRE: [{ x: 5, y: 10 }, { x: 0, y: 20 }, { x: -5, y: 10 }],

    TMPL_BULLET: [{ x: 2, y: -2 }, { x: -2, y: -2 }, { x: -2, y: 2 }, { x: 2, y: 2 }]
  };
};

},{}],6:[function(require,module,exports){
'use strict';

require('./core/game');

},{"./core/game":3}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var buildAsteroid = exports.buildAsteroid = function buildAsteroid(x, y, radius, angle, maxSpeed, Game) {
  var asteroid = {};

  var health = String(radius)[0] * 1;
  var hit = 0;
  var speed = {};
  var isDied = false;
  var time = 0;
  var color = Game.constants.COLOR_ASTEROID;
  var bodyCoordinates = {};

  asteroid.init = function () {
    var dir = Math.random() > 0.5 ? -1 : 1;
    var value = Math.ceil(Math.random() * maxSpeed);
    speed.moveX = dir * value;

    dir = Math.random() > 0.5 ? -1 : 1;
    value = Math.ceil(Math.random() * maxSpeed);
    speed.moveY = dir * value;

    value = Math.ceil(Math.random() * Game.constants.MAX_SPEED_ROTATION_ASTEROID);
    speed.rotation = dir * value;
    return asteroid;
  };

  asteroid.hitInc = function (value) {
    hit += value;
  };

  asteroid.body = function () {
    return bodyCoordinates;
  };

  asteroid.isDied = function () {
    return isDied;
  };

  asteroid.timeDied = function () {
    return time;
  };

  asteroid.radius = function () {
    return radius;
  };

  asteroid.setTimeDied = function (currentTime) {
    time = currentTime;
  };

  asteroid.center = function () {
    return { x: x, y: y };
  };

  asteroid.currentRadius = function () {
    return radius;
  };

  asteroid.currentColor = function () {
    return color;
  };

  asteroid.moveX = function (maxX) {
    if (!speed.moveX) {
      return asteroid;
    }

    x += speed.moveX;
    if (x > maxX) {
      x = 0;
    }

    if (x < 0) {
      x = maxX;
    }
    return asteroid;
  };

  asteroid.moveY = function (maxY) {
    if (!speed.moveY) {
      return asteroid;
    }

    y += speed.moveY;
    if (y > maxY) {
      y = 0;
    }

    if (y < 0) {
      y = maxY;
    }

    return asteroid;
  };

  asteroid.calculateBody = function () {
    angle += speed.rotation;
    angle = angle % 360;

    bodyCoordinates = Game.base.createObject(Game.templates.TMPL_ASTEROID, asteroid.center(), health);
    bodyCoordinates = bodyCoordinates.map(function (el) {
      return Game.base.rotate(x, y, el.x, el.y, angle);
    });
    return asteroid;
  };

  asteroid.calculateBoom = function () {
    bodyCoordinates = Game.base.createObject(Game.templates.TMPL_BOOM, asteroid.center(), health);
  };

  asteroid.move = function (maxX, maxY) {
    if (hit >= health) {
      isDied = true;
      color = Game.constants.COLOR_BOOM;
      asteroid.calculateBoom();
      return asteroid;
    }

    return asteroid.moveX(maxX).moveY(maxY).calculateBody();
  };

  return asteroid;
};

},{}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var buildBullet = exports.buildBullet = function buildBullet(x, y, x0, y0, Game) {
  var bullet = {};

  var center = { x: x, y: y };
  var ship = { x0: x0, y0: y0 };
  var speed = Game.constants.SPEED_BULLET;

  var dx = 0;
  var dy = 0;
  var k = 0;

  var isDied = false;
  var maxLengthPath = Game.constants.LENGTH_PATH_BULLET;
  var lengthPath = 0;
  var color = Game.constants.COLOR_BULLET;

  var bulletCoordinates = [];

  bullet.init = function () {
    bulletCoordinates = bullet.calculateBody();
    k = Game.base.coefficientK(ship.x0, ship.y0, center.x, center.y);
    bullet.calculateDelta(k);
    return bullet;
  };

  bullet.calculateDelta = function (coefficientK) {
    var dirCondition = void 0;

    if (Math.abs(coefficientK) === Infinity) {
      dirCondition = ship.y0 > center.y;
      dx = 0;
      dy = speed * (dirCondition ? -1 : 1);
      return bullet;
    }

    dirCondition = ship.x0 > center.x;

    if (!coefficientK) {
      dx = speed * (dirCondition ? -1 : 1);
      dy = 0;
      return bullet;
    }

    dx = (dirCondition ? -1 : 1) * Game.base.calculateDX(speed, coefficientK);
    dy = Game.base.calculateDY(dx, coefficientK);
  };

  bullet.calculateBody = function () {
    return Game.base.createObject(Game.templates.TMPL_BULLET, bullet.center());
  };

  bullet.center = function () {
    return center;
  };

  bullet.beforeZero = function (ind, max) {
    if (center[ind] < 0) {
      bulletCoordinates = Game.base.mutateObject(bulletCoordinates, ind, function (value) {
        return max + value;
      });
      center[ind] = max;
    }
    return bullet;
  };

  bullet.afterMax = function (ind, max) {
    if (center[ind] > max) {
      bulletCoordinates = Game.base.mutateObject(bulletCoordinates, ind, function (value) {
        return value - max;
      });
      center[ind] = 0;
    }
    return bullet;
  };

  bullet.move = function (maxX, maxY) {
    if (lengthPath > maxLengthPath) {
      isDied = true;
      return bullet;
    }

    bullet.beforeZero("x", maxX).afterMax("x", maxX).beforeZero("y", maxY).afterMax("y", maxY);

    lengthPath += speed;
    bulletCoordinates = bulletCoordinates.map(function (el) {
      return Game.base.pointInc(el, dx, dy);
    });
    center.x += dx;
    center.y += dy;
  };

  bullet.died = function (flag) {
    isDied = flag;
  };

  bullet.body = function () {
    return bulletCoordinates;
  };

  bullet.alive = function () {
    return !isDied;
  };

  bullet.color = function () {
    return color;
  };

  bullet.radius = function () {
    return Game.base.length(center.x, center.y, bulletCoordinates[0].x, bulletCoordinates[0].y);
  };

  return bullet;
};

},{}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildCloud = undefined;

var _asteroid = require("../objects/asteroid");

var buildCloud = exports.buildCloud = function buildCloud(Game) {
  var cloud = {};

  var width = Game.width();
  var height = Game.height();
  var params = Game.levels[Game.level()];

  var count = params.count;
  var maxSpeed = params.maxSpeed;
  var asteroids = [];
  var listRadius = Game.constants.LIST_RADIUS;
  var startAngle = Game.constants.START_ANGLE;

  cloud.init = function () {
    cloud.generate(count);
    return cloud;
  };

  cloud.generate = function (n) {
    asteroids.length = 0;
    for (var i = 0; i < n; i += 1) {
      asteroids.push(cloud.addAsteroid());
    }
  };

  cloud.addAsteroid = function () {
    var radius = listRadius[Math.trunc(Math.random() * listRadius.length)];
    var angle = Math.trunc(Math.random() * startAngle);
    var x = 0;
    var y = 0;

    var variant = Math.random() > 0.5 ? 1 : 0;

    if (variant) {
      x = Math.random() > 0.5 ? width : 0;
      y = Math.random() * height;
    } else {
      x = Math.random() * width;
      y = Math.random() > 0.5 ? height : 0;
    }

    return (0, _asteroid.buildAsteroid)(x, y, radius, angle, maxSpeed, Game).init();
  };

  cloud.refresh = function (Game) {
    params = Game.levels[Game.level()];
    count = params.count;
    maxSpeed = params.maxSpeed;
    width = Game.width();
    height = Game.height();
    asteroids.length = 0;
    cloud.init();
    return cloud;
  };

  cloud.newAsteroid = function (center, radius) {
    var angle = Math.trunc(Math.random() * startAngle);
    return (0, _asteroid.buildAsteroid)(center.x, center.y, radius, angle, maxSpeed, Game).init();
  };

  cloud.asteroids = function () {
    return [].concat(asteroids);
  };

  return cloud;
};

},{"../objects/asteroid":7}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildSpaceShip = undefined;

var _bullet = require("../objects/bullet");

var buildSpaceShip = exports.buildSpaceShip = function buildSpaceShip(Game) {
  var spaceShip = {};

  var center = { x: Game.width() / 2, y: Game.height() / 2 };

  var speed = Game.constants.SPEED_SPACE_SHIP;
  var speedRotation = Game.constants.SPEED_ROTATION_SHIP;

  var colorBody = Game.constants.COLOR_SHIP;
  var colorFire = Game.constants.COLOR_FIRE;

  var timeBorn = 0;
  var isDied = false;
  var isMoving = false;
  var isTurnLeft = false;
  var isTurnRight = false;
  var bodyCoordinates = [];
  var fireCoordinates = [];

  spaceShip.init = function () {
    return spaceShip.calculateBody().calculateFire();
  };

  spaceShip.calculateBody = function () {
    bodyCoordinates = Game.base.createObject(Game.templates.TMPL_SPACE_SHIP, center);
    return spaceShip;
  };

  spaceShip.calculateFire = function () {
    fireCoordinates = Game.base.createObject(Game.templates.TMPL_FIRE, center);
    return spaceShip;
  };

  spaceShip.shot = function () {
    var point = bodyCoordinates[0];
    return (0, _bullet.buildBullet)(point.x, point.y, center.x, center.y, Game).init();
  };

  spaceShip.move = function (maxX, maxY) {
    if (isDied) {
      bodyCoordinates = Game.base.createObject(Game.templates.TMPL_BOOM, center, Game.constants.LIST_RADIUS[Game.constants.LIST_RADIUS.length - 1]);
      fireCoordinates = Game.base.createObject(Game.templates.TMPL_BOOM, center, Game.constants.LIST_RADIUS[0]);
      colorBody = Game.constants.COLOR_BOOM;
      return spaceShip;
    }

    if (isMoving) {
      spaceShip.calculateMove(maxX, maxY);
    }
    if (isTurnLeft) {
      spaceShip.rotateLeft();
    }
    if (isTurnRight) {
      spaceShip.rotateRight();
    }
  };

  spaceShip.rotateRight = function () {
    bodyCoordinates = bodyCoordinates.map(function (el) {
      return Game.base.rotate(center.x, center.y, el.x, el.y, speedRotation);
    });
    fireCoordinates = fireCoordinates.map(function (el) {
      return Game.base.rotate(center.x, center.y, el.x, el.y, speedRotation);
    });
    return spaceShip;
  };

  spaceShip.rotateLeft = function () {
    bodyCoordinates = bodyCoordinates.map(function (el) {
      return Game.base.rotate(center.x, center.y, el.x, el.y, -1 * speedRotation);
    });
    fireCoordinates = fireCoordinates.map(function (el) {
      return Game.base.rotate(center.x, center.y, el.x, el.y, -1 * speedRotation);
    });
    return spaceShip;
  };

  // todo переробити на загальний метод beforeZero та afterMax
  spaceShip.beforeZero = function (ind, max) {
    if (center[ind] < 0) {
      bodyCoordinates = Game.base.mutateObject(bodyCoordinates, ind, function (value) {
        return max + value;
      });
      fireCoordinates = Game.base.mutateObject(fireCoordinates, ind, function (value) {
        return max + value;
      });
      center[ind] = max;
    }
    return spaceShip;
  };

  spaceShip.afterMax = function (ind, max) {
    if (center[ind] > max) {
      bodyCoordinates = Game.base.mutateObject(bodyCoordinates, ind, function (value) {
        return value - max;
      });
      fireCoordinates = Game.base.mutateObject(fireCoordinates, ind, function (value) {
        return value - max;
      });
      center[ind] = 0;
    }
    return spaceShip;
  };

  spaceShip.calculateMove = function (maxX, maxY) {
    spaceShip.beforeZero("x", maxX).afterMax("x", maxX).beforeZero("y", maxY).afterMax("y", maxY);

    var coefficientK = Game.base.coefficientK(center.x, center.y, bodyCoordinates[0].x, bodyCoordinates[0].y);

    if (Math.abs(coefficientK) === Infinity) {
      spaceShip.lineX();
      return spaceShip;
    }
    if (!coefficientK) {
      spaceShip.lineY();
      return spaceShip;
    }
    spaceShip.lineXY(coefficientK);

    return spaceShip;
  };

  spaceShip.lineXY = function (coefficientK) {
    var dx = Game.base.calculateDX(speed, coefficientK);
    var dy = Game.base.calculateDY(dx, coefficientK);

    var dirCondition = center.x > bodyCoordinates[0].x;

    bodyCoordinates = bodyCoordinates.map(function (el) {
      return dirCondition ? Game.base.pointDec(el, dx, dy) : Game.base.pointInc(el, dx, dy);
    });

    fireCoordinates = fireCoordinates.map(function (el) {
      return dirCondition ? Game.base.pointDec(el, dx, dy) : Game.base.pointInc(el, dx, dy);
    });

    center.x = Game.base.changeValue(dirCondition, center.x, dx);
    center.y = Game.base.changeValue(dirCondition, center.y, dy);
  };

  spaceShip.lineX = function () {
    var dirCondition = center.y > bodyCoordinates[0].y;

    bodyCoordinates = Game.base.mutateObject(bodyCoordinates, "y", function (value) {
      return Game.base.changeValue(dirCondition, value, speed);
    });

    fireCoordinates = Game.base.mutateObject(fireCoordinates, "y", function (value) {
      return Game.base.changeValue(dirCondition, value, speed);
    });

    center.y = Game.base.changeValue(dirCondition, center.y, speed);
  };

  spaceShip.lineY = function () {
    var dirCondition = center.x > bodyCoordinates[0].x;

    bodyCoordinates = Game.base.mutateObject(bodyCoordinates, "x", function (value) {
      return Game.base.changeValue(dirCondition, value, speed);
    });

    fireCoordinates = Game.base.mutateObject(fireCoordinates, "x", function (value) {
      return Game.base.changeValue(dirCondition, value, speed);
    });

    center.x = Game.base.changeValue(dirCondition, center.x, speed);
  };

  spaceShip.lines = function () {
    return [[bodyCoordinates[0], bodyCoordinates[1]], [bodyCoordinates[1], bodyCoordinates[bodyCoordinates.length - 1]], [bodyCoordinates[bodyCoordinates.length - 1], bodyCoordinates[0]]];
  };

  spaceShip.body = function () {
    return bodyCoordinates;
  };

  spaceShip.fire = function () {
    return fireCoordinates;
  };

  spaceShip.died = function (flag) {
    isDied = flag;
  };

  spaceShip.alive = function () {
    return isDied;
  };

  spaceShip.born = function (time) {
    timeBorn = time;
  };

  spaceShip.timeBorn = function () {
    return timeBorn;
  };

  spaceShip.speedRotation = function () {
    return speedRotation;
  };

  spaceShip.colorBody = function () {
    return colorBody;
  };

  spaceShip.colorFire = function () {
    return colorFire;
  };

  spaceShip.isMoving = function (flag) {
    isMoving = flag;
  };

  spaceShip.isTurnLeft = function (flag) {
    isTurnLeft = flag;
  };

  spaceShip.isTurnRight = function (flag) {
    isTurnRight = flag;
  };

  return spaceShip;
};

},{"../objects/bullet":8}]},{},[6])
//# sourceMappingURL=game.js.map
