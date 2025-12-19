// Heuristic is enough for regular input but does not work on example.
const input = await Deno.readTextFile('inputs/day12.txt');

type Tile = '#' | '.';

type Shape = Tile[][];

type Region = {
    width: number;
    height: number;
    shapeCounts: number[];
};

type PareInputResult = {
    shapes: Shape[];
    regions: Region[];
};

const parseInput = (input: string): PareInputResult => {
    const parts = input.split('\n\n');
    const shapes = parts
        .slice(0, -1)
        .map((part) => part
            .split('\n')
            .slice(1)
            .map((line) => line.split('') as Tile[])
        );

    const regions = parts.at(-1)!.split('\n').map((line) => {
        const parts = line.split(' ');
        const [width, height] = parts[0].slice(0, -1).split('x').map(Number);
        const shapeCounts = parts.slice(1).map(Number);
        return { width, height, shapeCounts };
    });

    return {
        shapes,
        regions,
    };
};

const countTileInShape = (shape: Shape, tile: Tile): number => shape.flat().filter((t) => t === tile).length;

const fitsShapes = (width: number, height: number, shapes: Shape[], shapeCounts: number[]): boolean => {
    const availableCount = width * height;
    const requiredCount = shapeCounts.map((n, i) => n * countTileInShape(shapes[i], '#')).reduce((a, b) => a + b);
    const totalShapeCount = shapeCounts.reduce((a, b) => a + b);
    if (requiredCount > availableCount) {
        return false;
    }
    if (totalShapeCount * 9 <= availableCount) {
        return true;
    }
    throw new Error('Cannot determine if this will fit.');
};

const run = (input: string) => {
    const {
        shapes,
        regions,
    } = parseInput(input);

    const validRegions = regions.map((region) =>
        fitsShapes(region.width, region.height, shapes, region.shapeCounts)
    );

    const part1 = validRegions.filter((result) => result).length;
    return { part1 };
}

console.log('Result', run(input));