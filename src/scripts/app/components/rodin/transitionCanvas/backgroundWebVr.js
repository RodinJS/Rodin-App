/**
 * Created by serge on 12/7/2016.
 */
let vrDisplay = null;
let frameData = null;
let queue = [];

let isStopped = false;
let isInited = false;

let webglCanvas;
let gl = null;


function initWebGL(preserveDrawingBuffer) {
	let glAttribs = {
		alpha: false,
		preserveDrawingBuffer: preserveDrawingBuffer
	};
	gl = webglCanvas.getContext("webgl", glAttribs);
	if (!gl) {
		gl = webglCanvas.getContext("experimental-webgl", glAttribs);
	}
	gl.clearColor(0, 0, 0, 1.0);
	gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.CULL_FACE);
}

function onVRRequestPresent() {
	return vrDisplay.requestPresent([{source: webglCanvas}]);
}

function onVRExitPresent() {
	if (!vrDisplay.isPresenting)
		return;

	return vrDisplay.exitPresent();
}


function onAnimationFrame(t) {
	if (isStopped)
		return;
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	if (vrDisplay) {
		vrDisplay.getFrameData(frameData);

		if (vrDisplay.isPresenting) {
			// gl.viewport(0, 0, webglCanvas.width * 0.5, webglCanvas.height);
			// gl.viewport(webglCanvas.width * 0.5, 0, webglCanvas.width * 0.5, webglCanvas.height);
			vrDisplay.submitFrame();
		}

		vrDisplay.requestAnimationFrame(onAnimationFrame);

	}
}

function init(element) {
	if (isInited) {
		return false;
	}
	isInited = true;

	if (navigator.getVRDisplays) {
		frameData = new VRFrameData();
		navigator.getVRDisplays().then(function (displays) {
			if (displays.length > 0) {

				vrDisplay = displays[0];
				vrDisplay.depthNear = 0.1;
				vrDisplay.depthFar = 1024.0;

				for (let i=0;i<queue.length;i++)
                {
                    if (queue[i].fn)
                    {
                        let tmp = queue[i].fn();
                        if (queue[i].cb)
                            queue[i].cb(tmp);
                    }
                    else
                        queue[i]();
                }

				queue=[];
			}
		});
	}

	webglCanvas = document.createElement("canvas");
	webglCanvas.width = window.innerWidth;
	webglCanvas.height = window.innerHeight;
	element.appendChild(webglCanvas);
	isStopped = true;
	initWebGL(true);
}

function start() {
	if (!vrDisplay)
	{
		queue.push({
			fn: start
		});
		return;
	}

	if (!isStopped) {
		return false;
	}
	isStopped = false;
	window.requestAnimationFrame(onAnimationFrame);
	return onVRRequestPresent();
}

function stop(cb) {
	if (!vrDisplay)
	{
		queue.push({
		    fn: stop,
            cb: cb
        });
	}

	if (isStopped) {
		return false;
	}
	isStopped = true;
	let tmp = onVRExitPresent();
	if (cb)
	    cb(tmp)
	return tmp;
}

export {init, start, stop};