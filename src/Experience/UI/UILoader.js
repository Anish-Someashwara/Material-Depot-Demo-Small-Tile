export default class UILoader {
	constructor() {
		this.showLoader();
	}

	showLoader() {
		const loaderDiv = document.getElementById("loaderDiv");
		loaderDiv.style.display = "flex";
	}

	hideLoader() {
		const mainDiv = document.getElementById("mainDiv");
		const loaderDiv = document.getElementById("loaderDiv");
		mainDiv.style.opacity = 1;
		loaderDiv.style.display = "none";
	}
}
