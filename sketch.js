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

function rotate() {
	rotate(PI/3.0);
}

draw();
rotate();

function Boid() {

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

Boid.prototype.update = function () {

};

Boid.prototype.draw = function () {
	fill(Math.random() * 255);
	triangle(30, 75, 36, 55, 42, 75);
};

Boid.prototype.attract = function () {

};

Boid.prototype.cohesion = function () {

};

Boid.prototype.separation = function () {

};

Boid.prototype.allignment = function () {
  
};
