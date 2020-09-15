import 'bootstrap/dist/css/bootstrap.min.css'
import "codemirror/lib/codemirror.css"
import '../build/assets/styles/vscode-dark.css'
import "codemirror/mode/javascript/javascript.js"

import * as PIXI from 'pixi.js'
import { Robot, Position } from './Robot'
import { Level, Rectangle } from './Level'
import CodeEditor from './CodeEditor'
import { PixiRobot, BatteryLifeBar, ProgressBar } from './UiComponents'

const Application = PIXI.Application
const Graphics = PIXI.Graphics

const WIDTH = 1024
const HEIGHT = 600
const CENTER_WIDTH = WIDTH / 2
const CENTER_HEIGHT = HEIGHT / 2

let state: Function
let robotSprite: PixiRobot
let batteryLifeBar: BatteryLifeBar
let progressBar: ProgressBar

const app = new Application({
	width: WIDTH,
	height: HEIGHT,
	forceCanvas: true
})
const loader: PIXI.Loader = app.loader

app.renderer.backgroundColor = 0x2c3e50
app.renderer.resize(WIDTH, HEIGHT)
document.getElementById("game-container")?.appendChild(app.view)

const textArea = document.getElementById("code-editor") as HTMLTextAreaElement
const codeEditor = new CodeEditor(textArea)
let sourceCode = codeEditor.get();

const playButton = document.getElementById("play-button") as HTMLButtonElement
playButton.addEventListener('click', play)

// Load the logo
loader
	.add('./assets/robot.png')
	.load(setup)

function setup(): void {

	let dirtyBackground = new Graphics()
	dirtyBackground.beginFill(0xaaaaaa)
	dirtyBackground.drawRect(CENTER_WIDTH, CENTER_HEIGHT, WIDTH, HEIGHT)
	dirtyBackground.endFill()
	app.stage.addChild(dirtyBackground)
	dirtyBackground.pivot.x = CENTER_WIDTH
	dirtyBackground.pivot.y = CENTER_HEIGHT


	let cleanBackground = new Graphics()
	cleanBackground.beginFill(0xffffff)
	cleanBackground.drawRect(CENTER_WIDTH, CENTER_HEIGHT, WIDTH, HEIGHT)
	cleanBackground.endFill()
	app.stage.addChild(cleanBackground)
	cleanBackground.pivot.x = CENTER_WIDTH
	cleanBackground.pivot.y = CENTER_HEIGHT

	let robot = new Robot({ position: new Position(200, 200) })
	robot.setLevel(new Level(new Rectangle(WIDTH, HEIGHT)))
	robotSprite = new PixiRobot(robot, cleanBackground, app)

	batteryLifeBar = new BatteryLifeBar()
	app.stage.addChild(batteryLifeBar)

	progressBar = new ProgressBar()
	app.stage.addChild(progressBar)

	state = waiting
	app.ticker.add(gameLoop)
}

function gameLoop(delta: number) {
	state(delta)
}

function play() {
	sourceCode = codeEditor.get()
	robotSprite.onObstacleDetected(sourceCode.onObstacleDetected)
	state = running
}

function waiting(delta: number) {
	let batteryLife: number = Math.round(robotSprite.battery / 100)
	batteryLifeBar.label = `${batteryLife.toString()}%`
}

function running(delta: number) {
	robotSprite.move(delta)
	let batteryLife: number = Math.round(robotSprite.battery / 100)
	batteryLifeBar.label = `${batteryLife.toString()}%`
	updateProgress(delta)
}

function toSeconds(delta: number) {
	return 1 / 60 * delta
}

let timeElapsed = 0
function updateProgress(delta: number) {
	timeElapsed += toSeconds(delta)
	if (timeElapsed > 1) {
		progressBar.label = `${robotSprite.progress().toFixed(2)}%`
		timeElapsed = 0
	}
}