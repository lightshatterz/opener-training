(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

var utils = require('./utils.js');
var consts = require('./consts.js');
// import * as utils from './utils.js';
// import * as consts from './const.js';

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
		var color = "rgba(" + colorRGB.r + "," + colorRGB.g + "," + colorRGB.b + "," + "0.2)";
		
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
// export tetrisCanvas;
 
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
// export gamepadAPI;
},{}],4:[function(require,module,exports){
var gamepad = require('./gamepad.js');
var utils = require('./utils.js');
// import * as gamepad from './gamepad.js';

var UserInputs = {
	init() {
		this.settingsMap = new Map();		
		
		// var init = utils.getCookie("init");
		// if(init == "") 
			for(var i in this.settingsList) 
				utils.setCookie(this.settingsList[i], this.settingsDefault[i], 30); //  cookies expire in 30 days
		// else
			// for(var i in this.settingsList)
				// this.settingsDefault[i] = utils.getCookie(this.settingsList[i]);
			
		 for(var i in this.settingsList)
			 this.settingsMap.set(this.settingsList[i], this.settingsDefault[i]);
		
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
	incTickCounter() {
		this.ticks++;
	},
	getTickCounter() {
		return this.ticks;
	},
	
	processGamepadInput() {
		this.gamepadButtonsDown(this.settingsMap.get("Gamepad Harddrop"));	// hard drop
		this.gamepadButtonsDown(this.settingsMap.get("Gamepad Hold"));	// hold
		this.gamepadButtonsDown(this.settingsMap.get("Gamepad Rotateccw"));	// rotate counter
		this.gamepadButtonsDown(this.settingsMap.get("Gamepad Rotate"));	// rotate cwise
		this.gamepadButtonsDown(this.settingsMap.get("Gamepad Pophold")); // Pop hold stack
		this.gamepadButtonsDown(this.settingsMap.get("Gamepad Reset"));	// reset

		
		return;
	},
	
	processGamepadDPad()  {
		this.gamepadDPadDown(this.settingsMap.get("Gamepad Left"));	// shift left
		this.gamepadDPadDown(this.settingsMap.get("Gamepad Right"));	// shift right
		this.gamepadDPadDown(this.settingsMap.get("Gamepad Down"));	// down
		
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
		var gamepadDASFrames = this.gamepadButtonsDeciFrames;
		
		if (!this.isGamepadButtonDown) {

				if (gamepadDASFrames >= deciDAS) {
					this.gamepadButtonsDeciFrames = 0;
					this.isGamepadButtonDown = true;
				}
				
		} else {
			if (gamepadDASFrames >= deciARR && isContained) {
				//this.gamepadQueue.push(finds);
				this.gamepadButtonsDeciFrames = 0;
			}
		}
			
	},
	
	// Direction Pad
	gamepadDPadDown(finds) {
		var DAS = parseInt(this.settingsMap.get("Gamepad DAS"));	//65.0;
		var ARR = parseInt(this.settingsMap.get("Gamepad ARR"));	//20.0;
		var isContained = this.gpButtons.includes(finds);
		var isPrevContained = this.prevGpButtons.includes(finds);
		
		if(isPrevContained != isContained ) {
			this.isGamepadDown = false;
			// Do once
			if(isContained)
				this.gamepadQueue.push(finds);
		}
		var gamepadDirectionDasFrames = this.gamepadDirectionPadDeciFrames;
			if (!this.isGamepadDown) {
					if (gamepadDirectionDasFrames >= DAS) {
						this.gamepadDirectionPadDeciFrames = 0;
						this.isGamepadDown = true;
						
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
	// doing a lot of back and forth between strings and integers to represtent the same thing -- todo: fix
	processKeys() {
		this.processKeyDown(parseInt(this.settingsMap.get("Keyboard Harddrop")));		 //32);  // Space	- hard drop
		this.processKeyDown(parseInt(this.settingsMap.get("Keyboard Rotate")));		//88);  // X		- rotate
		this.processKeyDown(parseInt(this.settingsMap.get("Keyboard Rotateccw")));		//90);  // Z		- rotateccw
		this.processKeyDown(parseInt(this.settingsMap.get("Keyboard Hold")));		//16);  // shift	- push hold stack
		this.processKeyDown(parseInt(this.settingsMap.get("Keyboard Pophold")));	// ctrl	- pop hold stack
		this.processKeyDown(parseInt(this.settingsMap.get("Keyboard Background")));  // q		- turn off background
		this.processKeyDown(parseInt(this.settingsMap.get("Keyboard Reset"))); 		 // r		- reset
		//this.processKeyDown(this.settingsMap.get("Keyboard hold")));  // c		- pop hold stack
	},

	// keyboard keys z,x,space
	processKeyDown(key)
	{
		var deciDAS = 50.0;
		var deciARR = 50.0;
		

		// todo: fix this mess
		if(this.prevKeyboardKeys[key] != this.keyboardKeys[key] && this.isKeyBoardKeyDown == true) {
			this.isKeyboardKeyDown = false;
			if(this.keyboardKeys[key] == true)
				this.inputqueue.push(key);
				this.keyboardKeys[key] = false;
		}
		
		var keyboardDASFrames = this.keyboardButtonsDeciframes;

		if (!this.isKeyboardKeyDown) {
				if (keyboardDASFrames >= deciDAS) {
					this.keyboardButtonsDeciframes = 0;
					this.isKeyboardKeyDown = true;
				}
		} else {
			if (keyboardDASFrames >= deciARR && this.keyboardKeys[key] == true) {
				//this.inputqueue.push(key);
				this.keyboardButtonsDeciframes = 0;
			}
		}
		
		
		
	},
	
	processKeyShift() {
		this.processKeyboardArrowKeys(parseInt(this.settingsMap.get("Keyboard Left")));		//39);  // right
		this.processKeyboardArrowKeys(parseInt(this.settingsMap.get("Keyboard Right")));		//37);	// left
		this.processKeyboardArrowKeys(parseInt(this.settingsMap.get("Keyboard Down")));  // down
	},
	// Direction arrows
    processKeyboardArrowKeys(key) {		
		var DAS = parseInt(this.settingsMap.get("Keyboard DAS"));	//65.0;
		var ARR = parseInt(this.settingsMap.get("Keyboard ARR"));	//20.0;

	
		if(this.prevKeyboardKeys[key] != this.keyboardKeys[key]) {
			this.isDirectionArrowDown = false;
			if(this.keyboardKeys[key] == true)
				this.inputqueue.push(key);
		}
		
		
		var keyboardDASFrames = this.keyboardDirectionArrowsDeciframes;
		
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
		
		if (! ((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105) || event.keyCode == 8)) 
			event.preventDefault();
		
		this.keyboardKeys[event.keyCode] = true;
		this.isKeyBoardKeyDown = true;
    },
    keyUp(event) {
		this.isKeyDown = false;
		this.keyboardKeys[event.keyCode] = false;
		this.isKeyBoardKeyDown = false;
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
	gamepadQueue: [],
	
	ticks: 0,
	
	settingsList: ["init", 
					"Keyboard DAS", "Keyboard ARR", "Keyboard Harddrop", "Keyboard Hold", 
					"Keyboard Left", "Keyboard Right", "Keyboard Rotateccw", "Keyboard Rotate", 
					"Keyboard Down", "Keyboard Pophold", "Keyboard Reset", "Keyboard Background",
					
					"Gamepad DAS", "Gamepad ARR", "Gamepad Harddrop", "Gamepad Hold",
					"Gamepad Left", "Gamepad Right", "Gamepad Rotateccw", "Gamepad Rotate", 
					"Gamepad Down","Gamepad Pophold", "Gamepad Reset", "Gamepad Background", 
					"path", "SameSite"],
	
	settingsDefault: ["true", 
						"65.0", "20.0", "32", "16",
						"37", "39", "90", "88",
						"40", "17", "82", "81",
						
						"65.0", "20.0", "RB", "LB",
						"DPad-Left", "DPad-Right", "A", "B",
						"DPad-Down", "DPad-Up", "Back", "", 
						"=/", "Strict"],
	settingsMap: []
};

module.exports = UserInputs;
// export UserInputs;
},{"./gamepad.js":3,"./utils.js":8}],5:[function(require,module,exports){
var utils = require('./utils.js');
var consts = require('./consts.js');
var shapes = require('./shapes.js');
var views = require('./views.js');
var canvas = require('./canvas.js');
var inputs = require('./input.js');
var openers = require('./openers.js');
// import * as utils from './utils.js';
// import * as consts from './const.js';
// import * as shapes from './shapes.js';
// import * as views from './views.js';
// import * as canvas from './canvas.js';
// import * as inputs from './input.js';
// import * as openers from './openers.js';
//import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r125/build/three.module.js';

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
var calcRewards = function(rows, tspinType) {
	if(tspinType == 2)
		rows*=2+1;
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
		this.createSettings();
		// if true no openers.  just random tetrinos
		this.isFreePlay = true;
		this.currentOpener = 0;
		this.doTest = false;
        this.matrix = initMatrix(consts.ROW_COUNT, consts.COLUMN_COUNT);
        this.reset();
        
		this._initEvents();
        this._fireShape();

    },
	setFreePlay: function()
	{
		this.isFreePlay = true;
		this.doTest = false;
		this.hintQueue = [];
		this.shapeQueue = [];
		this.hintMino = 0;
		this._restartHandler();
		this.currentOpener = 0;

	},
	setCurrentOpener(opener)
	{
		this.isFreePlay = false;
		this.doTest = false;
		this.currentOpener = opener;
		this._restartHandler();

	},
	setDoTest: function()
	{
		if(this.isFreePlay) return;
		this.doTest = true;
		this._restartHandler();
	},
	createSettings: function () {
		var list = document.getElementById("settings");
		var settings = inputs.settingsList;
		
		settings.forEach(function(item) {
			var option = document.createElement('option');
	
			option.text = item;
			option.id = item;

			list.add(option);
		});
	},	
	updateSettingTextBox: function() {
		console.log(document.getElementById("setting_value").value = inputs.settingsDefault[document.getElementById("settings").selectedIndex-1]);
	},
	setSettings: function() {
		var newVal = document.getElementById("setting_value").value;
		var key = inputs.settingsList[document.getElementById("settings").selectedIndex-1];
		utils.setCookie(key, newVal, 30);
		inputs.settingsMap.set(key, newVal);
	},
    //Reset game
    reset: function() {
        this.running = false;
        this.isGameOver = false;
        this.level = 1;
        this.score = 0;
		this.lines = 0;
		// beginning of frame
        this.startTime = new Date().getTime();
        this.currentTime = this.startTime;
        this.prevTime = this.startTime;
		//todo:get rid of extra
        this.levelTime = this.startTime;
		this.prevInputTime = this.startTime;
		// current tetrino index gets set to 0 at the end of opener sequence
		this.currentMinoInx = 0;
		this.shapeQueue = [];
		this.hintQueue = [];
		this.holdStack = [];
		// gets set to false after mino has been popped from hold stack; set back to true on mino dropped
		this.canPopFromHoldStack = false;
		// manipulation counter for srs extended piece lockdown
		this.manipulationCounter = 0;
		// timer for srs extened piece lockdown
		this.lockdownTimer = 0;
		this.landed = false;
		
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
		if(this.holdStack.length < 4) {
			this.holdStack.push(utils.deepClone(this.shape));
			this.shape = this.shapeQueue.shift();
			this.canPopFromHoldStack = false;
			this.shape.resetOrigin();
			this._draw(); 
		}
	},
	popHoldStack: function()
	{
		if(this.holdStack.length >= 1 && this.canPopFromHoldStack)
		{
			this.canPopFromHoldStack = false;
			this.shapeQueue.unshift(utils.deepClone(this.shape));
			this.shape = this.holdStack.pop();
			this.shape.resetOrigin();
			this._draw();
		}
	},

    // Restart game
    _restartHandler: function() {
        this.reset();
        this.start();
		this._fireShape();
    },
    // Bind game events
    _initEvents: function() {
		setInterval(() => {this._processTick();}, 1);
		setInterval(() => {this.lockDownTimer++;}, 100 );
        views.btnRestart.addEventListener('click', utils.proxy(this._restartHandler, this), false);
    },

    // Fill next queue and set next shape
    _fireShape: function() {
		if(this.isFreePlay == false) {
			while(this.shapeQueue.length <= 4)
			{
				this.preparedShape = openers.getNextMino(this.currentOpener);
				this.shapeQueue.push(this.preparedShape);
			}
			while(this.hintQueue.length <= 4)
			{
				this.preparedShape = openers.getNextHint(this.currentOpener);
				this.hintQueue.push(this.preparedShape);
			}
			
			this.hintMino = this.hintQueue.shift();
			this.shape = this.shapeQueue.shift();
		   
		   this.currentMinoInx++;
		   
			if(this.currentMinoInx > openers.getLength()) {
				this.hintQueue = [];
				this.shapeQueue = [];
				// Recursion warning
				this._restartHandler();
			}
		} else {
			while(this.shapeQueue.length <= 4)
			{
				this.preparedShape = shapes.randomShape();
				this.shapeQueue.push(this.preparedShape);
			}
			
			this.shape = this.shapeQueue.shift() || shapes.randomShape();
			this.currentMinoInx++;
		}
		
		//todo:should be in shapes.js
		this.landed = false;
		this.manipulationCounter = 0;
		// Reset matrix at successful end of opener
		//if(this.shapeQueue.length == openers.length) {
		//	this.matrix = [];
		//	new Audio("Tetris.ogg");
		//}
		
		this._draw();
        
    },
	// lockdown timer with centisecond resolution
	resetLockdown: function() {

		if(this.shape.canDown(this.matrix) == false)	
			this.landed = true;
			
		this.lockDownTimer = 0;
		
		if(this.landed)
			this.manipulationCounter++;		
	},
	// Return if the piece can be shifted or rotated
	isPieceLocked: function() {
		
		if(this.manipulationCounter > 15) return true;
		if(this.lockDownTimer >= 5) return true;
		
		return false;
	},
    // Draw game data
    _draw: function() {
        canvas.drawScene();
        canvas.drawShape(this.shape);
		canvas.drawHoldShape(this.holdStack);
		canvas.drawPreviewShape(this.shapeQueue);
		if(this.doTest != true)
			canvas.drawHintShape(this.hintMino);
		
		if(this.shape != undefined) {
		let clone = Object.assign(Object.create(Object.getPrototypeOf(this.shape)), this.shape);
		
		var bottomY = clone.bottomAt(this.matrix);
		canvas.drawGhostShape(clone, bottomY);
		}
        canvas.drawMatrix(this.matrix);
    },
	// tick input data
	_processTick: async function() {
	
		var deltaTime = 1.0; // 1 millisecond
		var tenthOfFrame = 1.0//1;//1.6; // 1.6ms = 1 fram
		var halfFrame = 5.0//5;//8.0;
		var halfFramePlus = 10.0;//10.0;
		
		
		inputs.incDeciframes();
		inputs.incTickCounter();
		
	
		if(inputs.getTickCounter() >= tenthOfFrame) {
			inputs.updateGamepad();
			inputs.processGamepadDPad();
			inputs.processGamepadInput();
		}
		
		
		// Don't process game related events if game over
		if(this.isGameOver) return;
		
		// drain gamepad queue
		if(inputs.getTickCounter() > halfFrame)  // 8 millisecons
		{
			while((inputs.gamepadQueue != undefined && inputs.gamepadQueue.length >= 1)){
				var curkey = inputs.gamepadQueue.shift();
				if(curkey == "DPad-Left") {
					this.shape.goLeft(this.matrix);
					this.resetLockdown();
					this._draw();
				}
				if(curkey == "DPad-Right") {
					this.shape.goRight(this.matrix);
					this.resetLockdown();
					this._draw();
				}
				if(curkey == "A") {
					this.rotationCounter++;
					this.shape.rotate(this.matrix);
					this.resetLockdown();
					this._draw();
				}
				if(curkey == "B") {
					this.rotationCounter++;
					this.shape.rotateClockwise(this.matrix);
					this.resetLockdown();
					this._draw();
				}
				if(curkey == "DPad-Down") {
					 this.shape.goDown(this.matrix);
					 this._draw();
				}
				if(curkey == "RB") {
					this.shape.goBottom(this.matrix);
					this.lockDownTimer = 5000;
					this._update();
				}
				if(curkey == "LB") {
					this.pushHoldStack();
					this._draw();
				}				
				if(curkey == "DPad-Up") {
					this.popHoldStack();
					this._draw();
				}
				if(curkey == "Back") {
					this._restartHandler();
					return;
				}
			}
			
			inputs.gamepadQueue = [];
		}
		//inputs.gamepadButtonClear();
		
		// Do keyboard
		if(inputs.getTickCounter() > tenthOfFrame)		// 120hz
		{
			inputs.processKeys();
		}
		
		if (inputs.getTickCounter() > tenthOfFrame) {  // 60hz
			inputs.processKeyShift();
			// Keyboard inputs
			while((inputs.inputqueue != undefined && inputs.inputqueue.length >= 1)){
				var curkey = inputs.inputqueue.shift();
				if(curkey == 37) {
					this.shape.goLeft(this.matrix);
					this.resetLockdown();
					this._draw();
				}
				if(curkey == 39){
					this.shape.goRight(this.matrix);
					this.resetLockdown();
					this._draw();
				}
				if(curkey == 40) {
					 this.shape.goDown(this.matrix);
					 this._draw();
				}
				if(curkey == 90) {
					this.rotationCounter++;
					this.shape.rotate(this.matrix);
					this.resetLockdown();
					this._draw();
				}
				if(curkey == 88){
					this.rotationCounter++;
					this.shape.rotateClockwise(this.matrix);
					this.resetLockdown();
					this._draw();
				}
				if(curkey == 32) {
					this.shape.goBottom(this.matrix);
					this.lockDownTimer = 5000;
					this._update();
				}
				if(curkey == 16) {
					this.pushHoldStack();
					//this._update();
					this._draw();
				}
				if(curkey == 17 || curkey == 67) {
					this.popHoldStack();
					//this._update();
					this._draw();
				}
				if(curkey == 81) {
					if(document.getElementById("divbg").style.display == "none")
						document.getElementById("divbg").style.display =  "initial";
					else
						document.getElementById("divbg").style.display="none";
				}
				if(curkey == 82) {
					this._restartHandler();
					return;
				}
					
			}
			inputs.inputqueue = [];
		}
		
		
		if(inputs.getTickCounter() >= halfFramePlus)
			inputs.saveKeyboardKeys();
		
		if(inputs.getTickCounter() >= tenthOfFrame)
			inputs.saveButtons();
		
	},		
    // Refresh game canvas
    _refresh: async function() {

		if (!this.running) {
            return;
        }
		
		this.currentTime = new Date().getTime();
		
		var curInputTime = new Date().getTime();
	
		this.prevInputTime = curInputTime;
		var deltaLevelTime = this.currentTime - this.prevTime;

		
        if (deltaLevelTime > this.interval) {
            this._update();
            this._checkLevel(this.prevTime = this.currentTime);
        }
		
		// Draw Frame
        if (!this.isGameOver) {
            window.requestAnimationFrame(utils.proxy(this._refresh, this));
        }
		

    },
	// check if the current piece is in the same location as the hint piece
	_checkHint: function() {
		
		if(this.isFreePlay)
			return;
		if(!this.shape.isSameSRS(this.hintMino))
		{
			new Audio('./dist/Failed.ogg').play();
			this._restartHandler();
			// Restart
			return 1;
		}
	},
    // Update game data
    _update: function() {
		
        if (this.shape.canDown(this.matrix)) {
            this.shape.goDown(this.matrix);
        } else if(this.isPieceLocked()){
			this.canPopFromHoldStack = true;
            this.shape.copyTo(this.matrix);
            this._check();
			if(this._checkHint()) return;
            this._fireShape();
			new Audio('./dist/Blop2.ogg').play();
        }
        this._draw();
        this.isGameOver = checkGameOver(this.matrix);
        views.setGameOver(this.isGameOver);
		
		
        if (this.isGameOver) {
            views.setFinalScore(this.score);
        }

    },
	// 0 - none, 1 - mini, 2 - tspin
	_tSpinType: function(tPiece, matrix) {
		
		var side1 = 0;
		var side2 = 0;
		var side3 = 0;
		var side4 = 0;
		
		side1X = tPiece.x;
		side1Y = tPiece.y;
		side2X = tPiece.x + 2;
		side2Y = tPiece.y;
		side3X = tPiece.x;
		side3Y = tPiece.y + 2;
		side4X = tPiece.x + 2;
		side4Y = tPiece.y + 2;
		
		if(matrix[side1Y][side1X] != 0)
			side1 = 1;
		if(matrix[side2Y][side2X] != 0)
			side2 = 1;
		if(matrix[side3Y][side3X] != 0)
			side3 = 1;
		if(matrix[side4Y][side4X] != 0)
			side4 = 1;
		
		console.log("sides: " + side1+side2+side3+side4);
		// if Sides A and B + (C or D) are touching a Surface
		//considered a T-Spin
		if((side1+side2+side3+side4) >= 3)
			return 2;
		
		//if Sides C and D + (A or B) are touching a Surface
		//considered a Mini T-Spin
		if((side1 || side2) && (side3 && side4))
			return 1;
		
		return 0;
	},
    // Check and update game data
    _check: function() {
        var rows = checkFullRows(this.matrix);
        if (rows.length) {
			var tspinType;
			// if(rows.length >= 4)
				// new Audio('./dist/Tetris.ogg').play();
			if(this.shape.flag === 'T')
				tspinType = this._tSpinType(this.shape, this.matrix);
			
            removeRows(this.matrix, rows);

			console.log("type: " + tspinType);
            var score = calcScore(rows);
            var reward = calcRewards(rows, tspinType);
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
// export {Tetris};
},{"./canvas.js":1,"./consts.js":2,"./input.js":4,"./openers.js":6,"./shapes.js":7,"./utils.js":8,"./views.js":9}],6:[function(require,module,exports){
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
				case 4:
				//Pokemino's STD
				this.shapeQueue = new Array(
					shapes.getShape(0),
					shapes.getShape(6),
					shapes.getShape(1),
					shapes.getShape(4),
					shapes.getShape(2),
					shapes.getShape(5),
					shapes.getShape(3),
					shapes.getShape(1),
					shapes.getShape(5),
					shapes.getShape(2),
					shapes.getShape(0),
					shapes.getShape(6),
					shapes.getShape(2),
					shapes.getShape(4),
					shapes.getShape(3),
					shapes.getShape(0),
					shapes.getShape(3));
				break;
				case 5:
					// Mr TSpins STD reversed 
					this.shapeQueue = new Array(
					shapes.getShape(1),
					shapes.getShape(2),
					shapes.getShape(5),
					shapes.getShape(0),
					shapes.getShape(4),
					shapes.getShape(6),
					shapes.getShape(3),
					shapes.getShape(1),
					shapes.getShape(6),
					shapes.getShape(2),
					shapes.getShape(4),
					shapes.getShape(5),
					shapes.getShape(0),
					shapes.getShape(0),
					shapes.getShape(3),
					shapes.getShape(3));
				break;
				case 6:
					// Hachispin
					this.shapeQueue = new Array(
					shapes.getShape(1),
					shapes.getShape(2),
					shapes.getShape(6),
					shapes.getShape(5),
					shapes.getShape(4),
					shapes.getShape(0),
					shapes.getShape(3),
					shapes.getShape(6),
					shapes.getShape(1),
					shapes.getShape(5),
					shapes.getShape(4),
					shapes.getShape(2),
					shapes.getShape(0),
					shapes.getShape(3));
				break;
				case 7:
					// Albatross
					this.shapeQueue = new Array(
					shapes.getShape(1),
					shapes.getShape(5),
					shapes.getShape(6),
					shapes.getShape(0),
					shapes.getShape(4),
					shapes.getShape(2),
					shapes.getShape(3));
			break;
				case 8:
				// Number One
				this.shapeQueue = new Array(
				shapes.getShape(1),
				shapes.getShape(4),
				shapes.getShape(6),
				shapes.getShape(0),
				shapes.getShape(2),
				shapes.getShape(5),
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
				//MKO Stacking
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
			case 4:
				//Pokemino's STD  
				this.hintQueue = new Array(
					shapes.getShape(0),
					shapes.getShape(6),
					shapes.getShape(1),
					shapes.getShape(4),
					shapes.getShape(2),
					shapes.getShape(5),
					shapes.getShape(3),
					shapes.getShape(1),
					shapes.getShape(5),
					shapes.getShape(2),
					shapes.getShape(0),
					shapes.getShape(6),
					shapes.getShape(2),
					shapes.getShape(4),
					shapes.getShape(3),
					shapes.getShape(0),
					shapes.getShape(3));
				
				var hintDataList = [0,17,1,  0,16,0,  4,18,0,  4,17,-1,  3,15,1,  8,17,-1,  2,17,2,  0,17,0,  0,15,-1,  
									1,15,0,  8,16,-2,  6,15,0,  3,14,1,  6,12,-1,  6,16,1,  2,16,-1,  7,17,2 ];
				
				for(var i = 0; i < this.hintQueue.length; i++) {
					this.hintQueue[i].x = hintDataList[i * 3];
					this.hintQueue[i].y = hintDataList[i * 3 + 1];
					this.hintQueue[i].state = this.hintQueue[i].nextState(hintDataList[i * 3 + 2]);
				}
			break;
			case 5:
				// Mr TSpins STD reversed    
				this.hintQueue = new Array(
					shapes.getShape(1),
					shapes.getShape(2),
					shapes.getShape(5),
					shapes.getShape(0),
					shapes.getShape(4),
					shapes.getShape(6),
					shapes.getShape(3),
					shapes.getShape(1),
					shapes.getShape(6),
					shapes.getShape(2),
					shapes.getShape(4),
					shapes.getShape(5),
					shapes.getShape(0),
					shapes.getShape(0),
					shapes.getShape(3),
					shapes.getShape(3));
				
				var hintDataList = [4,18,0,  0,18,0,  7,17,1,  0,15,1,  4,17,-1,  6,14,0,  2,17,2,  1,17,0,  0,16,0,  2,15,-1,  
									0,14,0,  3,15,1,  8,16,-1,  5,13,2,  6,16,1,  7,17,2 ];
				
				for(var i = 0; i < this.hintQueue.length; i++) {
					this.hintQueue[i].x = hintDataList[i * 3];
					this.hintQueue[i].y = hintDataList[i * 3 + 1];
					this.hintQueue[i].state = this.hintQueue[i].nextState(hintDataList[i * 3 + 2]);
				}
				
			break;
			case 6:
				// Hachispin   
				this.hintQueue = new Array(
				shapes.getShape(1),
				shapes.getShape(2),
				shapes.getShape(6),
				shapes.getShape(5),
				shapes.getShape(4),
				shapes.getShape(0),
				shapes.getShape(3),
				shapes.getShape(6),
				shapes.getShape(1),
				shapes.getShape(5),
				shapes.getShape(4),
				shapes.getShape(2),
				shapes.getShape(0),
				shapes.getShape(3));
				
				var hintDataList = [1,18,0,  0,18,0,  9,16,0,  2,15,1,  6,17,2,  5,16,2,  1,16,2,  0,16,0,  -1,16,0,  5,16,0,  0,14,0,  3,15,0,  8,14,-1,  7,16,-1];
				
				for(var i = 0; i < this.hintQueue.length; i++) {
					this.hintQueue[i].x = hintDataList[i * 3];
					this.hintQueue[i].y = hintDataList[i * 3 + 1];
					this.hintQueue[i].state = this.hintQueue[i].nextState(hintDataList[i * 3 + 2]);
				}
			break;
			case 7:
				// Albatross
				this.hintQueue = new Array(
				shapes.getShape(1),
				shapes.getShape(5),
				shapes.getShape(6),
				shapes.getShape(0),
				shapes.getShape(4),
				shapes.getShape(2),
				shapes.getShape(3));
				
				var hintDataList = [1,18,0,  0,17,-1,  9,16,0,  5,17,2,  6,16,2,  3,16,0,  1,16,2];
				
				for(var i = 0; i < this.hintQueue.length; i++) {
					this.hintQueue[i].x = hintDataList[i * 3];
					this.hintQueue[i].y = hintDataList[i * 3 + 1];
					this.hintQueue[i].state = this.hintQueue[i].nextState(hintDataList[i * 3 + 2]);
				}
			break;
			case 8:
				// Number One  // O - 1, I - 6, L - 0, S - 5, J - 4, Z - 2, T - 3
				this.hintQueue = new Array(
				shapes.getShape(1),
				shapes.getShape(4),
				shapes.getShape(6),
				shapes.getShape(0),
				shapes.getShape(2),
				shapes.getShape(5),
				shapes.getShape(3));
				
				var hintDataList = [3,18,0,  0,17,2,  0,15,1,  4,15,-1,  6,17,0,  8,16,-1,  3,17,-1];
				
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



},{"./shapes.js":7}],7:[function(require,module,exports){
var consts = require('./consts.js');
// import * as consts from './const.js';
var COLORS = consts.COLORS;
var COLUMN_COUNT = consts.COLUMN_COUNT;

/**
	Defined all shapes used in Tetris game. 
	You can add more shapes if you wish.
*/


function ShapeL() {
    var state1 = [
        [0, 0, 1, 0],
        [1, 1, 1, 0],
		[0, 0, 0, 0],
        [0, 0, 0, 0]
    ];
    var state2 = [
        [0, 1, 0, 0],
        [0, 1, 0, 0],
		[0, 1, 1, 0],
        [0, 0, 0, 0]
    ];
    var state3 = [
        [0, 0, 0, 0],
        [1, 1, 1, 0],
		[1, 0, 0, 0],
        [0, 0, 0, 0]
    ];
    var state4 = [
        [1, 1, 0, 0],
        [0, 1, 0, 0],
		[0, 1, 0, 0],
        [0, 0, 0, 0]
    ];

	// Rotation point offsets: clockwise<point1, point2>, counterclockwise<point3, point4>, <newline>
	// In guidline Tetris each piece has 5 possible rotation points with respect to each state/orientation. Iterate through all every rotation.
	var state1RotationPointsOffset = [ 
		0,  0,  0,  0,
		1,  0, -1,  0,
		1,  1, -1,  1,
		0, -2,  0, -2,
		1, -2, -1, -2
	];
	var state2RotationPointsOffset = [
		0,  0,  0,  0,
		1,  0,  1,  0,
		1, -1,  1, -1,
		0,  2,  0,  2,
		1,  2,  1,  2
	];
	var state3RotationPointsOffset = [
		0,  0,  0,  0,
		-1,  0,  1,  0,
		-1,  1,  1,  1,
		0, -2,  0, -2,
		-1, -2,  1, -2
	];
	var state4RotationPointsOffset = [
		 0,  0,  0,  0,
		 -1,  0, -1,  0,
		 -1, -1, -1, -1,
		 0,  2,  0,  2,
		 -1,  2, -1,  2
	];

	this.rotationPoints = [state1RotationPointsOffset, state2RotationPointsOffset, state3RotationPointsOffset, state4RotationPointsOffset];
    this.states = [state1, state2, state3, state4];
    this.x = 4;
    this.y = -3;
	this.originY = -3;
    this.flag = 'L';
}

function ShapeLR() {
    var state1 = [
        [1, 0, 0, 0],
        [1, 1, 1, 0],
		[0, 0, 0, 0],
        [0, 0, 0, 0]
    ];

    var state2 = [
        [0, 1, 1, 0],
        [0, 1, 0, 0],
		[0, 1, 0, 0],
        [0, 0, 0, 0]
    ];

    var state3 = [
        [0, 0, 0, 0],
        [1, 1, 1, 0],
		[0, 0, 1, 0],
        [0, 0, 0, 0]
    ];

    var state4 = [
        [0, 1, 0, 0],
        [0, 1, 0, 0],
		[1, 1, 0, 0],
        [0, 0, 0, 0]
    ];
	
	var state1RotationPointsOffset = [ 
		0,  0,  0,  0,
		1,  0, -1,  0,
		1,  1, -1,  1,
		0, -2,  0, -2,
		1, -2, -1, -2
	];
	var state2RotationPointsOffset = [
		0,  0,  0,  0,
		1,  0,  1,  0,
		1, -1,  1, -1,
		0,  2,  0,  2,
		1,  2,  1,  2
	];
	var state3RotationPointsOffset = [
		0,  0,  0,  0,
		-1,  0,  1,  0,
		-1,  1,  1,  1,
		0, -2,  0, -2,
		-1, -2,  1, -2
	];
	var state4RotationPointsOffset = [
		 0,  0,  0,  0,
		 -1,  0, -1,  0,
		 -1, -1, -1, -1,
		 0,  2,  0,  2,
		 -1,  2, -1,  2
	];

	this.rotationPoints = [state1RotationPointsOffset, state2RotationPointsOffset, state3RotationPointsOffset, state4RotationPointsOffset];
    this.states = [state1, state2, state3, state4];
    this.x = 4;
    this.y = -3;
	this.originY = -3;
    this.flag = 'LR';
}

function ShapeO() {

    var state1 = [
        [0, 0, 1, 1],
        [0, 0, 1, 1],
		[0, 0, 0, 0],
		[0, 0, 0, 0]
    ];
    var state2 = [
        [0, 0, 1, 1],
        [0, 0, 1, 1],
		[0, 0, 0, 0],
		[0, 0, 0, 0]
    ];
    var state3 = [
        [0, 0, 1, 1],
        [0, 0, 1, 1],
		[0, 0, 0, 0],
		[0, 0, 0, 0]
    ];
    var state4 = [
        [0, 0, 1, 1],
        [0, 0, 1, 1],
		[0, 0, 0, 0],
		[0, 0, 0, 0]
    ];
	
	var state1RotationPointsOffset = [ 
		0,  0,  0,  0,
		0,  0,  0,  0,
		0,  0,  0,  0,
		0,  0,  0,  0,
		0,  0,  0,  0
	];
	var state2RotationPointsOffset = [
		0,  0,  0,  0,
		0,  0,  0,  0,
		0,  0,  0,  0,
		0,  0,  0,  0,
		0,  0,  0,  0
	];
	var state3RotationPointsOffset = [
		0,  0,  0,  0,
		0,  0,  0,  0,
		0,  0,  0,  0,
		0,  0,  0,  0,
		0,  0,  0,  0
	];
	var state4RotationPointsOffset = [
		0,  0,  0,  0,
		0,  0,  0,  0,
		0,  0,  0,  0,
		0,  0,  0,  0,
		0,  0,  0,  0
	];

	this.rotationPoints = [state1RotationPointsOffset, state2RotationPointsOffset, state3RotationPointsOffset, state4RotationPointsOffset];
    this.states = [state1, state2, state3, state4];
    this.x = 2;
    this.y = -2;
	this.originY = -2;
    this.flag = 'O';
}

function ShapeI() {
	// North
    var state1 = [
        [1, 0, 0, 0],
        [1, 0, 0, 0],
        [1, 0, 0, 0],
        [1, 0, 0, 0]
    ];

	// East
    var state2 = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
		[1, 1, 1, 1],
        [0, 0, 0, 0]
    ];
	
	// South
    var state3 = [
        [0, 0, 1, 0],
        [0, 0, 1, 0],
		[0, 0, 1, 0],
        [0, 0, 1, 0]
    ];
	
	// West
    var state4 = [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
		[0, 0, 0, 0],
        [0, 0, 0, 0]
    ];
	
	var state1RotationPointsOffset = [ 
		0, 0, 0, 0,
		-1, 0, -2,  0,
		2,  0,  1,  0,
		-1,  2, -2, -1,
		2, -1,  1,  2
	];
	var state2RotationPointsOffset = [
		0,  0,  0,  0,
		2,  0, -1,  0,
		-1,  0,  2,  0,
		2,  1, -1,  2,
		-1, -2,  2, -1

	];
	var state3RotationPointsOffset = [
		0,  0,  0,  0,
		1,  0,  2,  0,
		-2,  0, -1,  0,
		1, -2,  2,  1,
		-2,  1, -1, -2
	];
	var state4RotationPointsOffset = [
		0,  0,  0,  0,
		-2,  0,  1,  0,
		1,  0, -2,  0,
		-2, -1,  1, -2,
		1,  2, -2,  1
	];

	this.rotationPoints = [state1RotationPointsOffset, state2RotationPointsOffset, state3RotationPointsOffset, state4RotationPointsOffset];
    this.states = [state1, state2, state3, state4];

    this.x = 5;
    this.y = -4;
	this.originY = -4;
    this.flag = 'I';
}

function ShapeT() {
    var state1 = [
        [0, 1, 0, 0],
        [1, 1, 1, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0]
    ];
    var state2 = [
        [0, 1, 0, 0],
        [0, 1, 1, 0],
		[0, 1, 0, 0],
		[0, 0, 0, 0]
    ];
    var state3 = [
        [0, 0, 0, 0],
        [1, 1, 1, 0],
		[0, 1, 0, 0],
		[0, 0, 0, 0]
    ];
    var state4 = [
        [0, 1, 0, 0],
        [1, 1, 0, 0],
		[0, 1, 0, 0],
		[0, 0, 0, 0]
    ];
	
	// rotation points clockwise<point1, point2>, counterclockwise<point1, point2>
	var state1RotationPointsOffset = [ 
		0,  0,  0,  0,   
		1,  0, -1,  0,   
		1,  1, -1,  1,   
		NaN, NaN,  NaN,  NaN,   
		1, -2, -1, -2
		// 0, 0, 0, 0,
		// -1, 0, 1, 0,
		// -1, 1, 1, 1,
		// NaN, NaN,  NaN,  NaN,
		// -1, -2, 1, -2
	];
	var state2RotationPointsOffset = [
		0,  0,  0,  0,   
		1,  0,  1,  0,   
		1, -1,  1, -1,   
		0,  2,  0,  2,   
		1,  2,  1,  2
	];
	var state3RotationPointsOffset = [
		0,  0,  0,  0,  
		-1,  0,  1,  0,   
		NaN,  NaN,  NaN,  NaN,   
		0, -2,  0, -2,  
		-1, -2,  1, -2
	];
	var state4RotationPointsOffset = [
		0,  0,  0,  0,  
		-1,  0, -1,  0,  
		-1, -1, -1, -1,   
		0,  2,  0,  2,  
		-1,  2, -1,  2
	];
	
	this.rotationPoints = [state1RotationPointsOffset, state2RotationPointsOffset, state3RotationPointsOffset, state4RotationPointsOffset];
	this.states = [state1, state2, state3, state4];
	
    this.x = 4;
    this.y = -2;
	this.originY = -2;
    this.flag = 'T';
}

function ShapeZ() {
    var state1 = [
        [1, 1, 0, 0],
        [0, 1, 1, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0]
    ];
    var state2 = [
        [0, 0, 1, 0],
        [0, 1, 1, 0],
		[0, 1, 0, 0],
		[0, 0, 0, 0]
    ];
	var state3 = [
        [0, 0, 0, 0],
        [1, 1, 0, 0],
		[0, 1, 1, 0],
		[0, 0, 0, 0]
    ];
	var state4 = [
        [0, 1, 0, 0],
        [1, 1, 0, 0],
		[1, 0, 0, 0],
		[0, 0, 0, 0]
    ];

	// Rotation point offsets: clockwise<point1, point2>, counterclockwise<point3, point4>, <newline>
	// In guidline Tetris each piece has 5 possible rotation points with respect to each state/orientation. Iterate through all every rotation.
	var state1RotationPointsOffset = [ 
		0,  0,  0,  0,
		1,  0, -1,  0,
		1,  1, -1,  1,
		0, -2,  0, -2,
		1, -2, -1, -2
	];
	var state2RotationPointsOffset = [
		0,  0,  0,  0,
		1,  0,  1,  0,
		1, -1,  1, -1,
		0,  2,  0,  2,
		1,  2,  1,  2
	];
	var state3RotationPointsOffset = [
		0,  0,  0,  0,
		-1,  0,  1,  0,
		-1,  1,  1,  1,
		0, -2,  0, -2,
		-1, -2,  1, -2
	];
	var state4RotationPointsOffset = [
		0,  0,  0,  0,
		-1,  0, -1,  0,
		-1, -1, -1, -1,
		0,  2,  0,  2,
		-1,  2, -1,  2
	];

	this.rotationPoints = [state1RotationPointsOffset, state2RotationPointsOffset, state3RotationPointsOffset, state4RotationPointsOffset];
    this.states = [state1, state2, state3, state4];
    this.x = 4;
    this.y = -2;
	this.originY = -2;
    this.flag = 'Z';
}

function ShapeZR() {
    var state1 = [
        [0, 1, 1, 0],
        [1, 1, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0]
    ];
    var state2 = [
        [0, 1, 0, 0],
        [0, 1, 1, 0],
		[0, 0, 1, 0],
		[0, 0, 0, 0]
    ];
	var state3 = [
        [0, 0, 0, 0],
        [0, 1, 1, 0],
		[1, 1, 0, 0],
		[0, 0, 0, 0]
    ];
	var state4 = [
        [1, 0, 0, 0],
        [1, 1, 0, 0],
		[0, 1, 0, 0],
		[0, 0, 0, 0]
    ];

	// Rotation point offsets: clockwise<point1, point2>, counterclockwise<point3, point4>, <newline>
	// In guidline Tetris each piece has 5 possible rotation points with respect to each state/orientation. Iterate through all every rotation.
	var state1RotationPointsOffset = [ 
		0,  0,  0,  0,
		1,  0, -1,  0,
		1,  1, -1,  1,
		0, -2,  0, -2,
		1, -2, -1, -2
	];
	var state2RotationPointsOffset = [
		0,  0,  0,  0,
		1,  0,  1,  0,
		1, -1,  1, -1,
		0,  2,  0,  2,
		1,  2,  1,  2
	];
	var state3RotationPointsOffset = [
		0,  0,  0,  0,
		-1,  0,  1,  0,
		-1,  1,  1,  1,
		0, -2,  0, -2,
		-1, -2,  1, -2
	];
	var state4RotationPointsOffset = [
		0,  0,  0,  0,
		-1,  0, -1,  0,
		-1, -1, -1, -1,
		0,  2,  0,  2,
		-1,  2, -1,  2
	];

	this.rotationPoints = [state1RotationPointsOffset, state2RotationPointsOffset, state3RotationPointsOffset, state4RotationPointsOffset];
    this.states = [state1, state2, state3, state4];
    this.x = 4;
    this.y = -2
	this.originY = -2;
    this.flag = 'ZR';
}


/**
doesShapeOverlap
@param shape: tetris shape
@param matrix: game matrix
*/
var doesShapeOverlap = function(shape, matrix) {	
    var rows = matrix.length;
    var cols = matrix[0].length;
	var rotationDirection = 0;
	
    var isBoxInMatrix = function(box) {

		
        var x = shape.x + box.x;
        var y = shape.y + box.y;
		if(isNaN(x))return true;
		if(isNaN(y))return true;
		if(x < 0) return true;
		if(x > matrix.cols)return true;
		if(y > rows) return true;
		// todo: why is matrix not defined when piece popped from hold stack
		if(matrix[y] == undefined) return true;
        //console.log("matrix X Y: " + " " + x + " "+ y);
		return (matrix[y][x] != 0)
    };

	boxes = shape.getBoxes(shape.state);
	
	
	for (var i in boxes)
        if (isBoxInMatrix(boxes[i]))
            return true;
    
    return false;
};

/**
Is same on matrix
@param shape: tetris shape
@param hintPiece: hintPiece shape
@param matrix: game matrix
@param action:  'left','right','down','rotate'
*/
var isBoxesSame = function(shape, hintPiece) {	
    var isBoxSame = function(shapeBox, hintPieceBox) {

        var shapeX = shape.x + shapeBox.x;
        var shapeY = shape.y + shapeBox.y;
		var hintPieceX = hintPiece.x + hintPieceBox.x;
		var hintPieceY = hintPiece.y + hintPieceBox.y;

		if(shapeX == hintPieceX && shapeY == hintPieceY)
			return true;
		
		return false;
	};
	
    //var boxes =  action === 'rotate'?shape.getBoxes(shape.nextState()) : shape.getBoxes(shape.state);
    
	var boxes;
	var hintPieceBoxes;
	

	boxes = shape.getBoxes(shape.state);
	
	hintPieceBoxes = hintPiece.getBoxes(hintPiece.state);
	
	for (var i in boxes) {
        if (!isBoxSame(boxes[i], hintPieceBoxes[i])) {
            return false;
        }
    }
    return true;
};

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

	canMoveTo: function(shape, matrix) {
		if(!doesShapeOverlap(shape, matrix))
			return true;
		return false;
	},
	// 0 - no, 1 - up,left, 2 - up,right, 3 - down,left, 4 - down, right
	kickShape: function(matrix, rotationDirection) {

	let clone = Object.assign(Object.create(Object.getPrototypeOf(this)), this);
	
	for(var j = 0; j < 4; j++) {
		if(this.state == j) {
			clone.state = this.nextState(rotationDirection);
			var i = 0;
			if(rotationDirection == 1)
				i = 2;
			for(; i < 5*4; i+=4)
			{
				var shiftX = this.rotationPoints[j][i];
				var shiftY = this.rotationPoints[j][i+1];
				if(!isNaN(shiftY) && !isNaN(shiftX)) {
					clone.x = this.x + shiftX;
					clone.y = this.y - shiftY;
					if(this.canMoveTo(clone, matrix) == true) {
						this.state = clone.state;
						this.x = clone.x;
						this.y = clone.y;
						return;
					}
				}
			}	
		}
	
	}

		
	},
	//Rotate shape
	rotate: function(matrix) {

			this.kickShape(matrix, -1);

	},
	//Rotate shape clockwise
	rotateClockwise: function(matrix) {
		
			this.kickShape(matrix, 1);

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
		if(direction == 0) return this.state;
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
			new Audio('./dist/Click.ogg').play();
			this.x -= 1;
		}
	},
	//Move the shape to the right
	goRight: function(matrix) {
		if (isShapeCanMove(this, matrix, 'right')) {
			new Audio('./dist/Click.ogg').play();
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
	// check if piece is same on matrix
	isSameSRS: function(shape) {
		return isBoxesSame(this, shape)
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
	shape = new ShapeT();
	
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
// export randomShape;
// export getShape;

},{"./consts.js":2}],8:[function(require,module,exports){

var exports = module.exports = {};

var setCookie = function(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  var expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
};

var getCookie = function(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
};

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

// Deeper clone
var deepClone = function(copyObject) {
	return Object.assign(Object.create(Object.getPrototypeOf(copyObject)), copyObject);
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
exports.deepClone = deepClone;
exports.setCookie = setCookie;
exports.getCookie = getCookie;
// export $;
// export extend;
// export proxy;

},{}],9:[function(require,module,exports){
/**
 All dom definitions and actions
*/
var utils = require('./utils.js');
var consts = require('./consts.js');
// import * as utils from './utils.js';
// import * as consts from './const.js';

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
	side.style.height = 500 + 'px';
	hold.style.top = 10+'px';//preview.top + 10px pad

	
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
// export tetrisView;
},{"./consts.js":2,"./utils.js":8}]},{},[5]);
