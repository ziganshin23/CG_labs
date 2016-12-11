(function()
{
    class Point
    {
        constructor(x, y, z)
        {
            if(z === undefined)
            {
                z = 0;
            }

            this.data = [x, y, z, 1];
        }

        get x()
        {
            return this.data[0];
        }

        get y()
        {
            return this.data[1];
        }

        get z()
        {
            return this.data[2];
        }

        set x(value)
        {
            this.data[0] = value;
        }

        set y(value)
        {
            this.data[1] = value;
        }

        set z(value)
        {
            this.data[2] = value;
        }

        clone()
        {
            return new Point(this.data[0], this.data[1], this.data[2]);
        }

        applyTransform(matrix)
        {
            let newPoint = new Point(0, 0, 0);

            for(let i = 0; i < 3; ++i)
            {
                let temporary = 0;

                for(let j = 0; j < 4; ++j)
                {
                    temporary += matrix.data[i][j] * this.data[j];
                }

                newPoint.data[i] = temporary;
            }

            return newPoint;
        }

        round()
        {
            let newPoint = new Point(Math.round(this.data[0]), Math.round(this.data[1]), Math.round(this.data[2]));

            return newPoint;
        }
    };

    function isCorrectArray(array)
    {
        if(array.length != 4)
        {
            return false;
        }

        for(let i = 0; i < 4; ++i)
        {
            if(array[i].length != 4)
            {
                return false;
            }
        }

        return true;
    }

    class Matrix
    {
        constructor(array, replication)
        {
            if(replication === false)
            {
                this.data = array;
            }
            else
            {
                if(!isCorrectArray(array))
                {
                    throw new Error("Something ways wrong!");
                }

                this.data = [];

                for(let i = 0; i < 4; ++i)
                {
                    this.data[i] = array[i].slice();
                }
            }
        }

        static multiplication(matrix_1, matrix_2)
        {
            function multiply(position, row)
            {
                for(let i = 0; i < 4; ++i)
                {
                    let temporary = 0;

                    for(let j = 0; j < 4; ++j)
                    {
                        temporary += matrix_1.data[position][j] * matrix_2.data[j][i];
                    }

                    row[i] = temporary;
                }
            }
            
            let matrix_3 = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];

            for(let i = 0; i < 4; ++i)
            {
                multiply(i, matrix_3[i]);
            }

            return new Matrix(matrix_3, false);
        }

        static move(x, y, z)
        {
            return new Matrix([[1, 0, 0, x], [0, 1, 0, y], [0, 0, 1, z], [0, 0, 0, 1]]);
        }

        static scale(x, y, z)
        {
            return new Matrix([[x, 0, 0, 0], [0, y, 0, 0], [0, 0, z, 0], [0, 0, 0, 1]]);
        }

        static identity()
        {
            return new Matrix([[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]]);
        }

        static rotateZ(a)
        {
            return new Matrix([[Math.cos(a), -Math.sin(a), 0, 0], [Math.sin(a), Math.cos(a), 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]]);
        }

        static rotateY(a)
        {
            return new Matrix([[Math.cos(a), 0, Math.sin(a), 0], [0, 1, 0, 0], [-Math.sin(a), 0, Math.cos(a), 0], [0, 0, 0, 1]]);
        }

        static rotateX(a)
        {
            return new Matrix([[1, 0, 0, 0], [0, Math.cos(a), -Math.sin(a), 0], [0, Math.sin(a), Math.cos(a), 0], [0, 0, 0, 1]]);
        }
    };

    function createLine(context, x_0, y_0, x_1, y_1) 
    {
        x_0 = Math.round(x_0);

        y_0 = Math.round(y_0);

        x_1 = Math.round(x_1);

        y_1 = Math.round(y_1);

        let dX = Math.abs(x_1 - x_0);

        let dY = Math.abs(y_1 - y_0);
        
        let scaleX = x_0 < x_1 ? 1 : -1;
        
        let scaleY = y_0 < y_1 ? 1 : -1; 
        
        let error = (dX > dY ? dX : -dY) / 2;
    
        while(true) 
        {
            context.fillRect(x_0, y_0, 1, 1);

            if((x_0 === x_1) && (y_0 === y_1))
            {
                break;
            }
        
            let temporary = error;

            if(temporary > -dX) 
            { 
                error -= dY;

                x_0 += scaleX;
            }

            if(temporary < dY) 
            { 
                error += dX;

                y_0 += scaleY;
            }
        }
    }


    function createCircle(context, x_0, y_0, radius)
    {
        function dot(x, y)
        {
            context.fillRect(x, y, 1, 1);
        }

        let x = 0;

        let y = radius;

        let delta = 1 - 2 * radius;

        let error = 0;

        while(y >= 0)
        {
            dot(x_0 + x, y_0 + y);

            dot(x_0 + x, y_0 - y);

            dot(x_0 - x, y_0 + y);

            dot(x_0 - x, y_0 - y);

            error = 2 * (delta + y) - 1;

            if((delta < 0) && (error <= 0))
            {
                delta += 2 * (++x) + 1;

                continue;
            }

            error = 2 * (delta - x) - 1;

            if((delta > 0) && (error > 0))
            {
                delta += 1 - 2 * (--y);

                continue;
            }

            x++;

            delta += 2 * (x - y);

            y--;
        }
    }

    function findFramingRectangle(polygon)
    {
        let xMax = null;
        
        let xMin = null;
        
        let yMax = null;
        
        let yMin = null;

        xMax = xMin = polygon[0].x;

        yMax = yMin = polygon[0].y;

        for(let i = 1; i < polygon.length; ++i)
        {
            if(polygon[i].x > xMax)
            {
                xMax = polygon[i].x;
            }
            else
            {
                if(polygon[i].x < xMin)
                {
                    xMin = polygon[i].x;
                }
            }

            if(polygon[i].y > yMax)
            {
                yMax = polygon[i].y;
            }
            else
            {
                if(polygon[i].y < yMin)
                {
                    yMin = polygon[i].y;
                }
            }
        }

        return [xMin, yMin, xMax, yMax];
    }

    function fillPolygon(context, polygon)
    {
        let rectangle = findFramingRectangle(polygon);

        function isSegment(x, y, z)
        {
            if(((x < y) && (x < z)) || ((x > y) && (x > z)))
            {
                return false;
            }

            return true;
        }

        function isBound(x, y, z)
        {
            if(y > z)
            {
                [y, z] = [z, y];
            }

            if((x < y) || (x > z))
            {
                return false;
            }

            if(x == z)
            {
                return false;
            }

            return true;
        }

        function getLines(polygon)
        {
            let lines = [];

            function pushLine(i_1, i_2)
            {
                let x_0 = polygon[i_1].x;

                let x_1 = polygon[i_2].x;
                
                let y_0 = polygon[i_1].y;

                let y_1 = polygon[i_2].y;

                let coefficient = (y_1 - y_0) / (x_1 - x_0);

                let value = null;

                let type = null;

                if(x_1 - x_0 != 0)
                {
                    value = y_1 - coefficient * x_1;

                    if(coefficient == 0)
                    {
                        type = 'y';
                    }
                }
                else
                {
                    type = 'x';
                }

                lines.push({type: type, x_0: x_0, x_1: x_1, y_0: y_0, y_1: y_1, coefficient: coefficient, value: value});
            }

            for(let i = 1; i < polygon.length; ++i)
            {
                pushLine(i, i - 1);
            }

            pushLine(polygon.length - 1, 0);

            return lines;
        }

        function findIntersection(lines, y)
        {
            let list = [];

            for(let i = 0; i < lines.length; ++i)
            {
                let line = lines[i];

                switch(line.type)
                {
                    case 'y':
                    {
                        break;
                    }

                    case 'x':
                    {
                        if(!isBound(y, line.y_0, line.y_1))
                        {
                            continue;
                        }

                        list.push({x: line.x_0, y: y});

                        break;
                    }

                    default:
                    {
                        if(!isBound(y, line.y_0, line.y_1))
                        {
                            continue;
                        }

                        let x = Math.round((y - line.b) / line.k);

                        if(!isSegment(x, line.x_0, line.x_1))
                        {
                            continue;
                        }

                        list.push({x: x, y: y});

                        break;
                    }
                }
            }

            list.sort(function(a,b)
            {
                if(a.x < b.x)
                {
                    return -1;
                }
                else
                {
                    if(a.x > b.x)
                    {
                        return 1;
                    }
                    
                    return 0;
                }
            });
            
            return list;
        }

        function fillList(list)
        {
            if(list.length % 2 != 0)
            {
                alert("Something ways wrong!");

                return;
            }

            for(let i = 1; i < list.length; i += 2)
            {
                let element = list[i].x - list[i - 1].x + 1;

                if(element <= 0)
                {
                    continue;
                }

                context.fillRect(list[i - 1].x, list[i - 1].y, element, 1);
            }
        }
        
        let yMin = rectangle[1];

        let yMax = rectangle[3];

        let lines = getLines(polygon);

        for(let y = yMin; y <= yMax; ++y)
        {
            let list = findIntersection(lines, y);

            fillList(list);
        }
    }

    function fillRegionByPoint(context, x, y, width, height)
    {
        function isWhite(x, y)
        {
            let pixel = context.getImageData(x, y, 1, 1).data;
            
            if((pixel[0] == 255) && (pixel[1] == 255) && (pixel[2] == 255))
            {
                return true;
            }

            return false;
        }

        function isValidPosition(x, y)
        {
            if((x < 0) || (x > width) || (y < 0) || (y > height))
            {
                return false;
            }

            return true;
        }

        let stack = [[x, y]];

        while(stack.length != 0)
        {
            let point = stack.pop();

            let x = point[0];
            
            let y = point[1];

            if(!isValidPosition(x, y))
            {
                continue;
            }

            if(!isWhite(x, y))
            {
                continue;
            }

            context.fillRect(x, y, 1, 1);

            stack.push([x + 1, y]);

            stack.push([x, y + 1]);

            stack.push([x - 1, y]);

            stack.push([x, y - 1]);
        }
    }

    function createCurve(context, points)
    {
        function getPointOnLine(value, x_0, y_0, z_0, x_1, y_1, z_1)
        {
            let newX = (x_1 - x_0) * value + x_0;

            let newY = (y_1 - y_0) * value + y_0;

            let newZ = (z_1 - z_0) * value + z_0;

            return new Point(newX, newY, newZ);
        }

        function getPointOnCurve(value, points)
        {
            if(points.length == 2)
            {
                return getPointOnLine(value, points[0].x, points[0].y, points[0].z,  points[1].x, points[1].y, points[1].z);
            }

            let newPoints = [];

            for(let i = 1; i < points.length; ++i)
            {
                newPoints.push(getPointOnLine(value, points[i - 1].x, points[i - 1].y, points[i - 1].z,  points[i].x, points[i].y, points[i].z));
            }

            return getPointOnCurve(value, newPoints);
        }

        let dT = 0.01;

        let point = getPointOnCurve(0, points);
        
        for(let i = dT; i <= 1; i += dT)
        {
            let newPoint = getPointOnCurve(i, points);

            createLine(context, Math.round(point.x), Math.round(point.y), Math.round(newPoint.x), Math.round(newPoint.y));

            point = newPoint;
        }
    }
    
    function bezierCurveToLines(points, polylinePoints, dT, begin, end)
    {
        if(polylinePoints === undefined)
        {
            polylinePoints = [];
        }

        if(begin === undefined)
        {
            begin = 0;
        }

        if(end === undefined)
        {
            end = 1;
        }

        function getPointOnLine(value, x_0, y_0, z_0, x_1, y_1, z_1)
        {
            let newX = Math.round((x_1 - x_0) * value + x_0);

            let newY = Math.round((y_1 - y_0) * value + y_0);

            let newZ = Math.round((z_1 - z_0) * value + z_0);

            return new Point(newX, newY, newZ);
        }

        function getPointOnCurve(value, points)
        {
            if(points.length == 2)
            {
                return getPointOnLine(value, points[0].x, points[0].y, points[0].z,  points[1].x, points[1].y, points[1].z);
            }

            let newPoints = [];

            for(let i = 1; i < points.length; ++i)
            {
                newPoints.push(getPointOnLine(value, points[i - 1].x, points[i - 1].y, points[i - 1].z,  points[i].x, points[i].y, points[i].z));
            }

            return getPointOnCurve(value, newPoints);
        }

        if(dT === undefined)
        {
            dT = 0.05;
        }

        for(let i = begin; i <= end; i += dT)
        {
            polylinePoints.push(getPointOnCurve(i, points));
        }

        if((end - begin) / (dT % 1) > 0.0001)
        {
            polylinePoints.push(getPointOnCurve(end, points));
        }

        return polylinePoints;
    }

    function clipLineByRectangle(rectangle, line)
    {
        let left = 1 << 0;

        let right = 1 << 1;

        let down = 1 << 2;

        let up = 1 << 3;
        
        function getPointBit(x, y)
        {
            let bit = 0;

            if(x < rectangle.x_l)
            {
                bit |= left;
            }
            else
            {
                if(x > rectangle.x_radius)
                {
                    bit |= right;
                }
            }

            if(y > rectangle.y_bit)
            {
                bit |= down;
            }
            else
            {
                if(y < rectangle.y_t)
                {
                    bit |= up;
                }
            }

            return b;
        }

        function getLineBit(line)
        {
            return [getPointBit(line[0].x, line[0].y), getPointBit(line[1].x, line[1].y)];
        }

        function clipLine(line)
        {
            let bits = getLineBit(line);

            while(bits[0] | bits[1])
            {
                if(bits[0] & bits[1])
                    return null;

                let x = null;
                
                let y = null;

                let count = null

                if(bits[0])
                {
                    count = bits[0];

                    x = line[0].x;
                    
                    y = line[0].y;
                }
                else
                {
                    count = bits[1]
                    
                    x = line[1].x;
                    
                    y = line[1].y;
                }

                if(count & left)
                {
                    y += (line[0].y - line[1].y) * (rectangle.x_l - x) / (line[0].x - line[1].x);

                    x = rectangle.xl;
                }
                else if(count & right)
                {
                    y += (line[0].y - line[1].y) * (rectangle.x_radius - x) / (line[0].x - line[1].x);

                    x = rectangle.x_radius;
                }
                else if(count & up)
                {
                    x += (line[0].x - line[1].x) * (rectangle.y_t - y) / (line[0].y - line[1].y);

                    y = rectangle.y_t;
                }
                else if(count & down)
                {
                    x += (line[0].x - line[1].x) * (rectangle.y_bit - y) / (line[0].y - line[1].y);

                    y = rectangle.y_bit;
                }

                if(count == bits[0])
                {
                    line[0].x = Math.round(x);
                    
                    line[0].y = Math.round(y);
                }
                else
                {
                    line[1].x = Math.round(x);
                    
                    line[1].y = Math.round(y);
                }

                bits = getLineBit(line);
            }

            return line;
        }

        return clipLine(line);
    }

    const LINE = 0;
    const POLYLINE = 1;
    const CIRCLE = 2;
    const CIRCLES = 3;
    const POLYGON = 4;
    const BEZIER_CURVE = 5;

    class Rectangle
    {
        constructor(point_1, point_2)
        {
            this.point_1 = point_1;
            this.point_2 = point_2;
        }

        get x_l()
        {
            return this.point_1.x;
        }

        get x_radius()
        {
            return this.point_2.x;
        }

        get y_t()
        {
            return this.point_1.y;
        }

        get y_bit()
        {
            return this.point_2.y;
        }
    };

    class Circle
    {
        constructor(point, radius)
        {
            this.point = point;

            this.radius = radius;
        }
    };

    class Figure 
    {
        constructor(type, color, points)
        {
            this.type = type;

            this.color = color;

            this.points = points;

            this.fillColor = "TRANSPARENT";
        }
    };

    class Drawer
    {
        constructor(canvas)
        {
            this._canvas = canvas;

            this._context = canvas.getContext('2d');

            this._width = canvas.width;

            this._height = canvas.height;

            this._color = "#000000";

            this._clearColor = "#FFFFFF";

            this._fillColor = "TRANSPARENT";

            this._figures = [];

            this._clipRectangle = new Rectangle(new Point(0, 0), new Point(canvas.width, canvas.height));
        }

        set color(color)
        {
            this._color = color;
        }

        get color()
        {
            return this._clearColor;
        }

        set clearColor(color)
        {
            this._clearColor = color;
        }

        get clearColor()
        {
            return this._color;
        }

        set fillColor(color)
        {
            this._fillColor = color;
        }

        get fillColor()
        {
            return this._fillColor;
        }

        set clipRectangle(rectangle)
        {
            this._clipRectangle = rectangle;
        }

        line3D(x_0, y_0, z_0, x_1, y_1, z_1)
        {
            let point_1 = new Point(x_0, y_0, z_0);

            let point_2 = new Point(x_1, y_1, z_1);

            this._figures.push(new Figure(LINE, this._color, [point_1, point_2]));
        }

        lineTemporary(x_0, y_0, x_1, y_1)
        {
            this._line3D(x_0, y_0, 0, x_1, y_1, 0);
        }

        line(point_1, point_2)
        {
            this._figures.push(new Figure(LINE, this._color, [point_1.clone(), point_2.clone()]));
        }

        circle3D(x, y, z, radius)
        {
            let point = new Point(x, y, z);

            this._figures.push(new Figure(CIRCLE, this._color, [point, radius]));
        }
        
        circle(c)
        {
            this._figures.push(new Figure(CIRCLE, this._color, [c.p, c.r]));
        }

        circles(point_radius)
        {
            this._figures.push(new Figure(CIRCLES, this._color, point_radius));
        }

        polyline(points)
        {
            this._figures.push(new Figure(POLYLINE, this._color, points));
        }

        polygon(points)
        {
            let figure = new Figure(POLYGON, this._color, points);

            figure.fillColor = this._fillColor;

            this._figures.push(figure);
        }

        rectangle(radius)
        {
            let plt = radius.point_1;

            let prb = radius.point_2;

            let prt = new Point(prb.x, plt.y);

            let plb = new Point(plt.x, prb.y);

            this._polygon([plt, prt, prb, plb]);	
        }

        bezier(points)
        {
            let newPoints = [];

            for(let i = 0; i < points.length; ++i)
            {
                newPoints[i] = points[i].clone();
            }

            this._figures.push(new Figure(BEZIER_CURVE, this._color, newPoints));
        }

        draw()
        {
            for(let i = 0; i < this._figures.length; ++i)
            {
                let figure = this._figures[i];

                this._context.fillStyle = figure.color;

                switch(figure.type)
                {
                    case LINE:
                    {
                        let line = clipLineByRectangle(this._clipRect, figure.points);

                        if(line === null)
                        {
                            break;
                        }

                        let point_1 = line[0];
                        
                        let point_2 = line[1];

                        createLine(this._context, point_1.x, point_1.y, point_2.x, point_2.y);
                        
                        break;
                    }

                    case POLYLINE:
                    {
                        let points = figure.points;

                        for(let i = 1; i < points.length; ++i)
                        {
                            createLine(this._context, points[i].x, points[i].y, points[i - 1].x, points[i - 1].y);
                        }

                        break;
                    }

                    case CIRCLE:
                    {
                        let point = figure.points[0];
                        
                        let radius = figure.points[1];

                        createCircle(this._context, point.x, point.y, radius);
                        
                        break;
                    }

                    case CIRCLES:
                    {
                        let points = figure.points;

                        for(let i = 0; i < points.length; i += 2)
                        {
                            createCircle(this._context, points[i].x, points[i].y, points[i + 1]);
                        }

                        break;
                    }

                    case POLYGON:
                    {
                        let points = figure.points;

                        if(figure.fillColor != "TRANSPARENT")
                        {
                            this._context.fillStyle = figure.fillColor;

                            fillPolygon(this._context, points);
                        }

                        this._context.fillStyle = figure.color;

                        for(let i = 1; i < points.length; ++i)
                        {
                            createLine(this._context, points[i].x, points[i].y, points[i - 1].x, points[i - 1].y);
                        }

                        let length = points.length - 1;

                        createLine(this._context, points[length].x, points[length].y, points[0].x, points[0].y);

                        break;
                    }

                    case BEZIER_CURVE:
                    {
                        let points = figure.points;

                        if(points.length < 2)
                        {
                            break;
                        }

                        createCurve(this._context, points);
                        
                        break;
                    }
                }
            }

            this._figures = [];
        }

        fillRegion(point)
        {
            this._context.fillStyle = this._fillColor;

            fillRegionByPoint(this._context, point.x, point.y, this._width, this._height);
        }

        clear() 
        {
            this._context.fillStyle = this._clearColor;

            this._context.fillRect(0, 0, this._width, this._height);
        }
        
        redraw()
        {
            this.clear();

            this.draw();
        }

        static evklidRadius(x_0, y_0, x_1, y_1)
        {
            return Math.sqrt(Math.pow(x_0 - x_1, 2) + Math.pow(y_0 - y_1, 2));
        }
    };

    let Misc = { bezierToLines: bezierCurveToLines };
        
    Drawer.Point = Point;

    Drawer.Rectangle = Rectangle;

    Drawer.Circle = Circle;

    Drawer.Matrix = Matrix;

    Drawer.Misc = Misc;

    window.Drawer = Drawer;
})();