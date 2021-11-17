type Message = {
  score: number;
  lives: number;
};

interface props {
  score: number;
  highscore?: number;
  score_node: node;
  life_nodes: node[];
  gameover: boolean;
}

export function init(this: props): void {
  this.score = 0;
  this.score_node = gui.get_node("score");
  this.life_nodes = [gui.get_node("life-1"),gui.get_node("life-2"), gui.get_node("life-3")];
  this.gameover = false;
}

export function update(this: props): void {
  if (this.gameover) {
    this.gameover = false;
    msg.post("main:/main#script", "show_score", { target: "score:/scores#score", id: "score", params: { score: this.score } });
  }
}

export function on_message(this: props, message_id: hash, message: Message): void {
  if (message_id === hash("score")) {
    this.score += message.score;
    gui.set_text(this.score_node, string.format("%03d", this.score));
  }
  else if (message_id === hash("lives")) {
    if (message.lives >= 3) {
      gui.set_enabled(this.life_nodes[0], true);
      gui.set_enabled(this.life_nodes[1], true);
      gui.set_enabled(this.life_nodes[2], true);
    } else if (message.lives >= 2) {
      gui.set_enabled(this.life_nodes[0], true);
      gui.set_enabled(this.life_nodes[1], true);
      gui.set_enabled(this.life_nodes[2], false);
    } else if (message.lives >= 1) {
      gui.set_enabled(this.life_nodes[0], true);
      gui.set_enabled(this.life_nodes[1], false);
      gui.set_enabled(this.life_nodes[2], false);
    } else {
      gui.set_enabled(this.life_nodes[0], false);
      gui.set_enabled(this.life_nodes[1], false);
      gui.set_enabled(this.life_nodes[2], false);
      this.gameover = true;
    }
  }
}
