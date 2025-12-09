const exampleInput = await Deno.readTextFile('examples/day2.txt');
const input = await Deno.readTextFile('inputs/day2.txt');

type Range = [number, number];

const parseInput = (input: string): Range[] =>
    input.split(',')
        .map((str) => str.split('-').map(Number) as [number, number]);

const expandRange = ([start, end]: [number, number]) =>
    Array.from({ length: end - start }, (_, i) => Number(start) + i);

const isRepeatingOnce = (id: number) => {
    const idString = id.toString();
    const middle = Math.floor(idString.length / 2);
    const lhs = idString.slice(0, middle);
    const rhs = idString.slice(middle);
    return lhs === rhs;
};

const isRepeating = (id: number) => {
    const idString = id.toString();
    for (let i = 1; i < idString.length; i++) {
        const seq = idString.slice(0, i);
        const isInvalid = idString.split(seq).join('').length === 0;
        if (isInvalid) {
            return true;
        }
    }
    return false;
};

const sum = (ns: number[]) => ns.reduce((a, b) => a + b);

const run = (input: string) => {
    const ranges = parseInput(input);
    const part1 = sum(ranges.flatMap(expandRange).filter(isRepeatingOnce));
    const part2 = sum(ranges.flatMap(expandRange).filter(isRepeating));
    return { part1, part2 };
};

console.log('Example', run(exampleInput));
console.log('Result', run(input));