var scene, camera, renderer;
var material;
var player, knife, ground, mesh1, mesh2;
var fog;
var ambientLight, hemisphereLight, directionalLight, spotLight;

init();
animate();

function init() {

    renderer = new THREE.WebGLRenderer({ antialiasing: true });
    renderer.shadowMapEnabled = true;
    renderer.shadowMapCullFrontFaces = true;
    renderer.shadowMapSoft = true;
    //renderer.gammaInput = true;
    //renderer.gammaOutput = true;
    renderer.physicallyBasedShading = true;
    renderer.setSize( window.innerWidth, window.innerHeight );

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.x = 0;
    camera.position.y = 450;
    camera.position.z = 750;
    camera.lookAt( new THREE.Vector3( 0, 150, 0 ) );

    material = new THREE.MeshLambertMaterial( { color: 0xffffff, ambient: 0xffffff, overdraw: true } );

    // Meshes

    player = new THREE.Mesh( new THREE.BoxGeometry( 70, 160, 70 ), material );
    player.position.y = 80;
    player.castShadow = true;
    player.receiveShadow = true;

    knife = new THREE.Mesh( new THREE.BoxGeometry( 20, 20, 80 ), material );
    knife.position.z = 35;
    knife.position.y = 0;
    knife.visible = false;
    player.add( knife );

    scene.add( player );

    ground = new THREE.Mesh( new THREE.PlaneGeometry( 1000, 600 ), material );
    ground.rotation.x = -Math.PI/2;
    ground.receiveShadow = true;
    scene.add( ground );

    mesh1 = new THREE.Mesh( new THREE.BoxGeometry( 100, 40, 100 ), material );
    mesh1.position.x = -150;
    mesh1.position.y = 20;
    mesh1.position.z = 100;
    mesh1.castShadow = true;
    mesh1.receiveShadow = true;
    scene.add( mesh1 );

    mesh2 = new THREE.Mesh( new THREE.BoxGeometry( 100, 200, 100 ), material );
    mesh2.position.x = 150;
    mesh2.position.y = 100;
    mesh2.position.z = -100;
    mesh2.castShadow = true;
    mesh2.receiveShadow = true;
    scene.add( mesh2 );

    // Fog

    fog = new THREE.Fog( 0x020B1f, 1, 3000 );
    //scene.add( fog );

    // Light

    //hemisphereLight = new THREE.HemisphereLight( 0x295485, 0x162536, 0.2 );
    //scene.add( hemisphereLight );

    ambientLight = new THREE.AmbientLight( 0x010612 );
    scene.add( ambientLight );

    directionalLight = new THREE.DirectionalLight( 0x4779B3, 0.05 );
    directionalLight.position.set( -1.5, 1, -1.25 );
    directionalLight.position.multiplyScalar( 500 );

    directionalLight.castShadow = true;
    directionalLight.shadowMapWidth = 2048;
    directionalLight.shadowMapHeight = 2048;
    var d = 500;
    directionalLight.shadowCameraLeft = -d;
    directionalLight.shadowCameraRight = d;
    directionalLight.shadowCameraTop = d;
    directionalLight.shadowCameraBottom = -d;
    directionalLight.shadowCameraFar = 3500;
    directionalLight.shadowBias = -0.0001;
    directionalLight.shadowDarkness = 0.35;
    //directionalLight.shadowCameraVisible = true;
    scene.add( directionalLight );

    spotLight = new THREE.SpotLight( 0xffffff, 1.0, 0.0, Math.PI/3 );
    spotLight.position.x = -200;
    spotLight.position.y = 350;
    spotLight.position.z = -800;
    spotLight.target.position.x = 400;
    spotLight.target.position.y = -400;
    spotLight.target.position.z = 400;
    spotLight.castShadow = true;
    spotLight.shadowDarkness = 0.7;
    spotLight.shadowCameraVisible = true;
    //scene.add( spotLight );

    document.body.appendChild( renderer.domElement );

}
var knifeTimer = -1;
function animate() {

    var now = Date.now();
    
    requestAnimationFrame( animate );
    
    // Key input

    Input.Key.update();

    if( Input.Key.isPressed('left arrow') || Input.Key.isPressed('a') ) {
        player.position.x -= 3.0;
        player.rotation.y = -Math.PI/2;
    }
    if( Input.Key.isPressed('right arrow') || Input.Key.isPressed('d') ) {
        player.position.x += 3.0;
        player.rotation.y = Math.PI/2;
    }
    if( Input.Key.isPressed('up arrow') || Input.Key.isPressed('w') ) {
        player.position.z -= 3.0;
        player.rotation.y = Math.PI;
    }
    if( Input.Key.isPressed('down arrow') || Input.Key.isPressed('s') ) {
        player.position.z += 3.0;
        player.rotation.y = 0;
    }

    if( Input.Key.justPressed('space') && knifeTimer < 0 ) {
        knife.visible = true;
        knifeTimer = 1000;
    } else if( knifeTimer > -1 ) {
        knifeTimer -= ( now - ( lastUpdate || now ) );
    } else {
        knife.visible = false;
    }

    // Light pulse

    /*if( lightIncreasing ) {
        light.intensity += 0.01;
        if( light.intensity >= 1.0 ) {
            lightIncreasing = false;
        }
    } else {
        light.intensity -= 0.01;
        if( light.intensity <= 0.0 ) {
            lightIncreasing = true;
        }
    }*/

    // Collisions (bounding area)

    if( player.position.x < -465 ) { player.position.x = -465; }
    if( player.position.x > 465 ) { player.position.x = 465; }
    if( player.position.z < -265 ) { player.position.z = -265; }
    if( player.position.z > 265 ) { player.position.z = 265; }

    renderer.render( scene, camera );

    lastUpdate = now;
}