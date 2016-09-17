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

function rotate() {
	rotate(PI/3.0);
}

draw();
rotate();


function Boid(x, y) {

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

Boid.prototype.attract = function () {

};

Boid.prototype.cohesion = function () {

};

Boid.prototype.separation = function () {

};

Boid.prototype.allignment = function () {

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
