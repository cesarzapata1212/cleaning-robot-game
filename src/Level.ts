export class Level {

    private _dimentions: Dimentions;
    private _objects: Set<LevelObject>;

    constructor(dimentions: Dimentions) {
        this._dimentions = dimentions
        this._objects = new Set()
    }

    addObject(obj: LevelObject): void {
        this._objects.add(obj)
        obj.setLevel(this)
    }
}

export interface LevelObject {

    setLevel(level: Level): void;
    
}

export class Square {

    private _width: number;
    private _height: number;

    constructor(width: number, height: number) {
        this._width = width
        this._height = height
    }

}

export interface Dimentions {

}