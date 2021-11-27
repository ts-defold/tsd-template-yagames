export type Levels = Array<{
  seed: number;
  speed_up: number,
  walls: Array<{
    type: "index" | "range",
    id?: number,
    range?: [number, number], // [start, end]
    coins?: number[],
    coins_range?: [number, number, number], // [start, end, count]
  }>;
}>;

const levels: Levels = [
  {
    seed: 4277009102,
    speed_up: 0,
    walls: [
      { id:  1, type: "index", coins: [1,2,3,4]},
      { id:  3, type: "index", coins: [1,2,3,4]},
      { id:  5, type: "index", coins: [1,2,3,4]},
      { id: 10, type: "index", coins: [1,2,3,4]},
    ],
  },
  {
    seed: 233435253,
    speed_up: 0,
    walls: [
      { range: [1, 5], type: "range", coins: [1], coins_range: [2, 12, 5]},
      { range: [1, 5], type: "range", coins: [1], coins_range: [2, 12, 5]},
      { range: [1, 5], type: "range", coins: [1], coins_range: [2, 12, 5]},
      { range: [1, 5], type: "range", coins: [1], coins_range: [2, 12, 5]},
    ]
  },
  {
    seed: 39848929823543,
    speed_up: 5,
    walls: [
      { range: [1,  5], type: "range", coins_range: [5, 12, 4]},
      { range: [6, 10], type: "range", coins_range: [5, 12, 4]},
      { range: [1,  5], type: "range", coins_range: [5, 12, 4]},
      { range: [6, 10], type: "range", coins_range: [5, 12, 4]},
    ]
  },
  {
    seed: 489623892346,
    speed_up: 10,
    walls: [
      { range: [6, 10], type: "range", coins_range: [5, 12, 3]},
      { range: [6, 10], type: "range", coins_range: [5, 12, 3]},
      { range: [6, 10], type: "range", coins_range: [5, 12, 3]},
      { range: [6, 10], type: "range", coins_range: [5, 12, 3]},
    ]
  },
];
export default levels;