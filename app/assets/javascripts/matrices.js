var originalPosition = [
                //   f, bk, l, t, r, bt
      /* side 1 */  [ 1, 0, 0, 0, 0, 0 ],
      /* side 2 */  [ 0, 1, 0, 0, 0, 0 ],
      /* side 3 */  [ 0, 0, 1, 0, 0, 0 ],
      /* side 4 */  [ 0, 0, 0, 1, 0, 0 ],
      /* side 5 */  [ 0, 0, 0, 0, 1, 0 ],
      /* side 6 */  [ 0, 0, 0, 0, 0, 1 ]
]

var rotateLeft = [
                //   f, bk, l, t, r, bt
      /* side 1 */  [ 0, 0, 1, 0, 0, 0 ],
      /* side 2 */  [ 0, 0, 0, 0, 1, 0 ],
      /* side 3 */  [ 0, 1, 0, 0, 0, 0 ],
      /* side 4 */  [ 0, 0, 0, 1, 0, 0 ],
      /* side 5 */  [ 1, 0, 0, 0, 0, 0 ],
      /* side 6 */  [ 0, 0, 0, 0, 0, 1 ]
]

var rotateRight = [
                //   f, bk, l, t, r, bt
      /* side 1 */  [ 0, 0, 0, 0, 1, 0 ],
      /* side 2 */  [ 0, 0, 1, 0, 0, 0 ],
      /* side 3 */  [ 1, 0, 0, 0, 0, 0 ],
      /* side 4 */  [ 0, 0, 0, 1, 0, 0 ],
      /* side 5 */  [ 0, 1, 0, 0, 0, 0 ],
      /* side 6 */  [ 0, 0, 0, 0, 0, 1 ]
]

var rotateUp = [
                //   f, bk, l, t, r, bt
      /* side 1 */  [ 0, 0, 0, 1, 0, 0 ],
      /* side 2 */  [ 0, 0, 0, 0, 0, 1 ],
      /* side 3 */  [ 0, 0, 1, 0, 0, 0 ],
      /* side 4 */  [ 0, 1, 0, 0, 0, 0 ],
      /* side 5 */  [ 0, 0, 0, 0, 1, 0 ],
      /* side 6 */  [ 1, 0, 0, 0, 0, 0 ]
]

var rotateDown = [
                //   f, bk, l, t, r, bt
      /* side 1 */  [ 0, 0, 0, 0, 0, 1 ],
      /* side 2 */  [ 0, 0, 0, 1, 0, 0 ],
      /* side 3 */  [ 0, 0, 1, 0, 0, 0 ],
      /* side 4 */  [ 1, 0, 0, 0, 0, 0 ],
      /* side 5 */  [ 0, 0, 0, 0, 1, 0 ],
      /* side 6 */  [ 0, 1, 0, 0, 0, 0 ]
]

function rotateCube(current, direction){
    var result = [];
    for(var row = 0; row < direction.length; row++){
        result[row] = [];
        for(var column = 0; column < current[0].length; column++){
            var sum = 0;
            for(var i = 0; i < current.length; i++){
                sum += current[i][column] * direction[row][i];
            }
            result[row].push(sum);
        }
    }
    return result;
}