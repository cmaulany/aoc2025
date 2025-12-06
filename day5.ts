const exampleInput = await Deno.readTextFile("examples/day5.txt");
const input = await Deno.readTextFile("inputs/day5.txt");

type Range = [start: number, end: number];

type ParseInputResult = {
    ranges: Range[];
    ids: number[];
}

const parseInput = (input: string): ParseInputResult => {
    const [inputRanges, inputIds] = input.split('\n\n');
    const ranges: Range[] = inputRanges
        .split('\n')
        .map((line) => line.split('-').map(Number) as Range);

    const ids = inputIds.split('\n').map(Number);

    return { ranges, ids };
};

const contains = (range: Range, id: number) => id >= range[0] && id <= range[1];

const isFresh = (ranges: Range[], id: number) => ranges.some((range) => contains(range, id));

const merge = (a: Range, b: Range): Range[] => {
    const [startA, endA] = a;
    const [startB, endB] = b;
    if (startB >= startA && startB <= endA) {
        return [[Math.min(startA, startB), Math.max(endA, endB)]];
    }
    return [a, b];
};

const mergeAll = (ranges: Range[]): Range[] => {
    const sorted = ranges.sort((a, b) => a[0] > b[0] ? 1 : -1);
    return sorted.reduce<Range[]>((ranges, curr) => {
        const previous = ranges.pop();
        if (!previous) {
            ranges.push(curr);
        } else {
            ranges.push(...merge(previous, curr));
        }
        return ranges;
    }, []);
};

const run = (input: string) => {
    const { ranges, ids } = parseInput(input);
    const part1 = ids.filter((id) => isFresh(ranges, id)).length;
    const part2 = mergeAll(ranges)
        .map(([start, end]) => end - start + 1)
        .reduce((a, b) => a + b);
    return { part1, part2 };
}

console.log('Example', run(exampleInput));
console.log('Result', run(input));