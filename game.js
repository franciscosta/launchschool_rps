// ****
const help = require('./helper.js');
const msg = require('./messages.json');

// ****
const game = {

  play: true,

  move: {
    user: null,
    computer: null,
  },

  winningCombos: {
    rock: ['scissor', 'lizard'],
    paper: ['rock', 'spock'],
    scissor: ['paper', 'lizard'],
    spock: ['scissor', 'rock'],
    lizard: ['paper', 'spock'],
  },

  score: {
    user: 0,
    computer: 0,
  },

  rounds: {
    current: 0,
    max: 0,
    maxCeil: 10,
  },

  winner: {
    round: null,
    game: null,
  },

};

// ****
const resetGame = () => {
  game.move.user = null;
  game.move.computer = null;
  game.score.user = 0;
  game.score.computer = 0;
  game.rounds.current = 0;
  game.rounds.max = 0;
  game.winner.round = null;
  game.winner.game = null;
};

// ****
const getAllMoves = () => {
  return [...Object.keys(game.winningCombos)];
};

const roundIsValid = () => {
  return game.rounds.current < game.rounds.max;
};

const nextRound = () => {
  game.rounds.current += 1;
};

const setPlayState = userIntent => {
  game.play = userIntent;
};

const setRounds = userIntent => {
  game.rounds.max = userIntent;
};

// ****
const scissorSpockCheck = userInput => {
  if (userInput === 'sc') return 'scissor';
  if (userInput === 'sp') return 'spock';
  return userInput;
};

const detectMove = userInput => {
  const possibleMoves = getAllMoves();

  if (userInput === 's') return 'confirm';

  let move = scissorSpockCheck(userInput);

  possibleMoves.forEach(option => {
    if (userInput === option || userInput === option[0]) move = option;
  });

  if (!move) move = 'invalid';

  return move;
};

const moveIsInvalid = move => {
  return ['invalid', 'confirm'].includes(move);
};

const confirmMove = () => {
  const possibleMoves = ['scissor', 'spock'];
  let move = help.getUserInput(msg.warning.confirm);

  move = scissorSpockCheck(move);

  while (!possibleMoves.includes(move)) {
    move = help.getUserInput(msg.warning.confirm);
  }

  return move;
};

// ****
const getUserMove = () => {
  let move = detectMove(help.getUserInput(msg.question.choices));

  while (moveIsInvalid(move)) {
    if (move === 'confirm') {
      move = confirmMove();
    } else {
      help.log(msg.warning.invalid);
      move = detectMove(help.getUserInput(msg.question.choices));
    }
  }
  return move;
};

// ****
const setUserMove = () => {
  game.move.user = getUserMove();
};

const setComputerMove = () => {
  const possibleMoves = getAllMoves();
  const randomChoice = help.randomMumber(possibleMoves.length);
  game.move.computer = possibleMoves[randomChoice];
};

// ****
const computeRoundWinner = () => {
  const user = game.move.user;
  const computer = game.move.computer;

  let winner;
  if (user === computer) {
    winner = 'tie';
  } else if (game.winningCombos[user].includes(computer)) {
    winner = 'You';
  } else {
    winner = 'Computer';
  }

  return winner;
};

const setRoundWinner = () => {
  game.winner.round = computeRoundWinner();
};

// ****
const updateScore = () => {
  const winner = game.winner.round.toLowerCase();

  if (winner === 'you') game.score.user += 1;
  if (winner === 'computer') game.score.computer += 1;
};

// ****
const playRound = () => {
  setUserMove();
  setComputerMove();
  setRoundWinner();
  updateScore();
  nextRound();
};

// ****
const computeGrandWinner = () => {
  const user = game.score.user;
  const computer = game.score.computer;

  if (user > computer) return 'You';
  if (computer > user) return 'Computer';
  return null;
};

const setGrandWinner = () => {
  game.winner.game = computeGrandWinner();
};

// ****
const getNumberOfRounds = () => {
  let rounds = Number( help.getUserInput(msg.question.howManyRounds) );

  while ( !Number.isInteger(rounds) ||
          rounds <= 0 || rounds >  game.rounds.maxCeil) {
    help.log(msg.warning.invalidRound);
    rounds = Number( help.getUserInput(msg.question.howManyRounds) );
  }

  return rounds;
};

const getIntentToStartRound = () => {
  let intent = help.confirm(msg.question.playRound);

  while (!intent) intent = help.confirm(msg.question.playRound);
  help.clear();
};

const getIntentToPlayAgain = () => {
  return help.confirm(msg.question.playAgain);
};

// ****
const logWelcome = () => {
  help.clear();
  help.log(msg.info.welcome);
  help.log(msg.info.whatGame);
  help.log(msg.info.information);
  help.emptySpace();
};

const logRound = () => {
  help.log(msg.round.user + game.move.user);
  help.log(msg.round.computer + game.move.computer);

  if (game.winner.round === 'tie') {
    help.log(msg.round.roundTie);
  } else {
    help.log(msg.round.roundWinner + game.winner.round);
  }

  help.log(msg.round.roundScore + `You: ${game.score.user} / Computer: ${game.score.computer}`);
  help.log(msg.round.currentRound + `${game.rounds.current} / ${game.rounds.max}`);
  help.emptySpace();
};

const logGrandWinner = () => {
  help.clear();
  const winner = game.winner.game;

  if (!winner) {
    help.log(msg.game.tie);
  } else {
    help.log(msg.game.win + winner);
  }
  help.emptySpace();
};

// ****
const gamePlay = () => {
  while (game.play) {
    logWelcome();
    setRounds( getNumberOfRounds() );
    while ( roundIsValid() ) {
      getIntentToStartRound();
      playRound();
      logRound();
    }
    setGrandWinner();
    logGrandWinner();
    setPlayState( getIntentToPlayAgain() );
    resetGame();
  }
};

// ****
gamePlay();
