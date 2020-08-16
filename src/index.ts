import * as PIXI from 'pixi.js'
import { Robot, Angle, Position } from './Robot'
import { Level, Rectangle } from './Level'

const Application = PIXI.Application
const Sprite = PIXI.Sprite
const Text = PIXI.Text
const Graphics = PIXI.Graphics

const WIDTH = window.innerWidth
const HEIGHT = window.innerHeight
const CENTER_WIDTH = WIDTH / 2
const CENTER_HEIGHT = HEIGHT / 2

let state: Function
let robotSprite: PixiRobot
let healthBar: HealthBar

const app = new Application({
	width: WIDTH,
	height: HEIGHT,
	forceCanvas: true
})
const loader = app.loader
const resources = loader.resources

app.renderer.backgroundColor = 0x2c3e50
app.renderer.resize(window.innerWidth, window.innerHeight)
document.body.appendChild(app.view) // Create Canvas tag in the body

// Load the logo
loader
	.add('./assets/robot.png')
	.load(setup)

function setup(): void {

	let dirtyBackground = new Graphics()
	dirtyBackground.beginFill(0xaaaaaa)
	dirtyBackground.drawRect(CENTER_WIDTH, CENTER_HEIGHT, WIDTH, HEIGHT);
	dirtyBackground.endFill()
	app.stage.addChild(dirtyBackground)
	dirtyBackground.pivot.x = CENTER_WIDTH
	dirtyBackground.pivot.y = CENTER_HEIGHT


	let cleanBackground = new Graphics()
	cleanBackground.beginFill(0xffffff)
	cleanBackground.drawRect(CENTER_WIDTH, CENTER_HEIGHT, WIDTH, HEIGHT);
	cleanBackground.endFill()
	app.stage.addChild(cleanBackground)
	cleanBackground.pivot.x = CENTER_WIDTH
	cleanBackground.pivot.y = CENTER_HEIGHT

	let robot = new Robot({ position: new Position(200, 200) })
	robot.setLevel(new Level(new Rectangle(WIDTH, HEIGHT)))
	robotSprite = new PixiRobot(robot, cleanBackground)

	healthBar = new HealthBar()
	app.stage.addChild(healthBar)

	state = play
	app.ticker.add(gameLoop)
}

function gameLoop(delta: number) {
	state(delta)
}

function play(delta: number) {
	robotSprite.move()
	let batteryLife: number = Math.round(robotSprite.battery / 100)
	healthBar.label = `${batteryLife.toString()}%`
}

export class PixiRobot {

	private _sprite: PIXI.Sprite
	private _robot: Robot
	private _brush: PIXI.Graphics
	private _renderTexture: PIXI.RenderTexture
	private _renderTextureSprite: PIXI.Sprite

	constructor(robot: Robot, cleanBackground: PIXI.Graphics) {
		this._robot = robot
		this._robot.onObstacleDetected(this.changeDirection.bind(this))

		this._sprite = Sprite.from(resources['./assets/robot.png'].texture)
		this._sprite.anchor.set(0.5)
		this._sprite.x = robot.x
		this._sprite.y = robot.y
		this._sprite.width = robot.size
		this._sprite.height = robot.size
		this._sprite.angle = robot.direction.degrees()
		app.stage.addChild(this._sprite)

		this._brush = new PIXI.Graphics();
		this._brush.beginFill(0xffffff);
		this._brush.drawCircle(0, 0, robot.radius());
		this._brush.endFill();

		this._renderTexture = PIXI.RenderTexture.create({
			width: WIDTH,
			height: HEIGHT
		})
		this._renderTextureSprite = new PIXI.Sprite(this._renderTexture)
		app.stage.addChild(this._renderTextureSprite)
		cleanBackground.mask = this._renderTextureSprite
	}

	changeDirection(): void {
		let randomAngle = Math.floor(Math.random() * Math.floor(360))

		if (this._robot.direction.degrees() > 0) {
			randomAngle = randomAngle * -1
		}
		this._robot.changeDirection(new Angle(randomAngle))
		this._sprite.angle = this._robot.direction.degrees()
	}

	move(): void {
		this._robot.move()
		this._sprite.x = this._robot.x
		this._sprite.y = this._robot.y
		this._brush.position.x = this._robot.x
		this._brush.position.y = this._robot.y
		app.renderer.render(this._brush, this._renderTexture, false, undefined, false)
	}

	get x(): number {
		return this._robot.x
	}

	get y(): number {
		return this._robot.y
	}

	get sprite(): PIXI.Sprite {
		return this._sprite
	}

	get battery(): number {
		return this._robot.batteryIndicator
	}
}

class HealthBar extends PIXI.Container {

	private readonly WIDTH = 150
	private readonly HEIGHT = 25

	private _outerBar: PIXI.Graphics
	private _innerBar: PIXI.Graphics
	private _label: PIXI.Text

	constructor() {
		super()
		this.position.set(50, 50)

		this._innerBar = new PIXI.Graphics();
		this._innerBar.beginFill(0x000000);
		this._innerBar.drawRect(0, 0, this.WIDTH, this.HEIGHT);
		this._innerBar.endFill();
		this.addChild(this._innerBar);

		this._outerBar = new PIXI.Graphics();
		this._outerBar.beginFill(0xFF3300);
		this._outerBar.drawRect(0, 0, this.WIDTH, this.HEIGHT);
		this._outerBar.endFill();
		this.addChild(this._outerBar);

		this._label = new Text("0%", {
			fontFamily: 'Arial',
			fontSize: '20px',
			fill: 0xffffff,
			align: 'center'
		})
		this._label.position.x = 5
		this.addChild(this._label)
	}

	public set label(text: string) {
		this._label.text = text;
	}

}