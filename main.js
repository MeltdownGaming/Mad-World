var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();

var keyboard = {};

var playerSettings = {
    turnSpeed: Math.PI * 0.01
}

//OBJ Loader
var objLoader = new THREE.OBJLoader();
objLoader.setPath('/Assets/');

const KEY_LEFT = 37;
const KEY_RIGHT = 39;

renderer.setClearColor(0x87CEEB);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;

var ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

var spotLight = new THREE.SpotLight(0xffffff, 0.85, 1000, Math.PI / 2);
spotLight.position.set(50, 10, 50);
spotLight.target.position.x = 20;
scene.add(spotLight);
scene.add(spotLight.target);

//START

//Player
function initCharacter(){
    //Torso
    var torsoGeometry = facetedBox(1.75, 2, 1, 0.1, false);
    var torsoMaterial = new THREE.MeshLambertMaterial({color: 0xff0000});
    var torso = new THREE.Mesh(torsoGeometry, torsoMaterial);

    torso.position.set(0, 0, 0);

    //Upper Right arm
    var upperRightArmGeometry = facetedBox(1, 1.1, 1, 0.1, false);
    var upperRightArmMaterial = new THREE.MeshLambertMaterial({color: 0xff0000});
    var upperRightArm = new THREE.Mesh(upperRightArmGeometry, upperRightArmMaterial);

    upperRightArm.position.set(-1.2, 0.45, 0);

    //Lower Right Arm
    var lowerRightArmGeometry = facetedBox(1, 1.1, 1, 0.1, false);
    var lowerRightArmMaterial = new THREE.MeshLambertMaterial({color: 0xf1c27d});
    var lowerRightArm = new THREE.Mesh(lowerRightArmGeometry, lowerRightArmMaterial);

    lowerRightArm.position.set(-1.2, -0.45, 0);

    //Right Arm
    var rightArm = new THREE.Group();
    rightArm.add(upperRightArm);
    rightArm.add(lowerRightArm);

    //Upper Left arm
    var upperLeftArmGeometry = facetedBox(1, 1.1, 1, 0.1, false);
    var upperLeftArmMaterial = new THREE.MeshLambertMaterial({color: 0xff0000});
    var upperLeftArm = new THREE.Mesh(upperLeftArmGeometry, upperLeftArmMaterial);

    upperLeftArm.position.set(1.2, 0.45, 0);

    //Lower Left arm
    var lowerLeftArmGeometry = facetedBox(1, 1.1, 1, 0.1, false);
    var lowerLeftArmMaterial = new THREE.MeshLambertMaterial({color: 0xf1c27d});
    var lowerLeftArm = new THREE.Mesh(lowerLeftArmGeometry, lowerLeftArmMaterial);

    lowerLeftArm.position.set(1.2, -0.45, 0);

    //Left Arm
    var leftArm = new THREE.Group();
    leftArm.add(upperLeftArm);
    leftArm.add(lowerLeftArm);

    //Upper Right leg
    var upperRightLegGeometry = facetedBox(0.9, 1.1, 1, 0.1, false);
    var upperRightLegMaterial = new THREE.MeshLambertMaterial({color: 0x0000ff});
    var upperRightLeg = new THREE.Mesh(upperRightLegGeometry, upperRightLegMaterial);

    upperRightLeg.position.set(-0.4, -1.4, 0);

    //Lower Right leg
    var lowerRightLegGeometry = facetedBox(0.9, 1.1, 1, 0.1, false);
    var lowerRightLegMaterial = new THREE.MeshLambertMaterial({color: 0x0000ff});
    var lowerRightLeg = new THREE.Mesh(lowerRightLegGeometry, lowerRightLegMaterial);

    lowerRightLeg.position.set(-0.4, -2.3, 0);

    //Right Leg
    var rightLeg = new THREE.Group();
    rightLeg.add(upperRightLeg);
    rightLeg.add(lowerRightLeg);

    //Upper Left leg
    var upperLeftLegGeometry = facetedBox(0.9, 1.1, 1, 0.1, false);
    var upperLeftLegMaterial = new THREE.MeshLambertMaterial({color: 0x0000ff});
    var upperLeftLeg = new THREE.Mesh(upperLeftLegGeometry, upperLeftLegMaterial);

    upperLeftLeg.position.set(0.4, -2.3, 0);

    //Lower Left leg
    var lowerLeftLegGeometry = facetedBox(0.9, 1.1, 1, 0.1, false);
    var lowerLeftLegMaterial = new THREE.MeshLambertMaterial({color: 0x0000ff});
    var lowerLeftLeg = new THREE.Mesh(lowerLeftLegGeometry, lowerLeftLegMaterial);

    lowerLeftLeg.position.set(0.4, -1.4, 0);

    //Left Leg
    var leftLeg = new THREE.Group();
    leftLeg.add(upperLeftLeg);
    leftLeg.add(lowerLeftLeg);

    //Head
    var headGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.75, 32);
    var headMaterial = new THREE.MeshLambertMaterial({color: 0xf1c27d});
    var head = new THREE.Mesh(headGeometry, headMaterial);

    head.position.set(0, 1.375, 0);

    //Character
    var character = new THREE.Group();
    character.add(torso);
    character.add(rightArm);
    character.add(leftArm);
    character.add(rightLeg);
    character.add(leftLeg);
    character.add(head);

    scene.add(character);

    return character;
}

var player = new initCharacter();
player.rotation.x = Math.PI * 0.5;
player.position.z += 2.85;

//Map
objLoader.load('Prison.obj', function(prison){
    prison.rotation.x = Math.PI / 2;
    prison.position.z += 0.01; //Does't glitch with the ground
    prison.scale.set(15, 15, 15)
    scene.add(prison);
});

//Controls
const controls = new THREE.PlayerControls(camera, player);
controls.init();

camera.position.set(0, -17, 5);
camera.rotation.set(1.2, 0.006, -0.02);

//END

//Functions
function facetedBox(w, h, d, f, isWireframed){
    let hw = w * 0.5, hh = h * 0.5, hd = d * 0.5;
    let vertices = [
    // px
    hw, hh - f, -hd + f,   // 0
    hw, -hh + f, -hd + f,  // 1
    hw, -hh + f, hd - f,   // 2
    hw, hh - f, hd - f,    // 3

    // pz
    hw - f, hh - f, hd,    // 4
    hw - f, -hh + f, hd,   // 5
    -hw + f, -hh + f, hd,  // 6
    -hw + f, hh - f, hd,   // 7

    // nx
    -hw, hh - f, hd - f,   // 8
    -hw, -hh + f, hd - f,  // 9
    -hw, -hh + f, -hd + f, // 10
    -hw, hh - f, -hd + f,  // 11

    // nz
    -hw + f, hh - f, -hd,  // 12
    -hw + f, -hh + f, -hd, // 13
    hw - f, -hh + f, -hd,  // 14
    hw - f, hh - f, -hd,   // 15

    // py
    hw - f, hh, -hd + f,   // 16
    hw - f, hh, hd - f,    // 17
    -hw + f, hh, hd - f,   // 18
    -hw + f, hh, -hd + f,  // 19

    // ny
    hw - f, -hh, -hd + f,  // 20
    hw - f, -hh, hd - f,   // 21
    -hw + f, -hh, hd - f,  // 22
    -hw + f, -hh, -hd + f  // 23
    ];

    let indices = [
    0, 2, 1, 3, 2, 0,
    4, 6, 5, 7, 6, 4,
    8, 10, 9, 11, 10, 8,
    12, 14, 13, 15, 14, 12,
    16, 18, 17, 19, 18, 16,
    20, 21, 22, 23, 20, 22,

    // link the sides
    3, 5, 2, 4, 5, 3,
    7, 9, 6, 8, 9, 7,
    11, 13, 10, 12, 13, 11,
    15, 1, 14, 0, 1, 15,

    // link the lids
    // top
    16, 3, 0, 17, 3, 16,
    17, 7, 4, 18, 7, 17,
    18, 11, 8, 19, 11, 18,
    19, 15, 12, 16, 15, 19,
    // bottom
    1, 21, 20, 2, 21, 1,
    5, 22, 21, 6, 22, 5,
    9, 23, 22, 10, 23, 9,
    13, 20, 23, 14, 20, 13,

    // corners
    // top
    3, 17, 4,
    7, 18, 8,
    11, 19, 12,
    15, 16, 0,
    // bottom
    2, 5, 21,
    6, 9, 22,
    10, 13, 23,
    14, 1, 20
    ];

    let indicesWire = [
    0, 1, 1, 2, 2, 3, 3, 0,
    4, 5, 5, 6, 6, 7, 7, 4,
    8, 9, 9, 10, 10, 11, 11, 8,
    12, 13, 13, 14, 14, 15, 15, 12,
    16, 17, 17, 18, 18, 19, 19, 16,
    20, 21, 21, 22, 22, 23, 23, 20,
    // link the sides
    2, 5, 3, 4,     //px - pz
    6, 9, 7, 8,     // pz - nx
    10, 13, 11, 12, // nx - nz
    15, 0, 14, 1,   // nz - px

    // link the lids
    // top
    16, 0, 17, 3,   // px
    17, 4, 18, 7,   // pz
    18, 8, 19, 11,  // nx
    19, 12, 16, 15,  // nz
    // bottom
    20, 1, 21, 2,
    21, 5, 22, 6,
    22, 9, 23, 10,
    23, 13, 20, 14
    ];

    let geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.BufferAttribute(new Float32Array(vertices), 3));
    geom.setIndex(isWireframed ? indicesWire : indices);
    if (!isWireframed) geom.computeVertexNormals();
    return geom;
};

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
};

function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);

    controls.update();

    if(keyboard[KEY_LEFT]){
        player.rotation.y += playerSettings.turnSpeed;
    }

    if(keyboard[KEY_RIGHT]){
        player.rotation.y -= playerSettings.turnSpeed;
    }
};

var planeGeometry = new THREE.PlaneGeometry(100, 100, 100, 100);
var planeMaterial = new THREE.MeshLambertMaterial({color: 0xAAFF75});
var plane = new THREE.Mesh(planeGeometry, planeMaterial);

plane.position.set(0, 0, 0);
scene.add(plane);

function keyDown(event) {
    keyboard[event.keyCode] = true;
};

function keyUp(event) {
    keyboard[event.keyCode] = false;
};

window.addEventListener('resize', onWindowResize, false);
window.addEventListener('keydown', keyDown);
window.addEventListener('keyup', keyUp);

document.getElementById("scene").appendChild(renderer.domElement);
render();