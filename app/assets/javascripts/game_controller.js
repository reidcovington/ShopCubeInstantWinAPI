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
                this.gameView.drawButtons(i);
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
        var prizeMatches = this.calcPrizeMatches();
        this.gameView.drawPrizeMatches(prizeMatches);
        var winningPrize = this.calcMatches();
        if(winningPrize){
            this.triggerWin(winningPrize);
        }else if(this.totalMoves === 0){
            this.triggerLose();
        }
    },
    calcMatches: function(){
        var currentFaces = this.fetchAllFacingPrizes();
        if(_.uniq(currentFaces).length === 1){
            return currentFaces[0];
        }else{
            return false;
        }
    },
    calcPrizeMatches: function(){
        var currentFaces = this.fetchAllFacingPrizes().sort();
        var  count = {}
        currentFaces.forEach(function(element) {
            count[element] = (count[element]||0)+1;
        })
        return count
    },
    fetchAllFacingPrizes: function(){
        var facing = [];
        for(var i = 0; i < this.cubeControllers.length; i++){
            var cubeController = this.cubeControllers[i];
            facing.push(cubeController.getFacingPrize());
        }
        return facing;
    },
    triggerWin: function(winningPrize){
        this.gameView.disableClicks();
        setTimeout(function(){
            // alert("You've Won!")
            this.gameView.drawWinState(winningPrize);
            this.gameView.listenForClaim(winningPrize);
        }.bind(this), 500)
    },
    triggerLose: function(){
        this.gameView.disableClicks();
        setTimeout(function(){
            // alert("You Lost! Please email steve@shopcube.com for further inquiry.")
            $('.modal.lose').show();
        }, 500)
    }
};
