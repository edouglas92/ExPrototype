var game = { };

game.clickPrimHub = function(hub, clr){
	return function(layer) {
		var hubSelected = hub.selected;
		$.each(game.primaryHubs, function(idx, pHub){
			pHub.selected = false;
			pHub.colouring = pHub.colour;
		});
		hub.selected = !hubSelected;
		if (hub.selected && !game.gameOver) {
			hub.colouring = "dark"+clr;
		} else if (!game.gameOver) {
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
			hub.colouring = clr;
		}
	}
};

game.clickSecHub = function(hub, clr){
	return function(layer) {
		var hubSelected = hub.selected;
		$.each(game.secondaryHubs, function(idx, sHub){
			sHub.selected = false;
			sHub.colouring = sHub.colour;
		});
		hub.selected = !hubSelected;
		if (hub.selected && !game.gameOver) {
			var isPrimSelected = false;
			$.each(game.primaryHubs, function(idx, pHub){
				if (!pHub.connected && pHub.selected) {
					if (pHub.colour == hub.primOne && !hub.pOneFull) {
						hub.primOneConnected = true;
						hub.primOneConnection = pHub;
						pHub.connected = true;
						pHub.connection = hub;
						pHub.selected = false;
						hub.selected = false;
						pHub.colouring = pHub.colour;
						isPrimSelected = true;
					} else if (pHub.colour == hub.primTwo && !hub.pTwoFull) {
						hub.primTwoConnected = true;
						hub.primTwoConnection = pHub;
						pHub.connected = true;
						pHub.connection = hub
						pHub.selected = false;
						hub.selected = false;
						pHub.colouring = pHub.colour;
						isPrimSelected = true;
					}
				}
			});
			if (!isPrimSelected) {
				hub.colouring = "dark"+clr;
			}
		} else if (!game.gameOver) {
			if (hub.connected) {
				hub.connected = false;
				hub.connection.connected = false;
				hub.connection.connection = null;
				hub.connection = null;
			}
			hub.colouring = clr;
		}
	}
};

game.clickTermHub = function(hub, clr){
	return function(layer) {
		if (!game.gameOver) {
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

game.initializeHub = function(xcoord, ycoord, radius, clr, num){
	var hub = {
		xpos: xcoord,
		ypos: ycoord,
		radius: radius,
		colour: clr,
		colouring: clr,
		units: 0,
		capacity: 50,
		isFull: false,
		dropTimer: 15,
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
  		strokeWidth: 4,
  		visible: false,
  		rounded: true,
  		startArrow: false,
  		arrowRadius: 15,
  		x1: hub.xpos, y1: hub.ypos,
  		x2: hub.xpos, y2: hub.ypos
	});
	return hub;
};

game.initializePrimaryHub = function(xcoord, ycoord, radius, clr, num){
	var hub = this.initializeHub(xcoord, ycoord, radius, clr, num);
	hub.unitTimer = 20;
	$('canvas').drawArc({
		layer: true,
		strokeStyle: hub.colour,
  		strokeWidth: 2,
  		x: hub.xpos, y: hub.ypos,
  		radius: hub.radius,
  		click: game.clickPrimHub(hub, clr)
	})
	.drawArc({
		layer: true, name: hub.fillLayer,
		fillStyle: hub.colouring,
  		x: hub.xpos, y: hub.ypos,
  		radius: hub.fillRadius*50,
  		click: game.clickPrimHub(hub, clr)
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
		text: hub.units.toString(),
		click: game.clickPrimHub(hub, clr)
	});
	return hub
};

game.addRedHub = function(xcoord, ycoord){
	this.redHubs += 1;
	this.primaryHubs.push(this.initializePrimaryHub(xcoord, ycoord, 50, "red", this.redHubs));
};

game.addBlueHub = function(xcoord, ycoord){
	this.blueHubs += 1;
	this.primaryHubs.push(this.initializePrimaryHub(xcoord, ycoord, 50, "blue", this.blueHubs));
};

game.addYellowHub = function(xcoord, ycoord){
	this.yellowHubs += 1;
	this.primaryHubs.push(this.initializePrimaryHub(xcoord, ycoord, 50, "yellow", this.yellowHubs));
};

game.initializeSecondaryHub = function(xcoord, ycoord, radius, clr, pclr1, pclr2, num){
	var hub = this.initializeHub(xcoord, ycoord, radius, clr, num);
	hub.capacity = 50;
	hub.convertTimer = 30;
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
	hub.pOneCountLayer = clr+num.toString()+pclr1+"SecCount"+num.toString();
	hub.pTwoCountLayer = clr+num.toString()+pclr2+"SecCount"+num.toString();
	var clrText = hub.colour;
	if (clrText == "violet") {
		clrText = "purple";
	}
	$('canvas').drawArc({
		layer: true,
		strokeStyle: hub.colour,
  		strokeWidth: 2,
  		x: hub.xpos, y: hub.ypos,
  		radius: hub.radius,
  		click: game.clickSecHub(hub, clr)
	})
	.drawArc({
		layer: true, name: hub.fillLayer,
		fillStyle: hub.colouring,
  		x: hub.xpos, y: hub.ypos,
  		radius: hub.fillRadius*50,
  		click: game.clickSecHub(hub, clr)
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
		text: clrText+": "+hub.units.toString(),
		click: game.clickSecHub(hub, clr)
	})
	.drawText({
		layer: true,
		name: hub.pOneCountLayer,
		fillStyle: hub.primOne,
		strokeStyle: hub.primOne,
		strokeWidth: 1,
		x: hub.xpos, y: hub.ypos,
		fontSize: 18,
		fontFamily: 'Arial',
		text: hub.primOne+": "+hub.pOneCount.toString(),
		click: game.clickSecHub(hub, clr)
	})
	.drawText({
		layer: true,
		name: hub.pTwoCountLayer,
		fillStyle: hub.primTwo,
		strokeStyle: hub.primTwo,
		strokeWidth: 1,
		x: hub.xpos, y: hub.ypos+20,
		fontSize: 18,
		fontFamily: 'Arial',
		text: hub.primTwo+": "+hub.pTwoCount.toString(),
		click: game.clickSecHub(hub, clr)
	});
	return hub
};

game.addPurpleHub = function(xcoord, ycoord) {
	this.purpleHubs += 1;
	this.secondaryHubs.push(this.initializeSecondaryHub(xcoord, ycoord, 50, "violet", "red", "blue", this.purpleHubs));
};

game.addGreenHub = function(xcoord, ycoord) {
	this.greenHubs += 1;
	this.secondaryHubs.push(this.initializeSecondaryHub(xcoord, ycoord, 50, "green", "blue", "yellow", this.greenHubs));
};

game.addOrangeHub = function(xcoord, ycoord) {
	this.orangeHubs += 1;
	this.secondaryHubs.push(this.initializeSecondaryHub(xcoord, ycoord, 50, "orange", "red", "yellow", this.orangeHubs));
};

game.initializeTerminalHub = function(xcoord, ycoord, radius, clr, num){
	var hub = this.initializeHub(xcoord, ycoord, radius, clr, num);
	hub.dropTimer = 20;
	hub.capacity = 100;
	hub.units = hub.capacity;
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
  		click: game.clickTermHub(hub, clr)
	})
	.drawArc({
		layer: true, name: hub.fillLayer,
		fillStyle: hub.colouring,
  		x: hub.xpos, y: hub.ypos,
  		radius: hub.fillRadius*50,
  		click: game.clickTermHub(hub, clr)
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
		text: hub.units.toString(),
		click: game.clickTermHub(hub, clr)
	});
	return hub;
};

game.addPurpleTerm = function(xcoord, ycoord){
	this.purpleTerms += 1;
	this.terminalHubs.push(this.initializeTerminalHub(xcoord, ycoord, 50, "violet", this.purpleTerms));
};

game.addGreenTerm = function(xcoord, ycoord){
	this.greenTerms += 1;
	this.terminalHubs.push(this.initializeTerminalHub(xcoord, ycoord, 50, "green", this.purpleTerms));
};

game.addOrangeTerm = function(xcoord, ycoord){
	this.orangeTerms += 1;
	this.terminalHubs.push(this.initializeTerminalHub(xcoord, ycoord, 50, "orange", this.purpleTerms));
};

game.initialize = function(){
	$('canvas').removeLayers().clearCanvas();
	this.primaryHubs = [];
	this.secondaryHubs = [];
	this.terminalHubs = [];
	this.gameOver = false;
	this.redHubs = 0;
	this.blueHubs = 0;
	this.yellowHubs = 0;
	this.purpleHubs = 0;
	this.greenHubs = 0;
	this.orangeHubs = 0;
	this.purpleTerms = 0;
	this.greenTerms = 0;
	this.orangeTerms = 0;
	this.addRedHub(100, 100);
	this.addBlueHub(300, 100);
	this.addYellowHub(500, 100);
	this.addPurpleHub(200, 300);
	this.addGreenHub(400, 300);
	this.addOrangeHub(600, 300);
	this.addPurpleTerm(100, 500);
	this.addGreenTerm(300, 500);
	this.addOrangeTerm(500, 500);
	$('canvas').drawRect({
		layer: true,
		visible: false,
		name: "gameOverRec",
		fillStyle: 'black',
		strokeStyle: 'silver',
		strokeWidth: 4,
		x: 575, y: 325,
		width: 320, height: 100
	});
	$('canvas').drawText({
		layer: true,
		visible: false,
		name: "gameOverText",
		fillStyle: 'white',
		strokeStyle: 'silver',
		strokeWidth: 3,
		x: 575, y: 325,
		fontSize: 48,
		fontFamily: 'Arial',
		text: "Game Over!"
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
  			radius: hub.fillRadius*50
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
				visible: false
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
  			radius: hub.fillRadius*50
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
  			radius: hub.fillRadius*50
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
			visible: true
		});
		$('canvas').setLayer("gameOverText", {
			visible: true
		});
	}
};

game.draw = function(){
	this.drawHubs();
	this.drawGameOver();
	$('canvas').drawLayers();
};

game.updatePrimaryHub = function(pHub){
	pHub.unitTimer -= 1;
	if (pHub.unitTimer < 0) {
		pHub.units += 1;
		pHub.unitTimer = 20;
		if (pHub.units == pHub.capacity) {
			pHub.isFull = true;
			game.gameOver = true;
		}
	}
	if (pHub.connected && pHub.units > 0) {
		sHub = pHub.connection;
		pHub.dropTimer -= 1;
		if (pHub.dropTimer < 0) {
			if (sHub.primOneConnection == pHub && !sHub.pOneFull) {
				pHub.dropTimer = 15;
				pHub.units -= 1;
				sHub.pOneCount += 1;
			}
			else if (sHub.primTwoConnection == pHub && !sHub.pTwoFull) {
				pHub.dropTimer = 15;
				pHub.units -= 1;
				sHub.pTwoCount += 1;
			}
		}
	}
};

game.updateSecondaryHub = function(sHub){
	if (sHub.pTwoCount > 0 && sHub.pOneCount > 0) {
		sHub.convertTimer -= 1;
		if (sHub.convertTimer < 0 && !sHub.isFull) {
			sHub.convertTimer = 30;
			sHub.units += 1;
			sHub.pOneCount -= 1;
			sHub.pTwoCount -= 1;
			sHub.pOneFull = false;
			sHub.pTwoFull = false;
		}
	}
	if (sHub.pOneCount == sHub.capacity) {
		sHub.pOneFull = true;
	}
	if (sHub.pTwoCount == sHub.capacity) {
		sHub.pTwoFull = true;
	}
	if (sHub.units == sHub.capacity) {
		sHub.isFull = true;
	}
	if (sHub.pOneFull && sHub.primOneConnected) {
		sHub.primOneConnection.connected = false;
		sHub.primOneConnection.connection = null;
		sHub.primOneConnection = null;
		sHub.primOneConnected = false;
	} else if (sHub.pTwoFull && sHub.primTwoConnected) {
		sHub.primTwoConnection.connection = null;
		sHub.primTwoConnection.connected = false;
		sHub.primTwoConnection = null;
		sHub.primTwoConnected = false;
	}
	if (sHub.connected) {
		var tHub = sHub.connection;
		if (sHub.units > 0) {
			sHub.dropTimer -= 1;
			if (sHub.dropTimer < 0 && !tHub.isFull) {
				sHub.dropTimer = 15;
				sHub.units -= 1;
				tHub.units += 1;
			}
		} else {
			sHub.connected = false;
			tHub.connected = false;
			tHub.connection = null;
			sHub.connection = null;
		}
	}
};

game.updateTerminalHub = function(tHub){
	if (tHub.units == 0) {
		game.gameOver = true;
	}
	tHub.dropTimer -= 1;
	if (tHub.dropTimer < 0 && tHub.units > 0) {
		tHub.units -= 1;
		tHub.dropTimer = 20;
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
		hub.fillRadius = Math.min(hub.units/hub.radius, 1);
	});
};

game.update = function(){
	if (!this.gameOver) {
		this.updateHubs();
	}
};

game.run = (function(){
	var loops = 0, 
	skipTicks = 1000 / 30, //FPS = 30
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