var countInterval = 0

setInterval(() => {
  document.querySelector('.board').style.borderBottom = `${getRandomColor()} 6px solid`  
}, 500);

function renderBoard(mat = gBoard, selector = '.board-container') {
  document.querySelector('.board-container').style.left = `${gLevel.left}`;
  document.querySelector('.board-container').style.width = `${gLevel.width}`;
  var strHTML = '<table border="0"><tbody>';
  for (var i = 0; i < mat.length; i++) {
    strHTML += '<tr>';
    for (var j = 0; j < mat[0].length; j++) {
      var cellData = printDataCell(mat[i][j]);
      var className = 'cell cell' + i + '-' + j + ' ';
      if (mat[i][j].minesAroundCount === 0 && mat[i][j].isShown) className += 'empty-cell'
      strHTML += '<td class="' + className + '" onmousedown="chooseAction(event)"> ' + cellData + ' </td>'
    }
    strHTML += '</tr>'
  }
  strHTML += '</tbody></table>';
  var elContainer = document.querySelector(selector);
  elContainer.innerHTML = strHTML;
}

function renderCell(location, value) {
  // Select the elCell and set the value
  var elCell = document.querySelector(`.cell${location.i}-${location.j}`);
  elCell.innerHTML = value;
}



function initRenderGame() {
  document.querySelector('.smile').textContent = '😀';
  var elLife = '';
  var elHinit = ''
  for (let index = 0; index < gLife; index++) {
    elLife += `<i class="fas fa-2x fa-heart"></i>`;
    elHinit += `<i class="fas fa-2x fa-lightbulb" data-valid="true" id="hinit0" onclick="chooseAction(event)"></i>`
  }
  document.querySelector('.life').innerHTML = elLife;
  document.querySelector('.hints').innerHTML = elHinit;
  document.querySelector('.fa-share-square').textContent = ` ${gSafeClick}`;
  var elScore = document.querySelector('.score');
  var lastRecord = parseInt(localStorage.getItem(`record${(gLevel.SIZE / 4)}`));
  if(lastRecord === null || lastRecord == 'NaN'){
    elScore.textContent = 'BEST SCORE: 0 S' ;
  }else{
    elScore.textContent = `BEST SCORE: ${lastRecord} S`;
  }
}



function printDataCell(cell) {
  //תדפיס מה שצריך עבור כל משבצת בהתאם לתאים
  if (cell.isHint) {
    if (cell.isMine) return MINE
    return cell.minesAroundCount;
  }
  if (cell.isShown && !cell.isMine) {
    if (cell.minesAroundCount === 0) {

    }
    return cell.minesAroundCount;
  } else if (cell.isMarked) {
    return FLAG
  } else if (cell.isMine && cell.isShown) {
    return MINE;
  } else {
    return EMPTY;
  }
}


function extractLocation(strLocation) {
  let locationCell = {
    i: parseInt(strLocation.substring(0, strLocation.indexOf('-'))),
    j: parseInt(strLocation.substring(strLocation.indexOf('-') + 1, strLocation.length))
  }
  return locationCell;
}


function startTimer() {
  var timer = document.querySelector('.time');
  var countMil = 0;
  var countSec = 1;
  timer.innerHTML = `<i class="fas fa-clock"></i>
  `;

  countInterval = setInterval(() => {
    timer.innerHTML = `<i class="fas fa-clock"></i> 
    ${countSec} : ${countMil}`;
    countMil++;
    if (countMil > 100) {
      countSec++;
      countMil = 0;
    }
  }, 10)
}


function stopTimer() {
  var timer = document.querySelector('.time');
  clearInterval(countInterval);
  timer.innerHTML = `<i class="fas fa-clock"></i> 
  ${timer.textContent}`;
}

function countNeighbors(cellI, cellJ, mat = gBoard) {
  var neighborsCount = 0;
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i >= mat.length) continue;
    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      if (i === cellI && j === cellJ) continue;
      if (j < 0 || j >= mat[i].length) continue;
      if (mat[i][j].isMine === true) neighborsCount++;

    }
  }
  return neighborsCount;
}

function checkExpose(cellI, cellJ, mat = gBoard, flagHinits = false) {
  var neighbors = [];
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i >= mat.length) continue;
    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      if (i === cellI && j === cellJ) continue;
      if (j < 0 || j >= mat[i].length) continue;
      if (mat[i][j].isMine === false || flagHinits) {
        neighbors.push({ i: i, j: j, show: mat[i][j].isShown, count: mat[i][j].minesAroundCount });
      }
    }
  }
  return neighbors;
}


function printMsg(msg, color, timeOut = 1500) {
  document.querySelector('.msg').style.display = 'block';
  document.querySelector('.msg').style.color = color;
  if(document.querySelector('.side1').style.background === 'var(--bg1)'){
    document.querySelector('.msg').style.color = 'rgb(59, 59, 59)';
  }
  document.querySelector('.msg').textContent = msg;
  setTimeout(() => {
    document.querySelector('.msg').style.display = 'none'
  }, timeOut);
}






function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}


function getRandomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}



function changeUI(msg, icon, color = '#eb2f06', timeOut = 1500) {
  var strIconSide = '';
  for (let index = 0; index < 100; index++) {
    strIconSide += `${icon}`;
  }
  document.querySelector('.side1').style.background =
    document.querySelector('.side2').style.background =
    document.querySelector('.firstRow').style.background = `${color}`;
  document.querySelector('.side1').textContent = document.querySelector('.side2').textContent = strIconSide;

  printMsg(`${msg}`, color, timeOut);

  setTimeout(() => {
    document.querySelector('.side1').style.background = `var(--bg1)`;
    document.querySelector('.side2').style.background = `var(--bg1)`;
    document.querySelector('.firstRow').style.background = `var(--bg1)`;
    document.querySelector('.side1').textContent = '';
    document.querySelector('.side2').textContent = '';

  }, timeOut);
}




function getEmptyCells() {
  var emptyCells = [];
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[0].length; j++) {

      if (!gBoard[i][j].isShown && gBoard[i][j].isMine == false){
        emptyCells.push({i: i, j: j});
      }
    }
  }
  return emptyCells 
}
