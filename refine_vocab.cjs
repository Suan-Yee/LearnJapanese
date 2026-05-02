const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'src/json/vocab.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const createRegex = (word) => {
  // Handle some common pluralization or variations
  if (word.endsWith('y')) {
    return new RegExp(`\\b(${word.slice(0, -1)}(y|ies))\\b`, 'i');
  }
  return new RegExp(`\\b${word}s?\\b`, 'i');
};

const rawCategories = {
  people: [
    'teacher', 'student', 'doctor', 'mother', 'father', 'brother', 'sister', 'son', 'daughter', 'friend', 
    'person', 'man', 'woman', 'child', 'boy', 'girl', 'occupation', 'job', 'pronoun', 'someone', 'anyone', 
    'everyone', 'family', 'parent', 'wife', 'husband', 'baby', 'infant', 'youth', 'adult', 'elderly', 
    'customer', 'guest', 'clerk', 'employee', 'boss', 'manager', 'nurse', 'police', 'firefighter', 
    'soldier', 'pilot', 'driver', 'singer', 'actor', 'author', 'writer', 'artist', 'cook', 'chef', 
    'waiter', 'engineer', 'lawyer', 'scientist', 'king', 'queen', 'prince', 'princess', 'me', 'my', 
    'mine', 'our', 'your', 'his', 'her', 'their', 'self', 'who', 'whom', 'whose'
  ],
  food: [
    'eat', 'bread', 'rice', 'apple', 'fruit', 'vegetable', 'meat', 'beef', 'pork', 'chicken', 'fish', 
    'egg', 'meal', 'breakfast', 'lunch', 'dinner', 'snack', 'sweet', 'candy', 'chocolate', 'cake', 
    'cooking', 'sugar', 'salt', 'soy sauce', 'miso', 'vinegar', 'oil', 'flour', 'noodle', 'pasta', 
    'pizza', 'hamburger', 'sandwich', 'soup', 'salad', 'dessert', 'ice cream', 'cookie', 'pie', 
    'banana', 'orange', 'grape', 'strawberry', 'potato', 'tomato', 'onion', 'carrot', 'cabbage', 
    'cucumber', 'lettuce', 'garlic', 'ginger', 'food', 'tofu', 'curry'
  ],
  drink: [
    'drink', 'water', 'tea', 'coffee', 'juice', 'milk', 'beer', 'wine', 'sake', 'alcohol', 'beverage', 
    'cola', 'soda', 'lemonade', 'whiskey', 'cocktail'
  ],
  clothing: [
    'wear', 'clothes', 'shirt', 'pants', 'skirt', 'dress', 'shoe', 'sock', 'hat', 'bag', 'watch', 
    'glasses', 'accessory', 'jewelry', 'coat', 'jacket', 'tie', 'glove', 'sweater', 'kimono', 
    'yukata', 'underwear', 'bra', 'belt', 'scarf', 'ring', 'necklace', 'earring', 'bracelet', 
    'umbrella', 'wallet', 'purse', 'clothing', 'pocket', 'button'
  ],
  place: [
    'building', 'room', 'house', 'school', 'hospital', 'bank', 'station', 'airport', 'park', 'city', 
    'country', 'Japan', 'Tokyo', 'office', 'lobby', 'toilet', 'kitchen', 'bath', 'front', 'back', 
    'left', 'right', 'top', 'bottom', 'inside', 'outside', 'here', 'there', 'where', 'near', 'far', 
    'north', 'south', 'east', 'west', 'town', 'village', 'street', 'road', 'bridge', 'department store', 
    'supermarket', 'convenience store', 'library', 'post office', 'museum', 'zoo', 'temple', 'shrine', 
    'church', 'restaurant', 'hotel', 'cafe', 'bar', 'theater', 'cinema', 'gym', 'pool', 'stadium', 
    'factory', 'farm', 'garden', 'yard', 'corner', 'center', 'side', 'middle', 'everywhere', 
    'somewhere', 'nowhere', 'company', 'department', 'counter', 'floor', 'place', 'location', 
    'basement', 'address', 'neighborhood'
  ],
  time: [
    'year', 'month', 'day', 'hour', 'minute', 'second', 'o\'clock', 'yesterday', 'today', 'tomorrow', 
    'now', 'before', 'after', 'always', 'sometimes', 'never', 'morning', 'afternoon', 'evening', 
    'night', 'week', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 
    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 
    'November', 'December', 'spring', 'summer', 'autumn', 'fall', 'winter', 'time', 'period', 
    'duration', 'when', 'often', 'early', 'late', 'soon', 'already', 'yet', 'still', 'once', 
    'twice', 'times', 'ago', 'future', 'past', 'noon', 'midnight', 'schedule'
  ],
  object: [
    'thing', 'item', 'pen', 'pencil', 'book', 'paper', 'notebook', 'computer', 'phone', 'television', 
    'desk', 'chair', 'table', 'window', 'door', 'key', 'camera', 'tool', 'machine', 'electricity', 
    'radio', 'newspaper', 'magazine', 'letter', 'envelope', 'stamp', 'box', 'bag', 'wallet', 'purse', 
    'money', 'cash', 'card', 'map', 'dictionary', 'calendar', 'clock', 'mirror', 'bed', 'sofa', 
    'curtain', 'light', 'lamp', 'refrigerator', 'washing machine', 'microwave', 'oven', 'stove', 
    'pot', 'pan', 'plate', 'dish', 'bowl', 'cup', 'glass', 'spoon', 'fork', 'knife', 'chopsticks', 
    'trash', 'garbage', 'battery', 'soap', 'towel', 'brush', 'comb', 'scissors', 'tape', 'glue', 
    'string', 'rope', 'object', 'luggage', 'gift', 'present', 'ticket'
  ],
  nature: [
    'sun', 'moon', 'star', 'sky', 'cloud', 'rain', 'snow', 'wind', 'animal', 'dog', 'cat', 'bird', 
    'fish', 'flower', 'tree', 'plant', 'nature', 'weather', 'thunder', 'lightning', 'typhoon', 
    'earthquake', 'fire', 'water', 'earth', 'air', 'gas', 'mountain', 'river', 'sea', 'ocean', 
    'forest', 'grass', 'leaf', 'stone', 'rock', 'sand', 'dirt', 'mud', 'insect', 'bug', 'horse', 
    'cow', 'pig', 'sheep', 'goat', 'elephant', 'lion', 'tiger', 'bear', 'rabbit', 'mouse', 'snake',
    'world', 'planet', 'universe'
  ],
  body: [
    'body', 'head', 'hair', 'eye', 'ear', 'nose', 'mouth', 'hand', 'foot', 'arm', 'leg', 'finger', 
    'heart', 'blood', 'illness', 'cold', 'fever', 'cough', 'pain', 'health', 'medicine', 'face', 
    'tooth', 'neck', 'shoulder', 'back', 'chest', 'stomach', 'knee', 'skin', 'bone', 'muscle', 
    'brain', 'throat', 'tongue', 'lip', 'elbow', 'wrist', 'ankle', 'toe', 'stomachache', 
    'headache', 'injury', 'wound', 'teeth', 'feet'
  ],
  leisure: [
    'sport', 'play', 'hobby', 'movie', 'music', 'song', 'game', 'guitar', 'piano', 'dance', 'swim', 
    'climb', 'photo', 'picture', 'drawing', 'art', 'concert', 'theatre', 'party', 'travel', 
    'vacation', 'holiday', 'tennis', 'soccer', 'football', 'baseball', 'basketball', 'swimming', 
    'running', 'reading', 'singing', 'fishing', 'skiing', 'skating', 'toy', 'doll', 'card', 
    'radio', 'television', 'internet', 'surfing', 'camping', 'hiking'
  ],
  travel: [
    'travel', 'trip', 'bus', 'train', 'taxi', 'plane', 'airplane', 'bicycle', 'ship', 'boat', 'car', 
    'automobile', 'ticket', 'hotel', 'souvenir', 'luggage', 'baggage', 'sightseeing', 'passport', 
    'visa', 'map', 'tour', 'guide', 'reservation', 'station', 'airport', 'harbor', 'port', 
    'ticket gate', 'platform'
  ],
  numbers: [
    'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'hundred', 
    'thousand', 'million', 'billion', 'zero', 'number', 'count', 'first', 'second', 'third', 
    'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth', 'many', 'few', 'some', 
    'half', 'double', 'total', 'amount'
  ],
  phrase: [
    'hello', 'goodbye', 'good morning', 'good evening', 'good night', 'thank you', 'excuse me', 
    'sorry', 'please', 'yes', 'no', 'how are you', 'nice to meet you', 'welcome', 'congratulations', 
    'happy birthday', 'good luck', 'cheers', 'thank', 'pardon'
  ],
};

const categories = {};
for (const [cat, words] of Object.entries(rawCategories)) {
  categories[cat] = words.map(createRegex);
}

// Add some non-pluralizable or special regexes
categories.people.push(/\bMr\./i, /\bMs\./i, /\bMrs\./i, /-san\b/i, /-kun\b/i, /-chan\b/i, /^I$/i, /^I\s/i, /\sI\s/i);

const stats = {};
['people', 'food', 'drink', 'clothing', 'place', 'time', 'object', 'nature', 'body', 'leisure', 'travel', 'numbers', 'action', 'adjective', 'phrase'].forEach(c => stats[c] = 0);

data.forEach(item => {
  const pos = item.logic.pos.toLowerCase();
  const en = item.logic.meaning.en;
  let newCat = '';

  if (pos.startsWith('verb')) {
    newCat = 'action';
    if (categories.leisure.some(r => r.test(en))) newCat = 'leisure';
    else if (categories.travel.some(r => r.test(en))) newCat = 'travel';
    else if (categories.food.some(r => r.test(en))) newCat = 'food';
    else if (categories.drink.some(r => r.test(en))) newCat = 'drink';
    else if (categories.people.some(r => r.test(en))) newCat = 'people';
    else if (categories.body.some(r => r.test(en))) newCat = 'body';
  } else if (pos.startsWith('adjective')) {
    newCat = 'adjective';
  } else if (pos === 'other' && (en.includes('!') || en.includes('?') || categories.phrase.some(r => r.test(en)))) {
    newCat = 'phrase';
  }

  if (!newCat) {
    for (const [cat, regexes] of Object.entries(categories)) {
      if (regexes.some(r => r.test(en))) {
        newCat = cat;
        break;
      }
    }
  }

  if (!newCat) {
    if (pos.startsWith('verb')) newCat = 'action';
    else if (pos.startsWith('adjective')) newCat = 'adjective';
    else if (pos === 'adverb') newCat = 'adjective';
    else if (pos === 'other') newCat = 'phrase';
    else newCat = 'object';
  }

  // Overrides
  if (/\b(country|city|Japan|Tokyo|London|America|China|Korea|here|there|where|everywhere)\b/i.test(en)) newCat = 'place';
  if (/\b(mother|father|brother|sister|son|daughter|uncle|aunt|grand|wife|husband|pronoun|you|he|she|we|they|someone|anyone|everyone)\b/i.test(en) || /^I$/i.test(en) || /^I\s/i.test(en) || /\sI\s/i.test(en)) newCat = 'people';
  if (/\b(year|month|day|week|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday|January|February|o'clock|hour|minute|second)\b/i.test(en)) newCat = 'time';
  if (/\b(one|two|three|four|five|six|seven|eight|nine|ten)\b/i.test(en) && !/\b(o'clock|hour|minute|second|day|month|year|week)\b/i.test(en)) newCat = 'numbers';
  
  if (/\bplay\b/i.test(en) && pos.startsWith('verb')) newCat = 'leisure';
  if (pos.startsWith('adjective')) newCat = 'adjective';

  item.logic.category = newCat;
  stats[newCat]++;
});

console.log(JSON.stringify(stats, null, 2));
fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
