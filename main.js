const canvas = document.getElementById('myCanvas');
canvas.width = 200;

const ctx = canvas.getContext("2d");

const road = new Road(canvas.width/2,canvas.width*0.9, 3)
const car = new Car(road.getLaneCenter(1), 100, 30, 50, 'MAIN', 5);

const dummies = [
    new Car(road.getLaneCenter(1), -50, 30, 50, 'DUMMY')
];

animate();

function animate() {

    for (let i = 0; i < dummies.length; i++) {
        dummies[i].update(road.borders, [])
    }

    car.update(road.borders, dummies);

    canvas.height = window.innerHeight;

    ctx.save();
    ctx.translate(0, -car.y + canvas.height * 0.7);

    road.draw(ctx);

    for (let i = 0; i < dummies.length; i++) {
        dummies[i].draw(ctx);
    }

    car.draw(ctx);

    ctx.restore();
    requestAnimationFrame(animate);
}