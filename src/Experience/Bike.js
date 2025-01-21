import * as THREE from "three";
import Experience from "./Experience.js";
import { VertexNormalsHelper } from "three/examples/jsm/helpers/VertexNormalsHelper.js";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";


const BIKE_PARTS = {
	// ToolBox: '3068001',
	ToolBox: "3068",
	ToolBoxLogo: "3050001",
	WheelFrontRim: "Rim001",
	WheelBackRim: "Sphere001",
	TyreMidLayer: "Grip_Tyer",
	TyreFontSideLayer: "Mesh17610",
	BrownSeat: "Brown_Seat",
	BrownSeatMeshTemp: "Mesh499", // This is temporary name, these seat mesh heirarcy should be fixed from blender 3d side
	TyreFrontBaseLayer: "Mesh17610_1",
	TyreBaseLayer: "Mesh17610_4",
	TyreGripPatternLayer: "Mesh17610_2",
	PetrolTank: "shell#002",
	EngineContainer: "RightSide_Eng",
	EngineWhiteSteelPlates: "1660",
	EngineBlackSteelPlates: "shell_029001",
	EngineTankLogo: "Shell_Name",
	EngineMidTank: "1640001",
	chain: "chain002001",
	// shockerCover: '420001',
	shockerCover: "419",
	shockerSprings: "394001",
	chassis: "Mesh11182",
	// frontMudGuard: 'Plane004_2',
	frontMudGuard: "Mesh1344_1",
	backMudGuard: "brep_029001",
	// frontShockers: 'Mesh11314_1',
	frontShockers: "shockupperser002",
	bikeStartButton: "Mesh11318_1",
	// doomBody: 'Doom_Body001',
	doomBody: "shell_12",
	mudGuardMiddleStrip: "sheel_12002",
	indicators: "Mesh506",
	shockerSideReflectors: "Reflactor",
	backStopLight: "shell_008001",
	chainSheild: "brep_001001",
	speedoMeterGlass: "689",
	handleRod: "Handle001",
	handleRodMiddleBoltPlate: "Mesh11322_1",
	headLightCap: "Headlight_Cap001",
	HeadLightGlass: "Headlight_Glass001",
	PetrolTankCap: "Mesh051",
	BikeShadow: "Shadow",
	FrontTyreChasis: "Plane004_4",
	BikeSilencer: "Mesh797",
	BikeMirrorCore: "Mesh11321",
	BikeMirrorBackCover: "Mesh11321_1",
	BikeRedStopLight: "Mesh069_1",
	BikeRedStopLightBorder: "Mesh069",
	PetrolTankSilverSideParts: "Mesh1153",
	DoomMiniLights: "882",
	BikeKeyLogoFont: "583",
	BikeKeyFrame: "Mesh1645",
	headLightCapLogo: "Circle001",
	BikeTankLogo: "Mesh11294_2",
	GearFootRest: "2091001",
	SpeedoMeterCoverPlate: "Mesh11308_1",
	KeyLogoFrame: "Mesh11308_2",
	BackMudGuardLogoBrownArea: "3034",
	frontMudGuardColorStrip: "shell_12002",
	frontIndicators: "Mesh506_1",
	backLightBlackCover: "shell_013001",
	seatBrown: "Mesh008",
	seatBlack: "Black_Seat_1"
};
export default class Bike {
	constructor() {
		this.experience = new Experience();
		const {scene,camera,loaders,intersectedObjects,uiLoader,uiPopups, resourceManager} = this.experience;
		this.scene = scene;
		this.camera = camera;
		this.loaders = loaders;
		this.uiLoader = uiLoader;
		this.intersectedObjects = intersectedObjects;
		this.uiPopups = uiPopups;
		this.resourceManager = resourceManager;
		this.mixer;
		// this.loadEnvMaps();
		// this.loadDummyBikeModel();
		// this.loadModel();
		this.isDummyBikeSetupDone = false;
		this.isBikeSetupDone = false;
		this.isEnvMapsSetupDone = false;

		// Props used while seat change animation
		this._centerPosition = new THREE.Vector3();
		this._normal = new THREE.Vector3();
		this._cameraPosition = new THREE.Vector3();

		this.rect2 = new THREE.Mesh(
			new THREE.PlaneGeometry(30, 30),
			new THREE.MeshBasicMaterial({
				color: 0x00ff00,
				transparent: true,
				opacity: 0.5,
				side: THREE.DoubleSide,
			})
		);
		this.rect2.position.set(-27, 108, 81);
		this.rect2.rotation.set(-0.48, 8.8, 0.3);
		// this.scene.add( this.rect2 );
		// this.addHotSpotHelper();
		// this.addReloadPopup();
	}

	addHotSpotHelper() {
		// //////////////////////////////////////////////////////////////////////////////////////////////////////////////
		// Debugger Helper for Hotspots To Camera Zoom Animation (Like Seat Change Animation hotspot)
		// //////////////////////////////////////////////////////////////////////////////////////////////////////////////

		// Create the VertexNormalsHelper
		this.normalsHelper = new VertexNormalsHelper(this.rect2, 5);
		this.scene.add(this.normalsHelper);

		// Create the dat.GUI interface
		const gui = new GUI();

		// Create folders for the rotation and position settings
		const rotationFolder = gui.addFolder("Rotation");
		rotationFolder
			.add(this.rect2.rotation, "x", -200, 200, 0.01)
			.name("Rotation X")
			.onChange(this.updateHelper);
		rotationFolder
			.add(this.rect2.rotation, "y", -200, 200, 0.01)
			.name("Rotation Y")
			.onChange(this.updateHelper);
		rotationFolder
			.add(this.rect2.rotation, "z", -200, 200, 0.01)
			.name("Rotation Z")
			.onChange(this.updateHelper);
		rotationFolder.open();

		const positionFolder = gui.addFolder("Position");
		positionFolder
			.add(this.rect2.position, "x")
			.name("Position X")
			.onChange(this.updateHelper);
		positionFolder
			.add(this.rect2.position, "y")
			.name("Position Y")
			.onChange(this.updateHelper);
		positionFolder
			.add(this.rect2.position, "z")
			.name("Position Z")
			.onChange(this.updateHelper);
		positionFolder.open();
		// ///////////////////////////////////////////////////////
	}

	updateHelper() {
		console.log("Updated Helper!!!!");
		// this.normalsHelper.update();
	}

	async setupEnvMaps(envMaps) {
		// **************************** Environment Maps Loading ****************************

		const basePath = `static/EnvrionmentMaps`;

		Object.keys(envMaps).forEach((envMapName) => {
			// console.log(envMapName);
			const texture = envMaps[envMapName];
			texture.mapping = THREE.EquirectangularReflectionMapping;
			texture.colorSpace = THREE.LinearSRGBColorSpace;
		});


		// const TyreEnvTexture = envMaps[`${basePath}/EnvMapTyreRim.hdr`];
		// TyreEnvTexture.name = "TyreEnvMap";
		// this.tyreRimsEnvMap = TyreEnvTexture;

		const GlobalEnvTexture = envMaps[`${basePath}/NewGlobalEnvMap2.hdr`];
		GlobalEnvTexture.name = "GlobalEnvMap";
		this.envTexture = GlobalEnvTexture;

		this.scene.background = this.envTexture;
		this.scene.backgroundIntensity = 0.1;

		// GUI setup
		const gui = new GUI();
		const params = {
			useTexture: true, // Initial state (no texture)
		};

		// Add toggle for texture
		gui.add(params, 'useTexture')
			.name('Toggle Background')
			.onChange((value) => {
				if (value) {
					this.scene.background = this.envTexture; // Set texture as background
				} else {
					this.scene.background = null; // Remove background
				}
			});


		// const HeadLightEnvMapTexture = envMaps[`${basePath}/HeadLightGlass.hdr`];
		// HeadLightEnvMapTexture.name = "HeadLightEnvMap";
		// this.HeadLightEnvMap = HeadLightEnvMapTexture;

		// await this.loadDummyBikeModel();
		// this.uiLoader.hideLoader();
		// this.loadModel();
	}

	setupDummyBikeModel(dummyBikeModelGltf) {
		// this.uiLoader.hideLoader();

		dummyBikeModelGltf.scene.name = "DummyBikeModel";
		this.dummyBikeModel = dummyBikeModelGltf.scene;

		this.dummyBikeModel.position.set(10, -10, 0);
		this.dummyBikeModel.scale.set(100, 100, 100);

		this.dummyBikeModel.traverse((child) => {
			// this.experience.bulbBloomEffect.addBloomEffectOnObj(child);
			if (child.isMesh) {
				// child.material.color = new THREE.Color(0x00ff00)
				if (Array.isArray(child.material)) {
					child.material.forEach((material) => {
						material.transparent = true;
						material.opacity = 0.5;
					});
				} else {
					child.material.transparent = true;
					child.material.opacity = 0.5;
				}
			}
		});

		this.scene.add(this.dummyBikeModel);

		this.setupDummyLoader(this.resourceManager.canvasResources['dummyLoader1'])

		// Deactive loader-logo animation
		// document.getElementById('loader-gif').style.display = 'none'
		// document.getElementById('loadingOverlay').style.backgroundColor = 'transparent'
				
	}

	setupDummyLoader(gltf){
		// this.uiLoader.hideLoader();

		gltf.scene.name = "DummyLoader";
		this.dummyLoader = gltf.scene;

		this.dummyLoader.position.set(10, -10, 0);
		this.dummyLoader.scale.set(100, 100, 100);

		this.dummyLoader.traverse((child) => {
			if (child.isMesh) {
				console.log(child.name)
				this.experience.bulbBloomEffect.addBloomEffectOnObj(child);
				child.material.color = new THREE.Color(0x00ff00)

				if(child.name === 'A_1'){
					child.material.color = new THREE.Color(0xFF831E);
				}
				if(child.name === 'A_2'){
					child.material.color = new THREE.Color(0xE94000);
				}
				if(child.name === 'A_3'){
					child.material.color = new THREE.Color(0xFF831E);
				}
				if(child.name === 'A_4'){
					child.material.color = new THREE.Color(0xE94000);
				}
				if(child.name === 'A_5'){
					// child.material.color = new THREE.Color(0x0062FF);
					child.material.color = new THREE.Color(0x70A4BF);
				}
				if(child.name === 'A_6'){
					child.material.color = new THREE.Color(0xA1FF00);
				}
				if(child.name === 'A_7'){
					child.material.color = new THREE.Color(0x70A4BF);
				}
				if(child.name === 'A_8'){
					child.material.color = new THREE.Color(0xA1FF00); // #70A4BF
				}
				if(child.name === 'A_9'){
					child.material.color = new THREE.Color(0x70A4BF);
				}
				if(child.name === 'A_ 10'){
					child.material.color = new THREE.Color(0xFF007A);
				}
			}
		});

		// console.log(glt)
		// Initialize the AnimationMixer and play the animations
		this.mixer = new THREE.AnimationMixer(this.dummyLoader);
		gltf.animations.forEach((clip) => {
			this.mixer.clipAction(clip).play();
		});


		this.scene.add(this.dummyLoader);
	}

	setupBikeModel(bikeModelGltf) {
		this.uiLoader.hideLoader();

		const TEXTURE_BASE_PATH = "./static/models/BikeModel_12-7-24-SplitTextures/Textures";

		// **************************** Bike Model Loading ****************************
		// console.log(bikeModelGltf)
		bikeModelGltf.scene.name = "Bike Model";

		bikeModelGltf.scene.traverse((child) => {
			if (child instanceof THREE.Group &&child.name === BIKE_PARTS.BrownSeat) {
				child.visible = false;
			}
			if (child.isMesh) {

				// Assuming you always want to set these properties for all textures
				if (child.material.map) {
					child.material.map.minFilter = THREE.LinearMipmapLinearFilter; // Minification filter (with mipmapping)
				}

				child.material.envMap = this.envTexture;
				child.material.envMapIntensity = 0.14;
				
				
				//////////////////////////////////////////////
				if(child.name === "Tile_Face"){ 
					child.material.roughness = 0.15;
					child.material.metalness = 0.02;
					child.material.envMapIntensity = 0.08;
					child.material.specularIntensity = 0.1;
					child.material._clearcoat = 0.05;
				}
				if(child.name === "Tile_Back"){ 
					child.material.roughness = 1;
					child.material.metalness = 0;
					child.material.envMapIntensity = 0.2;
					child.material.specularIntensity = 0.2;
				}

				child.material.needsUpdate = true;
			}
		});

		this.setupBike(bikeModelGltf.scene);

		if(this.dummyBikeModel){
			console.log("Removing Dummy Bike!!!")
			this.removeGLTFModel(this.dummyBikeModel,this.scene);
		}
		
		if(this.dummyLoader){
			console.log("Removing Dummy Loader!!!")
			this.removeGLTFModel(this.dummyLoader,this.scene);
		}

		// this.experience.bulbBloomEffect.bloomPass.strength = 0;
		// this.experience.bulbBloomEffect.finalComposer.renderToScreen = false;
		// this.experience.renderer.instance.setClearColor(0xfcfbf7);

		// Deactive loader-logo animation
		// document.getElementById('loader-gif').style.display = 'none'
		// document.getElementById('loadingOverlay').style.backgroundColor = 'transparent'

		
		// this.activateBikeView();
		// this.uiLoader.hideLoader();
	
	}

	activateBikeView() {
		document.getElementById("bike-heading-row").style.display = "flex";
		document.getElementById("webgl").style.display = "block";
	}

	addReloadPopup(message) {
		// Create popup elements
		const popupOverlay = document.createElement("div");
		popupOverlay.id = "reloadPopupOverlay";

		const popupContent = document.createElement("div");
		popupContent.id = "reloadPopupContent";

		const popupHeader = document.createElement("div");
		popupHeader.id = "reloadPopupHeader";
		const headerTitle = document.createElement("h2");
		headerTitle.innerText = "Something Went Wrong! ❌";
		popupHeader.appendChild(headerTitle);

		const popupBody = document.createElement("div");
		popupBody.id = "reloadPopupBody";
		const bodyMessage = document.createElement("p");
		bodyMessage.innerText = message
			? message
			: "Somehting Went Wrong! Please reload the page to try again.";

		popupBody.appendChild(bodyMessage);

		const popupFooter = document.createElement("div");
		popupFooter.id = "reloadPopupFooter";
		const reloadBtn = document.createElement("button");
		reloadBtn.id = "reloadPopupCloseBtn";
		reloadBtn.innerText = "Reload";
		popupFooter.appendChild(reloadBtn);

		// Assemble popup
		popupContent.appendChild(popupHeader);
		popupContent.appendChild(popupBody);
		popupContent.appendChild(popupFooter);
		popupOverlay.appendChild(popupContent);
		document.body.appendChild(popupOverlay);

		// Event listeners for opening and closing the popup
		// const openBtn = document.getElementById('reloadPopupOpenBtn');
		// openBtn.addEventListener('click', () => {
		// 	popupOverlay.style.display = 'flex';
		// });

		reloadBtn.addEventListener("click", () => {
			popupOverlay.style.display = "none";
			location.reload();
		});

		window.addEventListener("click", (e) => {
			if (e.target === popupOverlay) {
				popupOverlay.style.display = "none";
			}
		});
	}

	async fitToRect2(rect) {
		const rectWidth = rect.geometry.parameters.width;
		const rectHeight = rect.geometry.parameters.height;

		rect.updateMatrixWorld();
		const rectCenterPosition = this._centerPosition.copy(rect.position);
		const rectNormal = this._normal
			.set(0, 0, 1)
			.applyQuaternion(rect.quaternion);
		const distance = this.camera.cameraControls.getDistanceToFitBox(
			rectWidth,
			rectHeight,
			0
		);
		const cameraPosition = this._cameraPosition
			.copy(rectNormal)
			.multiplyScalar(-distance)
			.add(rectCenterPosition);

		await this.camera.cameraControls.setLookAt(
			cameraPosition.x,
			cameraPosition.y,
			cameraPosition.z,
			rectCenterPosition.x,
			rectCenterPosition.y,
			rectCenterPosition.z,
			true
		);
		console.log(this.camera.cameraControls.getTarget());
		// this.camera.cameraControls.setOrbitPoint(0, 70, 0, true)
	}

	setupBike(fbx) {
		this.bike = fbx;
		this.seatMeshes = [];
		this.currentSeat = null;
		this.defaultSeatGroup = new THREE.Group();
		this.defaultSeatGroup.name = "Default Seat";
		// this.bike.rotation.x  = Math.PI / 10 ;
		this.bike.position.set(10, -10, 0);
		this.bike.scale.set(100, 100, 100);
		this.bike.traverse((child) => {
			if (child instanceof THREE.Mesh) {
				child.castShadow = true;
				child.receiveShadow = true;
				// if(child.name === "Black_Seat_1" || child.name === "Black_Seat_2"){
				// 	console.log("this is black seat dirt!", child)
				// 	// child.visible = false;
				// 	this.bike.remove(child)
				// }
				if (child.name === "Black_Seat") {
					console.log("black seat: ", child);
					child.material.depthWrite = true;
					child.material.name = "SeatBlack";
					this.defaultSeatMaterial = child.material;
					this.currentSeatMaterial = child.material;
					this.allSeatMaterials["SeatBlack"] = child.material;
					this.seatMesh = child;
					this.seatMeshes.push(child);
				}
				this.intersectedObjects.push(child);
			}
		});

		
		this.scene.add(this.bike);
		// this.loaders.deactivateLoader();

		setTimeout(() => {
			document.getElementById('loading-overlay').style.display = 'none';
			// document.getElementById('loader-bar').style.display = 'none';
		}, 2000);

		// Seat Viewing Angle
		this.seatViewPoint = new THREE.Mesh(
			new THREE.SphereGeometry(0.05),
			new THREE.MeshBasicMaterial({ color: 0xffff00, wireframe: true })
		);
		// console.log("****: ",this.seatViewPoint.position)
		this.bike.add(this.seatViewPoint);
		this.seatViewPoint.visible = false;
		this.seatViewPoint.position.set(0.1, 1, 0.5);
	}

	switchSeats(id) {
		if (id) {
			this.bike.traverse((child) => {
				if (child instanceof THREE.Group) {
					if (id === "SeatBlack") {
						if (child.name === "Brown_Seat") child.visible = false;
						if (child.name === "Black_Seat") child.visible = true;
					} else {
						if (child.name === "Brown_Seat") child.visible = true;
						if (child.name === "Black_Seat") child.visible = false;
					}
				}
			});
		}
	}

	// Function to calculate distance between two vectors
	distance(vector1, vector2) {
		return vector1.distanceTo(vector2);
	}

	zoomAnimation(id = null) {
		this.switchSeats(id);
		this.camera.cameraControls.reset(true);
		this.fitToRect2(this.rect2);
		// .then(async() => {
		// let ans = new Vector3();
		// this.camera.cameraControls.getPosition(ans)
		// console.log(ans, this.camera)
		// this.camera.cameraControls.setTarget(15, 70, 0, true);
		// this.camera.cameraControls.setPosition(-30, 150, 180, true)
		// this.camera.cameraControls.setTarget(10, 70, 0, true);
		// const currentPos = this.camera.cameraControls.getPosition();
		// }); // Works Perfectly Fine.
	}

	update(delta) {
		if(!this.isBikeSetupDone && !this.isDummyBikeSetupDone && this.resourceManager.canvasResources["dummyBikeModelGltf"]){
			console.log("****** Rendering Dummy Bike ******");
			this.setupDummyBikeModel(this.resourceManager.canvasResources["dummyBikeModelGltf"]);
			this.isDummyBikeSetupDone = true;
		}

		if(!this.isEnvMapsSetupDone && this.resourceManager.canvasResources["envMaps"]){
			console.log("****** Setup Env Maps ******");
			this.setupEnvMaps(this.resourceManager.canvasResources["envMaps"]);
			this.isEnvMapsSetupDone = true;
		}

		if(this.isEnvMapsSetupDone && !this.isBikeSetupDone && this.resourceManager.canvasResources["BikeModel"]){
			console.log("****** Setup Bike Now ******");
			this.setupBikeModel(this.resourceManager.canvasResources["BikeModel"]);
			this.isBikeSetupDone = true;
		}

		if (this.mixer) {
			this.mixer.update(delta);
		}
	}

	removeGLTFModel(modelObject, scene, renderer) {
		console.log("******* Deleting The Model *******");
		// Remove model from scene
		scene.remove(modelObject);

		// Dispose of model geometry and materials
		if (modelObject.geometry) {
			modelObject.geometry.dispose();
		}
		if (modelObject.material) {
			// If modelObject.material is an array of materials (e.g., MultiMaterial), iterate and dispose each
			if (Array.isArray(modelObject.material)) {
				modelObject.material.forEach((material) => {
					if (material.map) material.map.dispose();
					material.dispose();
				});
			} else {
				// Dispose of single material
				if (modelObject.material.map)
					modelObject.material.map.dispose();
				modelObject.material.dispose();
			}
		}

		// Dispose of any textures
		this.releaseTextures(modelObject);

		// Remove any event listeners, timers, or other references related to the model

		// Clean up renderer resources
		// renderer.dispose();

		// Ensure garbage collection releases memory
		modelObject = null;
		// scene = null;
		// renderer = null;
	}

	releaseTextures(object) {
		if (object.children) {
			object.children.forEach((child) => {
				this.releaseTextures(child);
			});
		}
		if (object.material) {
			if (Array.isArray(object.material)) {
				object.material.forEach((material) => {
					this.releaseMaterialTextures(material);
				});
			} else {
				this.releaseMaterialTextures(object.material);
			}
		}
	}

	releaseMaterialTextures(material) {
		if (material.map) material.map.dispose();
		if (material.lightMap) material.lightMap.dispose();
		if (material.bumpMap) material.bumpMap.dispose();
		if (material.normalMap) material.normalMap.dispose();
		if (material.displacementMap) material.displacementMap.dispose();
		if (material.roughnessMap) material.roughnessMap.dispose();
		if (material.metalnessMap) material.metalnessMap.dispose();
		if (material.alphaMap) material.alphaMap.dispose();
		if (material.emissiveMap) material.emissiveMap.dispose();
		if (material.envMap) material.envMap.dispose();
		if (material.clearcoatMap) material.clearcoatMap.dispose();
		if (material.clearcoatRoughnessMap)
			material.clearcoatRoughnessMap.dispose();
		if (material.reflectivityMap) material.reflectivityMap.dispose();
		if (material.specularMap) material.specularMap.dispose();
		if (material.userData && material.userData.originalMap) {
			material.map = material.userData.originalMap;
			delete material.userData.originalMap;
		}
		material.dispose();
	}
}
