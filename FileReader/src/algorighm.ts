type Place = {
    lon: number
    lat: number
}

type Route = {
    legs: Leg[];
    weight_name: string;
    weight: number;
    duration: number;
    distance: number;
};

type Leg = {
    steps: Step[];
    summary: string;
    weight: number;
    duration: number;
    distance: number;
};

type Step = {
    geometry: string;
    maneuver: Maneuver;
    mode: string;
    driving_side: string;
    name: string;
    intersections: any;
    weight: number;
    duration: number;
    distance: number;
};

type Maneuver = {
    bearing_after: number;
    bearing_before: number;
    location: [number, number];
    modifier: string;
    type: string;
};


const JENESIEN: Place = { lon: 11.3313839, lat: 46.5350348 };
const BOZEN: Place = { lon: 11.3547399, lat: 46.4984781 };
const AFING: Place = { lon: 11.3567147, lat: 46.5637695 };

async function getRoute(placeA: Place, placeB: Place) {
    const url = `https://routing.openstreetmap.de/routed-car/route/v1/driving/${placeA.lon},${placeA.lat};${placeB.lon},${placeB.lat}?overview=false&steps=true`;

    try {
        const response = await fetch(url, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error(`Error fetching the route: ${response.statusText}`);
        }

        const data = await response.json();

        return data.routes[0] as Route;
    } catch (error) {
        console.error('Error fetching the route:', error);
    }
}

type Edge = {
    a: Step
    b: Step
}

function stepsToEdges(steps: Step[]) {
    const edges: Edge[] = []

    let a = steps[0]
    for (let i = 1; i < steps.length; i++) {
        let b = steps[i]
        const edge: Edge = { a, b }
        edges.push(edge)
        a = b;
    }

    return edges
}

function compareStep(a: Step, b: Step) {
    if (a.maneuver.location[0] == b.maneuver.location[0] &&
        a.maneuver.location[1] == b.maneuver.location[1]
    ) {
        return true
    }
    return false
}

function findSimilarPoints(routeA: Route, routeB: Route) {
    const stepsA = routeA.legs[0].steps
    const stepsB = routeB.legs[0].steps

    const edgeA = stepsToEdges(stepsA);
    const edgeB = stepsToEdges(stepsB);

    const overlaps: Edge[] = []
    edgeA.forEach(eA => {
        edgeB.forEach(eB => {
            if (compareStep(eA.a, eB.a) && compareStep(eA.b, eB.b)) {
                overlaps.push(eA)
            }
        });
    });

    console.log(overlaps);
    console.log(overlaps.length);
}

async function main() {
    const routeA = await getRoute(JENESIEN, BOZEN);
    const routeB = await getRoute(BOZEN, AFING)

    if (!routeA || !routeB) {
        console.log("No route found");
        return
    }

    findSimilarPoints(routeA, routeB)
}

main()
