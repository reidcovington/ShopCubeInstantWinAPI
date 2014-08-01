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
    },
    setRandPrizeOn: function(side){
        var newPrize = this.delegate.pickRandPrize;
        this.sides[side] = newPrize;
        this.addPrizeToSeen(side);
    },
    timesSeen: function(prize){
        var self = this;
        return _.filter(self.sides, function(side){ return side === prize }).length
    },
    pickNextPrize: function(){

    }
}

function CubeController(delegate, prizeGallery){
    this.delegate = delegate;
    this.prizeGallery = prizeGallery;
}

CubeController.prototype = {
    pickRandPrize: function(){
        var self = this;
        return _.sample(self.prizeGallery)
    },
    pickNotThisPrize: function(prize){
        var self = this;
        return _.sample(_.without(self.prizeGallery, prize))
    },
    pickPrize: function(prize){
        var prizes = this.prizeGallery;
        if(prize){
            return _.sample(_.without(prizes, prize));
        }else{
            return _.sample(prizes);
        }
    },

}



function GameStateEvaluator(delegate){
    this.delegate = delegate;
}

GameStateEvaluator.prototype = {
    evaluateSides: function(cubeArray){
        var allPrizesSeen = [];
        for(var i = 0; i < cubeArray.length; i++){
            allPrizesSeen += cubeArray[i].prizesSeen;
        }
    }
}


model for cube
view for cube
controller for cube

controller for game
model for game
model for prizegallery
model for evaluator
