import * as yagames from "yagames.yagames";
import * as fx from "../modules/fx";
import offlineScores from "../modules/offline-highscores";

type Action = {
  pressed: boolean;
  released: boolean;
};

interface props {
  scores: Array<{
    initials: string,
    score: number,
  }>;
  mode: "around" | "top";
  request: boolean;
  pending: boolean;
}

export function init(this: props): void {
  msg.post(".", "acquire_input_focus");
  
  this.scores = [];
  this.mode = "top";
  this.pending = true;
  this.request = false;
  requestLeaderboard(this, "top");
}

export function update(this: props, _dt: number): void {
  if (!this.pending && this.request) {
    this.pending = true;
    this.request = false;
    requestLeaderboard(this, this.mode === "top" ? "around" : "top");
    fx.press();
  }
}

export function on_input(this: props, action_id: hash, action: Action): void {
  if ((action_id == hash("start") || action_id == hash("back")) && action.pressed) {
    msg.post("main:/main#script", "show_title");
    fx.press();
    
  }
  else if (action_id == hash("accept") && action.pressed) {
    this.request = true;
  }
}

export function on_message(this: props, message_id: string, message: unknown): void {
  // Virtual Input
  if (message_id == hash("on_virtual_input")) {
    const { action_id, action } = message as { action_id: hash; action: Action };
    on_input.call(this, action_id, action);
  }
}

function requestLeaderboard(props: props, mode: "top" | "around"): void {
  //! HTML5 Only
  const info = sys.get_sys_info() as { system_name: string };
  if (info.system_name !== "HTML5") {
    updateLeaderboard(props, true);
    return;
  }

  //* YaGames Leaderboards GetEntries
  yagames.leaderboards_get_entries("highscore", { includeUser: mode === "around", quantityTop: 5}, (_ctx, err, data) => {
    props.pending = false;
    if (err !== undefined) {
      updateLeaderboard(props, true);
      return;
    }
  
    print("leaderboards_get_entries ->", data, data?.entries.length, data?.userRank, data?.ranges);
    props.scores = data?.entries.map(entry => ({
      initials: entry.extraData ?? "AAA",
      score: entry.score,
    })) ?? [];
    props.mode = mode;
    updateLeaderboard(props);
  });
}

function updateLeaderboard(props: props, offline = false): void {
  print("updateLeaderboard ->", props.scores.length, props.mode, offline);
  for (let i = 0; i < 5; i++) {
    const initials_node = gui.get_node(`name-${i+1}`);
    const score_node = gui.get_node(`score-${i+1}`);
    const db = offline ? offlineScores : props;
    gui.set_text(initials_node, i < db.scores.length ? db.scores[i].initials : "");
    gui.set_text(score_node, i < db.scores.length ? db.scores[i].score.toString() : "");
  }
}
