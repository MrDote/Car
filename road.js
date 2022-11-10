const Road = function(x, width, laneCount = 3) {
    this.x = x;
    this.width = width;
    this.laneCount = laneCount;

    this.lineWidth = 5;

    this.left = x - width/2;
    this.right = x + width/2;

    const inf = 100000;
    this.top = -inf;
    this.bot = inf;

    const topLeft = {x:this.left + this.lineWidth/2, y:this.top};
    const topRight = {x:this.right - this.lineWidth/2, y:this.top};
    const botLeft = {x:this.left + this.lineWidth/2, y:this.bot};
    const botRight = {x:this.right - this.lineWidth/2, y:this.bot};

    this.borders = [
        [topLeft, botLeft],
        [topRight, botRight]
    ];

    this.getLaneCenter = function(index) {
        const lineWidth = this.width / this.laneCount;
        return this.left + lineWidth/2 + Math.min(index, this.laneCount - 1)* lineWidth;
    }

    this.draw = (ctx) => {
        ctx.lineWidth = this.lineWidth;
        ctx.strokeStyle = 'white';

        for (let i = 1; i <= this.laneCount-1; i++) {
            const x = lerp(
                this.left,
                this.right,
                i/this.laneCount
            );
            // mid lanes
            ctx.setLineDash([20,20]);
            ctx.beginPath();
            ctx.moveTo(x, this.top);
            ctx.lineTo(x, this.bot);
            ctx.stroke();
        }
        
        // borders
        ctx.setLineDash([]);

        let i = 0;
        this.borders.forEach(border => {
            ctx.beginPath();
            if (i%2 == 0) {
                ctx.moveTo(border[0].x - this.lineWidth/2, border[0].y);
                ctx.lineTo(border[1].x - this.lineWidth/2, border[1].y);
            }
            else {
                ctx.moveTo(border[0].x + this.lineWidth/2, border[0].y);
                ctx.lineTo(border[1].x + this.lineWidth/2, border[1].y);
            }
            ctx.stroke();
            i+=1;
        });
    }
}

