const Car = function(x, y, width, height, carType, maxSpeed = 3) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.maxSpeed = maxSpeed;

    this.speed = 0; 
    this.acceleration = 0.2;
    this.friction = 0.05;
    this.angle = 0;
    this.damaged = false;

    // this.sensor = new Sensor(this);

    if (carType == 'MAIN') {
        this.sensor = new Sensor(this);
    }

    this.controls = new Controls(carType);
}


Car.prototype.update = function(roadBorders, dummies) {
    if (!this.damaged) {
        this.move();
        this.polygon = this.createPolygon();
        this.damaged = this.isDamaged(roadBorders, dummies);
    }
    if (this.sensor) this.sensor.update(roadBorders, dummies);
}

Car.prototype.move = function() {
    // car movement
    if (this.controls.forward) {
        this.speed += this.acceleration;
    }
    if (this.controls.back) {
        this.speed -= this.acceleration;
    }

    if (Math.abs(this.speed) > 0.1*this.maxSpeed) {
        const flip = this.speed > 0 ? 1:-1
    
        if (this.controls.right) {
            this.angle -= 0.03 * flip;
        }
        if (this.controls.left) {
            this.angle += 0.03 * flip;
        }
    }

    // speed cap
    if (this.speed > this.maxSpeed) {
        this.speed = this.maxSpeed;
    }
    if (this.speed < -this.maxSpeed/2) {
        this.speed = -this.maxSpeed/2;
    }

    // friction
    if (this.speed > 0) {
        this.speed -= this.friction
    }
    if (this.speed < 0) {
        this.speed += this.friction
    }
    // stops tiny movements
    if (Math.abs(this.speed) < this.friction) {
        this.speed = 0;
    }
    
    this.x -= Math.sin(this.angle) * this.speed;
    this.y -= Math.cos(this.angle) * this.speed;
}

Car.prototype.createPolygon = function() {
    const points = [];
    const rad = Math.hypot(this.width, this.height)/2;
    const alpha = Math.atan2(this.width, this.height);
    points.push({
        x: this.x - rad * Math.sin(this.angle - alpha),
        y: this.y - rad * Math.cos(this.angle - alpha)
    });
    points.push({
        x: this.x - rad * Math.sin(this.angle + alpha),
        y: this.y - rad * Math.cos(this.angle + alpha)
    });
    points.push({
        x: this.x - rad * Math.sin(Math.PI + this.angle - alpha),
        y: this.y - rad * Math.cos(Math.PI + this.angle - alpha)
    });
    points.push({
        x: this.x - rad * Math.sin(Math.PI + this.angle + alpha),
        y: this.y - rad * Math.cos(Math.PI + this.angle + alpha)
    });
    return points;
}

Car.prototype.isDamaged = function(roadBorders, dummies) {
    for (let i = 0; i < roadBorders.length; i++) {
        if (polyIntersect(roadBorders[i], this.polygon)) {
            return true;
        }
    }

    for (let i = 0; i < dummies.length; i++) {
        if (polyIntersect(dummies[i].polygon, this.polygon)) {
            return true;
        }
    }
    return false;
}

Car.prototype.draw = function(ctx) {
    if (this.damaged) ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
    for (let i = 1; i < this.polygon.length; i++) {
        ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
    }
    ctx.fill();
    

    if (this.sensor) this.sensor.draw(ctx);
    // console.log(this.sensor.rays[0][0].y == this.y);
}