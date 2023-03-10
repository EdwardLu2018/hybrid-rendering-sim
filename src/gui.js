import { GUI } from 'dat.gui'

AFRAME.registerSystem('gui', {
    init: function () {
        const el = this.el;

        const sceneEl = this.sceneEl;
        if (!sceneEl.hasLoaded) {
            sceneEl.addEventListener('renderstart', this.init.bind(this));
            return;
        }

        this.remoteLocal = sceneEl.systems['remote-local'];
        this.compositor = sceneEl.systems['compositor'];

        const options = {
            timeWarp: true,
            stretchBorders: true,
            fps: 60,
            latency: 150,
            decreaseResolution: 1.
        };

        const _this = this;
        const gui = new GUI()
        gui.add(options, 'fps', 1, 90).onChange(
            function() {
                sceneEl.setAttribute('remote-scene', 'fps', this.getValue());
            }
        )
        gui.add(options, 'latency', -1, 1000).onChange(
            function() {
                sceneEl.setAttribute('remote-scene', 'latency', this.getValue());
            }
        )
        gui.add(options, 'decreaseResolution', 1, 16).onChange(
            function() {
                _this.compositor.decreaseResolution(this.getValue());
            }
        )
        gui.add(options, 'timeWarp').onChange(
            function() {
                _this.compositor.data.doAsyncTimeWarp = this.getValue();
            }
        )
        gui.add(options, 'stretchBorders').onChange(
            function() {
                _this.compositor.data.stretchBorders = this.getValue();
            }
        )
        gui.open()
    }
});
