# Strategi Upscale Gambar Produk (Studio Photoshoot)

Karena adanya limitasi kuota (rate limit) pada API *AI Image Generation* (Gemini/Imagen), proses upscale gambar dan transformasi gaya visual ke arah "Professional Studio Photoshoot" terpaksa ditunda secara otomatis.

Namun, agar tim PT Printwork (atau AI di sesi berikutnya) bisa langsung menghasilkan gambar yang konsisten dan berkelas premium, berikut adalah parameter dan *prompt* yang harus digunakan untuk mengolah setiap gambar produk yang ada di `public/images/`:

## 1. Kaidah Visual (Visual Guidelines)
- **Background**: `Clean minimalist white or very light gray (#F8F9FA)`. Jangan menggunakan background yang ramai.
- **Lighting**: `Soft cinematic studio lighting, soft box diffusion, subtle drop shadows`. Menegaskan kualitas material.
- **Focus & Resolution**: `Sharp details on texture, 8k resolution, macro-level clarity on paper fibers/laminations`.
- **Mood**: `Professional, formal, premium, trustworthy, clean, hygienic (food grade)`.

## 2. Master Prompts per Kategori Produk

### A. Kategori "Eco-Kraft" (Warna Coklat / Natural)
**Base Prompt:**
> "A high-end, professional studio photoshoot of a premium Eco-Kraft paper packaging [NAMA_PRODUK, misal: Lunch Box/Food Pail]. Minimalist clean white background, soft cinematic studio lighting, sharp focus on the raw kraft paper texture, professional food packaging photography, sustainable and hygienic aesthetic, 8k resolution, highly detailed."

### B. Kategori "Food Grade" (Warna Putih Bersih)
**Base Prompt:**
> "A professional studio photoshoot of a clean, premium white food-grade paper packaging [NAMA_PRODUK, misal: Dus Ayam Geprek]. Elegant soft box lighting, minimalist bright setting, sharp details on the glossy/laminated finish, high resolution, soft realistic shadows, premium and hygienic look, 8k."

### C. Kategori Khusus (Desain Full Cetak / Custom Pola)
**Base Prompt:**
> "A professional commercial product photography of a custom printed packaging box. Clean neutral background, perfect studio lighting highlighting the vivid print colors and typography, sharp focus, 8k resolution, high-end commercial packaging standard."

---

## 3. Langkah Selanjutnya (Bisa dipilih)
1. **Manual Upscale:** Anda bisa menggunakan software seperti *Topaz Gigapixel AI* atau *Magnific AI* lalu timpa (replace) file gambar di `public/images/`.
2. **AI Text-to-Image / Image-to-Image:** Gunakan *Midjourney* (v6) dengan menyertakan screenshot gambar produk saat ini sebagai referensi (`/blend` atau image prompt) ditambah *Master Prompt* di atas.
3. **Minta AI lagi nanti:** Anda dapat dengan mudah meminta layanan AI asisten ini untuk me-regenerate gambar di atas ketika kuotanya sudah kembali reset (sekitar seminggu lagi).
