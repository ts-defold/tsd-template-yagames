import * as yagames from "yagames.yagames";
import * as fx from "../modules/fx";
import offlineScores from "../modules/offline-highscores";

type Action = {
  pressed: boolean;
  released: boolean;
};

interface props {
  score: number;
  initials: string[];
  letters: string[];
  initials_index: number;
  letters_index: number;
  submit: "no" | "yes" | "submitting";
  nodes: {
    score: node; 
    "letter-1": node;
    "letter-2": node;
    "letter-3": node;
    "cursor-1": { "up-1": node; "down-1": node; [key: string]: node };
    "cursor-2": { "up-2": node; "down-2": node; [key: string]: node };
    "cursor-3": { "up-3": node; "down-3": node; [key: string]: node };
    [key: string]: node;
  }
}

export function init(this: props): void {
  msg.post(".", "acquire_input_focus");
  
  this.score = 0;
  this.submit = "no";

  this.initials = ["A", "A", "A"];
  this.initials_index = 0;

  this.letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.,:!?".split("");
  this.letters_index = 0;

  // Cache nodes
  this.nodes = {
    score: gui.get_node("score"),
    "letter-1": gui.get_node("letter-1"),
    "letter-2": gui.get_node("letter-2"),
    "letter-3": gui.get_node("letter-3"),
    "cursor-1": { "up-1": gui.get_node("up-1"), "down-1": gui.get_node("down-1") },
    "cursor-2": { "up-2": gui.get_node("up-2"), "down-2": gui.get_node("down-2") },
    "cursor-3": { "up-3": gui.get_node("up-3"), "down-3": gui.get_node("down-3") },
  };

  // Set initial state
  gui.set_text(this.nodes.score, "");
  Object.keys(this.nodes["cursor-1"]).forEach(k => gui.set_enabled(this.nodes["cursor-1"][k], true));
  Object.keys(this.nodes["cursor-2"]).forEach(k => gui.set_enabled(this.nodes["cursor-2"][k], false));
  Object.keys(this.nodes["cursor-3"]).forEach(k => gui.set_enabled(this.nodes["cursor-3"][k], false));
}

export function update(this: props): void {
  if (this.submit === "yes") {
    this.submit = "submitting";
    
    //! HTML5 Only
    const info = sys.get_sys_info() as { system_name: string };
    if (info.system_name !== "HTML5") {
      offlineScores.set_score(this.score, this.initials.join(""));
      msg.post("main:/main#script", "show_fullscreen_adv", { then: "show_highscores" });
      return;
    }

    //* YaGames Leaderboards SetScore
    yagames.leaderboards_set_score("highscore", this.score, this.initials.join(""), (_ctx, err) => {
      if (err !== undefined) offlineScores.set_score(this.score, this.initials.join(""));
      msg.post("main:/main#script", "show_fullscreen_adv", { then: "show_highscores" });
    });
  }
}

export function on_input(this: props, action_id: hash, action: Action): void {
  if (action_id == hash("up") && action.pressed) {
    this.letters_index = (this.letters_index + 1) % this.letters.length;
    fx.menu_item();
  }
  else if (action_id == hash("down") && action.pressed) {
    this.letters_index = (this.letters_index - 1 + this.letters.length) % this.letters.length;
    fx.menu_item();
  }
  else if (action_id == hash("left") && action.pressed) {
    this.initials_index = (this.initials_index - 1 + this.initials.length) % this.initials.length;
    this.letters_index = this.letters.indexOf(this.initials[this.initials_index]);
    fx.press();
  }
  else if (action_id == hash("right") && action.pressed) {
    this.initials_index = (this.initials_index + 1) % this.initials.length;
    this.letters_index = this.letters.indexOf(this.initials[this.initials_index]);
    fx.press();
  }
  else if (action_id == hash ("back") && action.pressed) {
    if (this.initials_index > 0) {
      this.initials_index--;
      this.letters_index = this.letters.indexOf(this.initials[this.initials_index]);
    }
  }
  else if (action_id == hash("accept") || action_id == hash("start") && action.pressed) {
    if (this.initials_index < 2) {
      this.initials[this.initials_index] = this.letters[this.letters_index];
      this.initials_index++;
      this.letters_index = this.letters.indexOf(this.initials[this.initials_index]);
    }
    else if (this.initials_index === 2) {
      if (this.submit === "no") this.submit = "yes";
    }
    fx.press();
  }

  // Update current letter
  gui.set_text(this.nodes[`letter-${this.initials_index + 1}`], this.letters[this.letters_index]);

  // Update the initials string
  this.initials[this.initials_index] =  this.letters[this.letters_index];

  // Update cursor visibility
  Object.keys(this.nodes["cursor-1"]).forEach(k => gui.set_enabled(this.nodes["cursor-1"][k], this.initials_index == 0 ? true : false));
  Object.keys(this.nodes["cursor-2"]).forEach(k => gui.set_enabled(this.nodes["cursor-2"][k], this.initials_index == 1 ? true : false));
  Object.keys(this.nodes["cursor-3"]).forEach(k => gui.set_enabled(this.nodes["cursor-3"][k], this.initials_index == 2 ? true : false));
}

export function on_message(this: props, message_id: hash, message: unknown): void {
  if (message_id == hash("score")) {
    const { score } = message as { score: number };
    this.score = score;

    gui.set_text(this.nodes.score, this.score.toString());
  }
  
  // Virtual Input
  if (message_id == hash("on_virtual_input")) {
    const { action_id, action } = message as { action_id: hash; action: Action };
    on_input.call(this, action_id, action);
  }
}
