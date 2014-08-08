user clicks on cube, hightlights it
user clicks on direction, spins cube that way
repeat until run out of moves

game starts -

probability calculation of winning carried out resulting in win (and win what) or lose
6 cubes are made, with 4 buttons each
clicking on a cube shows its buttons
clicking on a button rotates cube in that direction
    if new side has a prize already, do nothing
    else generate new prize, add to side
        - 2 ways winning or losing:
            -winning:
                -the first prize is always the winning prize
                -if they move the first cube again its a random prize
                -the 2nd cube-5th cube 50% shot at matching winning prize, 50% shot of unique non winning prize
                -6th cube is 1/moves-left chance at winning prize
            -losing:
            -all cubes completely random of 6 of the same prizes
            -but last cube wont match any string of winning prizes
            -with a cube always check for
                    - uniqueness




GameController(){
    // attach 6x cubeControllers
    this.cubeControllers = [new CubeController(),
                                new CubeController(),
                                new CubeController(),
                                new CubeController(),
                                new CubeController(),
                                new CubeController()]
    // attach gameView
    this.gameView = new GameView(this);
    // attach prizeManager
    this.prizeManager = new PrizeManager();
}
GameController.prototype = {
    // tell all cubes to deactivate, tell particular cube its active
    updateActiveCube: function(number){
        for (var i=0; i < this.cubeControllers.length; i++){
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
             totalMatches = 0,
             currentCubePrizes = cubeController.getAllSidePrizes();
        for(var i = 0; i < this.cubeControllers.length; i++){
            if(i != skipCubeIndex){
                facesOfOtherCubes += this.cubeControllers[i].getFacingPrize()
                facesOfOtherCubes = facesOfOtherCubes.sort()
                for(var x = 0; x < facesOfOtherCubes.length; x++){
                    if(facesOfOtherCubes[x] === facesOfOtherCubes[x+1]){
                        totalMatches += 1
                    }
                }
            }
        }
        this.prizeManager.generatePrize(currentCubePrizes, facesOfOtherCubes, totalMatches);
    },
    statusEval(<current cubeController>)
        - pulls all other cube side data
        - sends to prizeManager.generatePrize(<current cube>, <other cube data>)
        - <current cube>.addPrize(newPrize)
        - this.checkForTotalMatch
    checkForTotalMatch -> pulls all facing sides, compares for total match
        if match:
            - send prize info to server
            - server generates url with prize info, etc.
        else:
            - deductMove()
    deductMove -> check moves left, if none endGame, else this.moves -1, gameView.updateMoveCount
    endGame -> make them feel good about losing
}


GameView(delegate){
    // listen to clicks on cubes for setting active
    this.delegate = delegate;
    this._setupCubeSelectionListeners();
}
GameView.prototype = {
    // tell GameController which cube got clicked
    _setupCubeSelectionListeners: function(){
        var self = this;
        $('.cubeface').click(function(e){
            self.delegate.updateActiveCube(this.indexOf())
        }
    }
    // updateMoveCount -> lower move counter by 1 (this happens in GC)
}


function PrizeManager(){
    this.cubesInitiated = 0;
    this.determinePrizes();
}
PrizeManager.prototype = {
    fetchPrizes: function(){
        this.prizePool = $.ajax(stuff);
    },
    determineWinner: function(){
        return _.sample(["win", "lose"], 1)
    },
    determinePrizes: function(){
        // executes probability and determines winning prize(null if losing)
        if (determineWinner === "win"){
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
                return _.sample((_.without(possibleRemainingPrizes, facesOfOtherCubes[0]) , 1)
            }
        }
        // if(this.winningPrize){
        //     if( currentCubePrizes.length === 0){
        //         this.cubesInitiated += 1;
        //         this.genBlankCubePrizeForWinner(this.cubesInitiated);
        //     }else{
        //         this.genDirtyCubePrize()
        //     }
        //     complicated stuff with odds
        // }else{
        //     return _.sample(possibleRemainingPrizes, 1)
        // }
    },
    // genBlankCubePrizeForWinner: function(cubeNumber){
    //     var self = this;
    //     if(cubeNumber === 1){
    //         return self.winningPrize;
    //     }else if(cubeNumber < 6){
    //         return _.sample([self.winningPrize] + _.sample(self.prizePool, 1)], 1);
    //     }else{
    //         return _.sample([self.winningPrize] + _.sample(self.prizePool, self.numberOfTurnsLeft - 1)], 1)
    //     }
    // }

}


CubeController(){
    // attach view, model
    this.cubeModel = CubeModel.new(this);
    this.cubeView = CubeView.new(this);
}
CubeController.prototype = {
    markInactive: function(number){
        this.cubeView.markInactive(number)
    },
    markActive: function(number){
        this.cubeView.markActive(number)
    },
    receiveTurnDirection: function(direction){
        this.cubeModel.updateSideFacing(direction);
        this.cubeView.rotate(direction);
    },
    checkOldFace: function(){
        this.delegate.checkForTotalMatch();
    },
    fillNewFace: function(){
        this.delegate.statusEval(this);
    }

    produce cube data for GameController
    deactivate view(when any cube is clicked)
    activate view(when this cube is clicked)
    eval side facing(<side>)(trigger cubeModel.newFacing(<side>), check cubeModel.facing for prize, if none, trigger delegate.statusEval(this) else trigger delegate.checkForTotalMatch)
    addPrize(prize) -> cubeModel.assignPrize(prize), cubeView.drawPrize(prize)
}


CubeModel(delegate){
    this.delegate = delegate;
    this.sides = {1: null, 2: null, 3: null, 4: null, 5: null, 6: null};
    this.facing = 1;
    this.prizesSeen = [];
    // matrix data
}
CubeModel.prototype = {
    updateSideFacing: function(direction){
        // => matrix calculations = this.facing
        if(this.sides[this.facing]){
            this.delegate.checkOldFace();
        }else{
            this.delegate.fillNewFace();
        }
    }
    assignPrize(prize) -> this.sides[this.facing] = prize
}


CubeView(delegate){
    // draw cube, buttons
    // listen to buttons
    this.delegate = delegate;
    this.active = false;
    this._setupButtonClickListeners();
}
CubeView.prototype = {
    // mark cube active + inactive
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
    // show buttons
    showButtons: function(number){
        $(".cubeface"+number+"buttons").show();
    },
    // hide buttons
    hideButtons: function(number){
        $(".cubeface"+number+"buttons").hide();
    },
    _setupButtonClickListeners: function(){
        var self = this;
        $('[data-button-direction]').click(function(e){
            self.delegate.receiveTurnDirection($(this).data('button-direction')) //=> "left"
            // self.delegate.updateActiveCube(this.indexOf())

        }
    },
    rotateUp: function(){
    xAngle += 90;
    $('#cube').css("-webkitTransform", "rotateX("+xAngle+"deg) rotateY("+yAngle+"deg)");
    },
    rotateDown: function(){
    xAngle -= 90;
    $('#cube').css("-webkitTransform", "rotateX("+xAngle+"deg) rotateY("+yAngle+"deg)");
    },
    rotateRight: function(){
    yAngle += 90;
    $('#cube').css("-webkitTransform", "rotateX("+xAngle+"deg) rotateY("+yAngle+"deg)");
    },
    rotateLeft: function(){
    yAngle -= 90;
    $('#cube').css("-webkitTransform", "rotateX("+xAngle+"deg) rotateY("+yAngle+"deg)");
    }

    // on <position> button click
    //     - rotate <position> direction
    //     - tell CubeController eval side facing(<side>)
    // drawPrize(prize)
}
// <div data-direction="left" class="button">left</div>




prizeGenerator - has 4 prizes, gives you one randomly whenever you call #generatePrize
cubeController - assigns prize to new side
gameController - checks for running out of turns and matching all 6 cubes

graphical stuff(cubes, turning logic, etc)
