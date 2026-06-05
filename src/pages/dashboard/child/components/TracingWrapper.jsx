import React from 'react';
import GenericTracingCanvas from './GenericTracingCanvas';
import { 
  ENGLISH_UPPERCASE, ENGLISH_LOWERCASE, ENGLISH_WORDS,
  MATH_BANGLA, MATH_ENGLISH, MATH_SPELLING_BANGLA, MATH_SPELLING_ENGLISH,
  BANGLA_SHOROBORNO, BANGLA_BENJONBORNO, BANGLA_SHOROBORNO_WORDS, BANGLA_BENJONBORNO_WORDS,
  SHAPES
} from '../data/learningData';

// Wrapper component mapping props to data arrays
export default function TracingWrapper({ moduleType, playClick }) {
  let items = [];
  let backRoute = '/dashboard/child/learn';
  let baseFontSize = 320;
  
  const speak = (text) => {
    try {
      const u = new SpeechSynthesisUtterance(text);
      if (moduleType.includes('bangla')) {
        u.lang = 'bn-BD'; // Use Bengali TTS if available
        u.rate = 0.8;
      }
      window.speechSynthesis.speak(u);
    } catch(e) {}
  };

  switch (moduleType) {
    case 'english_uppercase':
      items = ENGLISH_UPPERCASE;
      backRoute = '/dashboard/child/learn/english';
      break;
    case 'english_lowercase':
      items = ENGLISH_LOWERCASE;
      backRoute = '/dashboard/child/learn/english';
      break;
    case 'english_words':
      items = ENGLISH_WORDS;
      backRoute = '/dashboard/child/learn/english';
      baseFontSize = 140; // smaller for long strings
      break;
    case 'math_bangla':
      items = MATH_BANGLA;
      backRoute = '/dashboard/child/learn/math';
      break;
    case 'math_english':
      items = MATH_ENGLISH;
      backRoute = '/dashboard/child/learn/math';
      break;
    case 'math_spelling_bangla':
      items = MATH_SPELLING_BANGLA;
      backRoute = '/dashboard/child/learn/math';
      baseFontSize = 140;
      break;
    case 'math_spelling_english':
      items = MATH_SPELLING_ENGLISH;
      backRoute = '/dashboard/child/learn/math';
      baseFontSize = 140;
      break;
    case 'bangla_shoroborno':
      items = BANGLA_SHOROBORNO;
      backRoute = '/dashboard/child/learn/bangla';
      break;
    case 'bangla_benjonborno':
      items = BANGLA_BENJONBORNO;
      backRoute = '/dashboard/child/learn/bangla';
      break;
    case 'bangla_shoroborno_words':
      items = BANGLA_SHOROBORNO_WORDS;
      backRoute = '/dashboard/child/learn/bangla';
      baseFontSize = 140;
      break;
    case 'bangla_benjonborno_words':
      items = BANGLA_BENJONBORNO_WORDS;
      backRoute = '/dashboard/child/learn/bangla';
      baseFontSize = 140;
      break;
    case 'shapes':
      items = SHAPES;
      backRoute = '/dashboard/child/learn';
      break;
    default:
      items = [];
  }

  if (items.length === 0) return null;

  return (
    <GenericTracingCanvas 
      moduleType={moduleType}
      items={items}
      backRoute={backRoute}
      playClick={playClick}
      speak={speak}
      baseFontSize={baseFontSize}
    />
  );
}
