export const ENGLISH_UPPERCASE = Array.from({ length: 26 }, (_, i) => {
  const letter = String.fromCharCode(65 + i);
  return { id: letter, display: letter, maskText: letter, speechText: `The alphabet is ${letter}`, level: i + 1 };
});

export const ENGLISH_LOWERCASE = Array.from({ length: 26 }, (_, i) => {
  const letter = String.fromCharCode(97 + i);
  return { id: letter, display: letter, maskText: letter, speechText: `The alphabet is ${letter}`, level: i + 1 };
});

const englishWordsMap = {
  "A":"Apple, Ant", "B":"Ball, Bat", "C":"Cat, Cup", "D":"Dog, Doll", "E":"Egg, Elephant",
  "F":"Frog, Fox", "G":"Gun, Girl", "H":"Horse, Hot", "I":"Iron, Ice", "J":"Juice, Jug",
  "K":"Kite, Key", "L":"Lemon, Light", "M":"Mango, Man", "N":"Nut, New", "O":"Oil, Open",
  "P":"Pet, Picture", "Q":"Question, Queen", "R":"Rat, Run", "S":"Sad, Sugar", "T":"Tomato, Team",
  "U":"Under, Up", "V":"Video, Voice", "W":"White, Wall", "X":"X-ray, Xerox", "Y":"Yes, You", "Z":"Zoo, Zero"
};
export const ENGLISH_WORDS = Object.entries(englishWordsMap).flatMap(([letter, wordsStr], i) => {
  return wordsStr.split(', ').map((word, j) => ({
    id: word, 
    display: word, 
    maskText: word, 
    speechText: `Select the word ${word}`, 
    level: i * 2 + j + 1
  }));
});

export const englishNums = Array.from({length: 100}, (_, i) => String(i + 1));
export const MATH_ENGLISH = englishNums.map((num, i) => ({
  id: num, display: `Number: ${num}`, maskText: num, speechText: `The number is ${num}`, level: i + 1
}));

function numberToEnglish(n) {
  const ones = ["", "ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX", "SEVEN", "EIGHT", "NINE", "TEN", "ELEVEN", "TWELVE", "THIRTEEN", "FOURTEEN", "FIFTEEN", "SIXTEEN", "SEVENTEEN", "EIGHTEEN", "NINETEEN"];
  const tens = ["", "", "TWENTY", "THIRTY", "FORTY", "FIFTY", "SIXTY", "SEVENTY", "EIGHTY", "NINETY"];
  if (n < 20) return ones[n];
  if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 === 0 ? "" : " " + ones[n % 10]);
  if (n === 100) return "ONE HUNDRED";
  return "";
}

export const MATH_SPELLING_ENGLISH = englishNums.map((num, i) => {
  const spell = numberToEnglish(i + 1);
  return {
    id: num, display: `${num} = ${spell}`, maskText: `${num} = ${spell}`, speechText: `${num} means ${spell}`, level: i + 1
  };
});

function toBanglaDigit(n) {
  const digits = ["০","১","২","৩","৪","৫","৬","৭","৮","৯"];
  return n.toString().split('').map(d => digits[parseInt(d)]).join('');
}

const banglaNums = Array.from({length: 100}, (_, i) => toBanglaDigit(i + 1));
export const MATH_BANGLA = banglaNums.map((num, i) => ({
  id: num, display: `সংখ্যা: ${num}`, maskText: num, speechText: `The number is ${num}`, level: i + 1,
  audioPath: `/assets/audio/Math/${num}.mp3`
}));

const banglaSpellings = [
  "এক","দুই","তিন","চার","পাঁচ","ছয়","সাত","আট","নয়","দশ",
  "এগারো","বারো","তেরো","চৌদ্দ","পনেরো","ষোলো","সতেরো","আঠারো","উনিশ","বিশ",
  "একুশ","বাইশ","তেইশ","চব্বিশ","পঁচিশ","ছাব্বিশ","সাতাশ","আঠাশ","উনত্রিশ","ত্রিশ",
  "একত্রিশ","বত্রিশ","তেত্রিশ","চৌত্রিশ","পঁয়ত্রিশ","ছত্রিশ","সাঁইত্রিশ","আটত্রিশ","উনচল্লিশ","চল্লিশ",
  "একচল্লিশ","বিয়াল্লিশ","তেতাল্লিশ","চুয়াল্লিশ","পঁয়তাল্লিশ","ছেচল্লিশ","সাতচল্লিশ","আটচল্লিশ","উনপঞ্চাশ","পঞ্চাশ",
  "একান্ন","বায়ান্ন","তিপ্পান্ন","চুয়ান্ন","পঞ্চান্ন","ছাপ্পান্ন","সাতান্ন","আটান্ন","উনষাট","ষাট",
  "একষট্টি","বাষট্টি","তেষট্টি","চৌষট্টি","পঁয়ষট্টি","ছেষট্টি","সাতষট্টি","আটষট্টি","উনসত্তর","সত্তর",
  "একাত্তর","বাহাত্তর","তিয়াত্তর","চুয়াত্তর","পঁচাত্তর","ছিয়াত্তর","সাতাত্তর","আটাত্তর","উনআশি","আশি",
  "একাশি","বিরাশি","তিরাশি","চুরাশি","পঁচাশি","ছিয়াশি","সাতাশি","আটাশি","উননব্বই","নব্বই",
  "একানব্বই","বিরানব্বই","তিরানব্বই","চুরানব্বই","পঁচানব্বই","ছিয়ানব্বই","সাতানব্বই","আটানব্বই","নিরানব্বই","একশত"
];
export const MATH_SPELLING_BANGLA = banglaNums.map((num, i) => ({
  id: num, display: `${num} = ${banglaSpellings[i]}`, maskText: `${num} = ${banglaSpellings[i]}`, speechText: `${num} means ${banglaSpellings[i]}`, level: i + 1,
  audioPath: `/assets/audio/Math/${num}.mp3`
}));

const shoroborno = ["অ","আ","ই","ঈ","উ","ঊ","ঋ","এ","ঐ","ও","ঔ"];
export const BANGLA_SHOROBORNO = shoroborno.map((char, i) => ({
  id: char, display: char, maskText: char, speechText: `The alphabet is ${char}`, level: i + 1,
  audioPath: `/assets/audio/Shoroborno.mp3/${char}.mp3`
}));

const shoroWords = {
  "অ":"অলি, অজগর", "আ":"আম, আনারস", "ই":"ইলিশ, ইঁদুর", "ঈ":"ঈগল, ঈদ",
  "উ":"উট, উড়োজাহাজ", "ঊ":"ঊষা, ঊর্মি", "ঋ":"ঋষি, ঋণ", "এ":"একতারা, এক",
  "ঐ":"ঐরাবত, ঐক্য", "ও":"ওজন, ওল", "ঔ":"ঔষধ, ঔদার্য"
};
export const BANGLA_SHOROBORNO_WORDS = Object.entries(shoroWords).map(([char, words], i) => ({
  id: char, display: `${char} = ${words}`, maskText: `${char} = ${words}`, speechText: `${char} for ${words}`, level: i + 1,
  audioPath: `/assets/audio/shorobornoword/${char}word.mp3`
}));

const benjonborno = [
  "ক","খ","গ","ঘ","ঙ","চ","ছ","জ","ঝ","ঞ","ট","ঠ","ড","ঢ","ণ",
  "ত","থ","দ","ধ","ন","প","ফ","ব","ভ","ম","য","র","ল","শ","ষ",
  "স","হ","ড়","ঢ়","য়","ৎ","ং","ঃ","ঁ"
];
export const BANGLA_BENJONBORNO = benjonborno.map((char, i) => ({
  id: char, display: char, maskText: char, speechText: `The alphabet is ${char}`, level: i + 1,
  audioPath: `/assets/audio/Benjonbornoo/${char}.mp3`
}));

const benjonbornoWordsMap = {
  "ক": "কলা, কাক", "খ": "খাতা, খাবার", "গ": "গরু, গান", "ঘ": "ঘর, ঘুড়ি", "ঙ": "আঙুর, রঙ",
  "চ": "চশমা, চাকা", "ছ": "ছাতা, ছাগল", "জ": "জল, জামা", "ঝ": "ঝুড়ি, ঝরনা", "ঞ": "মিঞ, মিঞা",
  "ট": "টেবিল, টব", "ঠ": "কাঠ, ঠেলা", "ড": "ডাল, ডাব", "ঢ": "ঢাক, ঢেউ", "ণ": "বাণী, গণনা",
  "ত": "তাল, তালা", "থ": "থালা, থাবা", "দ": "দরজা, দুধ", "ধ": "ধান, ধরা", "ন": "নাক, নাম",
  "প": "পতাকা, পানি", "ফ": "ফুল, ফল", "ব": "বাঘ, বাড়ি", "ভ": "ভাত, ভোর", "ম": "মাছ, মাটি",
  "য": "যব, যম", "র": "রবি, রাত", "ল": "লাল, লতা",
  "শ": "শরৎ, শাপলা", "ষ": "ষাঁড়, ষাট", "স": "সকাল, সময়", "হ": "হাত, হাঁস",
  "ড়": "বড়, ঘড়ি", "ঢ়": "আষাঢ়, গাঢ়", "য়": "জয়, নয়", "ৎ": "সৎ, মৎস্য", "ং": "বাংলা, শিং", "ঃ": "দুঃখ, দুঃসাহস", "ঁ": "চাঁদ, দাঁত"
};
export const BANGLA_BENJONBORNO_WORDS = Object.entries(benjonbornoWordsMap).map(([char, words], i) => ({
  id: char, display: `${char} = ${words}`, maskText: `${char} = ${words}`, speechText: `${char} for ${words}`, level: i + 1,
  audioPath: `/assets/audio/Benjonbornoword/${char}word.mp3`
}));

const SHAPE_NAMES = ["Circle","Triangle","Square","Rectangle","Oval","Star","Diamond","Pentagon","Hexagon","Trapezoid","Parallelogram","Right Arrow","Left Arrow","Up Arrow","Down Arrow"];
export const SHAPES = SHAPE_NAMES.map((shape, i) => ({
  id: shape, display: `Shape: ${shape}`, type: 'shape', shapeType: shape, speechText: `This is a ${shape}`, level: i + 1
}));
