const choicesClassic = ['paper', 'rock', 'scissor'];
const choicesExtended = [...choicesClassic, 'lizard', 'spock'];

let playerScore = 0;
let computerScore = 0;
let roundsLeft;
let roundsPlayed = 0;
let scoreHistory = [];

function startGame() {
    const selectedMode = document.getElementById("mode").value;
    const selectedRounds = parseInt(document.getElementById("rounds").value);

    roundsLeft = selectedRounds;
    playerScore = 0;
    computerScore = 0;
    roundsPlayed = 0;
    scoreHistory = [];
    document.getElementById("displayPlayerScore").textContent = `Your Score: ${playerScore}`;
    document.getElementById("displayComputerScore").textContent = `Computer Score: ${computerScore}`;

    document.getElementById("game-area").classList.remove("hidden");
    document.getElementById("end-game-summary").classList.add("hidden");

    if (selectedMode === "extended") {
        document.querySelectorAll(".extended-button").forEach(btn => btn.style.display = "inline-block");
    } else {
        document.querySelectorAll(".extended-button").forEach(btn => btn.style.display = "none");
    }

    const title = selectedMode.charAt(0).toUpperCase() + selectedMode.slice(1) + " Mode";
    document.getElementById("game-mode-title").textContent = title;

    initializeChart();
}

function playGame(playerChoice) {
    const selectedMode = document.getElementById("mode").value;
    const choices = selectedMode === "extended" ? choicesExtended : choicesClassic;
    const computerChoice = choices[Math.floor(Math.random() * choices.length)];

    roundsPlayed++;
    roundsLeft--;

    document.getElementById("playerDisplay").textContent = `Player: ${playerChoice}`;
    document.getElementById("computerDisplay").textContent = `Computer: ${computerChoice}`;

    let result;
    if (playerChoice === computerChoice) {
        result = "It's a tie!";
    } else if ((playerChoice === 'rock' && (computerChoice === 'scissor' || computerChoice === 'lizard')) ||
               (playerChoice === 'paper' && (computerChoice === 'rock' || computerChoice === 'spock')) ||
               (playerChoice === 'scissor' && (computerChoice === 'paper' || computerChoice === 'lizard')) ||
               (playerChoice === 'lizard' && (computerChoice === 'spock' || computerChoice === 'paper')) ||
               (playerChoice === 'spock' && (computerChoice === 'scissor' || computerChoice === 'rock'))) {
        result = "You win!";
        playerScore++;
    } else {
        result = "Computer wins!";
        computerScore++;
    }

    document.getElementById("displayResults").textContent = result;
    document.getElementById("displayPlayerScore").textContent = `Your Score: ${playerScore}`;
    document.getElementById("displayComputerScore").textContent = `Computer Score: ${computerScore}`;

    updateProgressBar();
    updateScoreChart();

    if (roundsLeft === 0) {
        endGame();
    }
}

function resetScores() {
    playerScore = 0;
    computerScore = 0;
    document.getElementById("displayPlayerScore").textContent = `Your Score: ${playerScore}`;
    document.getElementById("displayComputerScore").textContent = `Computer Score: ${computerScore}`;
    roundsPlayed = 0;
    updateProgressBar();
    initializeChart();
}

function updateProgressBar() {
    const totalRounds = parseInt(document.getElementById("rounds").value);
    const percentage = ((totalRounds - roundsLeft) / totalRounds) * 100;
    document.getElementById("progressBar").style.width = `${percentage}%`;
}

function initializeChart() {
    const ctx = document.getElementById('scoreChart').getContext('2d');
    window.scoreChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Player Score',
                data: [],
                borderColor: '#ff4d94',
                fill: false,
                tension: 0.1
            }, {
                label: 'Computer Score',
                data: [],
                borderColor: '#00aaff',
                fill: false,
                tension: 0.1
            }]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Rounds Played'
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Score'
                    }
                }
            }
        }
    });
}

function updateScoreChart() {
    const totalRounds = parseInt(document.getElementById("rounds").value);

    scoreHistory.push({round: roundsPlayed, player: playerScore, computer: computerScore});

    window.scoreChart.data.labels.push(`Round ${roundsPlayed}`);
    window.scoreChart.data.datasets[0].data.push(playerScore);
    window.scoreChart.data.datasets[1].data.push(computerScore);
    window.scoreChart.update();
}

function endGame() {
    document.getElementById("game-area").classList.add("hidden");
    document.getElementById("end-game-summary").classList.remove("hidden");

    let summary = "Final Scores: \n";
    summary += `Player: ${playerScore} \n`;
    summary += `Computer: ${computerScore} \n\n`;

    scoreHistory.forEach((score, index) => {
        summary += `Round ${index + 1}: Player ${score.player} - Computer ${score.computer}\n`;
    });

    if (playerScore > computerScore) {
        summary += "\nYou are the overall winner!";
    } else if (playerScore < computerScore) {
        summary += "\nThe computer is the overall winner!";
    } else {
        summary += "\nIt's a tie overall!";
    }

    document.getElementById("summary-text").textContent = summary;
}

function restartGame() {
    document.getElementById("end-game-summary").classList.add("hidden");
    startGame();
}
