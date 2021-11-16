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

  updateLeaderboard(this);

  //! Leaderboards only on HTML5
  const info = sys.get_sys_info() as { system_name: string };
  if (info.system_name !== "HTML5") return;

  //* YaGames Leaderboards GetEntries
  yagames.leaderboards_get_entries("highscore", { includeUser: false, quantityTop: 5}, (_ctx, err, data) => {
    this.pending = false;
    if (err != "") return;

    this.scores = data?.entries.map(entry => ({
      initials: entry.player.publicName.substr(0, 3),
      score: entry.score,
    })) ?? [];
  });
}

export function update(this: props, _dt: number): void {
  if (!this.pending && this.request) {
    this.pending = true;
    this.request = false;

    //! HTML5
    const info = sys.get_sys_info() as { system_name: string };
    if (info.system_name !== "HTML5") return;

    if (this.mode === "around") {
      //* YaGames Leaderboards GetEntries
      yagames.leaderboards_get_entries("highscore", { includeUser: false, quantityTop: 5}, (_ctx, err, data) => {
        this.pending = false;
        if (err === undefined) return;

        this.scores = data?.entries.map(entry => ({
          initials: entry.player.publicName.substr(0, 3),
          score: entry.score,
        })) ?? [];
        this.mode = "top";
        updateLeaderboard(this);
      });
    }
    else if (this.mode === "top") {
      //* YaGames Leaderboards GetEntries
      yagames.leaderboards_get_entries("highscore", { includeUser: true, quantityAround: 5}, (_ctx, err, data) => {
        this.pending = false;
        if (err === undefined) return;

        this.scores = [];
        this.scores = data?.entries.map(entry => ({
          initials: entry.player.publicName.substr(0, 3),
          score: entry.score,
        })) ?? [];
        this.mode = "around";
        updateLeaderboard(this);
      });
    }
  }
}

export function on_input(this: props, action_id: hash, action: Action): void {
  if (action_id == hash("back") || action_id == hash("start")&& action.pressed) {
    msg.post("main:/main#script", "show_title");
  }
  else if (action_id == hash("accept") && action.pressed) {
    this.request = true;
  }
}

function updateLeaderboard(props: props): void {
  for (let i = 0; i < 5; i++) {
    const initials_node = gui.get_node(`name-${i+1}`);
    const score_node = gui.get_node(`score-${i+1}`);
    gui.set_text(initials_node, i < props.scores.length ? props.scores[i].initials : "AAA");
    gui.set_text(score_node, i < props.scores.length ? props.scores[i].score.toString() : ((i+1)*100).toString());
  }
}
