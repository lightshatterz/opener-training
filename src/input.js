
var gamepad = require('./gamepad.js');

const gamepadLeftPressedEvent = new Event('leftPressed'); 
//const gamepadRightPressedEvent = new Event('rightPressed');
//const gamepadUpPressedEvent = new Event('upPressed');
//const gamepadPressedEvent = new Event('leftPressed');

var UserInputs = {
    init() {
        //document.addEventListener('keydown', this.keyDown.bind(this));
        //document.addEventListener('keyup', this.keyUp.bind(this));
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
	gamepadButtonsDown(finds) {
		var deciDAS = 3;
		var deciARR = 12;
		var isContained = this.gpButtons.includes(finds);
				
		if (!this.isGamepadButtonDown) {
				if (this.nDeciframes >= deciDAS) {
					this.nDeciframes = 0;
					this.isGamepadButtonDown = true;
					//if(isContained)
					//	this.gamepadQueue.push(finds);
				}
		} else {
			if (this.nDeciframes >= deciARR && isContained) {
				this.gamepadQueue.push(finds);
				this.nDeciframes = 0;
			}
		}
			
	},
	gamepadDown(finds) {
		var DAS = 5;
		var ARR = 4;
		var isContained = this.gpButtons.includes(finds);
		var isDas = true; //this.gpButtons.includes("DPad-Left") || this.gpButtons.includes("DPad-Right") || 
		//this.gpButtons.includes("DPad-Up") || this.gpButtons.includes("DPad-Down");
		
	
		if(isDas) {
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
	processKeyDown(key)
	{
		var deciDAS = 2;
		var deciARR = 8;


		if (!this.isKeyDown) {
				if (this.nDeciframesKey >= deciDAS) {
					this.nDeciframesKey = 0;
					this.isKeyDown = true;
					if(this.keyboardKeys[key] == true)
						this.inputqueue.push(key);
				}
		} else {
			if (this.nDeciframesKey >= deciARR && this.keyboardKeys[key] == true) {
				this.inputqueue.push(key);
				this.nDeciframesKey = 0;
			}
		}
		
		
		
	},
    processInput(key) {
		var DAS = 1;
		var ARR = 4;

		
       /* if (this.isDown.key == 88 || this.isDown.key == 90 || this.isDown.key == 32) {
            //this.processKeys();
			return;
        }*/
		
       // if (this.isDown) {
            //this.frames++;

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
		isGamepadDown = false;
		isGamepadButtonDown = false;
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
	keyboardKeys: [],
    inputqueue: [],
	gamepadQueue: []
};

module.exports = UserInputs;