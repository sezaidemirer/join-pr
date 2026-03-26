#!/usr/bin/env python3
"""
PDF'den AJET Challenge katılımcı görsellerini çıkarır.
Kullanım: pip install pymupdf && python scripts/extract-ajet-pdf-images.py

PDF yolunu güncelleyin veya argüman olarak verin:
  python scripts/extract-ajet-pdf-images.py /path/to/analytics-dashboard-report.pdf
"""

import os
import sys

try:
    import fitz  # PyMuPDF
except ImportError:
    print("PyMuPDF yükleyin: pip install pymupdf")
    sys.exit(1)

# Katılımcı sırası (PDF sayfa 2-3'teki sıraya göre)
CREATORS = [
    "anil-altan",
    "dilara-ozkan",
    "seyma-busra-gozdamga",
    "onurcan-cam",
    "gizem-yuksel",
]

def main():
    pdf_path = sys.argv[1] if len(sys.argv) > 1 else os.path.expanduser("~/Downloads/analytics-dashboard-report.pdf")
    output_dir = os.path.join(os.path.dirname(__file__), "..", "public", "ajet-influencers")

    if not os.path.exists(pdf_path):
        print(f"PDF bulunamadı: {pdf_path}")
        sys.exit(1)

    os.makedirs(output_dir, exist_ok=True)

    doc = fitz.open(pdf_path)
    extracted = []

    for page_num in range(len(doc)):
        page = doc[page_num]
        img_list = page.get_images()
        for img_index, img in enumerate(img_list):
            xref = img[0]
            base_image = doc.extract_image(xref)
            w, h = base_image["width"], base_image["height"]
            # Profil fotoğrafı boyutları genelde 100-500px arası
            if 80 < w < 800 and 80 < h < 800:
                image_bytes = base_image["image"]
                image_ext = base_image["ext"]
                if len(extracted) < len(CREATORS):
                    slug = CREATORS[len(extracted)]
                    filename = os.path.join(output_dir, f"{slug}.{image_ext}")
                    with open(filename, "wb") as f:
                        f.write(image_bytes)
                    extracted.append((slug, filename, w, h))
                    print(f"Kaydedildi: {slug}.{image_ext} ({w}x{h})")

    doc.close()
    print(f"\nToplam {len(extracted)} görsel çıkarıldı: {output_dir}")

if __name__ == "__main__":
    main()
