const exampleInput = await Deno.readTextFile('examples/day8.txt');
const input = await Deno.readTextFile('inputs/day8.txt');

type Position = [x: number, y: number, z: number];

type State = {
    boxToCircuit: { [i: number]: number };
    circuitSize: { [circuit: number]: number };
    nextCircuit: number;
    connections: [number, number][];
    i: number;
};

const parseInput = (input: string): Position[] => input
    .split('\n')
    .map((line) => line.split(',').map(Number) as Position);

const distance = (a: Position, b: Position) => {
    const [ax, ay, az] = a;
    const [bx, by, bz] = b;
    return Math.sqrt(
        (ax - bx) ** 2
        + (ay - by) ** 2
        + (az - bz) ** 2
    );
};

const getDistances = (positions: Position[]): number[][] =>
    positions.flatMap((a, j) =>
        positions.slice(0, j).map((b, i) => [i, j, distance(a, b)])
    );

const connect = (state: State, i: number, j: number): void => {
    const {
        boxToCircuit,
        circuitSize,
    } = state;
    state.connections.push([i, j]);
    if (i in boxToCircuit && j in boxToCircuit && boxToCircuit[i] !== boxToCircuit[j]) {
        // Combine circuits
        const circuitI = boxToCircuit[i]
        const circuitJ = boxToCircuit[j];
        circuitSize[circuitI] += circuitSize[circuitJ];
        delete circuitSize[circuitJ];

        Object.entries(boxToCircuit).forEach(([box, circuit]) => {
            if (circuit === circuitJ) {
                boxToCircuit[Number(box)] = circuitI;
            }
        });
    } else if (
        !(i in boxToCircuit) || !(j in boxToCircuit)
    ) {
        // Add to circuit
        const circuit = boxToCircuit[i] ?? boxToCircuit[j] ?? state.nextCircuit++;
        circuitSize[circuit] ??= 1;
        circuitSize[circuit]++;
        boxToCircuit[i] = circuit;
        boxToCircuit[j] = circuit;
    }
};

const connectUntil = (positions: Position[], condition: (state: State) => boolean): State => {
    const sortedDistances = getDistances(positions).sort((a, b) => a[2] - b[2]);
    const state: State = {
        boxToCircuit: {},
        circuitSize: {},
        nextCircuit: 0,
        connections: [],
        i: 0,
    };
    while (!condition(state)) {
        const connection = sortedDistances[state.i];
        connect(state, connection[0], connection[1]);
        state.i++;
    }
    return state;
};

const run = (input: string, connectionCount: number) => {
    const positions = parseInput(input);

    const statePart1 = connectUntil(positions, (state) => state.i === connectionCount);
    const threeLargestSizes = Object.values<number>(statePart1.circuitSize)
        .sort((a, b) => b - a)
        .slice(0, 3);
    const part1 = threeLargestSizes.reduce((a, b) => a * b);

    const statePart2 = connectUntil(positions, (state) => Object.values(state.circuitSize).length === 1 && Object.values(state.circuitSize)[0] === positions.length);
    const lastConnection = statePart2.connections.at(-1)!;
    const part2 = positions[lastConnection[0]][0] * positions[lastConnection[1]][0];

    return { part1, part2 };
};

console.log('Example', run(exampleInput, 10));
console.log('Result', run(input, 1000));