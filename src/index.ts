import * as PIXI from 'pixi.js'
import { Robot, Angle, Position } from './Robot'
import { Level, Rectangle } from './Level'

const Application = PIXI.Application
const Sprite = PIXI.Sprite
const Text = PIXI.Text

let state: Function
let speedLabel: PIXI.Text
let robotPositionLabel: PIXI.Text
let robotSprite: PixiRobot

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
	.add('./assets/robot.png')
	.load(setup)

function setup(): void {
	let robot = new Robot(new Position(200, 200))
	robot.setLevel(new Level(new Rectangle(app.view.width, app.view.height)))
	robotSprite = new PixiRobot(robot)

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
	robotSprite.move()
	robotPositionLabel.text = `Position: X=${robotSprite.x}, Y=${robotSprite.y}`
}

export class PixiRobot {

	private _sprite: PIXI.Sprite
	private _robot: Robot

	constructor(robot: Robot) {
		this._robot = robot
		this._robot.onObstacleDetected(this.changeDirection.bind(this))

		this._sprite = Sprite.from(resources['./assets/robot.png'].texture)
		this._sprite.anchor.set(0.5)
		this._sprite.x = robot.x
		this._sprite.y = robot.y
		this._sprite.width = 100
		this._sprite.height = 100
		this._sprite.angle = robot.direction.degrees()
		app.stage.addChild(this._sprite)
	}

	changeDirection(): void {
		let randomAngle = Math.floor(Math.random() * Math.floor(360))

		if (this._robot.direction.degrees() > 0) {
			randomAngle = randomAngle * -1
		}

		this._robot.direction = new Angle(randomAngle)
		this._sprite.angle = this._robot.direction.degrees()
	}

	move(): void {
		this._robot.move()
		this._sprite.x = this._robot.x
		this._sprite.y = this._robot.y
	}

	get x(): number {
		return this._robot.x
	}

	get y(): number {
		return this._robot.y
	}
}
