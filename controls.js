const Controls = function(carType) {
    this.forward = false;
    this.right = false;
    this.left = false;
    this.back = false;

    switch(carType) {
        case 'MAIN':
            this.addKeyboardListeners();
            break;
        case 'DUMMY':
            this.forward = true;
            break;
    }

}


Controls.prototype.addKeyboardListeners = function() {
    document.onkeydown = (e) => {
        switch(e.key) {
            case 'ArrowRight':
                this.right = true;
                break;
            case 'ArrowLeft':
                this.left = true;
                break;
            case 'ArrowUp':
                this.forward = true;
                break;
            case 'ArrowDown':
                this.back = true;
                break;
        }
    }

    document.onkeyup = (e) => {
        switch(e.key) {
            case 'ArrowRight':
                this.right = false;
                break;
            case 'ArrowLeft':
                this.left = false;
                break;
            case 'ArrowUp':
                this.forward = false;
                break;
            case 'ArrowDown':
                this.back = false;
                break;
        }
    }
}