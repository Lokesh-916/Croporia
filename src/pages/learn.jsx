import { useState } from 'react'
import { BookOpen, CalendarDays, Droplets, Bug, BarChart3, Lightbulb, ClipboardList, FlaskConical, ArrowLeft } from 'lucide-react'
import Navbar from '../components/Navbar'

const ICONS = { 'soil-fundamentals': BookOpen, 'crop-planning': CalendarDays, 'irrigation-water': Droplets, 'pest-disease': Bug, 'farming-economics': BarChart3 }

const COURSES = [
  { id: 'soil-fundamentals', title: 'Soil Fundamentals', description: 'Understand soil types, structure, and how to improve soil health for better yields.', stages: [{ id: 's1', title: 'What is Soil?', lessons: [{ id: 'l1', title: 'Soil Layers Explained', content: 'Soil has distinct layers: topsoil (rich in organic matter), subsoil (minerals), and bedrock. Healthy topsoil is dark and crumbly.', intuition: 'Think of soil like a layered cake - the top layer is what feeds your crops.', keyTakeaways: ['Topsoil holds most nutrients', 'Subsoil stores water', 'Bedrock is parent material'], quiz: { questions: [{ id: 'q1', question: 'Which layer is richest in organic matter?', options: ['Topsoil', 'Subsoil', 'Bedrock'], correct: 0, explanation: 'Topsoil contains decomposed plant and animal matter, making it the most fertile layer.' }] } }] }] },
  { id: 'crop-planning', title: 'Crop Planning', description: 'Plan seasons, choose crops, and rotate for sustainable production.', stages: [{ id: 's1', title: 'Season Basics', lessons: [{ id: 'l1', title: 'Kharif vs Rabi', content: 'Kharif crops are sown with monsoon (e.g. rice, maize). Rabi crops are winter crops (e.g. wheat, mustard).', intuition: 'Match your crop to the season - water and temperature matter.', keyTakeaways: ['Kharif = monsoon season', 'Rabi = winter season', 'Plan according to rainfall'], quiz: { questions: [{ id: 'q1', question: 'When are Rabi crops typically sown?', options: ['Monsoon', 'Winter', 'Summer'], correct: 1, explanation: 'Rabi crops are winter-season crops, sown after monsoon and harvested in spring.' }] } }] }] },
  { id: 'irrigation-water', title: 'Irrigation & Water Management', description: 'Efficient water use, drip and sprinkler basics, and when to irrigate.', stages: [{ id: 's1', title: 'Water Basics', lessons: [{ id: 'l1', title: 'How Water Moves in Soil', content: 'Water moves downward by gravity and upward by capillary action. Roots absorb water from the root zone.', intuition: 'Water follows the path of least resistance - design irrigation to match root depth.', keyTakeaways: ['Gravity pulls water down', 'Capillary action moves water up', 'Root zone is key'], quiz: { questions: [{ id: 'q1', question: 'What pulls water downward in soil?', options: ['Capillary action', 'Gravity', 'Roots only'], correct: 1, explanation: 'Gravity is the main force moving water downward through soil pores.' }] } }] }] },
  { id: 'pest-disease', title: 'Pest & Disease Awareness', description: 'Identify common pests and diseases and learn preventive practices.', stages: [{ id: 's1', title: 'Recognition', lessons: [{ id: 'l1', title: 'Signs of Pest Damage', content: 'Chewed leaves, holes, yellowing, and stunted growth can indicate pests. Early detection helps control spread.', intuition: 'Catch problems early - small damage is easier to manage than an outbreak.', keyTakeaways: ['Look for chewed leaves', 'Yellowing can mean pests', 'Check undersides of leaves'], quiz: { questions: [{ id: 'q1', question: 'Where should you often check for pests?', options: ['Only on top of leaves', 'Undersides of leaves', 'Only roots'], correct: 1, explanation: 'Many pests hide or lay eggs on the undersides of leaves.' }] } }] }] },
  { id: 'farming-economics', title: 'Farming Economics', description: 'Costs, pricing, and simple record-keeping for better decisions.', stages: [{ id: 's1', title: 'Costs & Returns', lessons: [{ id: 'l1', title: 'Fixed vs Variable Costs', content: "Fixed costs (land, equipment) don't change with output. Variable costs (seeds, labour) do. Both matter for profit.", intuition: 'Know your costs before you plant - then you know what price you need.', keyTakeaways: ['Fixed = same every season', 'Variable = depends on area/crop', 'Record both'], quiz: { questions: [{ id: 'q1', question: 'Which cost changes with how much you grow?', options: ['Land rent', 'Variable cost', 'Equipment'], correct: 1, explanation: 'Variable costs like seeds, fertilizer, and labour increase when you grow more.' }] } }] }] },
]

export default function Learn() {
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [answers, setAnswers] = useState({})

  if (selectedCourse) {
    const course = COURSES.find(c => c.id === selectedCourse)
    const Icon = ICONS[course.id] || BookOpen
    return (
      <div className="bg-vanilla min-h-screen font-sans text-black-forest">
        <Navbar />
        <main className="max-w-5xl mx-auto px-6 py-8 pb-16">
          <button onClick={() => setSelectedCourse(null)} className="mb-6 text-forest hover:text-black-forest font-semibold text-sm flex items-center gap-2 transition-colors"><ArrowLeft className="w-4 h-4" /> Back to Courses</button>
          <div className="bg-white rounded-2xl border border-olive/30 shadow-sm p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-xl bg-frosted border border-olive/30 flex items-center justify-center"><Icon className="w-7 h-7 text-forest" /></div>
              <div><h1 className="font-cinzel text-2xl font-bold text-black-forest">{course.title}</h1><p className="text-ash text-sm">{course.description}</p></div>
            </div>
            <div className="space-y-6">
              {course.stages.map(stage => (
                <div key={stage.id} className="border-l-4 border-olive/40 pl-6">
                  <h3 className="font-cinzel text-lg font-bold text-black-forest mb-4">{stage.title}</h3>
                  <div className="space-y-4">
                    {stage.lessons.map(lesson => (
                      <div key={lesson.id} className="bg-frosted/40 rounded-xl p-4 border border-olive/20">
                        <h4 className="font-semibold text-black-forest mb-2">{lesson.title}</h4>
                        <p className="text-sm text-ash mb-3">{lesson.content}</p>
                        <div className="bg-tea/50 rounded-lg p-3 mb-3 border border-olive/20">
                          <p className="text-xs font-bold text-forest mb-1 flex items-center gap-1.5"><Lightbulb className="w-3 h-3" /> Key Insight</p>
                          <p className="text-sm text-black-forest">{lesson.intuition}</p>
                        </div>
                        <div className="bg-vanilla rounded-lg p-3 mb-3 border border-cream">
                          <p className="text-xs font-bold text-ash mb-1 flex items-center gap-1.5"><ClipboardList className="w-3 h-3" /> Key Takeaways</p>
                          <ul className="text-sm text-black-forest space-y-1">{lesson.keyTakeaways.map((t,i) => <li key={i} className="flex items-start gap-1.5"><span className="w-1 h-1 rounded-full bg-forest mt-2 shrink-0" />{t}</li>)}</ul>
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-olive/20">
                          <p className="text-xs font-bold text-copper mb-2 flex items-center gap-1.5"><FlaskConical className="w-3 h-3" /> Quick Quiz</p>
                          {lesson.quiz.questions.map(q => {
                            const key = `${lesson.id}-${q.id}`
                            const chosen = answers[key]
                            return (
                              <div key={q.id} className="mb-3">
                                <p className="text-sm font-medium text-black-forest mb-2">{q.question}</p>
                                <div className="space-y-2">
                                  {q.options.map((opt, idx) => {
                                    const isChosen = chosen === idx; const isCorrect = idx === q.correct
                                    return (
                                      <button key={idx} onClick={() => setAnswers(a => ({ ...a, [key]: idx }))}
                                        className={`w-full text-left px-3 py-2 rounded-lg border text-sm transition-colors ${chosen === undefined ? 'border-olive/30 hover:bg-frosted' : isCorrect ? 'border-forest bg-frosted text-forest font-semibold' : isChosen ? 'border-red-300 bg-red-50 text-red-700' : 'border-olive/20 text-ash'}`}>
                                        {opt}
                                      </button>
                                    )
                                  })}
                                </div>
                                {chosen !== undefined && <p className="text-xs text-ash mt-2 italic">{q.explanation}</p>}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="bg-vanilla min-h-screen font-sans text-black-forest">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-8 pb-16">
        <header className="mb-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-forest/80 mb-2">Croporia - Smart learning</p>
          <h1 className="font-cinzel text-3xl font-black text-black-forest tracking-tight mb-2">Interactive Farming Lessons</h1>
          <p className="text-sm text-ash max-w-xl">Learn farming concepts at your own pace with interactive lessons, quizzes, and practical insights.</p>
        </header>
        <div className="grid gap-6 sm:grid-cols-2">
          {COURSES.map(course => {
            const Icon = ICONS[course.id] || BookOpen
            return (
              <div key={course.id} onClick={() => setSelectedCourse(course.id)} className="group cursor-pointer rounded-2xl border border-olive/30 bg-white p-5 shadow-sm hover:shadow-md hover:border-palm transition-all duration-300 hover:-translate-y-0.5">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-frosted border border-olive/30 flex items-center justify-center group-hover:scale-105 transition-transform"><Icon className="w-5 h-5 text-forest" /></div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-cinzel font-bold text-black-forest group-hover:text-forest transition-colors">{course.title}</h3>
                    <p className="text-sm text-ash mt-1 line-clamp-2">{course.description}</p>
                    <span className="inline-flex items-center gap-1 mt-3 text-sm font-semibold text-forest">Start Learning</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        <div className="mt-8 bg-frosted rounded-2xl border border-olive/30 p-6">
          <h3 className="font-cinzel text-lg font-bold text-black-forest mb-3">How to Use Smart Learning</h3>
          <div className="grid gap-4 md:grid-cols-3 text-sm text-ash">
            <div className="flex items-start gap-2"><BookOpen className="w-4 h-4 text-forest mt-0.5 shrink-0" /><div><p className="font-semibold text-black-forest mb-1">Browse Courses</p><p>Choose from soil management, crop planning, irrigation, and more.</p></div></div>
            <div className="flex items-start gap-2"><Lightbulb className="w-4 h-4 text-forest mt-0.5 shrink-0" /><div><p className="font-semibold text-black-forest mb-1">Learn at Your Pace</p><p>Each lesson includes key insights and practical takeaways.</p></div></div>
            <div className="flex items-start gap-2"><FlaskConical className="w-4 h-4 text-forest mt-0.5 shrink-0" /><div><p className="font-semibold text-black-forest mb-1">Test Your Knowledge</p><p>Quick quizzes help reinforce what you have learned.</p></div></div>
          </div>
        </div>
      </main>
    </div>
  )
}
