import { items } from "../Constants.js";
import Experience from "../Experience.js";
import UIItems from "./UIItems.js";

export default class UICategories {
	constructor() {
		this.experience = new Experience();
		this.uiPopups = this.experience.uiPopups;
		this.categoriesDiv = this.experience.domElements.categories;
		// this.categoriesName = ["Style", "Comfort", "Protection", "Personalize"];
		this.categoriesName = ["Comfort"];
		this.addCategories();
		this.uiItems = new UIItems();
	}

	addCategories() {
		const categories = document.createElement("div");
		categories.id = "categories";

		const categoriesList = document.createElement("ul");
		categoriesList.id = "categories-list";

		for (let i = 0; i < this.categoriesName.length; i++) {
			const category = document.createElement("li");
			category.className = "category";
			category.style.height = `${100 / this.categoriesName.length}%`;
			if (i === 0) category.id = "active-category";

			const categoryName = document.createElement("div");
			categoryName.className = "category-Name";
			categoryName.textContent = this.categoriesName[i];

			if (this.categoriesName[i] == "Personalize") {
				category.style.opacity = 0.3;
				category.style.cursor = "not-allowed";
				category.addEventListener("click", () => {
					this.uiPopups.createPersonalizeOnClickAlert();
				});
			} else
				category.addEventListener("click", () => {
					this.setActiveCategory(categoriesList, category);
					this.uiItems.createItemsSection(items[categoryName.textContent]);
				});

			category.appendChild(categoryName);
			categoriesList.appendChild(category);
		}

		categories.appendChild(categoriesList);
		this.categoriesDiv.appendChild(categories);
	}

	setActiveCategory(categoriesList, category) {
		for (let i = 0; i < categoriesList.childNodes.length; i++) {
			if (categoriesList.childNodes[i].id === "active-category") {
				categoriesList.childNodes[i].id = "";
			}
		}
		category.id = "active-category";
	}
}
