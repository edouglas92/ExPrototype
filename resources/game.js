///// Game Object //////

var game = { };

///// Game Options /////

game.FPS = 30;

game.timers = {
	primaryUnit: 10,
	primaryDrop1: 6,
	primaryDrop2: 8,
	secondaryConvert: 7,
	secondaryDrop: 5,
	terminalDrop: 20,
	secondaryRotate: 2,
	upgradeTimer: game.FPS*20,
	terminalTimer: game.FPS*19.8
};

game.capacities = {
	primary: 50,
	secondary: 50,
	terminal: 75
};

game.specs = {
	primaryRadius: 25,
	secondaryRadius: 25,
	terminalRadius: 25,
	hubOutline: 2,
	connectWidth: 8,
	minConnectWidth: 2,
	primOneOpac: 0.35,
	primTwoOpac: 0.3,
	minSecondaryFill: 3,
	outlineBuffer: 2,
	warnCount: game.capacities.terminal*0.20,
	maxWarnOpac: 0.5,
	warnOpacStep: 0.0175,
	arrowXDis: 65,
	arrowYDis: 25
};

game.colors = {
	primaryYellow: "rgb(255, 255, 0)",
	primaryYellowSelected: "rgb(204, 204, 0)",
	primaryRed: "rgb(255, 0, 0)",
	primaryRedSelected: "rgb(175, 0, 0)",
	primaryBlue: "rgb(0, 0, 255)",
	primaryBlueSelected: "rgb(0, 0, 175)",
	secondaryPurple: "rgb(127, 0, 255)",
	secondaryPurpleSelected: "rgb(76, 0, 153)",
	secondaryGreen: "rgb(0, 235, 0)",
	secondaryGreenSelected: "rgb(0, 175, 0)",
	secondaryOrange: "rgb(255, 128, 30)",
	secondaryOrangeSelected: "rgb(204, 102, 0)",
	secondaryDefault: "black",
	outlineRedActive: "rgb(125, 0, 0)",
	outlineBlueActive: "rgb(0, 0, 125)",
	outlineYellowActive: "rgb(175, 175, 0)"
};

game.displayCounts = false;
game.clickableArrows = false;
game.outlineSecondary = true;
game.rotateOutline = true;

///// Click Functionality /////

game.clickPrimHub = function(hub){
	return function(layer) {
		if (!game.gameOver && !game.paused && !game.isChoosing && !game.spawning) {
			var hubSelected = hub.selected;
			$.each(game.primaryHubs, function(idx, pHub){
				pHub.selected = false;
				pHub.colouring = pHub.colour;
			});
			hub.selected = !hubSelected;
			if (hub.selected) {
				hub.colouring = hub.sColouring;
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
		if (!game.gameOver && !game.paused && !game.isChoosing && !game.spawning) {
			var hubSelected = hub.selected;
			$.each(game.secondaryHubs, function(idx, sHub){
				sHub.selected = false;
				sHub.colouring = game.calcSecondaryColor(sHub);
			});
			hub.selected = !hubSelected;
			if (hub.selected) {
				var isPrimSelected = false;
				$.each(game.primaryHubs, function(idx, pHub){
					if (!pHub.connected && pHub.selected && !hub.isFull) {
						if (!hub.pOneFull && ((pHub.colour == hub.primOne) ||
							(hub.primOne == game.colors.secondaryDefault)) && 
							!hub.primOneConnected && (pHub.colour != hub.primTwo)) {
							hub.primOneConnected = true;
							hub.primOneConnection = pHub;
							pHub.connected = true;
							pHub.connection = hub;
							pHub.selected = false;
							hub.selected = false;
							pHub.colouring = pHub.colour;
							hub.primOne = pHub.colour;
							isPrimSelected = true;
							hub.colour = game.calcSecondaryColor(hub);
							hub.colouring = game.calcSecondaryColor(hub);
						} else if (!hub.pTwoFull && ((pHub.colour == hub.primTwo) ||
							(hub.primTwo == game.colors.secondaryDefault)) && 
							!hub.primTwoConnected && (pHub.colour != hub.primOne)) {
							hub.primTwoConnected = true;
							hub.primTwoConnection = pHub;
							pHub.connected = true;
							pHub.connection = hub;
							pHub.selected = false;
							hub.selected = false;
							pHub.colouring = pHub.colour;
							hub.primTwo = pHub.colour;
							isPrimSelected = true;
							hub.colour = game.calcSecondaryColor(hub);
							hub.colouring = game.calcSecondaryColor(hub);
						}
					} else if (pHub.connected && !pHub.connected2 && pHub.selected && !hub.isFull && (pHub.connection != hub )) {
						if (!hub.pOneFull && ((pHub.colour == hub.primOne) ||
							(hub.primOne == game.colors.secondaryDefault)) && 
							!hub.primOneConnected && (pHub.colour != hub.primTwo)) {
							hub.primOneConnected = true;
							hub.primOneConnection = pHub;
							pHub.connected2 = true;
							pHub.connection2 = hub;
							pHub.selected = false;
							hub.selected = false;
							pHub.colouring = pHub.colour;
							hub.primOne = pHub.colour;
							isPrimSelected = true;
							hub.colour = game.calcSecondaryColor(hub);
							hub.colouring = game.calcSecondaryColor(hub);
						} else if (!hub.pTwoFull && ((pHub.colour == hub.primTwo) ||
							(hub.primTwo == game.colors.secondaryDefault)) && 
							!hub.primTwoConnected && (pHub.colour != hub.primOne)) {
							hub.primTwoConnected = true;
							hub.primTwoConnection = pHub;
							pHub.connected2 = true;
							pHub.connection2 = hub;
							pHub.selected = false;
							hub.selected = false;
							pHub.colouring = pHub.colour;
							hub.primTwo = pHub.colour;
							isPrimSelected = true;
							hub.colour = game.calcSecondaryColor(hub);
							hub.colouring = game.calcSecondaryColor(hub);
						}
					}
				});
				if (!isPrimSelected) {
					hub.colouring = game.secondarySelectColor(hub);
				}
			} else {
				if (hub.connected) {
					hub.connected = false;
					hub.connection.connected = false;
					hub.connection.connection = null;
					hub.connection = null;
				}
				hub.colouring = game.calcSecondaryColor(hub);
			}
		}
	}
};

game.clickTermHub = function(hub){
	return function(layer) {
		if (!game.gameOver && !game.paused && !game.isChoosing && !game.spawning) {
			$.each(game.secondaryHubs, function(idx, sHub){
				if (!sHub.connected && sHub.selected && sHub.units > 0) {
					if ((sHub.colour == hub.colour) && !hub.isFull &&!hub.secConnected) {
						hub.secConnected = true;
						hub.secConnection = sHub;
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
		if (hub.connected && game.clickableArrows){
			hub.connection.connected = false;
			hub.connection.connection = null;
			hub.connection = null;
			hub.connected = false;
		}
	}
};

game.clickArrow2 = function(hub){
	return function(layer){
		if (hub.connected2 && game.clickableArrows){
			hub.connection2.connected = false;
			hub.connection2.connection = null;
			hub.connection2 = null;
			hub.connected2 = false;
		}
	}
};

game.clickRedUpgrade = function(){
	return function(layer){
		game.chosenUpgrade = game.colors.primaryRed;
		game.isChoosing = false;
		game.spawning = true;
	}
};

game.clickBlueUpgrade = function(){
	return function(layer){
		game.chosenUpgrade = game.colors.primaryBlue;
		game.isChoosing = false;
		game.spawning = true;
	}
};

game.clickYellowUpgrade = function(){
	return function(layer){
		game.chosenUpgrade = game.colors.primaryYellow;
		game.isChoosing = false;
		game.spawning = true;
	}
};

game.clickMixUpgrade = function(){
	return function(layer){
		game.chosenUpgrade = game.colors.secondaryDefault;
		game.isChoosing = false;
		game.spawning = true;
	}
};

game.clickSpawn = function(clr){
	return function(layer){
		game.spawning = false;
		$('canvas').removeLayer(layer);
		var xIdx = game.xSpawns.indexOf(layer.x);
		var yIdx = game.ySpawns.indexOf(layer.y);
		game.isSpawned[xIdx.toString()+","+yIdx.toString()] = true;
		if (game.chosenUpgrade == game.colors.primaryRed) {
			game.addRedHub(layer.x, layer.y);
		} else if (game.chosenUpgrade == game.colors.primaryYellow) {
			game.addYellowHub(layer.x, layer.y);
		} else if (game.chosenUpgrade == game.colors.primaryBlue) {
			game.addBlueHub(layer.x, layer.y);
		} else {
			game.addSecondaryHub(layer.x, layer.y);
		}
		game.moveMouse();
	}
};

///// Hub Initialization /////

game.initializeHub = function(xcoord, ycoord, cap, rad, clr, sClr, num, name){
	var hub = {
		xpos: xcoord,
		ypos: ycoord,
		radius: rad,
		colour: clr,
		colouring: clr,
		sColouring: sClr,
		units: 0,
		capacity: cap,
		isFull: false,
		selected: false,
		connected: false,
		connection: null,
		isPrimary: true,
		fillLayer: name+"Fill"+num.toString()+clr,
		countLayer: name+"Count"+num.toString()+clr,
		arrowLayer: name+"Arrow"+num.toString()+clr,
		clickLayer: name+"Click"+num.toString()+clr
	};
	$('canvas').drawLine({
		layer: true, name: hub.arrowLayer,
  		strokeStyle: hub.colour,
  		strokeWidth: game.specs.minConnectWidth,
  		visible: false,
  		rounded: true,
  		endArrow: true,
  		arrowRadius: 0,
  		x1: hub.xpos, y1: hub.ypos,
  		x2: hub.xpos, y2: hub.ypos,
  		click: game.clickArrow1(hub)
	});
	return hub;
};

///// Primary Hub Initialization /////

game.initializePrimaryHub = function(xcoord, ycoord, clr, sClr, num){
	var hub = this.initializeHub(xcoord, ycoord, this.capacities.primary, this.specs.primaryRadius, clr, sClr, num, "prim");
	hub.unitTimer = this.timers.primaryUnit;
	hub.connected2 = false;
	hub.connection2 = null;
	hub.dropTimer = this.timers.primaryDrop1;
	hub.dropTimer2 = this.timers.primaryDrop2;
	$('canvas').drawLine({
		layer: true, name: hub.arrowLayer+"2",
  		strokeStyle: hub.colour,
  		strokeWidth: game.specs.minConnectWidth,
  		visible: false,
  		rounded: true,
  		endArrow: true,
  		arrowRadius: 0,
  		x1: hub.xpos, y1: hub.ypos,
  		x2: hub.xpos, y2: hub.ypos,
  		click: game.clickArrow2(hub)
	})
	.drawArc({
		layer: true, name: hub.clickLayer,
		strokeStyle: hub.colour,
  		strokeWidth: game.specs.hubOutline,
  		fillStyle: 'black',
  		opacity: 0.0,
  		x: hub.xpos, y: hub.ypos,
  		radius: hub.radius,
  		visible: true,
  		click: game.clickPrimHub(hub)
	})
	.drawArc({
		layer: true,
		strokeStyle: hub.colour,
  		strokeWidth: game.specs.hubOutline,
  		x: hub.xpos, y: hub.ypos,
  		radius: hub.radius
	})
	.drawSlice({
		layer: true, name: hub.fillLayer,
		fillStyle: hub.colouring,
  		x: hub.xpos, y: hub.ypos,
  		radius: hub.radius,
  		start: 180, end: 180
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
		visible: game.displayCounts,
		text: hub.units.toString()
	});
	return hub
};

game.addRedHub = function(xcoord, ycoord){
	this.redHubs += 1;
	this.primaryHubs.push(this.initializePrimaryHub(
		xcoord, ycoord, this.colors.primaryRed, this.colors.primaryRedSelected, this.redHubs));
};

game.addBlueHub = function(xcoord, ycoord){
	this.blueHubs += 1;
	this.primaryHubs.push(this.initializePrimaryHub(
		xcoord, ycoord, this.colors.primaryBlue, this.colors.primaryBlueSelected, this.blueHubs));
};

game.addYellowHub = function(xcoord, ycoord){
	this.yellowHubs += 1;
	this.primaryHubs.push(this.initializePrimaryHub(
		xcoord, ycoord, this.colors.primaryYellow, this.colors.primaryYellowSelected, this.yellowHubs));
};

///// Secondary Hub Initialization /////

game.calcSecondaryColor = function(hub){
	if (hub.units > 0 && (hub.colour != this.colors.secondaryDefault)) {
		return hub.colour;
	}
	if (((hub.primOne == this.colors.primaryRed) && (hub.primTwo == this.colors.primaryBlue)) || 
		((hub.primTwo == this.colors.primaryRed) && (hub.primOne == this.colors.primaryBlue))) {
		return this.colors.secondaryPurple;
	} else if (((hub.primOne == this.colors.primaryRed) && (hub.primTwo == this.colors.primaryYellow)) || 
			   ((hub.primTwo == this.colors.primaryRed) && (hub.primOne == this.colors.primaryYellow))) {
		return this.colors.secondaryOrange;
	} else if (((hub.primOne == this.colors.primaryYellow) && (hub.primTwo == this.colors.primaryBlue)) || 
			   ((hub.primTwo == this.colors.primaryYellow) && (hub.primOne == this.colors.primaryBlue))) {
		return this.colors.secondaryGreen;
	} else {
		return this.colors.secondaryDefault;
	}
}

game.secondarySelectColor = function(hub){
	var clr = this.calcSecondaryColor(hub);
	if (clr == this.colors.secondaryPurple) {
		return this.colors.secondaryPurpleSelected;
	} else if (clr == this.colors.secondaryOrange) {
		return this.colors.secondaryOrangeSelected;
	} else if (clr == this.colors.secondaryGreen) {
		return this.colors.secondaryGreenSelected;
	} else {
		return clr;
	}
};

game.secondaryStrokeOutline = function(hub, clr) {
	return function(layer) {
		if ((hub.primOne == clr) || (hub.primTwo == clr)) {
			if (clr == game.colors.primaryRed) {
				return game.colors.outlineRedActive;
			} else if (clr == game.colors.primaryBlue) {
				return game.colors.outlineBlueActive;
			} else {
				return game.colors.outlineYellowActive;
			}
		}
		if ((hub.primOne != game.colors.secondaryDefault) && (hub.primTwo != game.colors.secondaryDefault)) {
			return game.calcSecondaryColor(hub);
		} else {
			return clr;
		}
	}
};

game.initializeSecondaryHub = function(xcoord, ycoord, num){
	var hub = this.initializeHub(xcoord, ycoord, this.capacities.secondary, this.specs.secondaryRadius, 
		this.colors.secondaryDefault, this.colors.secondaryDefault, num, "sec");
	hub.convertTimer = this.timers.secondaryConvert;
	hub.dropTimer = this.timers.secondaryDrop;
	hub.isPrimary = false;
	hub.isSecondary = true;
	hub.primOne = this.colors.secondaryDefault;
	hub.primTwo = this.colors.secondaryDefault;
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
	hub.pOneLayer = "PrimOneFill"+num.toString();
	hub.pTwoLayer = "PrimTwoFill"+num.toString();
	hub.pOneCountLayer = "PrimOneCount"+num.toString();
	hub.pTwoCountLayer = "PrimTwoCount"+num.toString();
	hub.redOutline = "SecRedOutline"+num.toString();
	hub.blueOutline = "SecBlueOutline"+num.toString();
	hub.yellowOutline = "SecYellowOutline"+num.toString();
	hub.rotateTimer = this.timers.secondaryRotate;
	if (!this.outlineSecondary) {
		$('canvas').drawArc({
			layer: true,
			strokeStyle: 'black',
  			strokeWidth: game.specs.hubOutline,
  			x: hub.xpos, y: hub.ypos,
  			radius: hub.radius
		});
	} else {
		$('canvas').drawArc({
			layer: true, name: hub.redOutline,
  			strokeWidth: game.specs.hubOutline,
  			x: hub.xpos, y: hub.ypos,
  			radius: hub.radius+game.specs.outlineBuffer,
  			click: game.clickSecHub(hub),
  			start: 0, end: 120,
  			strokeStyle: game.secondaryStrokeOutline(hub, game.colors.primaryRed)
		})
		.drawArc({
			layer: true, name: hub.blueOutline,
  			strokeWidth: game.specs.hubOutline,
  			x: hub.xpos, y: hub.ypos,
  			radius: hub.radius+game.specs.outlineBuffer,
  			click: game.clickSecHub(hub),
  			start: 120, end: 240,
  			strokeStyle: game.secondaryStrokeOutline(hub, game.colors.primaryBlue)
		})
		.drawArc({
			layer: true, name: hub.yellowOutline,
  			strokeWidth: game.specs.hubOutline,
  			x: hub.xpos, y: hub.ypos,
  			radius: hub.radius+game.specs.outlineBuffer,
  			click: game.clickSecHub(hub),
  			start: 240, end: 360,
  			strokeStyle: game.secondaryStrokeOutline(hub, game.colors.primaryYellow)
		});
	}
	$('canvas').drawSlice({
		layer: true, name: hub.fillLayer,
		fillStyle: hub.colouring,
  		x: hub.xpos, y: hub.ypos,
  		radius: hub.radius,
  		start: 180, end: 180
	})
	.drawArc({
		layer: true, name: hub.clickLayer,
		strokeStyle: hub.colour,
  		strokeWidth: game.specs.hubOutline,
  		x: hub.xpos, y: hub.ypos,
  		radius: hub.radius,
  		visible: true,
  		fillStyle: 'black',
  		opacity: 0.0,
  		click: game.clickSecHub(hub)
	})
	.drawSlice({
		layer: true, name: hub.pOneLayer,
		opacity: game.specs.primOneOpac,
		fillStyle: hub.primOne,
  		x: hub.xpos, y: hub.ypos,
  		radius: hub.radius,
  		start: 180, end: 180
	})
	.drawSlice({
		layer: true, name: hub.pTwoLayer,
		opacity: game.specs.primTwoOpac,
		fillStyle: hub.primTwo,
  		x: hub.xpos, y: hub.ypos,
  		radius: hub.radius,
  		start: 180, end: 180
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
		visible: game.displayCounts,
		text: hub.units.toString()
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
		visible: game.displayCounts,
		text: hub.pOneCount.toString()
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
		visible: game.displayCounts,
		text: hub.pTwoCount.toString()
	});
	return hub
};

game.addSecondaryHub = function(xcoord, ycoord) {
	this.secondaryHubCount += 1;
	this.secondaryHubs.push(this.initializeSecondaryHub(
		xcoord, ycoord, this.secondaryHubCount));
};

///// Terminal Hub Initialization /////

game.initializeTerminalHub = function(xcoord, ycoord, clr, sClr, num){
	var hub = this.initializeHub(xcoord, ycoord, this.capacities.terminal, this.specs.terminalRadius, clr, sClr, num, "term");
	hub.dropTimer = this.timers.terminalDrop;
	hub.units = hub.capacity;
	hub.isPrimary = false;
	hub.isSecondary = false;
	hub.isTerminal = true;
	hub.secConnection = null;
	hub.secConnected = false;
	hub.fillLayer = clr+"TFill"+num.toString();
	hub.countLayer = clr+"TCount"+num.toString();
	hub.warnLayer = clr+"TWarn"+num.toString();
	hub.isLow = false;
	hub.warnOpacity = 0;
	hub.warnUp = true;
	$('canvas').drawArc({
		layer: true,
		strokeStyle: hub.colour,
  		strokeWidth: game.specs.hubOutline,
  		x: hub.xpos, y: hub.ypos,
  		radius: hub.radius
	})
	.drawArc({
		layer: true, name: hub.clickLayer,
		strokeStyle: hub.colour,
  		strokeWidth: game.specs.hubOutline,
  		x: hub.xpos, y: hub.ypos,
  		radius: hub.radius,
  		visible: true,
  		fillStyle: 'black',
  		opacity: 0.0,
  		click: game.clickTermHub(hub)
	})
	.drawArc({
		layer: true, name: hub.warnLayer,
		strokeStyle: hub.colour,
  		strokeWidth: game.specs.hubOutline,
  		x: hub.xpos, y: hub.ypos,
  		radius: hub.radius,
  		visible: true,
  		fillStyle: 'black',
  		opacity: 0.0
	})
	.drawSlice({
		layer: true, name: hub.fillLayer,
		fillStyle: hub.colouring,
  		x: hub.xpos, y: hub.ypos,
  		radius: hub.radius,
  		start: 180, end: 180
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
		visible: game.displayCounts,
		text: hub.units.toString()
	});
	return hub;
};

game.addPurpleTerm = function(xcoord, ycoord){
	this.purpleTerms += 1;
	this.terminalHubs.push(this.initializeTerminalHub(
		xcoord, ycoord, this.colors.secondaryPurple, this.colors.secondaryPurpleSelected, this.purpleTerms));
};

game.addGreenTerm = function(xcoord, ycoord){
	this.greenTerms += 1;
	this.terminalHubs.push(this.initializeTerminalHub(
		xcoord, ycoord, this.colors.secondaryGreen, this.colors.secondaryGreenSelected, this.greenTerms));
};

game.addOrangeTerm = function(xcoord, ycoord){
	this.orangeTerms += 1;
	this.terminalHubs.push(this.initializeTerminalHub(
		xcoord, ycoord, this.colors.secondaryOrange, this.colors.secondaryOrangeSelected, this.orangeTerms));
};

///// Game Initialization /////

game.initSpawnLocs = function (){
	this.xSpawns = [];
	this.ySpawns = [];
	this.isSpawned = {};
	for (var i=0; i<17; i++) {
		var xLoc = ((game.specs.primaryRadius + 10) + (i*2*game.specs.primaryRadius*1.35));
		if (i%2 == 0) {
			xLoc = ((game.specs.primaryRadius + 10) + (i*2*game.specs.primaryRadius*1.35));
		}
		this.xSpawns.push(xLoc);
	}
	for (var i=0; i<9; i++) {
		var yLoc = ((game.specs.primaryRadius + 35) + (i*2*game.specs.primaryRadius*1.37));
		this.ySpawns.push(yLoc);
	}
	for (var x=0; x<17; x++){
		for (var y=0; y<9; y++){
			this.isSpawned[x.toString()+","+y.toString()] = false;
		}
	}
	for (var xS in this.xSpawns) {
		for (var yS in this.ySpawns) {
			$('canvas').drawArc({
				layer: true, name: xS.toString()+","+yS.toString(),
				groups: ['spawns'],
				visible: false,
  				x: this.xSpawns[xS], y: this.ySpawns[yS],
  				radius: game.specs.primaryRadius,
  				strokeStyle: 'white',
  				strokeWidth: 2,
  				click: this.clickSpawn()
			});
		}
	}
};

game.initializeHubs = function(){
	var xPrim = Math.floor(Math.random()*this.xSpawns.length),
	yPrim = Math.floor(Math.random()*this.ySpawns.length),
	xSec = Math.floor(Math.random()*this.xSpawns.length),
	ySec = Math.floor(Math.random()*this.ySpawns.length),
	xTerm = Math.floor(Math.random()*this.xSpawns.length),
	yTerm = Math.floor(Math.random()*this.ySpawns.length);
	while ((xPrim == xSec) && (yPrim == ySec)) {
		xSec = Math.floor(Math.random()*this.xSpawns.length);
		ySec = Math.floor(Math.random()*this.ySpawns.length);
	}
	while ((xTerm == xSec) && (yTerm == ySec)) {
		xTerm = Math.floor(Math.random()*this.xSpawns.length);
		yTerm = Math.floor(Math.random()*this.ySpawns.length);
	}
	var pIdx = Math.floor(Math.random()*3);
	if (pIdx == 0) {
		this.addRedHub(this.xSpawns[xPrim], this.ySpawns[yPrim]);
	} else if (pIdx == 1) {
		this.addBlueHub(this.xSpawns[xPrim], this.ySpawns[yPrim]);
	} else {
		this.addYellowHub(this.xSpawns[xPrim], this.ySpawns[yPrim]);
	}
	this.isSpawned[xPrim.toString()+","+yPrim.toString()] = true;
	$('canvas').removeLayer(xPrim.toString()+","+yPrim.toString());
	this.addSecondaryHub(this.xSpawns[xSec], this.ySpawns[ySec]);
	this.isSpawned[xSec.toString()+","+ySec.toString()] = true;
	$('canvas').removeLayer(xSec.toString()+","+ySec.toString());
	var tIdx = Math.floor(Math.random()*3);
	if (tIdx == 0) {
		this.addPurpleTerm(this.xSpawns[xTerm], this.ySpawns[yTerm]);
	} else if (tIdx == 1) {
		this.addGreenTerm(this.xSpawns[xTerm], this.ySpawns[yTerm]);
	} else {
		this.addOrangeTerm(this.xSpawns[xTerm], this.ySpawns[yTerm]);
	}
	this.isSpawned[xTerm.toString()+","+yTerm.toString()] = true;
	$('canvas').removeLayer(xTerm.toString()+","+yTerm.toString());
};

game.initialize = function(){
	$('canvas').removeLayers().clearCanvas();
	this.drawPending = false;
	this.primaryHubs = [];
	this.secondaryHubs = [];
	this.terminalHubs = [];
	this.totalTime = 0;
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
	this.secondaryHubCount = 0;
	this.isChoosing = false;
	this.upgradeTimer = game.FPS*5;
	this.terminalTimer = game.timers.terminalTimer;
	this.spawning = false;
	this.chosenUpgrade = this.colors.secondaryDefault;
	this.initSpawnLocs();
	this.initializeHubs();
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
		fillStyle: game.colors.primaryRed,
		strokeStyle: 'black',
		strokeWidth: 1,
		x: 1115, y: 11,
		fontSize: 24,
		fontFamily: 'Arial',
		text: "Pause",
		click: function(layer){
			if (!game.gameOver && !game.isChoosing && !game.spawning) {
				game.paused = !game.paused;
				var pTxt = "Pause";
				var filStyle = game.colors.primaryRed;
				if (game.paused) {
					pTxt = "Play";
					filStyle = game.colors.secondaryGreen;
				}
				$('canvas').setLayer("pauseText", {
					text: pTxt,
					fillStyle: filStyle
				});
			}
		}
	})
	.drawText({
		layer: true,
		name: "timerText",
		fillStyle: 'rgb(0,250,154)',
		strokeStyle: 'black',
		strokeWidth: 1,
		x: 1030, y: 10,
		fontSize: 20,
		fontFamily: 'Arial',
		text: "Time: "+Math.floor(game.totalTime/game.FPS).toString()
	})
	.drawRect({
		layer: true,
		visible: false,
		groups: ['upgrades'],
		name: "upgradeRec",
		strokeStyle: 'black',
		strokeWidth: 2,
		fillStyle: 'white',
		x: 575, y: 325,
		width: 350, height: 50
	})
	.drawText({
		layer: true,
		visible: false,
		name: "upgradeText",
		groups: ['upgrades'],
		fillStyle: 'rgb(0,250,154)',
		strokeStyle: 'black',
		strokeWidth: 1,
		x: 480, y: 325,
		fontSize: 19,
		fontFamily: 'Arial',
		text: "Choose Upgrade:"
	})
	.drawArc({
		layer: true, groups: ['upgrades'],
		name: "redUpgrade",
  		x: 585, y: 325,
  		radius: 20,
  		visible: false,
  		fillStyle: game.colors.primaryRed,
  		click: game.clickRedUpgrade()
	})
	.drawArc({
		layer: true, groups: ['upgrades'],
  		x: 630, y: 325,
  		name: "blueUpgrade",
  		radius: 20,
  		visible: false,
  		fillStyle: game.colors.primaryBlue,
  		click: game.clickBlueUpgrade()
	})
	.drawArc({
		layer: true, groups: ['upgrades'],
  		x: 675, y: 325,
  		name: "yellowUpgrade",
  		radius: 20,
  		visible: false,
  		fillStyle: game.colors.primaryYellow,
  		click: game.clickYellowUpgrade()
	})
	.drawArc({
		layer: true, groups: ['upgrades'],
  		x: 720, y: 325,
  		name: "mixUpgrade",
  		radius: 20,
  		visible: false,
  		fillStyle: game.colors.secondaryDefault,
  		opacity: 0.0,
  		click: game.clickMixUpgrade()
	})
	.drawSlice({
		layer: true, groups: ['upgrades'],
		name: "redUpgradeSlice",
  		x: 720, y: 325,
  		radius: 20,
  		visible: false,
  		fillStyle: game.colors.primaryRed,
  		start: -60, end: 60
	})
	.drawSlice({
		layer: true, groups: ['upgrades'],
		name: "blueUpgradeSlice",
  		x: 720, y: 325,
  		radius: 20,
  		visible: false,
  		fillStyle: game.colors.primaryBlue,
  		start: 180, end: 300
	})
	.drawSlice({
		layer: true, groups: ['upgrades'],
		name: "yellowUpgradeSlice",
  		x: 720, y: 325,
  		radius: 20,
  		visible: false,
  		fillStyle: game.colors.primaryYellow,
  		start: 60, end: 180
	});
};

///// Drawing /////

game.drawHub = function(hub){
	var layerCount = $('canvas').getLayers().length;
	var fillEnd = 180 + (180*(hub.units/hub.capacity));
	if (fillEnd == 360) {
		fillEnd = 359.99;
	}
	$('canvas').setLayer(hub.fillLayer, {
		radius: game.specs.terminalRadius,
		start: 180 - (180*(hub.units/hub.capacity)),
		end: fillEnd,
		fillStyle: hub.colouring
	})
	.setLayer(hub.countLayer, {
		text: hub.units.toString()
	}).moveLayer(hub.fillLayer, layerCount-2).moveLayer(hub.clickLayer, layerCount-1);
	if (hub.connected) {
		$('canvas').setLayer(hub.arrowLayer, {
			visible: true,
			x2: hub.connection.xpos,
			y2: hub.connection.ypos,
			strokeWidth: Math.max(game.specs.minConnectWidth, 
				(hub.units/hub.capacity)*game.specs.connectWidth),
			strokeStyle: hub.colour,
			arrowRadius: 0
		});
	} else if (!hub.selected) {
		$('canvas').setLayer(hub.arrowLayer, {
			visible: false,
			x2: hub.xpos, y2: hub.ypos,
			strokeWidth: game.specs.minConnectWidth
		});
	}
};

game.drawPrimaryHubs = function(){
	$.each(this.primaryHubs, function(idx, hub){
		game.drawHub(hub);
		if (hub.connected2) {
			$('canvas').setLayer(hub.arrowLayer+"2", {
				visible: true,
				x2: hub.connection2.xpos,
				y2: hub.connection2.ypos,
				strokeWidth: Math.max(game.specs.minConnectWidth, 
					(hub.units/hub.capacity)*game.specs.connectWidth),
				arrowRadius: 0
			});
		} else if (!hub.selected) {
			$('canvas').setLayer(hub.arrowLayer+"2", {
				visible: false,
				x2: hub.xpos, y2: hub.ypos,
				strokeWidth: game.specs.minConnectWidth
			});
		}
	});
};

game.drawSecondaryHubs = function(){
	$.each(this.secondaryHubs, function(idx, hub){
		game.drawHub(hub);
		if (game.outlineSecondary) {
			game.updateOutline(hub);
		}
		var fillEnd1 = 180 + (180*(hub.pOneCount/hub.capacity));
		if (fillEnd1 == 360) {
			fillEnd1 = 359.99;
		}
		var fillEnd2 = 180 + (180*(hub.pTwoCount/hub.capacity));
		if (fillEnd2 == 360) {
			fillEnd2 = 359.99;
		}
		$('canvas').setLayer(hub.pOneLayer, {
			radius: game.specs.secondaryRadius,
			start: 180 - (180*(hub.pOneCount/hub.capacity)),
			end: fillEnd1,
			fillStyle: hub.primOne
		})
		.setLayer(hub.pTwoLayer, {
			radius: game.specs.secondaryRadius,
			start: 180-(180*(hub.pTwoCount/hub.capacity)),
			end: fillEnd2,
			fillStyle: hub.primTwo
		})
		.setLayer(hub.pOneCountLayer, {
			text: hub.pOneCount.toString()
		})
		.setLayer(hub.pTwoCountLayer, {
			text: hub.pTwoCount.toString()
		})
		.setLayer(hub.fillLayer, {
			fillStyle: hub.colouring
		});
	});
};

game.drawTerminals = function(){
	$.each(this.terminalHubs, function(idx, hub){
		game.drawHub(hub);
		var fillEnd = 180 + (180*(hub.units/hub.capacity));
		if (fillEnd == 360) {
			fillEnd = 359.99;
		}
		var warnOpac = hub.warnOpacity;
		if (warnOpac < 0) {
			warnOpac = 0;
		}
		$('canvas').setLayer(hub.fillLayer, {
			radius: game.specs.terminalRadius,
			start: 180 - (180*(hub.units/hub.capacity)),
			end: fillEnd
		})
		.setLayer(hub.warnLayer, {
			opacity: warnOpac
		});
	});
};

game.drawHubs = function(){
	if (!this.gameOver && !this.paused && !this.isChoosing && !this.spawning) {
		this.drawPrimaryHubs();
		this.drawSecondaryHubs();
		this.drawTerminals();
	}
};

game.drawGameOver = function(){
	if (game.gameOver) {
		var layerCount = $('canvas').getLayers().length;
		$('canvas').setLayer("gameOverRec", {
			visible: true,
			x: 575, y: 325
		})
		.setLayer("gameOverText", {
			visible: true,
			x: 575, y: 325
		})
		.moveLayer("gameOverRec", layerCount-2).moveLayer("gameOverText", layerCount-1);
	}
};	

game.drawChoosing = function(){
	if (!game.gameOver && !game.paused) {
		if (game.isChoosing) {
			var layerCount = $('canvas').getLayers().length;
			$('canvas').setLayerGroup("upgrades", {
				visible: true
			})
			.moveLayer("upgradeRec", layerCount-9)
			.moveLayer("upgradeText", layerCount-8)
			.moveLayer("blueUpgradeSlice", layerCount-7)
			.moveLayer("yellowUpgradeSlice", layerCount-6)
			.moveLayer("redUpgradeSlice", layerCount-5)
			.moveLayer("redUpgrade", layerCount-4)
			.moveLayer("blueUpgrade", layerCount-3)
			.moveLayer("yellowUpgrade", layerCount-2)
			.moveLayer("mixUpgrade", layerCount-1)
		} else {
			$('canvas').setLayerGroup("upgrades", {
				visible: false
			})
		}
	}
};

game.drawSpawnLocs = function(){
	if (!game.gameOver && !game.paused) {
		if (game.spawning) {
			$('canvas').setLayerGroup("spawns", {
				visible: true
			});
			var spawnLocs = $('canvas').getLayerGroup("spawns");
			var layerCount = $('canvas').getLayers().length;
			for (var layer in spawnLocs) {
				$('canvas').moveLayer(spawnLocs[layer], layerCount-1);
			}
		} else {
			$('canvas').setLayerGroup("spawns", {
				visible: false
			});
		}
	}
};

game.draw = function(){
	game.drawPending = false;
	game.drawHubs();
	game.drawChoosing();
	game.drawSpawnLocs();
	game.drawGameOver();
	$('canvas').setLayer("timerText", {
		text: "Time: "+Math.floor(game.totalTime/game.FPS).toString()
	})
	.drawLayers();
};

game.requestRedraw = function(){
	if (!this.drawPending) {
		this.drawPending = true;
		requestAnimationFrame(this.draw);
	}
};


///// Updating /////

game.updatePrimaryHub = function(pHub){
	if (pHub.units == 0) {
		if (pHub.connected) {
			var sHub = pHub.connection;
			if (sHub.primOneConnection == pHub) {
				sHub.primOneConnected = false;
				sHub.primOneConnection = null;
			} else {
				sHub.primTwoConnected = false;
				sHub.primTwoConnection = null;
			}
			pHub.connected = false;
			pHub.connection = null;
		}
		if (pHub.connected2) {
			var sHub = pHub.connection2;
			if (sHub.primOneConnection == pHub) {
				sHub.primOneConnected = false;
				sHub.primOneConnection = null;
			} else {
				sHub.primTwoConnected = false;
				sHub.primTwoConnection = null;
			}
			pHub.connected2 = false;
			pHub.connection2 = null;
		}
	}
	if (pHub.units == pHub.capacity) {
		pHub.isFull = true;
	}
	pHub.unitTimer -= 1;
	if ((pHub.unitTimer < 0) && !pHub.isFull) {
		pHub.units += 1;
		pHub.unitTimer = this.timers.primaryUnit;
	}
	if (pHub.connected && (pHub.units > 0)) {
		var sHub = pHub.connection;
		pHub.dropTimer -= 1;
		if (pHub.dropTimer < 0) {
			pHub.dropTimer = this.timers.primaryDrop1;
			pHub.units -= 1;
			pHub.isFull = false;
			if ((sHub.primOneConnection == pHub) && !sHub.pOneFull) {
				sHub.pOneCount += 1;
			} else if ((sHub.primTwoConnection == pHub) && !sHub.pTwoFull) {
				sHub.pTwoCount += 1;
			}
		}
	}
	if (pHub.connected2 && (pHub.units > 0)) {
		var sHub = pHub.connection2;
		pHub.dropTimer2 -= 1;
		if (pHub.dropTimer2 < 0) {
			pHub.dropTimer2 = this.timers.primaryDrop2;
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

game.updateOutline = function(hub) {
	if (!this.gameOver && !this.paused && this.rotateOutline &&!this.isChoosing && !this.spawning) {
		hub.rotateTimer -= 1;
		if (hub.rotateTimer < 0) {
			hub.rotateTimer = this.timers.secondaryRotate;
			var redStart = $('canvas').getLayer(hub.redOutline).start + 1;
			var redEnd = $('canvas').getLayer(hub.redOutline).end + 1;
			if (redStart > 360) {
				redStart = 0;
			}
			if (redEnd > 360) {
				redEnd = 0;
			}
			var blueStart = $('canvas').getLayer(hub.blueOutline).start + 1;
			var blueEnd = $('canvas').getLayer(hub.blueOutline).end + 1;
			if (blueStart > 360) {
				blueStart = 0;
			}
			if (blueEnd > 360) {
				blueEnd = 0;
			}
			var yellowStart = $('canvas').getLayer(hub.yellowOutline).start + 1;
			var yellowEnd = $('canvas').getLayer(hub.yellowOutline).end + 1;
			if (yellowStart > 360) {
				yellowStart = 0;
			}
			if (yellowEnd > 360) {
				yellowEnd = 0;
			}
			$('canvas').setLayer(hub.redOutline, {
				start: redStart, end: redEnd
			})
			.setLayer(hub.blueOutline, {
				start: blueStart, end: blueEnd
			})
			.setLayer(hub.yellowOutline, {
				start: yellowStart, end: yellowEnd
			}).moveLayer(hub.redOutline, 0).moveLayer(hub.blueOutline, 1).moveLayer(hub.yellowOutline, 2);
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
			sHub.convertTimer = this.timers.secondaryConvert;
			sHub.units += 1;
			sHub.pOneCount -= 1;
			sHub.pTwoCount -= 1;
			sHub.pOneFull = false;
			sHub.pTwoFull = false;
			sHub.colour = this.calcSecondaryColor(sHub);
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
				sHub.dropTimer = this.timers.secondaryDrop;
				sHub.units -= 1;
				tHub.units += 1;
				sHub.isFull = false;
				if ((sHub.pTwoCount == 0) && !sHub.primTwoConnected && (sHub.units == 0)) {
					sHub.primTwo = this.colors.secondaryDefault;
				}
				if ((sHub.pOneCount == 0) && !sHub.primOneConnected && (sHub.units == 0)) {
					sHub.primOne = this.colors.secondaryDefault;
				}
				sHub.colour = this.calcSecondaryColor(sHub);
			}
		} else {
			sHub.connected = false;
			tHub.secConnected = false;
			tHub.secConnection = null;
			sHub.connection = null;
		}
	}
};

game.updateTerminalHub = function(tHub){
	if (tHub.units == 0) {
		game.gameOver = true;
		tHub.warnOpacity = 1.0;
	}
	if (tHub.units == tHub.capacity) {
		tHub.isFull = true;
	}
	tHub.dropTimer -= 1;
	if (tHub.dropTimer < 0 && tHub.units > 0) {
		tHub.units -= 1;
		tHub.dropTimer = this.timers.terminalDrop;
		tHub.isFull = false;
	}
	if (tHub.isFull && tHub.secConnected) {
		tHub.secConnected = false;
		tHub.secConnection.connection = null;
		tHub.secConnection.connected = false;
		tHub.secConnection = null;
	}
	if (tHub.units < this.specs.warnCount) {
		if (tHub.warnUp) {
			tHub.warnOpacity += this.specs.warnOpacStep;
			if (tHub.warnOpacity > this.specs.maxWarnOpac) {
				tHub.warnUp = false;
			}
		} else {
			tHub.warnOpacity -= this.specs.warnOpacStep;
			if (tHub.warnOpacity <= 0) {
				tHub.warnUp = true;
			}
		}
	} else {
		tHub.warnUp = true;
		tHub.warnOpacity = 0.0;
	}
};

game.updateHubs = function(){
	var pHubs = this.primaryHubs,
	sHubs = this.secondaryHubs,
	tHubs = this.terminalHubs,
	hubs = pHubs.concat(sHubs).concat(tHubs);
	$.each(hubs, function(idx, hub){
		if (hub.isPrimary) {
			game.updatePrimaryHub(hub);
		} else if (hub.isSecondary) {
			game.updateSecondaryHub(hub);
		} else {
			game.updateTerminalHub(hub);
		}
	});
};

game.updateUpgrade = function(){
	this.upgradeTimer -= 1;
	if (this.upgradeTimer < 0) {
		this.isChoosing = true;
		this.upgradeTimer = game.timers.upgradeTimer;
	}
};

game.updateTerminalTimer = function(){
	this.terminalTimer -= 1;
	if (this.terminalTimer < 0) {
		this.terminalTimer = game.timers.terminalTimer;
		var xSpawn = Math.floor(Math.random()*(this.xSpawns.length)),
		ySpawn = Math.floor(Math.random()*(this.ySpawns.length));
		while (this.isSpawned[xSpawn.toString()+","+ySpawn.toString()]) {
			xSpawn = Math.floor(Math.random()*(this.xSpawns.length));
			ySpawn = Math.floor(Math.random()*(this.ySpawns.length));
		}
		this.isSpawned[xSpawn.toString()+","+ySpawn.toString()] = true;
		$('canvas').removeLayer(xSpawn.toString()+","+ySpawn.toString());
		xSpawn = this.xSpawns[xSpawn];
		ySpawn = this.ySpawns[ySpawn];
		tIdx = Math.floor(Math.random()*3);
		if (tIdx == 0) {
			this.addPurpleTerm(xSpawn, ySpawn);
		} else if (tIdx == 1) {
			this.addOrangeTerm(xSpawn, ySpawn);
		} else {
			this.addGreenTerm(xSpawn, ySpawn);
		}
	}
};

game.update = function(){
	if (!this.gameOver && !this.paused && !this.isChoosing && !this.spawning) {
		this.totalTime += 1;
		this.updateHubs();
		this.updateUpgrade();
		this.updateTerminalTimer();
	}
};

///// Game Loop /////

game.run = (function(){
	var loops = 0, 
	skipTicks = 1000 / game.FPS,
	maxFrameSkip = 10,
	nextGameTick = (new Date).getTime();
	return function () {
		loops = 0;
		while ((new Date).getTime() > nextGameTick && loops < maxFrameSkip) {
			game.update();
			nextGameTick += skipTicks;
			loops++;
		}
		if (loops) game.requestRedraw();
	};
})();


///// User Input /////

game.moveMouse = function(){
	var pHubs = this.primaryHubs,
	sHubs = this.secondaryHubs,
	tHubs = this.terminalHubs,
	hubs = pHubs.concat(sHubs).concat(tHubs),
	layerCount = $('canvas').getLayers().length;
	$('canvas').mousemove(function(event){
		$.each(hubs, function(idx, hub){
			if (hub.selected && !hub.connected) {
				if (!game.isChoosing && !game.spawning && !game.gameOver && !game.paused) {
					$('canvas').setLayer(hub.arrowLayer, {
						visible: true,
						x2: event.pageX-game.specs.arrowXDis, y2: event.pageY-game.specs.arrowYDis,
						strokeStyle: hub.colour,
						arrowRadius: 10
					}).moveLayer(hub.arrowLayer, layerCount-1);
				}
			}
			if (hub.isPrimary) {
				if (hub.selected && hub.connected && !hub.connected2) {
					if (!game.isChoosing && !game.spawning && !game.gameOver && !game.paused) {
						$('canvas').setLayer(hub.arrowLayer+"2", {
							visible: true,
							x2: event.pageX-game.specs.arrowXDis, y2: event.pageY-game.specs.arrowYDis,
							strokeStyle: hub.colour,
							arrowRadius: 10
						}).moveLayer(hub.arrowLayer+"2", layerCount-1);
					}
				}
			}
			if (hub.isSecondary && hub.units == 0) {
				$('canvas').setLayer(hub.arrowLayer, {
					visible: false,
					x2: hub.xpos, y2: hub.ypos,
					strokeWidth: game.specs.minConnectWidth
				});
			} 
		});
	});
};

game.userInput = function(){
	$(window).keypress(function(e) {
		var key = e.which;
		if (key == 32) {
			game.initialize()
			game.moveMouse();
		}
	});
	this.moveMouse();
};

///// Game Launch /////

game.startGame = function(){
	this.initialize();
	this.userInput();
	this._intervalID = setInterval(this.run, 0);
};

$(document).ready(function(){
	game.startGame();
});