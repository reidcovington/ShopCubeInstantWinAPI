$(document).ready(function(){
    gameController = new GameController();
});

    function GameController(){
        this.cubeControllers = [new CubeController(this)//,
                                    // new CubeController(this),
                                    // new CubeController(this),
                                    // new CubeController(this),
                                    // new CubeController(this),
                                    // new CubeController(this)
                                    ];
        this.gameView = new GameView(this);
        this.prizeManager = new PrizeManager();
        this.totalMoves = 10;
        this.totalMatches = 0;
    };
    GameController.prototype = {
        updateActiveCube: function(number){
            for (var i = 0; i < this.cubeControllers.length; i++){
                if(i === number){
                    this.cubeControllers[i].markActive(i);
                }else{
                    this.cubeControllers[i].markInactive(i);
                }
            }
        },
        statusEval: function(cubeController){
            var skipCubeIndex = this.cubeControllers.indexOf(cubeController),
                    facesOfOtherCubes = [],
                    currentCubePrizes = cubeController.getAllSidePrizes();
            this.totalMoves -= 1;
            this.gameView.drawMoveCount(this.totalMoves);
            if(this.totalMatches === 6){
                this.triggerWin();
            }else if(this.totalMoves === 0){
                this.triggerLose();
            }
            for(var i = 0; i < this.cubeControllers.length; i++){
                if(i != skipCubeIndex){
                    facesOfOtherCubes += this.cubeControllers[i].getFacingPrize();
                    facesOfOtherCubes = facesOfOtherCubes.sort()
                    for(var x = 0; x < facesOfOtherCubes.length; x++){
                        if(facesOfOtherCubes[x] === facesOfOtherCubes[x+1]){
                            this.totalMatches += 1
                            if(this.totalMatches === 6){
                                // this.totalMoves -= 1;
                                // this.gameView.drawMoveCount(this.totalMoves);
                                return this.triggerWin();
                            }else{
                                // this.totalMoves -= 1;
                                // this.gameView.drawMoveCount(this.totalMoves);
                                // cubeController.gameView.updateMoveCount(this.totalMatches);
                                if(this.totalMoves === 0){
                                    this.triggerLose();
                                }
                            }
                        }
                    }
                }
            }
            cubeController.addPrize(this.prizeManager.generatePrize(currentCubePrizes, facesOfOtherCubes, this.totalMatches));
        },
        checkForGameOutcome: function(){
            this.totalMoves -= 1;
            this.gameView.drawMoveCount(this.totalMoves);
            if(this.totalMatches === 6){
                this.triggerWin();
            }else if(this.totalMoves === 0){
                this.triggerLose();
            }
        },
        triggerWin: function(){
            alert("You've Won!")
            // - send prize info to server
            // - server generates url with prize info, etc.
        },
        triggerLose: function(){
            alert("You LOST!!!! TRY AGAIN!!")
        }
    };

    function GameView(delegate){
        this.delegate = delegate;
        this._setupCubeSelectionListeners();
    }
    GameView.prototype = {
        _setupCubeSelectionListeners: function(){
            var self = this;
            $('.cubeface').click(function(e){
                self.delegate.updateActiveCube(this.indexOf())
            })
        },
        drawMoveCount: function(moves){
            $('[data-moves]').html(moves)
        }
    };

    function PrizeManager(){
        this.cubesInitiated = 0;
        this.fetchPrizes();
        this.winner = this.determineWinner();
        this.determinePrizes();
    };
    PrizeManager.prototype = {
        fetchPrizes: function(){
            this.potentialPrizePool = ["/assets/chuck.jpg", "/assets/ducati.jpg", "/assets/ducky.jpg", "/assets/dumbass.jpg", "/assets/whoa.gif",  "/assets/question-mark.png"]
            // $.ajax(stuff);
        },
        determineWinner: function(){
            return _.sample([true, false])
        },
        determinePrizes: function(){
            this.prizePool = [];
            this.reducedPrizePool = []
            if (this.winner === true){
                this.winningPrize =  _.sample(this.potentialPrizePool);
                this.prizePool.push(this.winningPrize)
                this.prizePool.push(_.sample((_.without(this.potentialPrizePool, this.winningPrize)), 5));
                this.prizePool = _.flatten(this.prizePool);
                this.reducedPrizePool.push(this.winningPrize)
                this.reducedPrizePool.push(_.sample((_.without(this.potentialPrizePool, this.winningPrize)), 2));
                this.reducedPrizePool = _.flatten(this.reducedPrizePool);
            }else{
                this.winningPrize = null;
                this.prizePool =  _.sample(this.potentialPrizePool, 6);
                this.reducedPrizePool = _.sample(this.potentialPrizePool, 3);
            }
        },
        generatePrize: function(currentCubePrizes, facesOfOtherCubes, totalMatches){
            var possibleRemainingPrizes = this.prizePool;
            for(i = 0; i < currentCubePrizes.length; i++){
                var indexOfUsedPrize = this.prizePool.indexOf(currentCubePrizes[i])
                if(indexOfUsedPrize != -1) {
                    possibleRemainingPrizes.splice(i, 1);
                }
            }
            var possibleRemainingReducedPrizes = this.reducedPrizePool;
            for(i = 0; i < currentCubePrizes.length; i++){
                var indexOfUsedPrize = this.reducedPrizePool.indexOf(currentCubePrizes[i])
                if(indexOfUsedPrize != -1) {
                    possibleRemainingReducedPrizes.splice(i, 1);
                }
            }
            debugger
            if(this.cubesInitiated === 0){
                if(this.winningPrize){
                    this.cubesInitiated += 1;
                    console.log(this.winningPrize)
                    return this.winningPrize
                }else{
                    this.cubesInitiated += 1;
                    console.log("not a winning prize")
                    return _.sample(this.reducedPrizePool)
                }
            }else if(facesOfOtherCubes.length === 0 && this.cubesInitiated != 0){
                if(currentCubePrizes != this.reducedPrizePool){
                    return _.sample(possibleRemainingReducedPrizes)
                }else{
                    return _.sample(possibleRemainingPrizes)
                }
            }else if(totalMatches < 5){
                if(currentCubePrizes != this.reducedPrizePool){
                    return _.sample(possibleRemainingReducedPrizes)
                }else{
                    return _.sample(possibleRemainingPrizes)
                }
            }else{
                if(this.winningPrize){
                    return facesOfOtherCubes[0]
                }else{
                    return _.sample((_.without(possibleRemainingPrizes, facesOfOtherCubes[0])))
                }
            }
        }
    };

    function CubeController(delegate){
        this.delegate = delegate;
        this.cubeModel = new CubeModel(this);
        this.cubeView = new CubeView(this);
    };
    CubeController.prototype = {
        markInactive: function(number){
            this.cubeView.markInactive(number)
        },
        markActive: function(number){
            this.cubeView.markActive(number)
        },
        receiveTurnDirection: function(direction){
            this.cubeView.rotateCube(direction);
        },
        checkOldFace: function(){
            this.delegate.checkForGameOutcome();
        },
        fillNewFace: function(){
            this.delegate.statusEval(this);
        },
        getAllSidePrizes: function(){
            return this.cubeModel.fetchAllSidePrizes();
        },
        getFacingPrize: function(){
            return this.cubeModel.fetchFacingPrizes();
        },
        receiveSideFacing: function(side){
            this.cubeModel.facing = side;
            this.cubeModel.updateSideFacing(side)
        },
        getSideFacing: function(){
            return this.cubeModel.fetchCurrentSide();
        },
        addPrize: function(prize){
            var currentSide = this.getSideFacing();
            this.cubeModel.assignPrize(prize);
            this.cubeView.drawPrize(prize, currentSide);
        }
    };

    function CubeModel(delegate){
        this.delegate = delegate;
        this.sides = {1: null, 2: null, 3: null, 4: null, 5: null, 6: null};
        this.facing = 0;
        this.prizesSeen = [];
        // matrix data
    };
    CubeModel.prototype = {
        updateSideFacing: function(direction){
            // => matrix calculations = this.facing
            if(this.sides[this.facing]){
                this.delegate.checkOldFace();
            }else{
                this.delegate.fillNewFace();
            }
        },
        fetchAllSidePrizes: function(){
            var allSides = [];
            for(i = 1; i < 6; i++){
                if(this.sides[i]){
                    allSides.push(this.sides[i])
                }
            }
            return allSides;
        },
        fetchFacingPrizes: function(){
            return this.sides[this.facing];
        },
        fetchCurrentSide: function(){
            return this.facing //temporary conviluted solution, prolly need to fix
        },
        assignPrize: function(prize){
            this.sides[this.facing] = prize;
        }
    };

    function CubeView(delegate){
        this.delegate = delegate;
        this.active = false;
        this.xAngle = 0;
        this.yAngle = 0;
        this.matrix = [
                     //   f, bk, l, t, r, bt
      /* side 1 */  [ 1, 0, 0, 0, 0, 0 ],
      /* side 2 */  [ 0, 1, 0, 0, 0, 0 ],
      /* side 3 */  [ 0, 0, 1, 0, 0, 0 ],
      /* side 4 */  [ 0, 0, 0, 1, 0, 0 ],
      /* side 5 */  [ 0, 0, 0, 0, 1, 0 ],
      /* side 6 */  [ 0, 0, 0, 0, 0, 1 ]
        ];
        this.rotations = {
            // left:
            "0 -90": [
                //   f, bk, l, t, r, bt
      /* side 1 */  [ 0, 0, 1, 0, 0, 0 ],
      /* side 2 */  [ 0, 0, 0, 0, 1, 0 ],
      /* side 3 */  [ 0, 1, 0, 0, 0, 0 ],
      /* side 4 */  [ 0, 0, 0, 1, 0, 0 ],
      /* side 5 */  [ 1, 0, 0, 0, 0, 0 ],
      /* side 6 */  [ 0, 0, 0, 0, 0, 1 ]
        ],
            // right:
            "0 90": [
                //   f, bk, l, t, r, bt
      /* side 1 */  [ 0, 0, 0, 0, 1, 0 ],
      /* side 2 */  [ 0, 0, 1, 0, 0, 0 ],
      /* side 3 */  [ 1, 0, 0, 0, 0, 0 ],
      /* side 4 */  [ 0, 0, 0, 1, 0, 0 ],
      /* side 5 */  [ 0, 1, 0, 0, 0, 0 ],
      /* side 6 */  [ 0, 0, 0, 0, 0, 1 ]
        ],
            // up:
            "90 0": [
                //   f, bk, l, t, r, bt
      /* side 1 */  [ 0, 0, 0, 1, 0, 0 ],
      /* side 2 */  [ 0, 0, 0, 0, 0, 1 ],
      /* side 3 */  [ 0, 0, 1, 0, 0, 0 ],
      /* side 4 */  [ 0, 1, 0, 0, 0, 0 ],
      /* side 5 */  [ 0, 0, 0, 0, 1, 0 ],
      /* side 6 */  [ 1, 0, 0, 0, 0, 0 ]
        ],
            // down:
            "-90 0": [
                //   f, bk, l, t, r, bt
      /* side 1 */  [ 0, 0, 0, 0, 0, 1 ],
      /* side 2 */  [ 0, 0, 0, 1, 0, 0 ],
      /* side 3 */  [ 0, 0, 1, 0, 0, 0 ],
      /* side 4 */  [ 1, 0, 0, 0, 0, 0 ],
      /* side 5 */  [ 0, 0, 0, 0, 1, 0 ],
      /* side 6 */  [ 0, 1, 0, 0, 0, 0 ]
        ]
    };
        this._setupButtonClickListeners();
    };
    CubeView.prototype = {
        _setupButtonClickListeners: function(){
            var self = this;
            $('[data-direction]').click(function(e){
                self.delegate.receiveTurnDirection($(this).data('direction'));
            })
        },
        markInactive: function(number){
            this.active = true;
            this.hideButtons(number);
            $(".cubeface"+number).removeClass("active");
        },
        markActive: function(number){
            this.active = true;
            this.showButtons(number);
            $(".cubeface"+number).addClass("active");
        },
        showButtons: function(number){
            $(".cubeface"+number+"buttons").show();
        },
        hideButtons: function(number){
            $(".cubeface"+number+"buttons").hide();
        },
        rotateCube: function(direction){
            this.matrix = this.createRotatedMatrix(this.matrix, this.rotations[direction]);
            this.animateCubeRotation(direction);
        },
        createRotatedMatrix: function(current, direction){
            var newMatrix = [];
            for(var row = 0; row < current.length; row++){
                newMatrix[row] = [];
                for(var column = 0; column < direction[0].length; column++){
                    var sum = 0;
                    for(var i = 0; i < current[row].length; i++){
                        sum += current[row][i] * direction[i][column];
                    }
                    newMatrix[row].push(sum);
                }
            }
            return newMatrix;
        },
        animateCubeRotation: function(direction){
            var directions = direction.split(" ");
            this.xAngle = parseInt(directions[0]);
            this.yAngle = parseInt(directions[1]);
            var self = this;
            $('#cube').css("-webkitTransform", "rotateX("+this.xAngle+"deg) rotateY("+this.yAngle+"deg)");
            setTimeout(function(){
                $('#cube').css("-webkit-transition", "0")
                $('#cube').css("-webkitTransform", "rotateX(0deg) rotateY(0deg)");
                self.assignFaces();
            }, 1000);
            $('#cube').css("-webkit-transition", "1s linear")
        },
        assignFaces: function(){
            var self = this;
            var faces = ["front", "back", "left", "top", "right", "bottom"]
            for(var i = 0; i < this.matrix.length; i++){
                var direction = faces[this.matrix[i].indexOf(1)];
                $('[data-side=' + i + ']').attr("class", "face " + direction)
                if($('[data-side=' + i + ']').hasClass("face front")){
                    self.delegate.receiveSideFacing(i);
                }
            }
        },
        drawPrize: function(prize, currentSide){
            $('[data-side=' + currentSide + ']').html('<img src=' + prize + '>')
        }
    };




