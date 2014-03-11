describe('GameManager - ', function () {
	var game_manager = undefined;

	beforeEach(function () {
		game_manager = new GameManager(4, KeyboardInputManager, HTMLActuator)
	});

	it('should be defined', function () {
		expect(game_manager).toBeDefined();
		expect(game_manager.grid instanceof Grid).toBe(true);
	});

	describe('setup() - ', function () {

		beforeEach(function () {
			// we have to use the prototype because a new instance is created
			spyOn(Grid.prototype,'insertTile');
		});

		it('should add random tiles', function () {
			game_manager.setup();

			// Grid.insertTile should be called twice
			expect(Grid.prototype.insertTile.calls.length)
				.toBe(game_manager.startTiles);
		});
	});

	describe('move() - ', function () {
		var tiles = undefined;

		beforeEach(function () {
			// availables tiles
			tiles = [];
			game_manager.grid.eachCell( function (x,y,tile) {
				if(tile)
					tiles.push(tile);
			});

			// we manually move tiles to top-left and bottom-right
			game_manager.grid.removeTile(tiles[0]);
			game_manager.grid.removeTile(tiles[1]);

			tiles[0].x = 0;
			tiles[0].y = 0;
			tiles[0].value = 2;


			tiles[1].x = 3;
			tiles[1].y = 3;
			tiles[1].value = 4;


			game_manager.grid.insertTile(tiles[0]);
			game_manager.grid.insertTile(tiles[1]);
		});


		it('should move properly tiles to top', function () {
			game_manager.move(0);

			expect(tiles[0].y).toBe(0);
			expect(tiles[1].y).toBe(0);
		});

		it('should move properly tiles to down', function () {
			game_manager.move(2);

			expect(tiles[0].y).toBe(3);
			expect(tiles[1].y).toBe(3);
		});

		it('should move properly tiles to left', function () {
			game_manager.move(3);

			expect(tiles[0].x).toBe(0);
			expect(tiles[1].x).toBe(0);
		});

		it('should move properly tiles to right', function () {
			game_manager.move(1);

			expect(tiles[0].x).toBe(3);
			expect(tiles[1].x).toBe(3);
		});

		it('should not collide', function () {
			game_manager.move(1);

			expect(tiles[0].x).toBe(3);
			expect(tiles[1].x).toBe(3);

			game_manager.move(0);

			expect(tiles[0].y).toBe(0);
			expect(tiles[1].y).toBe(1);
		});

		it('should merge if same value', function () {
			// that way, we don't worry about new tiles
			spyOn(game_manager,'addRandomTile');

			tiles[0].value = tiles[1].value;
			game_manager.move(1);

			expect(tiles[0].x).toBe(3);
			expect(tiles[1].x).toBe(3);

			game_manager.move(0);

			expect(tiles[0].y).toBe(0);
			expect(tiles[1].y).toBe(0);

		});
		describe('merge process - ', function () {
			var new_tiles;
			beforeEach( function () {
				// tiles will merge (see test above)
				tiles[0].value = tiles[1].value;

				// no new tiles will be created
				spyOn(game_manager,'addRandomTile');

				game_manager.move(1);
				game_manager.move(0);

				new_tiles = [];

				game_manager.grid.eachCell( function (x,y,tile) {
					if(tile)
						new_tiles.push(tile);
				});
			});

			it('should delete tiles merged', function () {
				expect(new_tiles.length).toBe(1);
				expect(new_tiles.indexOf(tiles[0])).toBe(-1);
				expect(new_tiles.indexOf(tiles[1])).toBe(-1);
			});

			it('should create a new tile and update value', function () {
				expect(new_tiles[0].value).toBe(tiles[0].value*2);
			});

			it('should keep tiles merged from', function () {
				expect(new_tiles[0].mergedFrom.length).toBe(2);

				expect(new_tiles[0].mergedFrom[0]).toBe(tiles[1]);
				expect(new_tiles[0].mergedFrom[1]).toBe(tiles[0]);
			});

		})
	});

	describe('movesAvailable() -', function () {

	});

	describe('restart() - ', function () {
		beforeEach( function () {
			spyOn(game_manager,'setup').andCallThrough();
			spyOn(game_manager.actuator,'restart').andCallThrough();
		});

		it('should call GameManager.setup', function () {
			game_manager.restart();
			expect(game_manager.setup).toHaveBeenCalled();
			expect(game_manager.actuator.restart).toHaveBeenCalled();
		})
	});
});