var boids = [];
var masterBoid;
var map=[];
var img;
function setup() {
  createCanvas(900, 600);
  //img = loadImage("assets/background.jpg");
  // Add an initial set of boids into the system
  for (var i = 1; i <= 10; i++) {
    boids[i] = new Boid(random(width), random(height));
  }
  masterBoid=boids[0]=new Boid(random(width), random(height));
}

function draw() {
  background(51);
  //image(img,0,0);
  // Run all the boids
  for (var i = 0; i < boids.length; i++) {
    boids[i].run(boids);
  }
  if (mouseIsPressed) {
    boids.push(new Boid(mouseX, mouseY));
  }
  console.log("Slaves left:"+boids.length);
}
function moveSuperBoid(e){
  this.map[e.keyCode]=e.type=="keydown";
  console.log(e.keyCode);
  let step=1;
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
