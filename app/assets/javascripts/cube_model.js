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
