from PIL import Image
import numpy as np

img = Image.open('public/assets/hope-logo.png').convert('RGBA')
data = np.array(img)

r, g, b, a = data[:,:,0], data[:,:,1], data[:,:,2], data[:,:,3]

# Remove near-black pixels: R<40, G<40, B<40
black_mask = (r < 55) & (g < 55) & (b < 55)

# Make them transparent
data[:,:,3] = np.where(black_mask, 0, a)

# Also soft-edge near-black (40-90 range) for anti-alias smoothness
near_black = (r < 90) & (g < 90) & (b < 90) & ~black_mask
darkness = np.maximum(np.maximum(r, g), b).astype(float)
# alpha ramp from 0 at 40 to full at 90
alpha_scale = np.clip((darkness - 40) / 50.0, 0, 1)
data[:,:,3] = np.where(near_black, (a * alpha_scale).astype(np.uint8), data[:,:,3])

result = Image.fromarray(data)
result.save('public/assets/hope-logo.png', 'PNG')
print('Done! Logo saved with transparent background.')
