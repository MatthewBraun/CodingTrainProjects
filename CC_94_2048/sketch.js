/*
* Original from Daniel Shiffman
* https://github.com/CodingTrain/website/tree/master/CodingChallenges/CC_94_2048
*
* Revised by: Matthew Braun
* Some things I've changed
1.the new numbers are set to a light purple background :D 
2.the background color of the html changes and is controlled by CSS
3.for easier testing I added a testing function that will loop random arrow keys
4.refactored if statement to switch :D 
5.surprise game over screen :D :D

Some of code for the Color text & tiles from jelitter
*
*/


let grid;
let score = 0;
let colorNewNumber = [];
var checkbox;
let seenMe = false;

function isGameOver() {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (grid[i][j] == 0) {
        return false;
      }
      if (i !== 3 && grid[i][j] === grid[i + 1][j]) {
        return false;
      }
      if (j !== 3 && grid[i][j] === grid[i][j + 1]) {
        return false;
      }
    }
  }
  return true;
}

function blankGrid() {
  return [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ];
}

function addToggle() {
  checkbox = createCheckbox('label', false);
  checkbox.changed(myCheckedEvent);
  createP('ON = Play 50 turns for me');
  createP('OFF = End the game for me');
}

function setup() {
  createCanvas(410, 410);
  noLoop();
  grid = blankGrid();
  addNumber();
  addNumber();
  updateCanvas();
  addToggle();
}

function myCheckedEvent() {
  if (this.checked()) {
    seenMe = true;
    speedTesting();
  } else {
    if (seenMe) {
      speedTesting();
      speedTesting();
      speedTesting();
      speedTesting();
      speedTesting();
    }
  }
}

function addNumber() {
  let options = [];
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (grid[i][j] === 0) {
        options.push({
          x: i,
          y: j
        });
      }
    }
  }
  if (options.length > 0) {
    let spot = random(options);
    let r = random(1);
    grid[spot.x][spot.y] = r > 0.5 ? 2 : 4;
    colorNewNumber.push(spot.x); //save x location for color
    colorNewNumber.push(spot.y); //save y location for color
  }
}

function compare(a, b) {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (a[i][j] !== b[i][j]) {
        return true;
      }
    }
  }
  return false;
}

function copyGrid(grid) {
  let extra = blankGrid();
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      extra[i][j] = grid[i][j];
    }
  }
  return extra;
}

function flipGrid(grid) {
  for (let i = 0; i < 4; i++) {
    grid[i].reverse();
  }
  return grid;
}

function rotateGrid(grid) {
  let newGrid = blankGrid();
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      newGrid[i][j] = grid[j][i];
    }
  }
  return newGrid;
}

function keyPressed() {
  if (!isGameOver()) {
    move(keyCode); //call move function with the keyCode
  }
}

// One "move"
function move(keyCode) {
  let flipped = false;
  let rotated = false;
  let played = true;

  switch (keyCode) {
    case DOWN_ARROW:
      // DO NOTHING
      break;
    case UP_ARROW:
      grid = flipGrid(grid);
      flipped = true;
      break;
    case RIGHT_ARROW:
      grid = rotateGrid(grid);
      rotated = true;
      break;
    case LEFT_ARROW:
      grid = rotateGrid(grid);
      grid = flipGrid(grid);
      rotated = true;
      flipped = true;
      break;
    default:
      played = false;
  }

  if (played) {
    let past = copyGrid(grid);
    for (let i = 0; i < 4; i++) {
      grid[i] = operate(grid[i]);
    }
    let changed = compare(past, grid);

    if (flipped) {
      grid = flipGrid(grid);
    }
    if (rotated) {
      grid = rotateGrid(grid);
      grid = rotateGrid(grid);
      grid = rotateGrid(grid);
    }
    if (changed) {
      addNumber();
    }
    updateCanvas();

    if (isGameOver()) {
      createEndGame();
    }
  }
}

function createEndGame() {
  let theLink = "hello.mp4"; //hello.mp4 is video at end screen
  document.getElementById("video_pop").innerHTML = "<video id=\"the_Video\" controls autoplay loop><source src=\"" + theLink + "\" type=\"video/mp4\" ><img src=\"https://pbs.twimg.com/media/DVnxM1pUMAAPqYH.jpg:large\">No Support for html5 videos.</video>"; //if the video doesn't play then display another picture of Dan
  document.getElementById("video_pop").style.display = "block";
  //some text to tell user game is over
  var y = document.getElementById("end");
  y.innerText = "Game Over, Thank you for playing!";
  //scroll user up 
  window.scrollTo(0, 0);
}

function operate(row) {
  row = slide(row);
  row = combine(row);
  row = slide(row);
  return row;
}

function updateCanvas() {
  drawGrid();
  select('#score').html(score);
}

// making new array
function slide(row) {
  let arr = row.filter(val => val);
  let missing = 4 - arr.length;
  let zeros = Array(missing).fill(0);
  arr = zeros.concat(arr);
  return arr;
}

// operating on array itself
function combine(row) {
  for (let i = 3; i >= 1; i--) {
    let a = row[i];
    let b = row[i - 1];
    if (a == b) {
      row[i] = a + b;
      score += row[i];
      row[i - 1] = 0;
    }
  }
  return row;
}
/*
 * Code in getTextColor function is from jelitter
 * URL = https://github.com/jelitter/2048-Coding-Train
 */
function getTextColor(value) {
  const colors = [color(249, 246, 242), color(119, 110, 101)];
  return (value >= 8) ? colors[0] : colors[1];
}
/*
 * Code in getColor function is from jelitter
 * URL = https://github.com/jelitter/2048-Coding-Train
 */
function getColor(value) {
  // Colors from http://scrambledeggsontoast.github.io/2014/05/09/writing-2048-elm/
  const colors = {
    0: 'rgba(238, 228, 218, 0.32)',
    2: color(238, 228, 218),
    4: color(237, 224, 200),
    8: color(242, 177, 121),
    16: color(245, 149, 99),
    32: color(246, 124, 95),
    64: color(246, 94, 59),
    128: color(237, 207, 114),
    256: color(237, 204, 97),
    512: color(237, 200, 80),
    1024: color(237, 197, 63),
    2048: color(237, 194, 4)
  }
  return (value > 2048) ? colors[2048] : colors[value] || colors[0];
}

function clearBoard() {
  let w = 100;
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      strokeWeight(2);
      stroke('rgba(100%,100%,100%,.5)');
      fill(238, 228, 218); //reset fill to white
      rect(i * w + 5, j * w + 5, w, w, 10);
    }
  }
}

function drawGrid() {
  let w = 100;
  clearBoard();
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      let val = grid[i][j];
      //if its a new number color it purple then remove the location from array
      fill(getColor(val)); //by jelitter
      if (colorNewNumber[0] === i && colorNewNumber[1] === j) {
        fill('rgba(33%, 16%, 50%, .30)');
        colorNewNumber.reverse();
        colorNewNumber.pop();
        colorNewNumber.pop();
        colorNewNumber.reverse();
      }
      rect(i * w + 5, j * w + 5, w, w, 10);
      if (grid[i][j] !== 0) {
        textAlign(CENTER, CENTER);
        let s = "" + val;
        let len = s.length - 1;
        let sizes = [64, 64, 52, 16];
        textSize(sizes[len]);
        fill(getTextColor(val)); //by jelitter 
        text(val, i * w + w / 2 + 5, j * w + w / 2 + 5);
      }
    }
  }
}

//~~ testing section ~~
//keyPressed function above must accept a parameter
function speedTesting() {
  for (let index = 0; index < 50; index++) {
    let x = floor(random(0, 4));
    switch (x) {
      case 0:
        move(UP_ARROW);
        break;
      case 1:
        move(DOWN_ARROW);
        break;
      case 2:
        move(RIGHT_ARROW);
        break;
      case 3:
        move(LEFT_ARROW);
        break;
      default:
    }
    //stops the loop if the game is over
    if (isGameOver()) {
      break;
    }
  }
  // console.log('testing finished');
}