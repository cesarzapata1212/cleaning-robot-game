import * as PIXI from 'pixi.js'


const Application = PIXI.Application
const Sprite = PIXI.Sprite
const Text = PIXI.Text

let state: Function
let speed: number = 5
let speedLabel: PIXI.Text
let robotPositionLabel: PIXI.Text
let robot: Robot

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
	robot = new Robot()

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

	speedLabel.text = `Speed:  ${robot.speedX.toString()}`
	robotPositionLabel.text = `Position: X=${robot.x}, Y=${robot.y}`
}

class Robot {

	private _sprite: PIXI.Sprite
	private _speedX: number
	private _speedY: number

	constructor() {
		this._speedX = 5
		this._speedY = 5
		this._sprite = Sprite.from(resources['./assets/logo.png'].texture)
		this._sprite.anchor.set(0.5)
		this._sprite.x = app.screen.width * 0.5
		this._sprite.y = app.screen.height * 0.5
		app.stage.addChild(this._sprite)
	}

	onObstacleDetected(): void {
		if ((this._sprite.x > (app.screen.width - this._sprite.width) || this._sprite.x < 0) ||
			(this._sprite.y > (app.screen.height - this._sprite.height) || this._sprite.y < 0)) {
			this.changeDirection();
		}
	}

	changeDirection(): void {
		this._sprite.rotation += 0.5
		if (this._speedX == 5) {
			this._speedX = -5
		} else if (this._speedX == -5) {
			this._speedX = 5
		}
		if (this._speedY == 5) {
			this._speedY = -5
		} else if (this._speedY == -5) {
			this._speedY = 5
		}
	}

	move(): void {
		this._sprite.x += this._speedX
		this._sprite.y += this._speedY
	}

	isStuck(): boolean {
		return false
	}

	get speedX(): number {
		return this._speedX
	}

	get x(): number {
		return this._sprite.x
	}

	get y(): number {
		return this._sprite.y
	}
}
