var Main = function(game){

};

Main.prototype = {

	create: function() {

    var me = this;

    //Get the dimensions of the tile we are using
    me.tileWidth = me.game.cache.getImage('tile').width;
    me.tileHeight = me.game.cache.getImage('tile').height;

    //Set the background colour to blue
    me.game.stage.backgroundColor = '479cde';

    //Enable the Arcade physics system
    me.game.physics.startSystem(Phaser.Physics.ARCADE);

    //Add a platforms group to hold all of our tiles, and create a bunch of them
    me.platforms = me.game.add.group();
    me.platforms.enableBody = true;
    me.platforms.createMultiple(250, 'tile');

		me.timer = game.time.events.loop(2000, me.addPlatform, me);
		// the spacing for the initial platforms
		me.spacing = 300;
		// create the initial platforms on screen
		me.initPlatforms();
		// add the player to the screen
		me.createPlayer();

		// create score
		me.score = 0;
		// create score label
		me.createScore();
		// add controls
		me.cursors = me.game.input.keyboard.createCursorKeys();
	},

	addTile: function(x, y) {
		var me = this;

		// get a tile that is not currently on screen
		var tile = me.platforms.getFirstDead();

		// reset it to the specified coordinates
		tile.reset(x, y);
		tile.body.velocity.y = 150;
		tile.body.immovable = true;

		// when the tile leaves the screen, kill it.
		tile.checkWorldBounds = true;
		tile.outOfBoundsKill = true;

	},

	addPlatform: function(y) {
		var me = this;

		// if no y position is supplied, render it just off the screen
		if(typeof(y) == 'undefined') {
			y = -me.tileHeight;
			// increase player score
			me.incrementScore();
		}

		// work out how many tiles we need to fit across the whole screen
		var tilesNeeded = Math.ceil(me.game.world.width / me.tileWidth);
		// add a hole randomly somewhere
		var hole = Math.floor(Math.random() * (tilesNeeded - 3)) + 1;
		// keep creating tiles next to each other until we have an entire row
		// don't add tiles where the random hole is
		for (var i = 0; i < tilesNeeded; i++) {
			if ( i != hole && i != hole + 1) {
				this.addTile(i * me.tileWidth, y);
			}
		}
	},

	initPlatforms: function() {
		var me = this,
			bottom = me.game.world.height - me.tileHeight,
			top = me.tileHeight;

		for (var y = bottom; y > top - me.tileHeight; y = y - me.spacing) {
			me.addPlatform(y);
		}
	},

	createPlayer: function() {
		var me = this;
		// add player to the game
		me.player = me.game.add.sprite(me.game.world.centerX, me.game.world.height - (me.spacing * 2 + (3 * me.tileHeight)), 'player');
		// set the players anchor point
		me.player.anchor.setTo(0.5, 1.0);
		// enable physics
		me.game.physics.arcade.enable(me.player);
		// make the player fall with gravity
		me.player.body.gravity.y = 2000;
		// make the player collide with the game boundaries
		me.player.body.collideWorldBounds = true;
		// make the player bounce a little
		me.player.body.bounce.y = 0.1;
	},

	createScore: function() {
		var me = this;
		var scoreFont = "100px Arial";
		me.scoreLabel = me.game.add.text((me.game.world.centerX), 100, "0", {font: scoreFont, fill: '#fff'});
		me.scoreLabel.anchor.setTo(0.5, 0.5);
		me.scoreLabel.align = 'center';
	},

	incrementScore: function() {
		var me = this;
		me.score += 1;
		me.scoreLabel.text = me.score;
	},

	update: function() {
		var me = this;
		// make the player collide with the platforms
		me.game.physics.arcade.collide(me.player, me.platforms);

		if(me.cursors.up.isDown && me.player.body.wasTouching.down) {
			me.player.body.velocity.y = -1400;
		}
		if(me.cursors.left.isDown) {
			me.player.body.velocity.x += -30;
		}
		if(me.cursors.right.isDown) {
			me.player.body.velocity.x += 30;
		}

		// check if the player is touching the bottom
		if (me.player.body.position.y >= me.game.world.height - me.player.body.height) {
			me.gameOver();
		}
	},

	gameOver: function(){
		this.game.state.start('Main');
	}

};
