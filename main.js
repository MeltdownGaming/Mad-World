var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xff0000)
document.getElementById("scene").appendChild(renderer.domElement);


//Start
//End

function render(){
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}

render();
