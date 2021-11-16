type Action = {
  pressed: boolean;
  released: boolean;
};

type Message = {
  normal: vmath.vector3;
  distance: number;
  group: hash;
};

enum Buttons {
  left = 0,
  right = 1,
  up = 2,
  down = 3,
}

const RESPAWN_TIME = 3;

interface props {
  speed: number;
  lives: number;
  button_state: boolean[];
  dir: vmath.vector3;
  correction: vmath.vector3;
  bounds: vmath.vector3;
  respawn_timer: number;
}

go.property("speed", 60);
go.property("lives", 3);

export function init(this: props): void {
  msg.post(".", "acquire_input_focus");

  this.button_state = [false, false, false, false];
  this.dir = vmath.vector3(0, 0, 0);
  this.correction = vmath.vector3(0, 0, 0);
  this.respawn_timer = 0;

  this.bounds = vmath.vector3(
    tonumber(sys.get_config("display.width")) ?? 0,
    tonumber(sys.get_config("display.height")) ?? 0,
    0
  );
}

export function update(this: props, dt: number): void {
  this.correction = vmath.vector3(0, 0, 0);
  let pos = go.get_position();

  const [left, right, up, down] = this.button_state;
  this.dir.x = left ? -1 : right ? 1 : 0;
  this.dir.y = down ? -1 : up ? 1 : 0;

  pos = (pos + this.dir * this.speed * dt) as vmath.vector3;
  if (pos.x < 12) pos.x = 12;
  if (pos.x > this.bounds.x - 12) pos.x = this.bounds.x - 12;
  if (pos.y > this.bounds.y - 12) pos.y = this.bounds.y - 12;
  if (this.lives > 0) go.set_position(pos);

  if (pos.y < -18 && this.respawn_timer == 0) {
    this.lives -= 1;
    msg.post("/gui#hud", "lives", { lives: this.lives });

    if (this.lives > 0) {
      this.respawn_timer = RESPAWN_TIME;
      go.set_position(vmath.vector3(160, 24, 0));
    } else {
      this.respawn_timer = math.huge;
      msg.post("main:/main#script", "show_fullscreen_adv", { then: "show_scores" });
    }
  }

  if (this.respawn_timer > 0) {
    this.respawn_timer -= dt;
    const alpha = go.get("/ball#sprite", "tint.w") as number;
    go.set("/ball#sprite", "tint.w", alpha === 0 ? 1 : 0);
  } else if (this.respawn_timer < 0) {
    go.set("/ball#sprite", "tint.w", 1);
    this.respawn_timer = 0;
  }
}

export function on_input(this: props, action_id: hash, action: Action): void {
  if (action_id == hash("left")) {
    if (action.pressed) this.button_state[Buttons.left] = true;
    else if (action.released) this.button_state[Buttons.left] = false;
  } else if (action_id == hash("right")) {
    if (action.pressed) this.button_state[Buttons.right] = true;
    else if (action.released) this.button_state[Buttons.right] = false;
  } else if (action_id == hash("down")) {
    if (action.pressed) this.button_state[Buttons.down] = true;
    else if (action.released) this.button_state[Buttons.down] = false;
  } else if (action_id == hash("up")) {
    if (action.pressed) this.button_state[Buttons.up] = true;
    else if (action.released) this.button_state[Buttons.up] = false;
  }
}

export function on_message(
  this: props,
  message_id: hash,
  message: Message
): void {
  if (
    message_id === hash("contact_point_response") &&
    message.group == hash("wall") &&
    this.respawn_timer <= 0
  ) {
    if (message.distance > 0) {
      const proj = vmath.project(
        this.correction,
        (message.normal * message.distance) as vmath.vector3
      );
      if (proj < 1) {
        const comp = ((message.distance - message.distance * proj) *
          message.normal) as vmath.vector3;
        go.set_position((go.get_position() + comp) as vmath.vector3);
        this.correction = (this.correction + comp) as vmath.vector3;
      }
    }
  } else if (
    message_id === hash("trigger_response") &&
    this.respawn_timer <= 0
  ) {
    msg.post("/walls#script", "trigger_response", message);
  }
}
