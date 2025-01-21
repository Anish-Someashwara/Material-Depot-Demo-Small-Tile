import * as THREE from 'three';
import Experience from './Experience.js';
import CameraControls from 'camera-controls';

CameraControls.install({ THREE: THREE });

export default class Camera {
	constructor() {
		this.experience = new Experience();
		const { sizes, scene, domElements } = this.experience;
		this.sizes = sizes;
		this.scene = scene;
		this.canvas = domElements.canvas;
		this.bikeDiv = domElements.bikeDiv;

		// Limit Range To Restrict Panning (Used Inside Update Method)
		this.camContOffsetLimit = {minX: -240, maxX: 225, minY: -70, maxY: 30}; 
		// this.camContOffsetLimit = {minX: -200, maxX: 200, minY: -55, maxY: 30}; 

		this.setInstance();
		this.setControls();
	}


	/**
	 * Will create an instance of the Camera
	 */
	setInstance() {
		this.instance = new THREE.PerspectiveCamera(
			20,
			this.sizes.x / this.sizes.y,
			30,
			10000,
		);
		this.scene.add(this.instance);
		// this.instance.position.set(-280, 282, -390);
		this.instance.position.set(358.89943011863386, 253.0309704373563, -330.2285840212415);

		// this.instance.position.set(0, 500, -500);
		// this.instance.up.set(0,0,1)
		// this.instance.lookAt(0, 0, 0);
	}

	/**
	* Setup User Controls
	*/
	setControls() {

		// **************************** Camera-Controls ****************************
		this.cameraControls = new CameraControls(this.instance, this.canvas);
		// this.cameraControls.maxPolarAngle = (Math.PI / 180) * 90; // default is 0 degree
		// this.cameraControls.minPolarAngle = 0; // default is 0 radians
		
		this.cameraControls.minDistance = 175;
		this.cameraControls.maxDistance = 1000;


		this.cameraControls.setTarget(0, 5, 0, true);
		// this.cameraControls.setOrbitPoint(0,100,0)
		
		// ************* For Desktop Devices *************
		this.cameraControls.mouseButtons.right = CameraControls.ACTION.OFFSET;
		
		// ************* For Mobile Devices *************
		this.cameraControls.touches.two = CameraControls.ACTION.TOUCH_DOLLY_OFFSET;
		this.cameraControls.touches.three = CameraControls.ACTION.NONE;


		// this.cameraControls.mouseButtons.right = CameraControls.ACTION.TRUCK;
		// this.cameraControls.mouseButtons.left = CameraControls.ACTION.NONE;
		// this.cameraControls.touches.one = CameraControls.ACTION.NONE;
		// this.cameraControls.touches.two = CameraControls.ACTION.TOUCH_DOLLY_TRUCK;
		// this.cameraControls.touches.two = CameraControls.ACTION.TOUCH_DOLLY_OFFSET;
		// this.cameraControls.touches.three = CameraControls.ACTION.TOUCH_OFFSET;
		// this.cameraControls.touches.three = CameraControls.ACTION.TOUCH_OFFSET;

		
		
		this.cameraControls.addEventListener('controlstart', (e) => {
			console.log("****** Controls start ******");
						
			// let camPos = this.cameraControls.getPosition();
			// let isCamMoved = (camPos.x !== -37 || camPos.y !== 118 || camPos.z !== 81) ?  true : false;
			// console.log(camPos, isCamMoved);

			let CurrentTarget = this.cameraControls.getTarget();
			if(CurrentTarget.x !== 0 && CurrentTarget.z !== 0){
				console.log("Changing The Target!!!");
				this.cameraControls.setTarget(0, 50, 0, true);
				// this.cameraControls.setOrbitPoint(0, 100, 0)
			}

		});



		/////////////////////////////////////////////////////////////////////////////////
		//	The fixUp() Method is made to increase the polar angle of the camera (not working now)
		/////////////////////////////////////////////////////////////////////////////////

		// this.cameraControls.addEventListener('control', () => {
		// 	console.log("****** Controls controls******")
		// 	// fixUp();
		// });
		// const fixUp = () => {
		// 	const target = this.cameraControls.getTarget();
		// 	const view = new THREE.Vector3().subVectors(target, this.instance.position).normalize();
			
		// 	// So first find the vector off to the side, orthogonal to both this.object.up and
		// 	// the "view" vector.
		// 	const side = new THREE.Vector3().crossVectors(view, this.instance.up).normalize();
			
		// 	// Then find the vector orthogonal to both this "side" vector and the "view" vector.
		// 	// This vector will be the new "up" vector.
		// 	const up = new THREE.Vector3().crossVectors(side, view).normalize();
		// 	this.instance.up.copy(up);

		// 	const position = this.cameraControls.getPosition( new THREE.Vector3() );
		// 	this.cameraControls.updateCameraUp();
		// 	this.cameraControls.setPosition( position.x, position.y, position.z );
		// };
	}

	/**
	 * Will resize the Camera
	 */
	resize() {
		this.sizes.x = this.bikeDiv.clientWidth;
		this.sizes.y = this.bikeDiv.clientHeight;
		this.instance.aspect = this.sizes.x / this.sizes.y;
		this.instance.updateProjectionMatrix();
	}

	update(delta) {
		// console.log('this.instance.position :>> ', this.instance.position);
		// Limiting The Panning
		if (this.cameraControls) {
			const camContOffset = this.cameraControls.getFocalOffset();
			const offsetX = Math.max(this.camContOffsetLimit.minX, Math.min(this.camContOffsetLimit.maxX, camContOffset.x));
			const offsetY = Math.max(this.camContOffsetLimit.minY, Math.min(this.camContOffsetLimit.maxY, camContOffset.y));
			
			if(offsetX!=camContOffset.x || offsetY!=camContOffset.y){
				this.cameraControls.setFocalOffset(offsetX, offsetY, 0, true);
			}
			
			this.cameraControlsisUpdated = this.cameraControls.update(delta);
		}
	}

}





