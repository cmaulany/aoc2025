const exampleInput = await Deno.readTextFile("examples/day3.txt");
const input = await Deno.readTextFile("inputs/day3.txt");

const parseInput = (input: string) => input.split('\n').map((line) => line.split('').map(Number));

const findMaxIndex = (bank: number[]) => {
    let index = 0;
    for (let i = 1; i < bank.length; i++) {
        if (bank[i] > bank[index]) {
            index = i;
        }
    }
    return index;
}

const findTwoMaxJolts = (bank: number[]): number => {
    const leftIndex = findMaxIndex(bank.slice(0, -1));
    const rightIndex = findMaxIndex(bank.slice(leftIndex + 1)) + leftIndex + 1;
    return Number(bank[leftIndex].toString() + bank[rightIndex].toString());
}


const findMaxJolts = (bank: number[], count: number): number => {
    let index = 0;
    const ns = [];
    for (let i = 0; i < count; i++) {
        index = findMaxIndex(bank.slice(index, bank.length - count + i + 1)) + index;
        ns.push(index);
        index++;
    }
    return Number(ns.map((n) => bank[n]).join(''));
}

const sum = (ns: number[]) => ns.reduce((a, b) => a + b);

const run = (input: string) => {
    const ranges = parseInput(input);
    const part1 = sum(ranges.map((el) => findTwoMaxJolts(el)));
    const part2 = sum(ranges.map((el) => findMaxJolts(el, 12)));
    return { part1, part2 };
}

console.log('Example', run(exampleInput));
console.log('Result', run(input));