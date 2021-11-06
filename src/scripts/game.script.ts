import * as yagames from "yagames.yagames";

export function on_message(
  this: void,
  message_id: hash,
  message: unknown,
): void {
  if (message_id === hash("highscore")) {
    const { score } = message as { score: number };
    yagames.leaderboards_set_score("highscore", score, "", (_ctx, err) => {
      if (err != undefined) {
        print("Something went wrong", err);
        return;
      }
    });
  }
}
