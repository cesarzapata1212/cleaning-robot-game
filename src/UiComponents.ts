
import * as PIXI from 'pixi.js'
import { Robot, Angle, Position } from './Robot'

const Sprite = PIXI.Sprite
const Text = PIXI.Text

export class PixiRobot {

	private _sprite: PIXI.Sprite
	private _robot: Robot
	private _brush: PIXI.Graphics
	private _renderTexture: PIXI.RenderTexture
	private _renderTextureSprite: PIXI.Sprite
    private _app: PIXI.Application

	constructor(robot: Robot, cleanBackground: PIXI.Graphics, app: PIXI.Application) {
        this._robot = robot
		this._robot.onObstacleDetected(this.changeDirection.bind(this))
        this._app = app

		this._sprite = Sprite.from(app.loader.resources['./assets/robot.png'].texture)
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
			width: app.view.width,
			height: app.view.height
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
		this._app.renderer.render(this._brush, this._renderTexture, false, undefined, false)
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

export class HealthBar extends PIXI.Container {

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
