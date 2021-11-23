import levels from "../modules/levels";

type Message = {
  other_id: hash;
  other_group: hash;
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
  level: number;
  level_index: number;
  speed: number;
  walls: hash[];
  active_walls: hash[];
  dead_walls: hash[];
  triggered_walls: Set<url>;
  wall_delay: number;
  walls_spawned: number;
  delay: number;
  distance: number;
  epoch: number;
}

go.property("wall_count", 0);
go.property("starting_speed", 60);
go.property("starting_delay", 5);
go.property("minimum_delay", 1.5);
go.property("delay_rate", 0.05);
go.property("difficulty", 5);
go.property("seed", 4277009102);

const DISTANCE = 0 + 8;
const START = vmath.vector3(0, 320 - 8, 0);

export function init(this: props): void {
  this.active_walls = [];
  this.dead_walls = [];
  this.triggered_walls = new Set();
  this.wall_delay = 0;
  this.walls_spawned = 1;

  this.level = 0;
  this.level_index = 0;
  this.speed = this.starting_speed;
  this.delay = this.starting_delay;
  this.distance = DISTANCE;
  this.epoch = socket.gettime();

  math.randomseed(levels[this.level].seed);
}

export function update(this: props, dt: number): void {
  // Update progression
  update_progression.call(this, socket.gettime() - this.epoch);
  if (this.wall_delay >= 0) this.wall_delay -= dt;
  
  // Clear state of dead walls
  for (const wall of this.dead_walls.splice(0, this.dead_walls.length)) {
    this.triggered_walls.delete(wall);
  }

  // Spawn walls
  if (this.wall_delay <= 0) {
    const level = levels[this.level];
    const def = level.walls[this.level_index];
    
    let id = 0;
    if (def.type === "range") {
      const start = def.range?.[0] ?? 1;
      const end = def.range?.[1] ?? this.wall_count;
      id = math.random(start, end);
    }
    if (def.type === "index") {
      id = def?.id ?? 0;
    }

    const wall = spawn(id);
    print("spawn", this.level, this.level_index, id, wall);

    this.active_walls.push(wall);
    this.wall_delay = this.delay;
    
    next.call(this);
  }

  // Update walls
  for (let i = 0; i < this.active_walls.length; i++) {
    const wall = this.active_walls[i];
    const pos = go.get_position(wall);
    pos.y -= this.speed * dt;
    if (pos.y < -640 - 16) {
      destroy.call(this, wall, i);
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
    if (message.other_group == hash("pass") && !message.enter && !this.triggered_walls.has(message.other_id)) {
      this.triggered_walls.add(message.other_id);
      msg.post("/gui#hud", "score", { score: 1 });
    }
  }
}

function update_progression(this: props, _elapsed: number): void {
  if (this.walls_spawned > 0 && this.walls_spawned % this.difficulty === 0) {
    this.delay = math.max(this.minimum_delay, this.starting_delay - this.walls_spawned * this.delay_rate);
    //this.difficulty = math.floor(this.difficulty / 2);
    //if (this.difficulty == 0) this.difficulty = 1;
  }
  //this.speed = this.starting_speed + elapsed * 0.1;
}

function spawn(i: number): hash {
  const wall = factory.create(`/walls#wall-${i}`);
  go.set_position(START, wall);
  return wall;
}

function destroy(this: props, wall: hash, index: number): void {
  this.active_walls.splice(index, 1);
  this.dead_walls.push(wall);
  go.delete(wall);
}

function next(this: props): void {
  this.walls_spawned++;
  this.level_index++;
  if (this.level_index >= levels[this.level].walls.length) {
    this.level++;
    this.level_index = 0;
    if (this.level >= levels.length) this.level = levels.length - 1;

    this.speed += levels[this.level].speed_up;
    math.randomseed(levels[this.level].seed);
    
    print("level", this.level, this.level_index, levels[this.level].seed);
  }
}