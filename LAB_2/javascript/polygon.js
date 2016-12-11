function fillPolygon(context, polygon)
{
	var rectangle = findFramingRectangle(polygon);

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
		var lines = [];

		for(var i = 1; i < polygon.length; ++i)
		{
			var x_0 = polygon[i - 1].x;
            
            var y_0 = polygon[i - 1].y;
            
            var x_1 = polygon[i].x;
            
            var y_1 = polygon[i].y;

			var coefficient = (y_1 - y_0) / (x_1 - x_0);

			var type = null;

            var value = null;

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

		return lines;
	}

	function findIntersection(lines, y)
	{
		var list = [];

		for(var i = 0; i < lines.length; ++i)
		{
			var line = lines[i];

			switch(line.type)
			{
                case 'x':
                {
                    if(!isInYBound(y, line.y_0, line.y_1))
                    {
                        continue;
                    }

					list.push({x: line.x_0, y: y});

                    break;
                }

				case 'y':
                {
                    break;
                }

				default:
                {
                    if(!isBound(y, line.y_0, line.y_1))
                    {
                        continue;
                    }

                    var x = Math.round((y - line.value) / line.coefficient);

                    if(!isSegment(x, line.x_0, line.x_1))
                    {
                        continue;
                    }

                    list.push({x: x, y: y});
                }
			}
		}

        list.sort(function(A, B)
        {
            if(A.x < B.x)
            {
                return -1;
            }
            else
            {
                if(A.x > B.x)
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
			alert("List is broken!");

			return;
		}

		for(var i = 1; i < list.length; i += 2)
		{
			var value = list[i].x - list[i - 1].x + 2;

			if(value <= 0)
            {
                continue;
            }
            
			context.fillRect(list[i - 1].x - 1, list[i - 1].y, value, 1);
		}
	}
	
	var yMin = rectangle[1];

	var yMax = rectangle[3];

	var lines = getLines(polygon);

	for(var y = yMin; y <= yMax; ++y)
	{
		var list = findIntersection(lines, y);

		fillList(list);
	}
}