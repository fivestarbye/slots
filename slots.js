const cells = document.querySelectorAll('.cell');
const images = ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg'];
const winSound = document.getElementById('winSound');
const winText = document.getElementById('winText');
const lever = document.getElementById('lever');
const spinBtn = document.getElementById('spinBtn');

let isSpinning = false;

function spinSlots() {
  if (isSpinning) return;
  isSpinning = true;
  spinBtn.disabled = true;
  lever.classList.add('animate');
  clearHighlights();

  // 隨機不重複圖片三組
  const columns = [shuffle(images.slice()), shuffle(images.slice()), shuffle(images.slice())];

  let frame = 0;
  const maxFrames = 20;
  const interval = setInterval(() => {
    for (let col = 0; col < 3; col++) {
      for (let row = 0; row < 3; row++) {
        const idx = (frame + row) % 6;
        const img = columns[col][idx];
        const cellIndex = row * 3 + col;
        cells[cellIndex].innerHTML = `<img src="${img}">`;
      }
    }
    frame++;
    if (frame >= maxFrames) {
      clearInterval(interval);
      lever.classList.remove('animate');
      checkWin();
    }
  }, 100);
}

function checkWin() {
  const result = [];
  for (let i = 0; i < 9; i++) {
    const img = cells[i].querySelector('img')?.src.split('/').pop();
    result.push(img);
  }

  const winLines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // 橫線
    [0, 4, 8], [2, 4, 6],           // 斜線
    [0, 3, 6], [1, 4, 7], [2, 5, 8] // 直線
  ];

  let hasWin = false;
  for (let i = 0; i < winLines.length; i++) {
    const line = winLines[i];
    const [a, b, c] = line;
    const lineImgs = [result[a], result[b], result[c]];

    if (i >= 5) { // 第5,6,7條線是直線判斷（索引從0算）
      // 直線允許圖片重複判斷：只要兩張相同就中獎
      if (lineImgs[0] && (lineImgs[0] === lineImgs[1] || lineImgs[1] === lineImgs[2] || lineImgs[0] === lineImgs[2])) {
        highlightCells(line);
        hasWin = true;
      }
    } else {
      // 橫線、斜線必須三張一樣才中獎
      if (lineImgs[0] && lineImgs[0] === lineImgs[1] && lineImgs[0] === lineImgs[2]) {
        highlightCells(line);
        hasWin = true;
      }
    }
  }

  if (hasWin) {
    winSound.play();
    winText.style.display = 'flex';
    launchFireworks();      // 確保呼叫煙火特效函式
    setTimeout(() => {
      winText.style.display = 'none';
      stopFireworks();
      spinBtn.disabled = false;
      isSpinning = false;
    }, 7000);
  } else {
    spinBtn.disabled = false;
    isSpinning = false;
  }
}

function shuffle(arr) {
  return arr
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

function clearHighlights() {
  cells.forEach(cell => cell.classList.remove('highlight'));
}

function highlightCells(indices) {
  indices.forEach(i => cells[i].classList.add('highlight'));
}