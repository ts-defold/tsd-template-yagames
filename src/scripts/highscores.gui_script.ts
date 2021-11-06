type Action = {
  pressed: boolean;
  released: boolean;
};

interface props {
  scores: number[];
}

export function init(this: props): void {
  msg.post(".", "acquire_input_focus");
}

export function on_input(this: props, action_id: hash, action: Action): void {
  if (action_id == hash("start") && action.pressed) {
    msg.post("main:/main#script", "show_title");
  }
}
