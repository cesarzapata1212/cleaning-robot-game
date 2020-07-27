import { Level } from "Level"

import { LevelObject } from './Level'

export class Robot implements LevelObject {

    private _position: Position
    private _direction: Angle
    private _speed: number
    private _level?: Level
    private _onObstacleDetected?: Function

    private readonly STOPPED_SPEED = 0
    private readonly DEFAULT_SPEED = 5

    constructor(position?: Position, direction?: Angle) {
        this._position = position || new Position(0, 0)
        this._direction = direction || new Angle(0)
        this._speed = this.STOPPED_SPEED
    }

    setLevel(level: Level): void {
        this._level = level
    }

    onObstacleDetected(fun: Function): void {
        this._onObstacleDetected = fun.bind(this)
    }

    changeDirection(angle: Angle): void {
        this._direction = angle
    }

    move(): void {
        this._speed = this.DEFAULT_SPEED
        this._position.x = this.nextPositionX()
        this._position.y = this.nextPositionY()
        if (this._onObstacleDetected) {
            this._onObstacleDetected()
        }
    }

    isStuck(): boolean {
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