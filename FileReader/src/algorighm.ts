type Place = {
	lon: number;
	lat: number;
};

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
	intersections: Intersection[];
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

type Intersection = {
	out: number;
	in?: number;
	entry: boolean[];
	bearings: number[];
	location: [number, number];
};

type Trip = {
	id: number;
	type: number;
	route: Route | undefined;
};

const JENESIEN: Place = { lon: 11.3313839, lat: 46.5350348 };
const BOZEN: Place = { lon: 11.309738591072547, lat: 46.498583062291424 };
const AFING: Place = { lon: 11.3567147, lat: 46.5637695 };
const SCHLANDERS: Place = { lon: 10.768806157073763, lat: 46.62731964109522 };
const LANA: Place = { lon: 11.16041847578976, lat: 46.611267498282615 };

async function getRoute(placeA: Place, placeB: Place) {
	const url = `https://routing.openstreetmap.de/routed-car/route/v1/driving/${placeA.lon},${placeA.lat};${placeB.lon},${placeB.lat}?overview=false&steps=true`;

	try {
		const response = await fetch(url, {
			method: "GET",
		});

		if (!response.ok) {
			throw new Error(`Error fetching the route: ${response.statusText}`);
		}

		const data = await response.json();

		return data.routes[0] as Route;
	} catch (error) {
		console.error("Error fetching the route:", error);
	}
}

function compareLocations(a: [number, number], b: [number, number]) {
	return a[0] == b[0] && a[1] == b[1];
}

function getPointsFromRoute(r: Route) {
	const ret: [number, number][] = [];
	r.legs[0].steps.forEach((s) => {
		ret.push(s.maneuver.location);
		s.intersections.forEach((i) => {
			ret.push(i.location);
		});
	});
	return ret;
}

type Edge = {
	a: [number, number];
	b: [number, number];
};

function locationsToEdges(steps: [number, number][]) {
	const edges: Edge[] = [];

	let a = steps[0];
	for (let i = 1; i < steps.length; i++) {
		let b = steps[i];
		const edge: Edge = { a, b };
		edges.push(edge);
		a = b;
	}

	return edges;
}

function distance(e: Edge) {
	const lon1 = e.a[0];
	const lat1 = e.a[1];
	const lon2 = e.b[0];
	const lat2 = e.b[1];

	const r = 6371; // km
	const p = Math.PI / 180;

	const a = 0.5 - Math.cos((lat2 - lat1) * p) / 2 + (Math.cos(lat1 * p) * Math.cos(lat2 * p) * (1 - Math.cos((lon2 - lon1) * p))) / 2;

	return 2 * r * Math.asin(Math.sqrt(a));
}

function findSimilarPoints(routeA: Route, routeB: Route) {
    const pointsA = getPointsFromRoute(routeA)
    const pointsB = getPointsFromRoute(routeB)

    const edgesA = locationsToEdges(pointsA)
    const edgesB = locationsToEdges(pointsB)

    const overlaps: Edge[] = []
    let firstOverlapIndex = -1
    edgesA.forEach(eA => {
        edgesB.forEach((eB, edgeIndex) => {
            if (compareLocations(eA.a, eB.a) && compareLocations(eA.b, eB.b)) {
                if (firstOverlapIndex == -1) {
                    firstOverlapIndex = edgeIndex
                }

				overlaps.push(eA);
			}
		});
	});

	if (firstOverlapIndex == -1 || overlaps.length == 0) {
		console.log("No overlaps");
		return;
	}

	const firstOverlap = overlaps[0];

    console.log(firstOverlap);
    console.log(firstOverlapIndex);
    console.log(overlaps.length);

    let distanceSum = 0
    for (let i = 0; i < firstOverlapIndex; i++) {
        distanceSum += distance(edgesB[i])
    }
    console.log(distanceSum * 2);

	return { extraDistance: distanceSum * 2, length: overlaps.length };
}

async function main() {
	console.time("api");
	let uncheckedRoutes: Trip[] = [];
	let groupedRoutes: [Trip[]] | undefined = undefined;

	let potentialGroupings: any[] = [];

	const routeA = await getRoute(SCHLANDERS, BOZEN);
	const routeB = await getRoute(JENESIEN, BOZEN);
	const routeC = await getRoute(LANA, BOZEN);

	//console.log(routeB);

	uncheckedRoutes.push({ id: 1, route: routeA, type: 1 });
	uncheckedRoutes.push({ id: 2, route: routeB, type: 2 });
	uncheckedRoutes.push({ id: 3, route: routeC, type: 1 });
	uncheckedRoutes.push({ id: 4, route: routeC, type: 2 });
	//uncheckedRoutes.push({ id: 1, route: routeA, type: 1 });

	console.timeEnd("api");

    if (!routeA || !routeB) {
        console.log("No route found");
        return
    }

	//console.time("calc");
	//findSimilarPoints(routeA, routeB);
	//console.timeEnd("calc");
}

main();
