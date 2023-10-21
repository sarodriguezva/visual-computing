const {Engine,World,Mouse,MouseConstraint,Events,Vertices}= Matter;
let engine, world,birds=[],actualBird,ground,redImg,boxImg,slingImg,boxes=[],fondo,resortera,pigImg,pig,letherImg,smokeImg,smokeImg1,render;
let mouseConstraint , slingshot , stoneImg,terrain,arrowBody,plank,plankImg,countBirds=3;
let endGame=false,stones=[];
function preload(){
  redImg= loadImage('red.png');
  boxImg = loadImage('box.png');
  fondo = loadImage('fondo.jpg');
  slingImg = loadImage('resortera.png');
  pigImg = loadImage('pig.png');
  letherImg= loadImage('cuero.jpg');
  smokeImg = loadImage('humo.png') ;
  smokeImg1 = loadImage('humo1.png') ;
  stoneImg = loadImage('stone.jpg');
  plankImg = loadImage('plank.jpg');
}

function setup() {
  const canvas = createCanvas(880,480);
  
  engine = Engine.create();
  world = engine.world;
  
  //render=Matter.Render.create();
  const mouse = Mouse.create(canvas.elt);
  mouse.pixelRatio= pixelDensity();
  
  mouseConstraint = MouseConstraint.create(engine,{
    mouse:mouse
  });
  World.add(world,mouseConstraint);
  
  for(let i = 0 ; i<countBirds; i++){
    const bird = new Bird(150 + (i*40) ,375,15,10,redImg);
    birds.push(bird)
  }
  actualBird = birds[0];
  slingshot = new SlingShot(actualBird);
  Events.on(engine, 'afterUpdate',()=>slingshot.fly(mouseConstraint))
  
  //resortera = new b(150,375,25,5,slingImg);
  pig= new Pig((width*3.0/4.0)+50,350,20,3,pigImg);
  
  Events.on(engine, 'collisionStart', function(event) {
    var pairs = event.pairs;

        // change object colours to show those starting a collision
        for (var i = 0; i < pairs.length; i++) {
            var pair = pairs[i];
            if((pair.bodyA===actualBird.body && pair.bodyB === pig.body ) || (pair.bodyB===actualBird.body && pair.bodyA === pig.body) && (actualBird.velocidad >= 8)){
              
              setTimeout(500,pig.img = smokeImg);
              setTimeout(500,pig.img = smokeImg1);
              
            }
            
        }
});
Events.on(engine, 'collisionActive', function(event) {
    var pairs = event.pairs;

        // change object colours to show those starting a collision
        for (var i = 0; i < pairs.length; i++) {
            var pair = pairs[i];
            if((pair.bodyA===actualBird.body && pair.bodyB === pig.body ) || (pair.bodyB===actualBird.body && pair.bodyA === pig.body) && (actualBird.velocidad >= 8)){
              World.remove(world,pig.body);
              pig.img=null;             
            }            
        }
});  
  
 // arrowBody = new Arrow(550,400,stoneImg);
  ground = new Ground(width/2, height -10,width,20);
  
  plank1 = new Box((width*3.0/4.0),height-130,20,70,20,plankImg);
  plank2 = new Box((width*3.0/4.0)+100,height-130,20,70,20,plankImg);
  for(let i=0;i<5;i++){
    const box = new Box((width*3.0/4.0)+(i*30)-10,height-60,30,30,40,boxImg);
    boxes.push(box);
  }
  for(let i=0;i<7;i++){
    const box = new Box((width*3.0/4.0)-40+(i*30),height-30,40,40,80,stoneImg);
    boxes.push(box);
  }
 
 

}


function draw() {
  background(fondo);
  Engine.update(engine);
  slingshot.show();
   
  image(slingImg,125,360,50,100);
  pig.show();
  ground.show();
  plank1.show();
  plank2.show();
  
  for(const box of boxes){
    box.show();
  }
  for (const bird of birds){
    bird.show();
  }
  for (const stone of stones){
    stone.show();
  }
  if(endGame){
     textSize(50);
    fill(255, 51, 75);
    text('GAME OVER', 440, 240);
  }
}
let count=1;
function keyPressed(){
  if(key == ' ' && !slingshot.hasBird()){
   //World.remove(world, actualBird.body); 
   if(count<countBirds){   
     World.remove(world,birds[count].body); 
     birds[count]=new Bird(150,375,15,10,redImg) ;
     actualBird = birds[count];
     slingshot.attach(actualBird);
     count++;
    }else{
     endGame=true;
    }
   
  }
}
