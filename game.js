var game = { };

game.clickHub = function(hub, clr){
	return function(layer) {
		hub.selected = !hub.selected;
		if (hub.selected && !game.gameOver) {
			hub.colouring = "dark"+clr;
		} else if (!game.gameOver) {
			hub.colouring = clr;
		}
	}
};

game.initializePrimaryHub = function(xcoord, ycoord, radius, clr, num){
	var hub = {
		xpos: xcoord,
		ypos: ycoord,
		radius: radius,
		colour: clr,
		colouring: clr,
		units: 0,
		capacity: 50,
		dropTimer: 40,
		selected: false,
		fillRadius: 0,
		fillLayer: clr+"Fill"+num.toString(),
		countLayer: clr+"Count"+num.toString()
	};
	$('canvas').drawArc({
		layer: true,
		strokeStyle: hub.colour,
  		strokeWidth: 2,
  		x: hub.xpos, y: hub.ypos,
  		radius: hub.radius,
  		click: game.clickHub(hub, clr)
	})
	.drawArc({
		layer: true, name: hub.fillLayer,
		fillStyle: hub.colouring,
  		x: hub.xpos, y: hub.ypos,
  		radius: hub.fillRadius*50,
  		click: game.clickHub(hub, clr)
	})
	.drawText({
		layer: true,
		name: hub.countLayer,
		fillStyle: 'white',
		strokeStyle: hub.colour,
		strokeWidth: 1,
		x: hub.xpos, y: hub.ypos,
		fontSize: 34,
		fontFamily: 'Arial',
		text: hub.units.toString(),
		click: game.clickHub(hub, clr)
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

game.initializeSecondaryHub = function(xcoord, ycoord, radius, clr, pclr1, pclr2, num){
	var hub = this.initializePrimaryHub(xcoord, ycoord, radius, clr, num);
	hub.primOne = pclr1;
	hub.primTwo = pclr2;
	hub.primOneConnected = false;
	hub.primTwoConnected = false;
	hub.pOneCount = 0;
	hub.pTwoCount = 0;
	hub.pOneCountLayer = pclr1+"SecCount"+num.toString();
	hub.TwoCountLayer = pclr2+"SecCount"+num.toString();
	$('canvas').removeLayer(hub.countLayer)
	.drawText({
		layer: true,
		name: hub.countLayer,
		fillStyle: 'white',
		strokeStyle: hub.colour,
		strokeWidth: 1,
		x: hub.xpos, y: hub.ypos-20,
		fontSize: 20,
		fontFamily: 'Arial',
		text: hub.colour+": "+hub.units.toString(),
		click: game.clickHub(hub, clr)
	})
	.drawText({
		layer: true,
		name: hub.pOneCountLayer,
		fillStyle: 'white',
		strokeStyle: hub.primOne,
		strokeWidth: 1,
		x: hub.xpos, y: hub.ypos,
		fontSize: 20,
		fontFamily: 'Arial',
		text: hub.primOne+": "+hub.pOneCount.toString(),
		click: game.clickHub(hub, clr)
	})
	.drawText({
		layer: true,
		name: hub.pTwoCountLayer,
		fillStyle: 'white',
		strokeStyle: hub.primTwo,
		strokeWidth: 1,
		x: hub.xpos, y: hub.ypos+20,
		fontSize: 20,
		fontFamily: 'Arial',
		text: hub.primTwo+": "+hub.pTwoCount.toString(),
		click: game.clickHub(hub, clr)
	});
	return hub
};

game.addPurpleHub = function(xcoord, ycoord) {
	this.purpleHubs += 1;
	this.secondaryHubs.push(this.initializeSecondaryHub(xcoord, ycoord, 50, "purple", "red", "blue", this.purpleHubs));
};

game.initialize = function(){
	$('canvas').removeLayers().clearCanvas();
	this.primaryHubs = [];
	this.secondaryHubs = [];
	this.unitTimer = 25;
	this.gameOver = false;
	this.primaryHubTimer = 500;
	this.redHubs = 0;
	this.blueHubs = 0;
	this.purpleHubs = 0;
	this.addRedHub(100, 100);
	this.addBlueHub(300, 100);
	this.addPurpleHub(200, 300);
	$('canvas').drawRect({
		layer: true,
		name: "gameOverRec",
		fillStyle: 'white',
		strokeStyle: 'white',
		strokeWidth: 4,
		x: 575, y: 325,
		width: 320, height: 100
	});
	$('canvas').drawText({
		layer: true,
		name: "gameOverText",
		fillStyle: 'white',
		strokeStyle: 'white',
		strokeWidth: 3,
		x: 575, y: 325,
		fontSize: 48,
		fontFamily: 'Arial',
		text: "Game Over!"
	});
};

game.drawHubs = function(){
	$.each(this.primaryHubs, function(idx, hub){
		$('canvas').setLayer(hub.fillLayer, {
			fillStyle: hub.colouring,
  			radius: hub.fillRadius*50
		})
		.setLayer(hub.countLayer, {
				text: hub.units.toString()
		});
	});
	$.each(this.secondaryHubs, function(idx, hub){
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
			text: hub.colour+": "+hub.units.toString()
		});
	});
};

game.drawGameOver = function(){
	if (game.gameOver) {
		$('canvas').setLayer("gameOverRec", {
			fillStyle: 'black',
  			strokeStyle: 'silver'
		});
		$('canvas').setLayer("gameOverText", {
			fillStyle: 'white',
  			strokeStyle: 'silver'
		});
	}
};

game.draw = function(){
	this.drawHubs();
	this.drawGameOver();
	$('canvas').drawLayers();
};

game.updatePrimaryHubs = function(){
	this.unitTimer -= 1;
	if (this.unitTimer < 0) {
		this.unitTimer = 25;
		$.each(this.primaryHubs, function(idx, pHub){
			pHub.units += 1
			if (pHub.units > pHub.capacity) {
				game.gameOver = true;
				pHub.colour = 'black';
			}
		});
	}
	$.each(this.primaryHubs, function(idx, pHub){
		pHub.fillRadius = Math.min(pHub.units/pHub.radius, 1);
		if (pHub.selected) {
			pHub.dropTimer -= 1;
			if (pHub.dropTimer < 0) {
				pHub.dropTimer = 40;
				pHub.units -= 1;
			}
		}
	});
};

game.update = function(){
	if (!this.gameOver) {
		this.updatePrimaryHubs();
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