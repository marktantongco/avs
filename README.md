# AVS — AI Visual Synthesis

> **Build perfect prompts. No blank inputs. Every tap produces output.**

A brutalist prompt builder for AI image and video generation tools. Designed for creators who want professional-quality prompts without the guesswork.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=flat-square&logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| **🎯 Smart Prompt Builder** | Tap-to-build interface with real-time preview |
| **⚡ 12 AI Tools** | Midjourney, FLUX, DALL·E 3, SDXL, Ideogram, and more |
| **🎨 Brutalist Design** | Bold yellow (#FFE500) and black (#0A0A0A) aesthetic |
| **📱 Mobile-First** | Touch-optimized with smooth GSAP animations |
| **📚 Learning Path** | 12 progressive lessons in prompt engineering |
| **🔧 Physics Layer** | Kelvin color temperature, cinema cameras, professional lenses |
| **💾 Save & Export** | Store prompts locally, copy with one tap |

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/marktantongco/avs.git

# Install dependencies
bun install

# Run development server
bun run dev

# Build for production
bun run build
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

---

## 📱 Screens

### Home
- Quick-start templates for Photo, Portrait, Cinematic, and Video
- Saved prompts library
- Last output preview

### Build
- Real-time prompt preview with strength meter
- Target tool selector (12 AI tools)
- Parameter chips: Subject, Style, Lighting, Camera, Color Grade, Mood, Aspect Ratio
- Physics Layer: Kelvin temperature slider, Camera Body, Lens selection

### Compare
- Side-by-side tool comparison
- Filter by: All, Free, Image, Video
- Quality scores, difficulty ratings, syntax guides

### Learn
- 12-lesson progressive curriculum
- Foundation → Creative → Technical → Advanced
- Locked/unlocked progression system
- Add examples directly to your prompt

### Generate
- Final output display
- Batch generation by axis (mood, style, lighting, tool)
- One-tap copy and save

---

## 🛠 Supported AI Tools

| Tool | Type | Free | Best For |
|------|------|:----:|----------|
| **DALL·E 3** | Image | ✅ | Beginners, marketing |
| **Midjourney** | Image | ❌ | Creative professionals |
| **FLUX.1** | Image | ❌ | Photorealism |
| **SDXL** | Image | ✅ | Developers, pipelines |
| **Ideogram** | Image | ✅ | Text-in-image, design |
| **SeedDream** | Image | ✅ | Anime, illustrations |
| **Grok** | Image | ✅ | Quick generation |
| **Gemini** | Image | ✅ | Spatial compositions |
| **ChatGPT** | Image | ✅ | Iteration, beginners |
| **Meta AI** | Image | ✅ | Social media content |
| **Qwen** | Image | ✅ | Multilingual, product |
| **Wan Video** | Video | ❌ | Short video clips |

---

## 🧠 Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 4 + shadcn/ui |
| **State** | Zustand with localStorage persistence |
| **Animations** | GSAP (ScrollTrigger, Observer) |
| **Fonts** | Barlow, Barlow Condensed, Space Mono |

---

## 📁 Project Structure

```
avs/
├── src/
│   ├── app/
│   │   ├── page.tsx          # Main application
│   │   ├── layout.tsx        # Root layout
│   │   └── globals.css       # Global styles & animations
│   ├── components/ui/        # shadcn/ui components
│   └── store/
│       └── avs-store.ts      # Zustand store & formatters
├── public/                   # Static assets
├── package.json
└── README.md
```

---

## 🎨 Design System

### Colors
| Name | Hex | Usage |
|------|-----|-------|
| Yellow | `#FFE500` | Primary accent, highlights |
| Black | `#0A0A0A` | Background, text |
| Green | `#00FF88` | Success, completed |
| Red | `#FF2222` | Paid, alerts |

### Typography
- **Headlines**: Barlow Condensed (Bold/Black)
- **Body**: Barlow (Regular/Medium)
- **Code/Data**: Space Mono

---

## 📖 Learning Path

The app includes a 12-lesson curriculum:

1. **Foundation** (Lessons 1-2)
   - What is a prompt?
   - Describing your subject

2. **Creative** (Lessons 3-4)
   - Choosing a visual style
   - Lighting fundamentals

3. **Technical** (Lessons 5-8)
   - Camera basics
   - Color grading
   - Mood & atmosphere
   - Negative prompts

4. **Advanced** (Lessons 9-12)
   - Midjourney syntax
   - FLUX.1 prompting
   - SDXL weights
   - Your first full prompt

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) - Beautiful component library
- [GSAP](https://greensock.com/gsap/) - Professional-grade animations
- [Lucide](https://lucide.dev/) - Beautiful icons

---

<p align="center">
  <strong>AVS — AI Visual Synthesis</strong><br>
  <sub>Build prompts. Create art. No guesswork.</sub>
</p>
