
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
		this.nDeciframes++;
		this.nDeciframesKey++;
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
		
		this.gamepadDPadDown("DPad-Left");
		this.gamepadDPadDown("DPad-Right");
		this.gamepadDPadDown("DPad-Down");
		
		return;
	},
	/*
	processButtons() {

		return;
	},
	*/
	
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
		var DAS = 7;
		var ARR = 3;
		var isContained = this.gpButtons.includes(finds);
		var isPrevContained = this.prevGpButtons.includes(finds);

		if(isPrevContained != isContained ) {
			this.isGamepadDown = false;
			// Do once
			//if(isContainted)
			//	this.gamepadQueue.push(finds);
		}
			if (!this.isGamepadDown) {
					if (this.nframe >= DAS) {
						this.nframe = 0;
						this.isGamepadDown = true;
					}
			} else {
				if (this.nframe >= ARR && isContained) {
					this.gamepadQueue.push(finds);
					this.nframe = 0;
				}
			}
		
		
		return;
	},
	processKeys() {
		this.processKeyDown(32);  // Space
		this.processKeyDown(88);  // X
		this.processKeyDown(90);  // Z
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