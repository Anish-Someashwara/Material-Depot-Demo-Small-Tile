import * as THREE from "three";
import Experience from "./Experience.js";

export default class Renderer {
	constructor() {
		this.experience = new Experience();
		const { domElements, sizes, scene, camera } = this.experience;
		this.canvas = domElements.canvas;
		this.sizes = sizes;
		this.scene = scene;
		this.camera = camera;
		this.bikeDiv = domElements.bikeDiv;

		this.setInstance();
	}

	/**
	 * Will Setup the instance of the renderer with properties
	 */

	setInstance() {
		this.instance = new THREE.WebGLRenderer({
			canvas: this.canvas,
			antialias: true,
			depth: true, depthTexture: true
		});
		this.instance.setSize(this.sizes.x, this.sizes.y);
		this.instance.setClearColor(0xfcfbf7);
		// this.instance.setClearColor(0x000000);
		
		this.instance.toneMapping = THREE.LinearToneMapping;	
		this.instance.toneMappingExposure = 10;
		this.instance.outputColorSpace = THREE.SRGBColorSpace;
		// this.instance.outputEncoding = THREE.sRGBEncoding;
		// this.instance.physicallyCorrectLights = true;
		// this.instance.autoClear = true;
		this.instance.shadowMap.enabled = true;
		this.instance.shadowMap.type = THREE.PCFSoftShadowMap;
		this.instance.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		this.instance.render(this.scene, this.camera.instance);
	}

	/**
	 * Will Resize the renderer
	*/

	resize() {
		this.sizes.x = this.bikeDiv.clientWidth;
		this.sizes.y = this.bikeDiv.clientHeight;
		this.instance.setSize(this.sizes.x, this.sizes.y);
		this.instance.setPixelRatio(Math.min(window.devicePixelRatio, 2));
	}

	update() {
		this.instance.render(this.scene, this.camera.instance);
	}
}
