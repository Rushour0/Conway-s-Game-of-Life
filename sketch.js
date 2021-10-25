
// A few global variables

var boxes = [];                 // Global array to keep track of the nodes/boxes in the grid
var cell_width;                 // Declaring a global cell_width variable
var total_rows = 75;            // Total rows and columns in the grid
var running = false;            // Indicates whether any process is running right now
var cnv;                        // GLobal cnv variable to keep check of the canvas
var track_alive = []            // Track the alive cells

// Colors
var BLACK;
var WHITE;
var RED;
var GREEN;
var BLUE;
var GREY;
var PURPLE;
var YELLOW;
var ORANGE;
var CORAL;

var DEAD;
var ALIVE;


// Setup for the display
function setup() {
	// Checking if the height of the page is greater than the width

	var is_height = true;
	if (windowWidth > windowHeight) {
		is_height = true;
		cnv = createCanvas(windowHeight, windowHeight);
	}
	else {
		is_height = false;
		cnv = createCanvas(windowWidth, windowWidth);
	}

	if (is_height) {
		cnv.position(windowWidth / 2 - windowHeight / 2)
	}

	// Colors can only be declared in the setup

	// Declaration of a few colors

	BLACK = color(0, 0, 0);
	WHITE = color(255, 255, 255);
	RED = color(255, 0, 0);
	GREEN = color(0, 255, 0);
	BLUE = color(0, 0, 255);
	GREY = color(128, 128, 128);
	PURPLE = color(128, 0, 128);
	YELLOW = color(0, 128, 128);
	ORANGE = color(255, 140, 0);
	CORAL = color(255, 127, 80);

	DEAD = BLACK;
	ALIVE = WHITE;


	cell_width = width / total_rows;                      // Determining the width of cell given the width of the canvas
	let row = 0;
	let col = 0;

	// Filling the grid, adding nodes into the boxes array variable

	running = true;
	for (let y = 0; y < width; y += cell_width) {
		boxes[row] = [];
		col = 0;
		for (let x = 0; x < width; x += cell_width) {
			boxes[row].push(0);
			col++;
			fill(DEAD);
			square(x, y, cell_width);
		}
		row++;
	}
	running = false;
}


async function draw() {
	
	// Checking for interrupts & actions if any computing isn't in process

	if ( !running ) mouseActions();
	keyboardActions();
		row = 0;
	col = 0;
	if ( !running )
	{
		for (let y = 0; y < width; y += cell_width) {
			col = 0;
			for (let x = 0; x < width; x += cell_width) {
				if (boxes[row][col] == 1)
				{
					fill(ALIVE);
					square(x, y, cell_width);
				}
				else
				{
					fill(DEAD);
					square(x, y, cell_width);
				}
				col++;
			}
			row++;
		}
	}
	

}

// Checking for any keyboard action

async function keyboardActions() {
	// Checking for any key presses
	if (keyIsPressed) {
		if (keyIsDown(82))                                   // The R key is pressed
		{
			// all_dead();                                       // Call the reset function
			return true;
		}
		if (keyIsDown(32))                      // The "spacebar" key is pressed
		{
			running = true;
			while ( !keyIsDown(82) )
			{
				let start = Date.now();
				game_of_life();
				let timeExec = Date.now() - start;
				await sleep( 100 - timeExec);
			}
			running = false;
		}
		if (keyIsDown(67)) {
			// all_alive();
		}
	}
	return false;
}

// Checking for any mouse action

function mouseActions() {
	if (mouseIsPressed) {
		// Getting which grid was clicked/pressed

		let row = floor(mouseY / cell_width);
		let col = floor(mouseX / cell_width);
		try {
			if (row < total_rows && col < total_rows ) {
				let node = boxes[row][col];
				if ( node == undefined ) return ;
				console.log(node);
				if (mouseButton == LEFT && !keyIsDown(17)) {
					if ( node == 0) {
						boxes[row][col] = 1;
					}
				}
				else if (mouseButton == CENTER) {
					// all_dead();
				}

				else if ((mouseButton == LEFT && keyIsDown(17)) || (mouseButton == RIGHT)) {
					if ( node == 1 ) {
						boxes[row][col] = 0;
					}
				}
			}
		}
		catch (e){}
	}
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

async function game_of_life() {
	var temp = []
	let row = 0;
	let col = 0;

	running = true;
	for (let y = 0; y < width; y += cell_width) {
		temp[row] = [];
		col = 0;
		for (let x = 0; x < width; x += cell_width) {
			temp[row].push(0);
			col++;
		}
		row++;
	}
	running = false;

	for (let row = 0; row < total_rows; row++) {
		for (let col = 0; col < total_rows; col++) {
			let count = 0;
			for (let i = -1; i < 2; i++) {
				for (let j = -1; j < 2; j++) {
					if ( i == 0 && j == 0) continue;
					if ((row + i > -1 ) && (col + j > -1) && (col + j < total_rows) && (row + i < total_rows)) {
						if ( boxes[row + i][col + j] == 1 )
							count++;
					}
				}
			}
			if (count > 3) {
				temp[row][col] = 0;
			}
			else if (count == 3) {
				temp[row][col] = 1;
			}
			else if (count < 2) {
				temp[row][col] = 0;
			}
			else if ( count == 2 && boxes[row][col] == 1)
			{
				temp[row][col] = 1;
			}
			else {
				temp[row][col] = boxes[row][col];
			}
		}
	}

	for (let i = 0; i < total_rows; i++) {
		for (let j = 0; j < total_rows; j++) {
			boxes[i][j] = temp[i][j];
		}
	}
	
	row = 0;
	col = 0;
	running = true;
	for (let y = 0; y < width; y += cell_width) {
		col = 0;
		for (let x = 0; x < width; x += cell_width) {
			if (boxes[row][col] == 1)
			{
				fill(ALIVE);
				square(x, y, cell_width);
			}
			else
			{
				fill(DEAD);
				square(x, y, cell_width);
			}
			col++;
		}
		row++;
	}
	running = false;
	await sleep(100)
}
