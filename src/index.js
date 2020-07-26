"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PixiRobot = void 0;
var PIXI = __importStar(require("pixi.js"));
var Robot_1 = require("./Robot");
var Application = PIXI.Application;
var Sprite = PIXI.Sprite;
var Text = PIXI.Text;
var state;
var speedLabel;
var robotPositionLabel;
var robot;
var app = new Application({
    width: window.innerWidth,
    height: window.innerHeight,
    forceCanvas: true
});
var loader = app.loader;
var resources = loader.resources;
app.renderer.backgroundColor = 0x061639;
app.renderer.resize(window.innerWidth, window.innerHeight);
document.body.appendChild(app.view); // Create Canvas tag in the body
// Load the logo
loader
    .add('./assets/logo.png')
    .load(setup);
function setup() {
    robot = new PixiRobot(new Robot_1.Robot());
    speedLabel = new Text("Speed: 0");
    speedLabel.x = 25;
    speedLabel.y = 25;
    speedLabel.style.fill = "white";
    app.stage.addChild(speedLabel);
    robotPositionLabel = new Text("Position: X=0, Y=0");
    robotPositionLabel.x = 25;
    robotPositionLabel.y = 55;
    robotPositionLabel.style.fill = "white";
    app.stage.addChild(robotPositionLabel);
    state = play;
    app.ticker.add(gameLoop);
}
function gameLoop(delta) {
    state(delta);
}
function play(delta) {
    robot.onObstacleDetected();
    if (robot.isStuck()) {
        // state = gameOver
    }
    robot.move();
    // speedLabel.text = `Speed:  ${robot.x.toString()}`
    // robotPositionLabel.text = `Position: X=${robot.x}, Y=${robot.y}`
}
var PixiRobot = /** @class */ (function () {
    function PixiRobot(robot) {
        this._robot = robot;
        this._sprite = Sprite.from(resources['./assets/logo.png'].texture);
        this._sprite.anchor.set(0.5);
        this._sprite.x = robot.x;
        this._sprite.y = robot.y;
        app.stage.addChild(this._sprite);
    }
    PixiRobot.prototype.onObstacleDetected = function () {
        if ((this._sprite.x > (app.screen.width - this._sprite.width) || this._sprite.x < 0) ||
            (this._sprite.y > (app.screen.height - this._sprite.height) || this._sprite.y < 0)) {
            this.changeDirection();
        }
    };
    PixiRobot.prototype.changeDirection = function () {
    };
    PixiRobot.prototype.move = function () {
        this._robot.move();
        this._sprite.x = this._robot.x;
        this._sprite.y = this._robot.y;
    };
    PixiRobot.prototype.isStuck = function () {
        return false;
    };
    return PixiRobot;
}());
exports.PixiRobot = PixiRobot;
//# sourceMappingURL=index.js.map