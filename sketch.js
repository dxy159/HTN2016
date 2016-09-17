flock=Boid[];
function setup() {
  createCanvas(600,600);
}

function draw() {
  
}

function Boid(int x,int y) {

  //create the position from mouse pointer position
  this.pos=p5.createVector(x,y);
  //assign a velocity between (0,5) to the boid
  this.vel=p5.createVector((Math.random()*5,(Math.random()*5);
  //assign random RGB value for the color of the boid
  this.color=p5.createVector((Math.random()*255,Math.random()*255,Math.random()*255);
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
      if(p5.Vector.dist(this.pos.x,this.pos.y,b.pos.x,b.pos.y)<this.radius){
        this.f.append(b);
      }
    }
  }
  //add this boid to the global flock variable
  flock.append(this);
}

Boid.prototype.draw = function () {

};

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
    p5.Vector cohesionRuleVector=this.cohesion();
    p5.Vector seperationRuleVector=this.seperation();
    p5.Vector alignmentRuleVector=this.alignment();
};
