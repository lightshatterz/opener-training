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
					// DTCannon -- O I L S J Z T O I L J T O T
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
				// O - 1, I - 6, L - 0, S - 5, J - 4, Z - 2, T - 3
					this.shapeQueue = new Array(
					shapes.getShape(4),
					shapes.getShape(5),
					shapes.getShape(6),
					shapes.getShape(0),
					shapes.getShape(2),
					shapes.getShape(1),
					shapes.getShape(5),
					shapes.getShape(3),
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
					this.hintQueue[i].x = hintDataList[i*3];
					this.hintQueue[i].y = hintDataList[i*3 + 1];
					this.hintQueue[i].state = this.hintQueue[i].nextState(hintDataList[i*3 + 2]);
				}

			break;
			case 2:
				// DT Cannon -- O I L S J Z T O I L J T O T
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
					this.hintQueue[i].x = hintDataList[i*3];
					this.hintQueue[i].y = hintDataList[i*3 + 1];
					this.hintQueue[i].state = this.hintQueue[i].nextState(hintDataList[i*3 + 2]);
				}
				/*
				// O
				this.hintQueue[0].x = -2;
				this.hintQueue[0].y = 18;
				// I
				this.hintQueue[1].x = 6;
				this.hintQueue[1].y = 16;
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
				this.hintQueue[5].state = this.hintQueue[5].nextState(3);
				// T
				this.hintQueue[6].x = 3;
				this.hintQueue[6].y = 15;
				// O
				this.hintQueue[7].x = 5;
				this.hintQueue[7].y = 15;
				// I
				this.hintQueue[8].x = 9;
				this.hintQueue[8].y = 14;
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
				*/
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
				shapes.getShape(6),
				shapes.getShape(0),
				shapes.getShape(4),
				shapes.getShape(3));
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


