const exampleInput = await Deno.readTextFile('examples/day3.txt');
const input = await Deno.readTextFile('inputs/day3.txt');

type Bank = number[];

const parseInput = (input: string): Bank[] => input.split('\n').map((line) => line.split('').map(Number));

const findMaxIndex = (bank: Bank) => {
    let index = 0;
    for (let i = 1; i < bank.length; i++) {
        if (bank[i] > bank[index]) {
            index = i;
        }
    }
    return index;
};

const findTwoMaxJolts = (bank: Bank): number => {
    const leftIndex = findMaxIndex(bank.slice(0, -1));
    const rightIndex = findMaxIndex(bank.slice(leftIndex + 1)) + leftIndex + 1;
    return Number(bank[leftIndex].toString() + bank[rightIndex].toString());
};

const findMaxJolts = (bank: Bank, count: number): number => {
    let index = 0;
    const indexes = [];
    for (let i = 0; i < count; i++) {
        const slice = bank.slice(index, bank.length - count + i + 1);
        index += findMaxIndex(slice);
        indexes.push(index);
        index++;
    }
    return Number(indexes.map((n) => bank[n]).join(''));
};

const sum = (ns: number[]) => ns.reduce((a, b) => a + b);

const run = (input: string) => {
    const banks = parseInput(input);
    const part1 = sum(banks.map((el) => findTwoMaxJolts(el)));
    const part2 = sum(banks.map((el) => findMaxJolts(el, 12)));
    return { part1, part2 };
};

console.log('Example', run(exampleInput));
console.log('Result', run(input));