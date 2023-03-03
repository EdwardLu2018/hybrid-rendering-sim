import { GUI } from 'dat.gui';

const FPS_PERIOD_60Hz = (1 / 60 * 1000);

AFRAME.registerSystem('remote-scene', {
    schema: {
        fps: {type: 'number', default: 60},
        latency: {type: 'number', default: 150}, // ms
    },

    init: function () {
        const el = this.el;
        const data = this.data;

        const sceneEl = this.sceneEl;
        if (!sceneEl.hasLoaded) {
            sceneEl.addEventListener('renderstart', this.init.bind(this));
            return;
        }

        const renderer = sceneEl.renderer;

        const scene = sceneEl.object3D;
        const camera = sceneEl.camera;

        // This is the remote scene init //

        this.remoteScene = new THREE.Scene();
        this.remoteCamera = camera.clone();

        this.cameraRig = new THREE.Group();
        this.cameraSpinner = new THREE.Group();
        this.remoteScene.add(this.cameraRig);
        this.cameraRig.add(this.cameraSpinner);
        this.cameraSpinner.add(this.remoteCamera);

        this.remoteScene.background = new THREE.Color(0xF06565);

        const boxMaterial = new THREE.MeshBasicMaterial({color: 0x7074FF});
        const boxGeometry = new THREE.BoxGeometry(5, 5, 5);
        const box1 = new THREE.Mesh(boxGeometry, boxMaterial);
        const box2 = new THREE.Mesh(boxGeometry, boxMaterial);
        box1.position.x = 10; box2.position.x = -10;
        box1.position.y = box2.position.y = 1.6;
        box1.position.z = box2.position.z = -10;
        this.remoteScene.add(box1); // add to remote scene
        this.remoteScene.add(box2);
        this.box1 = box1;

        const texture = new THREE.TextureLoader().load('./color.png');
        const geometry = new THREE.PlaneGeometry(1920, 1080, 1, 1);
        const material = new THREE.MeshBasicMaterial( { map: texture } );
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = -6;
        mesh.position.y = 1.6;
        mesh.position.z = -50;
        // mesh.rotation.x = -Math.PI / 8;
        // mesh.rotation.z = -Math.PI / 8;
        this.remoteScene.add(mesh);

        // End of remote scene init //

        this.poses = [];

        this.onResize();
        window.addEventListener('resize', this.onResize.bind(this));
    },

    onResize() {
        const el = this.el;
        const data = this.data;

        const sceneEl = this.sceneEl;
        const renderer = sceneEl.renderer;

        const camera = sceneEl.camera;

        this.remoteCamera.copy(camera);
    },

    updateFPS() {
        const data = this.data;

        this.tick = AFRAME.utils.throttleTick(this.tick, 1 / data.fps * 1000, this);
    },

    tick: function () {
        const el = this.el;
        const data = this.data;

        const sceneEl = this.sceneEl;
        const renderer = sceneEl.renderer;

        const scene = sceneEl.object3D;
        const camera = sceneEl.camera;

        var camPose = new THREE.Matrix4();
        camPose.copy(camera.matrixWorld);
        this.poses.push(camPose);

        if (this.poses.length > data.latency / FPS_PERIOD_60Hz) {
            const pose = this.poses.shift();
            // update remote camera
            // this.cameraRig.position.setFromMatrixPosition(pose);
            // this.cameraSpinner.quaternion.setFromRotationMatrix(pose);
            // pose.decompose( this.cameraRig.position, this.cameraSpinner.quaternion, this.remoteCamera.scale );

            // var vectorTopLeft = new THREE.Vector3( -1, 1, 1 ).unproject( this.remoteCamera );
            // var vectorTopRight = new THREE.Vector3( 1, 1, 1 ).unproject( this.remoteCamera );
            // var vectorBotLeft = new THREE.Vector3( -1, -1, 1 ).unproject( this.remoteCamera );
            // var vectorBotRight = new THREE.Vector3( 1, -1, 1 ).unproject( this.remoteCamera );

            // var material = new THREE.LineBasicMaterial({ color: 0xAAFFAA });
            // var points = [];
            // points.push(vectorTopLeft);
            // points.push(vectorTopRight);
            // points.push(vectorBotRight);
            // points.push(vectorBotLeft);
            // points.push(vectorTopLeft);
            // var geometry = new THREE.BufferGeometry().setFromPoints( points );
            // var line = new THREE.Line( geometry, material );
            // this.remoteScene.add( line );

            // this.box1.rotation.x += 0.01;
            // this.box1.rotation.y += 0.01;
            // this.box1.rotation.z += 0.01;
        }
    }
});
