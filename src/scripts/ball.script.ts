type Action = {
  pressed: boolean;
  released: boolean;
};

type Message = {
  normal: vmath.vector3;
  distance: number;
  group: hash;
  other_group: hash;
  other_id: hash;
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
  is_HTML5: boolean;
  use_input_debugger: boolean;
}

go.property("speed", 60);
go.property("lives", 3);

export function init(this: props): void {
  msg.post(".", "acquire_input_focus");

  this.use_input_debugger = false; //! Input debugger

  const info = sys.get_sys_info() as { system_name: string };
  this.is_HTML5 = info.system_name !== "HTML5";
  const engine = sys.get_engine_info() as { is_debug: boolean };
  if (!engine.is_debug) this.use_input_debugger = false;

  this.button_state = [false, false, false, false];
  this.dir = vmath.vector3(0, 0, 0);
  this.correction = vmath.vector3(0, 0, 0);
  this.respawn_timer = 0;

  this.bounds = vmath.vector3(
    tonumber(sys.get_config("display.width")) ?? 0,
    tonumber(sys.get_config("display.height")) ?? 0,
    0
  );

  //! Input debugger
  msg.post("/gui#debug", this.use_input_debugger ? "enable" : "disable");
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
    dead.call(this);
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
    if (action.released) this.button_state[Buttons.left] = false;
  }
  if (action_id == hash("right")) {
    if (action.pressed) this.button_state[Buttons.right] = true;
    if (action.released) this.button_state[Buttons.right] = false;
  }
  if (action_id == hash("down")) {
    if (action.pressed) this.button_state[Buttons.down] = true;
    if (action.released) this.button_state[Buttons.down] = false;
  }
  if (action_id == hash("up")) {
    if (action.pressed) this.button_state[Buttons.up] = true;
    if (action.released) this.button_state[Buttons.up] = false;
  }

  if (this.use_input_debugger) msg.post("/gui#debug", action_id, action); //! Input debugger
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
  } else if (message_id === hash("trigger_response") && this.respawn_timer <= 0) {
    if (message.other_group == hash("spike")) {
      dead.call(this);
    }
    else {
      msg.post("/walls#script", "trigger_response", message);
    }
  }

  // Virtual Input
  if (message_id === hash("on_virtual_input")) {
    const { action_id, action } = message as unknown as { action_id: hash; action: Action };
    on_input.call(this, action_id, action);
  }
}

function dead(this: props) {
  this.lives -= 1;
  msg.post("/gui#hud", "lives", { lives: this.lives });
  
  if (this.lives > 0) {
    this.respawn_timer = RESPAWN_TIME;
    go.set_position(vmath.vector3(160, 24, 0));
  } else {
    this.respawn_timer = math.huge;
  }
}