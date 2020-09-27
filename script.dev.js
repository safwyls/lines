"use strict";

var menuBtn = document.getElementById("menu-btn");
var fullBtn = document.getElementById("full-btn");
var drawBtn = document.getElementById("draw-btn");
var clearBtn = document.getElementById("clear-btn");
var toggles = document.getElementById("toggles");
var segmentsSlider = document.getElementById("segments-slider");
var linesSlider = document.getElementById("lines-slider");
var segmentsDisplay = document.getElementById("segments-display");
var linesDisplay = document.getElementById("lines-display");
var widthSlider = document.getElementById("width-slider");
var widthDisplay = document.getElementById("width-display");
var shadowSwitch = document.getElementById("shadow-switch");
var sidebarVis = false;
var isFullscreen = false;
var enableShadows = false;
var numSegments = 7;
var numLines = 3;
var width = 11;
var halfWidth = Math.floor(width / 2);
var midLeft = [0 - halfWidth, window.innerHeight / 2];
var midRight = [window.innerWidth + halfWidth, window.innerHeight / 2];
var palette1 = ["#264653", "#2a9d8f", "#e9c46a", "#f4a261", "#e76f51"];
var palette2 = ["#661163", "#e22bdd", "#c68de4", "#3ff9f8", "#4c46f7"];
var palette3 = ["#03045e", "#023e8a", "#0077b6", "#0096c7", "#00b4d8"];
var palette4 = ["#ffcdb2", "#ffb4a2", "#e5989b", "#b5838d", "#6d6875"];
var palette5 = ["#231942", "#5e548e", "#9f86c0", "#be95c4", "#e0b1cb"];
var palettes = [];
palettes.push(palette1);
palettes.push(palette2);
palettes.push(palette3);
palettes.push(palette4);
palettes.push(palette5);
var selectedPalette = -1;
menuBtn.onclick = toggleSidebar;
fullBtn.onclick = toggleFullscreen;
drawBtn.onclick = draw;

clearBtn.onclick = function () {
  selectedPalette = -1;
  draw();
};

segmentsSlider.onchange = segmentsChange;
linesSlider.onchange = linesChange;
widthSlider.onchange = widthChange;
shadowSwitch.onchange = toggleShadows;
drawPalette();

function drawPalette() {
  for (var i = 0; i < palettes.length; i++) {
    var paletteDiv = document.createElement("div");
    paletteDiv.id = "palette" + i;
    paletteDiv.className = "color-palette";
    paletteDiv.onclick = paletteClick;

    for (var j = 0; j < palettes[i].length; j++) {
      var colorDiv = document.createElement("div");
      colorDiv.className = "color";
      colorDiv.classList.add("color" + j);
      colorDiv.style.background = palettes[i][j];
      paletteDiv.appendChild(colorDiv);
    }

    document.getElementById("palettes").appendChild(paletteDiv);
  }
}

function paletteClick(e) {
  var targetId = e.target.parentElement.id;
  selectedPalette = targetId[targetId.length - 1];
  draw();
}

window.addEventListener("keypress", keyPress, false);

function keyPress(e) {
  if (e.keyCode == 32) {
    draw();
  }
}

function segmentsChange() {
  numSegments = segmentsSlider.value;
  segmentsDisplay.innerText = "Segments: ".concat(numSegments);
  draw();
}

function linesChange() {
  numLines = linesSlider.value;
  linesDisplay.innerText = "Lines: ".concat(numLines);
  draw();
}

function widthChange() {
  width = widthSlider.value;
  widthDisplay.innerText = "Width: ".concat(width, "px");
  draw();
}

function toggleShadows() {
  console.log(shadowSwitch.checked);
  enableShadows = shadowSwitch.checked;
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

function toggleFullscreen() {
  isFullscreen = !isFullscreen;

  if (isFullscreen) {
    requestFullscreen(document.body);
    fullBtn.innerHTML = '<i class="fas fa-compress"></i>';
  } else {
    closeFullscreen();
    fullBtn.innerHTML = '<i class="fas fa-expand"></i>';
  }
}

function requestFullscreen(element) {
  // Supports most browsers and their versions.
  var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen;

  if (requestMethod) {
    // Native full screen.
    requestMethod.call(element);
  } else if (typeof window.ActiveXObject !== "undefined") {
    // Older IE.
    var wscript = new ActiveXObject("WScript.Shell");

    if (wscript !== null) {
      wscript.SendKeys("{F11}");
    }
  }
}

function closeFullscreen() {
  var requestMethod = document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen || document.msExitFullscreen;

  if (requestMethod) {
    // Native full screen.
    requestMethod.call(document);
  } else if (typeof window.ActiveXObject !== "undefined") {
    // Older IE.
    var wscript = new ActiveXObject("WScript.Shell");

    if (wscript !== null) {
      wscript.SendKeys("{F11}");
    }
  }
}

function generatePoints(numSegments) {
  var maxHeight = window.innerHeight;
  var points = [];

  for (var i = 1; i < numSegments; i++) {
    var x = window.innerWidth / numSegments * i;
    var y = Math.floor(Math.random() * maxHeight);
    console.log(x, y);
    points.push([x, y]);
  }

  return points;
}

function draw() {
  var usedColors = [];
  var canvas = init("canvas").canvas;
  var ctx = canvas.getContext('2d'); // Fill background

  ctx.fillStyle = "#333";
  ctx.fillRect(0, 0, canvas.width, canvas.height); // Enable Shadows

  if (enableShadows) {
    ctx.shadowColor = "black";
    ctx.shadowBlur = 20;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 6;
  } // For each line generate random data and draw


  for (var l = 0; l < numLines; l++) {
    var points = generatePoints(numSegments);
    ctx.beginPath();
    ctx.moveTo(midLeft[0], midLeft[1]);

    for (var i = 0; i < points.length; i++) {
      ctx.lineTo(points[i][0], points[i][1]);
    }

    ctx.lineTo(midRight[0], midRight[1]);
    var randomColor = Math.floor(Math.random() * 16777215).toString(16);

    if (selectedPalette >= 0 && selectedPalette <= palettes.length) {
      var colorInUse = true;
      var color = void 0;

      while (colorInUse) {
        color = palettes[selectedPalette][Math.floor(Math.random() * 5)];

        if (!usedColors.includes(color)) {
          usedColors.push(color);
          colorInUse = false;
        }
      }

      ctx.strokeStyle = color;
    } else {
      ctx.strokeStyle = '#' + randomColor;
    }

    ctx.lineWidth = width;
    ctx.stroke(); // save canvas image as data url (png format by default)

    var dataURL = canvas.toDataURL(); // set canvasImg image src to dataURL
    // so it can be saved as an image

    document.getElementById('canvasImg').src = dataURL;
  }
}

draw();