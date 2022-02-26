// fixed navbar on scroll
const container = document.querySelector('.container');
const fixedNav = document.querySelector('.fixed-nav');
const navBar = document.querySelector('.nav-bar');
const topBtn = document.querySelector('.top-btn');

window.addEventListener('scroll', function () {
	const scrollHeight = window.pageYOffset;
	const navHeight = navBar.getBoundingClientRect().height;
	if (scrollHeight > navHeight) {
		container.classList.add('fixed-nav');
	} else {
		container.classList.remove('fixed-nav');
	}
	if (scrollHeight > 200) {
		topBtn.classList.add('show-top-btn');
	} else {
		topBtn.classList.remove('show-top-btn');
	}
});

// back to top buttion

// setting date dynamically
const date = document.getElementById('date');

date.innerHTML = new Date().getFullYear();

// Animation for my name in the top right of the site
const { Engine, Render, Runner, World, Bodies, Body, Events } = Matter;

const cellsHorizontal = 3;
const cellsVertical = 3;
const width = window.innerWidth / 4;
const height = window.innerHeight / 2;

const unitLengthX = width / cellsHorizontal;
const unitLengthY = height / cellsVertical;
const canvas = document.querySelector('.maze');

const engine = Engine.create();
engine.world.gravity.y = 0;
const { world } = engine;
const render = Render.create({
	element: canvas,
	engine: engine,
	options: {
		wireframes: false,
		width: width,
		height: height,
		background: 'white',
	},
});
Render.run(render);
Runner.run(Runner.create(), engine);

// Walls of the maze
const walls = [
	Bodies.rectangle(width / 2, 0, width, 2, { isStatic: true }),
	Bodies.rectangle(width / 2, height, width, 2, { isStatic: true }),
	Bodies.rectangle(0, height / 2, 2, height, { isStatic: true }),
	Bodies.rectangle(width, height / 2, 2, height, { isStatic: true }),
];
World.add(world, walls);

//Maze generation

//create randomness function for our maze
const shuffle = (arr) => {
	let counter = arr.length;
	while (counter > 0) {
		const index = Math.floor(Math.random() * counter);

		counter--;

		const temp = arr[counter];
		arr[counter] = arr[index];
		arr[index] = temp;
	}

	return arr;
};

//grid keeps track of all the cells we already have visited
const grid = Array(cellsVertical)
	.fill(null)
	.map(() => Array(cellsHorizontal).fill(false));

//gives us all the vertical walls we have in our maze from top to bottom
const verticals = Array(cellsVertical)
	.fill(null)
	.map(() => Array(cellsHorizontal - 1).fill(false));

//gives us all the horizontal walls we have in our maze from top to bottom
const horizontals = Array(cellsVertical - 1)
	.fill(null)
	.map(() => Array(cellsHorizontal).fill(false));

//creating starting point for maze
const startRow = Math.floor(Math.random() * cellsVertical);
const startColumn = Math.floor(Math.random() * cellsHorizontal);

const stepThroughCells = (row, column) => {
	//If i have already visited current cell, then return function
	if (grid[row][column]) {
		return;
	}
	//mark that cell as visited by updating the grid at cell location and
	//changing bolean from false to true
	grid[row][column] = true;
	//Assemble randomly-ordered list of neighbours
	const neighbors = shuffle([
		[row - 1, column, 'up'],
		[row, column + 1, 'right'],
		[row + 1, column, 'down'],
		[row, column - 1, 'left'],
	]);

	//for each neighbor....
	for (let neighbor of neighbors) {
		const [nextRow, nextColumn, direction] = neighbor;

		if (
			nextRow < 0 ||
			nextRow >= cellsVertical ||
			nextColumn < 0 ||
			nextColumn >= cellsHorizontal
		) {
			continue;
		}
		//see if it is out of bounds (so still within the maze)
		//if we have visited that neigbor, continue to next neighbours
		if (grid[nextRow][nextColumn]) {
			continue;
		}
		//Remove a wall from either horizontals or verticals
		if (direction === 'left') {
			verticals[row][column - 1] = true;
		} else if (direction === 'right') {
			verticals[row][column] = true;
		} else if (direction === 'up') {
			horizontals[row - 1][column] = true;
		} else if (direction === 'down') {
			horizontals[row][column] = true;
		}
		stepThroughCells(nextRow, nextColumn);
	}
	//visit that next cell. --> this means call our stepthroughCells function again and
	//pass in the row and column that we want to visit. -->
};

stepThroughCells(startRow, startColumn);

horizontals.forEach((row, rowIndex) => {
	row.forEach((open, columnIndex) => {
		if (open) {
			return;
		}
		//horizontal wall
		const wall = Bodies.rectangle(
			columnIndex * unitLengthX + unitLengthX / 2,
			rowIndex * unitLengthY + unitLengthY,
			unitLengthX,
			5,
			{
				label: 'wall',
				isStatic: true,
				render: {
					fillStyle: 'rgb(34, 32, 32)',
				},
			},
		);
		World.add(world, wall);
	});
});

verticals.forEach((row, rowIndex) => {
	row.forEach((open, columnIndex) => {
		if (open) {
			return;
		}
		//vertical wall
		const wall = Bodies.rectangle(
			columnIndex * unitLengthX + unitLengthX,
			rowIndex * unitLengthY + unitLengthY / 2,
			5,
			unitLengthY,
			{
				label: 'wall',
				isStatic: true,
				render: { fillStyle: 'rgb(34, 32, 32)rgb(0, 70, 76)' },
			},
		);
		World.add(world, wall);
	});
});

//Goal of the maze
const goal = Bodies.rectangle(
	width - unitLengthX / 2,
	height - unitLengthY / 2,
	unitLengthX * 0.7,
	unitLengthY * 0.7,
	{ isStatic: true, label: 'goal', render: { fillStyle: 'rgb(28, 2, 0)' } },
);

World.add(world, goal);

//ball of our maze
const ballRadius = Math.min(unitLengthX, unitLengthY) / 3;
const ball = Bodies.circle(unitLengthX / 2, unitLengthY / 2, ballRadius, {
	label: 'ball',
	render: { fillStyle: 'rgb(0, 70, 76)' },
});

World.add(world, ball);

document.addEventListener('keydown', (e) => {
	const { x, y } = ball.velocity;
	//letter I
	if (e.keyCode === 73) {
		Body.setVelocity(ball, { x, y: y - 5 });
	}
	//letter M
	if (e.keyCode === 75) {
		Body.setVelocity(ball, { x, y: y + 5 });
	}
	//letter J
	if (e.keyCode === 74) {
		Body.setVelocity(ball, { x: x - 5, y });
	}
	//letter L
	if (e.keyCode === 76) {
		Body.setVelocity(ball, { x: x + 5, y });
	}
});

//Win conditions

Events.on(engine, 'collisionStart', (e) => {
	e.pairs.forEach((collision) => {
		const labels = ['goal', 'ball'];

		if (
			labels.includes(collision.bodyA.label) &&
			labels.includes(collision.bodyB.label)
		) {
			world.gravity.y = 1;
			world.bodies.forEach((body) => {
				if (body.label === 'wall') {
					Body.setStatic(body, false);
					// show tech stack on completion and gide other elements
					setTimeout(() => showTechStack(), 2500);
				}
			});
		}
	});
});

const showTechStack = () => {
	const techStack = document.querySelector('.tech-stack');
	techStack.classList.remove('hidden');
	canvas.style.display = 'none';
	const mazeTitle = document.querySelector('.custom-h3-light');
	mazeTitle.classList.add('hidden');
	const mazeInstructions = document.querySelector('.maze-instructions');
	mazeInstructions.classList.add('hidden');
};
