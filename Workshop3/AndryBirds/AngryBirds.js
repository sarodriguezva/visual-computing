  const {Engine,World,Mouse,MouseConstraint,Events,Vertices}= Matter;
  let engine, world,birds=[],actualBird,ground,redImg,boxImg,slingImg,boxes=[],fondo,resortera,pigImg,letherImg,smokeImg,smokeImg1,render,hurtImg;
  let mouseConstraint , slingshot , stoneImg,terrain,arrowBody,plank,plankImg,countBirds=3;
  let endGame=false,stones=[],pigs=[],wall,count;
  let controlledGroup = 1, unControlledGroup = 2;
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
    hurtImg = loadImage('hurtedPig.png');
  }
  
  function setup() {
    const canvas = createCanvas(880,480);
    
    engine = Engine.create();
    world = engine.world;
    
    //render=Matter.Render.create();
    const mouse = Mouse.create(canvas.elt);
    mouse.pixelRatio= pixelDensity();
    
    mouseConstraint = MouseConstraint.create(engine,{
      mouse:mouse,
      collisionFilter: {
        mask: controlledGroup, // Configura el grupo controlado
      },
    });
    World.add(world,mouseConstraint);
    
    for(let i = 0 ; i<countBirds; i++){
      const bird = new Bird(150 + (i*40) ,375,15,10,redImg);
      bird.body.collisionFilter.mask = unControlledGroup;
      bird.body.collisionFilter.category = unControlledGroup;
      birds.push(bird);
    }
    
    actualBird = birds[0];
    actualBird.body.collisionFilter.mask=controlledGroup;
    actualBird.body.collisionFilter.category=controlledGroup;
    
    slingshot = new SlingShot(actualBird);
    Events.on(engine, 'afterUpdate',()=>{
      
    slingshot.fly(mouseConstraint,actualBird);
    /*setTimeout(function(){
      recargar();
    },3000);*/
    //World.remove(world,actualBird.body);
    })
    
    //resortera = new b(150,375,25,5,slingImg);
    for(let i = 0 ; i<2;i++){
      const pig= new Pig((width*3.0/4.0)+20+(60*i),350,20,3,pigImg);
      pig.body.collisionFilter.mask= unControlledGroup;
      pig.body.collisionFilter.category=unControlledGroup;
      pigs.push(pig);
    }
    
    
    
    function kill(pig){
      World.remove(world,pig.body);
      setTimeout(function(){pig.img = smokeImg},100);
      setTimeout(function(){pig.img = smokeImg1},200);
      setTimeout(function(){
        pig.img=null;
        pig.body= null;
        //endGame=true;
      },400);
    }
    Events.on(engine, 'collisionStart', function(event) {
      var pairs = event.pairs;
  
          // change object colours to show those starting a collision
          for (var i = 0; i < pairs.length; i++) {
              var pair = pairs[i];
              for(let i =0 ; i<2;i++){
                if((pair.bodyA===actualBird.body && pair.bodyB === pigs[i].body ) || (pair.bodyB===actualBird.body && pair.bodyA === pigs[i].body) && (actualBird.velocidad >= 8)){
                //colisión con otros objetos
                }
                
                if(((pair.bodyA===actualBird.body && pair.bodyB === pigs[i].body ) || (pair.bodyB===actualBird.body && pair.bodyA === pigs[i].body)) && (actualBird.velocidad >= 12)){
                  console.log("Muerte",actualBird.velocidad);
                  kill(pigs[i]);
                  
                }else if(((pair.bodyA===actualBird.body && pair.bodyB === pigs[i].body ) || (pair.bodyB===actualBird.body && pair.bodyA === pigs[i].body)) && (actualBird.velocidad >= 5)){
                  pig.life -=0.5;
                  pig.img = hurtImg;
                  if(pig.life==0){
                    console.log("Doble golpe");
                    kill(pigs[i]);
                  }
                  console.log("Golpe",actualBird.velocidad);
                }
              }
              
              
          }
  });
 /* Events.on(engine, 'collisionActive', function(event) {
      var pairs = event.pairs;
  
          // change object colours to show those starting a collision
          for (var i = 0; i < pairs.length; i++) {
              var pair = pairs[i];
              if((pair.bodyA===actualBird.body && pair.bodyB === pig.body ) || (pair.bodyB===actualBird.body && pair.bodyA === pig.body) && (actualBird.velocidad >= 8)){
                console.log("ISActive")           
              }            
          }
  });  
    */
   // arrowBody = new Arrow(550,400,stoneImg);
    ground = new Ground(width/2, height -10,width,20);
    ground.body.collisionFilter.mask = unControlledGroup;
    ground.body.collisionFilter.category = unControlledGroup;
    
    wall = new Ground(width, 0,3,height*2);
    wall.body.collisionFilter.mask = unControlledGroup;
    wall.body.collisionFilter.category = unControlledGroup;
    
    /*plank1 = new Box((width*3.0/4.0),height-130,20,70,20,plankImg);
    plank1.body.collisionFilter.mask = unControlledGroup;
    plank1.body.collisionFilter.category = unControlledGroup;
    
    plank2 = new Box((width*3.0/4.0)+100,height-130,20,70,20,plankImg);
    plank2.body.collisionFilter.mask = unControlledGroup;
    plank2.body.collisionFilter.category = unControlledGroup;*/

    
    for(let i=0;i<5;i++){
      const box = new Box((width*3.0/4.0)+(i*30)-10,height-60,30,30,40,boxImg);
        box.body.collisionFilter.mask = unControlledGroup;
        box.body.collisionFilter.category = unControlledGroup;

        boxes.push(box);
    }
    for(let i=0;i<7;i++){
      const box = new Box((width*3.0/4.0)-40+(i*30),height-30,40,40,80,stoneImg);
      box.body.collisionFilter.mask = unControlledGroup;
      box.body.collisionFilter.category = unControlledGroup;
      boxes.push(box);
    }
   
  }
  
  
  function draw() {
    background(fondo);
    Engine.update(engine);
    slingshot.show();
     
    image(slingImg,125,360,50,100);
    
    for(pig of pigs){
      pig.show();
    }
    
    ground.show();
    wall.show();
   // plank1.show();
    //plank2.show();
    
    for(const box of boxes){
      box.show();
    }
    for (const bird of birds){
      bird.show();
    }
    for (const stone of stones){
      stone.show();
    }
    setTimeout(2000);
    let noPigs=false;
    for(let i = 0;i<2;i++){
      if(pigs[i].body){
        noPigs=false;
      }
      if(endGame && pigs[i].body ){
          textSize(50);
          fill(255, 51, 75);
          text('GAME OVER', 440, 240);
      }
      if(noPigs){
        textSize(50);
          fill(51, 255, 75);
          text('YOU WIN', 440, 240);
      }
    }
    
  }
  count=1;
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
