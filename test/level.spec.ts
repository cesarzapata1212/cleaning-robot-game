import { Rectangle, Point, Level, Shape } from "../src/Level";


describe('Level', () => {
    test('addObject should add object', () => {

    });
    test('addCollectable should add items', () => {
        let level = new Level(new Rectangle(200, 200))
    });
});


describe('Rectangle', () => {
    test('should return points', () => {
        expect(new Rectangle(100, 200).points()).toEqual([
            new Point(0, 0),
            new Point(100, 0),
            new Point(100, 200),
            new Point(0, 200)
        ])
        expect(new Rectangle(50, 70).points()).toEqual([
            new Point(0, 0),
            new Point(50, 0),
            new Point(50, 70),
            new Point(0, 70)
        ])
    });

    test('should not allow zero width or height', () => {
        expect(() => new Rectangle(0, 10)).toThrowError('Invalid width 0')
        expect(() => new Rectangle(10, 0)).toThrowError('Invalid height 0')
    });
});