import os
from PIL import Image
import sys

source_image_path = "/Users/sakanet/.gemini/antigravity/brain/c27270e7-cbb0-4303-b3e3-972aa01ba36f/simple_flask_icon_1764757320097.png"
public_dir = "/Users/sakanet/science_lab/public"

if not os.path.exists(source_image_path):
    print(f"Error: Source image not found at {source_image_path}")
    sys.exit(1)

try:
    img = Image.open(source_image_path)
    
    # pwa-192x192.png
    img.resize((192, 192), Image.Resampling.LANCZOS).save(os.path.join(public_dir, "pwa-192x192.png"))
    print("Created pwa-192x192.png")
    
    # pwa-512x512.png
    img.resize((512, 512), Image.Resampling.LANCZOS).save(os.path.join(public_dir, "pwa-512x512.png"))
    print("Created pwa-512x512.png")
    
    # apple-touch-icon.png (180x180)
    img.resize((180, 180), Image.Resampling.LANCZOS).save(os.path.join(public_dir, "apple-touch-icon.png"))
    print("Created apple-touch-icon.png")

    # favicon.ico (64x64)
    img.resize((64, 64), Image.Resampling.LANCZOS).save(os.path.join(public_dir, "favicon.ico"))
    print("Created favicon.ico")

except Exception as e:
    print(f"Error processing image: {e}")
    sys.exit(1)
