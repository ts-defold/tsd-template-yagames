const highscores: Array<{
  initials: string;
  score: number;
}> = [];

export default {
  scores: highscores,
  set_score: (score: number, initials = ""): void => {
    highscores.push({
      initials,
      score,
    });
    highscores.sort((a, b) => b.score - a.score);
    if (highscores.length > 5) {
      highscores.pop();
    }
  }
};
