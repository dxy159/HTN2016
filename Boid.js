// Boid class taken from https://p5js.org/examples/demos/Hello_P5_Flocking.php and slightly modified
// Methods for Separation, Cohesion, Alignment added
function Boid(x, y,id) {
  this.alive=1;
  this.acceleration = createVector(0, 0);
  this.velocity = p5.Vector.random2D();
  this.position = createVector(x, y);
  this.r = 3.0;
  this.maxspeed = 2;    // Maximum speed
  this.maxforce = 0.05; // Maximum steering force
}

Boid.prototype.run = function(boids) {
  this.flock(boids);
  this.update();
  this.borders();
  this.render();
};

Boid.prototype.die = function(obs) {
  for(var i=0;i<obs.length;i++){
    if(p5.Vector.dist(obs[i].position,this.position)<obs[i].r){
      return true;
    }
  }
};
Boid.prototype.eat = function(foods) {
  let c=0;
  for(var i=0;i<foods.length;i++){
    if(p5.Vector.dist(foods[i].position,this.position)<foods[i].r){
      c++;
      foods.splice(foods.findIndex(function(el,idx, a) {
                                    if (foods[i].position.x === el.position.x && foods[i].position.y === el.position.y) {
                                      return true;
                                    }
                                    return false;
                                  }),1);

    }
  }
  return c*5;
};
// Forces go into acceleration
Boid.prototype.applyForce = function(force) {
  this.acceleration.add(force);
};

// We accumulate a new acceleration each time based on three rules
Boid.prototype.flock = function(boids) {
  if(this!=masterBoid){
    var sep = this.separate(boids); // Separation
    var ali = this.align(boids);    // Alignment
    var coh = this.cohesion(boids); // Cohesion
    // Arbitrarily weight these forces
    sep.mult(2.5);
    ali.mult(1.0);
    coh.mult(1.0);
    // Add the force vectors to acceleration
    this.applyForce(sep);
    this.applyForce(ali);
    this.applyForce(coh);
    //this.applyForce(createVector(1,0));
  }
};

// Method to update location
Boid.prototype.update = function() {
  // Update velocity
  this.velocity.add(this.acceleration);
  // Limit speed
  this.velocity.limit(this.maxspeed);
  this.position.add(this.velocity);
  // Reset accelertion to 0 each cycle
  this.acceleration.mult(0);
};

// A method that calculates and applies a steering force towards a target
// STEER = DESIRED MINUS VELOCITY
Boid.prototype.seek = function(target) {
  var desired = p5.Vector.sub(target, this.position); // A vector pointing from the location to the target
  // Normalize desired and scale to maximum speed
  desired.normalize();
  desired.mult(this.maxspeed);
  // Steering = Desired minus Velocity
  var steer = p5.Vector.sub(desired, this.velocity);
  steer.limit(this.maxforce); // Limit to maximum steering force
  return steer;
};

// Draw boid as a circle
Boid.prototype.render = function() {

  head = p5.Vector.add(this.position, p5.Vector.mult(this.velocity,10/this.velocity.mag()));
	orth = new p5.Vector(-this.velocity.y, this.velocity.x).normalize();
  inverseVel = p5.Vector.add(this.position, p5.Vector.mult(this.velocity,-10/this.velocity.mag()));
	p2 = p5.Vector.add(inverseVel,p5.Vector.mult(orth,6));
	p1 = p5.Vector.add(inverseVel,p5.Vector.mult(orth,-6));
  if(this==masterBoid)
    fill(0,255,0);
  else
	  fill(255,255,255);
  triangle(p1.x, p1.y, head.x, head.y, p2.x, p2.y);
};

// Wraparound
Boid.prototype.borders = function() {
  if (this.position.x < -this.r) this.position.x = width + this.r;
  if (this.position.y < -this.r) this.position.y = height + this.r;
  if (this.position.x > width + this.r) this.position.x = -this.r;
  if (this.position.y > height + this.r) this.position.y = -this.r;
};

// Separation
// Method checks for nearby boids and steers away
Boid.prototype.separate = function(boids) {
  var desiredseparation = 30.0;
  var steer = createVector(0, 0);
  var count = 0;
  // For every boid in the system, check if it's too close
  for (var i = 0; i < boids.length; i++) {
    var d = p5.Vector.dist(this.position, boids[i].position);
    // If the distance is greater than 0 and less than an arbitrary amount (0 when you are yourself)
    if ((d > 0) && (d < desiredseparation)) {
      // Calculate vector pointing away from neighbor
      var diff = p5.Vector.sub(this.position, boids[i].position);
      diff.normalize();
      diff.div(d); // Weight by distance
      steer.add(diff);
      count++; // Keep track of how many
    }
  }
  // Average -- divide by how many
  if (count > 0) {
    steer.div(count);
  }

  // As long as the vector is greater than 0
  if (steer.mag() > 0) {
    //follow leader
    var d = p5.Vector.dist(this.position, masterBoid.position);
    if ((d > 0) && (d < desiredseparation)) {
      steer.add(p5.Vector.sub(steer, p5.Vector.div(masterBoid.position,2))).div(2);
    }
    // Implement Reynolds: Steering = Desired - Velocity
    steer.normalize();
    steer.mult(this.maxspeed);
    steer.sub(this.velocity);
    steer.limit(this.maxforce);
  }
  return steer;
};

// Alignment
// For every nearby boid in the system, calculate the average velocity
Boid.prototype.align = function(boids) {
  var neighbordist = 50;
  var sum = createVector(0, 0);
  var count = 0;
  for (var i = 0; i < boids.length; i++) {
    var d = p5.Vector.dist(this.position, boids[i].position);
    if ((d > 0) && (d < neighbordist)) {
      sum.add(boids[i].velocity);
      count++;
    }
  }
  if (count > 0) {
    sum.div(count);
    sum.normalize();
    sum.mult(this.maxspeed);
    var steer = p5.Vector.sub(sum, this.velocity);
    steer.limit(this.maxforce);
    //check if we need to follow the leader
    var d = p5.Vector.dist(this.position, masterBoid.position);
    if ((d > 0) && (d < neighbordist)) {
      steer.add(p5.Vector.div(masterBoid.velocity,2)).div(2);
    }
    return steer;
  } else {
    return createVector(0, 0);
  }
};

// Cohesion
// For the average location (i.e. center) of all nearby boids, calculate steering vector towards that location
Boid.prototype.cohesion = function(boids) {
  var neighbordist = 50;
  var sum = createVector(0, 0); // Start with empty vector to accumulate all locations
  var count = 0;
  for (var i = 0; i < boids.length; i++) {
    var d = p5.Vector.dist(this.position, boids[i].position);
    if ((d > 0) && (d < neighbordist)) {
      sum.add(boids[i].position); // Add location
      count++;
    }
  }
  if (count > 0) {
    sum.div(count);
    //follow leader
    var d = p5.Vector.dist(this.position, masterBoid.position);
    if ((d > 0) && (d < neighbordist)) {
      sum.add(p5.Vector.div(masterBoid.position,2)).div(2);
    }
    return this.seek(sum); // Steer towards the location
  } else {
    return createVector(0, 0);
  }
};
