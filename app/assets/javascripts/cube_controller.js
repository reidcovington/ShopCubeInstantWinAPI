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
