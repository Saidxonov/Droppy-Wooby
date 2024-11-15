// cleaner code in
//
// https://codepen.io/ste-vg/pen/pNqdRq
console.clear();
var Stage = /** @class */ (function () {
    function Stage(scale, font) {
        this.width = 0;
        this.scale = 1;
        this.wrappingImages = [
            'https://assets.ste.vg/codepen/cardboard1.jpg',
            'https://assets.ste.vg/codepen/cardboard2.jpg',
            'https://assets.ste.vg/codepen/cardboard3.jpg',
        ];
        this.letterTextures = [];
        this.presentTextures = [];
        this.scale = scale;
        this.font = font;
        for (var i in this.wrappingImages) {
            var letterTexture = new THREE.TextureLoader().load(this.wrappingImages[i]);
            letterTexture.wrapS = THREE.RepeatWrapping;
            letterTexture.wrapT = THREE.RepeatWrapping;
            letterTexture.repeat.set(0.1, 0.1);
            this.letterTextures.push(letterTexture);
            var presentTexture = new THREE.TextureLoader().load(this.wrappingImages[i]);
            presentTexture.wrapS = THREE.RepeatWrapping;
            presentTexture.wrapT = THREE.RepeatWrapping;
            presentTexture.repeat.set(1, 1);
            this.presentTextures.push(presentTexture);
        }
        THREE.Cache.enabled = true;
        this.container = document.createElement('div');
        document.body.appendChild(this.container);
        this.camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 1500);
        this.camera.position.set(0, 0, 0);
        this.cameraTarget = new THREE.Vector3(0, 10, 0);
        // SCENE
        this.scene = new THREE.Scene();
        // this.scene.fog = new THREE.Fog(0x000033, 80 * this.scale, 150 * this.scale);
        // LIGHTS
        this.dirLight = new THREE.DirectionalLight(0xffffff, 0.7);
        this.dirLight.position.set(10 * this.scale, 20 * this.scale, 1 * this.scale); //.normalize();
        this.dirLight.target.position.set(0, 0, 0);
        this.dirLight.castShadow = true;
        this.dirLight.shadow.camera.near = 10 * this.scale;
        this.dirLight.shadow.camera.far = 100 * this.scale;
        this.dirLight.shadow.camera.left = -20 * this.scale;
        this.dirLight.shadow.camera.right = 20 * this.scale;
        this.dirLight.shadow.camera.top = 55 * this.scale;
        this.dirLight.shadow.camera.bottom = -10 * this.scale;
        this.scene.add(this.dirLight);
        this.scene.add(this.dirLight.target);
        //this.scene.add(new THREE.CameraHelper( this.dirLight.shadow.camera ))
        this.pointLight = new THREE.PointLight(0xffffff, 0.7);
        //	this.pointLight.position.set( 0, 20 * this.scale, 5 * this.scale );
        //	this.pointLight.castShadow = true;
        //this.scene.add( this.pointLight );
        this.scene.add(new THREE.AmbientLight(0xffffff, 0.3));
        this.group = new THREE.Group();
        this.group.position.y = 100;
        this.scene.add(this.group);
        this.plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(1000 * this.scale, 1000 * this.scale), new THREE.MeshLambertMaterial({ color: 0xffffff, opacity: 1, transparent: false }));
        this.plane.receiveShadow = true;
        //plane.position.y = 100;
        //this.plane.rotation.x = - Math.PI / 2;
        this.scene.add(this.plane);
        var dir = new THREE.Vector3(1, 0, 0);
        //normalize the direction vector (convert to vector of length 1)
        dir.normalize();
        var axisHelper = new THREE.AxisHelper(5);
        //this.scene.add( axisHelper );
        // RENDERER
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        //this.renderer.setClearColor( this.scene.fog.color );
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMapSoft = false;
        //this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        //this.renderer.physicallyBasedShading = true;
        this.container.appendChild(this.renderer.domElement);
        // this.renderer.shadowCameraNear = 0;
        // this.renderer.shadowCameraFar = this.camera.far;
        // this.renderer.shadowCameraFov = 50;
        // this.renderer.shadowMapBias = 0.0039;
        // this.renderer.shadowMapDarkness = 0.5;
        // this.renderer.shadowMapWidth = 1024;
        // this.renderer.shadowMapHeight = 1024;
        this.onResize();
        this.moveCamera(0);
    }
    Stage.prototype.setPlane = function (physicsPlane) {
        this.plane.position.copy(physicsPlane.position);
        this.plane.quaternion.copy(physicsPlane.quaternion);
    };
    Stage.prototype.moveCamera = function (x) {
        var newYZ = 60 + (x / 2);
        if (newYZ > 60)
            newYZ = 60;
        TweenMax.to(this.camera.position, 0.4, { x: (-10 + x) * this.scale, z: newYZ * this.scale, y: newYZ * this.scale });
        TweenMax.to(this.cameraTarget, 0.4, { x: x * this.scale });
        TweenMax.to(this.pointLight.position, 0.4, { x: x * this.scale });
        TweenMax.to(this.dirLight.position, 0.4, { x: (10 + x) * this.scale });
        TweenMax.to(this.dirLight.target.position, 0.4, { x: x * this.scale });
        TweenMax.to(this.plane.position, 0.4, { x: x * this.scale });
        //this.camera.position.set( -20 + x, 20, 20 );
        //this.cameraTarget = new THREE.Vector3( x, 0, 0 );
    };
    Stage.prototype.render = function () {
        this.camera.lookAt(this.cameraTarget);
        this.renderer.clear();
        this.renderer.render(this.scene, this.camera);
    };
    Stage.prototype.onResize = function () {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        var vFOV = this.camera.fov * Math.PI / 180; // convert vertical fov to radians
        var height = 2 * Math.tan(vFOV / 2) * this.camera.position.z; // visible height
        var aspect = window.innerWidth / window.innerHeight;
        this.width = height * aspect;
        //console.log(vFOV, height, aspect, this.width)
    };
    Stage.prototype.createPresent = function (sizeX, sizeY, sizeZ) {
        var geometry = new THREE.BoxGeometry(sizeX * this.scale, sizeY * this.scale, sizeZ * this.scale);
        var texture = this.presentTextures[Math.floor(Math.random() * this.presentTextures.length)];
        var material = new THREE.MeshPhongMaterial({ color: 0xffffff, wireframe: false, map: texture, shininess: 0 });
        var mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        this.scene.add(mesh);
        return mesh;
    };
    Stage.prototype.createLetter = function (letter) {
        //console.log(letter)
        // 		return mesh;
        var texture = this.letterTextures[Math.floor(Math.random() * this.letterTextures.length)];
        var material = new THREE.MeshPhongMaterial({ color: 0xffffff, wireframe: false, map: texture, shininess: 0 });
        var textGeo = new THREE.TextGeometry(letter, {
            font: this.font,
            size: 6 * this.scale,
            height: 1.5 * this.scale,
            curveSegments: 2,
            bevelThickness: 0,
            bevelSize: 0.1,
            bevelEnabled: true,
            material: 0,
            extrudeMaterial: 1
        });
        textGeo.computeBoundingBox();
        textGeo.computeVertexNormals();
        var centerOffsetX = -0.5 * (textGeo.boundingBox.max.x - textGeo.boundingBox.min.x);
        var centerOffsetZ = 0.5 * (textGeo.boundingBox.max.y - textGeo.boundingBox.min.y);
        var textMesh = new THREE.Mesh(textGeo, material);
        textMesh.position.x = centerOffsetX;
        textMesh.position.y = -1 * this.scale;
        textMesh.position.z = centerOffsetZ;
        textMesh.rotation.x = -Math.PI / 2;
        //textMesh.rotation.y = 
        textMesh.castShadow = true;
        var letterContainer = new THREE.Group();
        letterContainer.add(textMesh);
        //letterContainer.add( mesh );
        this.scene.add(letterContainer);
        return letterContainer;
    };
    return Stage;
}());
var Physics = /** @class */ (function () {
    function Physics(scale) {
        if (scale === void 0) {
            scale = 1;
        }
        this.scale = 1;
        this.scale = scale;
        this.world = new CANNON.World();
        this.world.gravity.set(0, -40 * this.scale, 0);
        this.world.broadphase = new CANNON.NaiveBroadphase();
        this.world.solver.iterations = 10;
        this.groundBody = new CANNON.Body({
            mass: 0 // mass == 0 makes the body static
        });
        var groundShape = new CANNON.Plane();
        this.groundBody.addShape(groundShape);
        var rot = new CANNON.Vec3(1, 0, 0);
        this.groundBody.quaternion.setFromAxisAngle(rot, -(Math.PI / 2));
        this.world.addBody(this.groundBody);
        var groundMaterial = new CANNON.Material("groundMaterial");
        var ground_ground_cm = new CANNON.ContactMaterial(groundMaterial, groundMaterial, {
            friction: 1,
            restitution: 0.3,
            contactEquationStiffness: 1e8,
            contactEquationRelaxation: 3,
            frictionEquationStiffness: 1e8,
            frictionEquationRegularizationTime: 3
        });
        // Add contact material to the world
        this.world.addContactMaterial(ground_ground_cm);
        this.world.defaultContactMaterial.contactEquationStiffness = 1e8;
        this.world.defaultContactMaterial.contactEquationRelaxation = 10;
    }
    Physics.prototype.createPhysics = function (xPos, yPos, zPos, x, y, z, angularRandomness) {
        if (x === void 0) {
            x = 2;
        }
        if (y === void 0) {
            y = 2;
        }
        if (z === void 0) {
            z = 2;
        }
        if (angularRandomness === void 0) {
            angularRandomness = 1;
        }
        var shape = new CANNON.Box(new CANNON.Vec3(x * this.scale, y * this.scale, z * this.scale));
        var body = new CANNON.Body({
            mass: 1 * this.scale,
            position: new CANNON.Vec3(xPos * this.scale, yPos * this.scale, zPos * this.scale)
        });
        body.addShape(shape);
        body.velocity.set(0, -80 * this.scale, 0);
        body.angularVelocity.set(((Math.random() * angularRandomness) - (angularRandomness / 2)) * this.scale, ((Math.random() * angularRandomness) - (angularRandomness / 2)) * this.scale, ((Math.random() * angularRandomness) - (angularRandomness / 2))) * this.scale;
        body.angularDamping = 0.8;
        this.world.addBody(body);
        return body;
    };
    Physics.prototype.jump = function (body, amount) {
        body.angularVelocity.set(((Math.random() * 3) - 1.5) * this.scale, ((Math.random() * 3) - 1.5) * this.scale, ((Math.random() * 3) - 1.5) * this.scale);
        body.velocity.set(0, amount * this.scale, 0);
    };
    Physics.prototype.remove = function (body) {
        this.world.remove(body);
    };
    Physics.prototype.tick = function () {
        this.world.step(1 / 60);
    };
    return Physics;
}());
function init(font) {
    console.log('init()');
    var worldScale = 2;
    var stage = new Stage(worldScale, font);
    var physics = new Physics(worldScale);
    stage.setPlane(physics.groundBody);
    window.addEventListener('resize', function () { stage.onResize(); }, false);
    document.addEventListener('keypress', onDocumentKeyPress, false);
    var letters = [];
    var count = 0;
    var presents = [];
    var font = font;
    var jumpDelay = null;
    var pauseTimer = null;
    var doPhysics = false;
    function onInput(newLetter) {
        count++;
        var x = count * 4;
        stage.moveCamera(x);
        if (newLetter == ' ')
            return;
        doPhysics = true;
        var letter = {
            letter: stage.createLetter(newLetter),
            physics: physics.createPhysics(x, 50, 0, 2, 1, 2, 1)
        };
        for (var i = 0; i < Math.ceil(Math.random() * 3); i++) {
            var sizeX = 1 + Math.ceil(Math.random() * 3);
            var sizeY = 1 + Math.ceil(Math.random() * 3);
            var sizeZ = 1 + Math.ceil(Math.random() * 3);
            var present = {
                present: stage.createPresent(sizeX, sizeY, sizeZ),
                physics: physics.createPhysics(x, 30 + (i * 5), (Math.random() * 20) - 10, sizeX / 2, sizeY / 2, sizeZ / 2, 6)
            };
            presents.push(present);
        }
        letters.push(letter);
        var lettersToTrack = 15;
        //console.log(letters.length)
        while (letters.length > lettersToTrack) {
            var l = letters.shift();
            physics.remove(l.physics);
        }
        while (presents.length > (lettersToTrack * 3)) {
            var p = presents.shift();
            physics.remove(p.physics);
        }
        // if(jumpDelay) clearTimeout(jumpDelay);
        // jumpDelay = setTimeout(()=>{
        // 	if(letters.length - 2 >= 0) physics.jump(letters[letters.length - 2].physics, 10);
        // 	if(letters.length - 3 >= 0) physics.jump(letters[letters.length - 3].physics, 5);
        // }, 520)
        if (pauseTimer)
            clearTimeout(pauseTimer);
        pauseTimer = setTimeout(function () {
            doPhysics = false;
        }, 5000);
    }
    function onDocumentKeyPress(event) {
        event.preventDefault();
        if (stage) {
            //console.log(event.which)
            onInput(String.fromCharCode(event.which));
        }
    }
    animate();
    function animate() {
        requestAnimationFrame(animate);
        if (doPhysics)
            physics.tick();
        for (var i in letters) {
            letters[i].letter.position.copy(letters[i].physics.position);
            letters[i].letter.quaternion.copy(letters[i].physics.quaternion);
            //letters[i].letter.rotation.x -= Math.PI/2
        }
        for (var i in presents) {
            presents[i].present.position.copy(presents[i].physics.position);
            presents[i].present.quaternion.copy(presents[i].physics.quaternion);
            //letters[i].letter.rotation.x -= Math.PI/2
        }
        stage.render();
    }
    var welcomeMessage = location.pathname.match(/fullcpgrid/i) ? 'hello' : '';
    var autoTypeSpeed = 200;
    setTimeout(addWelcomeLetter, autoTypeSpeed);
    function addWelcomeLetter() {
        if (welcomeMessage.length > 0) {
            onInput(welcomeMessage.substring(0, 1));
            welcomeMessage = welcomeMessage.substring(1);
            setTimeout(addWelcomeLetter, autoTypeSpeed);
        }
        else {
            window.focus();
        }
    }
}
function loadFont() {
    var loader = new THREE.FontLoader();
    loader.load('https://threejs.org/examples/fonts/helvetiker_bold.typeface.json', function (response) {
        //font = response;
        init(response);
    });
}
loadFont();
