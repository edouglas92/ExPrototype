//////////////////Debugging/Game Logic//////////////////////////

var timers = {
	primaryUnit: 10,
	primaryDrop1: 6,
	primaryDrop2: 8,
	secondaryConvert: 7,
	secondaryDrop: 5,
	terminalDrop: 30
};

var capacities = {
	primary: 50,
	secondary: 50,
	terminal: 75
};

var displayCounts = false;

////////////////////////////////////////////////////////////////

var game = { };

game.clickPrimHub = function(hub){
	return function(layer) {
		if (!game.gameOver && !game.paused) {
			var hubSelected = hub.selected;
			$.each(game.primaryHubs, function(idx, pHub){
				pHub.selected = false;
				pHub.colouring = pHub.colour;
			});
			hub.selected = !hubSelected;
			if (hub.selected) {
				hub.colouring = "dark"+hub.colour;
			} else {
				if (hub.connected) {
					hub.connected = false;
					if (hub.connection.primOneConnection == hub) {
						hub.connection.primOneConnection = null;
						hub.connection.primOneConnected = false;
					} else {
						hub.connection.primTwoConnection = null;
						hub.connection.primTwoConnected = false;
					}
					hub.connection = null;
				}
				if (hub.connected2) {
					hub.connected2 = false;
					if (hub.connection2.primOneConnection == hub) {
						hub.connection2.primOneConnection = null;
						hub.connection2.primOneConnected = false;
					} else {
						hub.connection2.primTwoConnection = null;
						hub.connection2.primTwoConnected = false;
					}
					hub.connection2 = null;
				}
				hub.colouring = hub.colour;
			}
		}
	}
};

game.clickSecHub = function(hub){
	return function(layer) {
		if (!game.gameOver && !game.paused) {
			var hubSelected = hub.selected;
			$.each(game.secondaryHubs, function(idx, sHub){
				sHub.selected = false;
				sHub.colouring = sHub.colour;
			});
			hub.selected = !hubSelected;
			if (hub.selected) {
				var isPrimSelected = false;
				$.each(game.primaryHubs, function(idx, pHub){
					if (!pHub.connected && pHub.selected && !hub.isFull) {
						if ((pHub.colour == hub.primOne) && !hub.pOneFull) {
							hub.primOneConnected = true;
							hub.primOneConnection = pHub;
							pHub.connected = true;
							pHub.connection = hub;
							pHub.selected = false;
							hub.selected = false;
							pHub.colouring = pHub.colour;
							isPrimSelected = true;
						} else if ((pHub.colour == hub.primTwo) && !hub.pTwoFull) {
							hub.primTwoConnected = true;
							hub.primTwoConnection = pHub;
							pHub.connected = true;
							pHub.connection = hub;
							pHub.selected = false;
							hub.selected = false;
							pHub.colouring = pHub.colour;
							isPrimSelected = true;
						}
					} else if (pHub.connected && !pHub.connected2 && pHub.selected && !hub.isFull) {
						if ((pHub.colour == hub.primOne) && !hub.pOneFull) {
							hub.primOneConnected = true;
							hub.primOneConnection = pHub;
							pHub.connected2 = true;
							pHub.connection2 = hub;
							pHub.selected = false;
							hub.selected = false;
							pHub.colouring = pHub.colour;
							isPrimSelected = true;
						} else if ((pHub.colour == hub.primTwo) && !hub.pTwoFull) {
							hub.primTwoConnected = true;
							hub.primTwoConnection = pHub;
							pHub.connected2 = true;
							pHub.connection2 = hub;
							pHub.selected = false;
							hub.selected = false;
							pHub.colouring = pHub.colour;
							isPrimSelected = true;
						}
					}
				});
				if (!isPrimSelected) {
					hub.colouring = "dark"+hub.colour;
				}
			} else {
				if (hub.connected) {
					hub.connected = false;
					hub.connection.connected = false;
					hub.connection.connection = null;
					hub.connection = null;
				}
				hub.colouring = hub.colour;
			}
		}
	}
};

game.clickTermHub = function(hub){
	return function(layer) {
		if (!game.gameOver && !game.paused) {
			$.each(game.secondaryHubs, function(idx, sHub){
				if (!sHub.connected && sHub.selected && sHub.units > 0) {
					if (sHub.colour == hub.colour && !hub.isFull) {
						hub.connected = true;
						hub.connection = sHub;
						sHub.connected = true;
						sHub.connection = hub;
						sHub.selected = false;
						sHub.colouring = sHub.colour;
					}
				}
			});
		}
	}
};

game.clickArrow1 = function(hub){
	return function(layer){
		if (hub.connected){
			hub.connection.connected = false;
			hub.connection.connection = null;
			hub.connection = null;
			hub.connected = false;
		}
	}
};

game.clickArrow2 = function(hub){
	return function(layer){
		if (hub.connected2){
			hub.connection2.connected = false;
			hub.connection2.connection = null;
			hub.connection2 = null;
			hub.connected2 = false;
		}
	}
};

game.initializeHub = function(xcoord, ycoord, cap, clr, num){
	var hub = {
		xpos: xcoord,
		ypos: ycoord,
		radius: 50,
		colour: clr,
		colouring: clr,
		units: 0,
		capacity: cap,
		isFull: false,
		selected: false,
		connected: false,
		connection: null,
		fillRadius: 0,
		isPrimary: true,
		fillLayer: clr+"Fill"+num.toString(),
		countLayer: clr+"Count"+num.toString(),
		arrowLayer: clr+"Arrow"+num.toString()
	};
	$('canvas').drawLine({
		layer: true, name: hub.arrowLayer,
  		strokeStyle: hub.colour,
  		strokeWidth: 10,
  		visible: false,
  		rounded: true,
  		startArrow: false,
  		arrowRadius: 1,
  		x1: hub.xpos, y1: hub.ypos,
  		x2: hub.xpos, y2: hub.ypos,
  		click: game.clickArrow1(hub)
	});
	return hub;
};

game.initializePrimaryHub = function(xcoord, ycoord, cap, clr, num){
	var hub = this.initializeHub(xcoord, ycoord, cap, clr, num);
	hub.unitTimer = timers.primaryUnit;
	hub.connected2 = false;
	hub.connection2 = null;
	hub.dropTimer = timers.primaryDrop1;
	hub.dropTimer2 = timers.primaryDrop2;
	$('canvas').drawLine({
		layer: true, name: hub.arrowLayer+"2",
  		strokeStyle: hub.colour,
  		strokeWidth: 10,
  		visible: false,
  		rounded: true,
  		startArrow: false,
  		arrowRadius: 1,
  		x1: hub.xpos, y1: hub.ypos,
  		x2: hub.xpos, y2: hub.ypos,
  		click: game.clickArrow2(hub)
	})
	.drawArc({
		layer: true,
		strokeStyle: hub.colour,
  		strokeWidth: 2,
  		x: hub.xpos, y: hub.ypos,
  		radius: hub.radius,
  		click: game.clickPrimHub(hub)
	})
	.drawArc({
		layer: true, name: hub.fillLayer,
		fillStyle: hub.colouring,
  		x: hub.xpos, y: hub.ypos,
  		radius: hub.fillRadius,
  		click: game.clickPrimHub(hub)
	})
	.drawText({
		layer: true,
		name: hub.countLayer,
		fillStyle: hub.colour,
		strokeStyle: 'black',
		strokeWidth: 1,
		x: hub.xpos, y: hub.ypos,
		fontSize: 34,
		fontFamily: 'Arial',
		visible: displayCounts,
		text: hub.units.toString(),
		click: game.clickPrimHub(hub)
	});
	return hub
};

game.addRedHub = function(xcoord, ycoord, cap){
	this.redHubs += 1;
	this.primaryHubs.push(this.initializePrimaryHub(
		xcoord, ycoord, cap, "red", this.redHubs));
};

game.addBlueHub = function(xcoord, ycoord, cap){
	this.blueHubs += 1;
	this.primaryHubs.push(this.initializePrimaryHub(
		xcoord, ycoord, cap, "blue", this.blueHubs));
};

game.addYellowHub = function(xcoord, ycoord, cap){
	this.yellowHubs += 1;
	this.primaryHubs.push(this.initializePrimaryHub(
		xcoord, ycoord, cap, "yellow", this.yellowHubs));
};

game.initializeSecondaryHub = function(xcoord, ycoord, cap, clr, pclr1, pclr2, num){
	var hub = this.initializeHub(xcoord, ycoord, cap, clr, num);
	hub.convertTimer = timers.secondaryConvert;
	hub.dropTimer = timers.secondaryDrop;
	hub.isPrimary = false;
	hub.isSecondary = true;
	hub.primOne = pclr1;
	hub.primTwo = pclr2;
	hub.primOneConnected = false;
	hub.primOneConnection = null;
	hub.primTwoConnection = null;
	hub.primTwoConnected = false;
	hub.pOneCount = 0;
	hub.pTwoCount = 0;
	hub.pOneFull = false;
	hub.pTwoFull = false;
	hub.pOneFill = 0;
	hub.pTwoFill = 0;
	hub.pOneLayer = clr+num.toString()+pclr1+"Fill"+num.toString();
	hub.pTwoLayer = clr+num.toString()+pclr2+"Fill"+num.toString();
	hub.pOneCountLayer = clr+num.toString()+pclr1+"SecCount"+num.toString();
	hub.pTwoCountLayer = clr+num.toString()+pclr2+"SecCount"+num.toString();
	var clrText = hub.colour;
	if (clrText == "violet") {
		clrText = "purple";
	}
	var hubPrimOne = hub.primOne;
	var hubPrimTwo = hub.primTwo;
	if (hub.primOne == "yellow") {
		hubPrimOne = "gold";
	}
	if (hub.primTwo == "yellow") {
		hubPrimTwo = "gold";
	}
	$('canvas').drawArc({
		layer: true,
		strokeStyle: hub.colour,
  		strokeWidth: 2,
  		x: hub.xpos, y: hub.ypos,
  		radius: hub.radius,
  		click: game.clickSecHub(hub)
	})
	.drawArc({
		layer: true, name: hub.pOneLayer,
		opacity: 0.4,
		fillStyle: hub.primOne,
  		x: hub.xpos, y: hub.ypos,
  		radius: hub.pOneFill,
  		click: game.clickSecHub(hub)
	})
	.drawArc({
		layer: true, name: hub.pTwoLayer,
		opacity: 0.3,
		fillStyle: hub.primTwo,
  		x: hub.xpos, y: hub.ypos,
  		radius: hub.pTwoFill,
  		click: game.clickSecHub(hub)
	})
	.drawArc({
		layer: true, name: hub.fillLayer,
		fillStyle: hub.colouring,
  		x: hub.xpos, y: hub.ypos,
  		radius: hub.fillRadius,
  		click: game.clickSecHub(hub)
	})
	.drawText({
		layer: true,
		name: hub.countLayer,
		fillStyle: hub.colour,
		strokeStyle: 'black',
		strokeWidth: 1,
		x: hub.xpos, y: hub.ypos-20,
		fontSize: 18,
		fontFamily: 'Arial',
		visible: displayCounts,
		text: clrText+": "+hub.units.toString(),
		click: game.clickSecHub(hub)
	})
	.drawText({
		layer: true,
		name: hub.pOneCountLayer,
		fillStyle: hubPrimOne,
		strokeStyle: hubPrimOne,
		strokeWidth: 1,
		x: hub.xpos, y: hub.ypos,
		fontSize: 18,
		fontFamily: 'Arial',
		visible: displayCounts,
		text: hub.primOne+": "+hub.pOneCount.toString(),
		click: game.clickSecHub(hub)
	})
	.drawText({
		layer: true,
		name: hub.pTwoCountLayer,
		fillStyle: hubPrimTwo,
		strokeStyle: hubPrimTwo,
		strokeWidth: 1,
		x: hub.xpos, y: hub.ypos+20,
		fontSize: 18,
		fontFamily: 'Arial',
		visible: displayCounts,
		text: hub.primTwo+": "+hub.pTwoCount.toString(),
		click: game.clickSecHub(hub)
	});
	return hub
};

game.addPurpleHub = function(xcoord, ycoord, cap) {
	this.purpleHubs += 1;
	this.secondaryHubs.push(this.initializeSecondaryHub(
		xcoord, ycoord, cap, "violet", "red", "blue", this.purpleHubs));
};

game.addGreenHub = function(xcoord, ycoord, cap) {
	this.greenHubs += 1;
	this.secondaryHubs.push(this.initializeSecondaryHub(
		xcoord, ycoord, cap, "green", "blue", "yellow", this.greenHubs));
};

game.addOrangeHub = function(xcoord, ycoord, cap) {
	this.orangeHubs += 1;
	this.secondaryHubs.push(this.initializeSecondaryHub(
		xcoord, ycoord, cap, "orange", "red", "yellow", this.orangeHubs));
};

game.initializeTerminalHub = function(xcoord, ycoord, cap, clr, num){
	var hub = this.initializeHub(xcoord, ycoord, cap, clr, num);
	hub.dropTimer = timers.terminalDrop;
	hub.capacity = cap;
	hub.units = hub.capacity;
	hub.fillRadius = hub.radius;
	hub.isPrimary = false;
	hub.isSecondary = false;
	hub.isTerminal = true;
	hub.fillLayer = clr+"TFill"+num.toString(),
	hub.countLayer = clr+"TCount"+num.toString(),
	$('canvas').drawArc({
		layer: true,
		strokeStyle: hub.colour,
  		strokeWidth: 2,
  		x: hub.xpos, y: hub.ypos,
  		radius: hub.radius,
  		click: game.clickTermHub(hub)
	})
	.drawArc({
		layer: true, name: hub.fillLayer,
		fillStyle: hub.colouring,
  		x: hub.xpos, y: hub.ypos,
  		radius: hub.fillRadius,
  		click: game.clickTermHub(hub)
	})
	.drawText({
		layer: true,
		name: hub.countLayer,
		fillStyle: hub.colour,
		strokeStyle: 'black',
		strokeWidth: 1,
		x: hub.xpos, y: hub.ypos,
		fontSize: 34,
		fontFamily: 'Arial',
		visible: displayCounts,
		text: hub.units.toString(),
		click: game.clickTermHub(hub)
	});
	return hub;
};

game.addPurpleTerm = function(xcoord, ycoord, cap){
	this.purpleTerms += 1;
	this.terminalHubs.push(this.initializeTerminalHub(
		xcoord, ycoord, cap, "violet", this.purpleTerms));
};

game.addGreenTerm = function(xcoord, ycoord, cap){
	this.greenTerms += 1;
	this.terminalHubs.push(this.initializeTerminalHub(
		xcoord, ycoord, cap, "green", this.purpleTerms));
};

game.addOrangeTerm = function(xcoord, ycoord, cap){
	this.orangeTerms += 1;
	this.terminalHubs.push(this.initializeTerminalHub(
		xcoord, ycoord, cap, "orange", this.purpleTerms));
};

game.initialize = function(){
	$('canvas').removeLayers().clearCanvas();
	this.primaryHubs = [];
	this.secondaryHubs = [];
	this.terminalHubs = [];
	this.gameOver = false;
	this.paused = false;
	this.redHubs = 0;
	this.blueHubs = 0;
	this.yellowHubs = 0;
	this.purpleHubs = 0;
	this.greenHubs = 0;
	this.orangeHubs = 0;
	this.purpleTerms = 0;
	this.greenTerms = 0;
	this.orangeTerms = 0;
	this.addRedHub(100, 100, capacities.primary);
	this.addBlueHub(300, 100, capacities.primary);
	this.addYellowHub(500, 100, capacities.primary);
	this.addPurpleHub(200, 300, capacities.secondary);
	this.addGreenHub(400, 300, capacities.secondary);
	this.addOrangeHub(600, 300, capacities.secondary);
	this.addPurpleTerm(150, 520, capacities.terminal);
	this.addGreenTerm(350, 520, capacities.terminal);
	this.addOrangeTerm(550, 520, capacities.terminal);
	$('canvas').drawRect({
		layer: true,
		visible: false,
		name: "gameOverRec",
		fillStyle: 'black',
		strokeStyle: 'silver',
		strokeWidth: 4,
		x: 1575, y: 325,
		width: 320, height: 100
	})
	.drawText({
		layer: true,
		visible: false,
		name: "gameOverText",
		fillStyle: 'white',
		strokeStyle: 'silver',
		strokeWidth: 3,
		x: 1575, y: 325,
		fontSize: 48,
		fontFamily: 'Arial',
		text: "Game Over!"
	})
	.drawText({
		layer: true,
		name: "pauseText",
		fillStyle: 'white',
		strokeStyle: 'silver',
		strokeWidth: 2,
		x: 1100, y: 15,
		fontSize: 32,
		fontFamily: 'Arial',
		text: "Pause",
		click: function(layer){
			if (!game.gameOver) {
				game.paused = !game.paused;
				var pTxt = "Pause";
				var strStyle = 'silver';
				if (game.paused) {
					pTxt = "Play";
					strStyle = 'black';
				}
				$('canvas').setLayer("pauseText", {
					text: pTxt,
					strokeStyle: strStyle
				});
			}
		}
	});
};

game.drawPrimaryHubs = function(){
	$.each(this.primaryHubs, function(idx, hub){
		var hubClring = hub.colouring;
		if (hubClring == "darkyellow") {
			hubClring = "gold";
		}
		$('canvas').setLayer(hub.fillLayer, {
			fillStyle: hubClring,
  			radius: hub.fillRadius
		})
		.setLayer(hub.countLayer, {
			text: hub.units.toString()
		});
		if (hub.connected) {
			$('canvas').setLayer(hub.arrowLayer, {
				visible: true,
				x2: hub.connection.xpos,
				y2: hub.connection.ypos
			});
		} else {
			$('canvas').setLayer(hub.arrowLayer, {
				visible: false,
				x2: hub.xpos, y2: hub.ypos
			});
		}
		if (hub.connected2) {
			$('canvas').setLayer(hub.arrowLayer+"2", {
				visible: true,
				x2: hub.connection2.xpos,
				y2: hub.connection2.ypos
			});
		} else {
			$('canvas').setLayer(hub.arrowLayer+"2", {
				visible: false,
				x2: hub.xpos, y2: hub.ypos
			});
		}
	});
};

game.drawSecondaryHubs = function(){
	$.each(this.secondaryHubs, function(idx, hub){
		var clrText = hub.colour;
		if (clrText == "violet") {
			clrText = "purple";
		}
		$('canvas').setLayer(hub.fillLayer, {
			fillStyle: hub.colouring,
  			radius: hub.fillRadius
		})
		.setLayer(hub.pOneLayer, {
			fillStyle: hub.primOne,
  			radius: hub.pOneFill
		})
		.setLayer(hub.pTwoLayer, {
			fillStyle: hub.primTwo,
  			radius: hub.pTwoFill
		})
		.setLayer(hub.pOneCountLayer, {
			text: hub.primOne+": "+hub.pOneCount.toString()
		})
		.setLayer(hub.pTwoCountLayer, {
			text: hub.primTwo+": "+hub.pTwoCount.toString()
		})
		.setLayer(hub.countLayer, {
			text: clrText+": "+hub.units.toString()
		});
		if (hub.connected) {
			$('canvas').setLayer(hub.arrowLayer, {
				visible: true,
				x2: hub.connection.xpos,
				y2: hub.connection.ypos
			});
		} else {
			$('canvas').setLayer(hub.arrowLayer, {
				visible: false
			});
		}
	});
};

game.drawTerminals = function(){
	$.each(this.terminalHubs, function(idx, hub){
		$('canvas').setLayer(hub.fillLayer, {
			fillStyle: hub.colour,
  			radius: hub.fillRadius
		})
		.setLayer(hub.countLayer, {
			text: hub.units.toString()
		});
	});
};

game.drawHubs = function(){
	this.drawPrimaryHubs();
	this.drawSecondaryHubs();
	this.drawTerminals();
};

game.drawGameOver = function(){
	if (game.gameOver) {
		$('canvas').setLayer("gameOverRec", {
			visible: true,
			x: 575, y: 325
		});
		$('canvas').setLayer("gameOverText", {
			visible: true,
			x: 575, y: 325
		});
	}
};

game.draw = function(){
	this.drawHubs();
	this.drawGameOver();
	$('canvas').drawLayers();
};

game.updatePrimaryHub = function(pHub){
	if (pHub.units == 0) {
		if (pHub.connected) {
			var sHub = pHub.connection;
			sHub.connected = false;
			sHub.connection = null;
			pHub.connected = false;
			pHub.connection = true;
		}
		if (pHub.connected2) {
			var sHub = pHub.connection2;
			sHub.connected = false;
			sHub.connection = null;
			pHub.connected2 = false;
			pHub.connection2 = true;
		}
	}
	pHub.unitTimer -= 1;
	if ((pHub.unitTimer < 0) && !pHub.isFull) {
		pHub.units += 1;
		pHub.unitTimer = timers.primaryUnit;
		if (pHub.units == pHub.capacity) {
			pHub.isFull = true;
		}
	}
	if (pHub.connected && (pHub.units > 0)) {
		var sHub = pHub.connection;
		pHub.dropTimer -= 1;
		if (pHub.dropTimer < 0) {
			pHub.dropTimer = timers.primaryDrop1;
			pHub.units -= 1;
			pHub.isFull = false;
			if ((sHub.primOneConnection == pHub) && !sHub.pOneFull) {
				sHub.pOneCount += 1;
			}
			else if ((sHub.primTwoConnection == pHub) && !sHub.pTwoFull) {
				sHub.pTwoCount += 1;
			}
		}
	}
	if (pHub.connected2 && (pHub.units > 0)) {
		var sHub = pHub.connection2;
		pHub.dropTimer2 -= 1;
		if (pHub.dropTimer2 < 0) {
			pHub.dropTimer2 = timers.primaryDrop2;
			pHub.units -= 1;
			pHub.isFull = false;
			if ((sHub.primOneConnection == pHub) && !sHub.pOneFull) {
				sHub.pOneCount += 1;
			}
			else if ((sHub.primTwoConnection == pHub) && !sHub.pTwoFull) {
				sHub.pTwoCount += 1;
			}
		}
	}
};

game.updateSecondaryHub = function(sHub){
	if (sHub.pOneCount == sHub.capacity) {
		sHub.pOneFull = true;
	}
	if (sHub.pTwoCount == sHub.capacity) {
		sHub.pTwoFull = true;
	}
	if (sHub.units == sHub.capacity) {
		sHub.isFull = true;
	}
	if ((sHub.pTwoCount > 0) && (sHub.pOneCount > 0)) {
		sHub.convertTimer -= 1;
		if ((sHub.convertTimer < 0) && !sHub.isFull) {
			sHub.convertTimer = timers.secondaryConvert;
			sHub.units += 1;
			sHub.pOneCount -= 1;
			sHub.pTwoCount -= 1;
			sHub.pOneFull = false;
			sHub.pTwoFull = false;
		}
	}
	if ((sHub.pOneFull || sHub.isFull) && sHub.primOneConnected) {
		var pHub = sHub.primOneConnection;
		if (pHub.connection == sHub) {
			pHub.connected = false;
			pHub.connection = null;
		} else {
			pHub.connected2 = false;
			pHub.connection2 = null;
		}
		sHub.primOneConnection = null;
		sHub.primOneConnected = false;
	}
	if ((sHub.pTwoFull || sHub.isFull) && sHub.primTwoConnected) {
		var pHub = sHub.primTwoConnection;
		if (pHub.connection == sHub) {
			pHub.connected = false;
			pHub.connection = null;
		} else {
			pHub.connected2 = false;
			pHub.connection2 = null;
		}
		sHub.primTwoConnection = null;
		sHub.primTwoConnected = false;
	}
	if (sHub.connected) {
		var tHub = sHub.connection;
		if (sHub.units > 0) {
			sHub.dropTimer -= 1;
			if ((sHub.dropTimer < 0) && !tHub.isFull) {
				sHub.dropTimer = timers.secondaryDrop;
				sHub.units -= 1;
				tHub.units += 1;
				sHub.isFull = false;
			}
		} else {
			sHub.connected = false;
			tHub.connected = false;
			tHub.connection = null;
			sHub.connection = null;
		}
	}
	sHub.pOneFill = (sHub.pOneCount*sHub.radius)/sHub.capacity;
	sHub.pTwoFill = (sHub.pTwoCount*sHub.radius)/sHub.capacity;
};

game.updateTerminalHub = function(tHub){
	if (tHub.units == 0) {
		game.gameOver = true;
	}
	if (tHub.units == tHub.capacity) {
		tHub.isFull = true;
	}
	tHub.dropTimer -= 1;
	if (tHub.dropTimer < 0 && tHub.units > 0) {
		tHub.units -= 1;
		tHub.dropTimer = timers.terminalDrop;
		tHub.isFull = false;
	}
	if (tHub.isFull && tHub.connected) {
		tHub.connected = false;
		tHub.connection.connection = null;
		tHub.connection.connected = false;
		thub.connection = null;
	}
};

game.updateHubs = function(){
	var pHubs = this.primaryHubs;
	var sHubs = this.secondaryHubs;
	var tHubs = this.terminalHubs;
	var hubs = pHubs.concat(sHubs).concat(tHubs);
	$.each(hubs, function(idx, hub){
		if (hub.isPrimary) {
			game.updatePrimaryHub(hub);
		} else if (hub.isSecondary) {
			game.updateSecondaryHub(hub);
		} else {
			game.updateTerminalHub(hub);
		}
		hub.fillRadius = (hub.units*hub.radius)/hub.capacity;
	});
};

game.update = function(){
	if (!this.gameOver && !this.paused) {
		this.updateHubs();
	}
};

game.run = (function(){
	var loops = 0, 
	skipTicks = 1000 / 40, //FPS = 40
	maxFrameSkip = 10,
	nextGameTick = (new Date).getTime();
	return function () {
		loops = 0;
		while ((new Date).getTime() > nextGameTick && loops < maxFrameSkip) {
			game.update();
			nextGameTick += skipTicks;
			loops++;
		}
		game.draw();
	};
})();

game.userInput = function(){
	$(window).keypress(function(e) {
		var key = e.which;
		if (key == 32) {
			game.initialize()
		}
	});
};

game.startGame = function(){
	this.userInput();
	this.initialize();
	this._intervalID = setInterval(this.run, 0);
};

$(document).ready(function(){
	game.startGame();
});