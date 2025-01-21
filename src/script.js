// // ******** For Webpack Dev Server only *********
// import './style.css';
// import './CSSUtilityClass.css'

// // ******** For Build (comment the css imports) *********
// // import './style.css';
// // import './CSSUtilityClass.css'

// import Experience from "./Experience/Experience.js";
// const experience = new Experience();




// /////////////////////////////////////////////////
// //                  Debugger
// ////////////////////////////////////////////////
// // let debugScreenPtag = document.getElementById('debug-info');
// // debugScreenPtag.innerHTML = `${window.innerWidth} X ${window.innerHeight}`;

  







// ******** For Webpack Dev Server only *********
import './style.css';
// import './CSSUtilityClass.css'

// ******** For Build (comment the css imports) *********
// import './style.css';
// import './CSSUtilityClass.css'

import Experience from "./Experience/Experience.js";

document.addEventListener('DOMContentLoaded', () => {
    const experience = new Experience();

    //////////////////////////////////////////////////
    //                  Debugger
    //////////////////////////////////////////////////
    // let debugScreenPtag = document.getElementById('debug-info');
    // debugScreenPtag.innerHTML = `${window.innerWidth} X ${window.innerHeight}`;
});
