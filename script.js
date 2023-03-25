let days;
let curr_day;
let info;

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

	info = { age: parseInt(_age), sex: _sex.id, weight_kg: parseInt(_weight) };
	localStorage.setItem("info", JSON.stringify(info));
	updateDays();
	setCaloriesBar(curr_day.kcal_counter, curr_day.work_counter, curr_day.max);
	clearPopups();
}
function addCalories() {
	let items = document.querySelector(".Items");
	let _proteins = document.getElementById("popup-proteins").value;
	let _carbs = document.getElementById("popup-carbs").value;
	let _fats = document.getElementById("popup-fats").value;
	let _kcal = document.getElementById("popup-calories").value;
	let _name = document.getElementById("popup-name").value;
	let _category = document.getElementById("popup-category").value;
	max_id = -1;
	if (isNaN(_proteins) || isNaN(_carbs) || isNaN(_fats) || isNaN(_kcal) || _name.length == 0) return;

	curr_day.item_list.forEach((i) => {
		max_id = i.id > max_id ? i.id : max_id;
	});

	let item1 = { name: _name, kcal: parseFloat(_kcal), proteins: parseFloat(_proteins), carbs: parseFloat(_carbs), fats: parseFloat(_fats), img: _category, id: max_id + 1 };

	curr_day.item_list.push(item1);
	curr_day.kcal_counter += item1.kcal;
	updateDays();
	setCaloriesBar(curr_day.kcal_counter, curr_day.work_counter, curr_day.max);
	items.appendChild(createItemElement(item1));
	clearPopups();
}

function loadItems() {
	document.querySelector(".Items").replaceChildren();
	console.log(curr_day);

	curr_day.item_list.forEach((i) => {
		document.querySelector(".Items").appendChild(createItemElement(i));
	});
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
	console.log("loading info");
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
		weight.value = info.weight;
		console.log(info);
		document.getElementById(info.sex).checked = true;
	}
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
	curr_day.item_list.splice(l, 1);
	updateDays();
	setCaloriesBar(curr_day.kcal_counter, curr_day.work_counter, curr_day.max);
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
	a.innerHTML = "Remove";
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
	//let work_bar = document.querySelector(".tracked-workout-inner");

	/* 	kcal_bar.innerHTML = "Calories consumed: " + kcal;
	work_bar.innerHTML = "Calories burned:  " + work; */

	kcal_bar.style.width = ((kcal - work) / max) * 100 + "%";
	/* 	work_bar.style.width = (work / max) * 100 + "%"; */
}
function getDateString() {
	let d = new Date();
	let result = d.getFullYear() + "/" + (d.getMonth() + 1) + "/" + d.getDate();
	return result;
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

		document.querySelector(".date").innerHTML = curr_day.date;
		loadItems();
	} catch (error) {
		console.log(error);
	}
}

function updateGoal() {
	curr_day.max = parseInt(document.querySelector(".total-calories").value);
	curr_day.work_counter = parseInt(document.querySelector(".burned-calories").value);
	setCaloriesBar(curr_day.kcal_counter, curr_day.work_counter, curr_day.max);
}
document.addEventListener("DOMContentLoaded", () => {
	days = JSON.parse(localStorage.getItem("days"));

	if (days == null) {
		days = [];
		days.push({
			date: "2023/3/21",
			item_list: [
				{ name: "one", kcal: 200, proteins: 10, carbs: 20, fats: 5, img: "img/fruits.jpg", id: 0 },
				{ name: "two", kcal: 200, proteins: 10, carbs: 20, fats: 5, img: "img/fruits.jpg", id: 1 },
			],
			kcal_counter: 400,
			work_counter: 0,
			proteins_counter: 20,
			carbs_counter: 40,
			fats_counter: 10,
			max: 1111,
		});
		days.push({
			date: "2023/3/22",
			item_list: [
				{ name: "one", kcal: 100, proteins: 10, carbs: 30, fats: 40, img: "img/vegetables.jpg", id: 0 },
				{ name: "two", kcal: 200, proteins: 10, carbs: 30, fats: 40, img: "img/fruits.jpg", id: 1 },
				{ name: "three", kcal: 300, proteins: 10, carbs: 30, fats: 40, img: "img/meats.jpg", id: 2 },
			],
			kcal_counter: 600,
			work_counter: 0,
			proteins_counter: 30,
			carbs_counter: 90,
			fats_counter: 120,
			max: 2222,
		});
		days.push({
			date: "2023/3/23",
			item_list: [
				{ name: "one", kcal: 100, proteins: 12, carbs: 20, fats: 0, img: "img/vegetables.jpg", id: 0 },
				{ name: "two", kcal: 200, proteins: 12, carbs: 20, fats: 0, img: "img/fruits.jpg", id: 1 },
				{ name: "three", kcal: 300, proteins: 12, carbs: 20, fats: 0, img: "img/meats.jpg", id: 2 },
			],
			kcal_counter: 600,
			work_counter: 0,
			proteins_counter: 36,
			carbs_counter: 60,
			fats_counter: 0,
			max: 3333,
		});
		localStorage.setItem("days", JSON.stringify(days));
	}
	console.log(days);
	curr_day = days[days.length - 1];
	console.log(curr_day);

	if (curr_day.date < getDateString()) {
		_day = {
			date: getDateString(),
			item_list: [
				{ name: "one", kcal: 100, proteins: 10, carbs: 10, fats: 10, img: "img/vegetables.jpg", id: 0 },
				{ name: "two", kcal: 200, proteins: 20, carbs: 10, fats: 10, img: "img/fruits.jpg", id: 1 },
				{ name: "three", kcal: 300, proteins: 30, carbs: 20, fats: 10, img: "img/meats.jpg", id: 2 },
			],
			kcal_counter: 600,
			work_counter: 0,
			proteins_counter: 60,
			carbs_counter: 40,
			fats_counter: 30,
			max: 3333,
		};
		curr_day = _day;
		days.push(curr_day);
		localStorage.setItem("days", JSON.stringify(days));
	}

	document.querySelector(".date").innerHTML = curr_day.date;
	loadItems();
});

function drawMacroPie() {
	let canvas = document.querySelector(".macro-pie");

	let ctx = canvas.getContext("2d");

	const total = curr_day.carbs_counter + curr_day.fats_counter + curr_day.proteins_counter;
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
