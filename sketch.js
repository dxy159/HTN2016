flock=[];
function setup() {
	//create canvas
	createCanvas(720, 400);
	background(0);
}

function draw() {
  	fill(0, 180, 180);
		background(0);
		for(var i=0;i<flock.length;i++)
			flock[i].update();
}

function Boid(x, y) {
  this.minDist = 16;
  //create the position from mouse pointer position
  this.pos = new p5.Vector(x,y);
  //assign a velocity between (0,5) to the boid
  this.vel= new p5.Vector(Math.random(-1,1),Math.random(-1,1));
  //assign random RGB value for the color of the boid
  //this.color=p5.Vector((Math.random()*255),Math.random()*255,Math.random()*255);
  //assigne vision radius for this boid from range (5,15)
  this.radius=100;//(Math.random()*10+5);
	this.friends=[];

  //add this boid to the global flock variable
  flock.push(this);
	//timer to make things more efficiant
	this.timer=0;
}

Boid.prototype.getfriends= function(timer){
	if(timer%10!=0)
			return this.friends;
	this.friends=[];
	for(var i;i<flock.length;i++){
		if(Vector.dist(this.pos.x,this.pos.y,flock[i].pos.x,flock[i].pos.y)<this.radius){
			friends.push(b);
		}
	}
	return this.friends;
}
Boid.prototype.draw = function () {
	head = p5.Vector.add(this.pos, this.vel.normalize().mult(10));
	orth = new p5.Vector(-this.vel.y, this.vel.x).normalize();
	p2 = p5.Vector.add(p5.Vector.add(this.pos, this.vel.normalize().mult(-10)),orth.mult(6));
	p1 = p5.Vector.add(p5.Vector.add(this.pos, this.vel.normalize().mult(-10)),orth.mult(-6));
	fill(255,255,255);
	triangle(p1.x, p1.y, head.x, head.y, p2.x, p2.y);
};

var boid = new Boid(300, 100)
var boid = new Boid(300, 150)
var boid = new Boid(300, 120)
var boid = new Boid(330, 120)
var boid = new Boid(310, 190)

Boid.prototype.rotate = function (angle) {
	rotate(angle);
}

//Boid.prototype.attract = function (targetPos, coeff) {
//  var targetVel = p5.Vector.sub(targetPos, this.pos); // defines a target velocity to get from original position to target position
//  targetVel.normalize().mult(this.vel.mag()); // normalize the vector so it is not too long
   // make the target vector the same size as the velocity
  // difference between target velocity and velocity will align the boid to go to the target position (mult by 0.60 so that they don't align too fast)
//  return p5.Vector.sub(targetVel, this.vel).normalize().mult(this.vel.mag()).mult(coeff);
//};

Boid.prototype.cohesion = function () {
		neighbordist = 50;
    sum = new p5.Vector(0, 0);
    c = 0;
		this.getfriends(this.timer);
    for (var i=0;i<this.friends.length;i++) {
      d = this.pos.dist(this.friends[i].pos);
      if ((d > 0) && (d < 100)) {
        sum.add(this.friends[i].pos);
        c++;
      }
    }
    if (c > 0) {
      sum.div(c);
			return sum;
    }
    else {
      return new p5.Vector(0, 0);
    }
};

Boid.prototype.separation = function () {
  let avgPos = new p5.Vector(0,0);
	this.getfriends(this.timer);
  for (let i = 0; i < this.friends.length; i++) {
		let d=this.pos.dist(this.friends[i].pos);
		if((d>=0)&&(d<this.radius)){
				temp= this.pos;
				temp.sub(this.friends[i].pos);
				temp.normalize();
				temp.div(d);
				avgPos.add(temp);
			}
  }
  return avgPos; // average from the sum (the vector from attract will be multiplied by a negative so it goes away from this point)
};

Boid.prototype.alignment = function () {
  let avgVel = new p5.Vector(0,0); // average Velocity of all the neighbours
	this.getfriends(this.timer);
	if(this.friends.length==0)
		return this.vel;
  for (let i = 0; i < this.friends.length; i++) {
		let d=this.pos.dist(this.friends[i].pos);
		if((d>=0)&&(d<this.radius)){
				temp= this.friends[i].vel.copy();
				temp.normalize();
				temp.div(d);
				avgVel.add(temp);
			}
  }
  return sum;
};
// this function will allow boids to warp  left/right and up/down
Boid.prototype.continue = function(){
	this.pos.x = (this.pos.x + width) % width;
	this.pos.y = (this.pos.y + height) % height;
};
Boid.prototype.update = function () {
		this.continue();
    //let he boid obey the three rules of the flock
    //first we get the points of attraction and seperation
		v1=this.cohesion();
		v2=this.alignment();
		v3=this.separation();
		this.vel.add(v1);
		this.vel.add(v2);
		this.vel.add(v3);
		//keep things in track
		if(this.vel.x>1)
			this.vel.x=1;
		if(this.vel.y>1)
			this.vel.y=1;
		if(this.vel.x<-1)
			this.vel.x=-1;
		if(this.vel.y<-1)
			this.vel.y=-1;

		this.pos.add(this.vel);
		this.draw();
};
function onMouseClick(event) {
  new Boid(event.clientX,event.clientY);
}
document.addEventListener("click", onMouseClick);
