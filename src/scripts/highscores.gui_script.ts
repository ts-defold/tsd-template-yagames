import * as yagames from "yagames.yagames";

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
  }
}

export function on_input(this: props, action_id: hash, action: Action): void {
  if (action_id == hash("start")&& action.pressed) {
    msg.post("main:/main#script", "show_title");
  }
  else if (action_id == hash("accept") || action_id == hash("back") && action.pressed) {
    this.request = true;
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
    if (err !== undefined) return;
  
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
    gui.set_text(initials_node, i < props.scores.length ? props.scores[i].initials : offline ? "AAA" : "");
    gui.set_text(score_node, i < props.scores.length ? props.scores[i].score.toString() : offline ? ((i+1)*100).toString() : "");
  }
}
