let board = null;
let game = new Chess();
let level = 1;

$('#startButton').on('click', function() {
    $('.start-screen').addClass('hidden');
    $('.level-screen').removeClass('hidden');
});

$('#easy').on('click', function() { level = 1; startGame(); });
$('#medium').on('click', function() { level = 2; startGame(); });
$('#hard').on('click', function() { level = 3; startGame(); });

function startGame() {
    $('.level-screen').addClass('hidden');
    $('.game-screen').removeClass('hidden');
    board = Chessboard('board', {
        draggable: true,
        position: 'start',
        onDrop: onDrop
    });
}

function onDrop(source, target) {
    let move = game.move({ from: source, to: target, promotion: 'q' });

    if (move === null) return 'snapback';
    window.setTimeout(makeBestMove, 250);
    updateStatus();
}

function makeBestMove() {
    let bestMove = getBestMove(game, level);
    game.move(bestMove);
    board.position(game.fen());
    updateStatus();
}

function getBestMove(game, depth) {
    if (game.game_over()) return;

    let moves = game.moves();
    let bestMove = null;
    let bestValue = -9999;
    for (let i = 0; i < moves.length; i++) {
        let move = moves[i];
        game.move(move);
        let boardValue = -evaluateBoard(game, depth - 1, -10000, 10000, false);
        game.undo();
        if (boardValue > bestValue) {
            bestValue = boardValue;
            bestMove = move;
        }
    }
    return bestMove;
}

function evaluateBoard(game, depth, alpha, beta, isMaximizingPlayer) {
    if (depth === 0 || game.game_over()) {
        return -getMaterialCount(game.board());
    }

    let moves = game.moves();
    if (isMaximizingPlayer) {
        let maxEval = -9999;
        for (let move of moves) {
            game.move(move);
            let eval = evaluateBoard(game, depth - 1, alpha, beta, false);
            game.undo();
            maxEval = Math.max(maxEval, eval);
            alpha = Math.max(alpha, eval);
            if (beta <= alpha) break;
        }
        return maxEval;
    } else {
        let minEval = 9999;
        for (let move of moves) {
            game.move(move);
            let eval = evaluateBoard(game, depth - 1, alpha, beta, true);
            game.undo();
            minEval = Math.min(minEval, eval);
            beta = Math.min(beta, eval);
            if (beta <= alpha) break;
        }
        return minEval;
    }
}

function getMaterialCount(board) {
    let value = 0;
    for (let row of board) {
        for (let piece of row) {
            if (piece) {
                let v = 0;
                if (piece.type === 'p') v = 1;
                else if (piece.type === 'n' || piece.type === 'b') v = 3;
                else if (piece.type === 'r') v = 5;
                else if (piece.type === 'q') v = 9;
                v = piece.color === 'w' ? v : -v;
                value += v;
            }
        }
    }
    return value;
}

function updateStatus() {
    let status = '';
    if (game.in_checkmate()) {
        status = game.turn() === 'w' ? 'Вы проиграли чемпиону мира — это тоже достижение!' : 'Поздравляю, теперь вы чемпион мира!';
    } else if (game.in_draw()) {
        status = 'Ничья!';
    } else {
        status = 'Ходит ' + (game.turn() === 'w' ? 'белые (Вы)' : 'чёрные (Magnus)');
    }
    $('#status').text(status);
}