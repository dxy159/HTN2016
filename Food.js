function Food(x,y){
  this.position = createVector(x, y);
  this.r = 15.0;
}
Food.prototype.run = function(){
  this.position.x++;
  this.draw();
}
Food.prototype.draw = function(){
  fill(100,255,100);
  ellipse(this.position.x,this.position.y,this.r,this.r);
};
