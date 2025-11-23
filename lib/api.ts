const BASE_URL = "https://api.myrecipeapp.com"
const THEMEALDB_BASE_URL = "https://www.themealdb.com/api/json/v1/1"

// TheMealDB API response types
interface TheMealDBMeal {
  idMeal: string
  strMeal: string
  strMealAlternate: string | null
  strCategory: string
  strArea: string
  strInstructions: string
  strMealThumb: string
  strTags: string | null
  strYoutube: string | null
  strIngredient1?: string
  strIngredient2?: string
  strIngredient3?: string
  strIngredient4?: string
  strIngredient5?: string
  strIngredient6?: string
  strIngredient7?: string
  strIngredient8?: string
  strIngredient9?: string
  strIngredient10?: string
  strIngredient11?: string
  strIngredient12?: string
  strIngredient13?: string
  strIngredient14?: string
  strIngredient15?: string
  strIngredient16?: string | null
  strIngredient17?: string | null
  strIngredient18?: string | null
  strIngredient19?: string | null
  strIngredient20?: string | null
  strMeasure1?: string
  strMeasure2?: string
  strMeasure3?: string
  strMeasure4?: string
  strMeasure5?: string
  strMeasure6?: string
  strMeasure7?: string
  strMeasure8?: string
  strMeasure9?: string
  strMeasure10?: string
  strMeasure11?: string
  strMeasure12?: string
  strMeasure13?: string
  strMeasure14?: string
  strMeasure15?: string
  strMeasure16?: string | null
  strMeasure17?: string | null
  strMeasure18?: string | null
  strMeasure19?: string | null
  strMeasure20?: string | null
}

interface TheMealDBResponse {
  meals: TheMealDBMeal[] | null
}

export interface Recipe {
  id: string
  title: string
  image: string
  category: string
  duration: string
}

export interface RecipeDetail extends Recipe {
  ingredients: string[]
  instructions: string[]
  area?: string
  tags?: string[]
  youtube?: string
}

export interface MealPlan {
  id: string
  title: string
  description: string
  image: string
  recommended?: boolean
}

export interface Meal {
  id: string
  title: string
  image: string
  duration: string
  recipeId: string
}

export interface Credits {
  creditsLeft: number
}

const MOCK_MEAL_PLANS: Record<string, Meal[]> = {
  m1: [
    {
      id: "meal1",
      title: "Grilled Salmon with Asparagus",
      image: "/grilled-salmon-with-lemon.jpg",
      duration: "25 min",
      recipeId: "r7",
    },
    {
      id: "meal2",
      title: "Fresh Garden Salad",
      image: "/garden-vegetable-salad.png",
      duration: "10 min",
      recipeId: "r3",
    },
    {
      id: "meal3",
      title: "Vegetable Stir Fry",
      image: "/colorful-vegetable-stir-fry.png",
      duration: "15 min",
      recipeId: "r8",
    },
    {
      id: "meal4",
      title: "Spicy Chicken Curry",
      image: "/spicy-chicken-curry.png",
      duration: "35 min",
      recipeId: "r2",
    },
  ],
  m2: [
    {
      id: "meal5",
      title: "Creamy Garlic Pasta",
      image: "/creamy-garlic-pasta-with-parmesan.jpg",
      duration: "20 min",
      recipeId: "r1",
    },
    {
      id: "meal6",
      title: "Vegetable Stir Fry",
      image: "/colorful-vegetable-stir-fry.png",
      duration: "15 min",
      recipeId: "r8",
    },
    {
      id: "meal7",
      title: "Fresh Garden Salad",
      image: "/garden-vegetable-salad.png",
      duration: "10 min",
      recipeId: "r3",
    },
    {
      id: "meal8",
      title: "Beef Tacos",
      image: "/beef-tacos-with-toppings.jpg",
      duration: "25 min",
      recipeId: "r4",
    },
  ],
  m3: [
    {
      id: "meal9",
      title: "Beef Tacos",
      image: "/beef-tacos-with-toppings.jpg",
      duration: "25 min",
      recipeId: "r4",
    },
    {
      id: "meal10",
      title: "Creamy Garlic Pasta",
      image: "/creamy-garlic-pasta-with-parmesan.jpg",
      duration: "20 min",
      recipeId: "r1",
    },
    {
      id: "meal11",
      title: "Chocolate Cake",
      image: "/decadent-chocolate-cake-slice.jpg",
      duration: "60 min",
      recipeId: "r6",
    },
    {
      id: "meal12",
      title: "Spicy Chicken Curry",
      image: "/spicy-chicken-curry.png",
      duration: "35 min",
      recipeId: "r2",
    },
  ],
}

const MOCK_RECIPES_DETAIL: Record<string, RecipeDetail> = {
  r1: {
    id: "r1",
    title: "Creamy Garlic Pasta",
    image: "/creamy-garlic-pasta-dish-close-up.jpg",
    category: "Italian",
    duration: "20 min",
    ingredients: [
      "400g Pasta (spaghetti or fettuccine)",
      "4 cloves Garlic, minced",
      "3 tbsp Butter",
      "1 cup Heavy Cream",
      "1 cup Parmesan cheese, grated",
      "Fresh parsley, chopped",
      "Salt and pepper to taste",
    ],
    instructions: [
      "Boil pasta in salted water until al dente, about 8-10 minutes. Reserve 1 cup of pasta water before draining.",
      "While pasta cooks, mince garlic and sauté in butter over medium heat until fragrant, about 2 minutes.",
      "Add heavy cream to the pan and bring to a gentle simmer. Let it reduce slightly for 3-4 minutes.",
      "Drain pasta and add to the cream sauce, tossing to coat evenly. Add pasta water if needed to thin the sauce.",
      "Add grated Parmesan cheese and mix until melted and creamy. The sauce should coat the pasta beautifully.",
      "Season with salt and pepper, garnish with fresh parsley, and serve hot with extra Parmesan on the side.",
    ],
  },
  r2: {
    id: "r2",
    title: "Spicy Chicken Curry",
    image: "/spicy-chicken-curry.png",
    category: "Indian",
    duration: "35 min",
    ingredients: [
      "500g Chicken breast, cubed",
      "2 Onions, diced",
      "3 cloves Garlic, minced",
      "1 tbsp Ginger, grated",
      "2 tbsp Curry powder",
      "1 can Coconut milk",
      "2 Tomatoes, diced",
      "Fresh cilantro",
      "Salt and chili flakes",
    ],
    instructions: [
      "Heat oil in a large pan and sauté onions until golden brown, about 5 minutes.",
      "Add garlic and ginger, cook for 1 minute until fragrant.",
      "Add chicken pieces and cook until browned on all sides, about 5-7 minutes.",
      "Stir in curry powder and cook for 1 minute to release the flavors.",
      "Add diced tomatoes and coconut milk. Bring to a simmer.",
      "Cover and cook for 15-20 minutes until chicken is cooked through and sauce has thickened.",
      "Season with salt and chili flakes. Garnish with fresh cilantro and serve with rice or naan.",
    ],
  },
  r3: {
    id: "r3",
    title: "Fresh Garden Salad",
    image: "/garden-vegetable-salad.png",
    category: "Healthy",
    duration: "10 min",
    ingredients: [
      "Mixed salad greens (lettuce, arugula, spinach)",
      "1 Cucumber, sliced",
      "2 Tomatoes, diced",
      "1 Red onion, thinly sliced",
      "1 Avocado, cubed",
      "Feta cheese, crumbled",
      "Olive oil",
      "Lemon juice",
      "Salt and pepper",
    ],
    instructions: [
      "Wash and dry all the salad greens thoroughly.",
      "In a large bowl, combine the mixed greens, cucumber, tomatoes, and red onion.",
      "Add the cubed avocado and crumbled feta cheese on top.",
      "In a small bowl, whisk together olive oil, lemon juice, salt, and pepper to make the dressing.",
      "Drizzle the dressing over the salad just before serving.",
      "Toss gently to combine and serve immediately for maximum freshness.",
    ],
  },
  r4: {
    id: "r4",
    title: "Beef Tacos",
    image: "/beef-tacos-with-toppings.jpg",
    category: "Mexican",
    duration: "25 min",
    ingredients: [
      "500g Ground beef",
      "1 Onion, diced",
      "2 cloves Garlic, minced",
      "2 tbsp Taco seasoning",
      "8 Taco shells",
      "Lettuce, shredded",
      "Tomatoes, diced",
      "Cheddar cheese, shredded",
      "Sour cream",
      "Salsa",
    ],
    instructions: [
      "Heat a large skillet over medium-high heat. Add ground beef and cook until browned, breaking it up as it cooks.",
      "Add diced onion and garlic, cook for 3-4 minutes until softened.",
      "Stir in taco seasoning and 1/4 cup water. Simmer for 5 minutes until the sauce thickens.",
      "While the beef cooks, warm the taco shells according to package instructions.",
      "Prepare all the toppings: shred lettuce, dice tomatoes, and grate cheese.",
      "Fill each taco shell with the seasoned beef, then top with lettuce, tomatoes, cheese, sour cream, and salsa.",
      "Serve immediately while the shells are still warm and crispy.",
    ],
  },
  r5: {
    id: "r5",
    title: "Sushi Rolls",
    image: "/assorted-sushi-rolls.jpg",
    category: "Japanese",
    duration: "40 min",
    ingredients: [
      "2 cups Sushi rice",
      "3 tbsp Rice vinegar",
      "4 Nori sheets",
      "1 Cucumber, julienned",
      "1 Avocado, sliced",
      "200g Fresh salmon or tuna",
      "Soy sauce",
      "Wasabi",
      "Pickled ginger",
    ],
    instructions: [
      "Cook sushi rice according to package instructions. Once cooked, mix with rice vinegar and let cool to room temperature.",
      "Place a nori sheet on a bamboo rolling mat, shiny side down.",
      "Spread a thin layer of rice over the nori, leaving a 1-inch border at the top.",
      "Arrange cucumber, avocado, and fish in a line across the center of the rice.",
      "Using the bamboo mat, roll the sushi tightly from bottom to top, sealing the edge with a bit of water.",
      "Slice the roll into 6-8 pieces using a sharp, wet knife.",
      "Serve with soy sauce, wasabi, and pickled ginger on the side.",
    ],
  },
  r6: {
    id: "r6",
    title: "Chocolate Cake",
    image: "/decadent-chocolate-cake-slice.jpg",
    category: "Dessert",
    duration: "60 min",
    ingredients: [
      "2 cups All-purpose flour",
      "2 cups Sugar",
      "3/4 cup Cocoa powder",
      "2 tsp Baking soda",
      "1 tsp Salt",
      "2 Eggs",
      "1 cup Buttermilk",
      "1 cup Hot coffee",
      "1/2 cup Vegetable oil",
      "Chocolate frosting",
    ],
    instructions: [
      "Preheat oven to 350°F (175°C). Grease and flour two 9-inch round cake pans.",
      "In a large bowl, mix together flour, sugar, cocoa powder, baking soda, and salt.",
      "Add eggs, buttermilk, hot coffee, and oil. Beat on medium speed for 2 minutes.",
      "Pour batter evenly into prepared pans.",
      "Bake for 30-35 minutes, or until a toothpick inserted in the center comes out clean.",
      "Cool in pans for 10 minutes, then remove to wire racks to cool completely.",
      "Once cooled, frost with chocolate frosting between layers and on top. Slice and serve.",
    ],
  },
  r7: {
    id: "r7",
    title: "Grilled Salmon",
    image: "/grilled-salmon-with-lemon.jpg",
    category: "Seafood",
    duration: "25 min",
    ingredients: [
      "4 Salmon fillets",
      "2 tbsp Olive oil",
      "2 cloves Garlic, minced",
      "1 Lemon, sliced",
      "Fresh dill",
      "Salt and pepper",
      "Asparagus or green beans for serving",
    ],
    instructions: [
      "Preheat grill to medium-high heat (about 400°F).",
      "Brush salmon fillets with olive oil and season with salt, pepper, and minced garlic.",
      "Place salmon skin-side down on the grill. Top with lemon slices and fresh dill.",
      "Grill for 4-5 minutes per side, or until the salmon flakes easily with a fork.",
      "While salmon grills, prepare your side vegetables by grilling or steaming them.",
      "Remove salmon from grill and let rest for 2 minutes.",
      "Serve hot with grilled vegetables and extra lemon wedges on the side.",
    ],
  },
  r8: {
    id: "r8",
    title: "Vegetable Stir Fry",
    image: "/colorful-vegetable-stir-fry.png",
    category: "Asian",
    duration: "15 min",
    ingredients: [
      "2 cups Broccoli florets",
      "1 Bell pepper, sliced",
      "1 Carrot, julienned",
      "1 cup Snap peas",
      "2 cloves Garlic, minced",
      "2 tbsp Soy sauce",
      "1 tbsp Sesame oil",
      "1 tsp Ginger, grated",
      "Sesame seeds for garnish",
    ],
    instructions: [
      "Heat sesame oil in a large wok or skillet over high heat.",
      "Add garlic and ginger, stir-fry for 30 seconds until fragrant.",
      "Add broccoli and carrots first as they take longer to cook. Stir-fry for 3 minutes.",
      "Add bell pepper and snap peas. Continue stir-frying for another 2-3 minutes.",
      "Pour in soy sauce and toss everything together until vegetables are crisp-tender.",
      "Remove from heat and sprinkle with sesame seeds.",
      "Serve immediately over rice or noodles for a complete meal.",
    ],
  },
}

// Helper function to transform TheMealDB meal to our Recipe format
function transformMealDBMeal(meal: TheMealDBMeal): Recipe {
  return {
    id: meal.idMeal,
    title: meal.strMeal,
    image: meal.strMealThumb || "/placeholder.svg",
    category: meal.strCategory || "Unknown",
    duration: "30 min", // TheMealDB doesn't provide duration, using default
  }
}

// Helper function to extract ingredients from TheMealDB meal
function extractIngredients(meal: TheMealDBMeal): string[] {
  const ingredients: string[] = []
  
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}` as keyof TheMealDBMeal] as string | null | undefined
    const measure = meal[`strMeasure${i}` as keyof TheMealDBMeal] as string | null | undefined
    
    if (ingredient && ingredient.trim()) {
      const measureStr = measure && measure.trim() ? `${measure.trim()} ` : ""
      ingredients.push(`${measureStr}${ingredient.trim()}`)
    }
  }
  
  return ingredients
}

// Helper function to parse instructions
function parseInstructions(instructions: string): string[] {
  return instructions
    .split(/\r?\n/)
    .map((step) => step.trim())
    .filter((step) => step.length > 0)
}

// Search recipes from TheMealDB
export async function searchRecipes(query: string): Promise<Recipe[]> {
  if (!query || query.trim().length === 0) {
    return []
  }

  try {
    const response = await fetch(
      `${THEMEALDB_BASE_URL}/search.php?s=${encodeURIComponent(query.trim())}`,
      { cache: "no-store" }
    )
    
    if (!response.ok) {
      throw new Error("Failed to search recipes")
    }

    const data: TheMealDBResponse = await response.json()
    
    if (!data.meals || data.meals.length === 0) {
      return []
    }

    // Filter meals that have images, use placeholder for those without
    const recipes = data.meals
      .map(transformMealDBMeal)
      .map((recipe) => ({
        ...recipe,
        image: recipe.image || "/placeholder.svg",
      }))
      .filter((recipe) => recipe.image && recipe.image !== "")

    return recipes
  } catch (error) {
    console.error("Error searching recipes:", error)
    return []
  }
}

// Get random recipes from TheMealDB
export async function fetchRandomRecipes(count: number = 10): Promise<Recipe[]> {
  try {
    const promises = Array.from({ length: count }, () =>
      fetch(`${THEMEALDB_BASE_URL}/random.php`, { cache: "no-store" })
    )

    const responses = await Promise.all(promises)
    const dataPromises = responses.map((res) => {
      if (!res.ok) throw new Error("Failed to fetch random recipes")
      return res.json()
    })

    const dataArray: TheMealDBResponse[] = await Promise.all(dataPromises)
    
    const recipes: Recipe[] = []
    const seenIds = new Set<string>()

    for (const data of dataArray) {
      if (data.meals && data.meals.length > 0) {
        for (const meal of data.meals) {
          // Avoid duplicates
          if (!seenIds.has(meal.idMeal)) {
            seenIds.add(meal.idMeal)
            const recipe = transformMealDBMeal(meal)
            // Only include recipes with images
            if (recipe.image && recipe.image !== "" && recipe.image !== "/placeholder.svg") {
              recipes.push(recipe)
            }
          }
        }
      }
    }

    return recipes
  } catch (error) {
    console.error("Error fetching random recipes:", error)
    return []
  }
}

// Fetch recipes by category
export async function fetchRecipesByCategory(category: string): Promise<Recipe[]> {
  try {
    const response = await fetch(
      `${THEMEALDB_BASE_URL}/filter.php?c=${encodeURIComponent(category)}`,
      { cache: "no-store" }
    )
    
    if (!response.ok) {
      throw new Error("Failed to fetch recipes by category")
    }

    const data = await response.json()
    
    if (!data.meals || data.meals.length === 0) {
      return []
    }

    // Filter meals that have images
    const recipes = data.meals
      .filter((meal: any) => meal.strMealThumb && meal.strMealThumb !== "")
      .map((meal: any) => ({
        id: meal.idMeal,
        title: meal.strMeal,
        image: meal.strMealThumb || "/placeholder.svg",
        category: category,
        duration: "30 min",
      }))

    return recipes
  } catch (error) {
    console.error("Error fetching recipes by category:", error)
    return []
  }
}

// Fetch all available categories
export async function fetchCategories(): Promise<string[]> {
  try {
    const response = await fetch(`${THEMEALDB_BASE_URL}/list.php?c=list`, { cache: "no-store" })
    
    if (!response.ok) {
      throw new Error("Failed to fetch categories")
    }

    const data = await response.json()
    
    if (!data.meals) {
      return []
    }

    return data.meals.map((cat: any) => cat.strCategory).filter(Boolean)
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
}

// Main fetch function - now uses TheMealDB
export async function fetchRecipes(): Promise<Recipe[]> {
  try {
    // Try to fetch random recipes from TheMealDB
    const recipes = await fetchRandomRecipes(12)
    
    if (recipes.length > 0) {
      return recipes
    }
    
    // Fallback to mock data if API fails
    throw new Error("No recipes found")
  } catch (error) {
    console.error("Error fetching recipes, using fallback:", error)
    // Return mock data for demo
    return [
      {
        id: "r1",
        title: "Creamy Garlic Pasta",
        image: "/creamy-garlic-pasta-with-parmesan.jpg",
        category: "Italian",
        duration: "20 min",
      },
      {
        id: "r2",
        title: "Spicy Chicken Curry",
        image: "/spicy-chicken-curry.png",
        category: "Indian",
        duration: "35 min",
      },
      {
        id: "r3",
        title: "Fresh Garden Salad",
        image: "/garden-vegetable-salad.png",
        category: "Healthy",
        duration: "10 min",
      },
      {
        id: "r4",
        title: "Beef Tacos",
        image: "/beef-tacos-with-toppings.jpg",
        category: "Mexican",
        duration: "25 min",
      },
      {
        id: "r5",
        title: "Sushi Rolls",
        image: "/assorted-sushi-rolls.jpg",
        category: "Japanese",
        duration: "40 min",
      },
      {
        id: "r6",
        title: "Chocolate Cake",
        image: "/decadent-chocolate-cake-slice.jpg",
        category: "Dessert",
        duration: "60 min",
      },
      {
        id: "r7",
        title: "Grilled Salmon",
        image: "/grilled-salmon-with-lemon.jpg",
        category: "Seafood",
        duration: "25 min",
      },
      {
        id: "r8",
        title: "Vegetable Stir Fry",
        image: "/colorful-vegetable-stir-fry.png",
        category: "Asian",
        duration: "15 min",
      },
    ]
  }
}

export async function fetchRecipeById(id: string): Promise<RecipeDetail> {
  try {
    // Try to fetch from TheMealDB first
    const response = await fetch(`${THEMEALDB_BASE_URL}/lookup.php?i=${id}`, { cache: "no-store" })
    
    if (response.ok) {
      const data: TheMealDBResponse = await response.json()
      
      if (data.meals && data.meals.length > 0) {
        const meal = data.meals[0]
        const ingredients = extractIngredients(meal)
        const instructions = parseInstructions(meal.strInstructions)
        
        return {
          id: meal.idMeal,
          title: meal.strMeal,
          image: meal.strMealThumb || "/placeholder.svg",
          category: meal.strCategory || "Unknown",
          duration: "30 min",
          ingredients,
          instructions,
          area: meal.strArea || undefined,
          tags: meal.strTags ? meal.strTags.split(",").map((t) => t.trim()) : undefined,
          youtube: meal.strYoutube || undefined,
        }
      }
    }
    
    // Fallback to old API
    const res = await fetch(`${BASE_URL}/recipes/${id}`, { cache: "no-store" })
    if (!res.ok) throw new Error("Failed to fetch recipe")
    return res.json()
  } catch (error) {
    // Fallback to mock data
    return (
      MOCK_RECIPES_DETAIL[id] || {
        id,
        title: "Recipe Not Found",
        image: "/placeholder.svg",
        category: "Unknown",
        duration: "N/A",
        ingredients: ["Recipe not available"],
        instructions: ["This recipe could not be found."],
      }
    )
  }
}

export async function fetchMealPlans(): Promise<MealPlan[]> {
  try {
    const res = await fetch(`${BASE_URL}/meal-plans`, { cache: "no-store" })
    if (!res.ok) throw new Error("Failed to fetch meal plans")
    return res.json()
  } catch (error) {
    // Return mock data for demo
    return [
      {
        id: "m1",
        title: "Healthy Week Plan",
        description: "A balanced mix of proteins, veggies, and carbs",
        image: "/healthy-meal-prep.png",
        recommended: true,
      },
      {
        id: "m2",
        title: "Quick & Easy Meals",
        description: "Perfect for busy weekdays under 30 minutes",
        image: "/quick-easy-meals-cooking.jpg",
        recommended: false,
      },
      {
        id: "m3",
        title: "Family Favorites",
        description: "Kid-friendly meals the whole family will love",
        image: "/family-dinner.png",
        recommended: false,
      },
    ]
  }
}

export async function fetchMealsByPlanId(planId: string): Promise<Meal[]> {
  // First check user's custom meal plans
  const userPlans = getUserMealPlans()
  const userPlan = userPlans.find((p) => p.id === planId)
  if (userPlan) {
    return userPlan.meals || []
  }

  // Fall back to API or mock data
  try {
    const res = await fetch(`${BASE_URL}/meals?planId=${planId}`, { cache: "no-store" })
    if (!res.ok) throw new Error("Failed to fetch meals")
    const data = await res.json()
    return Array.isArray(data) ? data : []
  } catch (error) {
    // Return mock data if available, otherwise empty array
    return MOCK_MEAL_PLANS[planId] || []
  }
}

export async function fetchCredits(): Promise<Credits> {
  try {
    const res = await fetch(`${BASE_URL}/credits`, { cache: "no-store" })
    if (!res.ok) throw new Error("Failed to fetch credits")
    return res.json()
  } catch (error) {
    // Return mock data for demo - set to 2 to show available credits
    return { creditsLeft: 2 }
  }
}

// User's custom meal plans (stored in localStorage for demo)
export interface UserMealPlan {
  id: string
  title: string
  description: string
  image: string
  meals: Meal[]
  createdAt: string
}

const STORAGE_KEY = "flavoriz_user_meal_plans"

export function getUserMealPlans(): UserMealPlan[] {
  if (typeof window === "undefined") return []
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error("Failed to load user meal plans:", error)
  }
  return []
}

export function saveUserMealPlans(plans: UserMealPlan[]): void {
  if (typeof window === "undefined") return
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plans))
  } catch (error) {
    console.error("Failed to save user meal plans:", error)
    throw new Error("Failed to save meal plan")
  }
}

export async function addRecipeToMealPlan(planId: string, recipe: RecipeDetail): Promise<void> {
  const plans = getUserMealPlans()
  let plan = plans.find((p) => p.id === planId)

  if (!plan) {
    // Try to get template from existing meal plans
    try {
      const allPlans = await fetchMealPlans()
      const templatePlan = allPlans.find((p) => p.id === planId)
      if (templatePlan) {
        plan = {
          id: planId,
          title: templatePlan.title,
          description: templatePlan.description,
          image: templatePlan.image,
          meals: [],
          createdAt: new Date().toISOString(),
        }
        plans.push(plan)
      }
    } catch (error) {
      // If fetch fails, create a default plan
      const planTitles: Record<string, string> = {
        m1: "Healthy Week Plan",
        m2: "Quick & Easy Meals",
        m3: "Family Favorites",
      }
      plan = {
        id: planId,
        title: planTitles[planId] || "My Meal Plan",
        description: "Your custom meal plan",
        image: "/healthy-meal-prep.png",
        meals: [],
        createdAt: new Date().toISOString(),
      }
      plans.push(plan)
    }
  }

  // Check if plan exists
  if (!plan) {
    throw new Error("Meal plan not found")
  }

  // Check if recipe already exists in plan
  const existingMeal = plan.meals.find((m) => m.recipeId === recipe.id)
  if (existingMeal) {
    throw new Error("Recipe already in this meal plan")
  }

  // Add recipe as meal
  const newMeal: Meal = {
    id: `meal-${Date.now()}`,
    title: recipe.title,
    image: recipe.image,
    duration: recipe.duration,
    recipeId: recipe.id,
  }

  plan.meals.push(newMeal)
  saveUserMealPlans(plans)
}

export function getAllMealPlans(): Promise<(MealPlan | UserMealPlan)[]> {
  return fetchMealPlans().then((plans) => {
    const userPlans = getUserMealPlans()
    // Merge user plans with fetched plans, prioritizing user plans
    const allPlans: (MealPlan | UserMealPlan)[] = [...plans]
    
    // Add user plans that don't exist in fetched plans
    userPlans.forEach((userPlan) => {
      if (!allPlans.find((p) => p.id === userPlan.id)) {
        allPlans.push(userPlan)
      }
    })
    
    return allPlans
  })
}
