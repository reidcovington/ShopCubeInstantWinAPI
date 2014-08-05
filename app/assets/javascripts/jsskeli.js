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
        this.prizeManager.generatePrize(cubeController);
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
    this.determineWinner();
}
PrizeManager.prototype = {
    determineWinner: function(){
        // executes probability and determines winning prize(null if losing)
        this.winningPrize = prize;
    },
    generatePrize(currentCubeData, otherCubeData) -> do fancy algorithm stuff, return a prize
    _reduceToUniqueness

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
    draw cube, buttons
    listen to buttons
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
    }
    on <position> button click
        - rotate <position> direction
        - tell CubeController eval side facing(<side>)
    drawPrize(prize)
}
<div data-direction="left" class="button">left</div>
