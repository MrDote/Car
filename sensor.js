const Sensor = function(car) {
    this.car = car;
    this.rayCount = 10;
    this.rayLength = 150;
    this.raySpread = Math.PI/2;

    this.rays = [];
    this.readings = [];
}

Sensor.prototype.update = function(roadBorders, dummies) {
    this.castRays();
    this.readings = [];
    for (let i = 0; i < this.rayCount; i++) {
        this.readings.push(
            this.getRead(this.rays[i], roadBorders, dummies)
        );
    }
}

Sensor.prototype.getRead = function(ray, roadBorders, dummies) {

    let touches = [];

    for (let i = 0; i < roadBorders.length; i++) {
        const touch = getIntersection(
            ray[0],
            ray[1],
            roadBorders[i][0],
            roadBorders[i][1]
        );

        if (touch) {
            touches.push(touch);
        }
    }
    
    for (let i = 0; i < dummies.length; i++) {
        const poly = dummies[i].polygon;

        for (let j = 0; j < poly.length; j++) {

            const touch = getIntersection(
                ray[0],
                ray[1],
                poly[j],
                poly[(j+1)%poly.length]
                
            );

        

            if (touch) {
                touches.push(touch);
            }
        }
    }

    if (touches.length == 0) {
        return null;
    }

    else {
        const offsets = touches.map(e => e.offset);
        const minOffset = Math.min(...offsets);
        return touches.find(e => e.offset == minOffset);
    }
}

Sensor.prototype.castRays = function() {

    this.rays=[];

    for (let i = 0; i < this.rayCount; i++) {

        const rayAngle = lerp(
            this.raySpread/2,
            -this.raySpread/2,
            this.rayCount == 1 ? 0.5 : i/(this.rayCount - 1)
        ) + this.car.angle;

        const start = {x:this.car.x, y:this.car.y};

        const end = {
            x: this.car.x - this.rayLength * Math.sin(rayAngle),
            y: this.car.y - this.rayLength * Math.cos(rayAngle)
        }

        this.rays.push([start, end]);
    }
}

Sensor.prototype.draw = function(ctx) {
    for (let i = 0; i < this.rayCount; i++) {
        let end = this.rays[i][1];
        if (this.readings[i]) {
            end = this.readings[i];
        }

        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'yellow';
        ctx.moveTo(
            this.rays[i][0].x,
            this.rays[i][0].y
        );
        ctx.lineTo(
            end.x,
            end.y
        );
        ctx.stroke();

        
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'red';
        ctx.moveTo(
            this.rays[i][1].x,
            this.rays[i][1].y
        );
        ctx.lineTo(
            end.x,
            end.y
        );
        ctx.stroke();
    }
}