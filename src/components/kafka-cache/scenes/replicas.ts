import {
	attr,
	box,
	cylinder,
	el,
	flight,
	type Key,
	op,
	ph,
	type Rec,
	rec,
	type SceneDef,
	setClass,
	show,
	txt,
} from "../engine";

interface State {
	reps: SVGGElement[];
	readLine: SVGLineElement;
	readT: SVGTextElement;
	lostT: SVGTextElement;
	copies: Rec[];
}

const REPLAYED: readonly Key[] = ["I", "U", "I", "D", "T"];

export const replicasScene: SceneDef<State> = {
	dur: 7200,
	build({ svg }) {
		const reps = [0, 1, 2].map((i) => {
			const g = cylinder(svg, 40 + i * 110, 30, 80, 60);
			txt(svg, 80 + i * 110, 110, `R${i + 1}`, "small", "middle");
			return g;
		});
		box(svg, 16, 150, 150, 44, "reader", "get(key)");
		box(svg, 274, 150, 150, 44, "projector", "replays the topic");
		const readLine = el(
			"line",
			{ x1: 90, y1: 150, x2: 80, y2: 90, class: "req-line" },
			svg,
		);
		const readT = txt(svg, 16, 214, "", "ok-label");
		const lostT = txt(svg, 424, 214, "", "bad-label", "end");
		const copies = REPLAYED.map((key, i) => {
			const r = rec(svg, key, i + 1);
			show(r, false);
			return r;
		});
		return { reps, readLine, readT, lostT, copies };
	},
	render(t, st) {
		const r2dead = t >= 1000 && t < 3000;
		const allLost = t >= 3000 && t < 6200;
		st.reps.forEach((g, i) => {
			setClass(g, "store", allLost || (i === 1 && r2dead) ? "dead" : "");
		});
		for (const c of st.copies) show(c, false);

		if (t < 3000) {
			const target = t < 1000 ? 1 : Math.floor(t / 400) % 2 === 0 ? 0 : 2;
			attr(st.readLine, "x2", 80 + target * 110);
			attr(st.readLine, "y2", 90);
			op(st.readLine, 1);
			st.readT.textContent = r2dead
				? "R2 down · reads served by R1, R3 (quorum)"
				: "reads served by R2";
			st.lostT.textContent = "";
		} else {
			op(st.readLine, 0.2);
			st.readT.textContent = allLost
				? "reads fail until rebuilt"
				: "reads resume";
			st.lostT.textContent =
				t < 3400
					? "bucket lost"
					: t < 6200
						? "replaying topic → store, once"
						: "rebuilt from the log of record";
			st.copies.forEach((c, i) => {
				const p = ph(t, 3600 + i * 480, 420);
				if (p > 0 && p < 1) {
					show(c, true);
					flight(
						c,
						{ x: 300, y: 140 },
						{ x: 65 + (i % 3) * 110, y: 50 },
						p,
						30,
					);
				}
			});
			if (t >= 6200) {
				attr(st.readLine, "x2", 80);
				op(st.readLine, 1);
			}
		}
	},
};
