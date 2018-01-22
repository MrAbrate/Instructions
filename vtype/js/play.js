const excerpt = document.getElementById('excerpt');
const userTyping = document.getElementById('user-typing');

const scores = [];
let exercises;

getExercises()
.then(data => {
  document.getElementById('play').addEventListener('click', function () {
    exercises = data;
    document.getElementById('play').style.display = 'none';
    play(0);
  });
});

function play(exerciseIndex) {
  let str = exercises[exerciseIndex];
  let start;
  let mistakes = 0;
  userTyping.innerHTML = '';
  userTyping.focus();
  countDown(str, 3);



  function countDown(str, counter) {
    if (counter <= 0) {
      excerpt.textContent = str;
      userTyping.focus();
      userTyping.addEventListener('keyup', onkeyup);
      userTyping.innerHTML = '';
      start = new Date().getTime();
      return;
    }

    excerpt.textContent = counter;
    setTimeout(() => {
      countDown(str, counter - 1);
    }, 1000);
  }

  function onkeyup(e) {
    const text = userTyping.textContent.replace(String.fromCharCode(160), ' ');

    if (str.trim() === text.trim()) {
      complete();
      return;
    }

    for (let i = 0; i < str.length; i += 1) {
      if (text[i] !== str[i] && text[i] !== undefined) {
        // Letters don't match. Mark this letter red
        const typed = str.slice(0, i);
        const wrong = str.slice(i, i + 1);
        const untyped = str.slice(i + 1);


        let html = `<span class="typed">${ typed }</span>`;
        html += `<span class="wrong">${ wrong }</span>`;
        html += untyped;
        excerpt.innerHTML = html;

        if (e.keycode !== 8 || e.keycode !== 46) {
          mistakes += 1;
        }

        break;
      }
      if (text[i] === undefined) {
        // User hasn't typed this letter yet
        // Mark the text in the paragraph to show that it has been typed
        const typed = str.slice(0, i);
        const untyped = str.slice(i);
        let html = `<span class="typed">${ typed }</span>`;
        html += untyped;

        excerpt.innerHTML = html;
        break;
      }
    }
  }

  function complete() {
    const end = new Date().getTime();
    const time = end - start;
    const min = time / 1000 / 60;
    const words = str.length / 5;

    scores.push({ wpm: words/min, mistakes: mistakes, words: words, min: min });

    // Clean up
    excerpt.innerHTML = '';
    userTyping.removeEventListener('keyup', onkeyup);


    if (exercises[exerciseIndex + 1] === undefined) {
      const wpmSum = scores.reduce((prev, score) => score.wpm + prev, 0);
      const wpmAvg = wpmSum / scores.length;
      console.log(scores)
      console.log(wpmSum)

      const mistakeSum = scores.reduce((prev, score) => score.mistakes + prev, 0);
      const wordSum = scores.reduce((prev, score) => score.words + prev, 0);
      const mistakeRate = (mistakeSum / (wordSum * 5)) * 100;

      submit({
        id:  getUrlParams('e'),
        href: window.location.href,
        wpm: wpmAvg.toFixed(2),
        mistakeRate: mistakeRate.toFixed(2)
      });

      return;
    }

    play(exerciseIndex + 1);
  }
}


function submit(data) {
  const form = document.createElement('form');
  const input = document.createElement('input');
  input.name = 'data';
  input.type = 'hidden';
  input.value = JSON.stringify(data);
  form.appendChild(input);
  form.action = 'https://script.google.com/a/macros/thevillageschool.com/s/AKfycbz30-tz_U40qyHU-GTEC76RwetH68rFLii4y3ILWBA/dev';
  form.method = 'POST';
  document.body.appendChild(form);
  form.submit();
}
