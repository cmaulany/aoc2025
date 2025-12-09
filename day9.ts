const exampleInput = await Deno.readTextFile('examples/day9.txt');
const input = await Deno.readTextFile('inputs/day9.txt');

type Position = [x: number, y: number];
type Edge = [Position, Position];
type Polygon = Edge[];

const parseInput = (input: string): Position[] => input
    .split('\n')
    .map((line) => line.split(',').map(Number) as Position);

const getSize = (a: Position, b: Position) => {
    const tl = [Math.min(a[0], b[0]), Math.min(a[1], b[1])];
    const br = [Math.max(a[0], b[0]), Math.max(a[1], b[1])];
    return (br[0] - tl[0] + 1) * (br[1] - tl[1] + 1);
};

const findMaxRect = (positions: Position[]) =>
    positions
        .flatMap((a, i) => positions.slice(0, i).map((b) => getSize(a, b)))
        .reduce((max, n) => n > max ? n : max, 0);

const toPolygon = (positions: Position[]): Polygon =>
    positions.reduce((polygon, position) => {
        const previous = polygon.at(-1)!;
        polygon.push([previous[1], position]);
        return polygon;
    }, [[positions.at(-1)!, positions[0]]]);

/**
 * Returns true if a horizontal and vertical edge overlap.
 */
const intersectsSimple = (horizontal: Edge, vertical: Edge) => {
    //            o v0x, v0
    //            |
    //    o-------+-----
    // h0x,h0y    |  h1x, h1y
    //            |
    //            o v1x, v1
    const [[h0x, h0y], [h1x, _h1y]] = horizontal;
    const [[v0x, v0y], [_v1x, v1y]] = vertical;
    return (
        Math.min(h0x, h1x) <= v0x && Math.max(h0x, h1x) >= v0x &&
        Math.min(v0y, v1y) <= h0y && Math.max(v0y, v1y) >= h0y
    );
};

const isHorizontal = (edge: Edge) => edge[0][1] === edge[1][1];

const intersects = (a: Edge, b: Edge) => {
    const isHorizontalA = isHorizontal(a);
    const isHorizontalB = isHorizontal(b);
    if (isHorizontalA === isHorizontalB) {
        return false;
    }
    const horizontal = isHorizontalA ? a : b;
    const vertical = isHorizontalB ? a : b;
    return intersectsSimple(horizontal, vertical);
};

const intersectsPolygon = (edge: Edge, polygon: Polygon) =>
    polygon.some((polygonEdge) => intersects(edge, polygonEdge));

/**
 *  Pretty sure this at the moment only checks if a rectangle intersects with a polygon.
 *  Does not detect if the rectangle is actually contained within it.
 *  Still results in the correct solution though.
 */
const containsRect = (polygon: Polygon, a: Position, b: Position) => {
    const tl: Position = [
        Math.min(a[0], b[0]) + 0.5,
        Math.min(a[1], b[1]) + 0.5,
    ];
    const tr: Position = [
        Math.max(a[0], b[0]) - 0.5,
        Math.min(a[1], b[1]) + 0.5,
    ];
    const bl: Position = [
        Math.min(a[0], b[0]) + 0.5,
        Math.max(a[1], b[1]) - 0.5,
    ];
    const br: Position = [
        Math.max(a[0], b[0]) - 0.5,
        Math.max(a[1], b[1]) - 0.5,
    ];
    const edges = [
        [tl, tr],
        [tr, br],
        [br, bl],
        [bl, tl],
    ] as Edge[];
    return edges.every((edge) => !intersectsPolygon(edge, polygon))
};

const findMaxContainedRect = (positions: Position[]): number => {
    const polygon = toPolygon(positions);
    return positions
        .flatMap((a, i) => positions.slice(0, i)
            .filter((b) => containsRect(polygon, a, b))
            .map((b) => getSize(a, b))
        )
        .reduce((max, n) => n > max ? n : max, 0);
};

const run = (input: string) => {
    const redTiles = parseInput(input);
    const part1 = findMaxRect(redTiles);
    const part2 = findMaxContainedRect(redTiles);
    return { part1, part2 };
};

console.log('Example', run(exampleInput));
console.log('Result', run(input));