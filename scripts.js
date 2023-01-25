const CoordinateGeometry = {
  degreeToRadian: function (angle) {
    return angle * Math.PI / 180;
  },
  transpose: function (x, y, dx, dy) {
    return {
      x: x + dx,
      y: y + dy
    }
  },
  axesTranslate: function (x, y, angle) {
    return {
      x: x * Math.cos(angle) - y * Math.sin(angle),
      y: x * Math.sin(angle) + y * Math.cos(angle)
    }
  },
  reflectOnAxisY: function (x, y) {
    return {
      x: -x,
      y: y
    }
  },
  reflectOnAxisX: function (x, y) {
    return {
      x: x,
      y: -y
    }
  },
  calculateCoordinateInCircle: function (angle, radius) {
    return {x: Math.sin(angle) * radius, y: Math.cos(angle) * radius};
  }
}

const canvas = document.getElementById("canvas");
canvas.setAttribute('width', '480');
canvas.setAttribute('height', '720');
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const radiusOfCircle = 180;

const ctx = canvas.getContext("2d");
drawExterior();
drawWatchDial();
drawClockHand();

function drawExterior() {
  ctx.lineWidth = 3;
  ctx.strokeStyle = "#FF0000";
  ctx.fillStyle = "#FFFF00";
  ctx.beginPath();
  // context.arc(x,y,r,sAngle,eAngle,counterclockwise);
  ctx.arc(centerX, centerY, radiusOfCircle, 0, Math.PI * 2); // Outer circle
  ctx.stroke();
  ctx.fill();
  ctx.closePath();
}

function drawWatchDial() {
  ctx.lineWidth = 3;
  ctx.strokeStyle = "#FF0000";
  ctx.beginPath();
  for (var dial = 0; dial < 12; dial += 1)
  {
    const angle =  dial * 30 * Math.PI/180;;
    var dialStartCoordinate = calculateCoordinateInCircle(angle, 140)
    ctx.moveTo(dialStartCoordinate.x + 240, dialStartCoordinate.y + 360);
    var dialEndCoordinate = calculateCoordinateInCircle(angle, 180)
    ctx.lineTo(dialEndCoordinate.x + 240, dialEndCoordinate.y + 360);
  }
  ctx.stroke();
  ctx.closePath();
}

function drawClockHand() {
  const date = new Date();
  const seconds = date.getSeconds();
  const minutes = date.getMinutes() + seconds / 60;
  const hours = date.getHours() % 12 + minutes / 60;

  drawHourHand(hours);
  drawMinuteHand(minutes);
  drawSecondHand(seconds);
}

function calculateCoordinateInCircle(angle, radius) {
  return {x: Math.sin(angle) * radius, y: Math.cos(angle) * radius};
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

window.setInterval(() => {
  // ctx.rotate(CoordinateGeometry.degreeToRadian(90));
  clearCanvas();
  drawExterior();
  drawWatchDial();
  drawClockHand();
}, 1000);

function drawHourHand(hours) {
  // hour
  const angle = CoordinateGeometry.degreeToRadian(hours / 12 * 360);
  const handLength = 40;
  const reflectedEndCoordinate = normalizedCoordinate(angle, handLength)

  ctx.lineWidth = 5;
  ctx.strokeStyle = "#FF00FF";

  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(reflectedEndCoordinate.x, reflectedEndCoordinate.y);
  ctx.stroke();
}

function drawSecondHand(seconds) {
  // second
  const angle = CoordinateGeometry.degreeToRadian(seconds / 60 * 360);
  const handLength = 120;
  const reflectedEndCoordinate = normalizedCoordinate(angle, handLength)

  ctx.lineWidth = 1;
  ctx.strokeStyle = "#00FFFF";

  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(reflectedEndCoordinate.x, reflectedEndCoordinate.y);
  ctx.stroke();
}

function drawMinuteHand(minutes) {
  // minute
  const angle = CoordinateGeometry.degreeToRadian(minutes / 60 * 360);
  const handLength = 80;
  const reflectedEndCoordinate = normalizedCoordinate(angle, handLength)

  ctx.lineWidth = 3;
  ctx.strokeStyle = "#00FF00";

  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(reflectedEndCoordinate.x, reflectedEndCoordinate.y);
  ctx.stroke();
}

function normalizedCoordinate(angle, handLength) {
  const handEndCoordinate = CoordinateGeometry.calculateCoordinateInCircle(angle, handLength);
  const reflectedEndCoordinate = CoordinateGeometry.reflectOnAxisX(handEndCoordinate.x, handEndCoordinate.y);
  return CoordinateGeometry.transpose(reflectedEndCoordinate.x, reflectedEndCoordinate.y, centerX, centerY);
}