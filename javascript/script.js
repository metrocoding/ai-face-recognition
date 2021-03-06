const video = document.getElementById("video");

Promise.all([
  // faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
  // faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
  // faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
  // faceapi.nets.faceExpressionNet.loadFromUri("/models"),
  faceapi.nets.tinyFaceDetector.loadFromUri("/ai-face-recognition/models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("/ai-face-recognition/models"),
  faceapi.nets.faceRecognitionNet.loadFromUri("/ai-face-recognition/models"),
  faceapi.nets.faceExpressionNet.loadFromUri("/ai-face-recognition/models"),
]).then(startVideo);

function startVideo() {
  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then(function (stream) {
      video.srcObject = stream;
    })
    .catch(function (err) {
      console.log(err);
    });
}

video.addEventListener("play", () => {
  const canvas = faceapi.createCanvasFromMedia(video);

  document.body.append(canvas);
  const displaySize = { width: video.width, height: video.height };
  faceapi.matchDimensions(canvas, displaySize);

  setInterval(async () => {
    const detections = await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions();

    const resizedDetection = faceapi.resizeResults(detections, displaySize);
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    faceapi.draw.drawDetections(canvas, resizedDetection);
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetection);
    faceapi.draw.drawFaceExpressions(canvas, resizedDetection);
  }, 100);
});
