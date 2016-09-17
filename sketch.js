var boids = [];

function setup() {
  createCanvas(720, 400);

  // Add an initial set of boids into the system
  for (var i = 0; i < 5; i++) {
    boids[i] = new Boid(random(width), random(height));
  }
}

function draw() {
  background(51);
  // Run all the boids
  for (var i = 0; i < boids.length; i++) {
    boids[i].run(boids);
  }
}

function mouseDragged() {
  boids.push(new Boid(mouseX, mouseY));
}
