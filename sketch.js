var boids = [];
var obs=[];
var masterBoid;
var map=[];
var followers=[];
var img;
var cntr=0;
function setup() {
  createCanvas(900, 600);
  //img = loadImage("assets/background.jpg");
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
  background(51);
  //image(img,0,0);
  // Run all the boids
  let idx=[];
  for (var i = 0; i < boids.length; i++) {
    if(boids[i].alive){
      //try to kill the boid
      if(boids[i].die(obs))
        boids[i].alive=0;
      else
        boids[i].run(boids);
    }
  }
  //Run all the obstacles
  for(var i=0;i<obs.length;i++)
    obs[i].run();

  if (mouseIsPressed) {
    boids.push(new Boid(mouseX, mouseY));
  }
  console.log("Slaves left:"+boids.length);
  //create and obstacle by chance
  let chance=Math.random()*Math.random();
  if(chance>0.8)
    obs.push(new Obstacle(random(width), random(height)));
  //create random boids by chance
  chance=Math.random()*Math.random();
  if(chance>0.9)
      boids.push(new Boid(random(-1,-2), random(-1,-2)));
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
window.addEventListener("keyup", this.moveSuperBoid,false);
