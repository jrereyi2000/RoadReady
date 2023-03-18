import os

directory = 'images'  # change this to the directory where your images are located
image_files = [f for f in os.listdir(directory) if os.path.isfile(os.path.join(directory, f))]

js_file_str = 'const images = {\n'
for image_file in image_files:
    if image_file.endswith('.png') or image_file.endswith('.jpg') or image_file.endswith('.jpeg'):
        image_name = os.path.splitext(image_file)[0]
        if '@' not in image_name:
            js_file_str += f'  {image_name}: require(\'./images/{image_file}\'),\n'

js_file_str += '};\n\n'
js_file_str += 'export default images;\n'

print(js_file_str)
with open("images.js", 'w') as file:
    file.write(js_file_str)