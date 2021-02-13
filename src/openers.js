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
	hindIdx: 0,
	isInit: 0,
	isHintInit: 0,
	init() {
		if(!this.isInit || this.shapeQueue == undefined) {
		this.shapeQueue = new Array(shapes.getShape(0),
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
		if(this.idx == 6) {
			this.idx = 0;
			this.isInit = 0;
		}

		return mino;
		//return this.shapeQueue[this.idx%=6];
	},
	initHint() {
		if(!this.isHintInit || this.hintQueue == undefined) {
		this.hintQueue = new Array(shapes.getShape(0),
		shapes.getShape(6),
		shapes.getShape(1),
		shapes.getShape(5),
		shapes.getShape(2),
		shapes.getShape(4),
		shapes.getShape(3));
		}
		this.isHintInit = 1;
		
		return;// this.shapeQueue;
	},
	getNextHint() {
		this.initHint();
		var mino = this.hintQueue[this.hintIdx];
		this.hintIdx++;
		if(this.hintIdx == 6) {
			this.hintIdx = 0;
			this.isHintInit = 0;
		}

		return mino;
		//return this.shapeQueue[this.idx%=6];
	}
};

function getNextMino() {
	var mino = OpenerGenerator.getNextMino();
	//console.log("Mino: " + mino);
	return mino;
}
function getNextHint() {
	var mino = OpenerGenerator.getNextMino();
	//console.log("Mino: " + mino);
	return mino;
}
module.exports.getNextMino = getNextMino;


