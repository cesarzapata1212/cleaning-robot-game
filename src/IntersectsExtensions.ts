import { Point } from "Level"
let Intersects = require('intersects')


export class IntersectsExtensions {

    /**
     * Determines if a circle within a polygon is colliding with any of the polygons walls
     * 
     * @param points [{x1, y1}, {x2, y2}, ... {xn, yn}] of polygon
     * @param xc center of circle
     * @param yc center of circle
     * @param rc radius of circle
     */
    public static polygonOutlineCircle(points: Point[], xc: number, yc: number, rc: number) {
        for (let i = 0; i < points.length - 1; i++) {
            const point = points[i];
            const nexxtPoint = points[i + 1];
            let x1 = point.x,
                y1 = point.y,
                x2 = nexxtPoint.x,
                y2 = nexxtPoint.y

            if (Intersects.circleLine(xc, yc, rc, x1, y1, x2, y2)) {
                return true;
            }
        }

        let x1 = points[0].x,
            y1 = points[0].y,
            x2 = points[points.length - 1].x,
            y2 = points[points.length - 1].y

        if (Intersects.circleLine(xc, yc, rc, x1, y1, x2, y2)) {
            return true;
        }

        return false
    }
}