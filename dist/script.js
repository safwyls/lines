var menuBtn = document.getElementById("menu-btn");
var drawBtn = document.getElementById("draw-btn")
var toggles = document.getElementById("toggles");
var segmentsSlider = document.getElementById("segments-slider");
var linesSlider = document.getElementById("lines-slider");
var segmentsDisplay = document.getElementById("segments-display");
var linesDisplay = document.getElementById("lines-display");
var widthSlider = document.getElementById("width-slider");
var widthDisplay = document.getElementById("width-display");
var sidebarVis = false;
var numSegments = 7;
var numLines = 3;
var width = 3;
menuBtn.onclick = toggleSidebar;
drawBtn.onclick = draw;
segmentsSlider.onchange = segmentsChange;
linesSlider.onchange = linesChange;
widthSlider.onchange = widthChange;

function segmentsChange() {
  numSegments = segmentsSlider.value;
  segmentsDisplay.innerText = `Segments: ${numSegments}`;
  draw();
}

function linesChange() {  
  numLines = linesSlider.value;
  linesDisplay.innerText = `Lines: ${numLines}`;
  draw();
}

function widthChange() {
  width = widthSlider.value;
  widthDisplay.innerText = `Width: ${width}px`;
  draw();
}

function toggleSidebar() {
  sidebarVis = !sidebarVis;
  if (sidebarVis) {
    toggles.style.left = '0';
    menuBtn.innerHTML = '<i class="fas fa-times"></i>';
  } else {
    toggles.style.left = '-21em';
    menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
  }
}

function generatePoints(numSegments) {

  let maxHeight = window.innerHeight - 100;  
  let points = [];

  for (let i = 1; i < numSegments; i++) {
    let x = (window.innerWidth / numSegments) * i;      
    let y = Math.floor(Math.random() * maxHeight) + 100;
    points.push([x,y]);
  }

  return points;
}

function draw() {  
  let c = init("canvas").c,
      canvas = init("canvas").canvas,
      w = (canvas.width = window.innerWidth),
      h = (canvas.height = window.innerHeight),
      ropes = [];
  let ctx = canvas.getContext('2d');

  let halfWidth = Math.floor(width / 2);
  // Fill background
  ctx.fillStyle = "#333";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  let midLeft = [0 - halfWidth, window.innerHeight / 2];  
  let midRight = [window.innerWidth + halfWidth, window.innerHeight / 2];
  
  // For each line generate random data and draw
  for (let l = 0; l < numLines; l++) {
    let points = generatePoints(numSegments);

    ctx.beginPath();
    ctx.moveTo(midLeft[0], midLeft[1]);
    for (let i = 0; i < points.length; i++) {
      console.log(points[i]);
      ctx.lineTo(points[i][0], points[i][1]);
    }
    ctx.lineTo(midRight[0], midRight[1]);
    var randomColor = Math.floor(Math.random()*16777215).toString(16);
    ctx.strokeStyle = '#' + randomColor;
    ctx.lineWidth = width;
    ctx.stroke(); 
    // save canvas image as data url (png format by default)
    var dataURL = canvas.toDataURL();

    // set canvasImg image src to dataURL
    // so it can be saved as an image
    document.getElementById('canvasImg').src = dataURL;
  }
}
  
  draw();