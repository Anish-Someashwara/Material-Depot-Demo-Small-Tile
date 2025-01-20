import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
// import { TAARenderPass } from 'three/examples/jsm/postprocessing/TAARenderPass.js';

// CDN Links
// import * as THREE from "three";
// import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
// import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
// import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
// import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'
// import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

// import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass.js';
// import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';
// import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader.js';

import Experience from '../Experience.js';
// import vertexShader from '../Shaders/BlubBloomShader/Vertex.glsl';
// import fragmentShader from '../Shaders/BlubBloomShader/Fragment.glsl';

export default class BloomEffect {
  constructor() {
    // Global Properties
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.camera = this.experience.camera.instance;
    this.renderer = this.experience.renderer.instance;
    this.sizes = this.experience.sizes;
    this.canvas = this.experience.domElements.canvas;
    this.gui = this.experience.debuggerDatGUI.gui;
    this.bloomObjects = [];

    this.t = 0;
    this.dir = 1;


    this.init();
  }

  init() {
    this.BLOOM_SCENE = 1;

    this.bloomLayer = new THREE.Layers();
    this.bloomLayer.set(this.BLOOM_SCENE);

    this.params = {
      threshold: 0,
      strength: 3,
      radius: 1,
      exposure: 1,
    };

    this.darkMaterial = new THREE.MeshBasicMaterial({ color: 'black' });
    this.materials = {};

    // this.experience.camera.cameraControls.addEventListener('controlstart', ()=>{this.render()})
    this.renderScene = new RenderPass(this.scene, this.camera);

    this.bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.5,
      0.4,
      0.85
    );
    this.bloomPass.threshold = this.params.threshold;
    this.bloomPass.strength = this.params.strength;
    this.bloomPass.radius = this.params.radius;

    this.bloomComposer = new EffectComposer(this.renderer);
    this.bloomComposer.renderToScreen = false;
    this.bloomComposer.addPass(this.renderScene);
    this.bloomComposer.addPass(this.bloomPass);

    this.mixPass = new ShaderPass(
      new THREE.ShaderMaterial({
        uniforms: {
          baseTexture: { value: null },
          bloomTexture: { value: this.bloomComposer.renderTarget2.texture },
        },
        vertexShader: document.getElementById('vertexshader').textContent,
        fragmentShader: document.getElementById('fragmentshader').textContent,
        defines: {},
      }),
      'baseTexture'
    );

    this.mixPass.needsSwap = true;

    this.outputPass = new OutputPass();
    // this.gammaCorrectionShader = new ShaderPass(GammaCorrectionShader); // Fixing Color Issue Caused Due To The Post Processing

    // Fixing for anti-aliasing --- start
    // this.smaaPass = new SMAAPass(); // SMAAPass is working only on the browser which support webgl2 renderer
    // this.fxaaPass = new ShaderPass(FXAAShader); // FXAAPass doesn't give better results, it is worst than classic renderer antialise
    // this.fxaaPass.material.uniforms["resolution"].value.x = -2 / (this.experience.sizes.x * this.renderer.getPixelRatio());
    // this.fxaaPass.material.uniforms["resolution"].value.y = -2 / (this.experience.sizes.x * this.renderer.getPixelRatio());

    // The below renderTarget will solve the issue of pattern shading effect
    const size = this.renderer.getDrawingBufferSize(new THREE.Vector2());
    const renderTarget = new THREE.WebGLRenderTarget(size.width, size.height, {
      samples: 3,
      format: THREE.RGBAFormat,
      encoding: THREE.sRGBEncoding,
      colorSpace: THREE.LinearSRGBColorSpace,
      // type: THREE.HalfFloatType,
      // generateMipmaps: true,
      // minFilter: THREE.LinearFilter,
      // magFilter: THREE.LinearFilter,
      // type: THREE.UnsignedByteType,
      // anisotropy: this.renderer.capabilities.getMaxAnisotropy(),
      // depthBuffer: true,
      // stencilBuffer: true,
      // count: 5
      // wrapS: THREE.MirroredRepeatWrapping,
      // wrapT: THREE.MirroredRepeatWrapping
    });
    // Fixing for anti-aliasing --- end

    // this.renderer.getPixelRatio()    this.renderer.getPixelRatio() === 1 ? 2 : 0
    // let debugScreenPtag = document.getElementById('debug-info');
    // debugScreenPtag.innerHTML = `${this.renderer.getPixelRatio()}`;

    this.finalComposer = new EffectComposer(this.renderer);
    this.finalComposer.setPixelRatio(window.devicePixelRatio);
    this.finalComposer.setSize(window.innerWidth, window.innerHeight);

    // this.taaRenderPass = new TAARenderPass( this.scene, this.camera );
    // this.taaRenderPass.unbiased = true;
    // this.taaRenderPass.sampleLevel = 4;
    // this.finalComposer.addPass( this.taaRenderPass );
    // this.smaaPass = new SMAAPass( size.width * this.renderer.getPixelRatio(), size.height * this.renderer.getPixelRatio() );
    // this.finalComposer.addPass( this.smaaPass );
    // this.finalComposer.addPass(this.gammaCorrectionShader);

    this.finalComposer.addPass(this.renderScene);
    this.finalComposer.addPass(this.mixPass);
    this.finalComposer.addPass(this.outputPass);
    // this.bloomComposer.addPass(this.outputPass);

    // this.raycaster = new THREE.Raycaster();
    // this.mouse = new THREE.Vector2();
    // window.addEventListener( 'pointerdown', (event) =>{
    // Calculate normalized device coordinates based on the canvas size and position
    // const canvasBoundingRect = this.canvas.getBoundingClientRect();

    // this.mouse.x = ((event.clientX - canvasBoundingRect.left) / canvasBoundingRect.width) * 2 - 1;
    // this.mouse.y = -((event.clientY - canvasBoundingRect.top) / canvasBoundingRect.height) * 2 + 1;

    // this.raycaster.setFromCamera( this.mouse, this.camera );
    // const intersects = this.raycaster.intersectObjects( this.scene.children );
    // // console.log("Clicked!", intersects.length, this.scene.children)

    // if ( intersects.length > 0 ) {
    //     console.log("Found Object!", intersects[0]);
    //     const object = intersects[ 0 ].object;
    //     object.layers.toggle( this.BLOOM_SCENE );
    //     this.render();
    // }
    // } );

    this.addGuiControls();
    
    // this.setupScene();
  }

  setupScene() {
    this.scene.traverse(this.disposeMaterial);
    // this.scene.children.length = 0;

    const geometry = new THREE.IcosahedronGeometry(1, 15);

    for (let i = 0; i < 1; i++) {
      const color = new THREE.Color(0xa4a832);
      // color.setHSL( Math.random(), 0.7, Math.random() * 0.2 + 0.05 );

      const material = new THREE.MeshBasicMaterial({ color: color });
      const sphere = new THREE.Mesh(geometry, material);
      sphere.position.x = Math.random() * 100 - 5;
      sphere.position.y = Math.random() * 100 - 5;
      sphere.position.z = Math.random() * 100 - 5;
      sphere.position.normalize().multiplyScalar(Math.random() * 400.0 + 2.0);
      sphere.scale.setScalar(Math.random() * Math.random() + 10);
      this.scene.add(sphere);
      sphere.name = 'Sphere' + i;

      if (Math.random() < 0.25) sphere.layers.enable(this.BLOOM_SCENE);
    }

    this.render();
  }

  addBloomEffectOnObj(obj) {
    obj.layers.enable(this.BLOOM_SCENE);
    this.bloomObjects.push(obj);
    this.render();
  }

  addGuiControls() {
    this.BlubbloomFolder = this.gui.addFolder('Bulb Bloom');

    this.BlubbloomFolder.add(this.params, 'threshold', 0.0, 1.0).onChange(
      (value) => {
        this.bloomPass.threshold = Number(value);
        console.log('**********************');
        this.render();
      }
    );

    this.BlubbloomFolder.add(this.params, 'strength', 0.0, 3).onChange(
      (value) => {
        this.bloomPass.strength = Number(value);
        this.render();
      }
    );

    this.BlubbloomFolder.add(this.params, 'radius', 0.0, 1.0)
      .step(0.01)
      .onChange((value) => {
        this.bloomPass.radius = Number(value);
        this.render();
      });

    this.BlubbloomFolder.add(this.params, 'exposure', 0.1, 2).onChange(
      (value) => {
        this.renderer.toneMappingExposure = Math.pow(value, 4.0);
        this.render();
      }
    );
    this.BlubbloomFolder.close();
  }

  disposeMaterial(obj) {
    if (obj.material) {
      obj.material.dispose();
    }
  }

  onResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.bloomComposer.setSize(width, height);
    this.finalComposer.setSize(width, height);
    this.render();
  }

  render() {
    // if ( this.taaRenderPass ) this.taaRenderPass.accumulate = true;

    this.scene.traverse((obj) => {
      // DarkenNonBloomed Function
      if (obj.isMesh && this.bloomLayer.test(obj.layers) === false) {
        // console.log(obj)
        this.materials[obj.uuid] = obj.material;
        obj.material = this.darkMaterial;
      }
    });

    this.bloomComposer.render();
    this.scene.traverse((obj) => {
      // RestoreMaterial Function
      if (this.materials[obj.uuid]) {
        obj.material = this.materials[obj.uuid];
        delete this.materials[obj.uuid];
      }
    });
   
    this.finalComposer.render();

    // render the entire scene, then render bloom scene on top
  }

  

  update() {
    this.t += this.dir * 0.005;
    if(this.t>1){
      this.t=1;
      this.dir = -1;
    }
    else if(this.t<0){
      this.t=0;
      this.dir=1
    }
    const currVal = THREE.MathUtils.lerp(1, 3, this.t);
    this.bloomPass.strength = currVal;


    // console.log("Running...");
    // this.bloomComposer.render();
    // this.finalComposer.render();
    this.render();
  }

  darkenNonBloomed(obj) {
    if (obj.isMesh && this.bloomLayer.test(obj.layers) === false) {
      this.materials[obj.uuid] = obj.material;
      obj.material = this.darkMaterial;
    }
  }

  restoreMaterial(obj) {
    if (this.materials[obj.uuid]) {
      obj.material = this.materials[obj.uuid];
      delete this.materials[obj.uuid];
    }
  }
}
