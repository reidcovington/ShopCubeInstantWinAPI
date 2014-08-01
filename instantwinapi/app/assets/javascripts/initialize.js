$(function() {
  // $('[data-square-1] [data-buttons]').click(function(){
  //   drawRandomPrize('[data-square-1] [data-square-face');
  //   console.log(prize)
  // });
});

// function drawRandomPrize(selector){
//   prize = "#FFFFF".concat(determineRandomPrize(1,7)).toString()
//   $( selector ).css( "background-color", prize );
// };

// function determineRandomPrize(min, max) {
//   return Math.floor(Math.random() * (max - min)) + min;
// };
function CubeModel(delegate){
    this.delegate = delegate;
    this.sides = {1: null, 2: null, 3: null, 4: null, 5: null, 6: null};
    this.facing = 1;
    this.prizesSeen = [];
}

CubeModel.prototype = {
    addPrizeToSeen: function(side){
        if(this.prizesSeen.indexOf(this.sides[side]) === -1){
            this.prizesSeen << this.sides[side];
        }
    }
}

function GameStateEvaluator(delegate){
    this.delegate = delegate;
}

GameStateEvaluator.prototype = {
    evaluateSides: function(cubeArray){
        var prizesSeen = [];
        for(var i = 0; i < cubeArray.length; i++){
            var sides = cubeArray[i].sides;
            for(var x = 1; x <= sides.length; x++){
                if(sides[x]){
                    prizesSeen << sides[x];
                }
            }
        }
    }
}

model for cube
view for cube
controller for cube

controller for game
model for game
model for evaluator
