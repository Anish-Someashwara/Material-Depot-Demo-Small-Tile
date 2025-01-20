import Experience from "./Experience";

let _instance = null;
export default class ResourceManager {
	constructor() {
		if (_instance) return _instance;

        this.canvasResources = {
            "dummyBikeModelGltf": null,
            "envMaps": null,
            "BikeModel": null
        }; // Store the loaded resources here
        
        this.experience = new Experience();
        this.loaders = this.experience.loaders;
        


        // this.loadDummyBikeModel()
        // .then(res=>{
        //     console.log("Dummy Bike ✅ ", res, this.canvasResources)

        //     // console.log("**** Dummy Model Loaded Finished ****")
        //     // console.log("**** Loading bike and Envs Now ****")
            
        //     // this.loadEnvMaps()
        //     // .then(res=>{ console.log("Env Maps ✅ ", res, this.canvasResources) });

        //     // this.loadBikeModel()
        //     // .then(res=>{ console.log("Bike Model ✅ ", res, this.canvasResources) });
        // });

		// this.loadDummyLoaders();

        this.loadEnvMaps()
        .then(res=>{ 
			// console.log("Env Maps ✅ ", res, this.canvasResources) 
			console.log("Env Maps ✅ ") 
		});

        this.loadBikeModel()
        .then(res=>{ 
			// console.log("Bike Model ✅ ", res, this.canvasResources) 
			console.log("Bike Model ✅ ") 
		});

    }



    async loadDummyBikeModel() {
		// this.uiLoader.hideLoader();

		return new Promise(async (resolve, reject) => {
			try {
                console.log("******** Started DummyBike Loading ********");

                let loadingBar = document.getElementById('loadingBar');
				let width = 0;
				let interval = setInterval(frame, 50);
	
				function frame() {
					if (width >= 5) {
						clearInterval(interval);
						// document.getElementById('loadingOverlay').style.display = 'none';
					} else {
						width++;
						loadingBar.style.width = width + '%';
					}
				}

				const dummyLoader1 = this.loaders.loadGltfByUrl('/static/models/Bloom_Cy_A1_NLA_track.gltf');


				const dummyBikeModelGltf = this.loaders.loadDeEncChunks(3, 0, "/static/models/LowPolyBike", false);
                console.log("******** DummyBike Loaded ✅ ********");


				Promise.all([dummyLoader1, dummyBikeModelGltf])
				.then(res=>{
					console.log("hi:",res)
					if(!res[0].animations.length){
						this.canvasResources["dummyBikeModelGltf"] = res[0];
						this.canvasResources["dummyLoader1"] = res[1];
					}
					else{
						this.canvasResources["dummyBikeModelGltf"] = res[1];
						this.canvasResources["dummyLoader1"] = res[0];	
					}
					

					resolve(dummyBikeModelGltf);
				})
				// resolve(dummyBikeModelGltf);
			} 
			catch (error) {
				console.log("Some Error Came While Loading Dummy Model: ",error.message);
                this.addReloadPopup(error.message);
                reject(error);
			}
		});
	}

	async loadDummyLoaders(){
		return new Promise(async (resolve, reject) => {
			try {
                console.log("******** Started DummyBike Loading ********");

				// const dummyBikeModelGltf = await this.loaders.loadDeEncChunks(3, 0, "/static/models/LowPolyBike", false);
				const dummyLoader1 = await this.loaders.loadGltfByUrl('/static/models/Bloom_Cy_A1_Actions.gltf');
				// const dummyLoader2 = await this.loaders.loadGltfByUrl('/static/models/Bloom_Cy_A1_Actions.gltf');
				
				console.log("******** DummyBike Loaded ✅ ********");

                this.canvasResources["dummyLoader1"] = dummyLoader1;
				resolve(dummyLoader1);
			} 
			catch (error) {
				console.log("Some Error Came While Loading Dummy Loader Model: ",error.message);
                this.addReloadPopup(error.message);
                reject(error);
			}
		});
	}


    async loadEnvMaps() {
        // **************************** Environment Maps Loading ****************************
    
        const basePath = `static/EnvrionmentMaps`;
        const envMapPaths = [
            `${basePath}/EnvMapTyreRim.hdr`,
            `${basePath}/NewGlobalEnvMap.hdr`,
            `${basePath}/HeadLightGlass.hdr`,
        ];
    
        let envMaps;
        try {
            console.log("******** Started Maps Loading ********");
            envMaps = await this.loaders.loadMultipleRGBETextures(envMapPaths);

            console.log("******** EnvMaps Loaded! ✅********");

            this.canvasResources["envMaps"] = envMaps;
            return envMaps; // Return the loaded environment maps
        } 
        catch (error) {
            console.log("Some error came while loading env maps!", error);
            this.addReloadPopup(error.message);
            throw error; // Re-throw the error to be handled by the caller
        }
    }
    



    async loadBikeModel() {
        // **************************** Bike Model Loading ****************************
        try {
            console.log("******** Started BikeModel Loading ********");
            
            // const gltf = await this.loaders.loadDeEncChunks(18, 0, "/static/models/BikeModel_12-7-24-SplitTextures/BikeModel_12-7-24_Center_v1", true);
            const gltf = await this.loaders.loadGltfByUrl('/static/models/Big Tile_A2.gltf');
            
            
            
            console.log("******** BikeModel Loaded! ✅********");

			this.canvasResources["BikeModel"] = gltf;
			return gltf; // Return the loaded model

        } catch (error) {
            console.log("Some error came while loading Bike Model!", error);
            this.addReloadPopup(error.message);
            throw error; // Re-throw the error to be handled by the caller
        }


        
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
}