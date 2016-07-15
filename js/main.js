let ignited = new Object();
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
ctx.canvas.width = 750;
ctx.canvas.height = window.innerHeight + 5;
var originalData;
var originalBot;
var img = new Image();
img.crossOrigin = "anonymous";
img.onload = populateField;
img.src = "https://cdn4.iconfinder.com/data/icons/BRILLIANT/networking/png/256/bomb.png";
let score = 0;
let lives = 3;

function populateField() {
  document.getElementById('score').innerHTML = "Score: " + score;
  document.getElementById('lives').innerHTML = "Lives: " + lives;

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4 ; j++) {
      ctx.drawImage(img, i*185, j*170, 200, 200);
    }
  }

  originalData = ctx.getImageData(0, 25, 185, 170);
  originalBot = ctx.getImageData(0, 535, 185, 170);
}

function gameOver() {
  console.log("You Lose");
}
//
// for (let i = 0; i < 4; i++) {
//   for (let j = 0; j < 4 ; j++) {
//     ctx.rect(i*185+10, j*170+50, 145, 145);
//     ctx.stroke();
//   }
// }

function numOfIgnited() {

  let count = 0;
  for (let i = 0 ; i < 4; i++) {
    for (let j = 0 ; j < 4 ; j++) {
      if (ignited[`${i}${j}`] === "red") {
        count++;
      }
    }
  }
  console.log(count);
  return count;
}

function reset() {
  score = 0;
  lives = 3;
  for (let i = 0 ; i < 4; i++) {
    for (let j = 0 ; j < 4 ; j++) {
      ignited[`${i}${j}`] = false;
    }
  }
  populateField();
}

function checkIfLost(ignitionInterval) {
  let numLit = numOfIgnited();
  if (numLit >= 5 || lives <= 0) {
    canvas.removeEventListener('click', _handleClick);
    clearInterval(ignitionInterval);
    gameOver();
  }
}

function start() {
  reset();
  canvas.addEventListener('click', _handleClick);
  let ignitionInterval = setInterval(function() {
    checkIfLost(ignitionInterval);
    igniteBombs();
  }, 1000);
}
//colorshit += .0001 every .01 seconds

function getColor(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


function colorShifter(pos) {
  let colorshift;

  let startTime = new Date().getTime();
  if (ignited[`${pos[0]}${pos[1]}`] === "red") {
    colorshift = 0;
  } else {
    colorshift = 1;
  }

  let shift = setInterval(function() {

    recolorBombs(pos, colorshift);
    colorshift += .0004;
    if (new Date().getTime() - startTime > 1000) {
      clearInterval(shift);
    }
  }, .01);
}

function igniteBombs() {
  let pos = selectBombPos();
  let pos2 = selectBombPos();
  let pos3 = selectBombPos();
  let pos4 = selectBombPos();

  if (pos) {
    let shift = colorShifter(pos);
  }
  if (pos2) {
    let shift2 = colorShifter(pos2);
  }
  if (pos3) {
    let shift3 = colorShifter(pos3);
  }
  if (pos4) {
    let shift4 = colorShifter(pos4);
  }

}

function selectBombPos() {
  let posx = Math.floor(Math.random()*4);
  let posy = Math.floor(Math.random()*4);
  if (ignited[`${posx}${posy}`] === "red") {
    return undefined;
  }

  switch (getColor(0, 1)) {
    case 0:
    ignited[`${posx}${posy}`] = "red";
    break;
    case 1:
    ignited[`${posx}${posy}`] = "blue";
    break;
  }
  return [posx, posy];
}

function _handleClick(e) {

  let clickPos = [e.pageX, e.pageY];

  if (clickPos[0]> 20 && clickPos[0] < 165 && clickPos[1] > 60 && clickPos[1] < 205) {
    ctx.putImageData(originalData, 0, 25);
    if (ignited["00"] === "red") {
      score += 1;
      document.getElementById('score').innerHTML = "Score: " + score;
      ignited["00"] = false;
    } else if (ignited["00"] === "blue"){
      score -= 1;
      lives -= 1;
      document.getElementById('score').innerHTML = "Score: " + score;
      document.getElementById('lives').innerHTML = "Lives: " + lives;
      ignited["00"] = false;
    }
  }

  if (clickPos[0]> 20 && clickPos[0] < 165 && clickPos[1] > 230 && clickPos[1] < 375) {
    ctx.putImageData(originalData, 0, 195);
    if (ignited["01"] === "red") {
      score += 1;
      document.getElementById('score').innerHTML = "Score: " + score;
      ignited["01"] = false;
    } else if (ignited["01"] === "blue"){
      score -= 1;
      lives -= 1;
      document.getElementById('score').innerHTML = "Score: " + score;
      document.getElementById('lives').innerHTML = "Lives: " + lives;
      ignited["01"] = false;
    }
  }

  if (clickPos[0]> 20 && clickPos[0] < 165 && clickPos[1] > 400 && clickPos[1] < 545) {
    ctx.putImageData(originalData, 0, 365);
    if (ignited["02"] === "red") {
      score += 1;
      document.getElementById('score').innerHTML = "Score: " + score;
      ignited["02"] = false;
    } else if (ignited["02"] === "blue"){
      score -= 1;
      lives -= 1;
      document.getElementById('score').innerHTML = "Score: " + score;
      document.getElementById('lives').innerHTML = "Lives: " + lives;
      ignited["02"] = false;
    }
  }

  if (clickPos[0]> 20 && clickPos[0] < 165 && clickPos[1] > 575 && clickPos[1] < 710) {
    ctx.putImageData(originalBot, 0, 535);
    if (ignited["03"] === "red") {
      ignited["03"] = false;
      score += 1;
      document.getElementById('score').innerHTML = "Score: " + score;
    } else if (ignited["03"] === "blue"){
      score -= 1;
      lives -= 1;
      document.getElementById('score').innerHTML = "Score: " + score;
      document.getElementById('lives').innerHTML = "Lives: " + lives;
      ignited["03"] = false;
    }
  }

  if (clickPos[0]> 205 && clickPos[0] < 350 && clickPos[1] > 60 && clickPos[1] < 205) {
    ctx.putImageData(originalData, 185, 25);
    if (ignited["10"] === "red") {
      ignited["10"] = false;
      score += 1;
      document.getElementById('score').innerHTML = "Score: " + score;
    } else if (ignited["10"] === "blue"){
      score -= 1;
      lives -= 1;
      document.getElementById('score').innerHTML = "Score: " + score;
      document.getElementById('lives').innerHTML = "Lives: " + lives;
      ignited["10"] = false;
    }
  }
  if (clickPos[0]> 205 && clickPos[0] < 350 && clickPos[1] > 230 && clickPos[1] < 375) {
    ctx.putImageData(originalData, 185, 195);
    if (ignited["11"] === "red") {
      ignited["11"] = false;
      score += 1;
      document.getElementById('score').innerHTML = "Score: " + score;
    } else if (ignited["11"] === "blue"){
      score -= 1;
      lives -= 1;
      document.getElementById('score').innerHTML = "Score: " + score;
      document.getElementById('lives').innerHTML = "Lives: " + lives;
      ignited["11"] = false;
    }
  }
  if (clickPos[0]> 205 && clickPos[0] < 350 && clickPos[1] > 400 && clickPos[1] < 545) {
    ctx.putImageData(originalData, 185, 365);
    if (ignited["12"] === "red") {
      ignited["12"] = false;
      score += 1;
      document.getElementById('score').innerHTML = "Score: " + score;
    } else if (ignited["12"] === "blue"){
      score -= 1;
      lives -= 1;
      document.getElementById('score').innerHTML = "Score: " + score;
      document.getElementById('lives').innerHTML = "Lives: " + lives;
      ignited["12"] = false;
    }
  }
  if (clickPos[0]> 205 && clickPos[0] < 350 && clickPos[1] > 575 && clickPos[1] < 710) {
    ctx.putImageData(originalBot, 185, 535);
    if (ignited["13"] === "red") {
      ignited["13"] = false;
      score += 1;
      document.getElementById('score').innerHTML = "Score: " + score;
    } else if (ignited["13"] === "blue"){
      score -= 1;
      lives -= 1;
      document.getElementById('score').innerHTML = "Score: " + score;
      document.getElementById('lives').innerHTML = "Lives: " + lives;
      ignited["13"] = false;
    }
  }

  if (clickPos[0]> 390 && clickPos[0] < 535 && clickPos[1] > 60 && clickPos[1] < 205) {
    ctx.putImageData(originalData, 370, 25);
    if (ignited["20"] === "red") {
      ignited["20"] = false;
      score += 1;
      document.getElementById('score').innerHTML = "Score: " + score;
    } else if (ignited["20"] === "blue"){
      score -= 1;
      lives -= 1;
      document.getElementById('score').innerHTML = "Score: " + score;
      document.getElementById('lives').innerHTML = "Lives: " + lives;
      ignited["20"] = false;
    }
  }
  if (clickPos[0]> 390 && clickPos[0] < 535 && clickPos[1] > 230 && clickPos[1] < 375) {
    ctx.putImageData(originalData, 370, 195);
    if (ignited["21"] === "red") {
      ignited["21"] = false;
      score += 1;
      document.getElementById('score').innerHTML = "Score: " + score;
    } else if (ignited["21"] === "blue"){
      score -= 1;
      lives -= 1;
      document.getElementById('score').innerHTML = "Score: " + score;
      document.getElementById('lives').innerHTML = "Lives: " + lives;
      ignited["21"] = false;
    }
  }
  if (clickPos[0]> 390 && clickPos[0] < 535 && clickPos[1] > 400 && clickPos[1] < 545) {
    ctx.putImageData(originalData, 370, 365);
    if (ignited["22"] === "red") {
      ignited["22"] = false;
      score += 1;
      document.getElementById('score').innerHTML = "Score: " + score;
    } else if (ignited["22"] === "blue"){
      score -= 1;
      lives -= 1;
      document.getElementById('score').innerHTML = "Score: " + score;
      document.getElementById('lives').innerHTML = "Lives: " + lives;
      ignited["22"] = false;
    }
  }
  if (clickPos[0]> 390 && clickPos[0] < 535 && clickPos[1] > 575 && clickPos[1] < 710) {
    ctx.putImageData(originalBot, 370, 535);
    if (ignited["23"] === "red") {
      ignited["23"] = false;
      score += 1;
      document.getElementById('score').innerHTML = "Score: " + score;
    } else if (ignited["23"] === "blue"){
      score -= 1;
      lives -= 1;
      document.getElementById('score').innerHTML = "Score: " + score;
      document.getElementById('lives').innerHTML = "Lives: " + lives;
      ignited["23"] = false;
    }
  }

  if (clickPos[0]> 575 && clickPos[0] < 720 && clickPos[1] > 60 && clickPos[1] < 205) {
    ctx.putImageData(originalData, 555, 25);
    if (ignited["30"] === "red") {
      ignited["30"] = false;
      score += 1;
      document.getElementById('score').innerHTML = "Score: " + score;
    } else if (ignited["30"] === "blue"){
      score -= 1;
      lives -= 1;
      document.getElementById('score').innerHTML = "Score: " + score;
      document.getElementById('lives').innerHTML = "Lives: " + lives;
      ignited["30"] = false;
    }
  }
  if (clickPos[0]> 575 && clickPos[0] < 720 && clickPos[1] > 230 && clickPos[1] < 375) {
    ctx.putImageData(originalData, 555, 195);
    if (ignited["31"] === "red") {
      ignited["31"] = false;
      score += 1;
      document.getElementById('score').innerHTML = "Score: " + score;
    } else if (ignited["31"] === "blue"){
      score -= 1;
      lives -= 1;
      document.getElementById('score').innerHTML = "Score: " + score;
      document.getElementById('lives').innerHTML = "Lives: " + lives;
      ignited["31"] = false;
    }
  }
  if (clickPos[0]> 575 && clickPos[0] < 720 && clickPos[1] > 400 && clickPos[1] < 545) {
    ctx.putImageData(originalData, 555, 365);
    if (ignited["32"] === "red") {
      ignited["32"] = false;
      score += 1;
      document.getElementById('score').innerHTML = "Score: " + score;
    } else if (ignited["32"] === "blue"){
      score -= 1;
      lives -= 1;
      document.getElementById('score').innerHTML = "Score: " + score;
      document.getElementById('lives').innerHTML = "Lives: " + lives;
      ignited["32"] = false;
    }
  }
  if (clickPos[0]> 575 && clickPos[0] < 720 && clickPos[1] > 575 && clickPos[1] < 710) {
    ctx.putImageData(originalBot, 555, 535);
    if (ignited["33"] === "red") {
      ignited["33"] = false;
      score += 1;
      document.getElementById('score').innerHTML = "Score: " + score;
    } else if (ignited["33"] === "blue"){
      score -= 1;
      lives -= 1;
      document.getElementById('score').innerHTML = "Score: " + score;
      document.getElementById('lives').innerHTML = "Lives: " + lives;
      ignited["33"] = false;
    }
  }
}

function recolorBombs(pos, colorshift) {
  var imgData = ctx.getImageData(pos[0]*185, pos[1]*170 + 25, 185, 170);

  var data = imgData.data;

  for (var i = 0; i < data.length; i += 4) {
    let red = data[i + 0];
    let green = data[i + 1];
    let blue = data[i + 2];
    let alpha = data[i + 3];

    // skip transparent/semiTransparent pixels
    if (alpha < 200) {
      continue;
    }

    var hsl = rgbToHsl(red, green, blue);
    var hue = hsl.h * 360;

    // change blueish pixels to the new color
    if (hue > 100 && hue < 400) {
      var newRgb = hslToRgb(hsl.h + colorshift, hsl.s, hsl.l);
      data[i + 0] = newRgb.r;
      data[i + 1] = newRgb.g;
      data[i + 2] = newRgb.b;
      data[i + 3] = 255;
    }
  }
  ctx.putImageData(imgData, pos[0]*185, pos[1]*170 + 25);
}

function rgbToHsl(r, g, b) {
  r /= 255, g /= 255, b /= 255;
  var max = Math.max(r, g, b),
  min = Math.min(r, g, b);
  var h, s, l = (max + min) / 2;

  if (max == min) {
    h = s = 0; // achromatic
  } else {
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
      h = (g - b) / d + (g < b ? 6 : 0);
      break;
      case g:
      h = (b - r) / d + 2;
      break;
      case b:
      h = (r - g) / d + 4;
      break;
    }
    h /= 6;
  }

  return ({
    h: h,
    s: s,
    l: l,
  });
}


function hslToRgb(h, s, l) {
  var r, g, b;

  if (s == 0) {
    r = g = b = l; // achromatic
  } else {
    function hue2rgb(p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    }

    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return ({
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  });
}
