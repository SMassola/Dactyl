var ignited = new Object();
var redchecker = new Object();
var colorshift = new Object();
var lightBombs;
var gameEnd;
var explosionInterval;

var canvas = document.getElementById("canvas");
var canvas2 = document.getElementById("canvas2");

var ctx = canvas.getContext("2d");
var ctx2 = canvas2.getContext("2d");

ctx.canvas.height = window.innerHeight;
ctx2.canvas.height = window.innerHeight;

ctx.canvas.width = ctx.canvas.height;
ctx2.canvas.width = ctx2.canvas.height;

var originalData;
var transitions = true;

function toggleFlag() {
  transitions = !transitions;
  var toggler = document.getElementById("toggle");
  toggler.innerHTML = transitions ? "TRANSITIONS OFF" : "TRANSITIONS ON";
}

var img = new Image();
img.crossOrigin = "anonymous";
img.onload = populateField;
img.src = "https://cdn4.iconfinder.com/data/icons/BRILLIANT/networking/png/256/bomb.png";

var score = 0;
var lives = 8;

function popup() {
  var modal = document.getElementsByClassName('modal')[0] ;
  modal.style.display = "flex";
  var esc = document.getElementsByClassName("close")[0];
  esc.onclick = function() {
    modal.style.display = "none";
  };
}

function gameOver() {
  popup();
  document.getElementById("start").onclick = function() {
    start();
  };
}

function checkIfLost(loss, ignitionInterval) {
  if (lives <= 0) {
    canvas2.removeEventListener('click', _handleClick);
    clearInterval(ignitionInterval);
    clearInterval(loss);
    gameOver();
  }
}

function populateField() {
  document.getElementById('score').innerHTML = "Score: " + score;
  document.getElementById('lives').innerHTML = "Lives: " + lives;
  for (var i = 0; i < 4; i++) {
    for (var j = 0; j < 4 ; j++) {
      ctx.drawImage(
        img,
        i*ctx.canvas.height*0.25,
        j*ctx.canvas.height*0.25,
        ctx.canvas.height * .25,
        ctx.canvas.height * .25
      );
    }
  }

  originalData = ctx.getImageData(
    ctx.canvas.height*0.25, ctx.canvas.height*0.25, ctx.canvas.height*0.25, ctx.canvas.height*0.25
  );
}

function reset() {
  var frameRate = 60.0;
  var frameDelay = 1000.0/frameRate;
  explosionInterval = setInterval(function() {
    update(frameDelay);
  }, frameDelay);

  score = 0;
  lives = 8;
  for (var i = 0 ; i < 4; i++) {
    for (var j = 0 ; j < 4 ; j++) {
      ignited[`${i}${j}`] = false;
    }
  }
  populateField();
}

function start() {
  document.getElementById("start").setAttribute("onclick", null);
  clearInterval(lightBombs);
  clearInterval(gameEnd);
  clearInterval(explosionInterval);
  reset();
  canvas2.addEventListener('click', _handleClick);
  gameEnd = setInterval(function() {
    checkIfLost(gameEnd, lightBombs);
    igniteBombs();
  }, 1000);
}

function getColor(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function redCheck(pos, checkIfRed) {
  if (ignited[`${pos[0]}${pos[1]}`] === "red") {
    lives -= 1;
    ignited[`${pos[0]}${pos[1]}`] = "black";
    recolorBombs(pos, 2);
    document.getElementById('lives').innerHTML = "Lives: " + lives;
    var dim = ctx.canvas.height*0.25;
    createExplosion(pos[0]*dim+dim/2-10,
                    pos[1]*dim+dim/2+22.5,
                    "red");
    createExplosion(pos[0]*dim+dim/2-10,
                    pos[1]*dim+dim/2+22.5,
                    "yellow");
    createExplosion(pos[0]*dim+dim/2-10,
                    pos[1]*dim+dim/2+22.5,
                    "orange");
    setTimeout(function() {
      ignited[`${pos[0]}${pos[1]}`] = false;
      ctx.putImageData(
        originalData,
        pos[0]*ctx.canvas.height*0.25,
        pos[1]*ctx.canvas.height*0.25);
    }, 2000);
  }
}

function colorShifter(positions) {

  positions.forEach((pos) => {
    if (ignited[`${pos[0]}${pos[1]}`] === "red") {
      colorshift[`${pos[0]}${pos[1]}`] = 0;
      redchecker[`${pos[0]}${pos[1]}`] = setTimeout(
        redCheck.bind(null, pos), 3000
      );
    } else {
      colorshift[`${pos[0]}${pos[1]}`] = 1;
    }
  });
  if (transitions) {
    var shift = setInterval(function() {
      positions.forEach((pos) => {
        recolorBombs(pos, colorshift[`${pos[0]}${pos[1]}`]);
        colorshift[`${pos[0]}${pos[1]}`] += .0006;
      }, 1);
    });
    setTimeout(function() {
      clearInterval(shift);
    }, 1000);
  } else {
    positions.forEach((pos) => {
      ctx.putImageData(
        originalData,
        pos[0]*ctx.canvas.height*0.25,
        pos[1]*ctx.canvas.height*0.25
      );
      recolorBombs(pos, colorshift[`${pos[0]}${pos[1]}`] + .24);
    });
  }
}

function igniteBombs() {
  var pos = selectBombPos();
  var pos2 = selectBombPos();
  var pos3 = selectBombPos();
  var pos4 = selectBombPos();

  var positions =  [];
  if (pos) {
    positions.push(pos);
  }
  if (pos2) {
    positions.push(pos2);
  }
  if (pos3) {
    positions.push(pos3);
  }
  if (pos4) {
    positions.push(pos4);
  }
  colorShifter(positions);
}

function selectBombPos() {
  var posx = Math.floor(Math.random()*4);
  var posy = Math.floor(Math.random()*4);
  if (ignited[`${posx}${posy}`] === "red" || ignited[`${posx}${posy}`] === "black") {
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
  var dim = ctx.canvas.height*0.25;
  var clickPos = [e.pageX, e.pageY];

  if (clickPos[0]> 10 && clickPos[0] < dim-40 && clickPos[1] > 45 && clickPos[1] < dim) {
    ctx.putImageData(originalData, 0, 0);
    if (ignited["00"] === "red") {
      clearTimeout(redchecker["00"]);
      score += 1;
      document.getElementById('score').innerHTML = "Score: " + score;
      ignited["00"] = false;
    } else if (ignited["00"] === "blue") {
      score -= 1;
      lives -= 1;
      document.getElementById('score').innerHTML = "Score: " + score;
      document.getElementById('lives').innerHTML = "Lives: " + lives;
      ignited["00"] = false;
    }
  }

  if (clickPos[0]> 10 && clickPos[0] < dim-40 && clickPos[1] > dim+45 && clickPos[1] < 2*dim) {
    ctx.putImageData(originalData, 0, dim);
    if (ignited["01"] === "red") {
      clearTimeout(redchecker["01"]);
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

  if (clickPos[0]> 10 && clickPos[0] < dim-40 && clickPos[1] > 2*dim+45 && clickPos[1] < 3*dim) {
    ctx.putImageData(originalData, 0, 2*dim);
    if (ignited["02"] === "red") {
      clearTimeout(redchecker["02"]);
      score += 1;
      document.getElementById('score').innerHTML = "Score: " + score;
      ignited["02"] = "black";
    } else if (ignited["02"] === "blue"){
      score -= 1;
      lives -= 1;
      document.getElementById('score').innerHTML = "Score: " + score;
      document.getElementById('lives').innerHTML = "Lives: " + lives;
      ignited["02"] = false;
    }
  }

  if (clickPos[0]> 10 && clickPos[0] < dim-40 && clickPos[1] > 3*dim+45 && clickPos[1] < 4*dim) {
    ctx.putImageData(originalData, 0, 3*dim);
    if (ignited["03"] === "red") {
      clearTimeout(redchecker["03"]);
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

  if (clickPos[0]> dim+10 && clickPos[0] < 2*dim-40 && clickPos[1] > 45 && clickPos[1] < dim) {
    ctx.putImageData(originalData, dim, 0);
    if (ignited["10"] === "red") {
      clearTimeout(redchecker["10"]);
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
  if (clickPos[0]> dim+10 && clickPos[0] < 2*dim-40 && clickPos[1] > dim+45 && clickPos[1] < 2*dim) {
    ctx.putImageData(originalData, dim, dim);
    if (ignited["11"] === "red") {
      clearTimeout(redchecker["11"]);
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
  if (clickPos[0]> dim+10 && clickPos[0] < 2*dim-40 && clickPos[1] > 2*dim+45 && clickPos[1] < 3*dim) {
    ctx.putImageData(originalData, dim, 2*dim);
    if (ignited["12"] === "red") {
      clearTimeout(redchecker["12"]);
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
  if (clickPos[0]> dim+10 && clickPos[0] < 2*dim-40 && clickPos[1] > 3*dim+45 && clickPos[1] < 4*dim) {
    ctx.putImageData(originalData, dim, 3*dim);
    if (ignited["13"] === "red") {
      clearTimeout(redchecker["13"]);
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

  if (clickPos[0]> 2*dim+10 && clickPos[0] < 3*dim-40 && clickPos[1] > 45 && clickPos[1] < dim) {
    ctx.putImageData(originalData, 2*dim, 0);
    if (ignited["20"] === "red") {
      clearTimeout(redchecker["20"]);
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
  if (clickPos[0]> 2*dim+10 && clickPos[0] < 3*dim-40 && clickPos[1] > dim+45 && clickPos[1] < 2*dim) {
    ctx.putImageData(originalData, 2*dim, dim);
    if (ignited["21"] === "red") {
      clearTimeout(redchecker["21"]);
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
  if (clickPos[0]> 2*dim+10 && clickPos[0] < 3*dim-40 && clickPos[1] > 2*dim+45 && clickPos[1] < 3*dim) {
    ctx.putImageData(originalData, 2*dim, 2*dim);
    if (ignited["22"] === "red") {
      clearTimeout(redchecker["22"]);
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
  if (clickPos[0]> 2*dim+10 && clickPos[0] < 3*dim-40 && clickPos[1] > 3*dim+45 && clickPos[1] < 4*dim) {
    ctx.putImageData(originalData, 2*dim, 3*dim);
    if (ignited["23"] === "red") {
      clearTimeout(redchecker["23"]);
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

  if (clickPos[0]> 3*dim+10 && clickPos[0] < 4*dim-40 && clickPos[1] > 45 && clickPos[1] < dim) {
    ctx.putImageData(originalData, 3*dim, 0);
    if (ignited["30"] === "red") {
      clearTimeout(redchecker["30"]);
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
  if (clickPos[0]> 3*dim+10 && clickPos[0] < 4*dim-40 && clickPos[1] > dim+45 && clickPos[1] < 2*dim) {
    ctx.putImageData(originalData, 3*dim, dim);
    if (ignited["31"] === "red") {
      clearTimeout(redchecker["31"]);
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
  if (clickPos[0]> 3*dim+10 && clickPos[0] < 4*dim-40 && clickPos[1] > 2*dim+45 && clickPos[1] < 3*dim) {
    ctx.putImageData(originalData, 3*dim, 2*dim);
    if (ignited["32"] === "red") {
      clearTimeout(redchecker["32"]);
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
  if (clickPos[0]> 3*dim+10 && clickPos[0] < 4*dim-40 && clickPos[1] > 3*dim+45 && clickPos[1] < 4*dim) {
    ctx.putImageData(originalData, 3*dim, 3*dim);
    if (ignited["33"] === "red") {
      clearTimeout(redchecker["33"]);
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

function recolorBombs(pos, shift) {
  var imgData = ctx.getImageData(
    pos[0]*ctx.canvas.height*0.25,
    pos[1]*ctx.canvas.height*0.25,
    ctx.canvas.height * .25,
    ctx.canvas.height * .25);

  var data = imgData.data;

  for (var i = 0; i < data.length; i += 4) {
    var red = data[i + 0];
    var green = data[i + 1];
    var blue = data[i + 2];
    var alpha = data[i + 3];

    if (alpha < 200) {
      continue;
    }

    var hsl = rgbToHsl(red, green, blue);
    var hue = hsl.h * 360;

    if (hue > 100 && hue < 300) {
      var newRgb = hslToRgb(hsl.h + shift, hsl.s, hsl.l);
      data[i + 0] = newRgb.r;
      data[i + 1] = newRgb.g;
      data[i + 2] = newRgb.b;
      data[i + 3] = 255;
    }
    if (ignited[`${pos[0]}${pos[1]}`] === "black") {
      if (hue > 100 && hue < 400) {
        var newRgb2 = hslToRgb(hsl.h + shift, hsl.s, hsl.l);
        data[i + 0] = newRgb2.r;
        data[i + 1] = newRgb2.g;
        data[i + 2] = newRgb2.b;
        data[i + 3] = 255;
      }
    }
  }
  ctx.putImageData(imgData, pos[0]*ctx.canvas.height*0.25, pos[1]*ctx.canvas.height*0.25);
}

function rgbToHsl(r, g, b) {
  r /= 255, g /= 255, b /= 255;
  var max = Math.max(r, g, b),
  min = Math.min(r, g, b);
  var h, s, l = (max + min) / 2;

  if (max == min) {
    h = s = 0;
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

function hue2rgb(p, q, t) {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
}

function hslToRgb(h, s, l) {
  var r, g, b;

  if (s == 0) {
    r = g = b = l; // achromatic
  } else {
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


var particles = [];

function Particle () {
	this.scale = 1.0;
	this.x = 0;
	this.y = 0;
	this.radius = 20;
	this.color = "#000";
	this.velocityX = 0;
	this.velocityY = 0;
	this.scaleSpeed = 0.5;

	this.update = function(ms) {
		// shrinking
		this.scale -= this.scaleSpeed * ms / 1000.0;

		if (this.scale <= 0) {
			this.scale = 0;
		}
		// moving away from explosion center
		this.x += this.velocityX * ms/1000.0;
		this.y += this.velocityY * ms/1000.0;
	};

	this.draw = function(context2D) {
		// translating the 2D context to the particle coordinates
		context2D.save();
		context2D.translate(this.x, this.y);
		context2D.scale(this.scale, this.scale);

		// drawing a filled circle in the particle's local space
		context2D.beginPath();
		context2D.arc(0, 0, this.radius, 0, Math.PI*2, true);
		context2D.closePath();

		context2D.fillStyle = this.color;
		context2D.fill();

		context2D.restore();
	};
}

function randomFloat (min, max) {
	return min + Math.random() * (max-min);
}

function createExplosion(x, y, color) {
	var minSize = 10;
	var maxSize = 30;
	var count = 10;
	var minSpeed = 60.0;
	var maxSpeed = 200.0;
	var minScaleSpeed = 1.0;
	var maxScaleSpeed = 4.0;

	for (var angle=0; angle<360; angle += Math.round(360/count)) {
		var particle = new Particle();

		particle.x = x;
		particle.y = y;

		particle.radius = randomFloat(minSize, maxSize);

		particle.color = color;

		particle.scaleSpeed = randomFloat(minScaleSpeed, maxScaleSpeed);

		var speed = randomFloat(minSpeed, maxSpeed);

		particle.velocityX = speed * Math.cos(angle * Math.PI / 180.0);
		particle.velocityY = speed * Math.sin(angle * Math.PI / 180.0);

		particles.push(particle);
	}
}

function update (frameDelay) {
  ctx2.clearRect(0, 0, canvas.width, canvas.height);

	// update and draw particles
	for (var i=0; i<particles.length; i++) {
		var particle = particles[i];

		particle.update(frameDelay);
		particle.draw(ctx2);
	}
}
