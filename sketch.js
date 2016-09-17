var boids = [];
var obs=[];
var foods=[];
var masterBoid;
var map=[];
var followers=[];
var img;
var cntr=0;
var running=1;
var width=1200;
var height=600;
var score=0;
var cnt=0;
var tailing=1;
function setup() {

  createCanvas( 1366, 768);
  //backgroundimg=loadImage("assets/background.jpg");
  //images[0] = loadImage("assets/water.png");
  // Add an initial set of boids into the system
  for (var i = 1; i <= 20; i++)
    boids[i]=new Boid(random(width), random(height));
  //create the master boid !!!
  boids[0]=masterBoid=new Boid(random(width), random(height));
  //creat initial fleet for your master boid
  for (var i = 1; i <= 20; i++)
    boids[i]=new Boid(masterBoid.position.x+Math.random(-1,1), masterBoid.position.y+Math.random(-1,1));

}
function draw() {

  if(running){
    if(cnt%100==0||!tailing){
      background(20,20,30);
      //image(backgroundimg,random(width), random(height));
      cnt=0;
    }
    cnt++;
    //get master boid slaves for this frame
    followers=[];
    for(var i=0;i<boids.length;i++)
      if(boids[i]!=masterBoid&&p5.Vector.dist(masterBoid.position,boids[i].position)<150)
        followers.push(boids[i]);
    if(followers.length==0){
      this.running=0;
      return;
    }
    //create Obstacles by chance
    let chance=Math.random()*Math.random();
    if(chance>0.8)
      obs.push(new Obstacle(random(width), random(height)));

      //create food by chance
      chance=Math.random()*Math.random();
      if(chance>0.9)
        foods.push(new Food(random(width), random(height)));

      //create random boids by chance
      chance=Math.random()*Math.random();
      if(chance>0.9)
        boids.push(new Boid(random(-1,-2), random(-1,-2)));

        // Run all the boids
        let idx=[];
        for (var i = 0; i < boids.length; i++) {
          //make boid
          score+=boids[i].eat(foods);
          //try to kill the boid
          if(boids[i].die(obs)){
            if(boids[i]===masterBoid)
              running=0;
            boids.splice(boids.findIndex(function(el,idx, a) {
                                          if (boids[i].position.x === el.position.x && boids[i].position.y === el.position.y) {
                                            return true;
                                          }
                                          return false;
                                        }),1);
                                      }

          else{
            boids[i].run(boids);
            }
            }

    //Run all the obstacles
    for(var i=0;i<obs.length;i++)
      obs[i].run();

      //Run all the foods
      for(var i=0;i<foods.length;i++)
        foods[i].run();
      if (mouseIsPressed) {
        boids.push(new Boid(mouseX, mouseY));
      }
      console.log();
    textSize(50);
    fill(40,30,120);
    text("Lead the Flock", 10, 50);
    textSize(15);
    fill(0, 102, 153);
    text("Followers left:"+followers.length, 10, 70);
    text("Score :"+score, 10, 90);
  }
  else {
    textSize(40);
    fill(10, 255, 10);
    text("GAME OVER!!", width/2-100, height/2);
  }

  //keyboard handling
  if(keyIsDown(32)&&(score>0)){
    score-=5;
    boids.push(new Boid(masterBoid.position.x+Math.random(-1,1), masterBoid.position.y+Math.random(-1,1)));
  }

}
function keyReleased(e) {
  if(e.keyCode==84)
    tailing=((tailing)?0:1);
  return false; // prevent any default behavior
}
function moveSuperBoid(e){
  this.map[e.keyCode]=e.type=="keydown";
  let step=1.2;
  //up
  if(map[38])
    masterBoid.velocity.y-=step;
  //down
  if(map[40])
    masterBoid.velocity.y+=step;
  //right
  if(map[39])
    masterBoid.velocity.x+=step;
  //left
  if(map[37])
    masterBoid.velocity.x-=step;
  //we don't want the boid to stop moving
  if(masterBoid.velocity.x==0)
    masterBoid.velocity.x=Math.random(-0.1,0.1);
  if(masterBoid.velocity.y==0)
    masterBoid.velocity.y=Math.random(-0.1,0.1);

};
window.addEventListener("keydown", this.moveSuperBoid,false);
window.addEventListener("keydown", function(e){if(e.keyCode!==116){e.preventDefault();}},false);
window.addEventListener("keyup", this.moveSuperBoid,false);
