var PLAY = 1;
var END = 0;
var gameState = PLAY;

var dora, dora_running, dora_collided;
var ground, invisibleGround, groundImage;


var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5

var score;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound
 var road , background1
function preload(){
  dora_running = loadAnimation("dora1.png","dora3.png","dora4.png"
    );
  dora_collided = loadAnimation("dora_collided.png");
  
  groundImage = loadImage("ground2.png");
  

  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");

  
  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  background1=loadImage("road.jpeg")
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(600, 200);

  var message = "This is a message";
 console.log(message)
  
  dora = createSprite(50,160,20,50);
  dora.addAnimation("running", dora_running);
  dora.addAnimation("collided", dora_collided);
  

  dora.scale = 0.5;
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
 
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();

  
  dora.setCollider("rectangle",0,0,dora.width/3,dora.height/3);
  dora.debug = true
  
  score = 0;
  
}

function draw() {
  
  background(background1);
  //displaying score
  text("Score: "+ score, 500,50);
  
  
  if(gameState === PLAY){
    gameOver.visible = false;
    restart.visible = false;
    
    ground.velocityX = -(4 + 3* score/100)
    //scoring
    score = score + Math.round(getFrameRate()/60);
    
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& dora.y >= 100) {
        dora.velocityY = -12;
        jumpSound.play();
    }
    
    //add gravity
    dora.velocityY = dora.velocityY + 0.8
  
    
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(dora)){
        //dora.velocityY = -12;
        jumpSound.play();
        gameState = END;
        dieSound.play()
      
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
      
  
     
     //change the dora animation
      dora.changeAnimation("collided", dora_collided);
    
     
     
      ground.velocityX = 0;
      dora.velocityY = 0
      
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);

    if(mousePressedOver(restart)) {
      reset();
    }
    
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);    
   }
  
 
  //stop dora from falling down
  dora.collide(invisibleGround);
  
  

  drawSprites();
}

function reset(){
  
  gameState=PLAY
  score=0
  obstaclesGroup.destroyEach()
  cloudsGroup.destroyEach()
  dora.changeAnimation("running", dora_running);

}


function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(600,165,10,40);
   obstacle.velocityX = -(6 + score/100);
   
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}



