//Fix prison.obj not passing through socket.io! :(
//Socket.io mulitplayer :C
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();

var playerSettings = {
    turnSpeed: Math.PI * 0.01,
    speed: 0.2,
    sprintSpeed: 0.4
}

var team = 'Citizen';

//OBJ Loader
var objLoader = new THREE.OBJLoader();
objLoader.setPath('Assets/');

const keysPressed = {};
const KEY_UP = 'arrowup';
const KEY_LEFT = 'arrowleft';
const KEY_DOWN = 'arrowdown';
const KEY_RIGHT = 'arrowright';
const KEY_W = 'w';
const KEY_A = 'a';
const KEY_S = 's';
const KEY_D = 'd';
const KEY_SHIFT = 'shift';

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
    var torsoMaterial = new THREE.MeshLambertMaterial({color: 0xFE7300});
    var torso = new THREE.Mesh(torsoGeometry, torsoMaterial);

    torso.position.set(0, 0, 0);

    //Upper Right arm
    var upperRightArmGeometry = facetedBox(1, 1.1, 1, 0.1, false);
    var upperRightArmMaterial = new THREE.MeshLambertMaterial({color: 0xFE7300});
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
    var upperLeftArmMaterial = new THREE.MeshLambertMaterial({color: 0xFE7300});
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
    var upperRightLegMaterial = new THREE.MeshLambertMaterial({color: 0xFE7300});
    var upperRightLeg = new THREE.Mesh(upperRightLegGeometry, upperRightLegMaterial);

    upperRightLeg.position.set(-0.4, -1.4, 0);

    //Lower Right leg
    var lowerRightLegGeometry = facetedBox(0.9, 1.1, 1, 0.1, false);
    var lowerRightLegMaterial = new THREE.MeshLambertMaterial({color: 0xFE7300});
    var lowerRightLeg = new THREE.Mesh(lowerRightLegGeometry, lowerRightLegMaterial);

    lowerRightLeg.position.set(-0.4, -2.3, 0);

    //Right Leg
    var rightLeg = new THREE.Group();
    rightLeg.add(upperRightLeg);
    rightLeg.add(lowerRightLeg);

    //Upper Left leg
    var upperLeftLegGeometry = facetedBox(0.9, 1.1, 1, 0.1, false);
    var upperLeftLegMaterial = new THREE.MeshLambertMaterial({color: 0xFE7300});
    var upperLeftLeg = new THREE.Mesh(upperLeftLegGeometry, upperLeftLegMaterial);

    upperLeftLeg.position.set(0.4, -2.3, 0);

    //Lower Left leg
    var lowerLeftLegGeometry = facetedBox(0.9, 1.1, 1, 0.1, false);
    var lowerLeftLegMaterial = new THREE.MeshLambertMaterial({color: 0xFE7300});
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

camera.up.set(0, 0, 1);

var controls;
initControls();

controls.enabled = false;

camera.position.set(65, -21, 43);
camera.rotation.set(0.5, 1, 1);

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

var planeGeometry, planeMaterial, plane;
var prison;
function loadEnvironment(){
    //Ground
    planeGeometry = new THREE.PlaneGeometry(100, 100, 100, 100);
    planeMaterial = new THREE.MeshLambertMaterial({color: 0xAAFF75});
    plane = new THREE.Mesh(planeGeometry, planeMaterial);
    
    plane.position.set(0, 0, 0);
    scene.add(plane);

    //Map
    objLoader.load('prison.obj', function(prison){
        prison.rotation.x = Math.PI / 2;
        prison.position.z += 0.1; //Does't glitch with the ground
        prison.scale.set(15, 15, 15)
        scene.add(prison);
    });
}

function initControls() {
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.minDistance = 2;
    controls.maxDistance = 150;
    controls.enablePan = false;
    controls.update();
}

function updateControls(){
    if(controls.enabled){
        controls.target.copy(player.position);

        if(keysPressed[KEY_SHIFT]){
            //Left and Right Rotation
            if(keysPressed[KEY_LEFT]){
                player.rotation.y += playerSettings.turnSpeed;
            }
    
            if(keysPressed[KEY_RIGHT]){
                player.rotation.y -= playerSettings.turnSpeed;
            }
            
            //W and S Movement
            if(keysPressed[KEY_W] || keysPressed[KEY_UP]){
                player.position.x -= Math.sin(player.rotation.y) * playerSettings.sprintSpeed;
                player.position.y -= -Math.cos(player.rotation.y) * playerSettings.sprintSpeed;
    
                camera.position.x -= Math.sin(player.rotation.y) * playerSettings.sprintSpeed;
                camera.position.y -= -Math.cos(player.rotation.y) * playerSettings.sprintSpeed;

                socket.emit('updateXYpos', username, player.position.x, player.position.y);
            }
    
            if(keysPressed[KEY_S] || keysPressed[KEY_DOWN]){
                player.position.x += Math.sin(player.rotation.y) * playerSettings.sprintSpeed;
                player.position.y += -Math.cos(player.rotation.y) * playerSettings.sprintSpeed;
    
                camera.position.x += Math.sin(player.rotation.y) * playerSettings.sprintSpeed;
                camera.position.y += -Math.cos(player.rotation.y) * playerSettings.sprintSpeed;

                socket.emit('updateXYpos', username, player.position.x, player.position.y);
            }
        } else {
            //Left and Right Rotation
            if(keysPressed[KEY_LEFT]){
                player.rotation.y += playerSettings.turnSpeed;
            }
    
            if(keysPressed[KEY_RIGHT]){
                player.rotation.y -= playerSettings.turnSpeed;
            }
            
            //W and S Movement
            if(keysPressed[KEY_W] || keysPressed[KEY_UP]){
                player.position.x -= Math.sin(player.rotation.y) * playerSettings.speed;
                player.position.y -= -Math.cos(player.rotation.y) * playerSettings.speed;
    
                camera.position.x -= Math.sin(player.rotation.y) * playerSettings.speed;
                camera.position.y -= -Math.cos(player.rotation.y) * playerSettings.speed;

                socket.emit('updateXYpos', username, player.position.x, player.position.y);
            }
    
            if(keysPressed[KEY_S] || keysPressed[KEY_DOWN]){
                player.position.x += Math.sin(player.rotation.y) * playerSettings.speed;
                player.position.y += -Math.cos(player.rotation.y) * playerSettings.speed;
    
                camera.position.x += Math.sin(player.rotation.y) * playerSettings.speed;
                camera.position.y += -Math.cos(player.rotation.y) * playerSettings.speed;

                socket.emit('updateXYpos', username, player.position.x, player.position.y);
            }
        }
    }
}

function changeTeam(team) {
    if(team == 'Prisoner'){
        document.getElementById('teamSelect').style.display = 'none';
        controls.enabled = true;
    };
}

function outputCamera(){
    console.log(Math.round(camera.position.x));
    console.log(Math.round(camera.position.y));
    console.log(Math.round(camera.position.z));
    console.log("");
    console.log(Math.round(camera.rotation.x));
    console.log(Math.round(camera.rotation.y));
    console.log(Math.round(camera.rotation.z));
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
};

function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);

    updateControls();
};

function toScreenPosition(obj, cam) {
    var vector = new THREE.Vector3();

    var widthHalf = 0.5 * renderer.context.canvas.width;
    var heightHalf = 0.5 * renderer.context.canvas.height;

    obj.updateMatrixWorld();
    vector.setFromMatrixPosition(obj.matrixWorld);
    vector.project(cam);

    vector.x = ( vector.x * widthHalf ) + widthHalf;
    vector.y = - ( vector.y * heightHalf ) + heightHalf;

    return { 
        x: vector.x,
        y: vector.y
    };
};

//Keys
document.addEventListener('keydown', (event) => {
    keysPressed[event.key.toLowerCase()] = true;
}, false);
document.addEventListener('keyup', (event) => {
    keysPressed[event.key.toLowerCase()] = false;
}, false);

window.addEventListener('resize', onWindowResize, false);

document.getElementById("scene").appendChild(renderer.domElement);
render();
loadEnvironment();