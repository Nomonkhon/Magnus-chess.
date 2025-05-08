
let board, game, timerInterval, timeLeft = 600;

document.getElementById("startBtn").onclick = () => {
  document.querySelector(".container").classList.add("hidden");
  document.getElementById("levelMenu").classList.remove("hidden");
};

document.querySelectorAll(".level-btn").forEach(btn => {
  btn.onclick = () => {
    document.getElementById("levelMenu").classList.add("hidden");
    document.getElementById("gameContainer").classList.remove("hidden");
    startGame(btn.dataset.level);
  };
});

function startGame(level) {
  game = new Chess();
  board = Chessboard('board', {
    draggable: true,
    position: 'start',
    onDrop: onDrop
  });
  startTimer();
}

function onDrop(source, target) {
  let move = game.move({
    from: source,
    to: target,
    promotion: 'q'
  });

  if (move === null) return 'snapback';
  window.setTimeout(makeBestMove, 250);
  updateStatus();
}

function makeBestMove() {
  let possibleMoves = game.moves();
  if (possibleMoves.length === 0) {
    showResult();
    return;
  }
  let move = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
  game.move(move);
  board.position(game.fen());
  updateStatus();
}

function updateStatus() {
  if (game.in_checkmate()) {
    document.getElementById("status").innerText =
      game.turn() === 'w' ? "Вы проиграли чемпиону мира — это тоже достижение" :
      "Поздравляю, теперь вы чемпион мира";
    clearInterval(timerInterval);
  }
}

function startTimer() {
  timerInterval = setInterval(() => {
    timeLeft--;
    let min = Math.floor(timeLeft / 60);
    let sec = timeLeft % 60;
    document.getElementById("timer").innerText =
      `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      document.getElementById("status").innerText = "Время вышло!";
    }
  }, 1000);
}
