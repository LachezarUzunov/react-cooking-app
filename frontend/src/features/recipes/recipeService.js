
// CREATE recipe
const addRecipe = async (recipe, token) => {
  const response = await fetch("http://localhost:5000/api/posts", {
    method: "POST",
    body: JSON.stringify(recipe),
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (response.status === 201) {
    const addedRecipe = await response.json();
    return addedRecipe;
  }
};

// GET My recipes
const getMine = async (token) => {
  const response = await fetch("http://localhost:5000/api/posts/myRecipes", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (response.status === 200) {
    const recipes = await response.json();
    return recipes;
  }
};

// GET All recipes
const getAllRecipes = async () => {
  const response = await fetch("http://localhost:5000/api/posts");

  if (response.status === 200) {
    const recipes = await response.json();
    return recipes;
  }
};

// GET Single Recipe
const getSingle = async (recipeId) => {
  const response = await fetch("http://localhost:5000/api/posts/" + recipeId);

  if (response.status === 200) {
    const recipe = await response.json();
    return recipe;
  }
};


const recipeService = {
    addRecipe,
    getMine,
    getAllRecipes,
    getSingle
}

export default recipeService