//Working on mood progress bars
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
let renderer = new THREE.WebGLRenderer();

let playerSettings = {
    turnSpeed: Math.PI * 0.01,
    speed: 0.2,
    sprintSpeed: 0.4,
    animCycleDur: 1
}

let body = {};

//Game references
let team = 'Citizen';
let phoneState = false;
let moodState = false;
let cash = 0;

let phoneDiv = document.getElementById("phone");
let player;

//Mood references
let moodDiv = document.getElementById("mood");

let hungerProg = document.getElementById("mood-hunger-fill");
let hungerText = document.getElementById("mood-hunger-text");

let energyProg = document.getElementById("mood-energy-fill");
let energyText = document.getElementById("mood-energy-text");

let hygieneProg = document.getElementById("mood-hygiene-fill");
let hygieneText = document.getElementById("mood-hygiene-text");

let entertainmentProg = document.getElementById("mood-entertainment-fill");
let entertainmentText = document.getElementById("mood-entertainment-text");

//OBJ Loader
let objLoader = new THREE.OBJLoader();
objLoader.setPath('Assets/');

const keysPressed = {};

//Movement Controls
const KEY_UP = 'arrowup';
const KEY_LEFT = 'arrowleft';
const KEY_DOWN = 'arrowdown';
const KEY_RIGHT = 'arrowright';
const KEY_W = 'w';
const KEY_A = 'a';
const KEY_S = 's';
const KEY_D = 'd';
const KEY_SHIFT = 'shift';

//Game keybinds
const KEY_M = 'm';

renderer.setClearColor(0x87CEEB);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;

let ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

let spotLight = new THREE.SpotLight(0xffffff, 0.85, 1000, Math.PI / 2);
spotLight.position.set(50, 10, 50);
spotLight.target.position.x = 20;
scene.add(spotLight);
scene.add(spotLight.target);

//START

//Player
function initCharacter(role, skin){
    let color;
    let skincolor;

    //Clothes
    if(role == 'Prisoner') {
        color = 0xFE7300;
    } else if(role == 'Police') {
        color = 0x347ACA;
    } else if(role == 'Citizen') {
        color = 0xBFBDBD;
    }

    //Skin
    if(skin == 'Tan'){
        skincolor = 0xF1C27D;
    }

    //Torso
    let torsoGeometry = facetedBox(1.75, 2, 1, 0.1, false);
    let torsoMaterial = new THREE.MeshLambertMaterial({color: color});
    let torso = new THREE.Mesh(torsoGeometry, torsoMaterial);

    body['torso'] = torso;
    torso.position.set(0, 0, 0);

    //Upper Right arm
    let upperRightArmGeometry = facetedBox(1, 1.1, 1, 0.1, false);
    let upperRightArmMaterial = new THREE.MeshLambertMaterial({color: color});
    let upperRightArm = new THREE.Mesh(upperRightArmGeometry, upperRightArmMaterial);

    body['upperRightArm'] = upperRightArm;
    upperRightArm.position.set(-1.2, 0.45, 0);

    //Lower Right Arm
    let lowerRightArmGeometry = facetedBox(1, 1.1, 1, 0.1, false);
    let lowerRightArmMaterial = new THREE.MeshLambertMaterial({color: skincolor});
    let lowerRightArm = new THREE.Mesh(lowerRightArmGeometry, lowerRightArmMaterial);

    body['lowerRightArm'] = lowerRightArm;
    lowerRightArm.position.set(-1.2, -0.45, 0);

    //Right Arm
    let rightArm = new THREE.Group();
    rightArm.add(upperRightArm);
    rightArm.add(lowerRightArm);

    body['rightArm'] = rightArm;

    //Upper Left arm
    let upperLeftArmGeometry = facetedBox(1, 1.1, 1, 0.1, false);
    let upperLeftArmMaterial = new THREE.MeshLambertMaterial({color: color});
    let upperLeftArm = new THREE.Mesh(upperLeftArmGeometry, upperLeftArmMaterial);

    body['upperLeftArm'] = upperLeftArm;
    upperLeftArm.position.set(1.2, 0.45, 0);

    //Lower Left arm
    let lowerLeftArmGeometry = facetedBox(1, 1.1, 1, 0.1, false);
    let lowerLeftArmMaterial = new THREE.MeshLambertMaterial({color: skincolor});
    let lowerLeftArm = new THREE.Mesh(lowerLeftArmGeometry, lowerLeftArmMaterial);

    body['lowerLeftArm'] = lowerLeftArm;
    lowerLeftArm.position.set(1.2, -0.45, 0);

    //Left Arm
    let leftArm = new THREE.Group();
    leftArm.add(upperLeftArm);
    leftArm.add(lowerLeftArm);

    body['leftArm'] = leftArm;

    //Upper Right leg
    let upperRightLegGeometry = facetedBox(0.9, 1.1, 1, 0.1, false);
    let upperRightLegMaterial = new THREE.MeshLambertMaterial({color: color});
    let upperRightLeg = new THREE.Mesh(upperRightLegGeometry, upperRightLegMaterial);

    body['upperRightLeg'] = upperRightLeg;
    upperRightLeg.position.set(-0.4, -1.4, 0);

    //Lower Right leg
    let lowerRightLegGeometry = facetedBox(0.9, 1.1, 1, 0.1, false);
    let lowerRightLegMaterial = new THREE.MeshLambertMaterial({color: color});
    let lowerRightLeg = new THREE.Mesh(lowerRightLegGeometry, lowerRightLegMaterial);

    body['lowerRightLeg'] = lowerRightLeg;
    lowerRightLeg.position.set(-0.4, -2.3, 0);

    //Right Leg
    let rightLeg = new THREE.Group();
    rightLeg.add(upperRightLeg);
    rightLeg.add(lowerRightLeg);

    body['rightLeg'] = rightLeg;

    //Upper Left leg
    let upperLeftLegGeometry = facetedBox(0.9, 1.1, 1, 0.1, false);
    let upperLeftLegMaterial = new THREE.MeshLambertMaterial({color: color});
    let upperLeftLeg = new THREE.Mesh(upperLeftLegGeometry, upperLeftLegMaterial);

    body['upperLeftLeg'] = upperLeftLeg;
    upperLeftLeg.position.set(0.4, -2.3, 0);

    //Lower Left leg
    let lowerLeftLegGeometry = facetedBox(0.9, 1.1, 1, 0.1, false);
    let lowerLeftLegMaterial = new THREE.MeshLambertMaterial({color: color});
    let lowerLeftLeg = new THREE.Mesh(lowerLeftLegGeometry, lowerLeftLegMaterial);

    body['lowerLeftLeg'] = lowerLeftLeg;
    lowerLeftLeg.position.set(0.4, -1.4, 0);

    //Left Leg
    let leftLeg = new THREE.Group();
    leftLeg.add(upperLeftLeg);
    leftLeg.add(lowerLeftLeg);

    body['leftLeg'] = leftLeg;

    //Head
    let headGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.75, 32);
    let headMaterial = new THREE.MeshLambertMaterial({color: skincolor});
    let head = new THREE.Mesh(headGeometry, headMaterial);

    body['head'] = head;
    head.position.set(0, 1.375, 0);

    //Character
    let player = new THREE.Group();
    player.add(torso);
    player.add(rightArm);
    player.add(leftArm);
    player.add(rightLeg);
    player.add(leftLeg);
    player.add(head);

    body['player'] = player;
    return player;
}

camera.up.set(0, 0, 1);

let controls;
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

let planeGeometry, planeMaterial, plane;
let prison;
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

    updateCash();
}

function initControls() {
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.minDistance = 2;
    controls.maxDistance = 150;
    controls.enablePan = false;
    controls.update();
}

function update(){
    //Movement Controls
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
            }
    
            if(keysPressed[KEY_S] || keysPressed[KEY_DOWN]){
                player.position.x += Math.sin(player.rotation.y) * playerSettings.sprintSpeed;
                player.position.y += -Math.cos(player.rotation.y) * playerSettings.sprintSpeed;
    
                camera.position.x += Math.sin(player.rotation.y) * playerSettings.sprintSpeed;
                camera.position.y += -Math.cos(player.rotation.y) * playerSettings.sprintSpeed;
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
            }
    
            if(keysPressed[KEY_S] || keysPressed[KEY_DOWN]){
                player.position.x += Math.sin(player.rotation.y) * playerSettings.speed;
                player.position.y += -Math.cos(player.rotation.y) * playerSettings.speed;
    
                camera.position.x += Math.sin(player.rotation.y) * playerSettings.speed;
                camera.position.y += -Math.cos(player.rotation.y) * playerSettings.speed;
            }
        }
    }
}

function changeTeam(newTeam) {
    team = newTeam;
    document.getElementById('teamSelect').style.display = 'none';
    
    if(team == 'Prisoner'){
        player = undefined;

        player = new initCharacter('Prisoner', 'Tan');
        player.rotation.set(Math.PI * 0.5, -Math.PI / 2, Math.PI * 2);
        player.position.set(1.5, -2, 2.85);

        scene.add(player);
    } else if(team == 'Citizen'){
        player = undefined;
        
        player = new initCharacter('Citizen', 'Tan');
        player.rotation.set(Math.PI * 0.5, -Math.PI / 2, Math.PI * 2);
        player.position.set(1.5, -2, 2.85);

        scene.add(player);
    } else if(team == 'Police'){
        player = undefined;
        
        player = new initCharacter('Police', 'Tan');
        player.rotation.set(Math.PI * 0.5, -Math.PI / 2, Math.PI * 2);
        player.position.set(1.5, -2, 2.85);

        scene.add(player);
    }

    controls.enabled = true;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
};

function render() {
    update();

    requestAnimationFrame(render);
    renderer.render(scene, camera);
};

function toScreenPosition(obj, cam) {
    let vector = new THREE.Vector3();

    let widthHalf = 0.5 * renderer.context.canvas.width;
    let heightHalf = 0.5 * renderer.context.canvas.height;

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
    if(keysPressed[KEY_M]) {
        togglePhone();
    }

    keysPressed[event.key.toLowerCase()] = false;
}, false);

window.addEventListener('resize', onWindowResize, false);

document.getElementById("scene").appendChild(renderer.domElement);
render();
loadEnvironment();

//Animating
function timeline(){
    timeline = function(){}; //One time function

    let tl = new TimelineMax().delay(1);

    //Walk

    //Left Arm
    tl.to(body['upperLeftArm'].rotation, playerSettings.animCycleDur, {x: Math.PI / 4, ease: Expo.easeOut});
    tl.to(body['lowerLeftArm'].rotation, playerSettings.animCycleDur, {x: Math.PI / 4, ease: Expo.easeOut}, `-=${playerSettings.animCycleDur}`);
    tl.to(body['lowerLeftArm'].position, playerSettings.animCycleDur, {y: -0.2, ease: Expo.easeOut}, `-=${playerSettings.animCycleDur}`);
    tl.to(body['lowerLeftArm'].position, playerSettings.animCycleDur, {z: -0.7, ease: Expo.easeOut}, `-=${playerSettings.animCycleDur}`);

    tl.to(body['lowerLeftArm'].rotation, playerSettings.animCycleDur, {y: Math.PI / 16, ease: Expo.easeOut}, `-=${playerSettings.animCycleDur}`);
    tl.to(body['leftArm'].rotation, playerSettings.animCycleDur, {y: Math.PI / 16, ease: Expo.easeOut}, `-=${playerSettings.animCycleDur}`);

    //Right Arm
    tl.to(body['upperRightArm'].rotation, playerSettings.animCycleDur, {x: -Math.PI / 4, ease: Expo.easeOut}, `-=${playerSettings.animCycleDur}`);
    tl.to(body['lowerRightArm'].rotation, playerSettings.animCycleDur, {x: -Math.PI / 4, ease: Expo.easeOut}, `-=${playerSettings.animCycleDur}`);
    tl.to(body['lowerRightArm'].position, playerSettings.animCycleDur, {y: -0.2, ease: Expo.easeOut}, `-=${playerSettings.animCycleDur}`);
    tl.to(body['lowerRightArm'].position, playerSettings.animCycleDur, {z: 0.7, ease: Expo.easeOut}, `-=${playerSettings.animCycleDur}`);

    tl.to(body['lowerRightArm'].rotation, playerSettings.animCycleDur, {y: -Math.PI / 16, ease: Expo.easeOut}, `-=${playerSettings.animCycleDur}`);
    tl.to(body['rightArm'].rotation, playerSettings.animCycleDur, {y: Math.PI / 16, ease: Expo.easeOut}, `-=${playerSettings.animCycleDur}`);

    //Left Leg
    tl.to(body['lowerLeftLeg'].rotation, playerSettings.animCycleDur, {x: -Math.PI / 4, ease: Expo.easeOut}, `-=${playerSettings.animCycleDur}`);
    tl.to(body['upperLeftLeg'].rotation, playerSettings.animCycleDur, {x: -Math.PI / 4, ease: Expo.easeOut}, `-=${playerSettings.animCycleDur}`);
    tl.to(body['upperLeftLeg'].position, playerSettings.animCycleDur, {y: -1.9, ease: Expo.easeOut}, `-=${playerSettings.animCycleDur}`);
    tl.to(body['upperLeftLeg'].position, playerSettings.animCycleDur, {z: 0.5, ease: Expo.easeOut}, `-=${playerSettings.animCycleDur}`);

    tl.to(body['upperLeftLeg'].rotation, playerSettings.animCycleDur, {y: Math.PI / 16, ease: Expo.easeOut}, `-=${playerSettings.animCycleDur}`);
    tl.to(body['leftArm'].rotation, playerSettings.animCycleDur, {y: Math.PI / 16, ease: Expo.easeOut}, `-=${playerSettings.animCycleDur}`);

    //Right Leg
    tl.to(body['upperRightLeg'].rotation, playerSettings.animCycleDur, {x: Math.PI / 4, ease: Expo.easeOut}, `-=${playerSettings.animCycleDur}`);
    tl.to(body['lowerRightLeg'].rotation, playerSettings.animCycleDur, {x: Math.PI / 4, ease: Expo.easeOut}, `-=${playerSettings.animCycleDur}`);
    tl.to(body['lowerRightLeg'].position, playerSettings.animCycleDur, {y: -1.9, ease: Expo.easeOut}, `-=${playerSettings.animCycleDur}`);
    tl.to(body['lowerRightLeg'].position, playerSettings.animCycleDur, {z: -0.5, ease: Expo.easeOut}, `-=${playerSettings.animCycleDur}`);

    tl.to(body['lowerRightLeg'].rotation, playerSettings.animCycleDur, {y: Math.PI / 16, ease: Expo.easeOut}, `-=${playerSettings.animCycleDur}`);
    tl.to(body['rightLeg'].rotation, playerSettings.animCycleDur, {y: Math.PI / 16, ease: Expo.easeOut}, `-=${playerSettings.animCycleDur}`);
}

//Toggles
function togglePhone() {
    if(phoneState){
        phoneState = false;
    } else {
        phoneState = true;
    }

    if(phoneState) {
        phoneDiv.style.visibility = "visible";
    } else {
        phoneDiv.style.visibility = "hidden";
    }
}

function toggleMood() {
    if(moodState){
        moodState = false;
    } else {
        moodState = true;
    }

    if(moodState) {
        moodDiv.style.visibility = "visible";
    } else {
        moodDiv.style.visibility = "hidden";
    }
}

//Updates
function updateCash(){
    document.getElementById("userMoney").innerHTML = formatCash(cash);
}

function updateMood(mood, percentage) {
    if(removePercentage(percentage) > 100){
        percentage = '100%';
    }

    mood.style.width = percentage;
    mood.children[0].innerHTML = percentage;

    if(removePercentage(percentage) >= 70){ //Green
        mood.style.background = "rgba(23, 230, 23, 1)";
        mood.parentNode.style.background = "rgba(23, 230, 23, 0.4)";
    } else if(removePercentage(percentage) >= 40){
        mood.style.background = "rgba(238, 210, 2, 1)";
        mood.parentNode.style.background = "rgba(238, 210, 2, 0.4)";
    } else {
        mood.style.background = "rgba(255, 0, 0, 1)";
        mood.parentNode.style.background = "rgba(255, 0, 0, 0.4)";
    }
}

//Tools
function formatCash(money) {
    if(money > 1000000){
        let moneyStr = `${money / 1000000}m`
        return moneyStr;
    } else {
        return money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
}

function removePercentage(str){
    str = str.replace('%', '');
    return str;
}