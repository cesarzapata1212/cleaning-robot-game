import 'jest'

import { Robot, Position, Angle, AngleValueError } from 'app/robot'


describe('robot module', () => {
    describe('Robot', () => {
        test('should be defined', () => {
            expect(Robot).toBeDefined();
        })

        test('should set defaults', () => {
            let robot = new Robot()

            expect(robot.x).toEqual(0)
            expect(robot.y).toEqual(0)
            expect(robot.speed).toEqual(0)
            expect(robot.direction).toEqual(new Angle(0))
        });

        test('constructor should take initial position', () => {
            let position = new Position(1, 1)
            let direction = new Angle(90)

            let robot = new Robot(position, direction)

            expect(robot.x).toEqual(position.x)
            expect(robot.y).toEqual(position.y)
            expect(robot.direction).toEqual(new Angle(90))
        })

        test('should increase speed when move is called', () => {
            let robot = new Robot()
            expect(robot.speed).toEqual(0)

            robot.move()

            expect(robot.speed).toEqual(5)
        });

        describe('move', () => {
            test('should change pivot X when moving forward (Angle=0)', () => {
                let robot = new Robot(new Position(0, 0), Angle.FORWARD)

                robot.move()

                expect(robot.x).toEqual(5)
                expect(robot.y).toEqual(0)
            });

            test('should change pivot Y when moving at 90 degrees angle', () => {
                let robot = new Robot(new Position(0, 0), new Angle(90))

                robot.move()

                expect(robot.y).toEqual(5)
            });
        });
    })

    describe('Position', () => {
        test('should be defined', () => {
            expect(Position).toBeDefined()
        })

        test('should take initial position', () => {
            expect(new Position(1, 0).x).toEqual(1)
            expect(new Position(1, 0).y).toEqual(0)

            expect(new Position(0, 1).x).toEqual(0)
            expect(new Position(0, 1).y).toEqual(1)
        })
    })

    describe('Angle', () => {
        test('should be defined', () => {
            expect(Angle).toBeDefined()
        })

        test('should have angle 0 by default', () => {
            expect(new Angle().degrees()).toEqual(0)
        });

        test('should accept only range from -360 to 360 degree', () => {
            expect(new Angle(-359).degrees()).toEqual(-359)
            expect(new Angle(-360).degrees()).toEqual(-360)
            expect(() => new Angle(-361)).toThrow(new AngleValueError(-361))

            expect(new Angle(359).degrees()).toEqual(359)
            expect(new Angle(360).degrees()).toEqual(360)
            expect(() => new Angle(361)).toThrow(new AngleValueError(361))
        });
    })
})