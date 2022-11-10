const Car = function(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.speed = 0;
    this.acceleration = 0.2;
    this.maxSpeed = 5;
    this.friction = 0.05;
    this.angle = 0;
    this.damaged = false;

    this.sensor = new Sensor(this);
    this.controls = new Controls();


    this.update = function(roadBorders) {
        this.move();
        this.polygon = this.createPolygon();
        this.damaged = this.isDamaged(roadBorders);
        this.sensor.update(roadBorders);
    }

    this.move = function() {
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

    this.createPolygon = function() {
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

    this.isDamaged = function(roadBorders) {
        for (let i = 0; i < roadBorders.length; i++) {
            if (polyIntersect(roadBorders[i], this.polygon)) {
                return true;
            }
        }
        return false;
    }

    this.draw = function(ctx) {
        if (this.damaged) ctx.fillStyle = 'red';
        // console.log(this.damaged)
        ctx.beginPath();
        ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
        for (let i = 1; i < this.polygon.length; i++) {
            ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
        }
        ctx.fill();
        

        this.sensor.draw(ctx);
        // console.log(this.sensor.rays[0][0].y == this.y);
    }

}