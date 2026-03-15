# Croporia Smart Learning

Standalone farming education module — static content from JSON, ready for future AI integration.

## Theme

- **Primary green:** `#2E7D32`
- **Leaf green:** `#66BB6A`
- **Soil brown:** `#6D4C41`
- **Light soil background:** `#F5F1E6`
- **Harvest yellow accent:** `#FBC02D`

## Run locally

```bash
cd smart-learning
npm install
npm run dev
```

Then open **http://localhost:5173**.

## Build

```bash
npm run build
npm run preview   # preview production build
```

## Structure

- **Dashboard** (`/`) — Grid of course cards with progress and “Continue”
- **Course** (`/course/:courseId`) — Vertical timeline of stages and lessons
- **Lesson** (`/course/:courseId/lesson/:lessonId`) — Sections, diagram placeholder, intuition box, takeaways, “Start Quiz”
- **Quiz** (`/course/:courseId/lesson/:lessonId/quiz`) — Multiple choice, immediate feedback, explanation, score summary

Course data: `src/data/courses.json` (courses → stages → lessons → content, diagram, quiz).
