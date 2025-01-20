
import { DoubleSide } from "three";

export default class UIPopups {
	constructor() {
		this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
		if (this.isMobile) {
			// console.log("Running on a mobile device: ");
		} else {
			// console.log("Running on a desktop");
		}
		// console.log(this.isMobile)

	}

	createResponsivePoup(){

		// Popup Overlay or backgournd
		const popupBodyOverlay = document.createElement('div');
		popupBodyOverlay.classList.add('popup-overlay-transparent');
		popupBodyOverlay.id = ('hand-controls-popup');

		// Popup window
		var popupBody = document.createElement('div');
		popupBody.classList.add('popup-body');
		popupBody.classList.add('webgl-popup');
		
		popupBodyOverlay.appendChild(popupBody)

		// Popup Close Button
		const closeButton = document.createElement("div");
		closeButton.classList.add('popup-close-btn');
		closeButton.innerHTML = "&#10005;";
		
		// Add event listner on close button to close the popup
		closeButton.addEventListener("click", (event) => {
			event.stopPropagation();
			this.hidePopup(popupBodyOverlay);
		});

		// Popup Main Content Body
		const popupContent = document.createElement('div');
		popupContent.classList.add("popup-content");

		// Added close Btn and Main Content into popup window
		popupBody.appendChild(closeButton)
		popupBody.appendChild(popupContent)

		// this.isMobile = null;
		// Touch Controls - Section
		var touchControls = document.createElement("div");
		touchControls.classList.add('col-1', 'popup-sub-heading');
		if(!this.isMobile)touchControls.innerHTML = "<p>Touch Controls</p>";
		var rotateTouch = this.createControlIcon("handRotate.png", "ROTATE");
		var zoomTouch = this.createControlIcon("handZoom.png", "ZOOM");
		var moveTouch = this.createControlIcon("handMove.png", "MOVE");
		moveTouch.classList.add('button-deactive')
		touchControls.appendChild(rotateTouch);
		touchControls.appendChild(zoomTouch);
		touchControls.appendChild(moveTouch);

		// Horizontal Line Seprator between 'Touch Control' and 'Mouse Control' Section
		const horizontalLine = document.createElement("hr");
		horizontalLine.classList.add('hr-sptr')
		
		// Mouse Controls
		var mouseControls = document.createElement("div");
		mouseControls.classList.add('col-1', 'popup-sub-heading')
		mouseControls.innerHTML = "<p>Mouse Controls</p>";
		var rotateMouse = this.createControlIcon("mouseLeftClick.png", "ROTATE");
		var zoomMouse = this.createControlIcon("mouseMove.png", "ZOOM");
		var zoomRightClick = this.createControlIcon("mouseRightClick.svg", "MOVE");
		zoomRightClick.classList.add('button-deactive');
		mouseControls.appendChild(rotateMouse);
		mouseControls.appendChild(zoomMouse);
		mouseControls.appendChild(zoomRightClick);
		
		
		// Append to popup content 
		if(!this.isMobile){ // If device is desktop then add both touch and mosue controls 
			popupContent.appendChild(touchControls);
			popupContent.appendChild(horizontalLine)
			popupContent.appendChild(mouseControls);
		}
		else{ // If device is mobile then add only mouse controls
			const touchControlHeading = document.createElement("p")
			touchControlHeading.textContent = "Touch Controls";
			popupContent.appendChild(touchControlHeading);
			popupContent.appendChild(touchControls); 
		} 
	
		// Added Controls Popup into Main Screen
		return popupBodyOverlay;
	}


	// Function to create control div
	createControlIcon(imgSrc, text) {
		var controlDiv = document.createElement("div");
		controlDiv.classList.add('flex-col-cc');
		var img = document.createElement("img");
		img.src = "static/images/Controls/" + imgSrc;
		img.alt = `${text} icon`;
		var p = document.createElement("p");
		p.textContent = text;
		controlDiv.appendChild(img);
		controlDiv.appendChild(p);
		return controlDiv;
	}

	createControlsDescriptionPopup() {
		const backgroundOverlay = document.createElement("div");
		backgroundOverlay.id = "controls-description-overlay";

		const controlsDescriptionBody = document.createElement("div");
		controlsDescriptionBody.id = "controls-description-body";

		const controlsDescriptionContent = document.createElement("div");
		controlsDescriptionContent.id = "controls-description-content";

		const touchControlsDiv = document.createElement("div");
		touchControlsDiv.className = "touch-controls-div";

		const mouseControlsDiv = document.createElement("div");
		mouseControlsDiv.className = "mouse-controls-div";

		const touchControlsHeading = document.createElement("p");
		touchControlsHeading.id = "touch-controls-heading";
		touchControlsHeading.textContent = "Touch Controls";

		const mouseControlsHeading = document.createElement("p");
		mouseControlsHeading.id = "mouse-controls-heading";
		mouseControlsHeading.textContent = "Mouse Controls";

		touchControlsDiv.appendChild(touchControlsHeading);
		mouseControlsDiv.appendChild(mouseControlsHeading);

		const controlsDesc = [
			{
				controlName: "ROTATE",
				touchImgURL: "./static/images/Controls/handRotate.png",
				mouseImgURL: "./static/images/Controls/mouseLeftClick.png",
			},
			{
				controlName: "ZOOM",
				touchImgURL: "./static/images/Controls/handZoom.png",
				mouseImgURL: "./static/images/Controls/mouseMove.png",
			},
			{
				controlName: "MOVE",
				touchImgURL: "./static/images/Controls/handMove.png",
				mouseImgURL: "./static/images/Controls/mouseRightClick.svg",
			},
		];

		for (let i = 0; i < controlsDesc.length; i++) {
			const controlsDiv = document.createElement("div");
			controlsDiv.id = "controls-div";

			const controlIcon = document.createElement("img");
			controlIcon.src = controlsDesc[i].touchImgURL;
			controlIcon.alt = `${controlsDesc[i].controlName} icon`;
			controlIcon.id = "control-icon";

			const controlIconDesc = document.createElement("p");
			controlIconDesc.id = "control-icon-desc";
			controlIconDesc.textContent = controlsDesc[i].controlName;

			controlsDiv.appendChild(controlIcon);
			controlsDiv.appendChild(controlIconDesc);

			touchControlsDiv.appendChild(controlsDiv);
		}

		for (let i = 0; i < controlsDesc.length; i++) {
			const controlsDiv = document.createElement("div");
			controlsDiv.id = "controls-div";

			const controlIcon = document.createElement("img");
			controlIcon.src = controlsDesc[i].mouseImgURL;
			controlIcon.alt = `${controlsDesc[i].controlName} icon`;
			controlIcon.id = "control-icon";

			const controlIconDesc = document.createElement("p");
			controlIconDesc.id = "control-icon-desc";
			controlIconDesc.textContent = controlsDesc[i].controlName;

			controlsDiv.appendChild(controlIcon);
			controlsDiv.appendChild(controlIconDesc);

			mouseControlsDiv.appendChild(controlsDiv);
		}
		const closeButton = document.createElement("div");
		closeButton.id = "control-desc-close";
		closeButton.innerHTML = "&#10005;";

		closeButton.addEventListener("click", (event) => {
			event.stopPropagation();
			this.hidePopup(backgroundOverlay);
		});

		const horizontalLine = document.createElement('hr');
		controlsDescriptionContent.appendChild(touchControlsDiv);
		controlsDescriptionContent.appendChild(horizontalLine)
		controlsDescriptionContent.appendChild(mouseControlsDiv);

		controlsDescriptionBody.appendChild(closeButton);
		controlsDescriptionBody.appendChild(controlsDescriptionContent);

		backgroundOverlay.appendChild(controlsDescriptionBody);

		document.body.appendChild(backgroundOverlay);
	}

	createPersonalizeOnClickAlert() {
		const backgroundOverlay = document.createElement("div");
		backgroundOverlay.id = "personalize-background-overlay";

		const personalizeAlert = document.createElement("div");
		personalizeAlert.id = "personalize-alert";

		const personalizeAlertContent = document.createElement("div");
		personalizeAlertContent.id = "personalize-alert-content";

		const personalizeAlertHeading = document.createElement("h1");
		personalizeAlertHeading.id = "personalize-alert-heading";
		personalizeAlertHeading.textContent = "Alert";

		const closeButton = document.createElement("div");
		closeButton.id = "personalize-alert-close";
		closeButton.innerHTML = "&#10005;";

		closeButton.addEventListener("click", (event) => {
			event.stopPropagation();
			this.hidePopup(backgroundOverlay);
		});

		const personalizeAlertMessage = document.createElement("p");
		personalizeAlertMessage.id = "personalize-alert-message";
		personalizeAlertMessage.innerHTML =
			"Personalized Badge is available only on the purchase of seats or alloys and an additional spend of <b>&#x20B9;4000</b> on accessories.";

		const okButton = document.createElement("div");
		okButton.id = "personalize-alert-ok";
		okButton.textContent = "Ok";
		okButton.addEventListener("click", (event) => {
			event.stopPropagation();
			this.hidePopup(backgroundOverlay);
		});

		personalizeAlertContent.appendChild(personalizeAlertHeading);
		personalizeAlertContent.appendChild(personalizeAlertMessage);
		personalizeAlert.appendChild(closeButton);
		personalizeAlert.appendChild(personalizeAlertContent);
		backgroundOverlay.appendChild(personalizeAlert);
		personalizeAlert.appendChild(okButton);

		document.body.appendChild(backgroundOverlay);
	}

	hidePopup(backgroundOverlay, parent = document.body) {
		parent.removeChild(backgroundOverlay);
	}

	createInfoPopup(heading, data, img) {
		const infoPopupBackgroundOverlay = document.createElement("div");
		infoPopupBackgroundOverlay.id = "infoPopupBackgroundOverlay";
		infoPopupBackgroundOverlay.classList.add('fade');

		const infoPopup = document.createElement("div");
		infoPopup.id = "infoPopup";
		infoPopup.classList.add('transition-from-top')

		const infoPopupContent = document.createElement("div");
		infoPopupContent.id = "infoPopupContent";

		const infoContentHeading = document.createElement("p");
		infoContentHeading.id = "infoContentHeading";
		infoContentHeading.innerHTML = `${heading} Information`;

		const infoItemImage = document.createElement("img");
		infoItemImage.src = img;
		infoItemImage.id = "infoItemImage";

		const infoItemData = document.createElement("div");
		infoItemData.id = "infoItemData";
		const infoItemContent = document.createElement("p");
		infoItemContent.className = "line-clamp-4";
		infoItemContent.innerHTML = data;
		infoItemData.appendChild(infoItemContent)

		// Delay the check to allow the content to render
		setTimeout(() => {
			if (infoItemContent.offsetHeight < infoItemContent.scrollHeight ||
				infoItemContent.offsetWidth < infoItemContent.scrollWidth) {
				const readMoreButton = document.createElement("button");
				readMoreButton.textContent = "Show more";
				readMoreButton.classList.add("underline", "show-more-less-text");
				readMoreButton.addEventListener("click", function() {
					infoItemContent.classList.remove("line-clamp-4");
					readMoreButton.style.display = "none";
					readLessButton.style.display = "inline-block";
				});

				// Create "Read Less" button
				const readLessButton = document.createElement("button");
				readLessButton.textContent = "Show less";
				readLessButton.classList.add("underline", "show-more-less-text");
				readLessButton.style.display = "none";
				readLessButton.addEventListener("click", function() {
					infoItemContent.classList.add("line-clamp-4");
					readLessButton.style.display = "none";
					readMoreButton.style.display = "inline-block";
				});

				infoItemData.appendChild(readMoreButton);
				infoItemData.appendChild(readLessButton);


			} 
		}, 0);

		const closeButton = document.createElement("div");
		closeButton.id = "infoClose";
		closeButton.innerHTML = "&#10005;";

		closeButton.addEventListener("click", (event) => {
			event.stopPropagation();
			this.hidePopup(infoPopupBackgroundOverlay);
		});

		infoPopupContent.appendChild(infoContentHeading);
		infoPopupContent.appendChild(infoItemImage);
		infoPopupContent.appendChild(infoItemData);

		infoPopup.appendChild(closeButton);
		infoPopup.appendChild(infoPopupContent);

		infoPopupBackgroundOverlay.appendChild(infoPopup);

		document.body.appendChild(infoPopupBackgroundOverlay);
	}
}
