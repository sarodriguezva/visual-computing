let gl, camera, testComparator, shapes = [], enableZBuffer = true;

function setup() {
  createCanvas(640, 480, WEBGL);
  camera = createCamera();
  
  gl = this._renderer.GL;

  for (let i = -2; i < 2; i++) {
    for (let j = -2; j < 2; j++) {
      for (let k = -2; k < 2; k++) {
        createPyramid(75*i, 75*j, 75*k);
      }
    }
  }
  
  // Hint: camera.eyeX, camera.eyeY, camera.eyeZ
  testComparator = (a, b) => {
  // Calcula la distancia de a y b a la posición de la cámara
  const distA = dist(a.p1.x, a.p1.y, a.p1.z, camera.eyeX, camera.eyeY, camera.eyeZ);
  const distB = dist(b.p1.x, b.p1.y, b.p1.z, camera.eyeX, camera.eyeY, camera.eyeZ);
  
  // Compara las distancias, muestra primero las figuras más cercanas
  return distB - distA;
  };

  noStroke();
}

function draw() {
  background(0);
  orbitControl();
  
  shapes.sort(testComparator);
  shapes.forEach(s => s.show());
}

function keyPressed() {
  if (key === ' '){
    enableZBuffer = !enableZBuffer;
    if (enableZBuffer) {
      gl.enable(gl.DEPTH_TEST);
    } else {
      gl.disable(gl.DEPTH_TEST);
    }
  }
}

function createPyramid(x, y, z) {
  let p1 = createVector(x + random(75), y + random(75), z);
  let p2 = createVector(x + 10 + random(75), y + 10 + random(75), z);
  let p3 = createVector(x + random(75), y + 10 + random(75), z);
  let p4 = createVector(x + random(75), y + random(75), z + 1 + random(75));

  let face1 = new PyramidFace(p1, p2, p3);
  let face2 = new PyramidFace(p1, p2, p4);
  let face3 = new PyramidFace(p1, p3, p4);
  let face4 = new PyramidFace(p2, p4, p3);

  shapes.push(face1, face2, face3, face4);
}

class PyramidFace {
  constructor(p1, p2, p3) {
    this.p1 = p1;
    this.p2 = p2;
    this.p3 = p3;
    this.col = color(random(255),random(255),random(255))
  }
  

  show() {
    fill(this.col);
    beginShape();
    vertex(this.p1.x, this.p1.y, this.p1.z);
    vertex(this.p2.x, this.p2.y, this.p2.z);
    vertex(this.p3.x, this.p3.y, this.p3.z);
    endShape(CLOSE);
  }
}
