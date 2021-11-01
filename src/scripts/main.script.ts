import * as yagames from "yagames.yagames";
import * as lldebugger from "lldebugger.debug";

// Enable lldebugger
lldebugger.start();

interface props {
  initialized: boolean;
}

export function init(this: props): void {
  yagames.init((_ctx, err) => {
    if (err != undefined) {
      print("Error initializing yagames:", err);
      return;
    }
    yagames.leaderboards_init((_ctx, err) => {
      if (err != undefined) {
        print("Error initializing leaderboards:", err);
        return;
      }
      print("Leaderboards initialized");
    });

    this.initialized = true;
  });
}

export function on_message(
  this: props,
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
