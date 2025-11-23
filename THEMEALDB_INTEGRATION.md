# TheMealDB API Integration

The app now integrates with [TheMealDB API](https://www.themealdb.com/api.php) to fetch real recipe data!

## Features

✅ **Real Recipe Data** - Fetches recipes from TheMealDB's extensive database  
✅ **Search Functionality** - Search recipes by name  
✅ **Category Filtering** - Filter recipes by category  
✅ **Image Handling** - Only shows recipes with images, uses placeholder for missing images  
✅ **Automatic Fallback** - Falls back to mock data if API fails  

## API Endpoints Used

### 1. Search Recipes
```
GET https://www.themealdb.com/api/json/v1/1/search.php?s={query}
```
Searches for recipes by name.

**Example:**
```typescript
const recipes = await searchRecipes("Arrabiata")
// Returns array of Recipe objects
```

### 2. Get Recipe by ID
```
GET https://www.themealdb.com/api/json/v1/1/lookup.php?i={id}
```
Gets full recipe details including ingredients and instructions.

**Example:**
```typescript
const recipe = await fetchRecipeById("52771")
// Returns RecipeDetail with ingredients and instructions
```

### 3. Get Recipes by Category
```
GET https://www.themealdb.com/api/json/v1/1/filter.php?c={category}
```
Gets all recipes in a specific category.

**Example:**
```typescript
const recipes = await fetchRecipesByCategory("Vegetarian")
// Returns array of Recipe objects
```

### 4. Get Random Recipes
```
GET https://www.themealdb.com/api/json/v1/1/random.php
```
Gets a random recipe (called multiple times for multiple recipes).

**Example:**
```typescript
const recipes = await fetchRandomRecipes(10)
// Returns 10 random Recipe objects
```

### 5. Get Categories
```
GET https://www.themealdb.com/api/json/v1/1/list.php?c=list
```
Gets all available categories.

**Example:**
```typescript
const categories = await fetchCategories()
// Returns array of category names
```

## Data Transformation

TheMealDB uses a different data structure than our app. The integration automatically transforms:

### TheMealDB Format → Our Format

```typescript
// TheMealDB
{
  idMeal: "52771",
  strMeal: "Spicy Arrabiata Penne",
  strMealThumb: "https://...",
  strCategory: "Vegetarian",
  strIngredient1: "penne rigate",
  strMeasure1: "1 pound",
  // ... more ingredients
  strInstructions: "Bring a large pot..."
}

// Our Format
{
  id: "52771",
  title: "Spicy Arrabiata Penne",
  image: "https://...",
  category: "Vegetarian",
  ingredients: ["1 pound penne rigate", "1/4 cup olive oil", ...],
  instructions: ["Bring a large pot...", "In a large skillet..."]
}
```

## Image Handling

The integration ensures all recipes have images:

1. **Uses TheMealDB image** if available (`strMealThumb`)
2. **Falls back to placeholder** (`/placeholder.svg`) if image is missing
3. **Filters out recipes** without images when fetching lists

## Search Implementation

The home page now includes:

- **Debounced Search** - Waits 500ms after typing stops before searching
- **Real-time Results** - Updates as you type (after debounce)
- **Category Integration** - Categories loaded from TheMealDB
- **Loading States** - Shows loading indicators during API calls

## Usage Examples

### Search Recipes
```typescript
import { searchRecipes } from "@/lib/api"

// Search for "pasta"
const recipes = await searchRecipes("pasta")
// Returns recipes matching "pasta"
```

### Get Recipe Details
```typescript
import { fetchRecipeById } from "@/lib/api"

// Get full recipe details
const recipe = await fetchRecipeById("52771")
// Returns RecipeDetail with ingredients and instructions
```

### Filter by Category
```typescript
import { fetchRecipesByCategory } from "@/lib/api"

// Get all vegetarian recipes
const recipes = await fetchRecipesByCategory("Vegetarian")
// Returns all recipes in Vegetarian category
```

## How It Works

1. **User types in search bar** → Debounced after 500ms
2. **API call to TheMealDB** → `search.php?s={query}`
3. **Transform data** → Convert TheMealDB format to our format
4. **Filter images** → Only include recipes with images
5. **Display results** → Show recipes in grid

## Error Handling

- **API fails** → Falls back to mock data
- **No results** → Shows "No recipes found" message
- **Network error** → Gracefully handles and shows error
- **Missing image** → Uses placeholder image

## Performance Optimizations

1. **Debouncing** - Prevents excessive API calls while typing
2. **Caching** - Uses `cache: "no-store"` for fresh data
3. **Image filtering** - Only fetches recipes with images
4. **Parallel requests** - Fetches categories and recipes simultaneously

## TheMealDB Data Structure

TheMealDB provides:
- Recipe name, category, area (cuisine)
- Ingredients (up to 20) with measurements
- Step-by-step instructions
- Recipe image (thumbnail)
- YouTube video link (if available)
- Tags

All of this is automatically transformed to our app's format!

## Testing

Try searching for:
- "pasta" - Italian pasta dishes
- "chicken" - Chicken recipes
- "cake" - Dessert recipes
- "curry" - Curry dishes

Or browse by category:
- Vegetarian
- Beef
- Chicken
- Dessert
- Seafood

## Future Enhancements

Potential additions:
- [ ] Filter by area (cuisine type)
- [ ] Filter by tags
- [ ] Show YouTube video links
- [ ] Recipe favorites/bookmarks
- [ ] Recipe ratings
- [ ] Ingredient substitution suggestions

## API Rate Limits

TheMealDB is a free API with no authentication required. However:
- Be respectful with request frequency
- Consider implementing request caching
- Handle rate limits gracefully if they occur

## Summary

The app now has **real recipe data** from TheMealDB! Users can:
- ✅ Search for any recipe
- ✅ Browse by category
- ✅ View full recipe details
- ✅ See ingredients and instructions
- ✅ View recipe images

All with automatic fallback to mock data if the API is unavailable.

