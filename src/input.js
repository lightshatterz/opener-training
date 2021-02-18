
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
		this.gamepadButtonsDown("Back");
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
				//this.gamepadQueue.push(finds);
				this.gamepadButtonsDeciFrames = 0;
			}
		}
			
	},
	
	// Direction Pad
	gamepadDPadDown(finds) {
		var DAS = 30.0;
		var ARR = 20.0;
		var isContained = this.gpButtons.includes(finds);
		var isPrevContained = this.prevGpButtons.includes(finds);
		
		if(isPrevContained != isContained ) {
			this.isGamepadDown = false;
			// Do once
			if(isContained)
				this.gamepadQueue.push(finds);
		}
		var gamepadDirectionDasFrames = this.gamepadDirectionPadDeciFrames / 1.0;
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
	processKeys() {
		this.processKeyDown(32);  // Space
		this.processKeyDown(88);  // X
		this.processKeyDown(90);  // Z
		this.processKeyDown(16);  // shift
		this.processKeyDown(17);  // ctrl
		this.processKeyDown(81);  // q
		this.processKeyDown(82);  // r
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
		this.processKeyboardArrowKeys(39);  // right
		this.processKeyboardArrowKeys(37);	// left
		this.processKeyboardArrowKeys(40);  // down
	},
	// Direction arrows
    processKeyboardArrowKeys(key) {		
		var DAS = 50.0;
		var ARR = 20.0;

	
		if(this.prevKeyboardKeys[key] != this.keyboardKeys[key]) {
			this.isDirectionArrowDown = false;
			if(this.keyboardKeys[key] == true)
				this.inputqueue.push(key);
		}
		
		
		var keyboardDASFrames = this.keyboardDirectionArrowsDeciframes / 1.0; // why isnt this 10?
		
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
	gamepadQueue: []
};

module.exports = UserInputs;