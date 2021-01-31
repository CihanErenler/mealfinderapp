const search = document.getElementById("search");
const searchBtn = document.getElementById("search-btn");
const randomBtn = document.getElementById("random-btn");
const mealList = document.querySelector(".meals");
const mealHeader = document.querySelector(".meal-header");
const desWrapper = document.querySelector(".des-wrapper");
const des = document.querySelector(".des");
const desImg = document.querySelector(".des-img");
const desHeader = document.querySelector(".des-header");
const ingredient = document.querySelector(".ingredient");
const instruction = document.querySelector(".instruction");
const randomMeal = document.querySelector(".random-meal");

// Functions

function fetchMeals() {
  process();
}

function process() {
  let value = search.value;
  search.value = "";
  randomMeal.innerHTML = "";
  if (value === "") {
    mealHeader.innerHTML = "";
    showAlert("Please enter a meal");
  } else {
    getData(value.trim())
      .then((data) => {
        if (data.meals !== null) {
          mealHeader.innerHTML = `Results for "<span class="lucky">${value}</span>"`;
          mealList.innerHTML = data.meals
            .map(
              (val) => `
          <div class="meal">
            <img src="${val.strMealThumb}" alt="${val.strMeal}">
            <div class="meal-info" data-mealID="${val.idMeal}">
                <h2>${val.strMeal}</h2>
            </div>
            </div>
            `
            )
            .join("");
        } else {
          mealList.innerHTML = "";
          mealHeader.innerHTML = `There is no result for "<span class="lucky">${value}</span>"`;
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

async function getData(value) {
  let data = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${value}`
  );
  let jsonData = await data.json();
  return jsonData;
}

function showAlert(text) {
  let alert = document.createElement("DIV");
  alert.id = "warning";
  alert.className = "fade-in";
  alert.appendChild(document.createTextNode(`${text}`));

  document.body.appendChild(alert);

  setTimeout(() => {
    document.getElementById("warning").classList.remove("fade-in");
    document.getElementById("warning").classList.add("fade-out");
  }, 3000);

  setTimeout(() => {
    document.getElementById("warning").remove();
  }, 3600);
}

function checkKey(e) {
  if (e.key === "Enter") {
    if (search.value === "") {
      showAlert("Please enter a meal");
    } else {
      process();
    }
  } else if (e.key === "Escape") {
    closeWindow();
  }
}

function checkClass(e) {
  if (e.target.classList.contains("meal-info")) {
    let mealId = e.target.getAttribute("data-mealID");

    getById(mealId);
  } else if (e.target.parentElement.classList.contains("meal-info")) {
    let mealId = e.target.parentElement.getAttribute("data-mealID");
    getById(mealId);
  } else if (e.target.classList.contains("fas")) {
    closeWindow();
  }
}

function closeWindow() {
  des.classList.remove("des-fadein");
  des.classList.add("des-fadeout");

  desWrapper.classList.remove("des-wrapper-fadein");
  desWrapper.classList.add("des-wrapper-fadeout");

  setTimeout(() => {
    desWrapper.classList.remove("des-wrapper-fadeout");
    des.classList.remove("des-fadeout");
  }, 600);

  setTimeout(() => {
    desWrapper.style.display = "none";
  }, 700);
}

async function getById(id) {
  desWrapper.style.display = "block";
  desWrapper.classList.add("des-wrapper-fadein");
  des.classList.add("des-fadein");
  let data = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
  );

  let jsonData = await data.json();

  let ing = [];

  for (let x in jsonData.meals[0]) {
    if (x.indexOf("strIngredient") > -1) {
      if (jsonData.meals[0][x] !== "") {
        ing.push(jsonData.meals[0][x]);
      }
    }
  }

  let filtered = ing.filter((meal) => meal != null);

  desImg.setAttribute("src", jsonData.meals[0].strMealThumb);
  desHeader.innerHTML = jsonData.meals[0].strMeal;
  ingredient.innerHTML = `Ingredients: <span class="ingredients">${filtered.join(
    " ◆ "
  )}</span>`;
  instruction.innerHTML = `<span class="instru">Instructions: </span>${jsonData.meals[0].strInstructions}`;
}

function getRandomMeal() {
  mealList.innerHTML = "";
  fetch("https://www.themealdb.com/api/json/v1/1/random.php")
    .then((resolve) => resolve.json())
    .then((resolve) => {
      let val = resolve.meals[0];
      mealHeader.innerHTML = `Your lucky meal is "<span class="lucky">${val.strMeal}</span>"`;
      randomMeal.innerHTML = `
          <div class="meal">
            <img src="${val.strMealThumb}" alt="${val.strMeal}">
            <div class="meal-info" data-mealID="${val.idMeal}">
                <h2>${val.strMeal}</h2>
            </div>
            </div>
            `;
    })
    .catch((err) => console.log(err));
}
// Event Listeners

searchBtn.addEventListener("click", fetchMeals);
document.body.addEventListener("keydown", checkKey);
document.body.addEventListener("click", checkClass);
randomBtn.addEventListener("click", getRandomMeal);
