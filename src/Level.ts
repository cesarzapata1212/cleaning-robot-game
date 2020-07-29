export class Level {

    private _shape: Shape;
    private _objects: Set<LevelObject>;

    constructor(shape: Shape) {
        this._shape = shape
        this._objects = new Set()
    }

    addObject(obj: LevelObject): void {
        this._objects.add(obj)
        obj.setLevel(this)
    }

    get shape(): Shape {
        return this._shape
    }
}

export class Rectangle implements Shape {

    private _width: number;
    private _height: number;

    constructor(width: number, height: number) {
        if(width === 0){
            throw new Error('Invalid width 0')
        }
        if(height === 0){
            throw new Error('Invalid height 0')
        }
        this._width = width
        this._height = height
    }

    points(): Point[] {
        return [
            new Point(0, 0),
            new Point(this._width, 0),
            new Point(this._width, this._height),
            new Point(0, this._height)
        ]
    }

    get width(): number {
        return this._width
    }

    get height(): number {
        return this._height
    }

}

export interface LevelObject {
    setLevel(level: Level): void;
}

export interface Shape {
    points(): Point[]
}

export class Point {

    private _x: number;
    private _y: number;

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
