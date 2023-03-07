// get video from device 

const video = document.getElementById('video')

// add promise to 'utils'
Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/Video-Face-Recogniser/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/Video-Face-Recogniser/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/Video-Face-Recogniser/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('/Video-Face-Recogniser/models')
]).then(startVideo)


//Hook camera to browser
function startVideo() {
    navigator.getUserMedia( 
        {video:{}},
        stream => video.srcObject = stream,
        err => console.error(err)
    )
}


video.addEventListener('play',() => {

    // create  a base canvas 
    const canvas = faceapi.createCanvasFromMedia(video)
    // add to body
    document.body.append(canvas)
    
    const displaySize = {width : video.width , height : video.height}
    
    // set faceapi dimension to the video
    faceapi.matchDimensions(canvas, displaySize)

    setInterval(async () => {
        
        // create OBJ from video Face
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()     

        console.log(detections)

        // resize to the face 
        const resizedDetections = faceapi.resizeResults(detections, displaySize)
        
        // clear previous detection image
        canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height)
        
        // draw magic
        faceapi.draw.drawDetections(canvas, resizedDetections)
        faceapi.draw.drawDetections(canvas, resizedDetections)
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections)

    }, 100)})
    