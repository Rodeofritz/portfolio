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
const { Engine, Render, Runner, World, Bodies, MouseConstraint, Mouse } =
	Matter;

const width = 600;
const height = 400;

const engine = Engine.create();
const { world } = engine;
const render = Render.create({
	element: document.querySelector('.maze'),
	engine: engine,
	options: {
		wireframes: false,
		width: width,
		height: height,
	},
});
Render.run(render);
Runner.run(Runner.create(), engine);

// Makes it possible to grab objects with the mouse
World.add(
	world,
	MouseConstraint.create(engine, {
		mouse: Mouse.create(render.canvas),
	}),
);

// Walls of the maze
const walls = [
	Bodies.rectangle(300, 0, 600, 40, { isStatic: true }),
	Bodies.rectangle(300, 400, 600, 40, { isStatic: true }),
	Bodies.rectangle(0, 200, 40, 400, { isStatic: true }),
	Bodies.rectangle(600, 200, 40, 400, { isStatic: true }),
];
World.add(world, walls);

//Random shapes for the maze

for (let i = 0; i < 40; i++) {
	if (Math.random() > 0.3 && Math.random() < 0.5) {
		World.add(
			world,
			Bodies.rectangle(Math.random() * width, Math.random() * height, 40, 40),
		);
	} else if (Math.random() > 0.5 && Math.random() < 0.7) {
		World.add(
			world,
			Bodies.rectangle(Math.random() * width, Math.random() * height, 50, 20),
		);
	} else {
		World.add(
			world,
			Bodies.circle(Math.random() * width, Math.random() * height, 30, {
				render: {
					fillStyle: 'blue',
				},
			}),
		);
	}
}
