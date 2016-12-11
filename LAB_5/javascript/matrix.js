class Matrix
{
    constructor(array, replication)
    {
        if(replication)
        {
            this.data = [];

            for(let i = 0; i < array.length; ++i)
            {
                this.data[i] = array[i].slice();
            }
        }
        else
        {
            this.data = array;
        }

        this.columns = array[0].length;

        this.rows = array.length;
    }

    static multiplication(matrix_1, matrix_2)
    {
        if(matrix_1.columns != matrix_2.rows)
        {
            throw new Error("Something ways wrong!");
        }

        function multiply(position)
        {
            let row = [];

            for(let i = 0; i < matrix_2.columns; ++i)
            {
                let temporary = 0;

                for(let j = 0; j < matrix_1.columns; ++j)
                {
                    temporary += matrix_1.data[position][j] * matrix_2.data[j][i];
                }

                row[i] = temporary;
            }

            return row;
        }

        let result = [];

        for(let k = 0; k < matrix_1.rows; ++k)
        {
            result[k] = multiply(k);
        }

        return new Matrix(result, false);
    }
}

class Point extends Matrix
{
	constructor(x, y)
	{
        super([[x], [y], [1]]);
	}

	get x()
	{
        return this.data[0][0];
	}

	get y()
	{
		return this.data[1][0];
	}

	apply(matrix)
	{
        let point = Matrix.multiplication(matrix, this);

        this.data = point.data;
	}
}

class MoveMatrix extends Matrix
{
	constructor(x, y)
	{
		super([[1, 0, x], [0, 1, y], [0, 0, 1]]);
	}
}

class ScaleMatrix extends Matrix
{
	constructor(x, y)
	{
		super([[x, 0, 0], [0, y, 0], [0, 0, 1]]);
	}
}

class RotateMatrix extends Matrix
{
	constructor(angle)
	{
		super([[Math.cos(angle), -Math.sin(angle), 0], [Math.sin(angle), Math.cos(angle), 0], [0, 0, 1]]);
	}
}