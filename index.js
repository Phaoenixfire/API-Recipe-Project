
/*fetch('https://api.edamam.com/search?q=chicken tomatoes pineapple onions garlic &app_id=42475fa9&app_key=200d2b3191b956d540b7945238ca841e&from=0&to=30&calories=591-722&health=alcohol-free')
  .then(function(response) {
    return response.json();
  })
  .then(function(myJson) {
    console.log(myJson);
  });
*/

$('form').submit(async (e) => {
  e.preventDefault();
  $('.query_items').append(`<li>${$(".user-search-input").val()} <span class="fas fa-window-close remove">  </span></li>`)
  let queryitem = $('ul.query_items').clone().find('span').remove().end().text();
  console.log(queryitem)
  getRecipes(queryitem)
})
$("ul.query_items").on('click', '.remove', function(e) {
  $(this).closest("li").remove();
  let queryitem = $('ul.query_items').clone().find('span').remove().end().text();
  getRecipes(queryitem)
});

function displayData(data) {
  console.log(data.length)
  let html = "";
  for (let i = 0; i < Math.min(10,data.hits.length); i++) {
    html += `
    <div class="recipe">
      <img src=${data.hits[i].recipe.image} class="foodImage">
      <h4>${data.hits[i].recipe.label}</h4>
      <div class="ingredients">
      ${data.hits[i].recipe.ingredients.map(ingredient => `<li>${ingredient.text}</li>`).join('')}
      </div>
      <button data-iframe="${data.hits[i].recipe.url}" class="showIFrame">Show Recipe</button>
      
    </div>
    `
  }
  $(".search-results").html(html)
  $('button.showIFrame').click(function () {
    $(this).parent().find("iframe").toggleClass("show")
    console.log(this)
    $("iframe").remove()
    $("body").append(`<iframe src="${$(this).data('iframe')}"></iframe>`)
    window.t = this
  })
}
const MY_WIT_TOKEN = "VHYMVTZ5I6ZPPWFVYTYAXLMVXNARCAK2";

function getWit(query) {
  return fetch(
    `https://api.wit.ai/message?q=${query}`,
    {
      method: 'GET',
      headers: { Authorization: `Bearer ${MY_WIT_TOKEN}` }
    }
  )
    .then(response => response.json())
    .then(json => json);
}
function getEdamam(wit) {
  let str = "";
  wit.entities.search_query.forEach(item => {
    str += item.value + " "
  })
  console.log(str);
  fetch(`https://api.edamam.com/search?q=${str}&app_id=42475fa9&app_key=200d2b3191b956d540b7945238ca841e&from=0&to=1000`)
    .then(function (response) {
      return response.json();
    })
    .then(function (myJson) {
      console.log(myJson);
      let s = myJson.hits.sort(function (a, b) {
        return a.recipe.ingredients.length - b.recipe.ingredients.length // || // sort by length, if equal then
          //a.localeCompare(b);    // sort by dictionary order
      })
      console.log(s);

      displayData(myJson);
    });
}
function speechRecognition() {
  var recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 5;
  recognition.start();

  recognition.onresult = function (event) {
    console.log('You said: ', event.results[0][0].transcript);
    getRecipes(event.results[0][0].transcript);
  }
};

$("button.speak_to_search").on("click", speechRecognition)

const getRecipes = async (query) => {
  console.log("hi")
  let wit = await getWit(query);
  console.log(wit)
  getEdamam(wit)
}

