/**********************************************
 * STARTER CODE
 **********************************************/

/**
 * shuffle()
 * Shuffle the contents of an array
 *   depending the datatype of the source
 * Makes a copy. Does NOT shuffle the original.
 * Based on Steve Griffith's array shuffle prototype
 * @Parameters: Array or string
 * @Return: Scrambled Array or string, based on the provided parameter
 */
function shuffle (src) {
  const copy = [...src]

  const length = copy.length
  for (let i = 0; i < length; i++) {
    const x = copy[i]
    const y = Math.floor(Math.random() * length)
    const z = copy[y]
    copy[i] = z
    copy[y] = x
  }

  if (typeof src === 'string') {
    return copy.join('')
  }

  return copy
}

/**********************************************
 * YOUR CODE BELOW
 **********************************************/

const { useState, useEffect } = React;

const ScrambleGame = () => {
  const WORDS = [
    'galaxy', 'planet', 'astronaut', 'rocket', 'satellite',
    'nebula', 'asteroid', 'comet', 'telescope', 'universe',
    'spacecraft', 'meteor', 'orbit', 'solar', 'lunar'
  ];
  
  const MAX_STRIKES = 3;
  const MAX_PASSES = 3;
  

  
  const [gameWords, setGameWords] = useState(() => {
    const saved = localStorage.getItem('scramble-gameWords');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [currentWord, setCurrentWord] = useState(() => {
    return localStorage.getItem('scramble-currentWord') || '';
  });
  
  const [scrambledWord, setScrambledWord] = useState(() => {
    return localStorage.getItem('scramble-scrambledWord') || '';
  });
  
  const [guess, setGuess] = useState('');
  
  const [points, setPoints] = useState(() => {
    const saved = localStorage.getItem('scramble-points');
    return saved ? parseInt(saved) : 0;
  });
  
  const [strikes, setStrikes] = useState(() => {
    const saved = localStorage.getItem('scramble-strikes');
    return saved ? parseInt(saved) : 0;
  });
  
  const [passes, setPasses] = useState(() => {
    const saved = localStorage.getItem('scramble-passes');
    return saved ? parseInt(saved) : MAX_PASSES;
  });
  
  const [feedback, setFeedback] = useState('');
  const [feedbackType, setFeedbackType] = useState('');
  
  const [gameOver, setGameOver] = useState(() => {
    const saved = localStorage.getItem('scramble-gameOver');
    return saved ? JSON.parse(saved) : false;
  });
  
  const [gameWon, setGameWon] = useState(() => {
    const saved = localStorage.getItem('scramble-gameWon');
    return saved ? JSON.parse(saved) : false;
  });
  




  useEffect(() => {
    if (gameWords.length === 0 && !gameOver) {
      startNewGame();
    }
  }, []);
  



  useEffect(() => {
    localStorage.setItem('scramble-gameWords', JSON.stringify(gameWords));
  }, [gameWords]);
  
  useEffect(() => {
    localStorage.setItem('scramble-currentWord', currentWord);
  }, [currentWord]);
  
  useEffect(() => {
    localStorage.setItem('scramble-scrambledWord', scrambledWord);
  }, [scrambledWord]);
  
  useEffect(() => {
    localStorage.setItem('scramble-points', points.toString());
  }, [points]);
  
  useEffect(() => {
    localStorage.setItem('scramble-strikes', strikes.toString());
  }, [strikes]);
  
  useEffect(() => {
    localStorage.setItem('scramble-passes', passes.toString());
  }, [passes]);
  
  useEffect(() => {
    localStorage.setItem('scramble-gameOver', JSON.stringify(gameOver));
  }, [gameOver]);
  
  useEffect(() => {
    localStorage.setItem('scramble-gameWon', JSON.stringify(gameWon));
  }, [gameWon]);
  
  const startNewGame = () => {
    const shuffledWords = shuffle(WORDS);
    setGameWords(shuffledWords);
    setCurrentWord(shuffledWords[0]);
    setScrambledWord(shuffle(shuffledWords[0]));
    setGuess('');
    setPoints(0);
    setStrikes(0);
    setPasses(MAX_PASSES);
    setFeedback('');
    setFeedbackType('');
    setGameOver(false);
    setGameWon(false);
  };
  

  const nextWord = () => {
    const remainingWords = gameWords.slice(1);
    setGameWords(remainingWords);
    
    if (remainingWords.length === 0) {
      setGameOver(true);
      setGameWon(true);
    } else {
      setCurrentWord(remainingWords[0]);
      setScrambledWord(shuffle(remainingWords[0]));
    }
  };
  
  const handleGuess = (e) => {
    e.preventDefault();
    
    if (!guess.trim()) return;
    
    if (guess.toLowerCase() === currentWord.toLowerCase()) {
      setPoints(points + 1);
      setFeedback('Correct! Well done!');
      setFeedbackType('correct');
      nextWord();
    } else {
      const newStrikes = strikes + 1;
      setStrikes(newStrikes);
      setFeedback('Incorrect. Try again!');
      setFeedbackType('incorrect');
      
      if (newStrikes >= MAX_STRIKES) {
        setGameOver(true);
        setGameWon(false);
      }
    }
    
    setGuess('');
  };
  
  const handlePass = () => {
    if (passes > 0) {
      setPasses(passes - 1);
      setFeedback('Word passed.');
      setFeedbackType('');
      nextWord();
    }
  };
  
  const handleRestart = () => {
    localStorage.removeItem('scramble-gameWords');
    localStorage.removeItem('scramble-currentWord');
    localStorage.removeItem('scramble-scrambledWord');
    localStorage.removeItem('scramble-points');
    localStorage.removeItem('scramble-strikes');
    localStorage.removeItem('scramble-passes');
    localStorage.removeItem('scramble-gameOver');
    localStorage.removeItem('scramble-gameWon');
    
    startNewGame();
  };
  
  if (gameOver) {
    return (
      <div className="game-container">
        <h1>Scramble Game</h1>
        <div className="game-over">
          <h2>{gameWon ? 'Congratulations! You Won!' : 'Game Over!'}</h2>
          <p>Final Score: {points} points</p>
          <p>Strikes: {strikes}/{MAX_STRIKES}</p>
          <button className="restart-btn" onClick={handleRestart}>
            Play Again
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="game-container">
      <h1> Space Scramble Game</h1>
      
      <div className="game-stats">
        <div className="stat">
          <div className="stat-value">{points}</div>
          <div className="stat-label">Points</div>
        </div>
        <div className="stat">
          <div className="stat-value">{strikes}/{MAX_STRIKES}</div>
          <div className="stat-label">Strikes</div>
        </div>
        <div className="stat">
          <div className="stat-value">{passes}</div>
          <div className="stat-label">Passes</div>
        </div>
      </div>
      
      <div className="progress">
        Word {WORDS.length - gameWords.length + 1} of {WORDS.length}
      </div>
      
      <div className="scrambled-word">{scrambledWord}</div>
      
      <form onSubmit={handleGuess} className="input-container">
        <input
          type="text"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          placeholder="Enter your guess..."
          autoFocus
        />
        <button type="submit" className="guess-btn">
          Guess
        </button>
      </form>
      
      <div>
        <button 
          className="pass-btn" 
          onClick={handlePass}
          disabled={passes === 0}
        >
          Pass ({passes} remaining)
        </button>
      </div>
      
      {feedback && (
        <div className={`feedback ${feedbackType}`}>
          {feedback}
        </div>
      )}
    </div>
  );
};

ReactDOM.render(<ScrambleGame />, document.getElementById('root'));