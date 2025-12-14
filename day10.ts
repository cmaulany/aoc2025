const exampleInput = await Deno.readTextFile('examples/day10.txt');
const input = await Deno.readTextFile('inputs/day10.txt');

type On = '#';
type Off = '.'
type Light = On | Off;
type Button = number[];
type Counter = number[];

type Machine = {
    goal: Light[];
    buttons: Button[];
    counterGoal: Counter;
    // state: Light[];
};

const parseInput = (input: string): Machine[] => input.split('\n').map((line) => {
    const split = line.split(' ').map((part) => part.slice(1, -1));
    const goal = split[0].split('');
    const buttons = split.slice(1, -1).map((part) => part.split(',').map(Number)).sort((a, b) => a.length - b.length);
    const counterGoal = split.at(-1)?.split(',').map(Number);
    return { goal, buttons, counterGoal } as Machine;
});

const flip = (light: Light) => light === '#' ? '.' : '#';

const toggleLight = (lights: Light[], button: Button) =>
    lights.map((light, i) => button.includes(i) ? flip(light) : light);

const increaseCounter = (counter: Counter, button: Button, m = 1) =>
    counter.map((n, i) => button.includes(i) ? n + m : n);

type State = {
    lights: Light[];
    presses: number[];
}

const findPressesToGoal = (machine: Machine): State | null => {
    const initialState = {
        lights: machine.goal.map(() => '.'),
        presses: [],
    } as State;

    const seenStates = new Set<string>();

    const unvisited: State[] = [initialState];
    while (unvisited.length > 0) {
        const current = unvisited.shift()!;
        const nextStates = machine.buttons
            .map((button, i) => ({
                lights: toggleLight(current.lights, button),
                presses: [...current.presses, i],
            }))
            .filter((state) => !seenStates.has(state.lights.join('')));
        const goalState = nextStates.find((state) => state.lights.join('') === machine.goal.join(''));
        if (goalState) {
            return goalState;
        }
        nextStates.forEach((state) => seenStates.add(state.lights.join('')));
        unvisited.push(...nextStates);
    }
    return null;
};

type State2 = {
    counter: number[];
    presses: number;
}

const findMaxPresses = (counter: number[], goal: number[], button: Button) => {
    const deltas = goal.map((n, i) => n - counter[i]).filter((_, i) => button.includes(i));
    // console.log(deltas);
    return Math.min(...deltas);
};

const findPressesToGoal2 = (machine: Machine): State2 | null => {
    const initialState = {
        counter: machine.counterGoal.map(() => 0),
        presses: 0,
    } as State2;

    const visited: { [key: string]: State2 } = {};

    const unvisited: State2[] = [initialState];

    let i = 0;
    while (unvisited.length > 0) {
        const current = unvisited.pop()!;

        i++;
        if (i % 10000 === 0) {
            console.log(machine.counterGoal.join(','), '-', current.counter.join(','))
        }

        {
            const nextStates = machine.buttons
                .flatMap((button) => {
                    const presses = findMaxPresses(current.counter, machine.counterGoal, button)
                    return [
                        {
                            counter: increaseCounter(current.counter, button),
                            presses: current.presses + 1,
                        },
                        // {
                        //     counter: increaseCounter(current.counter, button, presses),
                        //     presses: current.presses + presses,
                        // }
                    ];
                })
                .filter((state) => !(state.counter.join(',') in visited) && state.counter.every((n, i) => n <= machine.counterGoal[i]));
            const goalState = nextStates.find((state) => state.counter.join(',') === machine.counterGoal.join(','));
            if (goalState) {
                return goalState;
            }
            nextStates.forEach((state) => visited[state.counter.join(',')] = state);
            unvisited.unshift(...nextStates);
        }

        {
            const nextStates = machine.buttons
                .flatMap((button) => {
                    const presses = findMaxPresses(current.counter, machine.counterGoal, button);
                    if (presses === 0) {
                        return [];
                    }
                    return [
                        // {
                        //     counter: increaseCounter(current.counter, button),
                        //     presses: current.presses + 1,
                        // },
                        {
                            counter: increaseCounter(current.counter, button, presses),
                            presses: current.presses + presses,
                        }
                    ];
                })
                .filter((state) => !(state.counter.join(',') in visited) && state.counter.every((n, i) => n <= machine.counterGoal[i]));
            const goalState = nextStates.find((state) => state.counter.join(',') === machine.counterGoal.join(','));
            if (goalState) {
                return goalState;
            }
            nextStates.forEach((state) => visited[state.counter.join(',')] = state);
            unvisited.push(...nextStates);
        }

    }
    return null;
};

const run = (input: string) => {
    const machines = parseInput(input);
    // console.log(machines);
    const states = machines.map(findPressesToGoal);
    const part1 = states.map((state) => state?.presses.length).reduce((a, b) => a + b);
    // console.log(findMaxPresses([2, 2, 4, 4], [4, 4, 4, 4], [0, 3]))
    // console.log(machines.at(-1));
    const states2 = machines.map(findPressesToGoal2);
    const part2 = states2.map((state) => state?.presses).reduce((a, b) => a + b);
    return { part1, part2 };
};

console.log('Example', run(exampleInput));
console.log('Result', run(input));