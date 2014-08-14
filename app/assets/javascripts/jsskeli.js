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
            // var skipCubeIndex = this.cubeControllers.indexOf(cubeController),
            //      facesOfOtherCubes = [],
            //      currentCubePrizes = cubeController.getAllSidePrizes();
            // for(var i = 0; i < this.cubeControllers.length; i++){
            //     if(i != skipCubeIndex){
            //         facesOfOtherCubes += this.cubeControllers[i].getFacingPrize();
            //         facesOfOtherCubes = facesOfOtherCubes.sort()
            //         for(var x = 0; x < facesOfOtherCubes.length; x++){
            //             if(facesOfOtherCubes[x] === facesOfOtherCubes[x+1]){
            //                 totalMatches += 1
            //                 if(totalMatches === 6){
            //                     return this.triggerWin();
            //                 }else{
            //                     this.totalMoves -= 1;
            //                     cubeController.gameView.updateMoveCount(this.totalMatches);
            //                     if(this.totalMoves === 0){
            //                         this.triggerLose();
            //                     }
            //                 }
            //             }
            //         }
            //     }
            // }
            // cubeController.addPrize(this.prizeManager.generatePrize(currentCubePrizes, facesOfOtherCubes, totalMatches));
            // this.checkForTotalMatch();
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
        }
    };

    function PrizeManager(){
        this.cubesInitiated = 0;
        this.determinePrizes();
    };
    PrizeManager.prototype = {
        fetchPrizes: function(){
            this.prizePool = ["10giftcard", "50giftcard", "100giftcard", "500giftcard", "1000giftcard",  "10000giftcard"]
            // $.ajax(stuff);
        },
        determineWinner: function(){
            return _.sample(["win", "lose"], 1)
        },
        determinePrizes: function(){
            if (this.determineWinner === "win"){
                this.winningPrize =  _.sample(prizePool, 1);
                this.prizePool =  [this.winningPrize] + _.sample((_.without(this.prizePool, this.winningPrize)), 5);
                this.reducedPrizePool = [this.winningPrize] + _.sample(this.prizePool, 2);
            }else{
            this.winningPrize = null;
            this.prizePool =  _.sample(this.prizePool, 6);
            this.reducedPrizePool = _.sample(this.prizePool, 3);
            }
        },
        generatePrize: function(currentCubePrizes, facesOfOtherCubes, totalMatches){
            var possibleRemainingPrizes = _.without(this.prizePool, currentCubePrizes),
                  possibleRemainingReducedPrizes = _.without(this.reducedPrizePool, currentCubePrizes)
            if(this.cubesInitiated === 0){
                if(this.winningPrize){
                    this.cubesInitiated += 1;
                    return this.winningPrize
                }else{
                    this.cubesInitiated += 1;
                    return _.sample(this.reducedPrizePool, 1)
                }
            }else if(facesOfOtherCubes.length === 0 && this.cubesInitiated != 0){
                if(currentCubePrizes != this.reducedPrizePool){
                    return _.sample(possibleRemainingReducedPrizes, 1)
                }else{
                    return _.sample(possibleRemainingPrizes, 1)
                }
            }else if(totalMatches < 5){
                if(currentCubePrizes != this.reducedPrizePool){
                    return _.sample(possibleRemainingReducedPrizes, 1)
                }else{
                    return _.sample(possibleRemainingPrizes, 1)
                }
            }else{
                if(this.winningPrize){
                    return facesOfOtherCubes[0]
                }else{
                    return _.sample((_.without(possibleRemainingPrizes, facesOfOtherCubes[0])) , 1)
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
            this.cubeModel.updateSideFacing(direction);
            this.cubeView.rotateCube(direction);
        },
        checkOldFace: function(){
            this.delegate.checkForTotalMatch();
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
        this.facing = 2;
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
            for(i = 0; i < this.sides.length; i++){
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
        // this.assignFaces();
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
            // this.animateCubeRotation(direction);
            this.assignFaces();
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
            this.xAngle += parseInt(directions[0]);
            this.yAngle += parseInt(directions[1]);
            $('#cube').css("-webkitTransform", "rotateX("+this.xAngle+"deg) rotateY("+this.yAngle+"deg)");
        },
        assignFaces: function(){
            var faces = ["front", "back", "left", "top", "right", "bottom"]
            for(var i = 0; i < this.matrix.length; i++){
                var direction = faces[this.matrix[i].indexOf(1)];
                // debugger
                $('[data-side=' + i + ']').attr("class", "face " + direction)
            }
        }
    };





