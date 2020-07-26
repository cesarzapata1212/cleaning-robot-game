"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
var Robot_1 = require("../src/Robot");
describe('robot module', function () {
    describe('Robot', function () {
        test('should be defined', function () {
            expect(Robot_1.Robot).toBeDefined();
        });
        test('should set defaults', function () {
            var robot = new Robot_1.Robot();
            expect(robot.x).toEqual(0);
            expect(robot.y).toEqual(0);
            expect(robot.speed).toEqual(0);
            expect(robot.direction).toEqual(new Robot_1.Angle(0));
        });
        test('constructor should take initial position', function () {
            var position = new Robot_1.Position(1, 1);
            var direction = new Robot_1.Angle(90);
            var robot = new Robot_1.Robot(position, direction);
            expect(robot.x).toEqual(position.x);
            expect(robot.y).toEqual(position.y);
            expect(robot.direction).toEqual(new Robot_1.Angle(90));
        });
        test('should increase speed when move is called', function () {
            var robot = new Robot_1.Robot();
            expect(robot.speed).toEqual(0);
            robot.move();
            expect(robot.speed).toEqual(5);
        });
        describe('move', function () {
            test('should change pivot X when moving forward (Angle=0)', function () {
                var robot = new Robot_1.Robot(new Robot_1.Position(0, 0), Robot_1.Angle.FORWARD);
                robot.move();
                expect(robot.x).toEqual(5);
                expect(robot.y).toEqual(0);
            });
            test('should change pivot Y when moving at 90 degrees angle', function () {
                var robot = new Robot_1.Robot(new Robot_1.Position(0, 0), new Robot_1.Angle(90));
                robot.move();
                expect(robot.y).toEqual(5);
            });
        });
    });
    describe('Position', function () {
        test('should be defined', function () {
            expect(Robot_1.Position).toBeDefined();
        });
        test('should take initial position', function () {
            expect(new Robot_1.Position(1, 0).x).toEqual(1);
            expect(new Robot_1.Position(1, 0).y).toEqual(0);
            expect(new Robot_1.Position(0, 1).x).toEqual(0);
            expect(new Robot_1.Position(0, 1).y).toEqual(1);
        });
    });
    describe('Angle', function () {
        test('should be defined', function () {
            expect(Robot_1.Angle).toBeDefined();
        });
        test('should have angle 0 by default', function () {
            expect(new Robot_1.Angle().degrees()).toEqual(0);
        });
        test('should accept only range from -360 to 360 degree', function () {
            expect(new Robot_1.Angle(-359).degrees()).toEqual(-359);
            expect(new Robot_1.Angle(-360).degrees()).toEqual(-360);
            expect(function () { return new Robot_1.Angle(-361); }).toThrow(new Robot_1.AngleValueError(-361));
            expect(new Robot_1.Angle(359).degrees()).toEqual(359);
            expect(new Robot_1.Angle(360).degrees()).toEqual(360);
            expect(function () { return new Robot_1.Angle(361); }).toThrow(new Robot_1.AngleValueError(361));
        });
    });
});
//# sourceMappingURL=robot.spec.js.map