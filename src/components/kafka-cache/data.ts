import type { Entry } from "./engine";

/** Fifteen records, used by the "get one record by key" scene. */
export const SEQ1: readonly Entry[] = [
	["I", 1],
	["U", 1],
	["I", 2],
	["D", 1],
	["I", 3],
	["T", 1],
	["I", 4],
	["I", 5],
	["U", 2],
	["I", 6],
	["D", 2],
	["I", 7],
	["I", 8],
	["T", 2],
	["I", 9],
];

/** Twenty records, used by the fan-out scene. */
export const SEQ2: readonly Entry[] = [
	["I", 1],
	["U", 1],
	["I", 2],
	["D", 1],
	["T", 1],
	["I", 3],
	["I", 4],
	["U", 2],
	["I", 5],
	["D", 2],
	["I", 6],
	["I", 7],
	["T", 2],
	["I", 8],
	["U", 3],
	["I", 9],
	["I", 10],
	["D", 3],
	["I", 11],
	["I", 12],
];

/** Twenty-four records, used by the compaction and start-offset scenes. */
export const SEQ3: readonly Entry[] = [
	["I", 1],
	["U", 1],
	["I", 2],
	["I", 3],
	["D", 1],
	["I", 4],
	["T", 1],
	["I", 5],
	["I", 6],
	["U", 2],
	["I", 7],
	["I", 8],
	["D", 2],
	["I", 9],
	["I", 10],
	["I", 11],
	["T", 2],
	["I", 12],
	["I", 13],
	["I", 14],
	["I", 15],
	["I", 16],
	["I", 17],
	["I", 18],
];

/** Offset the log cleaner has reached in SEQ3. */
export const CLEANER = 16;

export const SERVICE_NAMES = [
	"service A",
	"service B",
	"service C",
	"service D",
];
