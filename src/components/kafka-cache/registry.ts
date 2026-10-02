import { mountScene, type Playable } from "./engine";
import type { SceneName } from "./meta";
import { casScene } from "./scenes/cas";
import { compactionScene } from "./scenes/compaction";
import { fanoutScene } from "./scenes/fanout";
import { heartbeatScene } from "./scenes/heartbeat";
import { keyedScene } from "./scenes/keyed";
import { lookupScene } from "./scenes/lookup";
import { offsetsScene } from "./scenes/offsets";
import { partitionsScene } from "./scenes/partitions";
import { replicasScene } from "./scenes/replicas";
import { ttlScene } from "./scenes/ttl";
import { watchScene } from "./scenes/watch";

export const mounters: Record<SceneName, (root: HTMLElement) => Playable> = {
	lookup: (root) => mountScene(root, lookupScene),
	fanout: (root) => mountScene(root, fanoutScene),
	compaction: (root) => mountScene(root, compactionScene),
	partitions: (root) => mountScene(root, partitionsScene),
	offsets: (root) => mountScene(root, offsetsScene),
	keyed: (root) => mountScene(root, keyedScene),
	heartbeat: (root) => mountScene(root, heartbeatScene),
	cas: (root) => mountScene(root, casScene),
	ttl: (root) => mountScene(root, ttlScene),
	watch: (root) => mountScene(root, watchScene),
	replicas: (root) => mountScene(root, replicasScene),
};
