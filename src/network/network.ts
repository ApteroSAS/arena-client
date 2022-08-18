import { Client } from "colyseus.js";


const ENDPOINT = process.env.ENDPOINT;

export const client = new Client(ENDPOINT);