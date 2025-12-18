const exampleInput1 = await Deno.readTextFile('examples/day11-1.txt');
const exampleInput2 = await Deno.readTextFile('examples/day11-2.txt');
const input = await Deno.readTextFile('inputs/day11.txt');

type DeviceIndex = {
    [name: string]: string[];
};

const parseInput = (input: string): DeviceIndex => Object.fromEntries(
    input.split('\n').map((line) => {
        const parts = line.split(/:? /);
        return [
            parts[0],
            parts.slice(1),
        ];
    })
);

const getPaths = (
    deviceIndex: DeviceIndex,
    from: string,
    to: string,
    path: string[] = [],
    cache: { [name: string]: number } = {},
): number => {
    if (from in cache) {
        return cache[from];
    }
    if (from === to) {
        cache[from] = 1;
        return 1;
    }
    const links = deviceIndex[from] ?? [];
    const result = links
        .map((link) => getPaths(
            deviceIndex,
            link,
            to,
            [...path, link],
            cache,
        ))
        .reduce((a, b) => a + b, 0);
    cache[from] = result;
    return result;
};

const run = (input1: string, input2 = input1) => {
    const deviceIndex1 = parseInput(input1);
    const part1 = getPaths(deviceIndex1, 'you', 'out');

    const deviceIndex2 = parseInput(input2);
    const svrToDac = getPaths(deviceIndex2, 'svr', 'dac');
    const svrToFft = getPaths(deviceIndex2, 'svr', 'fft');
    const dacToFft = getPaths(deviceIndex2, 'dac', 'fft');
    const fftToDac = getPaths(deviceIndex2, 'fft', 'dac');
    const dacToOut = getPaths(deviceIndex2, 'dac', 'out');
    const fftToOut = getPaths(deviceIndex2, 'fft', 'out');
    const part2 =
        svrToDac * dacToFft * fftToOut
        + svrToFft * fftToDac * dacToOut;

    return { part1, part2 };
};

console.log('Example', run(exampleInput1, exampleInput2));
console.log('Result', run(input));