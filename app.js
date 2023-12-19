const randomMealUrl = "https://www.themealdb.com/api/json/v1/1/random.php";
const searchMealUrl = "https://www.themealdb.com/api/json/v1/1/filter.php?c=";
const searchBtn = document.getElementById("searchBtn");
const searchedMealCategories = document.getElementById("searchedMealCategories");

function fetchRandomMeal() {
    fetch(randomMealUrl)
        .then(response => response.json())
        .then(data => {
            const meal = data.meals[0];
            const mealDiv = document.getElementById("randomMeal");
            mealDiv.innerHTML = `
                <div class="meal-content">
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                    <div class="meal-details">
                        <h3>${meal.strMeal}</h3>
                        <p><strong>Category:</strong> ${meal.strCategory}</p>
                        <p><strong>Area:</strong> ${meal.strArea}</p>
                        <p><strong>Instructions:</strong> ${meal.strInstructions}</p>
                    </div>
                </div>
                <button id="randomMealBtn" onclick="fetchRandomMeal()">Get Another Random Meal</button>
            `;
        })
        .catch(error => {
            console.error("Error fetching random meal:", error);
        });
}

function showMealDetails(mealId) {
    const mealDetailsUrl = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`;

    fetch(mealDetailsUrl)
        .then(response => response.json())
        .then(data => {
            const mealDetails = data.meals[0];

            const popup = document.createElement("div");
            popup.classList.add("meal-popup");
            popup.innerHTML = `
                <h3>${mealDetails.strMeal}</h3>
                <p><strong>Ingredients:</strong></p>
                <ul>
                    ${getIngredientsList(mealDetails)}
                </ul>
                <p><strong>Instructions:</strong> ${mealDetails.strInstructions}</p>
                <button onclick="closePopup()">Close</button>
            `;

            document.body.appendChild(popup);
            setTimeout(() => {
                popup.classList.add("show");
            }, 10);
        })
        .catch(error => {
            console.error("Error fetching meal details:", error);
        });

    const overlay = document.createElement("div");
    overlay.classList.add("overlay");
    document.body.appendChild(overlay);
    overlay.style.display = "block";
    setTimeout(() => {
        popup.classList.add("show");
    }, 10);
}

function getIngredientsList(mealDetails) {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
        const ingredient = mealDetails[`strIngredient${i}`];
        const measure = mealDetails[`strMeasure${i}`];

        if (ingredient && measure) {
            ingredients.push(`<li>${measure} ${ingredient}</li>`);
        }
    }
    return ingredients.join("");
}

function closePopup() {
    const popup = document.querySelector(".meal-popup");
    if (popup) {
        popup.classList.remove("show");
        popup.addEventListener("transitionend", function () {
            popup.remove();
        }, { once: true });
    }
    const overlay = document.querySelector(".overlay");
    if (overlay) {
        overlay.remove();
    }
}

window.addEventListener("click", function(event) {
    const popup = document.querySelector(".meal-popup");
    if (popup && !popup.contains(event.target)) {
        closePopup();
    }
});

function fetchSearchedMeal() {
    const searchString = searchBtn.value;

    fetch(searchMealUrl + searchString)
        .then(response => response.json())
        .then(data => {
            searchedMealCategories.innerHTML = '';

            if (data.meals) {
                data.meals.forEach(meal => {
                    searchedMealCategories.innerHTML += `
                        <div class="scrollable">
                            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" onclick="showMealDetails('${meal.idMeal}')"> 
                            <br>
                            <h5>${meal.strMeal}</h5>
                        </div>
                    `;
                });

                document.getElementById("two").style.display = "block";
                document.getElementById("two").innerHTML = `Search Results for: "${searchString}"`;
            } else {
                document.getElementById("two").style.display = "none";
            }
        })
        .catch(error => {
            console.error("Error fetching searched meal:", error);
        });
}

searchBtn.addEventListener("input", () => {
    if (searchBtn.value) {
        fetchSearchedMeal();
    } else {
        searchedMealCategories.innerHTML = '';
        document.getElementById("two").style.display = "none";
    }
});

fetchRandomMeal();
