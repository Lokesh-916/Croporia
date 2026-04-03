import { useState } from 'react'
import { BookOpen, CalendarDays, Droplets, Bug, BarChart3, Lightbulb, ClipboardList, FlaskConical, ArrowLeft, CheckCircle, XCircle } from 'lucide-react'
import Navbar from '../components/Navbar'

const ICONS = { 'soil-fundamentals': BookOpen, 'crop-planning': CalendarDays, 'irrigation-water': Droplets, 'pest-disease': Bug, 'farming-economics': BarChart3 }

const COURSES = [
  {
    id: 'soil-fundamentals', title: 'Soil Fundamentals',
    description: 'Understand soil types, structure, pH, and how to improve soil health for consistently better yields season after season.',
    stages: [
      {
        id: 's1', title: 'Understanding Soil Structure',
        lessons: [
          {
            id: 'l1', title: 'The Three Layers of Soil',
            content: 'Soil is not just dirt. It is a living system with three distinct layers. The topsoil (0-30 cm) is the most fertile layer, packed with decomposed organic matter, microorganisms, and nutrients that plants directly absorb. Below it lies the subsoil (30-60 cm), which is denser, contains fewer nutrients, but stores significant water and minerals that deep-rooted crops can access during dry spells. The deepest layer is the parent material or bedrock, which slowly weathers over thousands of years to form the layers above. Healthy topsoil is dark brown or black, crumbles easily in your hand, and has an earthy smell. That smell is actually produced by bacteria called actinomycetes, a sign of a thriving soil ecosystem. Protecting topsoil from erosion is one of the most important things a farmer can do for long-term productivity.',
            intuition: 'Think of soil like a layered cake. The top layer (topsoil) is the icing - rich, sweet, and where all the action happens. The middle (subsoil) is the sponge cake - less exciting but holds moisture. The bottom is the hard base. Your crops mostly eat from the icing, but their roots reach into the sponge during drought.',
            keyTakeaways: ['Topsoil (0-30 cm) holds most nutrients and organic matter', 'Subsoil stores water and minerals for deep-rooted crops', 'Dark, crumbly topsoil with earthy smell = healthy soil', 'Protecting topsoil from erosion is critical for long-term farm productivity'],
            quiz: { questions: [
              { id: 'q1', question: 'Which soil layer is richest in organic matter and nutrients?', options: ['Subsoil', 'Topsoil', 'Parent material / Bedrock'], correct: 1, explanation: 'Topsoil contains decomposed plant and animal matter (humus), making it the most fertile and biologically active layer. Losing topsoil to erosion is one of the biggest threats to farm productivity.' },
              { id: 'q2', question: 'What does the earthy smell of healthy soil indicate?', options: ['Chemical fertilizer presence', 'Waterlogging', 'Active soil bacteria (actinomycetes)'], correct: 2, explanation: 'That distinctive earthy smell comes from actinomycetes bacteria producing a compound called geosmin. It is a reliable sign of a biologically active, healthy soil ecosystem.' },
              { id: 'q3', question: 'During a prolonged drought, which layer do deep-rooted crops rely on for water?', options: ['Topsoil', 'Subsoil', 'Both equally'], correct: 1, explanation: 'Subsoil retains moisture longer than topsoil. Deep-rooted crops like sugarcane, cotton, and fruit trees extend roots into the subsoil to access this stored water during dry periods.' }
            ]}
          },
          {
            id: 'l2', title: 'Soil Texture and the Triangle',
            content: 'Soil texture refers to the proportion of three particle sizes: sand (largest, 0.05-2 mm), silt (medium, 0.002-0.05 mm), and clay (smallest, below 0.002 mm). Sandy soils drain quickly and warm up fast but cannot hold nutrients well. Clay soils hold water and nutrients excellently but become waterlogged easily, crack when dry, and are hard to work. Silt soils are smooth and fertile but prone to compaction and erosion. The ideal agricultural soil is loam - roughly 40% sand, 40% silt, and 20% clay - which balances drainage, water retention, and nutrient holding. You can test your soil texture at home: take a handful of moist soil and squeeze it. Sandy soil falls apart immediately. Clay soil holds its shape and feels sticky. Loam holds shape briefly then crumbles.',
            intuition: 'Sand is like a colander - water runs straight through. Clay is like a sponge that never dries out. Loam is like a well-made sponge cake - it holds moisture but does not get soggy. Most Indian crops thrive in loamy or loamy-clay soils.',
            keyTakeaways: ['Sand = fast drainage, poor nutrient retention', 'Clay = slow drainage, excellent nutrient retention, prone to waterlogging', 'Loam = balanced, ideal for most crops', 'Squeeze test: sandy crumbles, clay sticks, loam holds then crumbles'],
            quiz: { questions: [
              { id: 'q1', question: 'Which soil type drains water the fastest?', options: ['Clay', 'Loam', 'Sandy'], correct: 2, explanation: 'Sandy soil has large particles with big gaps between them, allowing water to drain through very quickly. This is why sandy soils need more frequent irrigation and fertilization.' },
              { id: 'q2', question: 'What is the approximate composition of ideal loam soil?', options: ['80% sand, 10% silt, 10% clay', '40% sand, 40% silt, 20% clay', '20% sand, 20% silt, 60% clay'], correct: 1, explanation: 'Loam is roughly 40% sand, 40% silt, and 20% clay. This balance gives it good drainage, adequate water retention, and excellent nutrient-holding capacity - ideal for most crops.' }
            ]}
          }
        ]
      },
      {
        id: 's2', title: 'Soil pH and Nutrients',
        lessons: [
          {
            id: 'l3', title: 'Understanding Soil pH',
            content: 'Soil pH measures how acidic or alkaline your soil is on a scale of 0-14. A pH of 7 is neutral, below 7 is acidic, and above 7 is alkaline. Most crops grow best between pH 6.0 and 7.5. pH matters enormously because it controls nutrient availability. Even if nutrients are present in the soil, plants cannot absorb them if the pH is wrong. In highly acidic soils (pH below 5.5), aluminum and manganese become toxic to plants, and phosphorus gets locked up. In highly alkaline soils (pH above 8), iron, zinc, and manganese become unavailable. To raise pH (make less acidic), apply agricultural lime (calcium carbonate). To lower pH (make less alkaline), apply sulfur or acidic organic matter. Always test soil pH before applying fertilizers - you may be wasting money if the pH prevents absorption.',
            intuition: 'Think of pH like a lock on a safe. The nutrients are inside the safe (your soil), but if the pH is wrong, the lock will not open and plants cannot access the nutrients - even if you have added plenty of fertilizer. Getting pH right is like having the correct key.',
            keyTakeaways: ['Most crops prefer pH 6.0-7.5', 'Low pH locks up phosphorus and causes aluminum toxicity', 'High pH locks up iron, zinc, and manganese', 'Add lime to raise pH, add sulfur to lower pH', 'Always test pH before fertilizing'],
            quiz: { questions: [
              { id: 'q1', question: 'A farmer adds lots of fertilizer but sees no improvement. Soil pH is 5.0. What is likely happening?', options: ['The fertilizer is fake', 'Low pH is locking nutrients so plants cannot absorb them', 'The crop does not need fertilizer'], correct: 1, explanation: 'At pH 5.0, phosphorus becomes chemically bound to aluminum and iron, making it unavailable to plants. The farmer is wasting fertilizer. Applying lime to raise pH to 6.5 would unlock those nutrients.' },
              { id: 'q2', question: 'What should you add to raise soil pH?', options: ['Sulfur', 'Agricultural lime (calcium carbonate)', 'Urea'], correct: 1, explanation: 'Agricultural lime (calcium carbonate or CaCO3) neutralizes soil acidity and raises pH. It also adds calcium, which improves soil structure. Apply 3-6 months before planting for best results.' }
            ]}
          }
        ]
      }
    ]
  },
  {
    id: 'crop-planning', title: 'Crop Planning and Rotation',
    description: 'Plan your seasons strategically, choose the right crops for your soil and climate, and use rotation to maintain soil health and break pest cycles.',
    stages: [
      {
        id: 's1', title: 'Indian Cropping Seasons',
        lessons: [
          {
            id: 'l1', title: 'Kharif, Rabi, and Zaid Seasons',
            content: 'India has three main cropping seasons, each defined by monsoon patterns and temperature. Kharif (June-October) is the monsoon season - crops are sown at the onset of the southwest monsoon and harvested in autumn. Major kharif crops include rice, maize, cotton, groundnut, soybean, and jowar. These crops need warm temperatures and high rainfall. Rabi (November-April) is the winter season - crops are sown after the monsoon retreats and harvested in spring. Major rabi crops include wheat, mustard, chickpea, lentil, and barley. These crops need cool temperatures and moderate moisture. Zaid (March-June) is a short summer season between rabi and kharif, used for quick-maturing crops like watermelon, cucumber, muskmelon, and some vegetables. Understanding these seasons is fundamental to planning your farm calendar.',
            intuition: 'Think of the three seasons like three different restaurants. Kharif is the monsoon restaurant - it serves rice, cotton, and groundnut. Rabi is the winter restaurant - it serves wheat, mustard, and chickpea. Zaid is the fast-food counter - quick crops like watermelon and cucumber. You cannot order from the wrong restaurant and expect good results.',
            keyTakeaways: ['Kharif (Jun-Oct): Rice, Maize, Cotton, Groundnut, Soybean', 'Rabi (Nov-Apr): Wheat, Mustard, Chickpea, Lentil, Barley', 'Zaid (Mar-Jun): Watermelon, Cucumber, Muskmelon', 'Match crop to season for optimal yield and minimal input cost'],
            quiz: { questions: [
              { id: 'q1', question: 'A farmer in Punjab wants to grow wheat. Which season should he plant?', options: ['Kharif (June-October)', 'Rabi (November-April)', 'Zaid (March-June)'], correct: 1, explanation: 'Wheat is a classic rabi crop. It needs cool temperatures (15-20 degrees C) during vegetative growth and warm, dry conditions at harvest. Planting in kharif (monsoon) would cause fungal diseases and lodging.' },
              { id: 'q2', question: 'Which of these is a Kharif crop?', options: ['Mustard', 'Barley', 'Cotton'], correct: 2, explanation: 'Cotton is a kharif crop that needs warm temperatures (25-35 degrees C) and moderate rainfall. It is sown in May-June and harvested in October-December. Mustard and barley are rabi crops.' },
              { id: 'q3', question: 'What is the main advantage of the Zaid season?', options: ['Highest rainfall', 'Quick-maturing crops for extra income between main seasons', 'Best for wheat production'], correct: 1, explanation: 'Zaid allows farmers to grow short-duration crops (45-60 days) between the rabi harvest and kharif sowing, generating additional income from the same land without leaving it fallow.' }
            ]}
          },
          {
            id: 'l2', title: 'Crop Rotation - The Soil Renewal Strategy',
            content: 'Crop rotation means growing different crops on the same land in a planned sequence across seasons or years. It is one of the most powerful and cost-free tools available to farmers. Different crops have different nutrient needs and root depths. Rotating a heavy nitrogen feeder (like maize) with a nitrogen fixer (like groundnut or soybean) naturally replenishes soil nitrogen without expensive fertilizers. Legumes (pulses, groundnut) have root nodules containing Rhizobium bacteria that fix atmospheric nitrogen into the soil - essentially free fertilizer. Rotation also breaks pest and disease cycles. Many soil-borne pathogens and pests are crop-specific. If you grow the same crop repeatedly, pest populations build up. Rotating to a non-host crop starves those pests. A classic Indian rotation: Rice - Wheat - Groundnut - Wheat. Or: Cotton - Chickpea - Maize - Mustard.',
            intuition: 'Imagine eating only pizza every day for a year. Your body would become deficient in certain nutrients and you would get sick. Soil is the same - growing the same crop repeatedly depletes specific nutrients and builds up specific pests. Rotation is like giving your soil a balanced diet.',
            keyTakeaways: ['Legumes fix nitrogen - rotate them before heavy feeders', 'Rotation breaks soil-borne pest and disease cycles', 'Alternate deep-rooted and shallow-rooted crops', 'Classic rotation: cereal - legume - cereal - oilseed', 'Reduces fertilizer costs by 20-30% over time'],
            quiz: { questions: [
              { id: 'q1', question: 'Why should you rotate maize with groundnut?', options: ['Groundnut tastes better after maize', 'Groundnut fixes nitrogen that maize depleted', 'Maize and groundnut have the same pests'], correct: 1, explanation: 'Maize is a heavy nitrogen feeder. Groundnut (a legume) has Rhizobium bacteria in its root nodules that fix atmospheric nitrogen into the soil. Rotating them naturally replenishes nitrogen, reducing urea application by 30-40 kg per acre.' },
              { id: 'q2', question: 'A farmer has had severe root rot in his tomato crop for 3 consecutive years. What is the best solution?', options: ['Apply more fungicide', 'Rotate to a non-solanaceous crop for 2 years', 'Plant more tomatoes to build resistance'], correct: 1, explanation: 'Root rot pathogens like Fusarium and Phytophthora are soil-borne and crop-specific. They build up when the same crop is grown repeatedly. Rotating to cereals or legumes for 2 years starves the pathogen population.' }
            ]}
          }
        ]
      }
    ]
  },
  {
    id: 'irrigation-water', title: 'Irrigation and Water Management',
    description: 'Master efficient water use, understand when and how much to irrigate, and learn modern techniques that can cut water use by 40-60%.',
    stages: [
      {
        id: 's1', title: 'Water Movement and Crop Needs',
        lessons: [
          {
            id: 'l1', title: 'How Water Moves Through Soil',
            content: 'Water movement in soil is governed by two forces: gravity (pulling water downward) and capillary action (pulling water upward through tiny pores). When you irrigate, water first saturates the topsoil, then moves downward by gravity into the subsoil. As the topsoil dries, capillary action pulls moisture upward from deeper layers. The field capacity is the maximum amount of water soil can hold against gravity - this is the ideal moisture level for most crops. Below field capacity, plants start experiencing water stress. The permanent wilting point is when soil moisture is so low that plants cannot extract water and begin to wilt permanently. The goal of irrigation is to keep soil moisture between field capacity and the wilting point. Sandy soils reach field capacity quickly but also dry out fast, requiring frequent light irrigation. Clay soils take longer to reach field capacity but hold moisture much longer.',
            intuition: 'Think of soil like a towel. When you soak a towel and hold it up, some water drips out (that is gravity drainage). What remains is the field capacity - the water the towel holds. If you wring it hard, you can remove more water, but the towel still feels damp. That last bit of moisture that plants cannot extract is the wilting point. Your job as a farmer is to keep the towel between soaked and wrung-out.',
            keyTakeaways: ['Field capacity = maximum water soil holds after gravity drainage', 'Permanent wilting point = soil too dry for plants to extract water', 'Irrigate to maintain moisture between these two points', 'Sandy soils need frequent light irrigation', 'Clay soils need less frequent but deeper irrigation'],
            quiz: { questions: [
              { id: 'q1', question: 'What is field capacity in soil science?', options: ['The maximum area a field can be irrigated', 'The maximum water soil holds after gravity drainage', 'The amount of water a crop needs per day'], correct: 1, explanation: 'Field capacity is the moisture content remaining in soil after excess water has drained away by gravity, typically 1-3 days after irrigation. It represents the ideal moisture level for most crops.' },
              { id: 'q2', question: 'A farmer notices his plants wilting even though he irrigated 2 days ago. The soil feels dry. What happened?', options: ['The plants have a disease', 'Sandy soil drained the water too quickly', 'He irrigated too much'], correct: 1, explanation: 'Sandy soils have large pores that allow water to drain rapidly. In sandy soils, field capacity is reached and lost within hours. The farmer needs to irrigate more frequently with smaller amounts, or switch to drip irrigation.' }
            ]}
          }
        ]
      }
    ]
  },
  {
    id: 'pest-disease', title: 'Pest and Disease Management',
    description: 'Learn to identify pests and diseases early, understand Integrated Pest Management (IPM), and protect your crops with minimal chemical use.',
    stages: [
      {
        id: 's1', title: 'Early Detection and IPM',
        lessons: [
          {
            id: 'l1', title: 'Reading Your Crop - Signs of Trouble',
            content: 'Early detection is the single most important skill in pest and disease management. A problem caught at 5% crop damage is manageable; the same problem at 30% damage may be unrecoverable. Learn to read your crop like a doctor reads a patient. Yellowing leaves (chlorosis) can indicate nitrogen deficiency, iron deficiency, viral infection, or root damage from waterlogging. Chewed leaf margins suggest caterpillars or beetles. Tiny holes in leaves indicate flea beetles or shot-hole disease. Wilting despite adequate water suggests root rot, stem borers, or vascular disease. Sticky residue on leaves (honeydew) indicates sucking pests like aphids, whiteflies, or mealybugs. White powdery coating on leaves is powdery mildew fungus. Always check the undersides of leaves - most sucking pests hide there. Scout your field at least twice a week during the growing season, walking in a W or Z pattern to cover the entire field.',
            intuition: 'Your crop is constantly sending you messages - yellowing, wilting, spots, holes. Learning to read these messages is like learning a language. Once you understand what each symptom means, you can respond quickly and precisely instead of spraying everything and hoping for the best.',
            keyTakeaways: ['Scout fields twice weekly in a W or Z pattern', 'Check leaf undersides for sucking pests', 'Yellowing = nutrient deficiency OR disease OR waterlogging', 'Sticky honeydew = aphids, whiteflies, or mealybugs', 'Early detection at 5% damage is far easier to manage than 30%'],
            quiz: { questions: [
              { id: 'q1', question: 'You notice sticky residue on your chilli leaves and tiny insects underneath. What is most likely?', options: ['Fungal disease', 'Sucking pests (aphids or whiteflies)', 'Nitrogen deficiency'], correct: 1, explanation: 'Sticky honeydew is excreted by sucking pests like aphids, whiteflies, and mealybugs as they feed on plant sap. Check the undersides of leaves for clusters of tiny insects. Yellow sticky traps can help monitor and reduce populations.' },
              { id: 'q2', question: 'What is the recommended field scouting pattern for thorough coverage?', options: ['Walk only along the border', 'Walk in a W or Z pattern across the field', 'Check only the center of the field'], correct: 1, explanation: 'Walking in a W or Z pattern ensures you cover all parts of the field, including corners and edges where pests often enter first. Border rows are particularly important as they are the first point of pest entry.' },
              { id: 'q3', question: 'A plant is wilting despite being well-irrigated. What should you check first?', options: ['Increase irrigation immediately', 'Check roots for rot and stem for borers', 'Apply nitrogen fertilizer'], correct: 1, explanation: 'Wilting despite adequate water is a classic sign of root or stem damage. Root rot destroys the root system. Stem borers tunnel inside stems, cutting off water transport. Dig up a plant and examine the roots and stem base.' }
            ]}
          }
        ]
      }
    ]
  },
  {
    id: 'farming-economics', title: 'Farming Economics',
    description: 'Understand costs, calculate break-even prices, keep simple records, and make data-driven decisions that improve profitability every season.',
    stages: [
      {
        id: 's1', title: 'Understanding Farm Costs',
        lessons: [
          {
            id: 'l1', title: 'Fixed vs Variable Costs - Know Your Numbers',
            content: 'Every farming decision is ultimately a financial decision. Understanding your costs is the foundation of profitable farming. Fixed costs are expenses that remain constant regardless of how much you produce - land rent or EMI, depreciation on equipment (tractor, pump), irrigation infrastructure, and permanent labour. These costs exist even if your crop fails. Variable costs change with the scale of production - seeds, fertilizers, pesticides, casual labour, fuel for irrigation, and packaging. The more you grow, the higher your variable costs. Your total cost per acre = fixed costs per acre + variable costs per acre. To calculate your break-even price: divide total cost per acre by expected yield per acre. If your total cost is Rs. 25,000 per acre and expected yield is 20 quintals, your break-even price is Rs. 1,250 per quintal. Selling below this means a loss. Most farmers underestimate their costs because they forget to include family labour, land opportunity cost, and equipment depreciation.',
            intuition: 'Think of fixed costs as your monthly rent - you pay it whether you cook at home or eat out. Variable costs are your grocery bills - they go up when you cook more. A profitable farm is one where the selling price covers both the rent AND the groceries, with something left over.',
            keyTakeaways: ['Fixed costs: land rent, equipment depreciation, infrastructure', 'Variable costs: seeds, fertilizers, pesticides, casual labour', 'Break-even price = total cost per acre divided by yield per acre', 'Include family labour and land opportunity cost in calculations', 'Track costs every season to identify where to reduce spending'],
            quiz: { questions: [
              { id: 'q1', question: 'A farmer spends Rs. 30,000 per acre total and harvests 15 quintals. What is his break-even price per quintal?', options: ['Rs. 1,500', 'Rs. 2,000', 'Rs. 2,500'], correct: 1, explanation: 'Break-even price = Total cost divided by Yield = Rs. 30,000 divided by 15 quintals = Rs. 2,000 per quintal. The farmer must sell above Rs. 2,000 per quintal to make a profit.' },
              { id: 'q2', question: 'Which of these is a FIXED cost?', options: ['Pesticide spray for this season', 'Tractor EMI payment', 'Seeds purchased this season'], correct: 1, explanation: 'Tractor EMI is a fixed cost - you pay it every month regardless of whether you planted or not. Pesticides and seeds are variable costs that only occur when you are actively farming.' },
              { id: 'q3', question: 'Why do most farmers underestimate their true costs?', options: ['They are bad at math', 'They forget to include family labour and land opportunity cost', 'Variable costs are always zero'], correct: 1, explanation: 'Family labour has real economic value - if family members worked elsewhere, they would earn wages. Land has an opportunity cost - it could be rented out. Ignoring these makes profits look higher than they really are.' }
            ]}
          }
        ]
      }
    ]
  }
]


export default function Learn() {
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [selectedLesson, setSelectedLesson] = useState(null)
  const [answers, setAnswers] = useState({})

  if (selectedLesson && selectedCourse) {
    const course = COURSES.find(c => c.id === selectedCourse)
    return (
      <div className="bg-vanilla min-h-screen font-sans text-black-forest">
        <Navbar />
        <main className="max-w-3xl mx-auto px-6 py-8 pb-16">
          <button onClick={() => setSelectedLesson(null)} className="mb-6 text-forest hover:text-black-forest font-semibold text-sm flex items-center gap-2 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to {course.title}
          </button>
          <div className="bg-white rounded-2xl border border-olive/30 shadow-sm p-8">
            <h1 className="font-cinzel text-2xl font-bold text-black-forest mb-6">{selectedLesson.title}</h1>
            <p className="text-ash leading-relaxed text-[15px] mb-6">{selectedLesson.content}</p>
            <div className="bg-tea/40 rounded-2xl p-5 mb-6 border border-olive/20">
              <p className="text-xs font-bold text-forest mb-2 flex items-center gap-1.5"><Lightbulb className="w-3.5 h-3.5" /> Key Insight</p>
              <p className="text-sm text-black-forest leading-relaxed">{selectedLesson.intuition}</p>
            </div>
            <div className="bg-frosted rounded-2xl p-5 mb-6 border border-olive/20">
              <p className="text-xs font-bold text-ash mb-3 flex items-center gap-1.5"><ClipboardList className="w-3.5 h-3.5" /> Key Takeaways</p>
              <ul className="space-y-2">
                {selectedLesson.keyTakeaways.map((t, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-black-forest">
                    <span className="w-1.5 h-1.5 rounded-full bg-forest mt-2 shrink-0" />{t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="border border-olive/20 rounded-2xl p-5">
              <p className="text-xs font-bold text-copper mb-4 flex items-center gap-1.5"><FlaskConical className="w-3.5 h-3.5" /> Test Your Understanding</p>
              <div className="space-y-6">
                {selectedLesson.quiz.questions.map((q, qi) => {
                  const key = selectedLesson.id + '-' + q.id
                  const chosen = answers[key]
                  return (
                    <div key={q.id}>
                      <p className="text-sm font-semibold text-black-forest mb-3">Q{qi + 1}. {q.question}</p>
                      <div className="space-y-2">
                        {q.options.map((opt, idx) => {
                          const isChosen = chosen === idx
                          const isCorrect = idx === q.correct
                          let cls = 'w-full text-left px-4 py-3 rounded-xl border text-sm transition-colors flex items-center gap-3 '
                          if (chosen === undefined) cls += 'border-olive/30 hover:bg-frosted hover:border-palm'
                          else if (isCorrect) cls += 'border-forest bg-frosted text-forest font-semibold'
                          else if (isChosen) cls += 'border-red-300 bg-red-50 text-red-700'
                          else cls += 'border-olive/20 text-ash'
                          return (
                            <button key={idx} onClick={() => { if (chosen === undefined) setAnswers(a => ({ ...a, [key]: idx })) }} className={cls}>
                              {chosen !== undefined && isCorrect && <CheckCircle className="w-4 h-4 shrink-0" />}
                              {chosen !== undefined && isChosen && !isCorrect && <XCircle className="w-4 h-4 shrink-0" />}
                              {(chosen === undefined || (!isCorrect && !isChosen)) && <span className="w-4 h-4 rounded-full border border-current shrink-0 flex items-center justify-center text-[10px] font-bold">{String.fromCharCode(65 + idx)}</span>}
                              {opt}
                            </button>
                          )
                        })}
                      </div>
                      {chosen !== undefined && (
                        <div className={`mt-3 p-3 rounded-xl text-xs leading-relaxed ${chosen === q.correct ? 'bg-frosted text-forest border border-olive/20' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                          <span className="font-bold">{chosen === q.correct ? 'Correct! ' : 'Not quite. '}</span>{q.explanation}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (selectedCourse) {
    const course = COURSES.find(c => c.id === selectedCourse)
    const Icon = ICONS[course.id] || BookOpen
    return (
      <div className="bg-vanilla min-h-screen font-sans text-black-forest">
        <Navbar />
        <main className="max-w-3xl mx-auto px-6 py-8 pb-16">
          <button onClick={() => setSelectedCourse(null)} className="mb-6 text-forest hover:text-black-forest font-semibold text-sm flex items-center gap-2 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Courses
          </button>
          <div className="bg-white rounded-2xl border border-olive/30 shadow-sm p-6 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-frosted border border-olive/30 flex items-center justify-center"><Icon className="w-6 h-6 text-forest" /></div>
              <div><h1 className="font-cinzel text-2xl font-bold text-black-forest">{course.title}</h1><p className="text-ash text-sm mt-1">{course.description}</p></div>
            </div>
          </div>
          {course.stages.map((stage, si) => (
            <div key={stage.id} className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-7 h-7 rounded-full bg-forest text-white flex items-center justify-center text-xs font-bold">{si + 1}</div>
                <h2 className="font-cinzel font-bold text-black-forest">{stage.title}</h2>
              </div>
              <div className="space-y-3 pl-10">
                {stage.lessons.map(lesson => (
                  <button key={lesson.id} onClick={() => setSelectedLesson(lesson)}
                    className="w-full text-left bg-white rounded-xl border border-olive/30 px-5 py-4 hover:border-palm hover:shadow-sm transition-all group">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-black-forest group-hover:text-forest transition-colors">{lesson.title}</p>
                        <p className="text-xs text-ash mt-0.5">{lesson.quiz.questions.length} quiz questions</p>
                      </div>
                      <span className="text-forest text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">Start</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </main>
      </div>
    )
  }

  return (
    <div className="bg-vanilla min-h-screen font-sans text-black-forest">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-8 pb-16">
        <header className="mb-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-forest/80 mb-2">Croporia - Smart Learning</p>
          <h1 className="font-cinzel text-3xl font-black text-black-forest tracking-tight mb-2">Interactive Farming Lessons</h1>
          <p className="text-sm text-ash max-w-xl">Deep-dive courses with real explanations, practical insights, and quizzes that actually test your understanding.</p>
        </header>
        <div className="grid gap-6 sm:grid-cols-2">
          {COURSES.map(course => {
            const Icon = ICONS[course.id] || BookOpen
            const totalLessons = course.stages.reduce((a, s) => a + s.lessons.length, 0)
            const totalQ = course.stages.reduce((a, s) => a + s.lessons.reduce((b, l) => b + l.quiz.questions.length, 0), 0)
            return (
              <div key={course.id} onClick={() => setSelectedCourse(course.id)}
                className="group cursor-pointer rounded-2xl border border-olive/30 bg-white p-6 shadow-sm hover:shadow-md hover:border-palm transition-all duration-300 hover:-translate-y-0.5">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-frosted border border-olive/30 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5 text-forest" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-cinzel font-bold text-black-forest group-hover:text-forest transition-colors">{course.title}</h3>
                    <p className="text-sm text-ash mt-1 line-clamp-2">{course.description}</p>
                    <div className="flex items-center gap-3 mt-3">
                      <span className="text-[11px] font-semibold text-ash bg-frosted px-2.5 py-1 rounded-full border border-olive/20">{totalLessons} lessons</span>
                      <span className="text-[11px] font-semibold text-ash bg-frosted px-2.5 py-1 rounded-full border border-olive/20">{totalQ} questions</span>
                    </div>
                    <span className="inline-flex items-center gap-1 mt-3 text-sm font-semibold text-forest">Start Learning</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}
