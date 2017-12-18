"use strict";
var mouseDown = false;
var mouseX, mouseY, multiInit,zoomValue=0;
var file = './collada/getriebe.dae'; //
var tilted = true; // 
var modelScale = 1; // 缩放，取决于模型的大小
var cameraPositionZ = 8500; // 相机的距离
var cameraInitialVector = 50; //矢量越小，模型越大
var colorLight = [0xdddddd, 0xdddddd]; // 
var colorBackground = 0x666666; //
var dimensions = [window.innerWidth, window.innerHeight - 5]; // 大小
var canvasid = '3dmodell'; // Name des Canvas-Containers
var rotate = [0.0005, 0.01, 0.0005]; //动画速度 (X-, Y-, Z-Achse)
var rotateManual = 0.1; // 手动旋转
var cameraZoom = 1000; // 缩放级别
var play = false; // 自动播放
// ab hier nichts ändern

var camera, scene, renderer, dae, skin, lastFrame;
var index = 0;
window.addEventListener('load', function () {
    if (!Detector.webgl) Detector.addGetWebGLMessage(); // Browser kann kein WebGL
    // Collada-Modell
    var loader = new THREE.ColladaLoader();
    //if (tilted) loader.options.upAxis = 'X'; // 初始方向x-90度
    loader.options.convertUpAxis = true; // an der Y-Achse ausrichten
    loader.load(file, function (collada) {
        console.log(collada)
        dae = collada.scene;
        dae.scale.x = dae.scale.y = dae.scale.z = modelScale;//长宽高
        console.log(dae);
        // dae.rotation.set(0,-Math.PI/2,0);//244
        //dae.position.x=-1000
        //  dae.scale.set(1, 1, 1);
        //  dae.matrix.setRotationFromEuler(dae.rotation);

        // var box = new THREE.Box3();
        // box.setFromObject(dae);
        // box.center(dae.position); // this re-sets the mesh position
        // dae.position.multiplyScalar(-1);
        //  var obj = new THREE.Object3D();
        //  var parent = new THREE.Object3D();
        scene = new THREE.Scene();
        var axes = new THREE.AxisHelper(1000000);
        // scene.add(axes);
        //  scene.add(parent);

        //   parent.position.x = -39000000000;
        // obj.add(parent);

        dae.applyMatrix(new THREE.Matrix4().makeTranslation(-1000, 0, 0));

        scene.add(dae);

        camera = new THREE.PerspectiveCamera(cameraInitialVector, dimensions[0] / dimensions[1], 1, 10000);
        camera.position.z = cameraPositionZ;// 相机的距离
        scene.add(camera);

        // 灯光
        var directionalLight1 = new THREE.DirectionalLight(colorLight[0], 1.0);
        directionalLight1.position.set(1, 0, 0);
        var directionalLight2 = new THREE.DirectionalLight(colorLight[1], 2.0);
        directionalLight2.position.set(-1, 1, 1);
        scene.add(directionalLight1);
        scene.add(directionalLight2);
        // Renderer
        renderer = new THREE.WebGLRenderer({ antialias: false });//抗锯齿
        renderer.setClearColor("#000");
        renderer.setSize(dimensions[0], dimensions[1]);
        // verankere Darstellung im HTML
        document.getElementById(canvasid).appendChild(renderer.domElement);
        
        animate();
    });

    var animate = function () {
        requestAnimationFrame(animate); // Animationsschleife
        if (play) { // Drehen, wenn Play-Status == true
            //dae.rotation.x += rotate[0];
            dae.rotation.y += rotate[1];
            //    dae.rotation.y = Math.PI/4+rotate[1];
            //  dae.rotation.z += rotate[2];
        }
   //  dae.position.x =100 * 10;
   //  dae.position.y = Math.sin( -100 ) * 10;
        renderer.render(scene, camera);
    };

    var count = function (array) {
        array.map(function (data, index) {
            console.log(data)
            //  data.position.x=+10
            //  data.position.y=+10
            if (data.material)
                data.material.color = new THREE.Color(0xE91E63);
            if (data.children)
                count(data.children)

        })
    }

    window.addEventListener('keydown', function (e) {
        var key = e.keyCode;
        console.log("Key " + key);
        switch (key) {
            case 37: // left
                dae.position.y -= rotateManual*1000;
                e.preventDefault();
                break;
            case 39: // right
                dae.position.y += rotateManual*1000;
                e.preventDefault();
                break;
            case 38: // up
                dae.rotation.x -= rotateManual;
                e.preventDefault();
                break;
            case 40: // down
                dae.rotation.x += rotateManual;
                e.preventDefault();
                break;
            case 33: // pageup
                dae.rotation.z += rotateManual;
                e.preventDefault();
                break;
            case 34: // pagedown
                dae.rotation.z -= rotateManual;
                e.preventDefault();
                break;
            case 32: // space
                //   play = play? false : true;
                // e.preventDefault();
                // scene
                //  console.log(scene.children[0].children[15].material.color)
                //if(index===8||index===32)
                //scene.children[0].children[0].children[index].visible = true;
                count(scene.children);
                //    camera.position.z -= 5000;
                //if(scene.children[0].children[0].children[index].material)
                //  scene.children[0].children[0].children[index].material.color =  new THREE.Color( 0xE91E63 );
                // index++;
                // console.log(scene.children[0].children[15].material.color)


                renderer.render(scene, camera);

                break;
            case 187: // plus
                camera.position.z -= cameraZoom;
                e.preventDefault();
                break;
            case 189: // minus
                camera.position.z += cameraZoom;
                e.preventDefault();
                break;
        }
        renderer.render(scene, camera);
    }, false);

    window.addEventListener('touchstart', onMouseDown, false);
    window.addEventListener('touchend', onMouseup, false);
    var rotateStart;

    rotateStart = new THREE.Vector2();
    function onMouseDown(event) {
        console.log(event.touches)
        //  event.preventDefault();
        mouseDown = true;

        mouseX = event.touches[0].clientX;//出发事件时的鼠标指针的水平坐标
        mouseY = event.touches[0].clientY;//出发事件时的鼠标指针的水平坐标
        if (event.touches.length === 1) {
            rotateStart.set(event.touches[0].clientX, event.touches[0].clientY);
        } else {
            multiInit = Math.sqrt(mouseX * event.touches[1].clientX + mouseY * event.touches[1].clientY)

            //console.log("multiInit:"+multiInit)
        }
        window.addEventListener('touchmove', onMouseMove2, false);
    }

    function onMouseup(event) {
        //       console.log("onMouseup")

        mouseDown = false;
        window.removeEventListener("touchmove", onMouseMove2);
    }

    function onMouseMove2(event) {
        // console.log(event)
        if (!mouseDown) {
            return;
        }

        if (event.touches.length === 1) {
            var deltaX = event.touches[0].clientX - mouseX;
            mouseX = event.touches[0].clientX;
            var deltaY = event.touches[0].clientY - mouseY;
            mouseY = event.touches[0].clientY;
            rotateScene(deltaX, deltaY);
        } else {
            //((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2))开平方 
            var deltaX1 = event.touches[0].clientX - event.touches[1].clientX;
            var deltaY1 = event.touches[0].clientY - event.touches[1].clientY;
            var deltaNow = Math.sqrt(deltaX1 * deltaX1 + deltaY1 * deltaY1);            
            var zoom =  deltaNow / multiInit;//now
         //   console.log("multiInit---:" + multiInit)
          //  console.log("deltaNow***:" + deltaNow)
            console.log("zoom:"+zoom)
            zoomScene(zoom)
        }
    }

    function rotateScene(deltaX, deltaY) {
        //console.log("rotateScene")
        //   console.log(deltaX + "111")
        var degx = -deltaX / 279;
        var degy = -deltaY / 279;
        dae.rotation.y -= degx;
        dae.rotation.x -= degy;

        renderer.render(scene, camera);
    }
    function zoomScene(zoomNow) {
        if (zoomValue > zoomNow) {
            camera.position.z += zoomNow * 200;
        } else
            camera.position.z -= zoomNow * 200;
        renderer.render(scene, camera);
zoomValue = zoomNow;
    }
}, false);
