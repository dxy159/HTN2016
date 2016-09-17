function Obstacle(x,y){
  this.position = createVector(x, y);
  this.r = 30.0;
}
Obstacle.prototype.run = function(){
  this.position.y++;
  this.draw();
}
Obstacle.prototype.draw = function(){
  fill(100,255,100);
  ellipse(this.position.x,this.position.y,this.r,this.r);
};
