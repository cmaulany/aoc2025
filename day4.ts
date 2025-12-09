const exampleInput = await Deno.readTextFile('examples/day4.txt');
const input = await Deno.readTextFile('inputs/day4.txt');

type PaperRoll = '@';
type Empty = '.';

type Tile = PaperRoll | Empty;
type Grid = Tile[][];
type Position = { x: number; y: number };

const parseInput = (input: string): Grid =>
    input
        .split('\n')
        .map((line) => line.split('') as Tile[]);

const NEIGHBOR_DELTAS = [
    { x: -1, y: -1 },
    { x: 0, y: -1 },
    { x: 1, y: -1 },
    { x: -1, y: 0 },
    { x: 1, y: 0 },
    { x: -1, y: 1 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
];

const getNeighbors = (grid: Grid, position: Position) => {
    const width = grid[0].length;
    const height = grid.length;
    const { x, y } = position;

    return NEIGHBOR_DELTAS
        .map((delta) => ({
            x: x + delta.x,
            y: y + delta.y,
        }))
        .filter(({ x, y }) => (
            x >= 0
            && y >= 0
            && x < width
            && y < height
        ));
};

const countPaperRolls = (grid: Grid) => grid.flat().filter((tile) => tile === '@').length;

const removeAccessibleRolls = (grid: Grid) =>
    grid.map((line, y) => line.map((tile, x) => {
        if (tile === '.') {
            return tile;
        }
        const paperRollNeighbors = getNeighbors(grid, { x, y })
            .filter(({ x, y }) => grid[y][x] === '@');
        if (paperRollNeighbors.length < 4) {
            return '.';
        }
        return tile;
    }));

const removeAllAccessibleRolls = (grid: Grid) => {
    let previousCount = Infinity;
    let currentGrid = grid;
    let currentCount = countPaperRolls(grid);
    while (currentCount < previousCount) {
        previousCount = currentCount;
        currentGrid = removeAccessibleRolls(currentGrid);
        currentCount = countPaperRolls(currentGrid);
    }
    return currentGrid;
};

const run = (input: string) => {
    const grid = parseInput(input);
    const initialCount = countPaperRolls(grid);
    const part1 = initialCount - countPaperRolls(removeAccessibleRolls(grid));
    const part2 = initialCount - countPaperRolls(removeAllAccessibleRolls(grid));
    return { part1, part2 };
};

console.log('Example', run(exampleInput));
console.log('Result', run(input));