
var gamepad = require('./gamepad.js');

const gamepadLeftPressedEvent = new Event('leftPressed'); 
//const gamepadRightPressedEvent = new Event('rightPressed');
//const gamepadUpPressedEvent = new Event('upPressed');
//const gamepadPressedEvent = new Event('leftPressed');

var UserInputs = {
    init() {
        document.addEventListener('keydown', this.keyDown.bind(this));
        document.addEventListener('keyup', this.keyUp.bind(this));
    },

	updateGamepad() {
		this.gpButtons = gamepad.update();
	},
	
	incFrame() {
		this.nframe++;
	},
	incDeciframes() {
		this.nDeciframes++;
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
		var isContained = this.gpButtons.includes(finds);
				
		if (!this.isGamepadButtonDown) {
				if (this.nDeciframes >= 20) {
					this.nDeciframes = 0;
					this.isGamepadButtonDown = true;
				}
		} else {
			if (this.nDeciframes >= 40 && isContained) {
					
					//console.log("Pushdown: " + finds);
				this.gamepadQueue.push(finds);
				this.nDeciframes = 0;
			}
		}
			
	},
	gamepadDown(finds) {

		var DAS = 8;
		var ARR = 5;
		var isContained = this.gpButtons.includes(finds);
		
		var isDas = true; //this.gpButtons.includes("DPad-Left") || this.gpButtons.includes("DPad-Right") || 
		this.gpButtons.includes("DPad-Up") || this.gpButtons.includes("DPad-Down");
		
		

	
		if(isDas) {
			//console.log("frame no.: " + this.nframe + this.isGamepadDown);
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
    processInput() {

		var DAS = 4;
		var ARR = 2;

        if (this.isDown.key == 65 || this.isDown.key == 68 || this.keyDown.key == 38) {
            return;
        }
			//console.log("Henlo: " + this.isDown.frames);
        if (this.isDown) {
			console.log("Henlo: " + this.isDown.key);
            this.isDown.frames++;

            if (!this.isDown.held) {
                if (this.isDown.frames == DAS) {
                    this.isDown.frames = 0;
                    this.isDown.held = true;
                }
            } else {
                if (this.isDown.frames == ARR) {
						
                    this.inputqueue.push(this.isDown.key);
                    this.isDown.frames = 0;
                }
            }
        }
    },
    keyDown(event) {
        if (this.isDown == false) {
            var key = {
                key: event.keyCode,
                held: false,
                frames: 0
            }
            this.isDown = key;
            this.inputqueue.push(this.isDown.key);
			
        }
    },
    keyUp(event) {
        this.isDown = false;
    },
    isDown: false,
	isGamepadDown: false,
	isGamepadButtonDown: false,
	nframe: 0,
	nDeciframes: 0,
	gpButtons: [],
    inputqueue: [],
	prevButton: "",
	gamepadQueue: []
};

module.exports = UserInputs;