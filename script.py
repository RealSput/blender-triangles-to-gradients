from mathutils import Vector
import bpy
import json
import pyperclip
from bpy_extras.view3d_utils import location_3d_to_region_2d

# Function to check if a face is visible from the current camera perspective
def is_face_visible(scene, camera, face, context):
    depsgraph = context.evaluated_depsgraph_get()

    # Check if the face is visible in 3D space
    face_center = sum((context.active_object.matrix_world @ context.active_object.data.vertices[i].co for i in face.vertices), Vector()) / len(face.vertices)
    view_vector = (camera.matrix_world @ Vector((0, 0, 0))) - face_center

    if face.normal.dot(view_vector) < 0:
        return True

    return False

# Function to convert quad vertices to 2D relative to camera perspective
def get_quad_vertices_2d(scene, obj, camera, frame, context):
    quads_data = []
    
    # Set the scene frame
    scene.frame_set(frame)

    # Get the camera matrix
    depsgraph = context.evaluated_depsgraph_get()
    view_matrix = camera.matrix_world.inverted()
    projection_matrix = camera.calc_matrix_camera(depsgraph, x=scene.render.resolution_x, y=scene.render.resolution_y)
    matrix = projection_matrix @ view_matrix

    # Project each vertex to 2D
    current_quad = []
    for face in obj.data.polygons:
        if len(face.vertices) == 4 and is_face_visible(scene, camera, face, context):  # Check if it's a quad and is visible
            for vert_index in face.vertices:
                vertex = obj.data.vertices[vert_index]
                world_coord = obj.matrix_world @ vertex.co
                coord = matrix @ world_coord
                coord = coord.to_4d()  # Convert to 4D vector
                coord /= coord.w
                coord = (0.5 * (coord.x + 1.0), 0.5 * (coord.y + 1.0))
                current_quad.append(coord)

            if current_quad:
                quads_data.append(current_quad)
                current_quad = []

    return quads_data

# Function to process all frames
def process_frames(scene, context):
    selected_object = context.active_object
    camera = scene.camera
    
    if selected_object and camera and context.region.type == 'WINDOW':
        quads_data = []

        # Assuming the selected object has quads
        for frame in range(scene.frame_start, scene.frame_end + 1):
            quad_vertices_2d = get_quad_vertices_2d(scene, selected_object, camera, frame, context)
            quads_data.append(quad_vertices_2d)

        # Print result to console as JSON
        pyperclip.copy(json.dumps(quads_data))

# Run the script
process_frames(bpy.context.scene, bpy.context)
