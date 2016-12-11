function distance(x_0, y_0, x_1, y_1)
{
	return Math.sqrt(Math.pow(x_1 - x_0, 2) + Math.pow(y_1 - y_0, 2));
}

function findFramingRectangle(polygon)
{
	var xMax = null;
    
    var xMin = null;
    
    var yMax = null;
    
    var yMin = null;

	xMax = xMin = polygon[0].x;

	yMax = yMin = polygon[0].y;

	for(var i = 1; i < polygon.length - 1; ++i)
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

function drawRectangle(context, rectangle)
{
	createLine(context, rectangle[0], rectangle[1], rectangle[2], rectangle[1]);

	createLine(context, rectangle[2], rectangle[1], rectangle[2], rectangle[3]);

	createLine(context, rectangle[2], rectangle[3], rectangle[0], rectangle[3]);

	createLine(context, rectangle[0], rectangle[3], rectangle[0], rectangle[1]);
}

function polygonDraw(context, polygon)
{
	for(var i = 1; i < polygon.length; ++i)
    {
        createLine(context, polygon[i - 1].x, polygon[i - 1].y, polygon[i].x, polygon[i].y)
    }
}

function addPointToPolygon(polygon, x, y)
{
	polygon.push({x: x, y: y});
}

function pushPoint(arr, x, y)
{
	arr.push({x: x, y: y});
}

function isInterval(x, y, z)
{
	if(((x <= y) && (x <= z)) || ((x >= y) && (x >= z)))
    {
        return false;
    }

    return true;
}

function randInt(minimum, maximum) 
{
    var random = Math.floor(minimum + Math.random() * (maximum + 1 - minimum));

    return random;
}