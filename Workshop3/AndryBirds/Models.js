class Bird{
  constructor(x,y,r,m,img){
    this.body = Matter.Bodies.circle(x,y,r,{restitution:0.5});
    Matter.Body.setMass(this.body,m);
    Matter.World.add(world, this.body);
    this.img=img;
    this.velocidad=0;
  }
  show(){
    push();
    translate(this.body.position.x, this.body.position.y);
    rotate(this.body.angle);
    //ellipse(0,0,2*this.body.circleRadius,2*this.body.circleRadius);
    imageMode(CENTER);
    image(this.img,0,0,2*this.body.circleRadius,2*this.body.circleRadius);
    this.velocidad = this.body.velocity.x+this.body.velocity.y;
    pop();
    
  }
}
class Arrow{
  constructor (x,y,textura){
      this.x=x;
      this.y=y;
      this.vertices = Matter.Vertices.fromPath('0 0 100 0 150 100 -50 100');
      this.body = Matter.Bodies.fromVertices(x,y,[this.vertices],{
        isStatic:true
      });
      Matter.World.add(world,this.body);
  }
  show() {
   

    // Dibuja la textura en función de la posición y el ángulo del cuerpo
    push();
    translate(this.body.position.x,this.body.position.y);
    //console.log(this.body.position.x,this.body.position.y)
    rotate(this.body.angle);
    rectMode(CENTER);
    beginShape();

    // Itera a través de los vértices de la figura
    for (let i = 0; i < this.vertices.length; i++) {
     let v = this.vertices[i];
      //let xVertex = v.x - pos.x; // Ajusta las coordenadas al centro de la figura
      //let yVertex = v.y - this.body.position.y; // Ajusta las coordenadas al centro de la figura
      
      vertex(v.x, v.y);
    }
    endShape(CLOSE);

    pop();
  }
}
class Pig{
  constructor(x,y,r,m,img){
    this.body= Matter.Bodies.circle(x,y,r);
    Matter.Body.setMass(this.body,m);
    Matter.World.add(world, this.body);
    this.img = img;
    this.life = 1;
  }
  show(){
    if(this.img){
      push();
      translate(this.body.position.x, this.body.position.y);
      rotate(this.body.angle);
      imageMode(CENTER);
      image(this.img,0,0,2*this.body.circleRadius,2*this.body.circleRadius);
      noStroke();
      fill(125);
      rect(-20,-25,2*this.body.circleRadius,5);
      if(this.life>0){
        noStroke();
        fill(0,250,21);
        rect(-20,-25,2*this.body.circleRadius*this.life,5);
      }
      
      pop();
    }
    
  }
}
class Box{
  constructor(x,y,w,h,m,img,options={}){
    this.body = Matter.Bodies.rectangle(x,y,w,h,options);
    
    this.w = w;
    this.h = h;
    this.img=img;
    Matter.World.add(world,this.body);
  }
  show(){
    push();
    translate(this.body.position.x, this.body.position.y);
    rotate(this.body.angle);
    if(this.img){
      imageMode(CENTER);
      image(this.img,0,0,this.w,this.h);
      
    }else{
      fill(50,200,0);
      noStroke();
      rectMode(CENTER);
      rect(0,0,this.w,this.h);
    }
    pop();
  }
}
class Ground extends Box{
  constructor(x,y,w,h,m){
    super(x,y,w,h,m,null,{isStatic:true});
  }
}
class SlingShot{
  constructor(body){
    const options = {
      pointA :{
        x : body.body.position.x,
        y : body.body.position.y
      },
      bodyB: body.body,
      length : 5 ,
      stiffness: 0.05
    }
    this.sling =Matter.Constraint.create(options);
    Matter.World.add(world, this.sling);
  }
  show(){
    if(this.sling.bodyB != null){
      stroke(37,17,12);
      //texture(letherImg);
      strokeWeight(5);
      line(this.sling.pointA.x , this.sling.pointA.y,
      this.sling.bodyB.position.x, this.sling.bodyB.position.y);
    }
    
  }
  fly(mConstraint,actualBird){
    //mouse.button == -1 : si está presionado el click izquierdo
    if(this.sling.bodyB != null && mConstraint.mouse.button === -1
      && this.sling.bodyB.position.x > 150){
         actualBird.body.collisionFilter.mask=2;
         actualBird.body.collisionFilter.category = 2;
         this.sling.bodyB = null;
         
      }
  }
  hasBird(){
    return this.sling.bodyB != null;
  }
  attach(bird){
    this.sling.bodyB = bird.body;
  }
}
