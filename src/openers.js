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
// L O Z T LR ZR I 
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
		shapes.getShape(0),
		shapes.getShape(6),
		shapes.getShape(1),
		shapes.getShape(5),
		shapes.getShape(2),
		shapes.getShape(4),
		shapes.getShape(3));
		}
		this.isInit = 1;
		
		return;// this.shapeQueue;
	},
		
	getNextMino() {
		this.init();
		var mino = this.shapeQueue[this.idx];
		this.idx++;
		if(this.idx == 7) {
			this.idx = 0;
			this.isInit = 0;
		}
		console.log("mino: " + mino);

		return mino;
		//return this.shapeQueue[this.idx%=6];
	},
	// L O Z T LR ZR I 
	initHint(matrix) {
		if(!this.isHintInit || this.hintQueue == undefined) {
		this.hintQueue = new Array(
		shapes.getShape(0),
		shapes.getShape(6),
		shapes.getShape(1),
		shapes.getShape(5),
		shapes.getShape(2),
		shapes.getShape(4),
		shapes.getShape(3));
		
		//console.log("matrix: " + matrix);
		// L
		this.hintQueue[0].x = 0;
		this.hintQueue[0].y = 17;
		// I
		this.hintQueue[1].x = 3;
		this.hintQueue[1].y = 19;
		this.hintQueue[1].state = this.hintQueue[1].nextState(1);
		//this.hintQueue[1].matrix = 
		// O
		this.hintQueue[2].x = 8;
		this.hintQueue[2].y = 18;
		// S
		this.hintQueue[3].x = 4;
		this.hintQueue[3].y = 18;
		//this.hintQueue[3].states++;
		// Z
		this.hintQueue[4].x = 3;
		this.hintQueue[4].y = 17;
		this.hintQueue[5].x = 4;
		this.hintQueue[5].y = 4;
		this.hintQueue[6].x = 4;
		this.hintQueue[6].y = 4;
	
		
		}
		
		this.isHintInit = 1;
		
		return;// this.shapeQueue;
	},
	getNextHint(matrix) {
		this.initHint(matrix);
		console.log("hint " + this.hintIdx);
		var mino = this.hintQueue[this.hintIdx];
		this.hintIdx++;
		if(this.hintIdx == 7) {
			this.hintIdx = 0;
			this.isHintInit = 0;
		}
	console.log("hintmino: " + mino)
		return mino;
		//return this.shapeQueue[this.idx%=6];
	},
	reset() {
		this.shapeQueue = [];
		this.hintQueue = [];
		this.idx = 0;
		this.hintIdx = 0;
	}
};

function reset() {
	OpenerGenerator.reset();
}

function getNextMino() {
	var mino = OpenerGenerator.getNextMino();
	//console.log("Mino: " + mino);
	return mino;
}
function getNextHint(matrix) {
	var mino = OpenerGenerator.getNextHint(matrix);
	//console.log("Mino: " + mino);
	return mino;
}
module.exports.getNextMino = getNextMino;
module.exports.getNextHint = getNextHint;
module.exports.reset = reset;

