import { IntersectsExtensions } from './IntersectsExtensions'
import { Level, LevelObject } from './Level'


export class Robot implements LevelObject {

    private _position: Position
    private _direction: Angle
    private _speed: number
    private _size: number
    private _level?: Level
    private _onObstacleDetected?: Function

    private readonly STOPPED_SPEED = 0
    private readonly DEFAULT_SPEED = 5

    constructor(position?: Position, direction?: Angle) {
        this._position = position || new Position(0, 0)
        this._direction = direction || new Angle(0)
        this._speed = this.STOPPED_SPEED
        this._size = 100
    }

    setLevel(level: Level): void {
        this._level = level
    }

    onObstacleDetected(fun: Function): void {
        this._onObstacleDetected = fun
    }

    move(): void {
        this._speed = this.DEFAULT_SPEED

        if (this.isInCollisionCourse()) {
            this._onObstacleDetected?.()
            this.stop()
        } else {
            this._position.x = this.nextPositionX()
            this._position.y = this.nextPositionY()
        }
    }

    radius(): number {
        return this._size / 2
    }

    stop(): void {
        this._speed = this.STOPPED_SPEED
    }

    private isInCollisionCourse(): boolean {
        if (this._level) {
            let points = this._level.shape.points()
            let xc = this.nextPositionX()
            let yc = this.nextPositionY()
            let rc = this.radius()
            return IntersectsExtensions.polygonOutlineCircle(points, xc, yc, rc)
        }

        return false
    }

    private nextPositionX(): number {
        let rotation = this._direction.rotation()
        let vx = this._position.x + this._speed * Math.cos(rotation)
        return Math.round((vx + Number.EPSILON) * 100) / 100
    }

    private nextPositionY(): number {
        let rotation = this._direction.rotation()
        let vy = this._position.y + this._speed * Math.sin(rotation)
        return Math.round((vy + Number.EPSILON) * 100) / 100
    }

    get speed(): number {
        return this._speed
    }

    get x(): number {
        return this._position.x
    }

    get y(): number {
        return this._position.y
    }

    get direction(): Angle {
        return this._direction
    }

    set direction(direction: Angle) {
        this._direction = direction
    }

    get size(): number {
        return this._size
    }

    set size(size: number) {
        this._size = size
    }

    set position(position: Position) {
        this._position = position
    }
}

export class Position {

    private _x: number
    private _y: number

    constructor(x: number, y: number) {
        this._x = x
        this._y = y
    }

    get x(): number {
        return this._x
    }

    set x(x: number) {
        this._x = x
    }

    get y(): number {
        return this._y
    }

    set y(y: number) {
        this._y = y
    }
}

export class Angle {

    public static readonly CENTER: number = 0
    public static readonly MIN: number = -360
    public static readonly MAX: number = 360
    public static readonly TOWARDS_RIGHT = new Angle(0)
    public static readonly TOWARDS_BOTTOM = new Angle(90)
    public static readonly TOWARDS_LEFT = new Angle(180)
    public static readonly TOWARDS_TOP = new Angle(270)

    private _value: number

    constructor(value?: number) {
        this._value = value || Angle.CENTER
        this._validateLimits(this._value)
    }

    degrees(): number {
        return this._value
    }

    add(degrees: number): void {
        let totalDegrees = this._value + degrees
        this._validateLimits(totalDegrees)
        this._value = totalDegrees
    }

    rotation(): number {
        let rotation = this._value * Math.PI / 180
        return Math.round((rotation + Number.EPSILON) * 100) / 100
    }

    private _validateLimits(value: number): void {
        if (value > Angle.MAX || value < Angle.MIN) {
            throw new AngleValueError(value)
        }
    }
}

export class AngleValueError extends Error {

    constructor(value: number) {
        super(`Invalid angle provided ${value.toString()}`)
    }
}