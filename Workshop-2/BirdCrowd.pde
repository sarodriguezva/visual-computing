PImage birdTexture;
ArrayList<Bird> birds = new ArrayList<Bird>();
ArrayList<Obstacle> obstacles = new ArrayList<Obstacle>();

void setup() {
  size(800, 600);
  birdTexture = loadImage("https://static.vecteezy.com/system/resources/previews/012/904/486/non_2x/bird-flying-dove-silhouette-free-png.png"); // Asegúrate de tener una imagen de ave (bird.png) en la misma carpeta que tu sketch
  birdTexture.resize(50,50);
  for (int i = 0; i < 100; i++) {
    birds.add(new Bird(random(width), random(height)));
  }
  for (int i = 0; i < 5; i++) {
    obstacles.add(new Obstacle(random(width), random(height)));
  }
}

void draw() {
  background(220);
  
  for (Obstacle obs : obstacles) {
    obs.display();
  }
  
  for (Bird bird : birds) {
    bird.flock(birds, obstacles);
    bird.update();
    bird.display();
  }
}

class Bird {
  PVector position;
  PVector velocity;
  PVector acceleration;
  float maxSpeed = 2;
  float maxForce = 0.05;
  
  Bird(float x, float y) {
    position = new PVector(x, y);
    velocity = PVector.random2D();
    velocity.mult(random(1, 2));
    acceleration = new PVector(0, 0);
  }
  
  void applyForce(PVector force) {
    acceleration.add(force);
  }
  
  void update() {
    velocity.add(acceleration);
    velocity.limit(maxSpeed);
    position.add(velocity);
    acceleration.mult(0);
    
    // Evitar que las aves salgan de la pantalla
    if (position.x < 0) position.x = width;
    if (position.x > width) position.x = 0;
    if (position.y < 0) position.y = height;
    if (position.y > height) position.y = 0;
  }
  
  void display() {
    pushMatrix();
    translate(position.x, position.y);
    rotate(atan2(velocity.y, velocity.x));
    image(birdTexture, 0, 0, 30, 20);
    popMatrix();
  }
  
  void flock(ArrayList<Bird> birds, ArrayList<Obstacle> obstacles) {
    PVector sep = separate(birds);
    PVector ali = align(birds);
    PVector coh = cohesion(birds);
    PVector obsAvoid = avoidObstacles(obstacles);
    
    sep.mult(1.5);
    ali.mult(1.0);
    coh.mult(1.0);
    obsAvoid.mult(2.0);
    
    applyForce(sep);
    applyForce(ali);
    applyForce(coh);
    applyForce(obsAvoid);
  }
  
  PVector separate(ArrayList<Bird> birds) {
    float desiredSeparation = 25;
    PVector sum = new PVector(0, 0);
    int count = 0;
    
    for (Bird other : birds) {
      float d = PVector.dist(position, other.position);
      if (d > 0 && d < desiredSeparation) {
        PVector diff = PVector.sub(position, other.position);
        diff.normalize();
        diff.div(d);
        sum.add(diff);
        count++;
      }
    }
    
    if (count > 0) {
      sum.div(count);
      sum.setMag(maxSpeed);
      sum.sub(velocity);
      sum.limit(maxForce);
    }
    return sum;
  }
  
  PVector align(ArrayList<Bird> birds) {
    float neighborDist = 50;
    PVector sum = new PVector(0, 0);
    int count = 0;
    
    for (Bird other : birds) {
      float d = PVector.dist(position, other.position);
      if (d > 0 && d < neighborDist) {
        sum.add(other.velocity);
        count++;
      }
    }
    
    if (count > 0) {
      sum.div(count);
      sum.setMag(maxSpeed);
      PVector steer = PVector.sub(sum, velocity);
      steer.limit(maxForce);
      return steer;
    } else {
      return new PVector(0, 0);
    }
  }
  
  PVector cohesion(ArrayList<Bird> birds) {
    float neighborDist = 50;
    PVector sum = new PVector(0, 0);
    int count = 0;
    
    for (Bird other : birds) {
      float d = PVector.dist(position, other.position);
      if (d > 0 && d < neighborDist) {
        sum.add(other.position);
        count++;
      }
    }
    
    if (count > 0) {
      sum.div(count);
      return seek(sum);
    } else {
      return new PVector(0, 0);
    }
  }
  
  PVector avoidObstacles(ArrayList<Obstacle> obstacles) {
    float avoidRadius = 30;
    PVector sum = new PVector(0, 0);
    
    for (Obstacle obs : obstacles) {
      PVector toObs = PVector.sub(obs.position, position);
      float d = toObs.mag();
      if (d < avoidRadius) {
        PVector avoidForce = PVector.sub(position, obs.position);
        avoidForce.normalize();
        avoidForce.mult(maxSpeed);
        sum.add(avoidForce);
      }
    }
    
    return sum;
  }
  
  PVector seek(PVector target) {
    PVector desired = PVector.sub(target, position);
    desired.setMag(maxSpeed);
    PVector steer = PVector.sub(desired, velocity);
    steer.limit(maxForce);
    return steer;
  }
}

class Obstacle {
  PVector position;
  
  Obstacle(float x, float y) {
    position = new PVector(x, y);
  }
  
  void display() {
    fill(100);
    noStroke();
    ellipse(position.x, position.y, 20, 20);
  }
}
