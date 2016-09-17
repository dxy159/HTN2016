function setup() {
  createCanvas(600,600);
}

function draw() {

}

function Boid() {
  this.minDist = 16;
}

Boid.prototype.update = function () {

};

Boid.prototype.draw = function () {

};

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
