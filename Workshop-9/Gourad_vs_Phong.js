let phongShader, gouradShader, alpha = 32;

function setup() {
  createCanvas(640, 480, WEBGL);
  phongShader = createShader(vertPhong, fragPhong);
  gouraudShader = createShader(vertGouraud, fragGouraud);
  
  noStroke();
}

function draw() {
  background(50); 
  orbitControl();

  createSphere(-150, 0, 0, 50, color(255, 0, 0), phongShader);
  createSphere(150, 0, 0, 50, color(0, 255, 0), gouraudShader);
  
  describe("Alpha: " + alpha, LABEL);
}

function createSphere(x, y, z, radius, col, selectedShader) {
  push();
  translate(x, y, z);
  
  const lightX = map(mouseX, 0, width, -1.0, 1.0);
  const lightY = map(mouseY, 0, height, -1.0, 1.0);
  
  selectedShader.setUniform("uColor", [red(col)/255, green(col)/255, blue(col)/255]);
  selectedShader.setUniform("uLightDirection", [lightX, lightY, 1.0]);
  selectedShader.setUniform("uAlpha", alpha);
  
  shader(selectedShader);
  
  sphere(radius);
  pop();
}

function keyPressed(){
  if (key === '+'){
    alpha *= 2;
  } else if (key === '-'){
    alpha /= 2;
  }
}

const vertPhong = `
precision mediump float;

attribute vec3 aPosition;
attribute vec3 aNormal;

uniform mat4 uProjectionMatrix;
uniform mat4 uModelViewMatrix;
uniform mat3 uNormalMatrix;

varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  vNormal = normalize(uNormalMatrix * aNormal);
  vPosition = (uModelViewMatrix * vec4(aPosition, 1.0)).xyz;
  gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition, 1.0);
}
`;

const fragPhong = `
precision mediump float;

varying vec3 vNormal;
varying vec3 vPosition;

uniform vec3 uColor;
uniform vec3 uLightDirection;
uniform float uAlpha;

void main() {
  vec3 normal = normalize(vNormal);
  vec3 eyeDirection = normalize(-vPosition);
  vec3 lightDirection = normalize(uLightDirection);

  vec3 ambient = vec3(0.2, 0.2, 0.2);
  
  vec3 diffuse = uColor * max(0.0, dot(normal, lightDirection));
  
  vec3 reflectionDirection = reflect(-lightDirection, normal);
  vec3 specular = pow(max(dot(reflectionDirection, eyeDirection), 0.0), uAlpha) 
                  * vec3(1.0, 1.0, 1.0);

  gl_FragColor = vec4(ambient + diffuse + specular, 1.0);
}
`;


const vertGouraud = `
precision mediump float;

attribute vec3 aPosition;
attribute vec3 aNormal;

uniform mat4 uProjectionMatrix;
uniform mat4 uModelViewMatrix;
uniform mat3 uNormalMatrix;

uniform vec3 uLightDirection;
uniform vec3 uColor;
uniform float uAlpha;

varying vec4 vColor;

void main() {
  vec3 normal = normalize(uNormalMatrix * aNormal);
  vec3 lightDirection = normalize(uLightDirection);

  vec3 ambient = vec3(0.2, 0.2, 0.2);
  vec3 diffuse = uColor * max(0.0, dot(normal, lightDirection));
  
  vec3 eyeDirection = normalize(-aPosition);
  vec3 reflectionDirection = reflect(-lightDirection, normal);
  vec3 specular = pow(max(dot(reflectionDirection, eyeDirection), 0.0), uAlpha) 
                  * vec3(1.0, 1.0, 1.0);

  vColor = vec4(ambient + diffuse + specular, 1.0);
  gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition, 1.0);
}
`;

const fragGouraud = `
precision mediump float;

varying vec4 vColor;

void main() {
  gl_FragColor = vColor;
}
`;
