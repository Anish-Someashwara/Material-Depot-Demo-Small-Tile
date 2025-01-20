import * as THREE from "three";
import Experience from "./Experience.js";

import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib.js"; // *** for webpack devServer
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper.js";
// import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';

var MeshPhysicalMaterial = [
	{
		name: "Color",
		property: "color",
		type: "color",
		initialValue: "#ffffff", // Initial color value
	},
	{
		name: "Emissive",
		property: "emissive",
		type: "color",
		initialValue: "#000000", // Initial emissive color value
	},
	{
		name: "Metalness",
		property: "metalness",
		type: "number",
		min: 0,
		max: 1,
		initialValue: 0.5, // Initial metalness value
	},
	{
		name: "Roughness",
		property: "roughness",
		type: "number",
		min: 0,
		max: 1,
		initialValue: 0.5, // Initial roughness value
	},

	// {
	//     name: 'Anisotropy',
	//     property: 'anisotropy',
	//     type: 'number',
	//     initialValue: 0
	// },
	{
		name: "Attenuation Color",
		property: "attenuationColor",
		type: "color",
		initialValue: "0xffffff",
	},

	// {
	//     name: 'Clearcoat',
	//     property: 'clearcoat',
	//     type: 'number',
	//     min: 0,
	//     max: 1,
	//     initialValue: '0'
	// },

	// {
	//     name: 'Clearcoat Roughness',
	//     property: 'clearcoatRoughness',
	//     type: 'number',
	//     min: 0,
	//     max: 1,
	//     initialValue: '0'
	// },

	// {
	//     name: 'Reflectivity',
	//     property: 'reflectivity',
	//     type: 'number',
	//     min: 0,
	//     max: 1,
	//     initialValue: '0.5'
	// },

	// {
	//     name: 'Sheen',
	//     property: 'sheen',
	//     type: 'number',
	//     min: 0,
	//     max: 1,
	//     initialValue: '0'
	// },

	// {
	//     name: 'Sheen Roughness',
	//     property: 'sheenRoughness',
	//     type: 'number',
	//     min: 0,
	//     max: 1,
	//     initialValue: '1'
	// },
	// {
	//     name: 'Sheen Color',
	//     property: 'sheenColor',
	//     type: 'color',
	//     initialValue: '0x000000'
	// },
	// {
	//     name: 'Specular Intensity',
	//     property: 'specularIntensity',
	//     type: 'number',
	//     min: 0,
	//     max: 1,
	//     initialValue: '1'
	// },
	// {
	//     name: 'Specular Color',
	//     property: 'specularColor',
	//     type: 'color',
	//     initialValue: '0xffffff'
	// },
];

var MeshStandardMaterial = [
	{
		name: "Color",
		property: "color",
		type: "color",
		initialValue: "#ffffff", // Initial color value
	},
	{
		name: "Roughness",
		property: "roughness",
		type: "number",
		min: 0,
		max: 1,
		step: 0.01,
		initialValue: 0.5, // Initial roughness value
	},
	{
		name: "Metalness",
		property: "metalness",
		type: "number",
		min: 0,
		max: 1,
		step: 0.01,
		initialValue: 0.5, // Initial metalness value
	},
	{
		name: "Emissive Color",
		property: "emissive",
		type: "color",
		initialValue: "#000000", // Initial emissive color value
	},
	{
		name: "Emissive Intensity",
		property: "emissiveIntensity",
		type: "number",
		min: 0,
		max: 1,
		step: 0.01,
		initialValue: 0, // Initial emissive intensity value
	},
	{
		name: "Opacity",
		property: "opacity",
		type: "number",
		min: 0,
		max: 1,
		step: 0.01,
		initialValue: 1, // Initial opacity value
	},
	{
		name: "Transparent",
		property: "transparent",
		type: "boolean",
		initialValue: false, // Initial transparency value
	},
	{
		name: "Wireframe",
		property: "wireframe",
		type: "boolean",
		initialValue: false, // Initial wireframe value
	},
	// Add more properties as needed
];

export default class DebuggerDatGUI {
	constructor() {
		this.experience = new Experience();
		// console.log(this.experience.scene)

		this.guiFolders = {};
		this.materialOptions = {};
		this.gui = new dat.GUI({ autoPlace: true, width: 300 });

		this.customMaterialFolder = this.gui.addFolder("Custom Material");
		this.guiFolders["CustomMaterialFolder"] = this.customMaterialFolder;

		this.materialPropsFolder = this.gui.addFolder("Material Properties");
		this.guiFolders["MaterialProperties"] = this.materialPropsFolder;

		// Lights
		this.addLightsFolder = this.gui.addFolder("Add Lights");
		this.guiFolders["AddLights"] = this.addLightsFolder;

		this.lightsPropsFolder = this.gui.addFolder("Lights Properties");
		this.guiFolders["Lights Properties"] = this.lightsPropsFolder;

		this.debuggerLights = {
			ambientLightIns: [],
			hemisphereLightIns: [],
			directionalLightIns: [],
			spotLightIns: [],
			pointLightIns: [],
			rectAreaLightIns: [],
		};

		this.gui
			.add(
				{
					save: () => {
						this.savePropsValues();
					},
				},
				"save"
			)
			.name("Save Data");
		this.setupGUILights();

		this.propsToIgnore = {
			isMaterial: true,
			blending: true,
			side: true,
			vertexColors: false,
			opacity: false,
			transparent: false,
			alphaHash: true,
			blendSrc: true,
			blendDst: true,
			blendEquation: true,
			blendColor: true,
			blendAlpha: true,
			depthFunc: false,
			blending: false,
			depthTest: false,
			depthWrite: false,
			stencilWriteMask: true,
			stencilFunc: true,
			stencilRef: true,
			stencilFuncMask: true,
			stencilFail: true,
			stencilZFail: true,
			stencilZPass: true,
			stencilWrite: true,
			clipIntersection: true,
			clipShadows: true,
			colorWrite: false,
			polygonOffset: true,
			polygonOffsetFactor: true,
			polygonOffsetUnits: true,
			dithering: true,
			alphaToCoverage: true,
			premultipliedAlpha: true,
			forceSinglePass: true,
			visible: false,
			toneMapped: false,
			version: true,
			_alphaTest: true,
			isMeshStandardMaterial: true,
			color: false,
			roughness: false,
			metalness: false,
			lightMapIntensity: false,
			aoMapIntensity: false,
			emissive: false,
			emissiveIntensity: false,
			bumpScale: true,
			normalMapType: true,
			displacementScale: true,
			displacementBias: true,
			envMapIntensity: false,
			wireframe: false,
			wireframeLinewidth: false,
			flatShading: true,
			fog: true,
			isMeshPhysicalMaterial: true,
			anisotropyRotation: true,
			clearcoatRoughness: false,
			ior: true,
			iridescenceIOR: true,
			sheenColor: true,
			sheenRoughness: true,
			thickness: true,
			attenuationDistance: true,
			attenuationColor: true,
			specularIntensity: false,
			specularColor: false,
			_anisotropy: true,
			_clearcoat: false,
			_iridescence: true,
			_sheen: true,
			_transmission: true,
			castShadow: false,
			receiveShadow: false,
		};

		this.lightPropsToIgnore = {
			isObject3D: true,
			matrixAutoUpdate: true,
			matrixWorldAutoUpdate: true,
			matrixWorldNeedsUpdate: true,
			visible: false,
			castShadow: false,
			receiveShadow: true,
			frustumCulled: true,
			renderOrder: true,
			isLight: true,
			color: false,
			intensity: false,
			isRectAreaLight: true,
			isDirectionalLight: true,
			isPointLight: true,
			isSpotLight: true,
			isAmbientLight: true,
			isHemisphereLight: true,
			width: false,
			height: false,
			"Position-X": false,
			"Position-Y": false,
			"Position-Z": false,
			"Rotation-X": false,
			"Rotation-Y": false,
			"Rotation-Z": false,
		};
	}

	savePropsValues() {
		// Your code here to generate the save object
		// console.log("Save object generated!", this.gui.getSaveObject());

		const materialParams = {};
		// Iterate through controllers in dat.gui
		this.gui.__controllers.forEach(function (controller) {
			// Extract parameter name and value
			var paramName = controller.property;
			var paramValue = controller.object[paramName];

			// Store parameter value in the materialParams object
			materialParams[paramName] = paramValue;
			console.log(`${controller}`);
		});

		// Now materialParams object contains all parameter values
		// You can save this object wherever you want
		console.log(this.customMaterialFolder.__controllers);

		let data = {};
		Object.keys(this.guiFolders).forEach((folderName) => {
			const folderController = this.guiFolders[folderName].__controllers;
			// data[folderController.property] = folderController.object[folderController.property]
			console.log("FolderName:", folderName);
			folderController.forEach((control) => {
				if (control.property === "material") {
					console.log(control.property);
					data[control.property] = {};
					let materialData = data[control.property];
					materialData[control.name] = control.object["name"];
					materialData[control.type] = control.object["type"];
				} else {
					// data[control.property] = control.object[control.property]
					data[control.property] = control.object[control.property];
					console.log(
						`${control.property} => ${JSON.stringify(
							control.object[control.property]
						)}`
					);
				}
			});
		});

		// Saving Light Data
		// data['debuggerLights'] = {};
		// Object.keys(this.debuggerLights).forEach(lightType => {
		//     console.log("Light Type: ", lightType);
		//     data['debuggerLights'][lightType] = {}
		//     let lightData = data['debuggerLights'][lightType];
		//     this.debuggerLights[lightType].forEach(light => {
		//         console.log("Light: ", light)
		//         Object.keys(light).forEach(lightProperty => {
		//             if(!this.lightPropsToIgnore[lightProperty]){
		//                 console.log("lightProperty: ", lightProperty)
		//                 lightData[lightProperty] = light[lightProperty];
		//             }
		//         })
		//     })
		// });

		console.log(data);
		// Your data object

		// Convert data object to JSON string
		var jsonData = JSON.stringify(data);

		// Create a Blob object with the JSON data
		var blob = new Blob([jsonData], { type: "application/json" });

		// Create a temporary URL for the Blob
		var url = URL.createObjectURL(blob);

		// Create a link element
		var link = document.createElement("a");

		// Set link's properties
		link.href = url;
		link.download = "data.json"; // File name

		// Append link to the DOM
		document.body.appendChild(link);

		// Trigger a click event on the link
		link.click();

		// Remove the link from the DOM
		document.body.removeChild(link);

		// Revoke the Blob URL
		URL.revokeObjectURL(url);
	}

	setupMaterials(object, options) {
		const materialTypes = [
			"MeshMatcapMaterial",
			"MeshStandardMaterial",
			"MeshPhongMaterial",
			"MeshLambertMaterial",
			"MeshBasicMaterial",
		];
		const customMaterialFolder = this.customMaterialFolder;
		customMaterialFolder.add(object, "material", [
			"Option 1",
			"Option 2",
			"Option 3",
		]);
	}

	// setupGUIForObject(object){
	// 	// Options to be added to the GUI
	// 	// materialFolder = this.gui.addFolder('Material Properties');
	// 	const materialFolder = this.materialPropsFolder;

	// 	// Store the default properties and values
	// 	const material = object.object.material;
	// 	Object.keys(material).forEach((key)=>{
	// 		// console.log(key + " => " + material[key]);
	// 		this.materialOptions[key] = material[key]; // Add property to 'options' for GUI control
	// 	})

	// 	// console.log("this is options: ", material)

	// 	// Iterate over all properties of the default material
	// 	// Object.keys(options).forEach((propertyName)=>{
	// 	// 	// Get the property value
	// 	// 	const value = options[propertyName];

	// 	// 	// Check if the property is a number or a color
	// 	// 	if (typeof value === 'number') {
	// 	// 		// Add control for numeric properties
	// 	// 		materialFolder.add(options, propertyName).name(propertyName).onChange(function(newValue) {
	// 	// 			console.log("Prop changes")
	// 	// 			material[propertyName] = newValue;
	// 	// 			material.needsUpdate = true;
	// 	// 		});
	// 	// 	} else if (value instanceof THREE.Color) {
	// 	// 		// Add control for color properties
	// 	// 		const colorControl = materialFolder.addColor(options, propertyName).name(propertyName);
	// 	// 		colorControl.onChange(function(newColor) {
	//     //             console.log(newColor)
	// 	// 			material[propertyName] = new THREE.Color(newColor);
	// 	// 			material.needsUpdate = true;

	// 	// 		});
	// 	// 	}

	// 	// });

	//     // Iterate over all properties of the default material
	// 	// Object.keys(MeshStandardMaterial).forEach((propertyName)=>{
	// 	// 	// Get the property value
	//     //     console.log(propertyName)

	// 	// });

	//     // this.setupMaterials(object, options)

	//     const materialTypes = {
	//         'MeshStandardMaterial': new THREE.MeshStandardMaterial({color: 0xffffff}),
	//         'MeshBasicMaterial': new THREE.MeshBasicMaterial({color: 0xffffff}),
	//         'MeshPhongMaterial': new THREE.MeshPhongMaterial({color: 0xffffff}),
	//         'MeshPhysicalMaterial': new THREE.MeshPhysicalMaterial({color: 0xffffff}),
	//     }
	// 	const materialObjFolder = this.customMaterialFolder;

	//     materialObjFolder.add(object.object, 'material', Object.keys(materialTypes)).name('Custom Material').onChange((newMaterialType) => {
	//         console.log("New Material", newMaterialType);
	//         object.object.material = materialTypes[newMaterialType];
	//         object.object.material.needsUpdate = true;
	//     });

	//     console.log(material)
	//     for (const property of MeshStandardMaterial) {
	//         const materialProperty = property;
	//         // material.transparent = true;
	//         // Add control for numeric properties only
	//         if (materialProperty['type'] === 'number' && !materialProperty.hasOwnProperty('min')) {
	//             console.log("prop: ", materialProperty)
	//             materialFolder.add(this.materialOptions, materialProperty.property).name(materialProperty.name).onChange(function(newValue) {
	//                 console.log("Prop changes")
	//                 material[materialProperty.property] = newValue;
	//                 material.needsUpdate = true;
	//             })
	//         }
	//         else if (materialProperty['type'] === 'number' && materialProperty.hasOwnProperty('min')) {
	//             materialFolder.add(this.materialOptions, materialProperty.property).name(materialProperty.name).min(materialProperty['min']).max(materialProperty['max']).onChange(function(newValue) {
	//                 console.log("Prop changes")
	//                 material[materialProperty.property] = newValue;
	//                 material.needsUpdate = true;
	//             })
	//         }
	//         else if (materialProperty['type'] === 'color') {
	//             // Add control for color properties
	//             const colorControl = materialFolder.addColor(this.materialOptions, materialProperty.property).name(materialProperty.name);
	//             colorControl.onFinishChange(function(newColor) {
	//                 material[materialProperty.property] = new THREE.Color().setRGB(newColor.r, newColor.g, newColor.b);
	//                 // material[materialProperty.property] = new THREE.Color(0x000000);
	//                 // material.color.set(newColor);
	//                 console.log(newColor, material.color)
	//                 material.needsUpdate = true;

	//             })
	//         }
	//         else if (materialProperty['type'] === 'boolean') {
	//             // Add control for color properties
	//             const colorControl = materialFolder.add(this.materialOptions, materialProperty.property).name(materialProperty.name);
	//             colorControl.onChange(function(newVal) {
	//                 console.log(newVal)
	//                 material[materialProperty.property] = newVal;
	//                 material.needsUpdate = true;
	//             });
	//         }
	//     }

	// }

	setupGUIForObject(object) {
		// Options to be added to the GUI
		// materialFolder = this.gui.addFolder('Material Properties');
		const materialFolder = this.materialPropsFolder;

		// Store the default properties and values
		const material = object.object.material;
		Object.keys(material).forEach((key) => {
			// console.log(key + " => " + material[key]);
			this.materialOptions[key] = material[key]; // Add property to 'options' for GUI control
		});

		console.log("Selected Obj: ", object.object);

		const materialTypes = {
			MeshStandardMaterial: new THREE.MeshStandardMaterial({
				color: 0xffffff,
			}),
			MeshBasicMaterial: new THREE.MeshBasicMaterial({ color: 0xffffff }),
			MeshPhongMaterial: new THREE.MeshPhongMaterial({ color: 0xffffff }),
			MeshPhysicalMaterial: new THREE.MeshPhysicalMaterial({
				color: 0xffffff,
			}),
			defaultMaterial: material,
		};
		const materialObjFolder = this.customMaterialFolder;

		console.log("New Material", object.object.material.envMap);
		object.object.castShadow = true;
		object.object.receiveShadow = true;
		this.defaultEnvMap = object.object.material.envMap;

		// Add the dropdown controller and set its default value
		const materialController = materialObjFolder
			.add(object.object, "material", Object.keys(materialTypes))
			.name("Custom Material")
			.setValue(materialTypes.defaultMaterial) // Set the default value
			.onFinishChange((newMaterialType) => {
				console.log("New Material", object.object.material);
				materialTypes[newMaterialType].envMap = this.defaultEnvMap;
				object.object.material = materialTypes[newMaterialType];
				object.object.material.needsUpdate = true;
				this.setupCustomMaterial(
					object.object,
					materialTypes[newMaterialType]
				);
				console.log(materialController);
			});
		console.log(materialController);

		console.log(object.object.material.type);

		materialFolder
			.add({ type: object.object.material.type }, "type")
			.name("Material Type")
			.onFinishChange((type) => {});
		materialFolder
			.add({ name: object.object.name }, "name")
			.name("Material Name");

		materialFolder
			.add({ name: object.object.material.envMap.name }, "name")
			.name("Env Map");

		const typeName =
			materialFolder.__controllers[0].domElement.querySelector(
				'.c input[type="text"]'
			);
		const meshName =
			materialFolder.__controllers[1].domElement.querySelector(
				'.c input[type="text"]'
			);

		typeName.style.cursor = "not-allowed";
		meshName.style.cursor = "not-allowed";

		// Iterate over all properties of the default material
		Object.keys(this.materialOptions).forEach((propertyName) => {
			// Get the property value
			const value = this.materialOptions[propertyName];
			// console.log(value, this.propsToIgnore[value])
			if (!this.propsToIgnore[propertyName]) {
				// Check if the property is a number or a color
				if (typeof value === "number") {
					// Add control for numeric properties
					materialFolder
						.add(this.materialOptions, propertyName)
						.name(propertyName)
						.onChange(function (newValue) {
							console.log("Prop changes");
							material[propertyName] = newValue;
							material.needsUpdate = true;
						});
				} else if (value instanceof THREE.Color) {
					// Add control for color properties
					const colorControl = materialFolder
						.addColor(this.materialOptions, propertyName)
						.name(propertyName);
					colorControl.onChange(function (newColor) {
						console.log(newColor);
						// const newColorRGB = new THREE.Color((newColor.r, newColor.g, newColor.b));
						// material[propertyName] =new THREE.Color(newColorRGB.getHex())
						material[propertyName] = new THREE.Color(newColor);
						material.needsUpdate = true;
					});
				} else if (typeof value === "boolean") {
					console.log(`${value} is boolean!`);
					materialFolder
						.add(this.materialOptions, propertyName)
						.name(propertyName)
						.onChange(function (newVal) {
							console.log(newVal);
							material[propertyName] = newVal;
							material.needsUpdate = true;
						});
				}
			}
		});
	}

	setupCustomMaterial(object, material) {
		// object.material = material;
		// object.material.needsUpdate = true;
		// console.log('inside func')

		const customMaterialOptions = {};
		// const materialFolder = this.customMaterialFolder;
		const materialFolder = this.materialPropsFolder;
		Object.keys(material).forEach((key) => {
			customMaterialOptions[key] = material[key]; // Add property to 'options' for GUI control
		});

		console.log(customMaterialOptions);

		this.removePropsFromFolder("MaterialProperties");
		// this.removePropsFromFolder('CustomMaterialFolder');
		// this.removeFolder(this.guiFolders['MaterialProperties']);
		// Iterate over all properties of the default material
		Object.keys(customMaterialOptions).forEach((propertyName, index) => {
			// Get the property value
			const value = customMaterialOptions[propertyName];

			if (!this.propsToIgnore[propertyName]) {
				// Check if the property is a number or a color
				if (typeof value === "number") {
					// Add control for numeric properties
					materialFolder
						.add(customMaterialOptions, propertyName)
						.name(propertyName)
						.onChange(function (newValue) {
							console.log("Prop changes");
							material[propertyName] = newValue;
							material.needsUpdate = true;
						});
				} else if (value instanceof THREE.Color) {
					// Add control for color properties
					const colorControl = materialFolder
						.addColor(customMaterialOptions, propertyName)
						.name(propertyName);
					colorControl.onChange(function (newColor) {
						console.log(newColor);
						// const newColorRGB = new THREE.Color((newColor.r, newColor.g, newColor.b));
						// material[propertyName] =new THREE.Color(newColorRGB.getHex())
						material[propertyName] = new THREE.Color(newColor);
						material.needsUpdate = true;
					});
				} else if (typeof value === "boolean") {
					// console.log(`${value} is boolean!`)
					materialFolder
						.add(customMaterialOptions, propertyName)
						.name(propertyName)
						.onChange(function (newVal) {
							// console.log(newVal)
							material[propertyName] = newVal;
							material.needsUpdate = true;
						});
				}
			}
		});
	}

	/**
	 * Will remove properties from the given folder
	 * @param {*} folderName  The name of the folder to be removed
	 */
	removePropsFromFolder(folderName) {
		// console.log("Resetting The Properties In DatGUI!", this.guiFolders[folderName].__controllers);
		// while(this.guiFolders[folderName] && this.guiFolders[folderName].__controllers.length > 0) { // if folder exists and has controller then remove controllers
		//     this.guiFolders[folderName].__controllers[0].remove(); // Removing the first controller in the array because after deletion index no. shifts
		//     console.log("Deleting Properties!")
		// }

		// const gui = this.gui()
		// Remove all properties from the material folder
		const totolProps = this.guiFolders[folderName].__controllers;
		const propsSize = totolProps.length;
		// console.log(totolProps, propsSize)
		for (let nthProp = 0; nthProp < propsSize; nthProp++) {
			this.guiFolders[folderName].remove(totolProps[nthProp]);
			this.guiFolders[folderName].__controllers = [];
			// console.log("prop removed: ",nthProp)
		}
		// console.log("controller now : ", this.guiFolders[folderName])

		// this.guiFolders[folderName].__controllers.forEach((controller)=>{
		//     this.guiFolders[folderName].remove(controller);
		// });
		// this.gui.removeFolder('Material');
		// this.gui.addFolder('Material Properties');
	}

	// ****************************** Lights ******************************

	setupGUILights() {
		RectAreaLightUniformsLib.init();
		// Add button to Dat.GUI to add new light

		this.addLightsFolder
			.add(
				{
					addLight: () => {
						const ambientLight = new THREE.AmbientLight(0xffffff);

						this.experience.scene.add(ambientLight);

						ambientLight.name = `AmbientLight-${
							this.debuggerLights.ambientLightIns.length + 1
						}`;
						this.debuggerLights.ambientLightIns.push(ambientLight);

						const lightProperties = {};
						const keys = Object.keys(ambientLight);
						keys.forEach((key) => {
							lightProperties[key] = ambientLight[key];
						});

						// console.log(ambientLight)

						const folder = this.lightsPropsFolder;
						const subfolder = folder.addFolder(
							`${ambientLight.name} Properties`
						);
						folder.add(subfolder, "close");

						Object.keys(lightProperties).forEach((propertyName) => {
							if (!this.lightPropsToIgnore[propertyName]) {
								const value = lightProperties[propertyName];
								if (typeof value === "number") {
									subfolder
										.add(lightProperties, propertyName)
										.name(propertyName)
										.onChange(function (newValue) {
											ambientLight[propertyName] =
												newValue;
										});
								} else if (value instanceof THREE.Color) {
									const colorControl = subfolder
										.addColor(lightProperties, propertyName)
										.name(propertyName);
									colorControl.onChange(function (newColor) {
										ambientLight[propertyName] =
											new THREE.Color(newColor);
									});
								} else if (typeof value === "boolean") {
									subfolder
										.add(lightProperties, propertyName)
										.name(propertyName)
										.onChange(function (newVal) {
											ambientLight[propertyName] = newVal;
										});
								}
							}
						});
					},
				},
				"addLight"
			)
			.name("Add Ambient Light");

		this.addLightsFolder
			.add(
				{
					addLight: () => {
						const hemisphereLight = new THREE.HemisphereLight(
							0xffffff,
							0x000000
						);

						const helper = new THREE.HemisphereLightHelper(
							hemisphereLight,
							5,
							0x000000
						);
						hemisphereLight.add(helper);
						this.experience.scene.add(hemisphereLight);

						hemisphereLight.name = `HemisphereLight-${
							this.debuggerLights.hemisphereLightIns.length + 1
						}`;
						this.debuggerLights.hemisphereLightIns.push(
							hemisphereLight
						);

						const lightProperties = {};
						const keys = Object.keys(hemisphereLight);
						keys.forEach((key) => {
							lightProperties[key] = hemisphereLight[key];
						});

						const folder = this.lightsPropsFolder;
						const subfolder = folder.addFolder(
							`${hemisphereLight.name} Properties`
						);
						folder.add(subfolder, "close");

						Object.keys(lightProperties).forEach((propertyName) => {
							if (!this.lightPropsToIgnore[propertyName]) {
								const value = lightProperties[propertyName];
								if (typeof value === "number") {
									subfolder
										.add(lightProperties, propertyName)
										.name(propertyName)
										.onChange(function (newValue) {
											hemisphereLight[propertyName] =
												newValue;
										});
								} else if (value instanceof THREE.Color) {
									const colorControl = subfolder
										.addColor(lightProperties, propertyName)
										.name(propertyName);
									colorControl.onChange(function (newColor) {
										hemisphereLight[propertyName] =
											new THREE.Color(newColor);
									});
								} else if (typeof value === "boolean") {
									subfolder
										.add(lightProperties, propertyName)
										.name(propertyName)
										.onChange(function (newVal) {
											hemisphereLight[propertyName] =
												newVal;
										});
								}
							}
						});
					},
				},
				"addLight"
			)
			.name("Add Hemisphere Light");

		this.addLightsFolder
			.add(
				{
					addLight: () => {
						const spotLight = new THREE.SpotLight(0xffffff);
						spotLight.position.set(0, 100, 0);

						let spotLightHelper = new THREE.SpotLightHelper(
							spotLight,
							0x000000
						);
						// spotLight.add( spotLightHelper );

						this.experience.scene.add(spotLight);
						this.experience.scene.add(spotLightHelper);

						spotLight.name = `SpotLight-${
							this.debuggerLights.spotLightIns.length + 1
						}`;
						this.debuggerLights.spotLightIns.push(spotLight);

						const lightProperties = {};
						const keys = Object.keys(spotLight);
						keys.forEach((key) => {
							lightProperties[key] = spotLight[key];
						});

						// console.log(spotLight, spotLightHelper)

						const folder = this.lightsPropsFolder;
						const subfolder = folder.addFolder(
							`${spotLight.name} Properties`
						);
						folder.add(subfolder, "close");

						Object.keys(lightProperties).forEach((propertyName) => {
							if (!this.lightPropsToIgnore[propertyName]) {
								const value = lightProperties[propertyName];
								if (typeof value === "number") {
									subfolder
										.add(lightProperties, propertyName)
										.name(propertyName)
										.onChange((newValue) => {
											spotLight[propertyName] = newValue;
											this.experience.scene.remove(
												spotLightHelper
											);
											spotLightHelper =
												new THREE.SpotLightHelper(
													spotLight,
													0x000000
												);
											this.experience.scene.add(
												spotLightHelper
											);
										});
								} else if (value instanceof THREE.Color) {
									const colorControl = subfolder
										.addColor(lightProperties, propertyName)
										.name(propertyName);
									colorControl.onChange(function (newColor) {
										spotLight[propertyName] =
											new THREE.Color(newColor);
									});
								} else if (typeof value === "boolean") {
									subfolder
										.add(lightProperties, propertyName)
										.name(propertyName)
										.onChange(function (newVal) {
											spotLight[propertyName] = newVal;
										});
								}
							}
						});

						const position = {
							x: spotLight.position.x,
							y: spotLight.position.y,
							z: spotLight.position.z,
						};

						["x", "y", "z"].forEach((axis) => {
							subfolder
								.add(position, axis)
								.name(`Position-${axis.toUpperCase()}`)
								.onFinishChange((value) => {
									spotLight.position[axis] = value;
								});
						});

						// const rotation = {
						//     x: spotLight.rotation.x,
						//     y: spotLight.rotation.y,
						//     z: spotLight.rotation.z
						// };

						// ['x', 'y', 'z'].forEach(axis => {
						//     subfolder.add(rotation, axis, 0, Math.PI * 2).name(`Rotation-${axis.toUpperCase()}`).onChange((value) => {
						//         spotLight.rotation[axis] = value;
						//     });
						// });
					},
				},
				"addLight"
			)
			.name("Add SpotLight");

		this.addLightsFolder
			.add(
				{
					addLight: () => {
						const pointLight = new THREE.PointLight(0xffffff);
						pointLight.position.set(0, 100, 0);

						const sphereSize = 5;
						const pointLightHelper = new THREE.PointLightHelper(
							pointLight,
							sphereSize,
							0x000000
						);
						pointLight.add(pointLightHelper);

						this.experience.scene.add(pointLight);

						pointLight.name = `PointLight-${
							this.debuggerLights.pointLightIns.length + 1
						}`;
						this.debuggerLights.pointLightIns.push(pointLight);

						const lightProperties = {};
						const keys = Object.keys(pointLight);
						keys.forEach((key) => {
							lightProperties[key] = pointLight[key];
						});
						// console.log(lightProperties);

						const folder = this.lightsPropsFolder;
						const subfolder = folder.addFolder(
							`${pointLight.name} Properties`
						);
						folder.add(subfolder, "close");

						Object.keys(lightProperties).forEach((propertyName) => {
							if (!this.lightPropsToIgnore[propertyName]) {
								const value = lightProperties[propertyName];
								if (typeof value === "number") {
									subfolder
										.add(lightProperties, propertyName)
										.name(propertyName)
										.onChange(function (newValue) {
											pointLight[propertyName] = newValue;
										});
								} else if (value instanceof THREE.Color) {
									const colorControl = subfolder
										.addColor(lightProperties, propertyName)
										.name(propertyName);
									colorControl.onChange(function (newColor) {
										pointLight[propertyName] =
											new THREE.Color(newColor);
									});
								} else if (typeof value === "boolean") {
									subfolder
										.add(lightProperties, propertyName)
										.name(propertyName)
										.onChange(function (newVal) {
											pointLight[propertyName] = newVal;
										});
								}
							}
						});

						const position = {
							x: pointLight.position.x,
							y: pointLight.position.y,
							z: pointLight.position.z,
						};

						["x", "y", "z"].forEach((axis) => {
							subfolder
								.add(position, axis)
								.name(`Position-${axis.toUpperCase()}`)
								.onFinishChange((value) => {
									pointLight.position[axis] = value;
								});
						});

						const scale = {
							x: pointLight.scale.x,
							y: pointLight.scale.y,
							z: pointLight.scale.z,
						};

						["x", "y", "z"].forEach((axis) => {
							subfolder
								.add(scale, axis)
								.name(`Scale-${axis.toUpperCase()}`)
								.onFinishChange((value) => {
									pointLight.scale[axis] = value;
								});
						});
					},
				},
				"addLight"
			)
			.name("Add PointLight");

		this.addLightsFolder
			.add(
				{
					addLight: () => {
						const directionalLight = new THREE.DirectionalLight(
							0xffffff,
							1
						);
						directionalLight.target.position.set(0, 0, 0);
						directionalLight.position.set(0, 100, 0);

						const helper = new THREE.DirectionalLightHelper(
							directionalLight,
							50,
							new THREE.Color(0x000000)
						);
						directionalLight.add(helper);

						this.experience.scene.add(directionalLight);

						directionalLight.name = `DirectionalLight-${
							this.debuggerLights.directionalLightIns.length + 1
						}`;
						this.debuggerLights.directionalLightIns.push(
							directionalLight
						);

						const lightProperties = {};
						const keys = Object.keys(directionalLight);
						keys.forEach((key) => {
							lightProperties[key] = directionalLight[key];
						});
						// console.log(directionalLight)

						// const folder = this.lightsPropsFolder.addFolder(`${directionalLight.name} Properties`);
						// this.lightsPropsFolder.add(folder, 'close');

						const folder = this.lightsPropsFolder;
						const subfolder = folder.addFolder(
							`${directionalLight.name} Properties`
						);
						folder.add(subfolder, "close");

						Object.keys(lightProperties).forEach((propertyName) => {
							if (!this.lightPropsToIgnore[propertyName]) {
								const value = lightProperties[propertyName];
								if (typeof value === "number") {
									subfolder
										.add(lightProperties, propertyName)
										.name(propertyName)
										.onChange(function (newValue) {
											directionalLight[propertyName] =
												newValue;
										});
								} else if (value instanceof THREE.Color) {
									const colorControl = subfolder
										.addColor(lightProperties, propertyName)
										.name(propertyName);
									colorControl.onChange(function (newColor) {
										directionalLight[propertyName] =
											new THREE.Color(newColor);
									});
								} else if (typeof value === "boolean") {
									subfolder
										.add(lightProperties, propertyName)
										.name(propertyName)
										.onChange(function (newVal) {
											directionalLight[propertyName] =
												newVal;
										});
								}
							}
						});

						const position = {
							x: directionalLight.position.x,
							y: directionalLight.position.y,
							z: directionalLight.position.z,
						};

						["x", "y", "z"].forEach((axis) => {
							subfolder
								.add(position, axis)
								.name(`Position-${axis.toUpperCase()}`)
								.onFinishChange((value) => {
									directionalLight.position[axis] = value;
								});
						});

						const rotation = {
							x: directionalLight.rotation.x,
							y: directionalLight.rotation.y,
							z: directionalLight.rotation.z,
						};

						subfolder
							.add(rotation, "x", 0, Math.PI * 2)
							.name("Rotation-X")
							.onChange((value) => {
								directionalLight.rotation.x = value;
							});
						subfolder
							.add(rotation, "y", 0, Math.PI * 2)
							.name("Rotation-Y")
							.onChange((value) => {
								directionalLight.rotation.y = value;
							});
						subfolder
							.add(rotation, "z", 0, Math.PI * 2)
							.name("Rotation-Z")
							.onChange((value) => {
								directionalLight.rotation.z = value;
							});
					},
				},
				"addLight"
			)
			.name("Add Directional Light");

		this.addLightsFolder
			.add(
				{
					addLight: () => {
						const rectAreaLight = new THREE.RectAreaLight(
							0xffffff,
							100,
							10,
							10
						);
						rectAreaLight.lookAt(0, 0, 0);
						rectAreaLight.rotation.x = -Math.PI / 2;
						rectAreaLight.position.set(0, 100, 0);

						const helper = new RectAreaLightHelper(
							rectAreaLight,
							new THREE.Color(0x000000)
						);
						rectAreaLight.add(helper); // helper must be added as a child of the light

						this.experience.scene.add(rectAreaLight);

						rectAreaLight.name = `RectAreaLight-${
							this.debuggerLights.rectAreaLightIns.length + 1
						}`; // Create Properties Folder For This Light
						this.debuggerLights.rectAreaLightIns.push(
							rectAreaLight
						);

						let lightProperties = {}; // Store the default properties and values

						// console.log(rectAreaLight)

						const keys = Object.keys(rectAreaLight); // Get the keys of the RectAreaLight instance

						// Loop through the keys and log the property names and values
						keys.forEach((key) => {
							// console.log(key + ':', rectAreaLight[key]);
							lightProperties[key] = rectAreaLight[key];
						});

						const folder = this.lightsPropsFolder;
						const subfolder = folder.addFolder(
							`${rectAreaLight.name} Properties`
						);
						folder.add(subfolder, "close");

						// Iterate over all properties of the default material
						Object.keys(lightProperties).forEach((propertyName) => {
							// Get the property value
							const value = lightProperties[propertyName];
							// console.log(value, propertyName)
							if (!this.lightPropsToIgnore[propertyName]) {
								// Check if the property is a number or a color
								if (typeof value === "number") {
									// Add control for numeric properties
									subfolder
										.add(lightProperties, propertyName)
										.name(propertyName)
										.onChange(function (newValue) {
											// console.log("Prop changes")
											rectAreaLight[propertyName] =
												newValue;
											// material.needsUpdate = true;
										});
								} else if (value instanceof THREE.Color) {
									// Add control for color properties
									const colorControl = subfolder
										.addColor(lightProperties, propertyName)
										.name(propertyName);
									colorControl.onChange(function (newColor) {
										// console.log(newColor)
										// const newColorRGB = new THREE.Color((newColor.r, newColor.g, newColor.b));
										// material[propertyName] =new THREE.Color(newColorRGB.getHex())
										rectAreaLight[propertyName] =
											new THREE.Color(newColor);
										// material.needsUpdate = true;
									});
								} else if (typeof value === "boolean") {
									// console.log(`${value} is boolean!`)
									subfolder
										.add(lightProperties, propertyName)
										.name(propertyName)
										.onChange(function (newVal) {
											// console.log(newVal)
											rectAreaLight[propertyName] =
												newVal;
											// material.needsUpdate = true;
										});
								}
							}
						});

						const position = {
							x: rectAreaLight.position.x,
							y: rectAreaLight.position.y,
							z: rectAreaLight.position.z,
						};

						subfolder
							.add(position, "x")
							.name("Position-X")
							.onFinishChange((value) => {
								rectAreaLight.position.x = value;
							});
						subfolder
							.add(position, "y")
							.name("Position-Y")
							.onFinishChange((value) => {
								rectAreaLight.position.y = value;
							});
						subfolder
							.add(position, "z")
							.name("Position-Z")
							.onFinishChange((value) => {
								rectAreaLight.position.z = value;
							});

						const rotation = {
							x: rectAreaLight.rotation.x,
							y: rectAreaLight.rotation.y,
							z: rectAreaLight.rotation.z,
						};

						subfolder
							.add(rotation, "x", 0, Math.PI * 2)
							.name("Rotation-X")
							.onChange((value) => {
								rectAreaLight.rotation.x = value;
							});
						subfolder
							.add(rotation, "y", 0, Math.PI * 2)
							.name("Rotation-Y")
							.onChange((value) => {
								rectAreaLight.rotation.y = value;
							});
						subfolder
							.add(rotation, "z", 0, Math.PI * 2)
							.name("Rotation-Z")
							.onChange((value) => {
								rectAreaLight.rotation.z = value;
							});
					},
				},
				"addLight"
			)
			.name("Add RectArea Light");

		// this.addLightsFolder.add(this.addLight, 'addLight').name('Custom Light')
	}

	addLight(name) {
		const addLight = "anish";
		console.log(name);
		// const rectAreaLight = new THREE.RectAreaLight(0xffffff, 1, 10, 10);
		// rectAreaLight.lookAt(0,0,0)
		// rectAreaLight.rotation.x = -Math.PI/2
		// rectAreaLight.position.set(0, 100, 0);
		// console.log(this)
		// this.experience.scene.add(this.rectAreaLight);

		// const helper = new RectAreaLightHelper( this.rectAreaLight, new THREE.Color(0x000000) );
		// this.rectAreaLight.add( helper ); // helper must be added as a child of the light
	}

	// addDirectionalLight(gui, scene, lightsFolder, debuggerLights, lightsPropsFolder, lightPropsToIgnore)
}
