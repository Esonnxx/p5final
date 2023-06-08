let particles = []
let numParticles = 0
let colors = [
  [255, 170, 187],
  [176, 180, 217],
  [255, 51, 85],
  [85, 255, 187],
  [0, 170, 255],
  [153, 187, 255],
  [238, 170, 102]
]
let colorsFast = [
  [255, 10, 84],
  [255, 71, 126],
  [255, 92, 138],
  [255, 112, 150],
  [255, 133, 161],
  [255, 153, 172],
  [251, 177, 189]
]
//let amp
let sound
let fft, waveform, mic
//let spectrum
let vol
//let threshold = 0.2 // 節奏變快的閾值
//let previousEnergy = 0 // 上一個時間點的能量值
//let rhythmCount = 0 // 超過閾值的能量值數量
//let rhythmThreshold = 6 // 超過閾值的能量值數量的閾值
const maxSpeedRate = 1.05
const secSpeedRate = 1.01

function setup () {
  createCanvas(windowWidth, windowHeight, WEBGL)
  colorMode(RGB, 255)
  noStroke()
  mic = new p5.AudioIn()
  mic.start()
  fft = new p5.FFT()
  fft.setInput(mic)


  for (let i = 0; i < numParticles; i++) {
    particles.push(new Particle())
  }
}
function draw () {
  vol = mic.getLevel()
  if (vol < 0.03) {
    numParticles = 0
  } else {
    numParticles = parseFloat(vol.toFixed(2)) * 4500

  }


  console.log("val", vol)
  console.log(numParticles)
  let rotationAngle = frameCount * 0.015
  background(0)
  rotateZ(rotationAngle)
  if (vol > 0.047)
    rotationAngle = 0
  else
    rotationAngle = frameCount * 0.015

  for (let i = 0; i < particles.length; i++) {
    particles[i].update()
    particles[i].display()

    // 刪除超出畫面的粒子
    if (particles[i].isFinished()) {
      particles.splice(i, 1)
      i--
    }
  }

  // 創建新的粒子
  if (particles.length < numParticles) {
    particles.push(new Particle())
  }
}

class Particle {
  constructor() {
    this.x = random(-50, 50)
    this.y = random(-50, 50)
    this.z = -height / 2
    this.size = random(3, 10)
    this.speed = random(4, 9)
    this.opacity = 255
    this.rotation = 0 // 旋轉角度
    this.speedX = random(-10, 6)
    this.speedY = random(-10, 6)
    this.speedZ = random(-10, 6)
    this.color = random(colors)
  }

  update () {
    this.x += this.speedX
    this.y += this.speedY
    this.z += this.speedZ
    this.size += .7
    this.opacity -= 3
    this.rotation += 0.01 // 每次更新增加旋轉角度
    if (vol > 0.045) {
      this.speedX *= maxSpeedRate
      this.speedY *= maxSpeedRate
      this.speedZ *= maxSpeedRate
      this.size += 1.2
      this.color = random(colorsFast)
    } else if (vol > 0.032 && vol < 0.045) {
      this.speedX *= secSpeedRate
      this.speedY *= secSpeedRate
      this.speedZ *= secSpeedRate

    }

  }

  display () {
    push()
    translate(this.x, this.y, this.z)
    rotateZ(this.rotation + random(10, 40))
    fill(this.color, this.opacity)
    sphere(this.size)
    pop()
  }

  isFinished () {
    return this.opacity <= 0
  }
}

/*function measureSongSpeed () {
  let energy = 0 // 紀錄當前時間點的能量值

  // 計算當前時間點的能量值
  for (let i = 0; i < waveform.length; i++) {
    energy += waveform[i] * waveform[i]
  }

  // 判斷節奏變快
  if (energy > threshold && energy > previousEnergy) {
    rhythmCount++

    // 如果連續超過閾值的能量值數量超過閾值，則判斷為節奏變快
    if (rhythmCount >= rhythmThreshold) {
      console.log("Rhythm accelerated!")
      numParticles = 100
      // 在此處執行節奏變快時的相應操作
    }
  }
  else {
    rhythmCount = 0
  }

  previousEnergy = energy // 更新上一個時間點的能量值
  console.log("節拍:", rhythmCount)
}

function rhythmCountToParticles () {

  let particleCount = rhythmCount === 0 ? 0 : rhythmCount * 100
  return particleCount
}*/
