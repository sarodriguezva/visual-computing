const scl = 20;
let rows, cols, grid, next;
let button_start, button_stop, button_clear, button_gosper, button_stars;
let running = false;
const layouts = new Layouts();

let directions = {
    UL: [-1, -1],
    UC: [0, -1],
    UR: [1, -1],
    ML: [-1, 0],
    MC: [0, 0],
    MR: [1, 0],
    BL: [-1, 1],
    BC: [0, 1],
    BR: [1, 1],
};
  
function setup() {
  frameRate(5);
  createCanvas(800, 600);
  
  rows = floor(height/scl);
  cols = floor(width/scl);
  grid = [];
  next = [];
  for (let i = 0; i < rows; i++){
    grid[i] = [];
    next[i] = [];
    for (let j = 0; j < cols; j++){
      grid[i][j] = 0;
      next[i][j] = 0;
    }
  }
  
  button_start = createButton('Start [SPACE]');
  button_start.position(0, height + 150);
  button_start.mousePressed(startGame);
  
  button_stop = createButton('Stop [P]');
  button_stop.position(0, height + 180);
  button_stop.mousePressed(stopGame);
  
  button_stop = createButton('Clear [C]');
  button_stop.position(0, height + 210);
  button_stop.mousePressed(clearGame);
  
  button_gosper = createButton('Gosper [G]');
  button_gosper.position(0, height + 240);
  button_gosper.mousePressed(loadGosper);
  
  button_stars = createButton('Stars [S]');
  button_stars.position(100, height + 240);
  button_stars.mousePressed(loadStars);
}

function draw() {
  background(0);
  stroke(0, 0, 255);
  
  if (running){
    updateGrid();
  }
  
  for (let i = 0; i < rows; i++){
    for (let j = 0; j < cols; j++){
      fill(grid[i][j] * 255);
      rect(j*scl, i*scl, scl, scl);
    }
  }
}

function mousePressed(){
  let posX = mouseX / scl;
  let posY = mouseY / scl;
  
  if (posX <= cols && posY <= rows){
    running = false;
    posX = floor(posX);
    posY = floor(posY);
  }
  
  if (posX >= 0 && posX <= cols && posY >= 0 && posY <= rows){
    grid[posY][posX] = (grid[posY][posX] + 1)%2;
  }
}

function keyPressed(){
  if (key == ' ') {
    startGame();
  }else if (key == 'p' || key == 'P'){
    stopGame();
  }else if (key == 'c' || key == 'C'){
    clearGame();
  }else if (key == 'g' || key == 'G'){
    loadGosper();
  }else if (key == 's' || key == 'S'){
    loadStars();
  }
}

function stopGame(){
  running = false;
}

function startGame(){
  console.log(grid);
  running = true;
}

function updateGrid(){
  for (let i = 0; i < rows; i++){
    for (let j = 0; j < cols; j++){
      let neighbours = 0;
      
      for(const dir in directions){
        let [x, y] = directions[dir];
        x = (j == 0 && x == -1)|| (j == cols - 1 && x == 1) ? 10 : x;
        y = (i == 0 && y == -1)|| (i == rows - 1 && y == 1) ? 10 : y;
        
        if (x == 10 || y == 10){
          neighbours += 0;
        }else if (grid[i + y][j + x]){
          neighbours += 1;
        }
      }
      neighbours -= grid[i][j];
      
      if (grid[i][j] == 0 && neighbours == 3){
        next[i][j] = 1;
      }else if (grid[i][j] == 1 && (neighbours > 3 || neighbours <= 1)){
        next[i][j] = 0;
      }else{
        next[i][j] = grid[i][j];
      }
    }
  }
  
  let tmp = grid;
  grid = next;
  next = tmp;
}

function clearGame(){
  running = false;
  for (let i = 0; i < rows; i++){
    for (let j = 0; j < cols; j++){
      grid[i][j] = 0;
    }
  }
}

function loadGosper(){
  grid = layouts.getGosper();
  next = layouts.getGosper();
}

function loadStars(){
  grid = layouts.getStars();
  next = layouts.getStars();
}
