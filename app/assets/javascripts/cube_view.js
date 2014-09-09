function CubeView(delegate, cubeNumber){
    this.delegate = delegate;
    this.cube = "[data-cube='" + cubeNumber + "'] .cube"
    this.xAngle = 0;
    this.yAngle = 0;
    this.matrix = [ //f, bk, l, t, r, bt
        /* side 1 */[ 1, 0, 0, 0, 0, 0 ],
        /* side 2 */[ 0, 1, 0, 0, 0, 0 ],
        /* side 3 */[ 0, 0, 1, 0, 0, 0 ],
        /* side 4 */[ 0, 0, 0, 1, 0, 0 ],
        /* side 5 */[ 0, 0, 0, 0, 1, 0 ],
        /* side 6 */[ 0, 0, 0, 0, 0, 1 ]
    ];
    this.rotations = {
        "0 -90": [ // f, bk, l, t, r, bt
        /* side 1 */[ 0, 0, 1, 0, 0, 0 ],
        /* side 2 */[ 0, 0, 0, 0, 1, 0 ],
        /* side 3 */[ 0, 1, 0, 0, 0, 0 ],   // left
        /* side 4 */[ 0, 0, 0, 1, 0, 0 ],
        /* side 5 */[ 1, 0, 0, 0, 0, 0 ],
        /* side 6 */[ 0, 0, 0, 0, 0, 1 ]
        ],
        "0 90": [ //  f, bk, l, t, r, bt
        /* side 1 */[ 0, 0, 0, 0, 1, 0 ],
        /* side 2 */[ 0, 0, 1, 0, 0, 0 ],
        /* side 3 */[ 1, 0, 0, 0, 0, 0 ],   // right
        /* side 4 */[ 0, 0, 0, 1, 0, 0 ],
        /* side 5 */[ 0, 1, 0, 0, 0, 0 ],
        /* side 6 */[ 0, 0, 0, 0, 0, 1 ]
        ],
        "90 0": [ //  f, bk, l, t, r, bt
        /* side 1 */[ 0, 0, 0, 1, 0, 0 ],
        /* side 2 */[ 0, 0, 0, 0, 0, 1 ],
        /* side 3 */[ 0, 0, 1, 0, 0, 0 ],   // up
        /* side 4 */[ 0, 1, 0, 0, 0, 0 ],
        /* side 5 */[ 0, 0, 0, 0, 1, 0 ],
        /* side 6 */[ 1, 0, 0, 0, 0, 0 ]
        ],
        "-90 0": [ // f, bk, l, t, r, bt
        /* side 1 */[ 0, 0, 0, 0, 0, 1 ],
        /* side 2 */[ 0, 0, 0, 1, 0, 0 ],
        /* side 3 */[ 0, 0, 1, 0, 0, 0 ],   // down
        /* side 4 */[ 1, 0, 0, 0, 0, 0 ],
        /* side 5 */[ 0, 0, 0, 0, 1, 0 ],
        /* side 6 */[ 0, 1, 0, 0, 0, 0 ]
        ]
    };
    this._setupButtonClickListeners();
};
CubeView.prototype = {
    _setupButtonClickListeners: function(){
        var self = this;
        $('[data-direction]').click(function(e){
            e.stopPropagation();
            $('[data-direction]').css("pointer-events", "none");
            self.delegate.receiveTurnDirection($(this).data('direction'));
            setTimeout(function(){
                $('[data-direction]').css("pointer-events", "auto");
            }, 1600);
        })
    },
    activate: function(){
        $(this.cube + " [data-side]").css({"background-color": "rgba(0, 210, 255, .9)", "border-color": "rgba(0, 115, 190, 0.95)"})
    },
    deactivate: function(){
        $(this.cube + " [data-side]").css({"background-color": "rgba(0, 115, 190, .9)", "border-color": "rgba(0, 55, 100, .95)"})
    },
    rotateCube: function(direction){
        this.matrix = this.createRotatedMatrix(this.matrix, this.rotations[direction]);
        this.animateCubeRotation(direction);
    },
    createRotatedMatrix: function(current, direction){
        var newMatrix = [];
        for(var row = 0; row < current.length; row++){
            newMatrix[row] = [];
            for(var column = 0; column < direction[0].length; column++){
                var sum = 0;
                for(var i = 0; i < current[row].length; i++){
                    sum += current[row][i] * direction[i][column];
                }
                newMatrix[row].push(sum);
            }
        }
        return newMatrix;
    },
    animateCubeRotation: function(direction){
        var directions = direction.split(" ");
        this.xAngle = parseInt(directions[0]);
        this.yAngle = parseInt(directions[1]);
        var self = this;
        $(self.cube).css("transform", "translateZ(-75px) rotateX("+self.xAngle+"deg) rotateY("+self.yAngle+"deg)");
        setTimeout(function(){
            $(self.cube).css("transition", "0")
            $(self.cube).css("transform", "translateZ(-75px) rotateX(0deg) rotateY(0deg)");
            self.assignFaces();
        }, 2000);
        $(self.cube).css("-webkit-transition", "transform 2s ease-in-out")
    },
    assignFaces: function(){
        var self = this;
        var faces = ["front", "back", "left", "top", "right", "bottom"]
        for(var sideIndex = 0; sideIndex < this.matrix.length; sideIndex++){
            var direction = faces[this.matrix[sideIndex].indexOf(1)];
            $(this.cube + ' [data-side=' + sideIndex + ']').attr("class", "face " + direction)
            if(direction === "front"){
                self.delegate.receiveSideFacing(sideIndex);
            }
        }
    },
    drawPrize: function(prize, currentSide){
        var imageSelector = this.cube + " [data-side='" + currentSide + "'] img";
        $(imageSelector).fadeOut(200);
        setTimeout(function(){
            $(imageSelector).attr("src", prize);
            $(imageSelector).fadeIn(300);
        }, 200);
    }
};
