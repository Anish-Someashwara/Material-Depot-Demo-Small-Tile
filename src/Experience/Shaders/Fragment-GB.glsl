// varying vec2 vUv;
// uniform sampler2D texture;
// uniform vec2 resolution;
// const int samples = 35,
//           LOD = 2,
//           sLOD = 1 << LOD;
// const float sigma = float(samples) * 0.25;

// float gaussian(vec2 i) {
//     return exp(-0.5 * dot(i /= sigma, i)) / (6.28 * sigma * sigma);
// }

// vec4 blur(sampler2D sp, vec2 U, vec2 scale) {
//     vec4 O = vec4(0);  
//     int s = samples / sLOD;
    
//     for (int i = 0; i < s * s; i++) {
//         vec2 d = vec2(i % s, i / s) * float(sLOD) - float(samples) / 2.;
//         O += gaussian(d) * textureLod(sp, U + scale * d, float(LOD));
//     }
    
//     return O / O.a;
// }

// void main() {
//     gl_FragColor = blur(texture, vUv, 1.0 / resolution);
// }



// varying vec2 vUv;
// uniform vec2 resolution;
// const int samples = 35,
//           LOD = 2,
//           sLOD = 1 << LOD;
// const float sigma = float(samples) * .25;

// float gaussian(vec2 i) {
//     return exp(-0.5 * dot(i /= sigma, i)) / (6.28 * sigma * sigma);
// }

// void main() {
//     vec2 center = vec2(0.5, 0.5); // Center of the blur
//     vec2 delta = vUv - center; // Distance from the center

//     vec4 color = vec4(0.0); // Initialize color

//     // Apply Gaussian blur
//     for (int i = 0; i < samples; i++) {
//         float percent = float(i) / float(samples - 1);
//         float weight = gaussian(delta * percent);
//         // color += texture2D(texture, vUv + delta * percent) * weight;
//     }

//     gl_FragColor = color / float(samples);
// }




// ************************************************************


// #ifdef GL_FRAGMENT_PRECISION_HIGH
// precision highp float;
// #else
// precision mediump float;
// #endif

// varying vec2 vUv;
// uniform sampler2D colorTexture;
// uniform vec2 texSize;
// uniform vec2 direction;
// uniform int alphamode;

// const int KERNEL_RADIUS = 2;
// const float SIGMA = 5.0;

// float gaussianPdf(in float x, in float sigma) {
//     return 0.39894 * exp(-0.5 * x * x / (sigma * sigma)) / sigma;
// }

// void main() {
//     vec2 invSize = 1.0 / texSize;
//     float fSigma = float(SIGMA);
//     float weightSum = gaussianPdf(0.0, fSigma);
//     vec4 diffuseSum = texture2D(colorTexture, vUv) * weightSum;
    
//     for (int i = 1; i < KERNEL_RADIUS; i++) {
//         float x = float(i);
//         float w = gaussianPdf(x, fSigma);
//         vec2 uvOffset = direction * invSize * x;
//         vec4 sample1 = texture2D(colorTexture, vUv + uvOffset);
//         vec4 sample2 = texture2D(colorTexture, vUv - uvOffset);
//         diffuseSum += (sample1 + sample2) * w;
//         weightSum += 2.0 * w;
//     }
    
//     if (alphamode == 1)
//         gl_FragColor = diffuseSum / weightSum;
//     else
//         gl_FragColor = vec4(diffuseSum.rgb / weightSum, 1.0);
// }




#ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
  #else
    precision mediump float;
  #endif
  
  uniform float znear;
  uniform float zfar;
  uniform float focalnear;
  uniform float focalfar;

  float linearize(float depth) {
    return -zfar * znear / (depth * (zfar - znear) - zfar);
  }

  void main() {
    float dist = linearize(gl_FragCoord.z);
    dist = (dist - focalnear) / (focalfar - focalnear);
    gl_FragColor = vec4(vec3(dist), 1.0);
  }