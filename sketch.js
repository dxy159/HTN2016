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
  this.vel= p5.Vector.random2D();
  //assign random RGB value for the color of the boid
  //this.color=p5.Vector((Math.random()*255),Math.random()*255,Math.random()*255);
  //assigne vision raduis for this boid from range (5,15)
  this.radius=(Math.random()*10+5);


  //setter and getter for friends

  //add this boid to the global flock variable
  flock.push(this);

}

Boid.prototype.getfriends= function(){
	f=[];
	for(var i;i<flock.length;i++){
		if(Vector.dist(this.pos.x,this.pos.y,flock[i].pos.x,flock[i].pos.y)<this.radius){
			f.push(b);
		}
	}
	return f;
}
Boid.prototype.draw = function () {
	head = p5.Vector.add(this.pos, this.vel.normalize().mult(10));
	orth = new p5.Vector(-this.vel.y, this.vel.x).normalize();
	p2 = p5.Vector.add(p5.Vector.add(this.pos, this.vel.normalize().mult(-10)),orth.mult(6));
	p1 = p5.Vector.add(p5.Vector.add(this.pos, this.vel.normalize().mult(-10)),orth.mult(-6));
	fill(255,255,255);
	triangle(p1.x, p1.y, head.x, head.y, p2.x, p2.y);
};

var boid = new Boid(100, 100)
var boid = new Boid(100, 120)
var boid = new Boid(100, 125)
var boid = new Boid(100, 130)
var boid = new Boid(100, 135)

Boid.prototype.rotate = function (angle) {
	rotate(angle);
}

Boid.prototype.attract = function (targetPos, coeff) {
  var targetVel = p5.Vector.sub(targetPos, this.pos); // defines a target velocity to get from original position to target position
  targetVel.normalize().mult(this.vel.mag()); // normalize the vector so it is not too long
   // make the target vector the same size as the velocity
  // difference between target velocity and velocity will align the boid to go to the target position (mult by 0.60 so that they don't align too fast)
  return p5.Vector.sub(targetVel, this.vel).normalize().mult(this.vel.mag()).mult(coeff);
};

Boid.prototype.cohesion = function () {
  let avgPos = new p5.Vector(0,0) // average position of all the neighbours
	let neighbours=this.getfriends();
  for (let i = 0; i < neighbours.length ; i++) {
    avgPos.add(neighbours[i].pos); // looks through all the neighbours and add their position to avgPos
  }
  return avgPos.div(neighbours.length); // return the sum of all the position divided by the number of neighbours
};

Boid.prototype.separation = function () {
  let avgPos = new p5.Vector(0,0);
  let c = 0;
	let neighbours=this.getfriends();
  for (let i = 0; i < neighbours.length; i++) {
    if (p5.Vector.dist(this.pos, neighbours[i].pos) < this.minDist) { //look if the neighbour is too close
      avgPos.add(neighbours.pos); // then, sum points like in cohesion
      c++ // keep in memory how many boids are too close to average
    }
  }
  return avgPos.div(c); // average from the sum (the vector from attract will be multiplied by a negative so it goes away from this point)
};

Boid.prototype.alignment = function () {
  let avgVel = new p5.Vector(0,0); // average Velocity of all the neighbours
	let neighbours=this.getfriends();
  for (let i = 0; i < neighbours.length; i++) {
    avgVel.add(neighbours[i].vel); // sum of all the velocities
  }
  avgVel.div(neighbours.length); // sum divided by number of neighbours = avg
  // difference between target velocity and velocity is the vector that will allign the boid (we multiply by 0.45 so the boids don't get aligned too quickly)
  return p5.Vector.sub(avgVel, this.vel).mult(0.45);

};

Boid.prototype.update = function () {
    //let he boid obey the three rules of the flock
    //first we get the points of attraction and seperation
    cohesionRulePoint=this.cohesion();
    //seperationRulePoint=this.separation();
    //we generate attraction vector for both points
    v1=this.attract(cohesionRulePoint,0.2);
    //v2=this.attract(seperationRulePoint,0.2);
    // update the velocity
    this.vel.add(v1/*.add(v2)*/.add(this.alignment()));
		this.pos.add(this.vel);
		this.draw();
};
