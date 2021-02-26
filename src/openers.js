var shapes = require("./shapes.js");
// import * as shapes from './shapes.js';

// https://harddrop.com/wiki/Opener
// https://four.lol/
var OpenerGenerator = {
	shapeQueue: [],
	hintQueue: [],
	idx: 0,
	hintIdx: 0,
	isInit: 0,
	isHintInit: 0,
	
	// O - 1, I - 6, L - 0, S - 5, J - 4, Z - 2, T - 3
	// Current Tetriminos
	init(opener) {
		if(!this.isInit || this.shapeQueue == undefined) {
			switch(opener) {
				case 0:
				case 1:
					// Fonzie Variation
					this.shapeQueue = new Array(
					shapes.getShape(0),
					shapes.getShape(6),
					shapes.getShape(1),
					shapes.getShape(5),
					shapes.getShape(2),
					shapes.getShape(4),
					shapes.getShape(3));
				break;
				case 2:
					// DTCannon
					this.shapeQueue = new Array(
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
				break;
				case 3:
					this.shapeQueue = new Array(
					shapes.getShape(4),
					shapes.getShape(5),
					shapes.getShape(6),
					shapes.getShape(0),
					shapes.getShape(2),
					shapes.getShape(1),
					shapes.getShape(5),
					shapes.getShape(3),
					shapes.getShape(1),
					shapes.getShape(2),
					shapes.getShape(6),
					shapes.getShape(0),
					shapes.getShape(4),
					shapes.getShape(3));
				break;
			default:
				return;
			}
		}
		this.isInit = 1;
		
		return;
	},
		
	getNextMino(opener) {
		this.init(opener);
		var mino = this.shapeQueue[this.idx];
		this.idx++;
		if(this.idx == this.shapeQueue.length) {
			this.idx = 0;
			this.isInit = 0;
		}

		return mino;
	},
	
	// Hint Tetrimions
	initHint(opener) {
		if(!this.isHintInit || this.hintQueue == undefined) {
			
			switch(opener) {
			case 0:
			case 1:
				// Fonzie Variation
				this.hintQueue = new Array(
					shapes.getShape(0),
					shapes.getShape(6),
					shapes.getShape(1),
					shapes.getShape(5),
					shapes.getShape(2),
					shapes.getShape(4),
					shapes.getShape(3));
				
				// position x, position y, orientation, position x,...
				var hintDataList = [-1,17,1,  3,17,1,  6,18,0,  5,17,1,  3,17,0,  7,16,0,  1,17,2];
				
				for(var i = 0; i < this.hintQueue.length; i++) {
					this.hintQueue[i].x = hintDataList[i * 3];
					this.hintQueue[i].y = hintDataList[i * 3 + 1];
					this.hintQueue[i].state = this.hintQueue[i].nextState(hintDataList[i * 3 + 2]);
				}

			break;
			case 2:
				// DT Cannon
				this.hintQueue = new Array(
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
				
				// position x, position y, orientation, position x,...
				var hintDataList = [-2,18,0,  6,16,0,  6,17,1,  7,17,1,  4,17,-1,  3,17,3,  3,15,0, 5,15,0,  9,14,0,  2,13,-1,  -1,15,1,  1,16,2,  3,16,1,  1,17,-1];
				
				for(var i = 0; i < this.hintQueue.length; i++) {
					this.hintQueue[i].x = hintDataList[i * 3];
					this.hintQueue[i].y = hintDataList[i * 3 + 1];
					this.hintQueue[i].state = this.hintQueue[i].nextState(hintDataList[i * 3 + 2]);
				}
			break;
			case 3:
				//MKO Stacking // O - 1, I - 6, L - 0, S - 5, J - 4, Z - 2, T - 3
				this.hintQueue = new Array(
					shapes.getShape(4),
					shapes.getShape(5),
					shapes.getShape(6),
					shapes.getShape(0),
					shapes.getShape(2),
					shapes.getShape(1),
					shapes.getShape(5),
					shapes.getShape(3),
					shapes.getShape(1),
					shapes.getShape(2),
					shapes.getShape(6),
					shapes.getShape(0),
					shapes.getShape(4),
					shapes.getShape(3));
					
				// position x, position y, orientation, position x,...
				var hintDataList = [0,18,0,  0,16,-1,  9,16,0,  4,18,0,  4,16,1,  5,18,0,  1,15,-1,  2,17,2,  5,18,0,  3,17,1,  6,15,1,  0,15,2,  0,14,0,  2,16,2];
				
				for(var i = 0; i < this.hintQueue.length; i++) {
					this.hintQueue[i].x = hintDataList[i * 3];
					this.hintQueue[i].y = hintDataList[i * 3 + 1];
					this.hintQueue[i].state = this.hintQueue[i].nextState(hintDataList[i * 3 + 2]);
				}
			break;
			default:
					return;
			}
		
		}
		
		this.isHintInit = 1;
		
		return;
	},
	// End initHint

	getNextHint(opener) {
		this.initHint(opener);
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
	},
	getLength() {
		return this.hintQueue.length;
	}
};

function reset() {
	OpenerGenerator.reset();
}

function getNextMino(opener) {
	var mino = OpenerGenerator.getNextMino(opener);
	return mino;
}
function getNextHint(opener) {
	var mino = OpenerGenerator.getNextHint(opener);
	return mino;
}
function getLength() {
	return OpenerGenerator.getLength();
}
module.exports.getNextMino = getNextMino;
module.exports.getNextHint = getNextHint;
module.exports.getLength = getLength;
module.exports.reset = reset;
// export getNextMino;
// export getNextHint;
// export getLength;
// export reset;


