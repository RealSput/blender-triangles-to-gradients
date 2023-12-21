const fs = require('fs');

require('@g-js-api/g.js');

let invis_color = unknown_c();
invis_color.set(rgb(0, 0, 0, 0), 0, true);

let get = (filename) => {
	return new Promise((resolve) => {
		let f = fs.createReadStream(filename);
		let chunks = [];
	
		f.on("data", (chunk) => chunks.push(chunk));
	
		f.on('end', () => {
			chunks = JSON.parse(Buffer.concat(chunks).toString());
			resolve(chunks)
		})
	});
}

let verts_curr = [];

let GR_ID = 1;
let create_quad = (top_left, top_right, bottom_left, bottom_right, color_1, color_2, mult = true) => {
	if (mult) {
		bottom_left = bottom_left.map(x => x * 3);
		bottom_right = bottom_right.map(x => x * 3);
		top_left = top_left.map(x => x * 3);
		top_right = top_right.map(x => x * 3);
	}
	
	let [bl_dot_1_group, bl_dot_2_group, bl_dot_3_group, bl_dot_4_group] = [unknown_g(), unknown_g(), unknown_g(), unknown_g()];
		
	let [bl_dot_1, bl_dot_2, bl_dot_3, bl_dot_4] = [{ 
		OBJ_ID: 1764,
		X: bottom_left[0],
		Y: bottom_left[1],
		GROUPS: bl_dot_1_group,
		COLOR: invis_color
	}, { 
		OBJ_ID: 1764,
		X: bottom_right[0],
		Y: bottom_right[1],
		GROUPS: bl_dot_2_group,
		COLOR: invis_color
	}, { 
		OBJ_ID: 1764,
		X: top_left[0],
		Y: top_left[1],
		GROUPS: bl_dot_3_group,
		COLOR: invis_color
	}, { 
		OBJ_ID: 1764,
		X: top_right[0],
		Y: top_right[1],
		GROUPS: bl_dot_4_group,
		COLOR: invis_color
	}]
		
	$.add({
		OBJ_ID: 2903,
		GR_VERTEX_MODE: true,
		GR_BL: bl_dot_1_group,
		GR_BR: bl_dot_2_group,
		GR_TL: bl_dot_3_group,
		GR_TR: bl_dot_4_group,
		COLOR: color_1,
		COLOR_2: color_2,
		PREVIEW_OPACITY: true,
		GR_ID
	})
	
	$.add(bl_dot_1); $.add(bl_dot_2); $.add(bl_dot_3); $.add(bl_dot_4);
	GR_ID++;
	return [bl_dot_1_group, bl_dot_2_group, bl_dot_3_group, bl_dot_4_group];
}

let scaling = 8;
let [offset_x, offset_y] = [50, 50];
let [translation_x, translation_y] = [750, 650];

let fix = (vertices) => {
	return vertices.map(x => [x[0] * scaling + offset_x, x[1] * scaling + offset_y]);
}

function drawQuads(quadData) {	
	for (var i = 0; i < quadData.length; i++) {
		let color = unknown_c();
		let quads = quadData[i];
		color.set(quads.color);
		let [ TL, TR, BL, BR ] = fix(quads.vertices)
		verts_curr.push(create_quad(TR, TL, BL, BR, color, color));
	}
}

let cframe = 1;
let calcDiff = (coord_a, coord_b) => [coord_b[0] - coord_a[0], coord_b[1] - coord_a[1]]
let nextFrame = (frames) => {
	wait(0.025);
	// frame movement
	let last_frame = frames[cframe - 1];
	let curr_frame = frames[cframe];
	last_frame.forEach((mesh, i1) => {
		let fixed_last = fix(mesh.vertices);
		let fixed_curr = fix(curr_frame[i1].vertices);
		fixed_last.forEach((vertex, i2) => {
			console.log(i1, i2)
			let diff = calcDiff(vertex, fixed_curr[i2]);
			verts_curr[i1][i2].move(...diff)
		})
	})
	cframe++;
}

let frames_am = 20;

(async () => {
	frames_am--;
	let data = await get('out.json');
	drawQuads(data[0]);	
	
	while (frames_am > 0) {
		nextFrame(data)
		console.log(`cframe: ${cframe}`)
		frames_am--
	}
	$.exportToSavefile({ info: true });
})();
