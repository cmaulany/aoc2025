const exampleInput = await Deno.readTextFile("examples/day1.txt");
const input = await Deno.readTextFile("inputs/day1.txt");

type Movement = {
    direction: "L" | "R";
    amount: number;
}

type State = {
    count: number;
    position: number;
};

const parseInput = (input: string): Movement[] => input.split('\n').map((line) => {
    const direction = line[0] as "L" | "R";
    const amount = Number(line.slice(1));
    return { direction, amount };
});

const moveDial = (state: State, movement: Movement): State => {
    let { count, position } = state;
    const d = movement.direction === "L" ? -1 : 1;
    position += d * movement.amount;
    position %= 100;
    if (position < 0) {
        position += 100;
    }
    if (position === 0) {
        count++;
    }
    return { count, position };
};

const tickDial = (state: State, movement: Movement): State => {
    let { count, position, } = state;
    const d = movement.direction === "L" ? -1 : 1;
    for (let i = 0; i < movement.amount; i++) {
        position += d;
        position %= 100;
        if (position < 0) {
            position += 100;
        }
        if (position === 0) {
            count++;
        }
    }
    return { count, position };
};

const run = (input: string) => {
    const initialState: State = {
        count: 0,
        position: 50,
    };
    const movements = parseInput(input);
    const part1 = movements.reduce(moveDial, initialState).count;
    const part2 = movements.reduce(tickDial, initialState).count;
    return { part1, part2 };
};

console.log('Example', run(exampleInput));
console.log('Result', run(input));