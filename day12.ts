const exampleInput = await Deno.readTextFile('examples/day12.txt');
// const input = await Deno.readTextFile('inputs/day12.txt');

type Tile = '#' | '.';

type Shape = Tile[][];

type PareInputResult = {
    shapes: Shape[];
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

    return {
        shapes
    };
}

const run = (input: string) => {
    const {
        shapes
    } = parseInput(input);

    return { shapes };
}

console.log('Example', run(exampleInput));
// console.log('Result', run(input));