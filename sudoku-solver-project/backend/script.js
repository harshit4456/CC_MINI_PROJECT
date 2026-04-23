const grid = document.getElementById("grid");
let timer = 0, interval;

// 🔹 Create grid
for (let i = 0; i < 81; i++) {
    let input = document.createElement("input");
    input.maxLength = 1;

    input.addEventListener("input", () => {
        input.value = input.value.replace(/[^1-9]/g, "");
        highlightErrors();
        checkSudoku(false);
    });

    let row = Math.floor(i / 9);
    let col = i % 9;

    if (row % 3 === 0) input.style.borderTop = "2px solid black";
    if (col % 3 === 0) input.style.borderLeft = "2px solid black";
    if (row === 8) input.style.borderBottom = "2px solid black";
    if (col === 8) input.style.borderRight = "2px solid black";

    grid.appendChild(input);
}

// 🔹 Timer
function startTimer() {
    clearInterval(interval);
    timer = 0;
    interval = setInterval(() => {
        timer++;
        document.getElementById("timer").innerText = "⏱ Time: " + timer + "s";
    }, 1000);
}

// 🔹 Get board
function getBoard() {
    let inputs = document.querySelectorAll("input");
    let board = [];
    for (let i = 0; i < 9; i++) {
        let row = [];
        for (let j = 0; j < 9; j++) {
            let val = inputs[i * 9 + j].value;
            row.push(val === "" ? 0 : parseInt(val));
        }
        board.push(row);
    }
    return board;
}

// 🔹 Set board
function setBoard(board) {
    let inputs = document.querySelectorAll("input");
    for (let i = 0; i < 9; i++)
        for (let j = 0; j < 9; j++)
            inputs[i * 9 + j].value = board[i][j] || "";
}

// 🔹 Safe check
function isSafe(board, r, c, n) {
    for (let i = 0; i < 9; i++)
        if (board[r][i] === n || board[i][c] === n) return false;

    let sr = r - r % 3, sc = c - c % 3;
    for (let i = 0; i < 3; i++)
        for (let j = 0; j < 3; j++)
            if (board[i + sr][j + sc] === n) return false;

    return true;
}

// 🔥 Highlight errors
function highlightErrors() {
    let inputs = document.querySelectorAll("input");
    let board = getBoard();

    inputs.forEach(i => i.style.background = "");

    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            let num = board[r][c];
            if (num === 0) continue;

            board[r][c] = 0;

            if (!isSafe(board, r, c, num)) {

                for (let i = 0; i < 9; i++)
                    inputs[r * 9 + i].style.background = "#ffcccc";

                for (let i = 0; i < 9; i++)
                    inputs[i * 9 + c].style.background = "#ffcccc";

                let sr = r - r % 3;
                let sc = c - c % 3;

                for (let i = 0; i < 3; i++)
                    for (let j = 0; j < 3; j++)
                        inputs[(sr + i) * 9 + (sc + j)].style.background = "#ffcccc";
            }

            board[r][c] = num;
        }
    }
}

// 🔹 Check Sudoku
function checkSudoku(showAlert = true) {
    let board = getBoard();
    let valid = true;

    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            let num = board[r][c];
            if (num === 0) continue;

            board[r][c] = 0;
            if (!isSafe(board, r, c, num)) valid = false;
            board[r][c] = num;
        }
    }

    let result = document.getElementById("result");

    if (valid) {
        result.innerText = "✅ Sudoku is VALID";
        result.style.color = "green";
    } else {
        result.innerText = "❌ Sudoku is WRONG";
        result.style.color = "red";
    }

    return valid;
}

// 🔹 Solve
function solve(board) {
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            if (board[r][c] === 0) {
                for (let n = 1; n <= 9; n++) {
                    if (isSafe(board, r, c, n)) {
                        board[r][c] = n;
                        if (solve(board)) return true;
                        board[r][c] = 0;
                    }
                }
                return false;
            }
        }
    }
    return true;
}

// 🔹 Animated solve
async function solveAnimated() {
    let board = getBoard();
    await solveAnim(board);
    highlightErrors();
}

async function solveAnim(board) {
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            if (board[r][c] === 0) {
                for (let n = 1; n <= 9; n++) {
                    if (isSafe(board, r, c, n)) {
                        board[r][c] = n;
                        setBoard(board);
                        await new Promise(res => setTimeout(res, 20));
                        if (await solveAnim(board)) return true;
                        board[r][c] = 0;
                    }
                }
                return false;
            }
        }
    }
    return true;
}

// 🔹 Generate
function generatePuzzle() {
    startTimer();
    let board = Array(9).fill().map(() => Array(9).fill(0));
    solve(board);

    let difficulty = document.getElementById("difficulty").value;

    for (let i = 0; i < difficulty; i++) {
        let r = Math.floor(Math.random() * 9);
        let c = Math.floor(Math.random() * 9);
        board[r][c] = 0;
    }

    setBoard(board);
}

// 🔹 Clear
function clearGrid() {
    document.querySelectorAll("input").forEach(i => {
        i.value = "";
        i.style.background = "";
    });
    document.getElementById("result").innerText = "";
}

// 🔹 Dark mode
function toggleDarkMode() {
    document.body.classList.toggle("dark");
    document.body.classList.toggle("light");
}