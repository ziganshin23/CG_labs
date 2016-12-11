function fillRegion(context, x, y, width, height)
{
	function isWhite(x, y)
	{
		pixel = context.getImageData(x, y, 1, 1).data;
        
		if(pixel[3] == 0)
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

	var stack = [ [x, y] ];

	while(stack.length > 0)
	{
		point = stack.pop();

		var x = point[0];
        
        var y = point[1];

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

		stack.push([x - 1, y]);

		stack.push([x, y + 1]);

		stack.push([x, y - 1]);
	}
}