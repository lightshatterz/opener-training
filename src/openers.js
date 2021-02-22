var shapes = require("./shapes.js");

/*
function TKI3FonzieVariation() {
		
		this.shapeQueue = new Array(7);
		this.shapeQueue.push(new shapes.ShapeL());
		this.shapeQueue.push(new shapes.ShapeI());
		this.shapeQueue.push(new shapes.ShapeO());
		this.shapeQueue.push(new shapes.ShapeZR());
		this.shapeQueue.push(new shapes.ShapeZ());
		this.shapeQueue.push(new shapes.ShapeLR());
		this.shapeQueue.push(new shapes.ShapeT());
	//this.hintShapeQueue = [];

}

TKI3FonzieVariation.prototype = {
	getShapeQueue: function () {

		return this.shapeQueue;
	}

		getHintQueue: function() {
		this.hintShapeQueue.push(new shapes.ShapeL());
		this.hintShapeQueue.push(new shapes.ShapeI());
		this.hintShapeQueue.push(new shapes.ShapeO());
		this.hintShapeQueue.push(new shapes.ShapeZR());
		this.hintShapeQueue.push(new shapes.ShapeZ());
		this.hintShapeQueue.push(new shapes.ShapeLR());
		this.hintShapeQueue.push(new shapes.ShapeT());
		return this.hintShapeQueue;
		
	},
	init: function () {
		//todo: switch to queue builder
		//this.getShapeQueue();
		//this.getHintQueue();
	}



	//hintShape
}

*/

// L O Z T LR/J ZR/S I 
var OpenerGenerator = {
	shapeQueue: [],
	hintQueue: [],
	idx: 0,
	hintIdx: 0,
	isInit: 0,
	isHintInit: 0,
	init() {
		if(!this.isInit || this.shapeQueue == undefined) {
		this.shapeQueue = new Array(
		/*
		shapes.getShape(0),
		shapes.getShape(6),
		shapes.getShape(1),
		shapes.getShape(5),
		shapes.getShape(2),
		shapes.getShape(4),
		shapes.getShape(3));*/
		// O I L S J Z T O I L J T O T
		shapes.getShape(1),
		shapes.getShape(6),
		shapes.getShape(0),
		shapes.getShape(5),
		shapes.getShape(4),
		shapes.getShape(2),
		shapes.getShape(3),
		shapes.getShape(1),
		shapes.getShape(6),
		shapes.getShape(0),
		shapes.getShape(4),
		shapes.getShape(3),
		shapes.getShape(1),
		shapes.getShape(3));
		}
		this.isInit = 1;
		
		return;
	},
		
	getNextMino() {
		this.init();
		var mino = this.shapeQueue[this.idx];
		this.idx++;
		if(this.idx == this.shapeQueue.length) {
			this.idx = 0;
			this.isInit = 0;
		}

		return mino;
	},
	// L O Z T LR ZR I 
/*	initHint(matrix) {
		if(!this.isHintInit || this.hintQueue == undefined) {
		this.hintQueue = new Array(
		shapes.getShape(0),
		shapes.getShape(6),
		shapes.getShape(1),
		shapes.getShape(5),
		shapes.getShape(2),
		shapes.getShape(4),
		shapes.getShape(3));
		
		// L
		this.hintQueue[0].x = -1;
		this.hintQueue[0].y = 17;
		this.hintQueue[0].state = this.hintQueue[0].nextState(1);
		// I
		this.hintQueue[1].x = 3;
		this.hintQueue[1].y = 17;
		this.hintQueue[1].state = this.hintQueue[1].nextState(1);
		// O
		this.hintQueue[2].x = 6;
		this.hintQueue[2].y = 18;
		// S
		this.hintQueue[3].x = 5;
		this.hintQueue[3].y = 17;
		this.hintQueue[3].state = this.hintQueue[3].nextState(1);
		// Z
		this.hintQueue[4].x = 3;
		this.hintQueue[4].y = 17;
		// J
		this.hintQueue[5].x = 7;
		this.hintQueue[5].y = 16;
		
		// T
		this.hintQueue[6].x = 1;
		this.hintQueue[6].y = 17;
		this.hintQueue[6].state = this.hintQueue[6].nextState(1)
		this.hintQueue[6].state = this.hintQueue[6].nextState(1)
		
		}
		
		this.isHintInit = 1;
		
		return;
	},*/
	// L O Z T LR ZR I 
	initHint(matrix) {
		if(!this.isHintInit || this.hintQueue == undefined) {
		this.hintQueue = new Array(
		/*shapes.getShape(0),
		shapes.getShape(6),
		shapes.getShape(1),
		shapes.getShape(5),
		shapes.getShape(2),
		shapes.getShape(4),
		shapes.getShape(3)
		*/
		shapes.getShape(1),
		shapes.getShape(6),
		shapes.getShape(0),
		shapes.getShape(5),
		shapes.getShape(4),
		shapes.getShape(2),
		shapes.getShape(3),
		shapes.getShape(1),
		shapes.getShape(6),
		shapes.getShape(0),
		shapes.getShape(4),
		shapes.getShape(3),
		shapes.getShape(1),
		shapes.getShape(3));
		
		// O I L S J Z T O I L J T O T
		
		// O
		this.hintQueue[0].x = -2;
		this.hintQueue[0].y = 18;
		
		// I
		this.hintQueue[1].x = 6;
		this.hintQueue[1].y = 16;
		//this.hintQueue[1].state = this.hintQueue[1].nextState(1);
		// L
		this.hintQueue[2].x = 6;
		this.hintQueue[2].y = 17;
		this.hintQueue[2].state = this.hintQueue[2].nextState(1);
		// S
		this.hintQueue[3].x = 7;
		this.hintQueue[3].y = 17;
		this.hintQueue[3].state = this.hintQueue[3].nextState(1);
		// J
		this.hintQueue[4].x = 4;
		this.hintQueue[4].y = 17;
		this.hintQueue[4].state = this.hintQueue[4].nextState(-1);
		
		// Z
		this.hintQueue[5].x = 3;
		this.hintQueue[5].y = 17;
		this.hintQueue[5].state = this.hintQueue[5].nextState(2);
		
		// T
		this.hintQueue[6].x = 3;
		this.hintQueue[6].y = 15;
		
		// O
		this.hintQueue[7].x = 5;
		this.hintQueue[7].y = 15;
		
		// I
		this.hintQueue[8].x = 9;
		this.hintQueue[8].y = 14;
		//this.hintQueue[8].state = this.hintQueue[8].nextState(1);
		
		// L
		this.hintQueue[9].x = 2;
		this.hintQueue[9].y = 13;
		this.hintQueue[9].state = this.hintQueue[9].nextState(-1);
		
		// J
		this.hintQueue[10].x = -1;
		this.hintQueue[10].y = 15;
		this.hintQueue[10].state = this.hintQueue[10].nextState(1);
		
		// T
		this.hintQueue[11].x = 1;
		this.hintQueue[11].y = 16;
		this.hintQueue[11].state = this.hintQueue[11].nextState(2);
				
		// O
		this.hintQueue[12].x = 3;
		this.hintQueue[12].y = 16;
		this.hintQueue[12].state = this.hintQueue[12].nextState(1);
		
		// T
		this.hintQueue[13].x = 1;
		this.hintQueue[13].y = 17;
		this.hintQueue[13].state = this.hintQueue[13].nextState(-1);
		}
		
		this.isHintInit = 1;
		
		return;
	},
	getNextHint(matrix) {
		this.initHint(matrix);
		var mino = this.hintQueue[this.hintIdx];
		this.hintIdx++;
		if(this.hintIdx == this.hintQueue.length) {
			this.hintIdx = 0;
			this.isHintInit = 0;
		}
		return mino;
	},
	reset() {
		this.shapeQueue = [];
		this.hintQueue = [];
		this.idx = 0;
		this.hintIdx = 0;
		this.isInit = 0;
		this.isHintInit = 0;
	}
};

function reset() {
	OpenerGenerator.reset();
}

function getNextMino() {
	var mino = OpenerGenerator.getNextMino();
	return mino;
}
function getNextHint(matrix) {
	var mino = OpenerGenerator.getNextHint(matrix);
	return mino;
}
module.exports.getNextMino = getNextMino;
module.exports.getNextHint = getNextHint;
module.exports.reset = reset;

