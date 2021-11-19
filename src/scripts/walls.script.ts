type Message = {
  other_id: hash;
  enter: boolean;
};

interface props {
  // tunable properties
  wall_count: number;
  starting_speed: number;
  starting_delay: number;
  minimum_delay: number;
  delay_rate: number;
  difficulty: number;
  seed: number;
  // member props
  speed: number;
  walls: hash[];
  active_walls: hash[];
  dead_walls: hash[];
  triggered_walls: Set<url>;
  wall_delay: number;
  walls_spawned: number;
  max: number;
  delay: number;
  distance: number;
  epoch: number;
}

go.property("wall_count", 0);
go.property("starting_speed", 90);
go.property("starting_delay", 6);
go.property("minimum_delay", 1.5);
go.property("delay_rate", 0.05);
go.property("difficulty", 10);
go.property("seed", 4277009102);

const DISTANCE = 640 + 16;

export function init(this: props): void {
  this.walls = [];
  this.active_walls = [];
  this.dead_walls = [];
  this.triggered_walls = new Set();
  this.wall_delay = 0;
  this.walls_spawned = 1;

  this.max = 1;
  this.speed = this.starting_speed;
  this.delay = this.starting_delay;
  this.distance = DISTANCE;
  this.epoch = socket.gettime();
  math.randomseed(this.seed);

  for (let i = 0; i < this.wall_count; i++) {
    const wall_id = `/${i + 1}`;
    const h = hash(wall_id);
    this.walls.push(h);
  }
}

export function update(this: props, dt: number): void {
  // Update progression
  update_progression(this, socket.gettime() - this.epoch);
  if (this.wall_delay >= 0) this.wall_delay -= dt;
  
  // Add dead walls back to the pool
  for (const wall of this.dead_walls.splice(0, this.dead_walls.length)) {
    this.triggered_walls.delete(wall);
    this.walls.push(wall);
  }

  // Spawn walls
  if (this.wall_delay <= 0 && this.walls.length > 0) {
    const wall = this.walls.splice(math.random(0, this.walls.length - 1), 1)[0];
    print(wall, this.wall_delay, this.speed);
    go.set_position(vmath.vector3(0, 0, 0), wall);
    this.active_walls.push(wall);
    this.wall_delay = this.delay;
  }

  // Update walls
  for (let i = 0; i < this.active_walls.length; i++) {
    const wall = this.active_walls[i];
    const pos = go.get_position(wall);
    pos.y -= this.speed * dt;
    if (pos.y < -640 - 16) {
      this.active_walls.splice(i, 1);
      this.dead_walls.push(wall);
      go.set_position(vmath.vector3(0, 0, 0), wall);
      this.walls_spawned++;
    } else {
      go.set_position(pos, wall);
    }
  }
}

export function on_message(
  this: props,
  message_id: hash,
  message: Message
): void {
  if (message_id == hash("trigger_response")) {
    if (!message.enter && !this.triggered_walls.has(message.other_id)) {
      this.triggered_walls.add(message.other_id);
      msg.post("/gui#hud", "score", { score: 1 });
    }
  }
}

function update_progression(props: props, elapsed: number): void {
  if (props.walls_spawned % props.difficulty === 0) {
    props.delay = math.max(props.minimum_delay, props.starting_delay - props.walls_spawned * props.delay_rate);
  }
  if (props.walls_spawned > 0 && props.difficulty === 0) {
    props.difficulty = math.floor(props.difficulty / 2);
  }
  props.speed = props.starting_speed + elapsed * 0.1;
}