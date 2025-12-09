const exampleInput = await Deno.readTextFile('examples/day7.txt');
const input = await Deno.readTextFile('inputs/day7.txt');

type Tile = '.' | '^' | 'S' | '|';
type Grid = Tile[][];
type Position = [x: number, y: number];
type State = {
    grid: Grid;
    beams: Position[];
    splitCount: 0;
}

const parseInput = (input: string): Grid => input.split('\n').map((line) => line.split('') as Tile[]);

const getStart = (grid: Grid): Position => [
    grid[0].findIndex((tile) => tile === 'S'),
    1,
];

const moveBeams = (state: State): State => {
    const nextGrid = state.grid.map((row) => row.slice());
    const nextBeams: Position[] = [];
    let nextSplitCount = state.splitCount
    state.beams.forEach(([x, y]) => {
        const tile = nextGrid[y][x];
        if (tile === '^') {
            nextBeams.push([x - 1, y]);
            nextBeams.push([x + 1, y]);
            nextSplitCount++;
        } else if (tile === '.' && y < nextGrid.length - 1) {
            nextGrid[y][x] = '|';
            nextBeams.push([x, y + 1]);
        }
    });

    return {
        grid: nextGrid,
        beams: nextBeams,
        splitCount: nextSplitCount,
    };
};

const simulateBeams = (state: State): State => {
    let currentState = state;
    while (currentState.beams.length > 0) {
        currentState = moveBeams(currentState);
    }
    return currentState;
};

type Key = `${number},${number}`;
const cache: { [key: Key]: number } = {};

const countSplit = (grid: Grid, beam: Position): number => {
    const [x, y] = beam;
    const key = `${x},${y}` as Key;
    if (key in cache) {
        return cache[key];
    }
    const height = grid.length;
    const beams = [[x - 1, y], [x + 1, y]];
    const castBeams = beams.map((beam) => {
        let [x, y] = beam;
        while (y < height) {
            if (grid[y][x] === '^') {
                return countSplit(grid, [x, y]);
            }
            y++;
        }
        return 1;
    });
    const result = castBeams.reduce((a, b) => a + b);
    cache[key] = result;
    return result;
};

const run = (input: string) => {
    const grid = parseInput(input);
    const start = getStart(grid);
    const part1 = simulateBeams({
        beams: [start],
        grid,
        splitCount: 0,
    }).splitCount;
    const part2 = countSplit(grid, start);
    return { part1, part2 };
};

console.log('Example', run(exampleInput));
console.log('Result', run(input));