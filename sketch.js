flock=[];
function setup() {
	//create canvas
	createCanvas(720, 400);

}

function draw() {

	 //set background colour
  	background(0);
  	//fill colour
  	fill(0, 180, 180);
}

function Boid(x, y) {
  this.minDist = 16;
  //create the position from mouse pointer position
  this.pos=createVector(x,y);
  //assign a velocity between (0,5) to the boid
  this.vel=createVector(Math.random()*5,(Math.random()*5));
  //assign random RGB value for the color of the boid
  this.color=createVector((Math.random()*255),Math.random()*255,Math.random()*255);
  //assigne vision raduis for this boid from range (5,15)
  this.radius=(Math.random()*10+5);
  //an array to store friends
  this.f=[];

  //setter and getter for friends
  get friends(){
      return f;
  }
  set friends(){
    for(var b:flock){
      if(Vector.dist(this.pos.x,this.pos.y,b.pos.x,b.pos.y)<this.radius){
        this.f.append(b);
      }
    }
  }
  //add this boid to the global flock variable
  flock.append(this);

	get p1() {
		return createVector(this.pos.x - 6, this.pos.y - 10);
	}

	get p2() {
		return createVector(this.pos.x, this.pos.y + 10);
	}

	get p3() {
		return createVector(this.pos.x + 6, this.pos.y - 10);
	}
}

Boid.prototype.draw = function () {
	fill(Math.random() * 255);
	triangle(this.p1().x, this.p1().y, this.p2().x, this.p2().y, this.p3().x, this.p3().y);
};

var boid = new Boid(100, 100)

Boid.prototype.rotate = function (angle) {
	rotate(angle);
}

Boid.prototype.attract = function (targetPos, coeff) {
  var targetVel = p5.Vector.sub(targetPos, this.pos); // defines a target velocity to get from original position to target position
  targetVel.normalize(); // normalize the vector so it is not too long
  targetVel.mult(this.vel.mag()); // make the target vector the same size as the velocity
  // difference between target velocity and velocity will align the boid to go to the target position (mult by 0.60 so that they don't align too fast)
  return p5.Vector.sub(targetVel, this.vel).normalize().mult(this.vel.mag()).mult(coeff);
};

Boid.prototype.cohesion = function () {
  let avgPos = createVector(0,0) // average position of all the neighbours
  for (let i = 0; i < this.neighbours.length; i++) {
    avgPos.add(this.neighbours[i].pos); // looks through all the neighbours and add their position to avgPos
  }
  return avgPos.div(this.neighbours.length); // return the sum of all the position divided by the number of neighbours
};

Boid.prototype.separation = function () {
  let avgPos = createVector(0,0);
  let c = 0;
  for (let i = 0; i < this.neighbours.length; i++) {
    if (p5.Vector.dist(this.pos, this.neighbours[i].pos) < this.minDist) { //look if the neighbour is too close
      avgPos.add(this.neighbours.pos); // then, sum points like in cohesion
      c++ // keep in memory how many boids are too close to average
    }
  }
  return avgPos.div(c); // average from the sum (the vector from attract will be multiplied by a negative so it goes away from this point)
};

Boid.prototype.allignment = function () {
  let avgVel = createVector(0,0); // average Velocity of all the neighbours
  for (let i = 0; i < this.neighbours.length; i++) {
    avgVel.add(this.neighbours[i].vel); // sum of all the velocities
  }
  avgVel.div(this.neighbours.length); // sum divided by number of neighbours = avg
  // difference between target velocity and velocity is the vector that will allign the boid (we multiply by 0.45 so the boids don't get aligned too quickly)
  return p5.Vector.sub(avgVel, this.vel).mult(0.45);

};

Boid.prototype.update = function () {
    //let he boid obey the three rules of the flock
    //first we get the points of attraction and seperation
    Vector cohesionRulePoint=this.cohesion();
    Vector seperationRulePoint=this.seperation();
    //we generate attraction vector for both points
    Vector v1=attract(cohesionRulePoint,0.6);
    Vector v2=attract(seperationRulePoint,0.2);
    // update the velocity
    this.vel=v1+v2+this.alignment()+this.vel;
};
