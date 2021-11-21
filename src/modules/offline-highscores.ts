const highscores: Array<{
  initials: string;
  score: number;
  default?: boolean;
}> = [
  { initials: "AAA", score: 5, default: true },
  { initials: "AAA", score: 4, default: true },
  { initials: "AAA", score: 3, default: true },
  { initials: "AAA", score: 2, default: true },
  { initials: "AAA", score: 1, default: true },
];

export default {
  scores: highscores,
  set_score: (score: number, initials = ""): void => {
    const replace = highscores.findIndex((h) => h?.default === true ? h.score === score : false);
    if (replace !== -1) {
      highscores[replace].initials = initials;
      highscores[replace].score = score;
      highscores[replace].default = false;
    }
    else {
      highscores.push({
        initials,
        score,
      });
    }
    
    highscores.sort((a, b) => b.score - a.score);
    if (highscores.length > 5) {
      highscores.pop();
    }
  }
};
