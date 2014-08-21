$(document).ready(function(){
    gameController = new GameController();
});

function GameController(){
    this.cubeControllers = this._buildCubeControllers(6);
    this.gameView = new GameView(this);
    this.prizeManager = new PrizeManager();
    this.totalMoves = 20;
    this.updateActiveCube(0);
};
GameController.prototype = {
    _buildCubeControllers: function(numberOfCubes){
        var controllers = [];
        for(var i = 0; i < numberOfCubes; i++){
            var controller = new CubeController(this, i);
            controllers.push(controller);
        }
        return controllers;
    },
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
        var currentCubePrizes = cubeController.getAllSidePrizes();
        cubeController.addPrize(this.prizeManager.generatePrize(currentCubePrizes));
        this.checkForGameOutcome();
    },
    checkForGameOutcome: function(){
        this.totalMoves -= 1;
        this.gameView.drawMoveCount(this.totalMoves);
        var totalMatch = this.calcMatches();
        if(totalMatch){
            this.triggerWin();
        }else if(this.totalMoves === 0){
            this.triggerLose();
        }
    },
    calcMatches: function(){
        var currentFaces = this.fetchAllFacingPrizes();
        if(_.uniq(currentFaces).length === 1){
            return true;
        }else{
            return false;
        }
    },
    fetchAllFacingPrizes: function(){
        var facing = [];
        for(var i = 0; i < this.cubeControllers.length; i++){
            var cubeController = this.cubeControllers[i];
            facing.push(cubeController.getFacingPrize());
        }
        return facing;
    },
    triggerWin: function(){
        this.gameView.disableClicks();
        setTimeout(function(){
            alert("You've Won!")
        }, 500)
    },
    triggerLose: function(){
        this.gameView.disableClicks();
        setTimeout(function(){
            alert("You LOST!!!! TRY AGAIN!!")
        }, 500)
    }
};

function GameView(delegate){
    this.delegate = delegate;
    this._setupCubeSelectionListeners();
}
GameView.prototype = {
    _setupCubeSelectionListeners: function(){
        var self = this;
        $("[data-cube]").click(function(e){
            self.delegate.updateActiveCube($(this).data("cube"));
        })
    },
    drawMoveCount: function(moves){
        $('[data-moves]').html(moves + " turns left")
    },
    disableClicks: function(){
        $(document).click(function(e) {
            e.stopPropagation();
            e.preventDefault();
            e.stopImmediatePropagation();
            return false;
        });
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
        this.potentialPrizePool = ["/assets/car.png", "/assets/cash.png", "/assets/vacation.png", "/assets/ring.png", "/assets/house.png",  "/assets/shopping.png"]
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
    generatePrize: function(currentCubePrizes){
        var limitedPrizePool = _.difference(this.prizePool, currentCubePrizes);
        return _.sample(limitedPrizePool);
    }
};

function CubeController(delegate, cubeNumber){
    this.delegate = delegate;
    this.cubeNumber = cubeNumber;
    this.cubeModel = new CubeModel(this);
    this.cubeView = new CubeView(this, cubeNumber);
    this.activeCube = false;
};
CubeController.prototype = {
    markInactive: function(number){
        this.activeCube = false;
        this.cubeView.deactivate();
    },
    markActive: function(number){
        this.activeCube = true;
        this.cubeView.activate();
    },
    receiveTurnDirection: function(direction){
        if(this.activeCube) this.cubeView.rotateCube(direction);
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
        return this.cubeModel.fetchFacingPrize();
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
};
CubeModel.prototype = {
    updateSideFacing: function(direction){
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
    fetchFacingPrize: function(){
        return this.sides[this.facing];
    },
    fetchCurrentSide: function(){
        return this.facing
    },
    assignPrize: function(prize){
        this.sides[this.facing] = prize;
    }
};

function CubeView(delegate, cubeNumber){
    this.delegate = delegate;
    this.cube = "[data-cube='" + cubeNumber + "'] .cube"
    this.xAngle = 0;
    this.yAngle = 0;
    this.matrix = [ //f, bk, l, t, r, bt
        /* side 1 */[ 1, 0, 0, 0, 0, 0 ],
        /* side 2 */[ 0, 1, 0, 0, 0, 0 ],
        /* side 3 */[ 0, 0, 1, 0, 0, 0 ],
        /* side 4 */[ 0, 0, 0, 1, 0, 0 ],
        /* side 5 */[ 0, 0, 0, 0, 1, 0 ],
        /* side 6 */[ 0, 0, 0, 0, 0, 1 ]
    ];
    this.rotations = {
        "0 -90": [ // f, bk, l, t, r, bt
        /* side 1 */[ 0, 0, 1, 0, 0, 0 ],
        /* side 2 */[ 0, 0, 0, 0, 1, 0 ],
        /* side 3 */[ 0, 1, 0, 0, 0, 0 ],   // left
        /* side 4 */[ 0, 0, 0, 1, 0, 0 ],
        /* side 5 */[ 1, 0, 0, 0, 0, 0 ],
        /* side 6 */[ 0, 0, 0, 0, 0, 1 ]
        ],
        "0 90": [ //  f, bk, l, t, r, bt
        /* side 1 */[ 0, 0, 0, 0, 1, 0 ],
        /* side 2 */[ 0, 0, 1, 0, 0, 0 ],
        /* side 3 */[ 1, 0, 0, 0, 0, 0 ],   // right
        /* side 4 */[ 0, 0, 0, 1, 0, 0 ],
        /* side 5 */[ 0, 1, 0, 0, 0, 0 ],
        /* side 6 */[ 0, 0, 0, 0, 0, 1 ]
        ],
        "90 0": [ //  f, bk, l, t, r, bt
        /* side 1 */[ 0, 0, 0, 1, 0, 0 ],
        /* side 2 */[ 0, 0, 0, 0, 0, 1 ],
        /* side 3 */[ 0, 0, 1, 0, 0, 0 ],   // up
        /* side 4 */[ 0, 1, 0, 0, 0, 0 ],
        /* side 5 */[ 0, 0, 0, 0, 1, 0 ],
        /* side 6 */[ 1, 0, 0, 0, 0, 0 ]
        ],
        "-90 0": [ // f, bk, l, t, r, bt
        /* side 1 */[ 0, 0, 0, 0, 0, 1 ],
        /* side 2 */[ 0, 0, 0, 1, 0, 0 ],
        /* side 3 */[ 0, 0, 1, 0, 0, 0 ],   // down
        /* side 4 */[ 1, 0, 0, 0, 0, 0 ],
        /* side 5 */[ 0, 0, 0, 0, 1, 0 ],
        /* side 6 */[ 0, 1, 0, 0, 0, 0 ]
        ]
    };
    this._setupButtonClickListeners();
};
CubeView.prototype = {
    _setupButtonClickListeners: function(){
        var self = this;
        $('[data-direction]').click(function(e){
            $('[data-direction]').css("pointer-events", "none");
            self.delegate.receiveTurnDirection($(this).data('direction'));
            setTimeout(function(){
                $('[data-direction]').css("pointer-events", "auto");
            }, 500);
        })
    },
    activate: function(){
        $(this.cube + " [data-side]").css({"background-color": "rgba(0, 210, 255, .9)", "border-color": "rgba(0, 115, 190, 0.95)"})
    },
    deactivate: function(){
        $(this.cube + " [data-side]").css({"background-color": "rgba(0, 115, 190, .9)", "border-color": "rgba(0, 55, 100, .95)"})
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
        $(self.cube).css("-webkitTransform", "rotateX("+self.xAngle+"deg) rotateY("+self.yAngle+"deg)");
        setTimeout(function(){
            $(self.cube).css("-webkit-transition", "0")
            $(self.cube).css("-webkitTransform", "rotateX(0deg) rotateY(0deg)");
            self.assignFaces();
        }, 500);
        $(self.cube).css("-webkit-transition", "transform .5s ease-in-out")
    },
    assignFaces: function(){
        var self = this;
        var faces = ["front", "back", "left", "top", "right", "bottom"]
        for(var sideIndex = 0; sideIndex < this.matrix.length; sideIndex++){
            var direction = faces[this.matrix[sideIndex].indexOf(1)];
            $(this.cube + ' [data-side=' + sideIndex + ']').attr("class", "face " + direction)
            if(direction === "front"){
                self.delegate.receiveSideFacing(sideIndex);
            }
        }
    },
    drawPrize: function(prize, currentSide){
        var imageSelector = this.cube + " [data-side='" + currentSide + "'] img";
        $(imageSelector).fadeOut(200);
        setTimeout(function(){
            $(imageSelector).attr("src", prize);
            $(imageSelector).fadeIn(300);
        }, 200);
    }
};