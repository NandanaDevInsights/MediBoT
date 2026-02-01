
import shutil
import os

images = {
    "C:/Users/NANDANA PRAMOD/.gemini/antigravity/brain/02362a49-e137-471d-a255-dea6ea21f11c/male_staff_1_1769931766696.png": "public/staff/anil.png",
    "C:/Users/NANDANA PRAMOD/.gemini/antigravity/brain/02362a49-e137-471d-a255-dea6ea21f11c/female_staff_1_1769931784162.png": "public/staff/sneha.png",
    "C:/Users/NANDANA PRAMOD/.gemini/antigravity/brain/02362a49-e137-471d-a255-dea6ea21f11c/male_staff_2_1769931800693.png": "public/staff/rahul_das.png",
    "C:/Users/NANDANA PRAMOD/.gemini/antigravity/brain/02362a49-e137-471d-a255-dea6ea21f11c/female_staff_2_1769931815882.png": "public/staff/priya.png",
    "C:/Users/NANDANA PRAMOD/.gemini/antigravity/brain/02362a49-e137-471d-a255-dea6ea21f11c/male_staff_3_1769931832006.png": "public/staff/vivek.png",
    "C:/Users/NANDANA PRAMOD/.gemini/antigravity/brain/02362a49-e137-471d-a255-dea6ea21f11c/sarah_headshot_1769931859290.png": "public/staff/sarah.png"
}

os.makedirs("public/staff", exist_ok=True)

for src, dst in images.items():
    if os.path.exists(src):
        shutil.copy(src, dst)
        print(f"Copied {src} to {dst}")
    else:
        print(f"Source not found: {src}")
