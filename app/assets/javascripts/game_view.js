function GameView(delegate){
    this.delegate = delegate;
    this._setupCubeSelectionListeners();
}
GameView.prototype = {
    _setupCubeSelectionListeners: function(){
        var self = this;
        $("[data-cube]").click(function(e){
            self.delegate.updateActiveCube($(this).data("cube"));
        })
    },
    drawMoveCount: function(moves){
        $('[data-moves]').html(moves + " turns left")
    },
    drawPrizeMatches: function(prizeMatches){
        $("[data-matches]").html("0 matches");
        var prizesVisible = Object.keys(prizeMatches);
        prizesVisible.forEach(function(prize){
            $("[data-prize='" + prize + "'] [data-matches]").html("<span style='font-weight: bolder; color: rgba(85, 85, 85, 1)'>" + prizeMatches[prize] + " matches</span>");
        });
    },
    disableClicks: function(){
        $(document).click(function(e) {
            e.stopPropagation();
            e.preventDefault();
            e.stopImmediatePropagation();
            return false;
        });
    },
    drawButtons: function(buttonIndex){
        var buttonSets = $(".buttons");
        buttonSets.fadeOut(150);
        setTimeout(function(){
            $(buttonSets[buttonIndex]).fadeIn(300);
        }, 150);
    },
    drawWinState: function(winningPrize){
        $("[data-prize='" + winningPrize + "'] img").attr("style", "background-color: yellow; border: 1px solid goldenrod");
        $("[data-prize='" + winningPrize + "'] span").html("CLAIM").attr("class", "claim-prize");
        $("[data-prize='" + winningPrize + "']").attr("class", "button-red");
    },
    listenForClaim: function(winningPrize){
        $("[data-prize='" + winningPrize + "']").click(function(event){
            event.preventDefault();
            $('.modal.win').show();
        })
    }
};
