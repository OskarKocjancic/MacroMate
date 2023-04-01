let days;
let curr_day;
let info;
let food;
function addWorkout() {
	let _age = document.getElementById("popup-age").value;
	let _duration = document.getElementById("popup-duration").value;
	let _exercise = document.getElementById("popup-exercise").value;
	let _weight = document.getElementById("popup-weight").value;
	let _sex = document.querySelector('input[name="sex"]:checked');
	let heart_rate = {
		light: 110,
		moderate: 135,
		vigorous: 150,
	}[_exercise];

	if (_sex.id == "Female") kcal_burned = (_duration * (0.4472 * heart_rate - 0.1263 * _weight + 0.074 * _age - 20.4022)) / 4.184;
	else kcal_burned = (_duration * (0.6309 * heart_rate + 0.1988 * _weight + 0.2017 * _age - 55.0969)) / 4.184;
	curr_day.work_counter += parseInt(kcal_burned);

	info = { age: parseFloat(_age), sex: _sex.id, weight_kg: parseFloat(_weight), duration: parseFloat(_duration) };
	localStorage.setItem("info", JSON.stringify(info));
	updateDays();
	setCaloriesBar(curr_day.kcal_counter, curr_day.work_counter, curr_day.max);
	document.getElementById("popup-age").value = "0";
	document.getElementById("popup-duration").value = "0";
	document.getElementById("popup-weight").value = "0";
}
function addCustomFood() {
	let _proteins = document.getElementById("popup-proteins").value;
	let _carbs = document.getElementById("popup-carbs").value;
	let _fats = document.getElementById("popup-fats").value;
	let _kcal = document.getElementById("popup-calories").value;
	let _name = document.getElementById("popup-name").value;
	let img = document.getElementById("popup-category").value;
	if (isNaN(_proteins) || isNaN(_carbs) || isNaN(_fats) || isNaN(_kcal) || _name.length == 0) return;

	let food1 = { name: _name, kcal: parseFloat(_kcal), proteins: parseFloat(_proteins), carbs: parseFloat(_carbs), fats: parseFloat(_fats), img: img };
	food.push(food1);
	document.getElementById("popup-proteins").value = "0";
	document.getElementById("popup-carbs").value = "0";
	document.getElementById("popup-fats").value = "0";
	document.getElementById("popup-calories").value = "0";
	document.getElementById("popup-name").value = "";
	food.sort((a, b) => (a.name > b.name ? 1 : -1));
	localStorage.setItem("food", JSON.stringify(food));
}
function addCalories() {
	let items = document.querySelector(".Items");
	let food_weight = document.getElementById("popup-food-weight").value;
	let food_name = document.getElementById("popup-food-combo").value;
	let food_item = null;

	food.forEach((f) => {
		if (f.name == food_name) food_item = f;
	});

	max_id = -1;
	curr_day.item_list.forEach((i) => {
		max_id = i.id > max_id ? i.id : max_id;
	});

	let item1 = {
		name: food_name,
		kcal: Math.floor(food_item.kcal * (food_weight / 100)),
		proteins: Math.floor(food_item.proteins * (food_weight / 100)),
		carbs: Math.floor(food_item.carbs * (food_weight / 100)),
		fats: Math.floor(food_item.fats * (food_weight / 100)),
		img: food_item.img,
		id: max_id + 1,
	};
	items.appendChild(createItemElement(item1));

	curr_day.item_list.push(item1);
	curr_day.kcal_counter += item1.kcal;
	curr_day.proteins_counter += item1.proteins;
	curr_day.carbs_counter += item1.carbs;
	curr_day.fats_counter += item1.fats;

	updateDays();
	setCaloriesBar(curr_day.kcal_counter, curr_day.work_counter, curr_day.max);
	drawMacroPie();
}
function addRawCalories() {
	curr_day.kcal_counter += parseFloat(document.getElementById("popup-raw-calories").value);
	document.getElementById("popup-raw-calories").value = "0";

	updateDays();
	setCaloriesBar(curr_day.kcal_counter, curr_day.work_counter, curr_day.max);
	drawMacroPie();
}

function closePopup(popupID) {
	let popup = document.getElementById(popupID);
	popup.style.visibility = "hidden";
	popup.style.opacity = 0;
}
function showPopup(popupID) {
	let popup = document.getElementById(popupID);
	popup.style.visibility = "visible";
	popup.style.opacity = 1;
}
function loadInfo() {
	let age = document.getElementById("popup-age");
	let duration = document.getElementById("popup-duration");
	let weight = document.getElementById("popup-weight");

	info = JSON.parse(localStorage.getItem("info"));
	if (info == null) {
		document.getElementById("Male").checked = true;
		return;
	} else {
		age.value = info.age;
		duration.value = info.duration;
		weight.value = info.weight_kg;
		document.getElementById(info.sex).checked = true;
	}
}

function loadItems() {
	document.querySelector(".Items").replaceChildren();
	curr_day.item_list.forEach((i) => {
		document.querySelector(".Items").appendChild(createItemElement(i));
	});
	setCaloriesBar(curr_day.kcal_counter, curr_day.work_counter, curr_day.max);
	drawMacroPie();
}

function loadFood() {
	food = JSON.parse(localStorage.getItem("food"));
	let select = document.getElementById("popup-food-combo");
	select.replaceChildren();
	food.forEach((f) => {
		let opt = document.createElement("option");
		opt.value = f.name;
		opt.text = f.name;
		select.appendChild(opt);
	});
}
function updateDays() {
	for (let i = 0; i < days.length; i++) {
		if (days[i].date == curr_day.date) {
			days[i] = curr_day;
			break;
		}
	}
	localStorage.setItem("days", JSON.stringify(days));
}

function removeItem(id) {
	document.getElementById("item" + id).remove();
	let l;
	for (let i = 0; i < curr_day.item_list.length; i++) {
		if (curr_day.item_list[i].id == id) {
			l = i;
			break;
		}
	}
	curr_day.kcal_counter -= curr_day.item_list[l].kcal;
	curr_day.proteins_counter -= curr_day.item_list[l].proteins;
	curr_day.fats_counter -= curr_day.item_list[l].fats;
	curr_day.carbs_counter -= curr_day.item_list[l].carbs;

	curr_day.item_list.splice(l, 1);
	updateDays();
	setCaloriesBar(curr_day.kcal_counter, curr_day.work_counter, curr_day.max);
	drawMacroPie();
}

function createItemElement(item) {
	let new_item = document.createElement("div");
	new_item.className = "item flex-center";
	new_item.id = "item" + item.id;

	let tmp;
	tmp = document.createElement("div");
	tmp.className = "flex-center food-icon";
	let image = document.createElement("img");
	image.src = item.img;
	tmp.appendChild(image);
	new_item.appendChild(tmp);

	tmp = document.createElement("div");
	tmp.className = "flex-center food-close";
	let a = document.createElement("a");
	a.className = "button close";
	a.innerHTML = "&#10005";
	a.href = "javascript:void(0)";
	a.setAttribute("onclick", "removeItem(" + item.id + ");");
	tmp.appendChild(a);
	new_item.appendChild(tmp);

	tmp = document.createElement("div");
	tmp.className = "food-label";
	tmp.innerHTML = item.name;
	new_item.appendChild(tmp);

	tmp = document.createElement("div");
	tmp.className = "food-kcal";
	tmp.innerHTML = item.kcal + "Kcal";
	new_item.appendChild(tmp);

	let food_text = document.createElement("div");
	food_text.className = "food-text";

	tmp = document.createElement("div");
	tmp.className = "widget proteins";
	tmp.innerHTML = item.proteins + "g Proteins";
	food_text.appendChild(tmp);

	tmp = document.createElement("div");
	tmp.className = "widget carbs";
	tmp.innerHTML = item.carbs + "g Carbs";
	food_text.appendChild(tmp);

	tmp = document.createElement("div");
	tmp.className = "widget fats";
	tmp.innerHTML = item.fats + "g Fats";
	food_text.appendChild(tmp);

	new_item.appendChild(food_text);
	return new_item;
}
function clearPopups() {
	let proteins = document.getElementById("popup-proteins");
	let carbs = document.getElementById("popup-carbs");
	let fats = document.getElementById("popup-fats");
	let kcal = document.getElementById("popup-calories");
	let name = document.getElementById("popup-name");
	let age = document.getElementById("popup-age");
	let duration = document.getElementById("popup-duration");
	let weight = document.getElementById("popup-weight");
	let sex = document.querySelector('input[name="sex"]:checked');
	proteins.value = "";
	carbs.value = "";
	fats.value = "";
	kcal.value = "";
	name.value = "";
	age.value = "";
	duration.value = "";
	weight.value = "";
	sex.value = "";
}
function setCaloriesBar(kcal, work, max) {
	let kcal_bar = document.querySelector(".tracked-cal-inner");
	let remaining_calories = document.querySelector(".remaining-calories");
	let burned_calories = document.querySelector(".burned-calories");
	let total_calories = document.querySelector(".total-calories");

	remaining_calories.innerHTML = max - kcal + work;
	burned_calories.value = work;
	total_calories.value = max;

	kcal_bar.style.width = ((kcal - work) / max) * 100 + "%";
}
function changeDay(next) {
	let l;
	for (let i = 0; i < days.length; i++) {
		if (days[i].date == curr_day.date) l = i;
	}
	try {
		if (next) {
			if (l < days.length - 1) curr_day = days[l + 1];
		} else if (l > 0) curr_day = days[l - 1];

		document.querySelector(".date").innerHTML = formatDate(curr_day.date);
		loadItems();
	} catch (error) {
		console.log(error);
	}
}
function drawMacroPie() {
	let canvas = document.querySelector(".macro-pie");

	let ctx = canvas.getContext("2d");

	const total = curr_day.carbs_counter + curr_day.fats_counter + curr_day.proteins_counter;
	if (total == 0) ctx.clearRect(0, 0, canvas.width, canvas.height);
	const values = [
		{ sum: curr_day.carbs_counter, shade: "#e5a478" },
		{ sum: curr_day.fats_counter, shade: "#f0d582" },
		{ sum: curr_day.proteins_counter, shade: "#e76666" },
	];
	let currentAngle = 0;

	for (let value of values) {
		let portionAngle = (value.sum / total) * 2 * Math.PI;
		ctx.beginPath();
		ctx.arc(500, 500, 1000, currentAngle, currentAngle + portionAngle);
		currentAngle += portionAngle;
		ctx.lineTo(500, 500);

		ctx.fillStyle = value.shade;
		ctx.fill();
	}
}
function onlyAllowNonEmptyNumericInput(event) {
	const input = event.target;
	const inputValue = input.value;

	const numericValue = inputValue.replace(/[^0-9]/g, "");
	if (numericValue === "") {
		input.value = input.defaultValue || "";
		return;
	}

	input.value = numericValue;
}

function updateGoal() {
	curr_day.max = parseInt(document.querySelector(".total-calories").value);
	curr_day.work_counter = parseInt(document.querySelector(".burned-calories").value);
	setCaloriesBar(curr_day.kcal_counter, curr_day.work_counter, curr_day.max);
}
function generateYearData() {
	const today = new Date();
	const year = today.getUTCFullYear();
	const data = [];

	for (let d = new Date(Date.UTC(year, 0, 1)); d < today; d.setUTCDate(d.getUTCDate() + 1)) {
		const _day = {
			date: d.getTime(),
			item_list: [],
			kcal_counter: 0,
			work_counter: 0,
			proteins_counter: 0,
			carbs_counter: 0,
			fats_counter: 0,
			max: 2000,
		};
		data.push(_day);
	}

	return data;
}

function addMissingDays(data) {
	const lastDate = new Date(data[data.length - 1].date);
	const today = new Date();
	let currentDate = new Date(lastDate);

	while (currentDate.getUTCFullYear() < today.getUTCFullYear() || currentDate.getUTCMonth() < today.getUTCMonth() || currentDate.getUTCDate() < today.getUTCDate()) {
		currentDate = new Date(currentDate.getTime());
		currentDate.setUTCDate(currentDate.getUTCDate() + 1);
		const _day = {
			date: currentDate.getTime(),
			item_list: [],
			kcal_counter: 0,
			work_counter: 0,
			proteins_counter: 0,
			carbs_counter: 0,
			fats_counter: 0,
			max: 2000,
		};
		data.push(_day);
	}

	return data;
}

function formatDate(timestamp) {
	const date = new Date(timestamp);
	const day = String(date.getUTCDate()).padStart(2, "0");
	const month = String(date.getUTCMonth() + 1).padStart(2, "0");
	const year = date.getUTCFullYear();
	return `${day}.${month}.${year}`;
}

document.addEventListener("DOMContentLoaded", () => {
	days = JSON.parse(localStorage.getItem("days"));
	food = JSON.parse(localStorage.getItem("food"));

	if (days == null) {
		days = generateYearData();
		localStorage.setItem("days", JSON.stringify(days));
	} else {
		addMissingDays(days);
		localStorage.setItem("days", JSON.stringify(days));
	}
	curr_day = days[days.length - 1];

	if (food == null) {
		food = generateSampleFood();
		localStorage.setItem("food", JSON.stringify(food));
	}
	showPopup("popup4");
	document.querySelector(".date").innerHTML = formatDate(curr_day.date);
	loadItems();
});
function generateSampleFood() {
	return [
		{
			name: "Banana",
			kcal: 89,
			proteins: 1.1,
			carbs: 22.8,
			fats: 0.3,
			img: "img/fruits.jpg",
		},
		{
			name: "Apple",
			kcal: 52,
			proteins: 0.3,
			carbs: 14,
			fats: 0.2,
			img: "img/fruits.jpg",
		},
		{
			name: "Broccoli",
			kcal: 34,
			proteins: 2.8,
			carbs: 3.6,
			fats: 0.4,
			img: "img/vegetables.jpg",
		},
		{
			name: "Spinach",
			kcal: 23,
			proteins: 2.9,
			carbs: 3.6,
			fats: 0.4,
			img: "img/vegetables.jpg",
		},
		{
			name: "Egg",
			kcal: 78,
			proteins: 6.3,
			carbs: 0.6,
			fats: 5.3,
			img: "img/meats.jpg",
		},
		{
			name: "Chicken breast",
			kcal: 110,
			proteins: 21.2,
			carbs: 0,
			fats: 2.3,
			img: "img/meats.jpg",
		},
		{
			name: "Salmon",
			kcal: 206,
			proteins: 22,
			carbs: 0,
			fats: 13,
			img: "img/meats.jpg",
		},
		{
			name: "White rice",
			kcal: 130,
			proteins: 2.7,
			carbs: 28.7,
			fats: 0.3,
			img: "img/grains.jpg",
		},
		{
			name: "Brown rice",
			kcal: 111,
			proteins: 2.6,
			carbs: 23.5,
			fats: 0.9,
			img: "img/grains.jpg",
		},
		{
			name: "Whole wheat bread",
			kcal: 247,
			proteins: 11.8,
			carbs: 45.4,
			fats: 2.4,
			img: "img/grains.jpg",
		},
		{
			name: "Avocado",
			kcal: 160,
			proteins: 2,
			carbs: 9,
			fats: 15,
			img: "img/fats.jpg",
		},
		{
			name: "Olive oil",
			kcal: 884,
			proteins: 0,
			carbs: 0,
			fats: 100,
			img: "img/fats.jpg",
		},
		{
			name: "Almonds",
			kcal: 576,
			proteins: 21,
			carbs: 22,
			fats: 49,
			img: "img/fats.jpg",
		},
		{
			name: "Carrots",
			kcal: 41,
			proteins: 0.9,
			carbs: 9.6,
			fats: 0.2,
			img: "img/vegetables.jpg",
		},
		{
			name: "Tomatoes",
			kcal: 18,
			proteins: 0.9,
			carbs: 3.9,
			fats: 0.2,
			img: "img/vegetables.jpg",
		},
	];
}
