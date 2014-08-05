user clicks on cube, hightlights it
user clicks on direction, spins cube that way
repeat until run out of moves

game starts -

6 cubes are made, with 4 buttons each
clicking on a cube shows its buttons
clicking on a button rotates cube in that direction
    if new side has a prize already, do nothing
    else generate new prize, add to side
        - 2 ways:
            . completely random, first time
            . after first, taking into account matches, and repeats
                two steps for checking:
                    - uniqueness
                    - matches




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
    }
    statusEval(<current cube>)
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
    this._setupCubeClickListeners();
}
GameView.prototype = {
    // tell GameController which cube got clicked
    _setupCubeClickListeners: function(){
        var self = this;
        $('#cubeface').click(function(e){
            e.preventDefault();
            self.delegate.updateActiveCube(this.indexOf())
        };
    }
    // updateMoveCount -> lower move counter by 1 (this happens in GC)
}


PrizeManager(){
    fetch prize data
}
PrizeManager.prototype = {
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
    produce cube data for GameController
    deactivate view(when any cube is clicked)
    activate view(when this cube is clicked)
    eval side facing(<side>)(trigger cubeModel.newFacing(<side>), check cubeModel.facing for prize, if none, trigger delegate.statusEval(this) else trigger delegate.checkForTotalMatch)
    addPrize(prize) -> cubeModel.assignPrize(prize), cubeView.drawPrize(prize)
}


CubeModel(delegate){
    hold cube info
    this.delegate = delegate;
}
CubeModel.prototype = {
    assignPrize(prize) -> this.sides[this.facing] = prize
}


CubeView(delegate){
    draw cube, buttons
    listen to buttons
    this.delegate = delegate;
    this.active = false;
}
CubeView.prototype = {
    // mark cube active + inactive
    markInactive: function(number){
        this.active = true;
        this.hideButtons(number);
        $("cubeface"+number).removeClass("active");
    },
    markActive: function(number){
        this.active = true;
        this.showButtons(number);
        $("cubeface"+number).addClass("active");
    },
    // show buttons
    showButtons: function(number){
        $("cubeface"+number+"buttons").show();
    },
    // hide buttons
    hideButtons: function(number){
        $("cubeface"+number+"buttons").hide();
    },
    on <position> button click
        - rotate <position> direction
        - tell CubeController eval side facing(<side>)
    drawPrize(prize)
}

