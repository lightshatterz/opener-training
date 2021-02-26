var gamepad = require('./gamepad.js');
var utils = require('./utils.js');
// import * as gamepad from './gamepad.js';

var UserInputs = {
	init() {
		this.settingsMap = new Map();		
		var options = "";
		// var init = utils.getCookie("init");
		// if(init == "") 
			for(var i in this.settingsList) 
				utils.setCookie(this.settingsList[i], this.settingsDefault[i], 30); //  cookies expire in 30 days
				
			
			
		// else
			// for(var i in this.settingsList)
				// this.settingsDefault[i] = utils.getCookie(this.settingsList[i]);
			
		 for(var i in this.settingsList)
			 this.settingsMap.set(this.settingsList[i], this.settingsDefault[i]);
		 

		
		//document.getElementById("setting").innerHTML = settings;
		
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
		// this.gamepadButtonsDown("RB");	// hard drop
		// this.gamepadButtonsDown("LB");	// hold
		// this.gamepadButtonsDown("A");	// rotate counter
		// this.gamepadButtonsDown("B");	// rotate cwise
		// this.gamepadButtonsDown("DPad-Up"); // Pop hold stack
		// this.gamepadButtonsDown("Back");	// reset
		//this.gamepadButtonsDown("X");
		//this.gamepadButtonsDown("Y");
		
		this.gamepadButtonsDown(this.settingsMap.get("gamepad_harddrop"));	// hard drop
		this.gamepadButtonsDown(this.settingsMap.get("gamepad_hold"));	// hold
		this.gamepadButtonsDown(this.settingsMap.get("gamepad_rotateccw"));	// rotate counter
		this.gamepadButtonsDown(this.settingsMap.get("gamepad_rotate"));	// rotate cwise
		this.gamepadButtonsDown(this.settingsMap.get("gamepad_pophold")); // Pop hold stack
		this.gamepadButtonsDown(this.settingsMap.get("gamepad_reset"));	// reset

		
		return;
	},
	
	processGamepadDPad() 
	{
		this.gamepadDPadDown(this.settingsMap.get("gamepad_left"));	// shift left
		this.gamepadDPadDown(this.settingsMap.get("gamepad_right"));	// shift right
		this.gamepadDPadDown(this.settingsMap.get("gamepad_down"));	// down
		
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
		var DAS = parseInt(this.settingsMap.get("gamepad_das"));	//65.0;
		var ARR = parseInt(this.settingsMap.get("gamepad_arr"));	//20.0;
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
	processKeys() {
		this.processKeyDown(parseInt(this.settingsMap.get("keyboard_harddrop")));		 //32);  // Space	- hard drop
		this.processKeyDown(parseInt(this.settingsMap.get("keyboard_rotate")));		//88);  // X		- rotate
		this.processKeyDown(parseInt(this.settingsMap.get("keyboard_rotateccw")));		//90);  // Z		- rotateccw
		this.processKeyDown(parseInt(this.settingsMap.get("keyboard_hold")));		//16);  // shift	- push hold stack
		this.processKeyDown(parseInt(this.settingsMap.get("keyboard_pophold")));	// ctrl	- pop hold stack
		this.processKeyDown(parseInt(this.settingsMap.get("keyboard_background")));  // q		- turn off background
		this.processKeyDown(parseInt(this.settingsMap.get("keyboard_reset"))); 		 // r		- reset
		//this.processKeyDown(this.settingsMap.get("keyboard_hold")));  // c		- pop hold stack
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
		this.processKeyboardArrowKeys(parseInt(this.settingsMap.get("keyboard_left")));		//39);  // right
		this.processKeyboardArrowKeys(parseInt(this.settingsMap.get("keyboard_right")));		//37);	// left
		this.processKeyboardArrowKeys(parseInt(this.settingsMap.get("keyboard_down")));  // down
	},
	// Direction arrows
    processKeyboardArrowKeys(key) {		
		var DAS = parseInt(this.settingsMap.get("keyboard_das"));	//65.0;
		var ARR = parseInt(this.settingsMap.get("keyboard_arr"));	//20.0;

	
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
	// todo: change to human readable
	settingsList: ["init", 
					"keyboard_das", "keyboard_arr", "keyboard_harddrop", "keyboard_hold", 
					"keyboard_left", "keyboard_right", "keyboard_rotateccw", "keyboard_rotate", 
					"keyboard_down", "keyboard_pophold", "keyboard_reset", "keyboard_background",
					
					"gamepad_das", "gamepad_arr", "gamepad_harddrop", "gamepad_hold",
					"gamepad_left", "gamepad_right", "gamepad_rotateccw", "gamepad_rotate", 
					"gamepad_down","gamepad_pophold", "gamepad_reset", "gamepad_background", 
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