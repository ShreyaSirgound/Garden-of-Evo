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
const playerFront = new Image()
const playerBack = new Image()
const playerLeft = new Image()
const playerRight = new Image()

function loadImages() {
    var imgToLoad = 5, imgLoaded = 0;

    var onImgLoad = function()
    {
        imgLoaded++;
        if(imgLoaded == imgToLoad)
            animate();
    };

    map.src = 'assets\\map.png';
    map.onload = onImgLoad;

    playerFront.src = 'assets\\sprite-assets\\walk-front.png';
    playerFront.onload = onImgLoad;

    playerBack.src = 'assets\\sprite-assets\\walk-back.png'
    playerBack.onload = onImgLoad;

    playerLeft.src = 'assets\\sprite-assets\\walk-left.png'
    playerLeft.onload = onImgLoad;

    playerRight.src = 'assets\\sprite-assets\\walk-right.png'
    playerRight.onload = onImgLoad;

}

class Sprite {
    constructor({position, velocity, image, sprites = {}}) {
        this.position = position
        this.image = image
        this.width = 32
        this.height = 51
        this.frames = 0
        this.elapsed = 0
        this.moving = false
        this.sprites = sprites
    }

    draw() {
        ctx.drawImage(
            this.image,
            this.frames * 64,
            0,
            (this.image.width / 8) - 32,
            this.image.height,
            this.position.x,
            this.position.y,
            (this.image.width / 8) - 32,
            this.image.height
        )

        if (this.moving){
            this.elapsed++
            if (this.elapsed % 10 === 0){
                if (this.frames < 7){
                    this.frames++
                } else {
                    this.frames = 0
                }
            }
        }
    }
}

const player = new Sprite({
    position: {
        x: canvas.width / 4,
        y: canvas.height / 3
    },
    image: playerFront,
    sprites: {
        front: playerFront,
        back: playerBack,
        left: playerLeft,
        right: playerRight
    }
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
    })
    player.draw()

    let moving = true
    player.moving = false
    if (keys.ArrowUp.pressed) {
        player.moving = true
        player.image = player.sprites.back
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (rectangularCollision({
                rect1: player,
                rect2: {...boundary,
                    position: {
                        x: boundary.position.x,
                        y: boundary.position.y + 1
                    }
                }})
            ) {
                moving = false
                break
            }
        }
        if (moving){
            player.position.y -= 1
        }
    }
    if (keys.ArrowDown.pressed) {
        player.moving = true
        player.image = player.sprites.front
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (rectangularCollision({
                rect1: player,
                rect2: {...boundary,
                    position: {
                        x: boundary.position.x,
                        y: boundary.position.y - 1
                    }
                }})
            ) {
                moving = false
                break
            }
        }
        if (moving){
            player.position.y += 1
        }
    }
    if (keys.ArrowLeft.pressed) {
        player.moving = true
        player.image = player.sprites.left
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (rectangularCollision({
                rect1: player,
                rect2: {...boundary,
                    position: {
                        x: boundary.position.x + 1,
                        y: boundary.position.y
                    }
                }})
            ) {
                moving = false
                break
            }
        }
        if (moving){
            player.position.x -= 1
        }
    }
    if (keys.ArrowRight.pressed) {
        player.moving = true
        player.image = player.sprites.right
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (rectangularCollision({
                rect1: player,
                rect2: {...boundary,
                    position: {
                        x: boundary.position.x - 1,
                        y: boundary.position.y
                    }
                }})
            ) {
                moving = false
                break
            }
        }
        if (moving){
            player.position.x += 1
        }
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
