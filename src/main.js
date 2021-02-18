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
	setTKIFonzieVar: function()
	{
		this.reset();
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
		this.prevInputTime = this.startTime;
		this.shapeQueue = [];
		this.hintQueue = [];
		this.holdQueue = [];
		this.canPullFromHoldQueue = false;
        clearMatrix(this.matrix);
        views.setLevel(this.level);
        views.setScore(this.score);
        views.setGameOver(this.isGameOver);

        this._draw();
    },
    //Start game
    start: function() {
        this.running = true;
		window.requestAnimationFrame(utils.proxy(this._refresh, this));
	//window.requestAnimationFrame(utils.proxy(this._refresh, this));}

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


	/*_processCollisions: function {
	},*/
    // Draw game data
    _draw: function() {
        canvas.drawScene();
        canvas.drawShape(this.shape);
		canvas.drawHoldShape(this.holdQueue);
		canvas.drawPreviewShape(this.shapeQueue);
		canvas.drawHintShape(this.hintMino);
		if(this.shape != undefined) {


		let clone = Object.assign(Object.create(Object.getPrototypeOf(this.shape)), this.shape);
		
		//todo: put in collision detsction
		var bottomY = clone.bottomAt(this.matrix);
		//clone.color = "#ffffff";
		canvas.drawGhostShape(clone, bottomY);
		}
        canvas.drawMatrix(this.matrix);
    },
	// Render Shape
	_renderShape: function()
	{
		this._draw();
	},
	_processInput: async function(deltaTime) {
	
		var tenthOfFrame = 1.6//1;//1.6; // 1.6ms = 1 fram
		var halfFrame = 8.0//5;//8.0;
		var halfFramePlus = 10.0;//10.0;
		
		// TODO: put in web worker--limited to 60fps here
		if(deltaTime >= tenthOfFrame) {	//  needs to be 600hz // 16 / 10
			inputs.incDeciframes();
			//console.log(deltaTime / 600.0);
		}
		
		if(deltaTime >= tenthOfFrame) {
			inputs.updateGamepad();
			inputs.processGamepadDPad();
			inputs.processGamepadInput();
		}
		
		// drain gamepad queue
		if(deltaTime > halfFrame)  // 8 millisecons
		{
			while((inputs.gamepadQueue != undefined && inputs.gamepadQueue.length >= 1)){
				var curkey = inputs.gamepadQueue.shift();
				if(curkey == "DPad-Left") {
					this.shape.goLeft(this.matrix);
					this._renderShape();
				}
				if(curkey == "DPad-Right") {
					this.shape.goRight(this.matrix);
					this._renderShape();
				}
				if(curkey == "A") {
					this.shape.rotate(this.matrix);
					this._renderShape();
					//this._draw();
				}
				if(curkey == "B") {
					this.shape.rotateClockwise(this.matrix);
					this._renderShape();
					//this._draw();
				}
				if(curkey == "DPad-Down") {
					 this.shape.goDown(this.matrix);
					 this._renderShape();
					 //this._draw();
				}
				if(curkey == "RB") {
					this.shape.goBottom(this.matrix);
					this._update();
				}
				if(curkey == "LB") {
					this.pushHoldStack();
					//this._renderShape();
					this._update();
				}				
				if(curkey == "DPad-Up") {
					this.popHoldStack();
					//this._renderShape();
					this._update();
				}
				if(curkey == "Back") {
					// this.hintMino = [] ?
					// this.shape = []
					this._restartHandler();
					return;
				}
			}
			
			inputs.gamepadQueue = [];
		}
		//inputs.gamepadButtonClear();
		
		// Do keyboard
		if(deltaTime > tenthOfFrame)		// 120hz
		{
			inputs.processKeys();
		}
		
		if (deltaTime > tenthOfFrame) {  // 60hz
			inputs.processKeyShift();
			// Keyboard inputs
			while((inputs.inputqueue != undefined && inputs.inputqueue.length >= 1)){
				var curkey = inputs.inputqueue.shift();
				if(curkey == 37) {
					this.shape.goLeft(this.matrix);
					this._renderShape();
				}
				if(curkey == 39){
					this.shape.goRight(this.matrix);
					this._renderShape();
				}
				if(curkey == 40) {
					 this.shape.goDown(this.matrix);
					 this._renderShape();
				}
				if(curkey == 90) {
					this.shape.rotate(this.matrix);
					this._renderShape();
				}
				if(curkey == 88){
					this.shape.rotateClockwise(this.matrix);;
					this._renderShape();
				}
				if(curkey == 32) {
					this.shape.goBottom(this.matrix);
					//this._renderShape();
					this._update();
				}
				if(curkey == 16) {
					this.pushHoldStack();
					//this._renderShape();
					this._update();
				}
				if(curkey == 17) {
					this.popHoldStack();
					//this._renderShape();
					this._update();
				}
				if(curkey == 81) {
					if(document.getElementById("bg").style.display == "none")
						document.getElementById("bg").style.display =  "initial";
					else
						document.getElementById("bg").style.display="none";
				}
				if(curkey == 82) {
					views.setGameOver(true);
					this._restartHandler();
					return;
				}
					
			}
			inputs.inputqueue = [];
		}
		
		
		if(deltaTime >= halfFramePlus)
			inputs.saveKeyboardKeys();
		
		if(deltaTime >= tenthOfFrame)
			inputs.saveButtons();
		
	},		
	sleep: function(ms) {
	  return new Promise(resolve => setTimeout(resolve, ms));
	},
    // Refresh game canvas
    _refresh: async function() {

		if (!this.running) {
            return;
        }
		
		this.currentTime = new Date().getTime();
		
		
		var curInputTime = new Date().getTime();
		var prevCounterTime = curInputTime;
		var deltaInputTime = 0;
		var deltaCounterTime = 0;
		
		// Process input as many times as possible in a frame--60hz hopefully
		while(deltaCounterTime <= 16) {		// 16.666ms = 1 frame	
			deltaCounterTime = curInputTime - prevCounterTime;
			deltaInputTime = curInputTime - this.prevInputTime;
			this._processInput(deltaInputTime);
			await this.sleep(1);
			curInputTime = new Date().getTime();
		}
		
		this.prevInputTime = curInputTime;
		var deltaLevelTime = this.currentTime - this.prevTime;
		
	

		
		//if(deltaGameTime < 16) this._refresh();
		
		// Render Level
		
		
        if (deltaLevelTime > this.interval) {
            this._update();
            this._checkLevel(this.prevTime = this.currentTime);
        }
		
		// Draw Frame
        if (!this.isGameOver) {
            window.requestAnimationFrame(utils.proxy(this._refresh, this));
        }
		

    },
    // Update game data
    _update: function() {
		
        if (this.shape.canDown(this.matrix)) {
            this.shape.goDown(this.matrix);
        } else {
			this.canPullFromHoldQueue = true;
            this.shape.copyTo(this.matrix);
            this._check();
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