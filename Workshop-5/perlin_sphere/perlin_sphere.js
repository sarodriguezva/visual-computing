let res = 50, r = 200, flying = 0;
let grid = [];

function setup() {
  createCanvas(640, 480, WEBGL);
}

function draw() {
  background(0);
  orbitControl();
  
  let yoff = flying;
  for(let i = 0; i < res+1; i++){
    grid[i] = [];
    let xoff = 0.0;
    const phi = map(i, 0, res, 0, TWO_PI);
    for (let j = 0; j < res+1; j++) {
      const theta = map(j, 0, res, 0, PI);
      let radius = map(noise(xoff, yoff), 0, 1, 0.6*r, r);
      const x = radius * sin(theta) * cos(phi);
      const y = radius * sin(theta) * sin(phi);
      const z = radius * cos(theta);
      grid[i][j] = createVector(x, y, z);
      xoff += 0.05;
    }
    yoff += 0.05;
  }
  
  
  fill(102, 189, 249, 200);
  stroke(200);
  for (let i = 0; i < res; i++) {
    beginShape(TRIANGLE_STRIP);
    for (let j = 0; j < res+1; j++) {
      const v1 = grid[i][j];
      vertex(v1.x, v1.y, v1.z);
      const v2 = grid[i + 1][j];
      vertex(v2.x, v2.y, v2.z);
    }
    endShape();
  }
  flying -= 0.01;
}
