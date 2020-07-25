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

	speedLabel.text = `Speed:  ${robot.speed.toString()}`
	robotPositionLabel.text = `Position: X=${robot.x}, Y=${robot.y}`
}

class Keyboard {
	value: string
	isDown: boolean
	isUp: boolean
	press!: Function
	release!: Function

	constructor(value: string) {
		this.value = value
		this.isDown = false
		this.isUp = true
		window.addEventListener("keydown", this.downHandler.bind(this), false)
		window.addEventListener("keyup", this.upHandler.bind(this), false)
	}

	downHandler(event: KeyboardEvent): void {
		if (event.key === this.value) {
			if (this.isUp && this.press) this.press()
			this.isDown = true
			this.isUp = false
			event.preventDefault()
		}
	}

	upHandler(event: KeyboardEvent): void {
		if (event.key === this.value) {
			if (this.isDown && this.release) this.release()
			this.isDown = false
			this.isUp = true
			event.preventDefault()
		}
	}

	unsubscribe(): void {
		window.removeEventListener("keydown", this.downHandler)
		window.removeEventListener("keyup", this.upHandler)
	}
}

class Robot {

	private sprite: PIXI.Sprite
	private _speed: number

	constructor() {
		this._speed = 5
		this.sprite = Sprite.from(resources['./assets/logo.png'].texture)
		this.sprite.anchor.set(0.5)
		this.sprite.x = app.screen.width * 0.5
		this.sprite.y = app.screen.height * 0.5
		app.stage.addChild(this.sprite)
	}

	onObstacleDetected(): void {
		if (this._speed == 5 && this.sprite.x > (app.screen.width - this.sprite.width)) {
			this.changeDirection();
		}
		if (this._speed == -5 && this.sprite.x < this.sprite.width) {
			this.changeDirection();
		}
	}

	changeDirection(): void {
		if (this._speed == 5) {
			// this.sprite.rotation += 0.5
			this.sprite.pivot.x += 0.5
			this._speed = -5
		} else if (this._speed == -5) {
			this._speed = 5
		}
	}

	move(): void {
		this.sprite.x += this._speed
	}

	isStuck(): boolean {
		return false
	}

	get speed(): number {
		return this._speed
	}

	get x(): number {
		return this.sprite.x
	}

	get y(): number {
		return this.sprite.y
	}
}