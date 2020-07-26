"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AngleValueError = exports.Angle = exports.Position = exports.Robot = void 0;
var Robot = /** @class */ (function () {
    function Robot(position, direction) {
        this.SPEED_STOPPED = 0;
        this.SPEED_DEFAULT = 5;
        this._position = position || new Position(0, 0);
        this._direction = direction || new Angle(0);
        this._speed = this.SPEED_STOPPED;
    }
    Robot.prototype.onObstacleDetected = function () {
    };
    Robot.prototype.changeDirection = function () {
    };
    Robot.prototype.move = function () {
        this._speed = this.SPEED_DEFAULT;
        var rotation = this._direction.degrees() * Math.PI / 180;
        var vx = this._position.x + this._speed * Math.cos(rotation);
        var vy = this._position.x + this._speed * Math.sin(rotation);
        this._position = new Position(vx, vy);
    };
    Robot.prototype.isStuck = function () {
        return false;
    };
    Object.defineProperty(Robot.prototype, "speed", {
        get: function () {
            return this._speed;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Robot.prototype, "x", {
        get: function () {
            return this._position.x;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Robot.prototype, "y", {
        get: function () {
            return this._position.y;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Robot.prototype, "direction", {
        get: function () {
            return this._direction;
        },
        enumerable: false,
        configurable: true
    });
    return Robot;
}());
exports.Robot = Robot;
var Position = /** @class */ (function () {
    function Position(x, y) {
        this._x = x;
        this._y = y;
    }
    Object.defineProperty(Position.prototype, "x", {
        get: function () {
            return this._x;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Position.prototype, "y", {
        get: function () {
            return this._y;
        },
        enumerable: false,
        configurable: true
    });
    return Position;
}());
exports.Position = Position;
var Angle = /** @class */ (function () {
    function Angle(value) {
        this.MIN = -360;
        this.MAX = 360;
        this._value = value || 0;
        if (this._value < this.MIN || this._value > this.MAX) {
            throw new AngleValueError(this._value);
        }
    }
    Angle.prototype.degrees = function () {
        return this._value;
    };
    Angle.FORWARD = new Angle(0);
    return Angle;
}());
exports.Angle = Angle;
var AngleValueError = /** @class */ (function (_super) {
    __extends(AngleValueError, _super);
    function AngleValueError(value) {
        return _super.call(this, "Invalid angle provided " + value.toString()) || this;
    }
    return AngleValueError;
}(Error));
exports.AngleValueError = AngleValueError;
//# sourceMappingURL=Robot.js.map