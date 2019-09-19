const video = document.getElementById('video')

const constraints = {
  video: true
};

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('../facedetect/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('../facedetect/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('../facedetect/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('../facedetect/models'),
  faceapi.nets.ssdMobilenetv1.loadFromUri('../facedetect/models')
]).then(startVideo)

function startVideo() {
  // navigator.getUserMedia(
  //   { video: true },
  //   stream => video.srcObject = stream,
  //   err => console.error(err)
  // )

  navigator.mediaDevices.getUserMedia(constraints).
  then((stream) => {video.srcObject = stream});

}

function loadLabeledImages() {
  // const labels = ['Black Widow', 'Captain America', 'Captain Marvel', 'Hawkeye', 'Jim Rhodes', 'Thor', 'Tony Stark','Mr Bean', 'Ariff', 'kamal', 'afik']
  const labels = ['Ariff', 'kamal', 'afik','athirah','lina','amira','khairiyah','ikwan','afik-sado','farhan','capam','sharina','khalimah','elisuarni']
  return Promise.all(
    labels.map(async label => {
      const descriptions = []
      for (let i = 1; i <= 1; i++) {
        // const img = await faceapi.fetchImage(`https://raw.githubusercontent.com/WebDevSimplified/Face-Recognition-JavaScript/master/labeled_images/${label}/${i}.jpg`)
        const img = await faceapi.fetchImage(`http://172.16.0.76/vt_todak/facedetect/labeled_images/${label}/${i}.jpg`)
        // const img = await faceapi.fetchImage(`http://localhost/vt_todak/facedetect/labeled_images/${label}/${i}.jpg`)
        const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
        descriptions.push(detections.descriptor)
      }

      return new faceapi.LabeledFaceDescriptors(label, descriptions)
    })
  )
}

video.addEventListener('play', async () => {

  const labeledFaceDescriptors = await loadLabeledImages()
  const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6)

  const canvas = faceapi.createCanvasFromMedia(video)

  document.body.append(canvas)

  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)
  setInterval(async () => {
    // const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptors().withFaceExpressions()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    // canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    // faceapi.draw.drawDetections(canvas, resizedDetections)
    // faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
    // faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
    
    const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor))
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    results.forEach((result, i) => {
      faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
      const box = resizedDetections[i].detection.box
      const drawBox = new faceapi.draw.DrawBox(box, { label: result.toString() })
      drawBox.draw(canvas)
    })
  }, 100)
})

////////////////////////////////////////////////////////////////////////////////////////////////////
