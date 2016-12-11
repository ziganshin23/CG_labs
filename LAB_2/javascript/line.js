function createLine(context, x_0, y_0, x_1, y_1)
{
	function createPixel(x_0, y_0)
    {
        context.fillRect(x_0, y_0, 1, 1);
    }

	var deltaX = Math.abs(x_1 - x_0);

	var deltaY = Math.abs(y_1 - y_0);

	var error = 0;

	if(deltaX >= deltaY)
	{
		if(x_0 > x_1)
		{
			[x_0, x_1] = [x_1, x_0];
			[y_0, y_1] = [y_1, y_0];
		}

		var deltaError = deltaY;

		if(y_0 >= y_1)
		{ 
			while(x_0 <= x_1)
			{
				createPixel(x_0, y_0);

				error += deltaError;

				if((error << 2) > deltaX)
				{
					--y_0;

					error -= deltaX;
				}

				++x_0;
			}
		}
		else
		{
			while(x_0 <= x_1)
			{
				createPixel(x_0, y_0);

				error += deltaError;

				if((error << 2) > deltaX)
				{
					++y_0;

					error -= deltaX;
				}

				++x_0;
			}
		}
	}
	else
	{
		if(y_0 > y_1)
		{
			[x_0, x_1] = [x_1, x_0];
			[y_0, y_1] = [y_1, y_0];
		}

		var deltaError = deltaX;

		if(x_0 >= x_1)
		{
			while(y_0 <= y_1)
			{
				createPixel(x_0, y_0);

				error += deltaError;

				if((error << 2) > deltaY)
				{
					--x_0;

					error -= deltaY;
				}

				++y_0;
			}
		}
		else
		{
			while(y_0 <= y_1)
			{
				createPixel(x_0, y_0);

				error += deltaError;

				if((error << 2) > deltaY)
				{
					++x_0;
					
					error -= deltaY;
				}

				++y_0;
			}
		}
	}
}