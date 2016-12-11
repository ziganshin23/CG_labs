function createCircle(context, x_0, y_0, radius)
{
    function createPixel(x_0, y_0)
    {
        context.fillRect(x_0, y_0, 1, 1);
    }

	var x = 0;

	var y = radius;

	var delta = 1 - 2 * radius;

	var error = 0;

	while(y >= 0)
	{
		createPixel(x_0 + x, y_0 + y);

		createPixel(x_0 + x, y_0 - y);

		createPixel(x_0 - x, y_0 + y);

		createPixel(x_0 - x, y_0 - y);

		error = 2 * (delta + y) - 1;

		if((delta < 0) && (error <= 0))
		{
            ++x;

			delta += 2 * x + 1;

			continue;
		}

		error = 2 * (delta - x) - 1;

		if((delta > 0) && (error > 0))
		{
            --y;

			delta += 1 - 2 * y;

			continue;
		}

		x++;

		delta += 2 * (x - y);

		y--;
	}
}