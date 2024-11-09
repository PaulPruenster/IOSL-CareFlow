"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const JENESIEN = { lon: 11.3313839, lat: 46.5350348 };
const BOZEN = { lon: 11.309738591072547, lat: 46.498583062291424 };
const AFING = { lon: 11.3567147, lat: 46.5637695 };
const SCHLANDERS = { lon: 10.768806157073763, lat: 46.62731964109522 };
const LANA = { lon: 11.16041847578976, lat: 46.611267498282615 };
function getRoute(placeA, placeB) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `https://routing.openstreetmap.de/routed-car/route/v1/driving/${placeA.lon},${placeA.lat};${placeB.lon},${placeB.lat}?overview=false&steps=true`;
        try {
            const response = yield fetch(url, {
                method: "GET",
            });
            if (!response.ok) {
                throw new Error(`Error fetching the route: ${response.statusText}`);
            }
            const data = yield response.json();
            return data.routes[0];
        }
        catch (error) {
            console.error("Error fetching the route:", error);
        }
    });
}
function compareLocations(a, b) {
    return a[0] == b[0] && a[1] == b[1];
}
function getPointsFromRoute(r) {
    const ret = [];
    r.legs[0].steps.forEach((s) => {
        ret.push(s.maneuver.location);
        s.intersections.forEach((i) => {
            ret.push(i.location);
        });
    });
    return ret;
}
function locationsToEdges(steps) {
    const edges = [];
    let a = steps[0];
    for (let i = 1; i < steps.length; i++) {
        let b = steps[i];
        const edge = { a, b };
        edges.push(edge);
        a = b;
    }
    return edges;
}
function distance(e) {
    const lon1 = e.a[0];
    const lat1 = e.a[1];
    const lon2 = e.b[0];
    const lat2 = e.b[1];
    const r = 6371; // km
    const p = Math.PI / 180;
    const a = 0.5 - Math.cos((lat2 - lat1) * p) / 2 + (Math.cos(lat1 * p) * Math.cos(lat2 * p) * (1 - Math.cos((lon2 - lon1) * p))) / 2;
    return 2 * r * Math.asin(Math.sqrt(a));
}
function findSimilarPoints(routeA, routeB) {
    const pointsA = getPointsFromRoute(routeA);
    const pointsB = getPointsFromRoute(routeB);
    const edgesA = locationsToEdges(pointsA);
    const edgesB = locationsToEdges(pointsB);
    const overlaps = [];
    let firstOverlapIndex = -1;
    edgesA.forEach((eA) => {
        edgesB.forEach((eB, edgeIndex) => {
            if (compareLocations(eA.a, eB.a) && compareLocations(eA.b, eB.b)) {
                if (firstOverlapIndex == -1) {
                    firstOverlapIndex = edgeIndex;
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
    let distanceSum = 0;
    for (let i = 0; i < firstOverlapIndex; i++) {
        distanceSum += distance(edgesB[i]);
    }
    console.log(distanceSum * 2);
    return distanceSum * 2;
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        console.time("api");
        let uncheckedRoutes = [];
        const groupedRoutes = [[]];
        const routeA = yield getRoute(SCHLANDERS, BOZEN);
        const routeB = yield getRoute(JENESIEN, BOZEN);
        const routeC = yield getRoute(LANA, BOZEN);
        uncheckedRoutes.push({ route: routeA, type: 1 }, { route: routeB, type: 2 }, { route: routeC, type: 1 }, { route: routeC, type: 2 });
        console.timeEnd("api");
        if (!routeA || !routeB) {
            console.log("No route found");
            return;
        }
        uncheckedRoutes
            .filter((r) => r.type == 1)
            .forEach((r) => {
            groupedRoutes.push([r]);
        });
        uncheckedRoutes = uncheckedRoutes.filter((r) => r.type != 1);
        uncheckedRoutes.forEach((r) => {
            groupedRoutes.forEach((group) => {
                group.sort((a, b) => a.route.distance - b.route.distance);
                const res = findSimilarPoints(r.route, group[0].route);
                if (res && res < 30) {
                    group.push(r);
                }
            });
        });
        //console.time("calc");
        //findSimilarPoints(routeA, routeB);
        //console.timeEnd("calc");
    });
}
main();
