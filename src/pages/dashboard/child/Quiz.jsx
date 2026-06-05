import React from 'react'
import { useParams } from 'react-router-dom'
import QuizRunner from './components/QuizRunner'
import { 
  BANGLA_SHOROBORNO, 
  BANGLA_BENJONBORNO, 
  ENGLISH_UPPERCASE,
  ENGLISH_LOWERCASE,
  ENGLISH_WORDS,
  MATH_BANGLA,
  MATH_ENGLISH,
  SHAPES
} from './data/learningData'

export default function Quiz({ playClick, addCoins, speak }) {
  const { subject, mode } = useParams()
  
  let items = []
  let title = "Test"
  let isHardMode = false

  // Helper to map type onto items
  const withType = (arr, type) => arr.map(i => ({ ...i, itemType: type }))

  if (subject === 'bangla') {
    const swar = withType(BANGLA_SHOROBORNO, 'letter')
    const byanjon = withType(BANGLA_BENJONBORNO, 'letter')
    
    if (mode === 'shoroborno') { items = swar; title = "স্বরবর্ণ পরীক্ষা" }
    else if (mode === 'benjonborno') { items = byanjon; title = "ব্যঞ্জনবর্ণ পরীক্ষা" }
    else if (mode === 'medium-mixed') { items = [...swar, ...byanjon]; title = "বাংলা পরীক্ষা — মধ্যম" }
    else if (mode === 'hard') { items = [...swar, ...byanjon]; title = "বাংলা পরীক্ষা — কঠিন"; isHardMode = true }
  } else if (subject === 'english') {
    const upper = withType(ENGLISH_UPPERCASE, 'letter')
    const lower = withType(ENGLISH_LOWERCASE, 'letter')
    const words = withType(ENGLISH_WORDS, 'word')
    
    if (mode === 'uppercase') { items = upper; title = "Uppercase Letters Test" }
    else if (mode === 'lowercase') { items = lower; title = "Lowercase Letters Test" }
    else if (mode === 'words') { items = words; title = "Word Making Test" }
    else if (mode === 'medium-mixed') { items = [...upper, ...lower, ...words]; title = "English Test (Medium)" }
    else if (mode === 'hard') { items = [...upper, ...lower, ...words]; title = "English Test (Hard)"; isHardMode = true }
  } else if (subject === 'math') {
    const bnNums = withType(MATH_BANGLA, 'number')
    const enNums = withType(MATH_ENGLISH, 'number')
    
    if (mode === 'bangla-numbers') { items = bnNums; title = "সংখ্যা পরীক্ষা (১-১০০)" }
    else if (mode === 'english-numbers') { items = enNums; title = "Numbers Test (1-100)" }
    else if (mode === 'medium-mixed') { items = [...bnNums, ...enNums]; title = "Math Test (Medium)" }
    else if (mode === 'hard') { items = [...bnNums, ...enNums]; title = "Math Test (Hard)"; isHardMode = true }
  } else if (subject === 'shape') {
    const s = withType(SHAPES.filter(i => !i.display.includes('Color')), 'shape')
    const c = withType(SHAPES.filter(i => i.display.includes('Color')), 'color')
    
    if (mode === 'shapes') { items = s; title = "Shapes Recognition Test" }
    else if (mode === 'colors') { items = c; title = "Colors Recognition Test" }
    else if (mode === 'medium-mixed') { items = SHAPES.map(i => ({...i, itemType: i.display.includes('Color') ? 'color' : 'shape'})); title = "Shape & Color (Medium)" }
    else if (mode === 'hard') { items = SHAPES.map(i => ({...i, itemType: i.display.includes('Color') ? 'color' : 'shape'})); title = "Shape & Color (Hard)"; isHardMode = true }
  }

  // Filter out any items that don't have id/display
  const validItems = items.filter(item => item.id && item.display)

  if (validItems.length === 0) {
    return (
      <div className="p-8 text-center mt-12">
        <h2 className="text-3xl font-bold text-slate-800">Coming Soon!</h2>
        <p className="text-slate-500 mt-4">We are still preparing the questions for {mode}.</p>
      </div>
    )
  }

  const isBangla = subject === 'bangla' || (subject === 'math' && mode === 'bangla-numbers')

  return (
    <div className="pt-8 px-4">
      <QuizRunner 
        subject={subject}
        items={validItems} 
        title={title} 
        playClick={playClick} 
        speak={speak} 
        addCoins={addCoins}
        isHardMode={isHardMode}
      />
    </div>
  )
}
