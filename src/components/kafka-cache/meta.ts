export interface SceneMeta {
	viewBox: string;
	label: string;
	/** Small (FAQ-sized) figure rather than a full-width one. */
	compact?: boolean;
	/** Render the start-offset slider under the figure. */
	slider?: boolean;
}

export const SCENE_META = {
	lookup: {
		viewBox: "0 0 960 340",
		label:
			"A get-by-key request bounces off a Kafka log and must scan every offset, while the same request to a keyed store returns one record.",
	},
	fanout: {
		viewBox: "0 0 960 470",
		label:
			"Twenty records stream from one topic into four services at once; each service fills an identical map and the total processed count grows four times faster than the log.",
	},
	compaction: {
		viewBox: "0 0 960 400",
		label:
			"Compaction removes superseded records behind the cleaner point, but the consumer still reads twelve records to keep four and tosses eight.",
	},
	partitions: {
		viewBox: "0 0 960 480",
		label:
			"Reading only one SKU works when that SKU has its own partition; doing that for 50,000 SKUs fills a grid to 50,000 partitions, far past the 4,000-per-broker and 20,000-per-cluster guidance.",
	},
	offsets: {
		viewBox: "0 0 960 300",
		label:
			"Moving the start offset later removes cold keys from the map; moving it earlier increases the number of superseded records read.",
		slider: true,
	},
	keyed: {
		viewBox: "0 0 960 450",
		label:
			"A publisher writes four records once into a central keyed store; four services fetch single records by key on demand and hold no map.",
	},
	heartbeat: {
		viewBox: "0 0 440 230",
		compact: true,
		label:
			"The projector stops, the heartbeat age climbs and the freshness bar turns red while entries stay readable; the projector restarts from its committed offset and catches up.",
	},
	cas: {
		viewBox: "0 0 440 230",
		compact: true,
		label:
			"A live write with the expected revision is accepted; a restarted publisher writing an older value with a stale revision is rejected.",
	},
	ttl: {
		viewBox: "0 0 440 230",
		compact: true,
		label:
			"Three keys: reference data with no TTL and a heartbeat stamp, a session key whose TTL is refreshed by a put, and a reservation key whose TTL runs out and leaves a tombstone.",
	},
	watch: {
		viewBox: "0 0 440 230",
		compact: true,
		label:
			"A service watches one SKU key; of four writes to the store, only the two for that key are pushed to the service.",
	},
	replicas: {
		viewBox: "0 0 440 230",
		compact: true,
		label:
			"One of three replicas fails and reads continue from the other two; then the whole bucket is lost and the projector replays the topic once to rebuild it.",
	},
} as const satisfies Record<string, SceneMeta>;

export type SceneName = keyof typeof SCENE_META;

export function isSceneName(s: string | undefined): s is SceneName {
	return s !== undefined && Object.hasOwn(SCENE_META, s);
}
