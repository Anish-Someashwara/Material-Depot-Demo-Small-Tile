import * as THREE from 'three';
import Bike from './Bike.js';
import RaycasterManager from './RaycasterManager.js';
import UICategories from './UI/UICategories.js';
import Camera from './Camera.js';
import Renderer from './Renderer.js';
import Loaders from './Loaders.js';
import Lights from './Lights.js';
import Ground from './Ground.js';
import UILoader from './UI/UILoader.js';
import UIPopups from './UI/UIPopups.js';
import ResourceManager from './ResourceManager.js';
import DebuggerDatGUI from './DebuggerDatGUI.js';
// import BloomEffect  from './PostProcessing/BloomEffect.js';




let _instance = null;
export default class Experience {
	constructor() {
		if (_instance) {
			return _instance;
		}
		_instance = this;

		this.loaders = new Loaders();
		this.resourceManager = new ResourceManager();


		this.clock = new THREE.Clock();
		THREE.ColorManagement.enabled = true;
		this.scene = new THREE.Scene();


		//Dom Elements
		this.domElements = {
			canvas: document.getElementById('webgl'),
			categories: document.getElementById('categories-section'),
			items: document.getElementById('items-section'),
			bikeDiv: document.getElementById('bike-section'),
		};

		// Sizes
		this.sizes = {
			x: this.domElements.bikeDiv.clientWidth,
			y: this.domElements.bikeDiv.clientHeight,
		};

		this.intersectedObjects = []; // Push those objects with whom you want to check intersection with mouse.

		this.camera = new Camera();
		this.renderer = new Renderer();
		this.uiLoader = new UILoader();
		this.uiPopups = new UIPopups();
		this.lights = new Lights();
		this.ground = new Ground();
		this.bike = new Bike();
		// this.uiCategories = new UICategories();
		this.raycasterManager = new RaycasterManager();
		this.debuggerDatGUI = new DebuggerDatGUI();

		// this.bulbBloomEffect = new BloomEffect();
		// this.effectsHandler = new EffectsHandler();
		// this.effectsHandler.setupEffectComposer();
		// const renderPass = new RenderPass(this.scene, this.camera.instance);
		// this.effectsHandler.addPassToEffectComposer(renderPass);


		// this.gtaoPass = new GTAOPostProcessing().init();
		// this.saoPass = new SAOPostProcessing().init();
		
		// this.dofEffect2 = new DOF1PostProcessing();
		// this.dofEffect2.init();

		// this.dofEffect = new  DepthOfField(this.scene, this.camera.instance);

		// this.dofEffect2 = new DOF2PostProcessing();
		// this.dofEffect2.initPostprocessing();
		
		
		// Axis Helper
		// const axesHelper = new THREE.AxesHelper(500);
		// this.scene.add(axesHelper);
		// axesHelper.visible = true;

		window.addEventListener('resize', () => {
			this.resize();
		});

		
		this.update();

		// setTimeout(() => {
			this.uiLoader.hideLoader();
		// }, 500);

	}

	resize() {
		this.camera && this.camera.resize();
		this.renderer && this.renderer.resize();
		if (this.bulbBloomEffect) this.bulbBloomEffect.onResize();

		this.effectsHandler && this.effectsHandler.resize();
	}

	update() {
		const delta = this.clock.getDelta();
		const elapsed = this.clock.getElapsedTime();

		if (this.camera) this.camera.update(delta);
		if (this.bike) this.bike.update(delta);
		if (this.renderer) this.renderer.update();
		if (this.effectsHandler) this.effectsHandler.update();
		if (this.dofEffect2) this.dofEffect2.update();

		if (!this.bulbBloomEffect && this.renderer) this.renderer.update();
		if (this.bulbBloomEffect) this.bulbBloomEffect.update(delta);
		window.requestAnimationFrame(() => { this.update(); });
	}
}
