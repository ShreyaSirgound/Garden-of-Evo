const canvas = document.getElementById('myCanvas')
const ctx = canvas.getContext('2d')

const collisionsMap = []
for (let i = 0; i < collisions.length; i += 80) {
    collisionsMap.push(collisions.slice(i, 80 + i))
}

class Boundary {
    static width = 12
    static height = 12
    constructor({position}) {
        this.position = position
        this.width = 12
        this.height = 12
    }

    draw() {
        ctx.fillStyle = 'red'
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}

const boundaries = []

collisionsMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 3601) {
            boundaries.push(
                new Boundary({
                    position: {
                        x: j * Boundary.width,
                        y: i * Boundary.height
                    }
                })
            )
        }
    })
})

const map = new Image()
const playerImg = new Image()

function loadImages() {
    var imgToLoad = 2, imgLoaded = 0;

    var onImgLoad = function()
    {
        imgLoaded++;
        if(imgLoaded == imgToLoad)
            animate();
    };

    map.src = 'assets\\map.png';
    map.onload = onImgLoad;

    playerImg.src = 'assets\\sprite-assets\\walk-front.png';
    playerImg.onload = onImgLoad;
}

class Sprite {
    constructor({position, velocity, image}) {
        this.position = position
        this.image = image
        this.width = 61
        this.height = 55
    }

    draw() {
        ctx.drawImage(
            playerImg,
            0,
            0,
            playerImg.width / 9,
            playerImg.height,
            this.position.x,
            this.position.y,
            playerImg.width / 9,
            playerImg.height
        )
    }
}

const player = new Sprite({
    position: {
        x: canvas.width / 4,
        y: canvas.height / 3
    },
    image: playerImg
})

const keys = {
    ArrowUp: {
        pressed: false
    },
    ArrowDown: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    }
}

function rectangularCollision({rect1, rect2}) {
    return (
        rect1.position.x + rect1.width >= rect2.position.x &&
        rect1.position.x <= rect2.position.x + rect2.width &&
        rect1.position.y <= rect2.position.y + rect2.height &&
        rect1.position.y + rect1.height >= rect2.position.y
    )
}

function animate() {
    window.requestAnimationFrame(animate)
    ctx.drawImage(map, 0, 0)
    boundaries.forEach(boundary => {
        boundary.draw()

        if (rectangularCollision({
            rect1: player,
            rect2: boundary
        }))
        console.log("colliding")
    })
    player.draw()

    if (keys.ArrowUp.pressed) {
        player.position.y -= 1
    }
    if (keys.ArrowDown.pressed) {
        player.position.y += 1
    }
    if (keys.ArrowLeft.pressed) {
        player.position.x -= 1
    }
    if (keys.ArrowRight.pressed) {
        player.position.x += 1
    }
}

loadImages()

window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp':
            keys.ArrowUp.pressed = true
            break
        case 'ArrowDown':
            keys.ArrowDown.pressed = true
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true
            break
        case 'ArrowRight':
            keys.ArrowRight.pressed = true
            break
    }
})

window.addEventListener('keyup', (e) => {
    switch (e.key) {
        case 'ArrowUp':
            keys.ArrowUp.pressed = false
            break
        case 'ArrowDown':
            keys.ArrowDown.pressed = false
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break
    }
})
