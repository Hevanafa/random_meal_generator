import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/tauri";
import { range } from "lodash";
import axios from "axios";
import "./App.css";

class Meal {
	idMeal: string; // "52860",
    strMeal: string; // Chocolate Raspberry Brownies,
    strDrinkAlternate: null;
    strCategory: string; // "Dessert",
    strArea: string; // "American",
    strInstructions: string; // "Heat oven to 180C/160C fan/gas 4. Line a 20 x 30cm baking tray tin with baking parchment. Put the chocolate, butter and sugar in a pan and gently melt, stirring occasionally with a wooden spoon. Remove from the heat.\r\nStir the eggs, one by one, into the melted chocolate mixture. Sieve over the flour and cocoa, and stir in. Stir in half the raspberries, scrape into the tray, then scatter over the remaining raspberries. Bake on the middle shelf for 30 mins or, if you prefer a firmer texture, for 5 mins more. Cool before slicing into squares. Store in an airtight container for up to 3 days.",
    strMealThumb: string; // "https://www.themealdb.com/images/media/meals/yypvst1511386427.jpg",
    strTags: string; // "Chocolate,Desert,Snack",
    strYoutube: string; // "https://www.youtube.com/watch?v=Pi89PqsAaAg,

    strIngredient1: string; // "Dark Chocolate,
    strIngredient2: string; // "Milk Chocolate,
    strIngredient3: string; // "Salted Butter,

    strMeasure1: string; // "200g",
    strMeasure2: string; // "100g ",
    strMeasure3: string; // "250g",

    strSource: string; // "https://www.bbcgoodfood.com/recipes/2121648/bestever-chocolate-raspberry-brownies",
    strImageSource: null;
    strCreativeCommonsConfirmed: null;
    dateModified: null;

	constructor(raw: Partial<Meal>) {
		Object.assign(this, raw);
	}

	hasIngredient(idx: number) {
		return Object.hasOwn(this, `strIngredient${ idx }`) &&
			(this as any)[`strIngredient${ idx }`].length > 0;
	}

	getStrIngredient(idx: number): string | undefined {
		return (this as any)["strIngredient" + idx];
	}

	// 1-20
	getStrMeasure(idx: number): string | undefined {
		return (this as any)["strMeasure" + idx];
	}
}

interface ResponseData {
	meals: Array<Meal>;
}

function MealJsx(props: { meal: Meal | null }) {
	if (!props.meal) return null;

	const { meal } = props;

	return (
		<div className="meal-container">
			<div className="row">
				<div className="cell">
					<img src={ meal.strMealThumb } alt={ "the picture of " + meal.strMeal } />

					<p>
						<strong>Category: </strong>
						{ meal.strCategory }
					</p>

					<p>
						<strong>Area: </strong>
						{ meal.strArea }
					</p>

					<p>
						<strong>Tags:</strong>
						{ meal.strTags.replaceAll(",", ", ") }
					</p>

					<h2>Ingredients</h2>

					<ul>
					{
						range(1, 21)
						.filter(i => meal.hasIngredient(i))
						.map(i =>
							<li key={"ingredient_" + i}>
								{ meal.getStrIngredient(i) + ": " + meal.getStrMeasure(i) }
							</li>
						)
					}
					</ul>
				</div>

				<div className="cell">
					<h2>{ meal.strMeal }</h2>
					<p>ID: { meal.idMeal }</p>

					<p className="instructions">{ meal.strInstructions }</p>
				</div>
			</div>


			<h2>YouTube Video</h2>

			<div className="youtube-row">
				<iframe width="560" height="315"
					src={ "https://www.youtube.com/embed/" + (meal.strYoutube.split("?").at(-1) ?? "") } // "https://www.youtube.com/embed/5Q5cNoCxp1g"
					title="YouTube video player"
					frameBorder="0"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
					allowFullScreen />
			</div>
		</div>
	);
}

function App() {
	// const [greetMsg, setGreetMsg] = useState("");
	// const [name, setName] = useState("");
	const [isFetching, setIsFetching] = useState(false);
	const [meal, setMeal] = useState<Meal | null>(null);

	// async function greet() {
	// 	// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
	// 	setGreetMsg(await invoke("greet", { name }));
	// }

	async function fetchMeal() {
		setIsFetching(true);

		try {
			const { data, status } = await axios.get<ResponseData>(
				"https://www.themealdb.com/api/json/v1/1/random.php",
				{ 
					timeout: 10000,
					headers: { Accept: "application/json" }});

			console.log(data);

			setMeal(new Meal(data.meals[0]));
		} finally {
			setIsFetching(false);
		}
	}

	return (
		<div className="container">
			<div className="heading-box">
				<h1>Random Meal Generator</h1>

				<button type="button" onClick={() => fetchMeal()}>
					Get Meal
				</button>
			</div>

			<MealJsx meal={meal} />
		</div>
	);
}

export default App;
