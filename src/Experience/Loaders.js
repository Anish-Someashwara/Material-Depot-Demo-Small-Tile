// ********** For Webpack Dev Server **********
import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { FileLoader } from "three/src/loaders/FileLoader.js";
import {RGBELoader} from "three/examples/jsm/loaders/RGBELoader";
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

// ********** For Build **********
// cdn link imports
// import * as THREE from "three";
// import { FBXLoader } from "three/addons/loaders/FBXLoader.js";
// import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
// import {RGBELoader} from "three/addons/loaders/RGBELoader";
// import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
// import { FileLoader } from "three/srcLoaders/loaders/FileLoader.js";


const encKey = '7f7720b911c2ecbb22637ed7adef41e82d44b6a0';
const encIv = 'h7oehNIHWGNIHxyN';

export default class Loaders {
	constructor() {
		// console.log(THREE)
		this.cacheName = "modelFilesCache";
		this.isCacheSupported = false;

		if ("caches" in window) {
			this.isCacheSupported = true;
		} else {
			console.log("Cache API is not supported in this  browser.");
		}
		this.setupLoaders();
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

	setupLoaders() {
		this.textureLoader = new THREE.TextureLoader();
		this.fbxLoader = new FBXLoader();
		this.gltfLoader = new GLTFLoader();
		this.rgbeLoader = new RGBELoader();
		this.dracoLoader = new DRACOLoader();

		// Setup Draco Loader
		// this.dracoLoader.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/");
		this.dracoLoader.setDecoderPath('https://unpkg.com/three@0.160.x/examples/jsm/libs/draco/gltf/'); 
		// this.dracoLoader.setDecoderPath("node_modules/three/examples/jsm/libs/draco")
		this.gltfLoader.setDRACOLoader( this.dracoLoader );

		this.fileLoader = new FileLoader();
		this.fileLoader.setResponseType("text");

		this.encStartTime = performance.now();
	}

	loadChunks(totalChunks, chunkIndex, rootPath) {
		let modelString = '';
		const key = encKey;
		const iv = CryptoJS.enc.Utf8.parse(encIv);
		return new Promise((resolve, reject) => {
			const loadNextChunk = () => {
				if (chunkIndex < totalChunks) {
					let url = `${rootPath}/encChunk${chunkIndex}.dat`;

					if(this.isCacheSupported){	
						const textDecoder = new TextDecoder('utf-8');
						let modelArrayBuffer = null
						let originalString = null;

						// Retrieve the file from the cache
						this.getFileFromCache(url.substring(1)).then(
							async (cachedFile) => {
								if (cachedFile) {
									console.log("************* Loading Model From Cache *************\n");
									modelArrayBuffer = await cachedFile.arrayBuffer();
									originalString = textDecoder.decode(modelArrayBuffer);

									// Decryption
									const decryptedText = CryptoJS.AES.decrypt(originalString,CryptoJS.enc.Utf8.parse(key.substring(0, 32)),{ iv: iv });
									let decryptedB64 = decryptedText.toString(CryptoJS.enc.Utf8);
									let decrypted = CryptoJS.enc.Base64.parse(decryptedB64).toString(CryptoJS.enc.Utf8); // Base64 decode the decrypted data
									modelString += decrypted;
									chunkIndex++; 
									loadNextChunk(); // Continue loading the next chunk
								} 
								else {
									this.cacheFile(url.substring(1)).then(async (encModelStr) => {
										console.log("***** Model Stored In Cache Successfully *****");
										modelArrayBuffer = await encModelStr.arrayBuffer();
										originalString = textDecoder.decode(modelArrayBuffer);

										// Decryption
										const decryptedText = CryptoJS.AES.decrypt(originalString,CryptoJS.enc.Utf8.parse(key.substring(0, 32)),{ iv: iv });
										let decryptedB64 = decryptedText.toString(CryptoJS.enc.Utf8);
										let decrypted = CryptoJS.enc.Base64.parse(decryptedB64).toString(CryptoJS.enc.Utf8); // Base64 decode the decrypted data
										modelString += decrypted;
										chunkIndex++; 
										loadNextChunk(); // Continue loading the next chunk
										
									});
								}


								// Decryption
								// console.log(url, key, iv,"\n")
								// console.log(originalString)
								// const decryptedText = CryptoJS.AES.decrypt(originalString,CryptoJS.enc.Utf8.parse(key.substring(0, 32)),{ iv: iv });
								// let decryptedB64 = decryptedText.toString(CryptoJS.enc.Utf8);
								// let decrypted = CryptoJS.enc.Base64.parse(decryptedB64).toString(CryptoJS.enc.Utf8); // Base64 decode the decrypted data
								// modelString += decrypted;
								// chunkIndex++; 
								// loadNextChunk(); // Continue loading the next chunk
							}
						);
					}
					else{
						this.fileLoader.load(url, (encryptedData) => {
								// Decryption
								const decryptedText = CryptoJS.AES.decrypt(encryptedData,CryptoJS.enc.Utf8.parse(key.substring(0, 32)),{ iv: iv});
								let decryptedB64 = decryptedText.toString(CryptoJS.enc.Utf8);
								let decrypted = CryptoJS.enc.Base64.parse(decryptedB64).toString(CryptoJS.enc.Utf8); // Base64 decode the decrypted data
								modelString += decrypted;
								chunkIndex++;
								loadNextChunk(); // Continue loading the next chunk
							},
							function (xhr) {
								// console.log(`Loading Chunk ${chunkIndex}/${totalChunks-1} --->    ` +Math.trunc((xhr.loaded / xhr.total) * 100) +"% loaded");
							}, // onProgress callback
							(err)=> {
								this.addReloadPopup(err.message);
								reject("An error happened: ", err);
							} // onError callback
						);
					}
				} 
				else {
					console.log("Chunks loaded ✅"); // All chunks are loaded and decrypted
					this.parseGLTF(modelString).then((gltf) => {resolve(gltf);}); // Now, can parse the GLTF
				}

			};

			loadNextChunk(); // Start loading chunks
		});
	}

	
	// *********************************************************
	// 					Loading Chunks
	// *********************************************************

	loadDeEncChunks(totalChunks, chunkIndex, rootPath, isCanvasLoaderActive) {
		console.log("---- ROOT PATH ---- ", rootPath);
		let modelString = '';
		const promises = [];

		let promiseDummy = new Promise((resolve, reject) => {
						    	setTimeout(() => { resolve('');}, 2000);
						   });
		promises.push(promiseDummy);
		
		return new Promise((resolve, reject) => {
			for (let i = chunkIndex; i < totalChunks; i++) {
				let url = `${rootPath}/chunk${i}.dat`;
				// console.log("---- URL ---- ", url);
	
				if (this.isCacheSupported) {
					promises.push(
						this.getFileFromCache(url.substring(1)).then(async (cachedFile) => {
							const textDecoder = new TextDecoder('utf-8');
							let originalString;
							
							if (cachedFile) {
								console.log("************* Loading Model From Cache *************\n");
								const modelArrayBuffer = await cachedFile.arrayBuffer();
								originalString = textDecoder.decode(modelArrayBuffer);
							} else {
								const encModelStr = await this.cacheFile(url.substring(1));
								console.log("***** Model Stored In Cache Successfully *****");
								const modelArrayBuffer = await encModelStr.arrayBuffer();
								originalString = textDecoder.decode(modelArrayBuffer);
							}
	
							return originalString;
						})
					);
				} else {
					promises.push(
						new Promise((resolve, reject) => {
							this.fileLoader.load(
								url,
								(gltfString) => { resolve(gltfString); },
								(xhr)=>{ console.log(`Loading Chunk ${i}/${totalChunks - 1} --->    ` + Math.trunc((xhr.loaded / xhr.total) * 100) + "% loaded"); },
								(err)=>{ 
									this.addReloadPopup(err.message);
									reject("An error happened: " + err); 
								}
							);
						})
					);
				}
			}

			if(isCanvasLoaderActive){
				// Start tracking progress
				this.trackProgress(promises, this.updateLoadingBar).then(results => {
					console.log('All promises resolved');
				}).catch(error => {
					this.addReloadPopup(error.message);
					console.error('Error:', error);
				});
			}
	
			Promise.all(promises).then(async (results) => {
				modelString = results.join('');
				console.log("Chunks loaded ✅"); // All chunks are loaded and decrypted
				// await this.parseGLTF(modelString).then((gltf) => { resolve(gltf); });
				let gltfPromise = await this.parseGLTF(modelString)

				// if(isCanvasLoaderActive){
				// 	this.deactivateLoader();
				// }

				resolve(gltfPromise)
				// this.simulateLoading();

			}).catch((err) => { 
				this.addReloadPopup(err.message);
				reject("An error happened: " + err); 
			});
		});
	}
	

	parseGLTF(modelData) {
		console.log("******** Parsing The Model Now ********");
		return new Promise((resolve, reject) => {
			this.gltfLoader.parse(modelData,"",
				(gltf) => {resolve(gltf);},
				(err) => {
					console.log(`Some Error Occured While Parsing Model Chunks: ${err}`);
					this.addReloadPopup(err.message);
					reject(err);
				}
			);
		});
	}

	// Function to wrap each promise to track progress
	trackProgress(promises, progressCallback) {
		let completed = 0;
		promises = promises.map(p => 
			p.then(result => {
				completed++;
				progressCallback(completed, promises.length);
				return result;
			})
		);
		return Promise.all(promises);
	}

	// Function to update the loading bar of bikeView/Bike Model
	updateLoadingBar(completed, total) {
		let loadingBar = document.getElementById('loadingBar');
		let percentage = (completed / total) * 100;
		loadingBar.style.width = percentage + '%';

		if (completed === total) {
			setTimeout(() => {
				// document.getElementById('loadingOverlay').style.display = 'none';
			}, 500); // Adding a slight delay before hiding the overlay
		}
	}

	// Function to deactivate loader and hide overlay
	deactivateLoader() {
		let loadingBar = document.getElementById('loadingBar');
		let currentWidth = parseFloat(loadingBar.style.width);
		let increment = 1; // Increment percentage per frame
		let interval = setInterval(() => {
			currentWidth += increment;
			loadingBar.style.width = currentWidth + '%';
			if (currentWidth >= 100) {
				clearInterval(interval); // Stop interval when reaching 100%
				setTimeout(() => {
					document.getElementById('loadingOverlay').style.display = 'none';
				}, 500); // Adding a slight delay before hiding the overlay
			}
		}, 10); // Interval time (adjust as needed for smoothness)
	}



	/**
	 * Will Load Fbx model (.fbx)
	 * @param {*} url url from where model is to be loaded
	 * @returns Promise which on resolve return Model
	 */

	loadFBX(url){
		return new Promise((resolve) => {
			this.fbxLoader.load(
				url,
				(fbx) => {
					resolve(fbx);
				},
				(xhr) => {
					console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
				},
				(error) => {
					console.log(error);
					resolve();
				}
			);
		});
	};

	/**
	 * Will Load GLTF model (.gltf or .glb) and will store it in browser's cache if browser supports cache
	 * @param {*} url url from where model is to be loaded
	 * @returns Promise which on resolve return Model
	 */

	loadGLTF(url){
		return new Promise((resolve, reject) => {
			// if (this.isCacheSupported) {
			// 	// Retrieve the file from the cache
			// 	this.getFileFromCache(url.substring(1)).then(
			// 		async (cachedFile) => {
			// 			if (cachedFile != null) {
			// 				console.log(
			// 					"************* Loading Model From Cache *************"
			// 				);
			// 				const modelArrayBuffer =
			// 					await cachedFile.arrayBuffer();
			// 				this.gltfLoader.parse(
			// 					modelArrayBuffer,
			// 					"",
			// 					(gltf) => {
			// 						resolve(gltf);
			// 					}
			// 				); // Loading GLTF by arrayBuffer or GLTF string data
			// 			} else {
			// 				console.log(
			// 					"************* Loading Model From Server *************"
			// 				);
			// 				this.loadGltfByUrl(url).then((res) => {
			// 					this.cacheFile(url.substring(1)).then(() => {
			// 						console.log(
			// 							"************* Model Stored In Cache Successfully *************"
			// 						);
			// 						resolve(res);
			// 					});
			// 				});
			// 			}
			// 		}
			// 	);
			// } else {
			// 	console.log("Cache API is not supported in this browser.");
			// 	this.loadGltfByUrl(url).then((res) => {
			// 		resolve(res);
			// 	});
			// }

			// console.log("Cache API is not supported in this browser.");

			this.loadGltfByUrl(url).then((res) => {
				resolve(res);
			});
		});
	};

	// GLTF Loader
	loadGltfByUrl(url) {
		return new Promise((resolve, reject) => {
			const startTime = performance.now();
			this.gltfLoader.load(
				url,
				(gltf) => {
					const modelLoadTime = performance.now() - startTime;
					// console.log(
					// 	"GLTF model loaded in",
					// 	Math.trunc(modelLoadTime),
					// 	"milliseconds"
					// );
					// console.log(
					// 	"************* Model Loaded Successfully *************"
					// );
					resolve(gltf);
				},
				(xhr) => {
					// console.log(Math.trunc((xhr.loaded / xhr.total) * 100) + "% loaded");
					// console.log(xhr.loaded);
					// let debugScreenPtag = document.getElementById('debug-info');
					// debugScreenPtag.innerHTML = `Loadin: ${(xhr.loaded / xhr.total) * 100} % loaded"`;

				},
				(error) => {
					this.addReloadPopup(error.message);
					console.log("Error Occured while loading model: ", error);
					reject(error);
				}
			);
		});
	}

	/**
	 * Will Load Texture (.jpg, .png, .gif etc.)
	 * @param {*} url url from where texture is to be loaded
	 * @returns Promise which on resolve return texture
	 */

	loadTexture(url){
		return new Promise((resolve, reject) => {
			this.textureLoader.load(url,
				(texture) => { resolve(texture); },
				(xhr) => { 
					// console.log((xhr.loaded / xhr.total) * 100 + "% loaded"); 
				},
				(error) => {
					this.addReloadPopup("Error While Loading Textures!");
					console.log("8888888888888", error);
					reject(error);
				}
			);
		});
	};

	// Loader RGBE assets
	loadRGBETextures(url) {
		return new Promise((resolve, reject) => {
			this.rgbeLoader.load(url, (texture)=>{
				// console.log("RGBE Texture Loaded Successfully!");
				resolve(texture);
			},
			(xhr) => {
				// console.log(Math.trunc((xhr.loaded / xhr.total) * 100) + "% loaded");
			},
			(error) => {
				this.addReloadPopup(error.message);
				console.log("Error Occured while loading rgbe texture: ", error);
				reject(error);
			})
		})
	}

	// Loader RGBE assets
	loadMultipleRGBETextures(urls) {
		const promises = urls.map(url => {
			return new Promise((resolve, reject) => {
				this.rgbeLoader.load(url, 
					texture => resolve({ path: url, texture }),
					xhr => {
						// Progress callback if needed
					},
					error => {
						this.addReloadPopup(error.message);
						reject(error)
					}
				);
			});
		});
		return Promise.all(promises).then(textures => {
			const texturesObject = {};
			textures.forEach(({ path, texture }) => {
				texturesObject[path] = texture;
			});
			return texturesObject;
		});
	}

	// Function to add a file to the cache
	async cacheFile(filePath) {
		const cache = await caches.open(this.cacheName);
		const response = await fetch(filePath);
		await cache.put(filePath, response.clone());
		return response;
	}

	// Function to retrieve a file from the cache
	async getFileFromCache(filePath) {
		const cache = await caches.open(this.cacheName);
		const cachedResponse = await cache.match(filePath);
		return cachedResponse;
	}
}
