
export class Robot {

    private _position: Position
    private _direction: Angle
    private _speed: number;

    private readonly SPEED_STOPPED = 0;
    private readonly SPEED_DEFAULT = 5;

    constructor(position?: Position, direction?: Angle) {
        this._position = position || new Position(0, 0)
        this._direction = direction || new Angle(0)
        this._speed = this.SPEED_STOPPED
    }

    onObstacleDetected(): void {
    }

    changeDirection(): void {
    }

    move(): void {
        this._speed = this.SPEED_DEFAULT
        let rotation = this._direction.degrees() * Math.PI / 180
        let vx = this._position.x + this._speed * Math.cos(rotation)
        let vy = this._position.x + this._speed * Math.sin(rotation)
        this._position = new Position(vx, vy)
    }

    isStuck(): boolean {
        return false
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

    get y(): number {
        return this._y
    }
}

export class Angle {

    public static FORWARD: Angle = new Angle(0)

    private _value: number

    private readonly MIN: number = -360
    private readonly MAX: number = 360

    constructor(value?: number) {
        this._value = value || 0

        if (this._value < this.MIN || this._value > this.MAX) {
            throw new AngleValueError(this._value)
        }
    }

    degrees(): number {
        return this._value
    }
}

export class AngleValueError extends Error {

    constructor(value: number) {
        super(`Invalid angle provided ${value.toString()}`)
    }
}