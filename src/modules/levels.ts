export type Levels = Array<{
  seed: number;
  speed_up: number,
  walls: Array<{
    type: "index" | "range",
    id?: number,
    range?: [number, number],
  }>;
}>;

const levels: Levels = [
  {
    seed: 4277009102,
    speed_up: 0,
    walls: [
      { id:  1, type: "index"},
      { id:  2, type: "index"},
      { id:  3, type: "index"},
      { id:  4, type: "index"},
      { id:  5, type: "index"},
      { id:  1, type: "index"},
      { id:  2, type: "index"},
      { id:  3, type: "index"},
      { id:  4, type: "index"},
      { id: 10, type: "index"},
    ],
  },
  {
    seed: 233435253,
    speed_up: 0,
    walls: [
      { range: [1, 5], type: "range"},
      { range: [1, 5], type: "range"},
      { range: [1, 5], type: "range"},
      { range: [1, 5], type: "range"},
      { range: [1, 5], type: "range"},
      { range: [1, 5], type: "range"},
      { range: [1, 5], type: "range"},
      { range: [1, 5], type: "range"},
      { range: [1, 5], type: "range"},
      { range: [1, 5], type: "range"},
    ]
  },
  {
    seed: 39848929823543,
    speed_up: 5,
    walls: [
      { range: [1,  5], type: "range"},
      { range: [6, 10], type: "range"},
      { range: [1,  5], type: "range"},
      { range: [6, 10], type: "range"},
      { range: [1,  5], type: "range"},
      { range: [6, 10], type: "range"},
      { range: [1,  5], type: "range"},
      { range: [6, 10], type: "range"},
      { range: [1,  5], type: "range"},
      { range: [6, 10], type: "range"},
    ]
  },
  {
    seed: 23342,
    speed_up: 10,
    walls: [
      { range: [6, 10], type: "range"},
      { range: [6, 10], type: "range"},
      { range: [6, 10], type: "range"},
      { range: [6, 10], type: "range"},
      { range: [6, 10], type: "range"},
      { range: [6, 10], type: "range"},
      { range: [6, 10], type: "range"},
      { range: [6, 10], type: "range"},
      { range: [6, 10], type: "range"},
      { range: [6, 10], type: "range"},
    ]
  },
];
export default levels;