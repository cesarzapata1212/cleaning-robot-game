import * as PIXI from 'pixi.js'


const Application = PIXI.Application;
const Sprite = PIXI.Sprite;

let logo: PIXI.Sprite;
let state: Function;

const app = new Application({
	width: window.innerWidth,
	height: window.innerHeight,
	forceCanvas: true
})
const loader = app.loader;
const resources = loader.resources;

app.renderer.backgroundColor = 0x061639;
app.renderer.resize(window.innerWidth, window.innerHeight);
document.body.appendChild(app.view) // Create Canvas tag in the body

// Load the logo
loader
	.add('./assets/logo.png')
	.load(setup);

function setup(): void {
	logo = Sprite.from(resources['./assets/logo.png'].texture)
	logo.anchor.set(0.5)
	logo.x = app.screen.width * 0.5
	logo.y = app.screen.height * 0.5
	app.stage.addChild(logo)
	state = play;
	app.ticker.add(gameLoop)
}

function gameLoop(delta: number) {
	state(delta);
}

function play(delta: number) {
	logo.rotation += 0.02 * delta
}
class Keyboard {
	value: string;
	isDown: boolean;
	isUp: boolean;
	press!: Function;
	release!: Function;

	constructor(value: string) {
		this.value = value;
		this.isDown = false;
		this.isUp = true;
		window.addEventListener("keydown", this.downHandler.bind(this), false);
		window.addEventListener("keyup", this.upHandler.bind(this), false);
	}

	downHandler(event: KeyboardEvent): void {
		if (event.key === this.value) {
			if (this.isUp && this.press) this.press();
			this.isDown = true;
			this.isUp = false;
			event.preventDefault();
		}
	};

	upHandler(event: KeyboardEvent): void {
		if (event.key === this.value) {
			if (this.isDown && this.release) this.release();
			this.isDown = false;
			this.isUp = true;
			event.preventDefault();
		}
	};

	unsubscribe(): void {
		window.removeEventListener("keydown", this.downHandler);
		window.removeEventListener("keyup", this.upHandler);
	}
}
