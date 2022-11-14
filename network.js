class FCTemplate {
    constructor(inputNodes, outputNodes, activationFunction) {
        this.inputs = new Array(inputNodes);
        this.outputs = new Array(outputNodes);
        this.biases = new Array(outputNodes).fill(0);
        this.weights = new Array(inputNodes).fill(new Array(outputNodes).fill(0));
        this.activationFunction = activationFunction;
    }

    static randomizeWeightsBiases(layer) {
        const weights = layer.weights;
        for (let i = 0; i < weights.length; i++) {
            const connection = weights[i];
            for (let j = 0; j < connection.length; j++) {
                connection[j] = Math.random()*2-1;
            }
        }
        const biases = layer.biases;
        for (let i = 0; i < biases.length; i++) {
            biases[i] = Math.random()*2-1;
        }
    }

    static feedForward(inputs, layer) {
        // update inputs
        const inp = layer.inputs;
        for (let i = 0; i < inp.length; i++) {
            inp[i] = inputs[i];
        }

        // update outputs
        const out = layer.outputs;
        for (let i = 0; i < out.length; i++) {
            let sum = 0;
            for (let j = 0; j < inp.length; j++) {
                sum += layer.inputs[j] * level.weights[j][i];
            }
            const result = sum + out.biases[i];
            out[i] = this.applyActivationFunction(result, this.activationFunction);
        }
    }

    static applyActivationFunction(value, AF, gradient = 1) {
        switch(AF) {
            case 'linear':
                this.applyLinear(value, gradient);
                break;
            case 'relu':
                this.applyRELU(value, gradient);
                break;
            default:
                this.applyLinear(value, gradient);
                break;
        }
    }

    static applyLinear(value, gradient) {
        return value * gradient;
    }

    static applyRELU(value, gradient) {
        return (value > 0) ? (value * gradient) : 0;
    }
}


class FCRandom extends FCTemplate {
    constructor(inputNodes, outputNodes) {
        super(inputNodes, outputNodes);
        FCRandom.randomizeWeightsBiases(this);
    }
}







const ly = new FCRandom(1,1);
console.log(ly.weights);




// class Convolutional extends FCTemplate {

// }




// const ZeroFullyConnectedLayer = function(inputNodes, outputNodes) {
//     this.inputs = new Array(inputNodes);
//     this.outputs = new Array(outputNodes);
//     this.biases = new Array(outputNodes).fill(0);
//     this.weights = new Array(inputNodes).fill(new Array(outputNodes).fill(0));
// }