const exampleInput = await Deno.readTextFile("examples/day6.txt");
const input = await Deno.readTextFile("inputs/day6.txt");

type Operation = '*' | '+';

type Problem = {
    numbers: number[];
    operation: Operation;
}

const parseInput = (input: string): Problem[] => {
    const lines = input.split('\n');
    const numberLines = lines.slice(0, -1);
    const operationLine = lines.at(-1);

    const numberGrid = numberLines.map((line) => line.trim().split(/ +/).map(Number));
    const operations = operationLine?.trim().split(/ +/) as Operation[];

    const problems = operations.map<Problem>((operation, i) => {
        const numbers = numberGrid.map((row) => row[i]);
        return { numbers, operation };
    })
    return problems;
};

const flip = (lines: string[]): string[] =>
    lines[0]
        .split('')
        .map((_, x) => lines
            .map((_, y) => lines[y][x])
            .join('')
        );

const parseInputCephalopod = (input: string): Problem[] => {
    const lines = input.split('\n');
    const numberLines = lines.slice(0, -1);
    const operationLine = lines.at(-1);

    const numberGrid: number[][] =
        flip(numberLines)
            .map((line) => line.trim())
            .join('\n')
            .split('\n\n')
            .map((part) => part.split('\n').map(Number));
    const operations = operationLine?.trim().split(/ +/) as Operation[];

    const problems = operations.map<Problem>((operation, i) => {
        const numbers = numberGrid[i];
        return { numbers, operation };
    })
    return problems;
};

const SOLVERS = {
    '*': (a: number, b: number) => a * b,
    '+': (a: number, b: number) => a + b,
};

const solveProblem = (problem: Problem) => {
    const solver = SOLVERS[problem.operation];
    return problem.numbers.reduce(solver);
};

const run = (input: string) => {
    const part1 = parseInput(input)
        .map(solveProblem)
        .reduce((a, b) => a + b);
    const part2 = parseInputCephalopod(input)
        .map(solveProblem)
        .reduce((a, b) => a + b);
    return { part1, part2 };
};

console.log('Example', run(exampleInput));
console.log('Result', run(input));