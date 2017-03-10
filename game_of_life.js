var board = [];
var columns = 80;
var rows = 20;
var neighbours = [-1, 1, columns, -columns, columns - 1, columns + 1, -columns + 1, -columns - 1];
var regen;
var genWeighting = 0.05; //sets start weighting for generation 0=Off 1=On


// create grid rows
_.range(rows).map(function (elem, index) {
  var rowId = 'row' + index; //create id for the div
  var $newDiv = $("<div>").attr('id', rowId).addClass("row"); //create and empty div with iD
  var $divLoc = $('.board'); //locate div container;
  $divLoc.append($newDiv);
  createCellsInRow(index);
});

// create grid cells in rows (columns)
function createCellsInRow(rowId) {
  _.range(columns).map(function(elem, index) {
    var cellId = 'cell' + ((rowId * columns) + index); //create id for the div
    var $newDiv = $("<div>").attr('id', cellId).addClass("cell"); //create and empty div with iD
    var $divLoc = $("#row" + rowId); //locate div container;
    $divLoc.append($newDiv);
  });
};

// initialise board
function initBoard(columns, rows) {
  var cellNum = 0;
  while (cellNum < (columns * rows)) {
    board.push(initCell());
    cellNum += 1;
  };
}

// set init cell to On or Off. Weighted to Off for better genreation results
function initCell() {
  return cellState = Math.random() < genWeighting ? 1 : 0;
}

function printBoard() {
  board.forEach(function (elem, index) {
    var cellClass;
    var cellId = "cell" + index;
    var bground = "green";
    elem > 0 ? cellClass = "cell-live" : cellClass = "cell-dead";
    $("#" + cellId).attr("class", cellClass);
  });
}

initBoard(columns, rows);

// generate new tick of baord
function newGeneration() {
  var cellScore, cellState;
  var newBoard = [];
  board.forEach(function (elem, index) {
    cellScore = checkNeighbours(index);
    cellState = newCellState(index, cellScore);
    newBoard.push(cellState);
  });
  board = newBoard;
  printBoard();
}

// Checking each neighbour state. Tabulate a score
function checkNeighbours(cellIndex) {
  var cellScore;
  var cellTotal = 0;
  neighbours.forEach(function (element) {
    // Account for neighbours outside the array range
    isNaN(board[cellIndex + element]) ? cellScore = 0 : cellScore = board[cellIndex + element];
    cellTotal += cellScore
  });
  return cellTotal;
}

// Cell dies unless neighbour score is 2-3 OR dead cell has neighbour score ==3
function newCellState(cellIndex, cellScore) {
  var newCellState = 0;
  cellScore == 2 || cellScore == 3 && board[cellIndex] ? newCellState = 1 : newCellState = 0;
  if (cellScore == 3 && board[cellIndex] == 0) newCellState = 1;
  return newCellState;
}

// game controls
$("#start-gen").on("click", function () {
  regen = setInterval(function () {newGeneration ()}, 500);
});

$("#stop-gen").on("click", function () {
  clearInterval(regen);
});