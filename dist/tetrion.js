(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

var utils = require('./utils.js');
var consts = require('./consts.js');


var lineColor =  consts.GRID_LINE_COLOR;

var boxBorderColor = consts.BOX_BORDER_COLOR;

//Draw a single line in canvas context
var drawLine = function(ctx,p1,p2,color){
	  	    ctx.beginPath();
			ctx.moveTo(p1.x,p1.y);
			ctx.lineTo(p2.x,p2.y);
			
			ctx.lineWidth=1;
			ctx.strokeStyle= color;
			
			ctx.stroke();
			ctx.closePath();
};


//Draw game grids
var drawGrids = function(el,gridSize,colCount,rowCount,color1,color2){

	  

	  var ctx = el.getContext('2d');
	  var width = el.width;
	  var height = el.height;

	  ctx.rect(0, 0, width, height);

      var grd = ctx.createLinearGradient(0, 0, 0, height);
      grd.addColorStop(0, color1);   
      grd.addColorStop(1, color2);
      ctx.fillStyle = grd;
      ctx.fill();
      

	  for (var i = 1; i < colCount; i++) {
	  		var x = gridSize*i+0.5;
			drawLine(ctx,{x:x,y:0},{x:x,y:height},lineColor);
	  };
	  for (var i = 1; i < rowCount; i++) {
			var y = gridSize*i+0.5;
			drawLine(ctx,{x:0,y:y},{x:width,y:y},lineColor);
	  };
};

//Draw box of shape (shape is the composition of boxes)
var drawBox = function(ctx,color,x,y,gridSize){
			if (y<0){
				return;
			}

			ctx.beginPath();
			ctx.rect(x,y,gridSize,gridSize);
			ctx.fillStyle = color;
			ctx.fill();
			ctx.strokeStyle= boxBorderColor;
			ctx.lineWidth=1;
			ctx.stroke();
			ctx.closePath();
}

/*
	Canvas main object, use to draw all games data.
*/
var tetrisCanvas = {

	init:function(scene,preview,hold){
		this.scene = scene;
		this.preview = preview;
		this.hold = hold;
		this.sceneContext = scene.getContext('2d');
		this.previewContext = preview.getContext('2d');
		this.holdContext = hold.getContext('2d');
		this.gridSize = scene.width / consts.COLUMN_COUNT;

		this.previewGridSize = preview.width / 4;//consts.PREVIEW_COUNT;
		this.holdGridSize = preview.width / 4;//consts.PREVIEW_COUNT;
		
		this.drawScene();
		
	},

	//Clear game canvas
	clearScene:function(){
		this.sceneContext.clearRect(0, 0, this.scene.width, this.scene.height);
	},
	//Clear preview canvas
	clearPreview:function(){
		this.previewContext.clearRect(0,0,this.preview.width,this.preview.height);
	},	//Clear preview canvas
	clearHold:function(){
		this.holdContext.clearRect(0,0,this.hold.width,this.hold.height);
	},
	//Draw game scene, grids
	drawScene:function(){
		this.clearScene();
		drawGrids(this.scene,this.gridSize,
			consts.COLUMN_COUNT,consts.ROW_COUNT,
			consts.SCENE_BG_START,consts.SCENE_BG_END);
	},
	//Draw game data
	drawMatrix:function(matrix){
		for(var i = 0;i<matrix.length;i++){
			var row = matrix[i];
			for(var j = 0;j<row.length;j++){
				if (row[j]!==0){
					drawBox(this.sceneContext,row[j],j*this.gridSize,i*this.gridSize,this.gridSize);
				}
			}
		}	
	},
	//Draw preview data
	drawPreview:function(){
		drawGrids(this.preview,this.previewGridSize,
			consts.PREVIEW_COUNT,consts.PREVIEW_COUNT,
			consts.PREVIEW_BG,consts.PREVIEW_BG);
	},
	//Draw hold data
	drawHold:function(){
		drawGrids(this.hold,this.holdGridSize,
			consts.PREVIEW_COUNT,consts.PREVIEW_COUNT,
			consts.PREVIEW_BG,consts.PREVIEW_BG);
	},
	//Draw acitve shape in game
	drawShape:function(shape){
		if (!shape){
			return;
		}
		var matrix = shape.matrix();
		var gsize = this.gridSize;
		for(var i = 0;i<matrix.length;i++){
			for(var j = 0;j<matrix[i].length;j++){
				var value = matrix[i][j];
				if (value === 1){
					var x = gsize *(shape.x + j);
					var y = gsize *(shape.y + i);
					drawBox(this.sceneContext,shape.color,x,y,gsize);
				}
			}
		}
	},
	drawGhostShape:function(shape, bottomY){
		if (!shape){
			return;
		}
		var matrix = shape.matrix();
		var gsize = this.gridSize;
		for(var i = 0;i<matrix.length;i++){
			for(var j = 0;j<matrix[i].length;j++){
				var value = matrix[i][j];
				if (value === 1){
					var x = gsize *(shape.x + j);
					var y = gsize *(bottomY + i); //(shape.y + i);
					drawBox(this.sceneContext,"rgba(255, 255, 255, 0.2)",x,y,gsize);
				}
			}
		}
	},
	hexToRgb: function(hex) {
		var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result ? {
		r: parseInt(result[1], 16),
		g: parseInt(result[2], 16),
		b: parseInt(result[3], 16)
		} : null;
	},
	drawHintShape:function(shape){
		if (!shape){
			return;
		}
		var colorRGB = this.hexToRgb(shape.color);
		var color = "rgba(" + colorRGB.r + "," + colorRGB.g + "," + colorRGB.b + "," + "0.4)";
		
		var matrix = shape.matrix();
		var gsize = this.gridSize;
		for(var i = 0;i<matrix.length;i++){
			for(var j = 0;j<matrix[i].length;j++){
				var value = matrix[i][j];
				if (value === 1){
					var x = gsize *(shape.x + j);
					var y = gsize *(shape.y + i);
					drawBox(this.sceneContext, color, x, y, gsize);
				}
			}
		}
	},
	//Draw preview shape in preview canvas
	drawPreviewShape:function(shapeQueue){
		if (!shapeQueue){
			return;
		}
		this.clearPreview();

		shapeQueue.forEach( (shape, index) => {
			if(shape != undefined)
			{
				var matrix = shape.matrix();
				var gsize = this.previewGridSize;
				var startX = (this.preview.width - gsize*shape.getColumnCount()) / 2;
				var startY = ((this.preview.height - gsize*shape.getRowCount()) / 2 / 4)*(index*2+1);
				for(var i = 0;i<matrix.length;i++){
					for(var j = 0;j<matrix[i].length;j++){
						var value = matrix[i][j];
						if (value === 1){
							var x = startX + gsize * j;
							var y = startY + gsize * i;
							drawBox(this.previewContext,shape.color,x,y,gsize);
						}
					}
				}
			}
		});
		
	},
			//Draw preview shape in preview canvas
	drawHoldShape:function(holdQueue){
		if (!holdQueue){
			return;
		}
		this.clearHold();
		q = holdQueue.reverse();
		q.forEach( (shape, index) => {
			if(shape != undefined)
			{
				var matrix = shape.matrix();
				var gsize = this.holdGridSize;
				var startX = (this.hold.width - gsize*shape.getColumnCount()) / 2;
				var startY = ((this.hold.height - gsize*shape.getRowCount()) / 2 / 4)*(index*2+1);
				for(var i = 0;i<matrix.length;i++){
					for(var j = 0;j<matrix[i].length;j++){
						var value = matrix[i][j];
						if (value === 1){
							var x = startX + gsize * j;
							var y = startY + gsize * i;
							drawBox(this.holdContext,shape.color,x,y,gsize);
						}
					}
				}
			}
		});
		holdQueue.reverse();
		
	}
	


};



module.exports = tetrisCanvas;
},{"./consts.js":2,"./utils.js":8}],2:[function(require,module,exports){

//colors for shapes  L, O, Z, T, J, S, I
var colors = ['#ef7a21','#f7d308','#ef2029','#ad4d9c','#5a658f','#42b642','#31c7ef'];
//['#ef7a21','#f7d308','#42b642','#ef2029','#ad4d9c','#5a658f','#31c7ef'];
//['#00af9d','#ffb652','#cd66cc','#66bc29','#0096db','#3a7dda','#ffe100'];

//sidebar width
var sideWidth = 120;


//scene column count
var columnCount = 10;

//scene row count;
var rowCount = 20;

//scene piece entry count;
var entryRowCount = 3;

//previewCount
var previewCount = 6;

//scene gradient start color 
var sceneBgStart = "#000000"
//'#8e9ba6';

//scene gradient end color 
var sceneBgEnd = '#000000'
//'#5c6975';

//preview background color
var previewBg = '#2f2f2f';

//grid line color
var gridLineColor = 'rgba(255,255,255,0.2)';

//box border color
var boxBorderColor = 'rgba(255,255,255,0.5)';


// Game speed
var defaultInterval = 600;


// Level update interval 
var levelInterval = 120 * 1000; 



var exports = module.exports = {};

exports.COLORS =  colors;

exports.SIDE_WIDTH = sideWidth;

exports.ROW_COUNT = rowCount;

exports.COLUMN_COUNT = columnCount;

exports.SCENE_BG_START = sceneBgStart;

exports.SCENE_BG_END = sceneBgEnd;

exports.PREVIEW_BG = previewBg;

exports.PREVIEW_COUNT = previewCount;

exports.GRID_LINE_COLOR = gridLineColor;

exports.BOX_BORDER_COLOR = boxBorderColor;

exports.DEFAULT_INTERVAL = defaultInterval;

exports.LEVEL_INTERVAL = levelInterval;

},{}],3:[function(require,module,exports){

var gamepadAPI = {
    controller: {},
    turbo: false,
    connect: function(evt) {
        gamepadAPI.controller = evt.gamepad;
        gamepadAPI.turbo = true;
        console.log('Gamepad connected.');
    },
    disconnect: function(evt) {
        gamepadAPI.turbo = false;
        delete gamepadAPI.controller;
        console.log('Gamepad disconnected.');
    },
    update: function() {
		var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
		if(!isFirefox) {
			for(var i = 0; i < 4; i++)
				if((gp = window.navigator.getGamepads()[i]) != undefined)				// dumb gamepad update. fix.
					gamepadAPI.controller = gp;
		}
		
        gamepadAPI.buttonsCache = [];
        for (var k = 0; k < gamepadAPI.buttonsStatus.length; k++) {
            gamepadAPI.buttonsCache[k] = gamepadAPI.buttonsStatus[k];
        }
        gamepadAPI.buttonsStatus = [];
        var c = gamepadAPI.controller || {};
        var pressed = [];
        if (c.buttons) {
            for (var b = 0, t = c.buttons.length; b < t; b++) {
                if (c.buttons[b].pressed) {
                    pressed.push(gamepadAPI.buttons[b]);
                }
            }
        }
        var axes = [];
        if (c.axes) {
            for (var a = 0, x = c.axes.length; a < x; a++) {
                axes.push(c.axes[a].toFixed(2));
            }
        }
        gamepadAPI.axesStatus = axes;
        gamepadAPI.buttonsStatus = pressed;
        return pressed;
    },	

    buttonPressed: function(button, hold) {
        var newPress = false;
        for (var i = 0, s = gamepadAPI.buttonsStatus.length; i < s; i++) {
			
            if (gamepadAPI.buttonsStatus[i] == button) {
                newPress = true;
                if (!hold) {
                    for (var j = 0, p = gamepadAPI.buttonsCache.length; j < p; j++) {
                        if (gamepadAPI.buttonsCache[j] == button) {
                            newPress = false;
                        }
                    }
                }
            }
        }
        return newPress;
    },

    buttons: [ // XBox360 layout 
   		'A', 'B', 'X', 'Y',
        'LB', 'RB', 'Axis-Left', 'DPad-Right',
        'Back', 'Start', 'Power', 'Axis-Right','DPad-Up', 'DPad-Down' ,  'DPad-Left','DPad-Right'
		],
   /*
		'DPad-Up', 'DPad-Down', 'DPad-Left', 'DPad-Right',
        'Start', 'Back', 'Axis-Left', 'Axis-Right',
        'LB', 'RB', 'Power', 'A', 'B', 'X', 'Y',
    ],*/
	
    buttonsCache: [],
    buttonsStatus: [],
    axesStatus: []
};
window.addEventListener("gamepadconnected", gamepadAPI.connect);
window.addEventListener("gamepaddisconnected", gamepadAPI.disconnect);

module.exports = gamepadAPI;
},{}],4:[function(require,module,exports){

var gamepad = require('./gamepad.js');

var UserInputs = {
    init() {
        document.addEventListener('keydown', this.keyDown.bind(this));
        document.addEventListener('keyup', this.keyUp.bind(this));
    },

	updateGamepad() {
		this.gpButtons = gamepad.update();
	},

	incDeciframes() {
		this.keyboardButtonsDeciframes++;
		this.keyboardDirectionArrowsDeciframes++;
		this.gamepadButtonsDeciFrames++;
		this.gamepadDirectionPadDeciFrames++;
	},
	
	processGamepadInput() {
		this.gamepadButtonsDown("RB");
		this.gamepadButtonsDown("LB");
		this.gamepadButtonsDown("A");
		this.gamepadButtonsDown("B");
		this.gamepadButtonsDown("DPad-Up");
		//this.gamepadButtonsDown("X");
		//this.gamepadButtonsDown("Y");
		

		
		return;
	},
	
	processGamepadDPad() 
	{
		this.gamepadDPadDown("DPad-Left");
		this.gamepadDPadDown("DPad-Right");
		this.gamepadDPadDown("DPad-Down");
		
		return;
	},
	
	
	//  X, Y, A, B , RB, LB Buttons
	gamepadButtonsDown(finds) {
		var deciDAS = 50.0;
		var deciARR = 10.0;
		var isContained = this.gpButtons.includes(finds);
		var isPrevContained = this.prevGpButtons.includes(finds);

		if(isPrevContained != isContained ) {
			this.isGamepadButtonDown = false;
			// Do once
			if(isContained)
				this.gamepadQueue.push(finds);
		}
		var gamepadDASFrames = this.gamepadButtonsDeciFrames / 1.0;
		
		if (!this.isGamepadButtonDown) {

				if (gamepadDASFrames >= deciDAS) {
					this.gamepadButtonsDeciFrames = 0;
					this.isGamepadButtonDown = true;
				}
				
		} else {
			if (gamepadDASFrames >= deciARR && isContained) {
				this.gamepadQueue.push(finds);
				this.gamepadButtonsDeciFrames = 0;
			}
		}
			
	},
	
	// Direction Pad
	gamepadDPadDown(finds) {
		var DAS = 7.0;
		var ARR = 3.0;
		var isContained = this.gpButtons.includes(finds);
		var isPrevContained = this.prevGpButtons.includes(finds);
		//console.log("but: " + this.gpButtons +  " prev but:" + this.prevGpButtons);
		if(isPrevContained != isContained ) {
			this.isGamepadDown = false;
			// Do once
			//if(isContained)
			//	this.gamepadQueue.push(finds);
		}
		var gamepadDirectionDasFrames = this.gamepadDirectionPadDeciFrames / 1.0;
			if (!this.isGamepadDown) {
					if (gamepadDirectionDasFrames >= DAS) {
						this.gamepadDirectionPadDeciFrames = 0;
						this.isGamepadDown = true;
						//console.log(this.isGamepadDown + " " + this.gam);
					}
			} 
			else 
		{
				if (gamepadDirectionDasFrames >= ARR && isContained) {
					this.gamepadQueue.push(finds);
					this.gamepadDirectionPadDeciFrames = 0;
				}
			}
		
		
		return;
	},
	processKeys() {
		this.processKeyDown(32);  // Space
		this.processKeyDown(88);  // X
		this.processKeyDown(90);  // Z
		this.processKeyDown(16);  // shift
		this.processKeyDown(17);  // ctrl
	},

	// keyboard keys z,x,space
	processKeyDown(key)
	{
		var deciDAS = 10;
		var deciARR = 15
		

		if(this.prevKeyboardKeys[key] != this.keyboardKeys[key]) {
			this.isKeyboardKeyDown = false;
			if(this.keyboardKeys[key] == true)
				this.inputqueue.push(key);
		}
		
		var keyboardDASFrames = this.keyboardButtonsDeciframes;

		if (!this.isKeyboardKeyDown) {
				if (keyboardDASFrames >= deciDAS) {
					this.keyboardButtonsDeciframes = 0;
					this.isKeyboardKeyDown = true;
				}
		} else {
			if (keyboardDASFrames >= deciARR && this.keyboardKeys[key] == true) {
				this.inputqueue.push(key);
				this.keyboardButtonsDeciframes = 0;
			}
		}
		
		
		
	},
	
	processKeyShift() {
		this.processKeyboardArrowKeys(39);  // right
		this.processKeyboardArrowKeys(37);	// left
		this.processKeyboardArrowKeys(40);  // down
	},
	// Direction arrows
    processKeyboardArrowKeys(key) {		
		var DAS = 13;
		var ARR = 3.0;

	/*  do once?
		if(this.prevKeyboardKeys[key] != this.keyboardKeys[key]) {
			this.isDirectionArrowDown = false;
			if(this.keyboardKeys[key] == true)
				this.inputqueue.push(key);
		}
		*/
		//console.log(key + " " + this.held
		var keyboardDASFrames = this.keyboardDirectionArrowsDeciframes / 1.0; // why isnt this 10?
		//console.log(keyboardDASFrames + " " + this.held);
            if (!this.isDirectionArrowDown) {
				
                if (keyboardDASFrames >= DAS) {
                    this.keyboardDirectionArrowsDeciframes = 0;
                    this.isDirectionArrowDown = true;
                }
            } else {
                if (keyboardDASFrames >= ARR && this.keyboardKeys[key] == true) {
                    this.inputqueue.push(key);
                    this.keyboardDirectionArrowsDeciframes = 0;
                }
            }
        //}
    },
    keyDown(event) {
		this.keyboardKeys[event.keyCode] = true;
    },
    keyUp(event) {
		this.isKeyDown = false;
		this.keyboardKeys[event.keyCode] = false;
    },
	gamepadButtonClear() {
		gpButtons = [];
		isGamepadDown = false;
		isGamepadButtonDown = false;
		gamepadQueue = [];
	},
	saveButtons() {
	this.prevGpButtons = this.gpButtons;
	},
	saveKeyboardKeys() {
		this.prevKeyboardKeys = {...this.keyboardKeys};
	},
	// button states
    isDirectionArrowDown: false,
	isKeyboardKeyDown: false,
	isGamepadDown: false,
	isGamepadButtonDown: false,
	
	// das frame counters 
	keyboardButtonsDeciframes: 0,				// DAS controlled frames/10 for non-shifted keys
	keyboardDirectionArrowsDeciframes: 0, 		// DAS controlled frames/10 for mino shifting keys
	gamepadButtonsDeciFrames: 0,				// DAS controlled frames/10 for non-shifted keys
	gamepadDirectionPadDeciFrames: 0,			// DAS controlled frames/10 for mino shifting keys
	
	// buttons state contatiners
	gpButtons: [],
	prevGpButtons:[],
	keyboardKeys: [],
	prevKeyboardKeys: [],
    
	// button pressed containers
	inputqueue: [],
	gamepadQueue: []
};

module.exports = UserInputs;
},{"./gamepad.js":3}],5:[function(require,module,exports){
var utils = require('./utils.js');
var consts = require('./consts.js');
var shapes = require('./shapes.js');
var views = require('./views.js');
var canvas = require('./canvas.js');
var inputs = require('./input.js');
var openers = require('./openers.js');


/**
	Init game matrix
*/
var initMatrix = function(rowCount, columnCount) {
    var result = [];
    for (var i = 0; i < rowCount; i++) {
        var row = [];
        result.push(row);
        for (var j = 0; j < columnCount; j++) {
            row.push(0);
        }
    }
	
    return result;
};

/**
  Clear game matrix
*/
var clearMatrix = function(matrix) {
    for (var i = 0; i < matrix.length; i++) {
        for (var j = 0; j < matrix[i].length; j++) {
            matrix[i][j] = 0;
        }
    }
};


/**
	Check all full rows in game matrix
	return rows number array. eg: [18,19];
*/
var checkFullRows = function(matrix) {
    var rowNumbers = [];
    for (var i = 0; i < matrix.length; i++) {
        var row = matrix[i];
        var full = true;
        for (var j = 0; j < row.length; j++) {
            full = full && row[j] !== 0;
        }
        if (full) {
            rowNumbers.push(i);
        }
    }

    return rowNumbers;
};

/**
	Remove one row from game matrix. 
	copy each previous row data to  next row  which row number less than row;
*/
var removeOneRow = function(matrix, row) {
    var colCount = matrix[0].length;
    for (var i = row; i >= 0; i--) {
        for (var j = 0; j < colCount; j++) {
            if (i > 0) {
                matrix[i][j] = matrix[i - 1][j];
            } else {
                matrix[i][j] = 0;
            }
        }
    }
};
/**
	Remove rows from game matrix by row numbers.
*/
var removeRows = function(matrix, rows) {
    for (var i in rows) {
        removeOneRow(matrix, rows[i]);
    }
};

/**
	Check game data to determin wether the  game is over
*/
var checkGameOver = function(matrix) {
    var firstRow = matrix[0];
    for (var i = 0; i < firstRow.length; i++) {
        if (firstRow[i] !== 0) {
            return true;
        };
    }
    return false;
};


/**
	Calculate  the extra rewards add to the score
*/
var calcRewards = function(rows) {
    if (rows && rows.length > 1) {
        return Math.pow(2, rows.length - 1) * 100;
    }
    return 0;
};

/**
	Calculate game score
*/
var calcScore = function(rows) {
    if (rows && rows.length) {
        return rows.length * 100;
    }
    return 0;
};

/**
	Calculate time interval by level, the higher the level,the faster shape moves
*/
var calcIntervalByLevel = function(level) {
    return consts.DEFAULT_INTERVAL - (level - 1) * 60;
};


// Default max scene size
var defaults = {
    maxHeight: 700,
    maxWidth: 600
};

/**
	Tetris main object definition
*/
function Tetris(id) {
    this.id = id;
    this.init();
}

Tetris.prototype = {

    init: function(options) {

        var cfg = this.config = utils.extend(options, defaults);
        this.interval = consts.DEFAULT_INTERVAL;


        views.init(this.id, cfg.maxWidth, cfg.maxHeight);
        canvas.init(views.scene, views.preview, views.hold);
		inputs.init();
		//openers.init();
		
        this.matrix = initMatrix(consts.ROW_COUNT, consts.COLUMN_COUNT);
        this.reset();
		

        this._initEvents();
        this._fireShape();

    },
    //Reset game
    reset: function() {
        this.running = false;
        this.isGameOver = false;
        this.level = 1;
        this.score = 0;
		this.lines = 0;
		this.currentMinoInx = 0;
        this.startTime = new Date().getTime();
        this.currentTime = this.startTime;
        this.prevTime = this.startTime;
        this.levelTime = this.startTime;
		this.shapeQueue = [];
		this.hintQueue = [];
		this.holdQueue = [];
		this.canPullFromHoldQueue = false;
        clearMatrix(this.matrix);
        views.setLevel(this.level);
        views.setScore(this.score);
        views.setGameOver(this.isGameOver);
		openers.reset();
        this._draw();
    },
    //Start game
    start: function() {
        this.running = true;
        window.requestAnimationFrame(utils.proxy(this._refresh, this));
    },
    //Pause game
    pause: function() {
        this.running = false;
        this.currentTime = new Date().getTime();
        this.prevTime = this.currentTime;
    },
	pushHoldStack: function()
	{
		if(this.holdQueue.length < 4) {
			this.holdQueue.push(this.shape);
			this.shape = this.shapeQueue.shift();
			this.canPullFromHoldQueue = false;
			this.shape.resetOrigin();
			//canvas.drawHoldShape(this.holdQueue);
			this._draw(); // update?
		}
	},
	popHoldStack: function()
	{
		if(this.holdQueue.length >= 1 && this.canPullFromHoldQueue)
		{
			this.canPullFromHoldQueue = false;
			this.shapeQueue.unshift(this.shape);
			this.shape = this.holdQueue.pop();
			this.shape.resetOrigin();
			//canvas.drawHoldShape(this.holdQueue);
			this._draw();
		}
	},
    //Game over
    gamveOver: function() {

    },
	  
    // All key event handlers
    _keydownHandler: function(e) {
    },
    // Restart game
    _restartHandler: function() {
        this.reset();
        this.start();
    },
    // Bind game events
    _initEvents: function() {
        window.addEventListener('keydown', utils.proxy(this._keydownHandler, this), false);
        views.btnRestart.addEventListener('click', utils.proxy(this._restartHandler, this), false);
    },

    // Fire a new random shape
    _fireShape: function() {
		//this.shape = this.shapeQueue.shift() || shapes.randomShape();

		while(this.shapeQueue.length <= 4)
		{
			this.preparedShape = openers.getNextMino();
			this.shapeQueue.push(this.preparedShape);
		}
		while(this.hintQueue.length <= 4)
		{
			this.preparedShape = openers.getNextHint(this.matrix);
			this.hintQueue.push(this.preparedShape);
		}
		
		this.hintMino = this.hintQueue.shift();
		this.shape = this.shapeQueue.shift();// shapes.randomShape();
       
		this._draw();
        
    },

    // Draw game data
    _draw: function() {
        canvas.drawScene();
        canvas.drawShape(this.shape);
		canvas.drawHoldShape(this.holdQueue);
		canvas.drawPreviewShape(this.shapeQueue);
		canvas.drawHintShape(this.hintMino);
		if(this.shape != undefined) {


		let clone = Object.assign(Object.create(Object.getPrototypeOf(this.shape)), this.shape);
		
		var bottomY = clone.bottomAt(this.matrix);
		//clone.color = "#ffffff";
		canvas.drawGhostShape(clone, bottomY);
		}
        canvas.drawMatrix(this.matrix);
    },
    // Refresh game canvas
    _refresh: function() {
        if (!this.running) {
            return;
        }
        this.currentTime = new Date().getTime();
		var deltaTime = this.currentTime - this.prevTime;

	// todo: put in web worker
		if(deltaTime >= 1) {	//  needs to be 600hz
			inputs.incDeciframes();
			//console.log(deltaTime / 600.0);
		}
		
		if(deltaTime >= 1) {
			inputs.updateGamepad();
			inputs.processGamepadDPad();
			inputs.processGamepadInput();
		}
		
		// drain gamepad queue
		if(deltaTime > 5)
		{
			while((inputs.gamepadQueue != undefined && inputs.gamepadQueue.length >= 1)){
				var curkey = inputs.gamepadQueue.shift();
				if(curkey == "DPad-Left") {
					this.shape.goLeft(this.matrix);
					this._draw();
				}
				if(curkey == "DPad-Right") {
					this.shape.goRight(this.matrix);
					this._draw();
				}
				if(curkey == "A") {
					this.shape.rotate(this.matrix);
					this._draw();
				}
				if(curkey == "B") {
					this.shape.rotateClockwise(this.matrix);;
					this._draw();
				}
				if(curkey == "DPad-Down") {
					 this.shape.goDown(this.matrix);
					 this._draw();
				}
				if(curkey == "RB") {
					this.shape.goBottom(this.matrix);
					this._update();
				}
				if(curkey == "LB") {
					this.pushHoldStack();
					this._update();
				}				
				if(curkey == "DPad-Up") {
					this.popHoldStack();
					this._update();
				}
			}
			
			inputs.gamepadQueue = [];
		}
		//inputs.gamepadButtonClear();
		
		// Do keyboard
		if(deltaTime > 1)		// 120hz
		{
			inputs.processKeys();
		}
		
		if (deltaTime > 1) {  // 60hz
			inputs.processKeyShift();
			// Keyboard inputs
			while((inputs.inputqueue != undefined && inputs.inputqueue.length >= 1)){
				var curkey = inputs.inputqueue.shift();
				if(curkey == 37) {
					this.shape.goLeft(this.matrix);
					this._draw();
				}
				if(curkey == 39){
					this.shape.goRight(this.matrix);
					this._draw();
				}
				if(curkey == 40) {
					 this.shape.goDown(this.matrix);
					 this._draw();
				}
				if(curkey == 90) {
					this.shape.rotate(this.matrix);
					this._draw();
				}
				if(curkey == 88){
					this.shape.rotateClockwise(this.matrix);;
					this._draw();
				}
				if(curkey == 32) {
					this.shape.goBottom(this.matrix);
					this._update();
				}
				if(curkey == 16) {
					this.pushHoldStack();
					this._update();
				}
				if(curkey == 17) {
					this.popHoldStack();
					this._update();
				}
			}
			inputs.inputqueue = [];
		}
		
		
		if(deltaTime >= 10)
			inputs.saveKeyboardKeys();
		
		if(deltaTime >= 1)
			inputs.saveButtons();
		
        if (deltaTime > this.interval) {
            this._update();
		
            this.prevTime = this.currentTime;
            this._checkLevel();
        }
        if (!this.isGameOver) {
            window.requestAnimationFrame(utils.proxy(this._refresh, this));
        }

    },
    // Update game data
    _update: function() {
		
		if(this.shape != undefined) //TODO delete
        if (this.shape.canDown(this.matrix)) {
            this.shape.goDown(this.matrix);
        } else {
			this.canPullFromHoldQueue = true;
            this.shape.copyTo(this.matrix);
            this._check();
            this._fireShape();
			new Audio('./dist/Blop.ogg').play();
        }
        this._draw();
        this.isGameOver = checkGameOver(this.matrix);
        views.setGameOver(this.isGameOver);
		
		
        if (this.isGameOver) {
            views.setFinalScore(this.score);
        }

    },
    // Check and update game data
    _check: function() {
        var rows = checkFullRows(this.matrix);
        if (rows.length) {
			if(rows.length >= 4)
				new Audio('./dist/Tetris.ogg').play();
            removeRows(this.matrix, rows);
            var score = calcScore(rows);
            var reward = calcRewards(rows);
            this.score += score + reward;
			this.lines += rows.length;
			
            views.setScore(this.score);
            views.setReward(reward);
			views.setLines(this.lines);

        }
    },
    // Check and update game level
    _checkLevel: function() {
        var currentTime = new Date().getTime();
        if (currentTime - this.levelTime > consts.LEVEL_INTERVAL) {
            this.level += 1;
            this.interval = calcIntervalByLevel(this.level);
            views.setLevel(this.level);
            this.levelTime = currentTime;
        }
    }
}


window.Tetris = Tetris;
},{"./canvas.js":1,"./consts.js":2,"./input.js":4,"./openers.js":6,"./shapes.js":7,"./utils.js":8,"./views.js":9}],6:[function(require,module,exports){
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


},{"./shapes.js":7}],7:[function(require,module,exports){
var consts = require('./consts.js');
var COLORS = consts.COLORS;
var COLUMN_COUNT = consts.COLUMN_COUNT;

/**
	Defined all shapes used in Tetris game. 
	You can add more shapes if you wish.
*/

function ShapeL() {
    var state1 = [
        [1, 0],
        [1, 0],
        [1, 1]
    ];

    var state2 = [
        [0, 0, 1],
        [1, 1, 1]
    ];

    var state3 = [
        [1, 1],
        [0, 1],
        [0, 1]
    ];

    var state4 = [
        [1, 1, 1],
        [1, 0, 0]
    ];


    this.states = [state1, state2, state3, state4];
    this.x = 4;
    this.y = -3;
	this.originY = -3;
    this.flag = 'L';
}

function ShapeLR() {
    var state1 = [
        [0, 1],
        [0, 1],
        [1, 1]
    ];

    var state2 = [
        [1, 1, 1],
        [0, 0, 1]
    ];

    var state3 = [
        [1, 1],
        [1, 0],
        [1, 0]
    ];

    var state4 = [
        [1, 0, 0],
        [1, 1, 1]
    ];


    this.states = [state1, state2, state3, state4];
    this.x = 4;
    this.y = -3;
	this.originY = -3;
    this.flag = 'LR';
}

function ShapeO() {

    var state1 = [
        [1, 1],
        [1, 1]
    ];


    this.states = [state1];
    this.x = 4;
    this.y = -2;
	this.originY = -2;
    this.flag = 'O';
}

function ShapeI() {
    var state1 = [
        [1],
        [1],
        [1],
        [1]
    ];

    var state2 = [
        [1, 1, 1, 1]
    ];

    this.states = [state1, state2];

    this.x = 5;
    this.y = -4;
	this.originY = -4;
    this.flag = 'I';
}

function ShapeT() {
    var state1 = [
        [1, 1, 1],
        [0, 1, 0]
    ];

    var state2 = [
        [1, 0],
        [1, 1],
        [1, 0]
    ];

    var state3 = [
        [0, 1, 0],
        [1, 1, 1]
    ];

    var state4 = [
        [0, 1],
        [1, 1],
        [0, 1]
    ];

    this.states = [state1, state2, state3, state4];
    this.x = 4;
    this.y = -2;
	this.originY = -2;
    this.flag = 'T';
}

function ShapeZ() {
    var state1 = [
        [1, 1, 0],
        [0, 1, 1]
    ];

    var state2 = [
        [0, 1],
        [1, 1],
        [1, 0]
    ];

    this.states = [state1, state2];
    this.x = 4;
    this.y = -2;
	this.originY = -2;
    this.flag = 'Z';
}

function ShapeZR() {
    var state1 = [
        [0, 1, 1],
        [1, 1, 0]
    ];

    var state2 = [
        [1, 0],
        [1, 1],
        [0, 1]
    ];

    this.states = [state1, state2];
    this.x = 4;
    this.y = -2
	this.originY = -2;
    this.flag = 'ZR';
}

/**
Is shape can move
@param shape: tetris shape
@param matrix: game matrix
@param action:  'left','right','down','rotate'
*/
var isShapeCanMove = function(shape, matrix, action) {
    var rows = matrix.length;
    var cols = matrix[0].length;
	var rotationDirection = 0;
	
    var isBoxCanMove = function(box) {

        var x = shape.x + box.x;
        var y = shape.y + box.y;
        if (y < 0) {
            return true;
        }
        if (action === 'left') {
            x -= 1;
            return x >= 0 && x < cols && matrix[y][x] == 0;
        } else if (action === 'right') {
            x += 1;
            return x >= 0 && x < cols && matrix[y][x] == 0;
        } else if (action === 'down') {
            y += 1;
            return y < rows && matrix[y][x] == 0;
        } else if (action === 'rotate') {
			rotationDirection = 1;
            return y < rows && !matrix[y][x];
        } else if (action === 'rotateclockwise') {
			rotationDirection = -1;
            return y < rows && !matrix[y][x];
        }
    };
	
    //var boxes =  action === 'rotate'?shape.getBoxes(shape.nextState()) : shape.getBoxes(shape.state);
    
	var boxes;
	
	if(rotationDirection != 0)
		boxes = shape.getBoxes(shape.nextState(rotationDirection));
	else
		boxes = shape.getBoxes(shape.state);
	
	
	for (var i in boxes) {
        if (!isBoxCanMove(boxes[i])) {
            return false;
        }
    }
    return true;
};

/**
 All shapes shares the same method, use prototype for memory optimized
*/
ShapeL.prototype =
ShapeLR.prototype =
ShapeO.prototype =
ShapeI.prototype =
ShapeT.prototype =
ShapeZ.prototype =
ShapeZR.prototype = {

	init: function(result) {
		this.color = COLORS[result];
		this.state = 0;
		this.allBoxes = {};
		this.y = 0;
	},
	// Get boxes matrix which composite the shape
	getBoxes: function(state) {

		var boxes = this.allBoxes[state] || [];
		if (boxes.length) {
			return boxes;
		}

		var matrix = this.matrix(state);
		for (var i = 0; i < matrix.length; i++) {
			var row = matrix[i];
			for (var j = 0; j < row.length; j++) {
				if (row[j] === 1) {
					boxes.push({
						x: j,
						y: i
					});
				}
			}
		}
		this.allBoxes[state] = boxes;
		return boxes;
	},
	//Get matrix for specified state
	matrix: function(state) {
		var st = state !== undefined ? state : this.state;
		return this.states[st];
	},
	//Rotate shape
	rotate: function(matrix) {
		if (isShapeCanMove(this,matrix,'rotate')){
			this.state = this.nextState(1);
			//fix position if shape is out of right border
			var right = this.getRight();
			if ( right >= COLUMN_COUNT){
				this.x -= right - COLUMN_COUNT + 1;
			}
			/*var left = this.getLeft();
			if(left <= 0)
				this.x += 1;*/
		}
	},
	//Rotate shape clockwise
	rotateClockwise: function(matrix) {
		if (isShapeCanMove(this, matrix, 'rotateclockwise')) {
			this.state = this.nextState(-1);
			//fix position if shape is out of right border
			var right = this.getRight();
			if (right >= COLUMN_COUNT) {
				this.x -= right - COLUMN_COUNT + 1;
			}
		}
	},
	//Caculate the max column of the shape
	getColumnCount: function() {
		var mtx = this.matrix();
		var colCount = 0;
		for (var i = 0; i < mtx.length; i++) {
			colCount = Math.max(colCount, mtx[i].length);
		}
		return colCount;
	},
	//Caculate the max row of the shape
	getRowCount: function() {
		return this.matrix().length;
	},
	//Get the right pos of the shape
	getRight: function() {
		var boxes = this.getBoxes(this.state);
		var right = 0;

		for (var i in boxes) {
			right = Math.max(boxes[i].x, right);
		}
		return this.x + right;
	},

	//Return the next state of the shape
	nextState: function(direction) {
		var rotate = this.state;
		rotate += direction;
		if(rotate < 0)
			return this.states.length - 1;
		
		return rotate % this.states.length;
	},

	//Check if the shape can move down
	canDown: function(matrix) {
		return isShapeCanMove(this, matrix, 'down');
	},
	//Move the shape down 
	goDown: function(matrix) {
		if (isShapeCanMove(this, matrix, 'down')) {
			this.y += 1;
		}
	},
	//Move the shape to the Bottommost
	bottomAt: function(matrix) {
		var save = this.y;
		var ret;
		while (isShapeCanMove(this, matrix, 'down')) {
			this.y += 1;
		}
		ret = this.y;
		this.y = save;
		return ret;
	},
	//Move the shape to the Bottommost
	goBottom: function(matrix) {
		while (isShapeCanMove(this, matrix, 'down')) {
			this.y += 1;
		}
	},
	//Move the shape to the left
	goLeft: function(matrix) {
		if (isShapeCanMove(this, matrix, 'left')) {
			this.x -= 1;
		}
	},
	//Move the shape to the right
	goRight: function(matrix) {
		if (isShapeCanMove(this, matrix, 'right')) {
			this.x += 1;
		}
	},
	//Copy the shape data to the game data
	copyTo: function(matrix) {
		var smatrix = this.matrix();
		for (var i = 0; i < smatrix.length; i++) {
			var row = smatrix[i];
			for (var j = 0; j < row.length; j++) {
				if (row[j] === 1) {
					var x = this.x + j;
					var y = this.y + i;
					if (x >= 0 && x < matrix[0].length && y >= 0 && y < matrix.length) {
						matrix[y][x] = this.color;
					}
				}
			}
		}
	},
	resetOrigin: function() {
		this.y = this.originY + 1;
	}
}

/**
	Create  a random shape for game
*/
// Handles randomly generating and returning a tetromino
var RandomGenerator = {
    bag: [],
    getTetrimino() {
        if (this.bag.length === 0) {
            this.bag = this.generateNewBag();
        }
        return this.bag.shift();
    },
    generateNewBag() {
        //var tetrominoes = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
		var tetrominoes = ['0', '1', '2', '3', '4', '5', '6'];
        //var tetrominoes = ['L','L','L','L','L','L','L',];
        var bag = [];

        for (var i = 7; i > 0; i--) {
            var tetrominoIndex = Math.floor(Math.random() * i);

            bag.push(tetrominoes[tetrominoIndex]);
            tetrominoes.splice(tetrominoIndex, 1);
        }

        return bag;
    }
};

function randomShape() {
    var result = parseInt(RandomGenerator.getTetrimino(),10);//Math.floor(Math.random() * 7);
    var shape;

    switch (result) {
        case 0:
            shape = new ShapeL();
            break;
        case 1:
            shape = new ShapeO();
            break;
        case 2:
            shape = new ShapeZ();
            break;
        case 3:
            shape = new ShapeT();
            break;
        case 4:
            shape = new ShapeLR();
            break;
        case 5:
            shape = new ShapeZR();
            break;
        case 6:
            shape = new ShapeI();
            break;
    }
    shape.init(result);
    return shape;
}



function getShape(shapei) {
    var result = shapei
    var shape;

    switch (result) {
        case 0:
            shape = new ShapeL();
            break;
        case 1:
            shape = new ShapeO();
            break;
        case 2:
            shape = new ShapeZ();
            break;
        case 3:
            shape = new ShapeT();
            break;
        case 4:
            shape = new ShapeLR();
            break;
        case 5:
            shape = new ShapeZR();
            break;
        case 6:
            shape = new ShapeI();
            break;
    }
    shape.init(result);
    return shape;
}
module.exports.randomShape = randomShape;
module.exports.getShape = getShape;
//module.exports.newOpenerShapeQueue = newOpenerShapeQueue;		queue.push(new ShapeL());

},{"./consts.js":2}],8:[function(require,module,exports){

var exports = module.exports = {};

var $ = function(id){
	return document.getElementById(id);
};



//if object is plain object
var _isPlainObject = function(obj) {

    if (typeof obj !== 'object') {
        return false;
    }


    if (obj.constructor &&
        !hasOwnProperty.call(obj.constructor.prototype, 'isPrototypeOf')) {
        return false;
    }

    // If the function hasn't returned already, we're confident that
    // |obj| is a plain object, created by {} or constructed with new Object
    return true;
};
// this method source code is from jquery 2.0.x
// merge object's value and return
var extend = function() {
    var src, copyIsArray, copy, name, options, clone,
        target = arguments[0] || {},
        i = 1,
        length = arguments.length,
        deep = true;

    // Handle a deep copy situation
    if (typeof target === 'boolean') {
        deep = target;
        // skip the boolean and the target
        target = arguments[i] || {};
        i++;
    }

    // Handle case when target is a string or something (possible in deep copy)
    if (typeof target !== 'object' && typeof obj !== 'function') {
        target = {};
    }


    if (i === length) {
        target = this;
        i--;
    }

    for (; i < length; i++) {
        // Only deal with non-null/undefined values
        if ((options = arguments[i]) != null) {
            // Extend the base object
            for (name in options) {
                src = target[name];
                copy = options[name];

                // Prevent never-ending loop
                if (target === copy) {
                    continue;
                }
                // Recurse if we're merging plain objects or arrays
                if (deep && copy && (_isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {
                    if (copyIsArray) {
                        copyIsArray = false;
                        clone = src && Array.isArray(src) ? src : [];

                    } else {
                        clone = src && _isPlainObject(src) ? src : {};
                    }

                    // Never move original objects, clone them
                    //console.log('abc');

                    target[name] = extend(deep, clone, copy);

                    // Don't bring in undefined values
                } else if (copy !== undefined) {
                    target[name] = copy;
                }
            }
        }
    }

    // Return the modified object
    return target;
};


var proxy = function(fn,context){
    var args = [].slice.call( arguments, 2 );
    proxy = function() {
            return fn.apply( context || this, args.concat( [].slice.call( arguments ) ) );
    };
    return proxy;
};

var aniFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                        window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
window.requestAnimationFrame = aniFrame;


exports.$ = $;
exports.extend = extend;
exports.proxy = proxy;

},{}],9:[function(require,module,exports){
/**
 All dom definitions and actions
*/
var utils = require('./utils.js');
var consts = require('./consts.js');

var $ = utils.$;

//doms
var scene = $('scene');
var side = $('side');
var info = $('info');
var preview = $('preview');
var hold = $('hold');
var leftSide = $('leftSide');
var level = $('level');
var score = $('score');
var lines = $('lines');
var rewardInfo = $('rewardInfo');
var reward = $('reward');
var gameOver = $('gameOver');
var btnRestart = $('restart');
var finalScore = $('finalScore');


//defaults
var SIDE_WIDTH = consts.SIDE_WIDTH;


/**
	Caculate the game container size
*/
var getContainerSize = function(maxW,maxH){

	var dw = document.documentElement.clientWidth;
	var dh = document.documentElement.clientHeight;

	var size = {};
	if (dw>dh){
		size.height = Math.min(maxH,dh);
		size.width = Math.min(size.height /*/ 2*/ + SIDE_WIDTH,maxW);
	}else{
		size.width = Math.min(maxW,dw);
		size.height =  Math.min(maxH,dh);
	}
	return size;

};


/**
	Layout game elements
*/
var layoutView = function(container,maxW,maxH){

	var size = getContainerSize(maxW,maxH);
	var st = container.style;
	st.height = size.height + 'px';
	st.width = size.width + 'px';
	st.marginTop = (-(size.height/2)) + 'px';
	st.marginLeft = (-(size.width/2)) + 'px';

	//layout scene
	
	//hold.width = 80;
	//hold.height = 380;
	
	
	scene.height = size.height;
	
	scene.width = scene.height / 2;
	
	
	var sideW = size.width - scene.width + leftSide.width;
	side.style.width = sideW + 'px';
	if (sideW < SIDE_WIDTH ){
		info.style.width = side.style.width;
	}
	
	hold.style.top = 200+'px';//preview.top + 10px pad

	
	preview.width = 80;
	preview.height = 380;
	
	hold.width = 80;
	hold.height = 380;
	
	gameOver.style.width = scene.width +'px';


}

/**
	Main tetris game view
*/
var tetrisView = {


	init:function(id, maxW,maxH){
	  this.container = $(id);
	  this.scene = scene;
	  this.preview = preview;
	  this.hold = hold;
	  this.btnRestart = btnRestart;
	  layoutView(this.container,maxW,maxH);
	  this.scene.focus();

	  rewardInfo.addEventListener('animationEnd',function(e){
		 rewardInfo.className = 'invisible';
	  });
	},
	// Update the score 
	setScore:function(scoreNumber){
		score.innerHTML = scoreNumber;	
	},
	// Update the finnal score
	setFinalScore:function(scoreNumber){
		finalScore.innerHTML = scoreNumber;
	},
	// Update the level
	setLevel:function(levelNumber){
		level.innerHTML = levelNumber;
	},
	// Update the extra reward score
	setLines:function(setlines){
		lines.innerHTML = setlines;
	
	},
	setReward:function(rewardScore){
		if (rewardScore>0){
			reward.innerHTML = rewardScore;
			rewardInfo.className = 'fadeOutUp animated';	
		}else{
			rewardInfo.className = 'invisible';
		}
	},
	// Set game over view
	setGameOver:function(isGameOver){
		gameOver.style.display = isGameOver?'block':'none';
	}
};

module.exports = tetrisView;
},{"./consts.js":2,"./utils.js":8}]},{},[5]);
