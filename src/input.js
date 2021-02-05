
var gamepad = require('./gamepad.js');

var UserInputs = {
    init() {
        document.addEventListener('keydown', this.keyDown.bind(this));
        document.addEventListener('keyup', this.keyUp.bind(this));
    },

	updateGamepad() {
		this.gpButtons = gamepad.update();
	},
	
	incFrame() {
		this.frames++;
		this.nframe++;
	},
	incDeciframes() {
		this.nDeciframes++;
		this.nDeciframesKey++;
	},
	processGamepadInput() {
		
		this.gamepadDown("DPad-Left");
		this.gamepadDown("DPad-Right");
		this.gamepadDown("DPad-Down");
		
		return;
	},
	processButtons() {
		this.gamepadButtonsDown("RB");
		this.gamepadButtonsDown("LB");
		this.gamepadButtonsDown("A");
		this.gamepadButtonsDown("B");
		//this.gamepadButtonsDown("X");
		//this.gamepadButtonsDown("Y");
		return;
	},
	
	//  X, Y, A, B , RB, LB Buttons
	gamepadButtonsDown(finds) {
		var deciDAS = 10;
		var deciARR = 10;
		var isContained = this.gpButtons.includes(finds);
		var isPrevContained = this.prevGpButtons.includes(finds);

		if(isPrevContained != isContained ) {
			this.isGamepadButtonDown = false;
			// Do once
			if(isContained)
				this.gamepadQueue.push(finds);
		}
		
		if (!this.isGamepadButtonDown) {

				if (this.nDeciframes >= deciDAS) {
					this.nDeciframes = 0;
					this.isGamepadButtonDown = true;
				}
				
		} else {
			if (this.nDeciframes >= deciARR && isContained) {
				this.gamepadQueue.push(finds);
				this.nDeciframes = 0;
			}
		}
			
	},
	
	// Direction Pad
	gamepadDown(finds) {
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
	processKeyShift() {
		this.processInput(39);  // right
		this.processInput(37);	// left
		this.processInput(40);  // down
	},
	// keyboard keys z,x,space
	processKeyDown(key)
	{
		var deciDAS = 10;
		var deciARR = 9;


	if(this.prevKeyboardKeys[key] != this.keyboardKeys[key]) {
		this.isKeyDown = false;
		if(this.keyboardKeys[key] == true)
			this.inputqueue.push(key);
	}
	
		if (!this.isKeyDown) {
				if (this.nDeciframesKey >= deciDAS) {
					this.nDeciframesKey = 0;
					this.isKeyDown = true;
				}
		} else {
			if (this.nDeciframesKey >= deciARR && this.keyboardKeys[key] == true) {
				this.inputqueue.push(key);
				this.nDeciframesKey = 0;
			}
		}
		
		
		
	},
	// Direction arrows
    processInput(key) {
		var DAS = 10;
		var ARR = 3;

		if(this.prevKeyboardKeys[key] != this.keyboardKeys[key]) {
			this.held = false;
			if(this.keyboardKeys[key] == true)
				this.inputqueue.push(key);
		}
		
            if (!this.held) {
                if (this.frames >= DAS) {
                    this.frames = 0;
                    this.held = true;
                }
            } else {
                if (this.frames >= ARR && this.keyboardKeys[key] == true) {
                    this.inputqueue.push(key);
                    this.frames = 0;
                }
            }
        //}
    },
    keyDown(event) {
		this.keyboardKeys[event.keyCode] = true;
    },
    keyUp(event) {
		this.nDeciframesKey = 0;
		this.isKeyDown = false;
		this.keyboardKeys[event.keyCode] = false;
    },
	gamepadButtonClear() {
		gpButtons = [];
		nDeciframes = 0;
		isGamepadDown = false;
		isGamepadButtonDown = false;
		gamepadQueue = [];
	},
	saveButtons() {
		//console.log(this.gpButtons);
	this.prevGpButtons = this.gpButtons;
	this.prevKeyboardKeys = this.keyboardKeys;
	//console.log("prev:  " + preGpButtons);
	},
	saveKeyboardKeys() {
		this.prevKeyboardKeys = {...this.keyboardKeys};
	},
    isDown: false,
	isKeyDown: false,
	isGamepadDown: false,
	isGamepadButtonDown: false,
	held: false,
	nframe: 0,
	frames: 0,
	nDeciframes: 0,
	nDeciframesKey: 0,
	gpButtons: [],
	prevGpButtons:[],
	keyboardKeys: [],
	prevKeyboardKeys: [],
    inputqueue: [],
	gamepadQueue: []
};

module.exports = UserInputs;