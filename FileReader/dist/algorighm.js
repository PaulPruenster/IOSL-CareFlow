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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
// Replace with your OpenRouteService API key
const API_KEY = 'YOUR_API_KEY';
// Coordinates for Jenesien and Bozen
const JENESIEN_COORDINATES = [11.34436, 46.55853]; // [Longitude, Latitude]
const BOZEN_COORDINATES = [11.35478, 46.49829]; // [Longitude, Latitude]
/**
 * Fetches the route from Jenesien to Bozen using OpenRouteService API.
 */
function getRoute() {
    return __awaiter(this, void 0, void 0, function* () {
        const url = 'https://api.openrouteservice.org/v2/directions/driving-car';
        try {
            const response = yield axios_1.default.get(url, {
                headers: {
                    Authorization: API_KEY,
                },
                params: {
                    start: JENESIEN_COORDINATES.join(','),
                    end: BOZEN_COORDINATES.join(','), // Ending coordinates
                },
            });
            // Display route information
            console.log('Route from Jenesien to Bozen:', response.data);
            return response.data;
        }
        catch (error) {
            console.error('Error fetching the route:', error);
        }
    });
}
// Run the function
getRoute();
