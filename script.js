// Liste med alle spørsmålene
let questions = [];

// Hvilket spørsmål vi er på nå
let current = 0;

// Gjør HTML-tegn til vanlig tekst
const decode = (str) => {
  const text = document.createElement('textarea');
  text.innerHTML = str;
  return text.value;
};

// Henter kategorier fra api_category.php og legger i dropdown
async function loadCategories() {
  const res = await fetch('https://opentdb.com/api_category.php');
  const data = await res.json();
  const select = document.getElementById('category');

  data.trivia_categories.forEach((cat) => {
    const option = document.createElement('option');
    option.value = cat.id;
    option.textContent = cat.name;
    select.appendChild(option);
  });
}

// Kjøres når Start Quiz blir klikket
// async/await brukes for å vente på svar fra API-et før resten av koden kjører
async function start() {
  const category = document.getElementById('category').value;
  const difficulty = document.getElementById('difficulty').value;
  const amount = document.getElementById('amount').value;

  // Bygger URL med parametere. Kategori og vanskelighetsgrad legges
  // bare til hvis brukeren faktisk har valgt noe
  let url = `https://opentdb.com/api.php?amount=${amount}&type=multiple`;
  if (category) url += `&category=${category}`;
  if (difficulty) url += `&difficulty=${difficulty}`;

  // Henter spørsmålene fra api.php
  const res = await fetch(url);
  const data = await res.json();
  questions = data.results;
  current = 0;

  document.getElementById('settings').style.display = 'none';
  document.getElementById('quiz').style.display = 'block';

  show();
}

// Viser spørsmålet vi er på nå
function show() {
  const q = questions[current];

  // Spread (...) henter ut alle feil-svarene fra arrayen og legger dem
  // sammen med det riktige svaret i en ny array
  const answers = [...q.incorrect_answers, q.correct_answer];

  // Blander rekkefølgen på svarene tilfeldig
  answers.sort(() => Math.random() - 0.5);

  let html = `<div class="question-number">Spørsmål ${current + 1} av ${questions.length}</div>`;
  html += `<h2>${decode(q.question)}</h2>`;

  answers.forEach((answer) => {
    const isCorrect = answer === q.correct_answer;
    const className = isCorrect ? 'correct' : 'wrong';
    html += `<p class="${className}">${decode(answer)}</p>`;
  });

  html += `<button class="next-btn">Neste</button>`;

  document.getElementById('quiz').innerHTML = html;
  document.querySelector('.next-btn').addEventListener('click', next);
}

// Går til neste spørsmål
function next() {
  current++;

  if (current < questions.length) {
    show();
  } else {
    document.getElementById('quiz').innerHTML = '<h2>Ferdig!</h2><button class="restart-btn">Start på nytt</button>';
    document.querySelector('.restart-btn').addEventListener('click', () => location.reload());
  }
}

document.getElementById('startBtn').addEventListener('click', start);
loadCategories();