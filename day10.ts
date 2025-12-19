const exampleInput = await Deno.readTextFile('examples/day10.txt');
const input = await Deno.readTextFile('inputs/day10.txt');

type On = '#';
type Off = '.'
type Light = On | Off;
type Button = number[];
type Counter = number[];

type Machine = {
    lightsGoal: Light[];
    counterGoal: Counter;
    buttons: Button[];
};

const parseInput = (input: string): Machine[] => input.split('\n').map((line) => {
    const split = line.split(' ').map((part) => part.slice(1, -1));
    const lightsGoal = split[0].split('');
    const buttons = split.slice(1, -1).map((part) => part.split(',').map(Number)); //.sort((a, b) => a.length - b.length);
    const counterGoal = split.at(-1)?.split(',').map(Number);
    return { lightsGoal, buttons, counterGoal } as Machine;
});

const flipLight = (light: Light) => light === '#' ? '.' : '#';

const flipLights = (lights: Light[], button: Button) =>
    lights.map((light, i) => button.includes(i) ? flipLight(light) : light);

const findSeqsToLights = (buttons: Button[], lights: Light[], seq: Button[] = []): Button[][] => {
    const solutions = [];
    if (lights.every((light) => light === '.')) {
        solutions.push(seq);
    }
    if (buttons.length === 0) {
        return solutions;
    }
    const [button, ...rest] = buttons;
    const on = findSeqsToLights(rest, flipLights(lights, button), [...seq, button]);
    const off = findSeqsToLights(rest, lights, seq);
    solutions.push(...on);
    solutions.push(...off);
    return solutions;
};

// deno-lint-ignore no-explicit-any
const memoize = <T extends (...args: any[]) => any>(
    fn: T,
    toKey: (...args: Parameters<T>) => string = (...args) => JSON.stringify(args),
): T => {
    const cache: { [key: string]: ReturnType<T> } = {};
    return ((...args: Parameters<T>) => {
        const key = toKey(...args);
        if (key in cache) {
            return cache[key];
        }
        const result = fn(...args);
        cache[key] = result;
        return result;
    }) as T;
};

const findPressesToCounter = memoize((
    buttons: Button[],
    counter: number[],
): number => {
    if (counter.every((n) => n === 0)) {
        return 0;
    }
    if (counter.some((n) => n < 0)) {
        return Infinity;
    }

    const unevenLights = counter.map((n) => n % 2 === 1 ? '#' : '.');
    const combinations = findSeqsToLights(buttons, unevenLights);
    const results = combinations.map((combination) => {
        const remainder = combination.reduce((counter, button) => counter.map((n, i) => button.includes(i) ? n - 1 : n), counter);
        const halved = remainder.map((n) => Math.round(n / 2));
        const res = 2 * findPressesToCounter(buttons, halved) + combination.length;
        return res;
    });
    const min = results.reduce((a, b) => Math.min(a, b), Infinity);
    return min;
});

const run = (input: string) => {
    const machines = parseInput(input);
    const part1 = machines
        .map((machine) => findSeqsToLights(machine.buttons, machine.lightsGoal))
        .map((seq) => seq.map((p) => p.length))
        .map((seqLength) => seqLength.reduce((a, b) => Math.min(a, b)))
        .reduce((a, b) => a + b);
    const part2 = machines
        .map((machine) => findPressesToCounter(machine.buttons, machine.counterGoal))
        .reduce((a, b) => a + b);
    return { part1, part2 };
};

console.log('Example', run(exampleInput));
console.log('Result', run(input));