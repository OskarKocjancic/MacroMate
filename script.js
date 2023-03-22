let day;

function addCalories() {
	items = document.querySelector(".Items");
	let proteins = document.getElementById("popup-proteins").value;
	let carbs = document.getElementById("popup-carbs").value;
	let fats = document.getElementById("popup-fats").value;
	let kcal = document.getElementById("popup-calories").value;
	let name = document.getElementById("popup-name").value;
	items.appendChild(createItemElement(name, kcal, proteins, carbs, fats, "img/food1.svg"));
	clearCaloriePopup();
	setCaloriesWorkout(50, 75);
}
function createItemElement(name, kcal, proteins, carbs, fats, image_src) {
	let new_item = document.createElement("div");
	new_item.className = "item flex-center";
	let tmp;
	tmp = document.createElement("div");
	tmp.className = "flex-center food-icon";
	let image = document.createElement("img");
	image.src = image_src;
	tmp.appendChild(image);
	new_item.appendChild(tmp);
	tmp = document.createElement("div");
	tmp.className = "flex-center food-close";
	let a = document.createElement("a");
	a.className = "button close";
	a.href = "";
	a.innerHTML = "Remove";
	tmp.appendChild(a);
	new_item.appendChild(tmp);

	tmp = document.createElement("div");
	tmp.className = "food-label";
	tmp.innerHTML = name;
	new_item.appendChild(tmp);

	tmp = document.createElement("div");
	tmp.className = "food-kcal";
	tmp.innerHTML = kcal + "Kcal";
	new_item.appendChild(tmp);

	let food_text = document.createElement("div");
	food_text.className = "flex-center food-text";

	tmp = document.createElement("div");
	tmp.className = "widget proteins";
	tmp.innerHTML = proteins + "g Protein";
	food_text.appendChild(tmp);

	tmp = document.createElement("div");
	tmp.className = "widget carbs";
	tmp.innerHTML = carbs + "g Carbs";
	food_text.appendChild(tmp);

	tmp = document.createElement("div");
	tmp.className = "widget fats";
	tmp.innerHTML = fats + "g Fats";
	food_text.appendChild(tmp);

	new_item.appendChild(food_text);
	return new_item;
}
function clearCaloriePopup() {
	let proteins = document.getElementById("popup-proteins");
	let carbs = document.getElementById("popup-carbs");
	let fats = document.getElementById("popup-fats");
	let kcal = document.getElementById("popup-calories");
	let name = document.getElementById("popup-name");
	proteins.value = "";
	carbs.value = "";
	fats.value = "";
	kcal.value = "";
	name.value = "";
}
function setCaloriesWorkout(kcal_p, work_p) {
	let kcal_bar = document.querySelector(".tracked-cal-inner");
	let work_bar = document.querySelector(".tracked-workout-inner");
	kcal_bar.style.width = kcal_p + "%";
	work_bar.style.width = work_p + "%";
}
function setDate(universal_time) {
	let d = new Date(universal_time);
	let date = document.querySelector(".date");
	d = d.toString().split(" ");
	d = d.splice(1, 3);
	date.innerHTML = d.join(" ");
}
document.addEventListener("DOMContentLoaded", () => {
	day = {
		item_list: [],
		kcal_counter: 500,
		work_counter: 250,
		kcal_max: 2000,
	};
	setCaloriesWorkout(day.kcal_counter / day.kcal_max*100, day.work_counter / day.kcal_max*100);
	setDate(Date.now());
});
