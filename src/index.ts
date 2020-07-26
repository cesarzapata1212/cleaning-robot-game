import * as PIXI from 'pixi.js'
import { Robot, Angle, Position } from './Robot'

const Application = PIXI.Application
const Sprite = PIXI.Sprite
const Text = PIXI.Text

let state: Function
let speedLabel: PIXI.Text
let robotPositionLabel: PIXI.Text
let robot: PixiRobot

const app = new Application({
	width: window.innerWidth,
	height: window.innerHeight,
	forceCanvas: true
})
const loader = app.loader
const resources = loader.resources

app.renderer.backgroundColor = 0x061639
app.renderer.resize(window.innerWidth, window.innerHeight)
document.body.appendChild(app.view) // Create Canvas tag in the body

// Load the logo
loader
	.add('./assets/logo.png')
	.load(setup)

function setup(): void {
	robot = new PixiRobot(new Robot(new Position(150, 150)))

	speedLabel = new Text("Speed: 0")
	speedLabel.x = 25
	speedLabel.y = 25
	speedLabel.style.fill = "white"
	app.stage.addChild(speedLabel)

	robotPositionLabel = new Text("Position: X=0, Y=0")
	robotPositionLabel.x = 25
	robotPositionLabel.y = 55
	robotPositionLabel.style.fill = "white"
	app.stage.addChild(robotPositionLabel)

	state = play
	app.ticker.add(gameLoop)
}

function gameLoop(delta: number) {
	state(delta)
}

function play(delta: number) {

	robot.onObstacleDetected()

	if (robot.isStuck()) {
		// state = gameOver
	}

	robot.move()

	robotPositionLabel.text = `Position: X=${robot.x}, Y=${robot.y}`
}

export class PixiRobot {

	private _sprite: PIXI.Sprite
	private _robot: Robot

	constructor(robot: Robot) {
		this._robot = robot
		this._sprite = Sprite.from(resources['./assets/logo.png'].texture)
		this._sprite.anchor.set(0.5)
		this._sprite.x = robot.x
		this._sprite.y = robot.y
		app.stage.addChild(this._sprite)
	}

	onObstacleDetected(): void {
		if ((this._sprite.x > (app.screen.width - this._sprite.width) || this._sprite.x < 0) ||
			(this._sprite.y > (app.screen.height - this._sprite.height) || this._sprite.y < 0)) {
			this.changeDirection();
			this._robot
		}
	}

	changeDirection(): void {
		if (this._robot.direction.degrees() + 90 > Angle.MAX.degrees()) {
			this._robot.changeDirection(new Angle(0))
		} else {
			this._robot.changeDirection(this._robot.direction.add(90))
		}
	}

	move(): void {
		this._robot.move()
		this._sprite.x = this._robot.x
		this._sprite.y = this._robot.y
	}

	isStuck(): boolean {
		return false
	}

	get x(): number {
		return this._robot.x
	}

	get y(): number {
		return this._robot.y
	}
}
