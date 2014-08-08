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
    attach 6x cubeControllers
    attach gameView
    attach prizeManager
}
GameController.prototype = {
    tell all cubes to deactivate, tell particular cube its active
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


GameView(){
    listen to clicks on cubes for setting active
}
GameView.prototype = {
    tell GameController which cube got clicked
    updateMoveCount -> lower move counter by 1
}


PrizeManager(){
    fetch prize data
}
PrizeManager.prototype = {
    generatePrize(currentCubeData, otherCubeData) -> do fancy algorithm stuff, return a prize
    _reduceToUniqueness
}


CubeController(){
    attach view, model
}
CubeController.prototype = {
    produce cube data for GameController
    deactivate view(when any cube is clicked)
    activate view(when this cube is clicked)
    eval side facing(<side>)(trigger cubeModel.newFacing(<side>), check cubeModel.facing for prize, if none, trigger delegate.statusEval(this) else trigger delegate.checkForTotalMatch)
    addPrize(prize) -> cubeModel.assignPrize(prize), cubeView.drawPrize(prize)
}


CubeModel(){
    hold cube info
}
CubeModel.prototype = {
    assignPrize(prize) -> this.sides[this.facing] = prize
}


CubeView(){
    draw cube, buttons
    listen to buttons
}
CubeView.prototype = {
    show buttons
    hide buttons
    on <position> button click
        - rotate <position> direction
        - tell CubeController eval side facing(<side>)
    drawPrize(prize)
}

8/7/14:
prizeGenerator - has 4 prizes, gives you one randomly whenever you call #generatePrize
cubeController - assigns prize to new side
gameController - checks for running out of turns and matching all 6 cubes

graphical stuff(cubes, turning logic, etc)
