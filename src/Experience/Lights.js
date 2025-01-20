import * as THREE from "three"
import Experience from "./Experience.js";

import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';    // *** for webpack devServer
// import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';       // *** for build


import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js';
// import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js';
// import { RectAreaLightUniformsLib } from 'https://unpkg.com/three@0.158.0/examples/jsm/lights/RectAreaLightUniformsLib.js';

export default class Lights {
	constructor() {
		this.experience = new Experience();
		RectAreaLightUniformsLib.init();
		this.setupLightsGroup();
		// this.setupAmbientLight(0xffffff, 2);
		// this.setupAmbientLight(0xa27029, 2);

		// this.setupDirectionalLight(
		// 	0xffffff,
		// 	0.05,
		// 	new THREE.Vector3(-200, 300, 200),
		// 	false,
		// );

		// this.setupSpotLight(0xffffff, 5, 500,  Math.PI / 180 * 38, 1, 1);
		// this.setupSpotLight(0xffffff, 0.5, 900,  Math.PI / 180 * 10, 1, 0, new THREE.Vector3(-500, 100, 400), 0xeb836a);
		
		// this.setupSpotLight(0xffffff, 1800000, 200,  Math.PI / 180 * 38, 0, 2, new THREE.Vector3(100, 0, -100), 0xfcba03);
		// this.setupSpotLight(0xf06573, 5, 900,  Math.PI / 180 * 10, 1, 0, new THREE.Vector3(-500, 100, 400), 0xeb836a);
		// this.setupSpotLight(0xffffff, 1800000, 200,  Math.PI / 180 * 38, 0, 2, new THREE.Vector3(-100, 0, -100), 0x6080d6);
		// this.setupSpotLight(0xffffff, 1800000, 200,  Math.PI / 180 * 38, 0, 2, new THREE.Vector3(100, 0, 100), 0xab60d6);

		// this.setupRectAreaLight(0x795843, 1.2, 200, 180, new THREE.Vector3(10, 185, 0), 0x795843)
		// this.setupRectAreaLight(0xffffff, 0.15, 500, 100, new THREE.Vector3(10, 185, 0), 0x000000)
		// const rectLight2 = this.setupRectAreaLight(0xffffff, 0.20, 35, 50, new THREE.Vector3(110, 10, 0), 0x32a852);
		// rectLight2.rotation.y = Math.PI/180 * 90;


		
		// this.addPointLight(0xffffff, 500, 400, 1.5, new THREE.Vector3(-110, 110, 100), 0xaf45f3);
		// this.addPointLight();
		// this.addHemiSphereLight(0xffffff, 0xffffff, 100, new THREE.Vector3(0,0,0))


		


	}

	/**
	 * Will create a lights group in the scene
	 */

	setupLightsGroup() {
		this.lightsGroup = new THREE.Group();
		this.lightsGroup.name = "Lights Group";
		this.experience.scene.add(this.lightsGroup);
	}

	/**
	 * Will add an Ambient Light in the scene
	 * @param {*} color color of ambient light - color hex code value
	 * @param {*} intensity intensity of light - number
	 */

	setupAmbientLight(color = 0xffffff, intensity = 1) {
		this.ambientLight = new THREE.AmbientLight(color, intensity);
		this.lightsGroup.add(this.ambientLight);
	}

	/**
	 * Will add directional Light in the scene
	 * @param {*} color color of the directional light - color hex code value, Default 0xffffff
	 * @param {*} intensity intensity of the directional light - number, Default 1
	 * @param {*} position position of the directional light - vector3, Default x=0,y=0,z=0
	 * @param {*} castShadow whether light will result in casting Shadow - boolean value, Default false
	 */

	setupDirectionalLight(
		color = 0xffffff,
		intensity = 1,
		position = new THREE.Vector3(0, 0, 0),
		castShadow = false,
	) {
		this.directionalLight = new THREE.DirectionalLight(color, intensity);
		this.directionalLight.castShadow = castShadow;
		this.directionalLight.shadow.mapSize.set(1024, 1024);
		this.directionalLight.shadow.camera.left = -500;
		this.directionalLight.shadow.camera.right = 500;
		this.directionalLight.shadow.camera.top = 500;
		this.directionalLight.shadow.camera.bottom = -500;
		this.directionalLight.shadow.camera.far = 1000;
		this.directionalLight.shadow.normalBias = 0.001;
		this.directionalLight.shadow.blurSamples = 50;
		this.directionalLight.shadow.radius = 5
		this.directionalLight.rotation.z = -Math.PI/180 * 90;
		this.directionalLight.position.set(position.x, position.y, position.z);
		this.lightsGroup.add(this.directionalLight);

		// const helper = new THREE.DirectionalLightHelper( this.directionalLight, 150, new THREE.Color(0x000000) );
		// this.experience.scene.add( helper );
	}

	/**
	 * Will add a Rect Area Light in the scene
	 * @param {*} color color of the Rect Area light - color hex code value, Default 0xffffff
	 * @param {*} intensity intensity of the Rect Area light - number, Default 1
	 * @param {*} width width of the Rect Area Light - number, default 10
	 * @param {*} height height of the Rect Area Light - number, default 10
	 * @param {*} position postion of the Rect Area Light - Vector3, default x=0,y=0,z=0
	 */

	setupRectAreaLight(
		color = 0xffffff,
		intensity = 1,
		width = 10,
		height = 10,
		position = new THREE.Vector3(0, 0, 0),
		helperColor
	) {
		this.rectAreaLight = new THREE.RectAreaLight(
			color,
			intensity,
			width,
			height,
		);
		this.rectAreaLight.lookAt(0,0,0)
		// this.rectAreaLight.power = 100000;
		this.rectAreaLight.rotation.x = -Math.PI/2
		this.rectAreaLight.position.set(position.x, position.y, position.z);
		this.lightsGroup.add(this.rectAreaLight);

		// const helper = new RectAreaLightHelper( this.rectAreaLight, new THREE.Color(helperColor) );
		// this.rectAreaLight.add( helper ); // helper must be added as a child of the light
		return this.rectAreaLight;
	}

	/**
	 * Creates a new SpotLight and adds it to the scene.
	 * @param {*} color Hexadecimal color of the light. Default 0xffffff (white).
	 * @param {*} intensity Numeric value of the light's strength/intensity. Expects a Float. Default 1.
	 * @param {*} distance Maximum range of the light. Default is 0 (no limit). Expects a Float.
	 * @param {*} angle Maximum angle of light dispersion from its direction whose upper bound is Math.PI/2.
	 * @param {*} penumbra Percent of the SpotLight cone that is attenuated due to penumbra. Takes values between zero and 1. Expects a Float. Default 0.
	 * @param {*} decay The amount the light dims along the distance of the light. Expects a Float. Default 2.
	 * @param {*} position Position where the spotlight is to be placed. Expects a Vector3. Default x=0,y=0,z=0.
	 */

	setupSpotLight(
		color = 0xffffff,
		intensity = 1,
		distance = 1,
		angle = (Math.PI / 180) * 30,
		penumbra = 0,
		decay = 2,
		position = new THREE.Vector3(0, 0, 0),
		helperColor = 0xffffff
	) {
		this.spotLight = new THREE.SpotLight(
			color,
			intensity,
			distance,
			angle,
			penumbra,
			decay,
		);
		this.spotLight.position.set(position.x, position.y+200, position.z);
		this.spotLight.castShadow = true;
		this.lightsGroup.add(this.spotLight);

		
		// this.spotLight.shadow.mapSize.width = 1024;
		// this.spotLight.shadow.mapSize.height = 1024;

		// // this.spotLight.shadow.camera.near = 500;
		// // this.spotLight.shadow.camera.far = 4000;
		// // this.spotLight.shadow.camera.fov = 30;

		const spotLightHelper = new THREE.SpotLightHelper( this.spotLight, new THREE.Color(helperColor) );
		this.experience.scene.add( spotLightHelper, );
	}
	

	/**
	 * Creates a new SpotLight and adds it to the scene.
	 * @param {*} color Hexadecimal color of the light. Default 0xffffff (white).
	 * @param {*} intensity Numeric value of the light's strength/intensity. Expects a Float. Default 1.
	 * @param {*} distance Maximum range of the light. Default is 0 (no limit). Expects a Float.
	 * @param {*} decay The amount the light dims along the distance of the light. Expects a Float. Default 2.
	 * @param {*} position Position where the spotlight is to be placed. Expects a Vector3. Default x=0,y=0,z=0.
	 */
	addPointLight(
		color = 0xffffff,
		intensity = 1,
		distance = 1,
		decay = 2,
		position = new THREE.Vector3(0, 0, 0),
		helperColor = 0x000000
	){
		this.pointLight = new THREE.PointLight( color, intensity, distance, decay );
		this.pointLight.position.set(position.x, position.y, position.z);
		this.lightsGroup.add(this.pointLight)

		const sphereSize = 5;
		const pointLightHelper = new THREE.PointLightHelper( this.pointLight, sphereSize, helperColor );
		this.experience.scene.add( pointLightHelper );
	}

	/**
     * Creates a new {@link HemisphereLight}.
     * @param skyColor Hexadecimal color of the sky. Expects a `Integer`. Default `0xffffff` _(white)_.
     * @param groundColor Hexadecimal color of the ground. Expects a `Integer`. Default `0xffffff` _(white)_.
     * @param intensity Numeric value of the light's strength/intensity. Expects a `Float`. Default `1`.
     * @param position Position where the hemisphere light is to be placed. Expects a Vector3. Default x=0,y=0,z=0..
     */

	addHemiSphereLight
	(
		skyColor = 0xffffbb, 
		groundColor = 0x080820, 
		intensity = 100, 
		position = new THREE.Vector3(0,0,0)
	)
	{
		const light = new THREE.HemisphereLight( skyColor, groundColor, intensity, position );
		this.experience.scene.add( light );
		light.position.set(position.x, position.y, position.z);

		const helper = new THREE.HemisphereLightHelper( light, 5 );
		this.experience.scene.add( helper );
	}
}
