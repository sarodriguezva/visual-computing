let axiom = "F";
let sentence = axiom;
let len = 100;
let angle;

let conf1  = {
  "F": "FF+[+F-F-F]-[-F+F+F]"
};

let conf2 = {
  "F": "F[+F]F[-F]F"
};

let conf3 = {
  "F":"F[+F]F[-F]F[--F]F[---F]"
};

let rules = conf1;

function setup() {
  createCanvas(680, 480, WEBGL);
  background(0);
  angle = radians(25); 
  
  let config1Button = createButton('Configuración 1');
  config1Button.mousePressed(() => changeConfig(1));
  
  let config2Button = createButton('Configuración 2');
  config2Button.mousePressed(() => changeConfig(2));
  
  let config3Button = createButton('Configuración 3');
  config3Button.mousePressed(() => changeConfig(3));
  
  let resetButton = createButton('Borrar');
  resetButton.mousePressed(resetCanvas);
}

function changeConfig(conf){
  if(conf == 1){rules = conf1; generate();}
  else if(conf == 2){rules = conf2; generate();}
  else if(conf == 3){rules = conf3; generate();}
}

function generate() {
  len *= 0.5;
  let nextSentence = "";
  for (let i = 0; i < sentence.length; i++) {
    let current = sentence.charAt(i);
    let found = false;
    for (let j in rules) {
      if (current == j) {
        found = true;
        nextSentence += rules[j];
      }
    }
    if (!found) {
      nextSentence += current;
    }
  }
  sentence = nextSentence;
}

function draw() {
  background(0);
  orbitControl();
  translate(0, height/2);
  strokeWeight(2);
  stroke(34, 139, 24);

  for (let i = 0; i < sentence.length; i++) {
    let current = sentence.charAt(i);
    if (current == "F") {
      line(0, -len, 0, 0, 0, 0);
      
      line(0, -len, -len/2, 0, 0, 0);
      line(0, -len, len/2, 0, 0, 0);
      
      line(-len/2, -len, 0, 0, 0, 0);
      line(len/2, -len, 0, 0, 0, 0);
      
      translate(0, -len, 0);
    } else if (current == "+") {
      rotate(angle);
    } else if (current == "-") {
      rotate(-angle);
    } else if (current == "[") {
      push();
    } else if (current == "]") {
      pop();
    }
  }
}

function resetCanvas(){
  background(0);
  sentence = axiom;
  len = 100;
  draw();
}
