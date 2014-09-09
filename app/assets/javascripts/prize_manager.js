function PrizeManager(){
    this.cubesInitiated = 0;
    this.fetchPrizes();
    this.winner = this.determineWinner();
    this.determinePrizes();
};
PrizeManager.prototype = {
    fetchPrizes: function(){
        this.potentialPrizePool = ["<%= asset_path 'car.png' %>", "<%= asset_path 'cash.png' %>", "<%= asset_path 'vacation.png' %>", "<%= asset_path 'ring.png' %>", "<%= asset_path 'house.png' %>",  "<%= asset_path 'shopping.png' %>"]
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
