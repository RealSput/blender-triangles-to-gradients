require('@g-js-api/g.js');

let invis_color = unknown_c();
invis_color.set(rgba(0, 0, 0, 0));

let create_triangle = (top, bottom_left, bottom_right, color_1, color_2) => {
	bottom_left = bottom_left.map(x => x * 3);
	bottom_right = bottom_right.map(x => x * 3);
	top = top.map(x => x * 3);
	let [bl_dot_1_group, bl_dot_2_group, bl_dot_3_group] = [unknown_g(), unknown_g(), unknown_g()];
		
	let [bl_dot_1, bl_dot_2, bl_dot_3] = [{ 
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
		X: top[0],
		Y: top[1],
		GROUPS: bl_dot_3_group,
		COLOR: invis_color
	}]
	
	$.add({
		OBJ_ID: 2903,
		GR_VERTEX_MODE: true,
		GR_BL: bl_dot_1_group,
		GR_BR: bl_dot_2_group,
		GR_TL: bl_dot_3_group,
		GR_TR: bl_dot_3_group,
		COLOR: color_1,
		COLOR_1: color_2,
		PREVIEW_OPACITY: true
	})
	
	$.add(bl_dot_1); $.add(bl_dot_2); $.add(bl_dot_3);
}

let [top_color, bottom_color] = [unknown_c(), unknown_c()];

top_color.set(rgb(255, 0, 0));
bottom_color.set(rgb(255, 255, 255));

create_triangle([25, 100], [15, 50], [50, 50], top_color, bottom_color)

$.exportToSavefile({ info: true });
