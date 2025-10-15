const BASE_URL = "https://api.myrecipeapp.com"

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

export async function fetchRecipes(): Promise<Recipe[]> {
  try {
    const res = await fetch(`${BASE_URL}/recipes`, { cache: "no-store" })
    if (!res.ok) throw new Error("Failed to fetch recipes")
    return res.json()
  } catch (error) {
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
    const res = await fetch(`${BASE_URL}/recipes/${id}`, { cache: "no-store" })
    if (!res.ok) throw new Error("Failed to fetch recipe")
    return res.json()
  } catch (error) {
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
  try {
    const res = await fetch(`${BASE_URL}/meals?planId=${planId}`, { cache: "no-store" })
    if (!res.ok) throw new Error("Failed to fetch meals")
    return res.json()
  } catch (error) {
    return (
      MOCK_MEAL_PLANS[planId] || [
        {
          id: "meal1",
          title: "Meal Not Found",
          image: "/placeholder.svg",
          duration: "N/A",
          recipeId: "r1",
        },
      ]
    )
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
