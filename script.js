let questions = [];
let current = 0;

const decode = (str) => {
  const text = document.createElement('textarea');
  text.innerHTML = str;
  return text.value;
};

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

async function start() {
  const category = document.getElementById('category').value;
  const difficulty = document.getElementById('difficulty').value;
  const amount = document.getElementById('amount').value;

  let url = `https://opentdb.com/api.php?amount=${amount}&type=multiple`;
  if (category) url += `&category=${category}`;
  if (difficulty) url += `&difficulty=${difficulty}`;

  const res = await fetch(url);
  const data = await res.json();
  questions = data.results;
  current = 0;

  document.getElementById('settings').style.display = 'none';
  document.getElementById('quiz').style.display = 'block';

  show();
}

function show() {
  const q = questions[current];
  const answers = [...q.incorrect_answers, q.correct_answer];
  answers.sort(() => Math.random() - 0.5);

  let html = `<h2>${decode(q.question)}</h2>`;
  answers.forEach((answer) => {
    const isCorrect = answer === q.correct_answer;
    const className = isCorrect ? 'correct' : 'wrong';
    html += `<p class="${className}">${decode(answer)}</p>`;
  });
  html += `<button class="next-btn">Neste</button>`;

  document.getElementById('quiz').innerHTML = html;
  
  document.querySelector('.next-btn').addEventListener('click', next);
}

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