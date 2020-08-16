import { jest } from '@jest/globals'
import { Robot, Position, Angle, AngleValueError, InsufficientBatteryError } from '../src/Robot'
import { Level, Rectangle } from '../src/Level'


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

            let robot = new Robot({ position, direction })

            expect(robot.x).toEqual(position.x)
            expect(robot.y).toEqual(position.y)
            expect(robot.direction).toEqual(new Angle(90))
        })

        test('stop', () => {
            let robot = new Robot()
            robot.move()
            expect(robot.speed).toEqual(5)

            robot.stop()

            expect(robot.speed).toEqual(0)
        });

        test('radius', () => {
            let robot = new Robot()
            robot.size = 100
            expect(robot.radius()).toEqual(50)
            robot.size = 50
            expect(robot.radius()).toEqual(25)
        });

        describe('move', () => {
            test('should increase speed when move is called', () => {
                let robot = new Robot()
                expect(robot.speed).toEqual(0)

                robot.move()

                expect(robot.speed).toEqual(5)
            });

            test('should change pivot X when moving forward (Angle=0)', () => {
                let robot = new Robot({ direction: new Angle(Angle.CENTER) })

                robot.move()

                expect(robot.x).toEqual(5)
                expect(robot.y).toEqual(0)
            });

            test('should change pivot Y when moving at 90 degrees angle', () => {
                let robot = new Robot({ direction: new Angle(90) })

                robot.move()

                expect(robot.x).toEqual(0)
                expect(robot.y).toEqual(5)
            });

            test('should change pivot X and Y when moving in a diagonal', () => {
                let robot = new Robot({ direction: new Angle(45) })

                robot.move()

                expect(robot.x).toEqual(3.52)
                expect(robot.y).toEqual(3.55)
            });

            test('should not change position when obstacle is detected and stop moving', () => {
                let level = new Level(new Rectangle(300, 400))
                let robot = new Robot({
                    position: new Position(299, 399),
                    direction: new Angle(45)
                })
                level.addObject(robot)
                let expected = jest.fn()
                robot.onObstacleDetected(expected)

                robot.move()

                expect(expected).toHaveBeenCalled()
                expect(robot.x).toEqual(299)
                expect(robot.y).toEqual(399)
                expect(robot.speed).toEqual(0)
            });

            describe('collision detection', () => {
                const width = 800
                const height = 600
                const centerWidth = width / 2
                const centerHeight = height / 2
                let level,
                    robot: Robot,
                    radiusOutline: number,
                    expected: Function

                beforeEach(() => {
                    level = new Level(new Rectangle(width, height))
                    robot = new Robot()
                    radiusOutline = robot.radius() + 1
                    level.addObject(robot)
                    expected = jest.fn()
                    robot.onObstacleDetected(expected)
                })

                it('should detect right wall', () => {
                    robot.position = new Position(width - radiusOutline, centerHeight)
                    robot.changeDirection(Angle.TOWARDS_RIGHT)

                    robot.move()

                    expect(expected).toHaveBeenCalled()
                });

                it('should detect bottom wall', () => {
                    robot.position = new Position(centerWidth, height - radiusOutline)
                    robot.changeDirection(Angle.TOWARDS_BOTTOM)

                    robot.move()

                    expect(expected).toHaveBeenCalled()
                });

                it('should detect left wall', () => {
                    robot.position = new Position(radiusOutline, centerHeight)
                    robot.changeDirection(Angle.TOWARDS_LEFT)

                    robot.move()

                    expect(expected).toHaveBeenCalled()
                });

                test('should detect top wall', () => {
                    robot.position = new Position(centerWidth, radiusOutline)
                    robot.changeDirection(Angle.TOWARDS_TOP)

                    robot.move()

                    expect(expected).toHaveBeenCalled()
                });
            });
        });

        describe('batteryIndicator', () => {
            test('should set a default value of 10000', () => {
                expect(new Robot().batteryIndicator).toEqual(10000)
            });

            test('should use batery when moving', () => {
                let robot = new Robot()

                robot.move()
                expect(robot.batteryIndicator).toEqual(9999)

                robot.move()
                expect(robot.batteryIndicator).toEqual(9998)
            });

            test('should use battery when changing direction', () => {
                let robot = new Robot()

                robot.changeDirection(new Angle())
                expect(robot.batteryIndicator).toEqual(9999)

                robot.changeDirection(new Angle())
                expect(robot.batteryIndicator).toEqual(9998)
            });

            test('should throw error when battery fully depleted', () => {
                let robot = new Robot({ battery: 1 })
                robot.move()
                expect(() => robot.move()).toThrow(new InsufficientBatteryError())

                robot = new Robot({ battery: 1 })
                robot.changeDirection(new Angle())
                expect(() => robot.move()).toThrow(new InsufficientBatteryError())

                robot = new Robot({ battery: 0 })
                expect(() => robot.move()).toThrow(new InsufficientBatteryError())

                robot = new Robot({ battery: -1 })
                expect(() => robot.move()).toThrow(new InsufficientBatteryError())
            });

            test('should not change position when battery is empty', () => {
                let robot = new Robot({ battery: 0 })

                try { robot.move() } catch (error) { }

                expect(robot.x).toBe(0)
                expect(robot.y).toBe(0)
            });

            test('should not use battery when collision is detected', () => {
                const width = 800
                const height = 600
                let level = new Level(new Rectangle(width, height))
                let robot = new Robot({ battery: 10, position: new Position(799, 300) })
                level.addObject(robot)

                robot.move()

                expect(robot.batteryIndicator).toBe(10)
            });
        });

        describe('changeDirection', () => {
            test('should set new direction', () => {
                let robot = new Robot({ direction: new Angle(0) })

                robot.changeDirection(new Angle(1))
                expect(robot.direction).toEqual(new Angle(1))

                robot.changeDirection(new Angle(2))
                expect(robot.direction).toEqual(new Angle(2))
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
            expect(new Angle(Angle.MIN).degrees()).toEqual(Angle.MIN)
            expect(() => new Angle(Angle.MIN - 1)).toThrow(new AngleValueError(Angle.MIN - 1))

            expect(new Angle(Angle.MAX).degrees()).toEqual(Angle.MAX)
            expect(() => new Angle(Angle.MAX + 1)).toThrow(new AngleValueError(Angle.MAX + 1))
        });

        describe('add', () => {
            test('should add degrees to an angle', () => {
                let angle = new Angle(0)

                angle.add(10)
                expect(angle.degrees()).toEqual(10)

                angle.add(-20)
                expect(angle.degrees()).toEqual(-10)
            });

            test('should validate limits', () => {
                let angleMax = new Angle(Angle.MAX)
                expect(() => angleMax.add(1)).toThrow(new AngleValueError(361))

                let angleMin = new Angle(Angle.MIN)
                expect(() => angleMin.add(-1)).toThrow(new AngleValueError(-361))
            });
        });

        describe('rotation', () => {
            test('should calculate rotation', () => {
                expect(new Angle(0).rotation()).toEqual(0)
                expect(new Angle(90).rotation()).toEqual(1.57)
                expect(new Angle(180).rotation()).toEqual(3.14)
                expect(new Angle(360).rotation()).toEqual(6.28)
            });
        });
    })
})