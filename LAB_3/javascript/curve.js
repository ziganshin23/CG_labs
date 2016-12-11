function createCurve(context, points)
{
	function getPointOnLine(angle, x_0, y_0, x_1, y_1)
	{
		var newX = (x_1 - x_0) * angle + x_0;

		var newY = (y_1 - y_0) * angle + y_0;

		return {x: newX, y: newY};
	}

	function getPointOnCurve(angle, points)
	{
		if(points.length == 2)
        {
            return getPointOnLine(angle, points[0].x, points[0].y, points[1].x, points[1].y);
        }

		var newPoints = [];

		for(var i = 1; i < points.length; ++i)
        {
			newPoints.push(getPointOnLine(angle, points[i - 1].x, points[i - 1].y, points[i].x, points[i].y));
        }

		return getPointOnCurve(angle, newPoints);
	}

	var angle = 0.01;

	var point = getPointOnCurve(0, points);

	for(var i = angle; i <= 1; i += angle)
	{
		var newPoint = getPointOnCurve(i, points);

		createLine(context, point.x, point.y, newPoint.x, newPoint.y);

		point = newPoint;
	}
}