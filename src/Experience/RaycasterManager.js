import * as THREE from 'three';
import Experience from './Experience.js';

export default class RaycasterManager {
	constructor() {
		this.experience = new Experience();
		const { domElements, sizes, camera, intersectedObjects, bike } =
			this.experience;
		this.canvas = domElements.canvas;
		this.sizes = sizes;
		this.camera = camera.instance;
		this.raycaster = new THREE.Raycaster();
		this.mouse = new THREE.Vector2();
		this.bike = bike;

		// Will store the Objects which will trigger the click events for rayacaster
		this.intersectedObjects = intersectedObjects;

		this.setupEventListeners();

		this.cnt = 0;
	}

	/**
	 * Setting up event Listeners for Triggering events
	 */

	setupEventListeners() {
		// For getting current mouse position
		this.canvas.addEventListener('mousemove', (e) => {
			this.mouseMove(e);
		});

		// this.canvas.addEventListener("click", (e) => {
		// 	this.mouseClick(e);
		// });

		this.canvas.addEventListener('dblclick', (e) => {
			this.mouseClick(e);
		});
	}

	// calibrating the mouse according to the canvas size
	mouseMove(event) {
		// Use the actual canvas size instead of the full screen size
		const canvasBoundingRect = this.canvas.getBoundingClientRect();

		// Calculate normalized device coordinates based on the canvas size and position
		this.mouse.x =
			((event.clientX - canvasBoundingRect.left) / canvasBoundingRect.width) *
				2 -
			1;
		this.mouse.y =
			-((event.clientY - canvasBoundingRect.top) / canvasBoundingRect.height) *
				2 +
			1;
	}

	// Handling click on objects

	mouseClick() {
		this.raycaster.setFromCamera(this.mouse, this.camera);
		/**
		 * Will check for intersection with objects that are stored the
		 * intersectedObjects and return an Array of objects intersected with
		 */
		this.intersects = this.raycaster.intersectObjects(this.intersectedObjects);
		console.log(this.intersects);

		this.experience.debuggerDatGUI.removePropsFromFolder(
			'CustomMaterialFolder',
		); // Remove  old custom material
		this.experience.debuggerDatGUI.removePropsFromFolder('MaterialProperties'); // Remove  old material properties

		if (this.intersects.length > 0) {
			// this.bike.zoomAnimation(this.intersects[0]);
			this.experience.debuggerDatGUI.setupGUIForObject(this.intersects[0]);
			this.cnt++;
		}
	}
}
