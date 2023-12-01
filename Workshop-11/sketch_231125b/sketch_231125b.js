let grid;
let nextGrid;
let cols, rows;
let da = 1;
let db = 0.5;
let feed = 0.055;
let kill = 0.062;
let dt = 1;

function setup() {
  createCanvas(600, 600, WEBGL);

  cols = 100;
  rows = 100;

  grid = new Array(cols).fill(null).map(() => new Array(rows).fill(0));
  nextGrid = new Array(cols).fill(null).map(() => new Array(rows).fill(0));

  // Set initial pattern
  for (let i = floor(cols / 2) - 5; i < floor(cols / 2) + 5; i++) {
    for (let j = floor(rows / 2) - 5; j < floor(rows / 2) + 5; j++) {
      grid[i][j] = 1;
    }
  }

  // Buttons for parameter control
  createButton('Increase da').mousePressed(() => { da += 0.1; });
  createButton('Decrease da').mousePressed(() => { da -= 0.1; });
  createButton('Increase db').mousePressed(() => { db += 0.1; });
  createButton('Decrease db').mousePressed(() => { db -= 0.1; });
  createButton('Increase feed').mousePressed(() => { feed += 0.01; });
  createButton('Decrease feed').mousePressed(() => { feed -= 0.01; });
  createButton('Increase kill').mousePressed(() => { kill += 0.01; });
  createButton('Decrease kill').mousePressed(() => { kill -= 0.01; });
  createButton('Increase dt').mousePressed(() => { dt += 0.1; });
  createButton('Decrease dt').mousePressed(() => { dt -= 0.1; });
}

function draw() {
  background(255);

  // Calculate next state using reaction-diffusion equations
  for (let i = 1; i < cols - 1; i++) {
    for (let j = 1; j < rows - 1; j++) {
      let a = grid[i][j];
      let b = 1 - grid[i][j];

      let laplaceA = laplaceAValue(i, j);
      let laplaceB = laplaceBValue(i, j);

      nextGrid[i][j] = a + (da * laplaceA - a * b * b + feed * (1 - a)) * dt;
      nextGrid[i][j] = constrain(nextGrid[i][j], 0, 1);
    }
  }

  // Swap grids
  [grid, nextGrid] = [nextGrid, grid];

  let img = createTexture(cols, rows);

  // Apply texture to shapes
  texture(img);
  rotateY(frameCount * 0.01);

  //Train
  push();
  translate(0, 0);
  box(100, 100, 200);
  translate(0, -85, -50);
  box(100, 70, 100);
  translate(0, -50, 0);
  box(120, 20, 120);
  pop();
  
  //Wheels
  for (let i = 0; i < 3; i++) {
    for (let j = -1; j < 3; j += 2) {
      push();
      translate(j * 50, 50, i * 70 - 70);
      rotateZ(HALF_PI);
      cylinder(30, 20);
      pop();
    }
  }
  
  //Funnel
  push();
  translate(0, -60, 70);
  cylinder(20, 50);
  translate(0, -30, 0);
  cylinder(30, 30);
  pop();
  
  //Rail cars
  for (let i = 1; i < 4; i++) {
    push();
    translate(0, 0, -i * 200);
    box(100, 100, 200);
    pop();
  
    //Rail cars' wheels
    for (let j = 0; j < 2; j++) {
      for (let k = -1; k < 2; k += 2) {
        push();
        translate(k * 50, 50, -i * 200 + j * 100 - 50);
        rotateZ(HALF_PI);
        cylinder(30, 20);
        pop();
      }
    }
  }  
}

function laplaceAValue(x, y) {
  let sumA = 0;
  sumA += grid[x][y] * -1;
  sumA += grid[x + 1][y] * 0.2;
  sumA += grid[x - 1][y] * 0.2;
  sumA += grid[x][y + 1] * 0.2;
  sumA += grid[x][y - 1] * 0.2;
  sumA += grid[x + 1][y + 1] * 0.05;
  sumA += grid[x - 1][y - 1] * 0.05;
  sumA += grid[x - 1][y + 1] * 0.05;
  sumA += grid[x + 1][y - 1] * 0.05;
  return sumA;
}

function laplaceBValue(x, y) {
  let sumB = 0;
  sumB += grid[x][y] * -1;
  sumB += grid[x + 1][y] * 0.2;
  sumB += grid[x - 1][y] * 0.2;
  sumB += grid[x][y + 1] * 0.2;
  sumB += grid[x][y - 1] * 0.2;
  sumB += grid[x + 1][y + 1] * 0.05;
  sumB += grid[x - 1][y - 1] * 0.05;
  sumB += grid[x - 1][y + 1] * 0.05;
  sumB += grid[x + 1][y - 1] * 0.05;
  return sumB;
}

function createTexture() {
  let img = createImage(cols, rows);
  img.loadPixels();
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let val = floor(grid[i][j] * 255);
      img.set(i, j, color(val, val, val));
    }
  }
  img.updatePixels();
  return img;
}
