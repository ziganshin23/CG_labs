function clipRectangle(rectangle, lines)
{
    var left = 1 << 0;
    
    var right = 1 << 1;

    var down = 1 << 2;

    var up = 1 << 3;

    function getPointBit(x, y)
	{
		var bit = 0;

		if(x < rectangle[0])
        {
            bit |= left;
        }
        else
        {
            if(x > rectangle[2])
            {
                bit |= right;
            }
        }

        if(y > rectangle[3])
        {
            bit |= down;
        }
        else
        {
            if(y < rectangle[1])
            {
                bit |= up;
            }
        }

		return bit;
	}

	function getLineBit(line)
	{
		return [getPointBit(line.x_0, line.y_0), getPointBit(line.x_1, line.y_1)];
	}

	function clipLine(line)
	{
		var newLine = {x_0: line.x_0, y_0: line.y_0, x_1: line.x_1, y_1: line.y_1};

		var bit = getLineBit(newLine);

		while(bit[0] | bit[1])
		{
			if(bit[0] & bit[1])
            {
				return null;
            }

            var x = null;

            var y = null;

            var count = null;

			if(bit[0])
			{
				count = bit[0];

				x = newLine.x_0;
                
                y = newLine.y_0;
			}
			else
			{
				count = bit[1];

				x = newLine.x_1;
                
                y = newLine.y_1;
			}

			if(count & left)
			{
				y += (newLine.y_0 - newLine.y_1) * (rectangle[0] - x) / (newLine.x_0 - newLine.x_1);

				x = rectangle[0];
			}
            else
            {
                if(count & right)
                {
                    y += (newLine.y_0 - newLine.y_1) * (rectangle[2] - x) / (newLine.x_0 - newLine.x_1);

                    x = rectangle[2];
                }
                else
                {
                    if(count & up)
                    {
                        x += (newLine.x_0 - newLine.x_1) * (rectangle[1] - y) / (newLine.y_0 - newLine.y_1);

                        y = rectangle[1];
                    }
                    else
                    {
                        if(count & down)
                        {
                            x += (newLine.x_0 - newLine.x_1) * (rectangle[3] - y) / (newLine.y_0 - newLine.y_1);

                            y = rectangle[3];
                        }
                    }
                }
            }

			if(count == bit[0])
			{
				newLine.x_0 = x;
                
                newLine.y_0 = y;
			}
			else
			{
				newLine.x_1 = x;
                
                newLine.y_1 = y;
			}

			bit = getLineBit(newLine);
		}

		return newLine;
	}

	var newLines = [];

	for(var i = 0; i < lines.length; ++i)
	{
		var newLine = clipLine(lines[i]);

		if(newLine != null)
        {
			newLines.push(newLine);
        }
	}

	return newLines;
}
