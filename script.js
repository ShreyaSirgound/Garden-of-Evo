function getMousePos(canvas, e) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
}

function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
}

const canvas = document.getElementById('myCanvas')
const ctx = canvas.getContext('2d')

let myFont = new FontFace(
    "Pangolin",
    "url(https://fonts.gstatic.com/s/pangolin/v6/cY9GfjGcW0FPpi-tWMfN79z4i6BH.woff2)"
);

var firstAnimate = true
var gameTheme = new sound("music\\theme.mp3")
var giftOpenEff = new sound("music\\gift_open_effect.mp3")
var winEff = new sound("music\\winning_effect.mp3")

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
        ctx.fillStyle = 'rgba(255,0,0,0.0)'
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}

const giftCoors = [[340, 150], [10, 200], [150, 420], [640, 440], [540, 330], [910, 240], [800, 30]]
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
const giftImg = new Image()
const keyText = new Image()
const keyImg = new Image()
const winImg = new Image()

function loadImages() {
    var imgToLoad = 9, imgLoaded = 0;

    var onImgLoad = function()
    {
        imgLoaded++;
        if(imgLoaded == imgToLoad){ 
            animate();
            firstAnimate = false
        }   
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

    giftImg.src = 'assets\\giftbox.png'
    giftImg.onload = onImgLoad;

    keyText.src = 'assets\\key_text.png'
    keyText.onload = onImgLoad;

    keyImg.src = 'assets\\key.png'
    keyImg.onload = onImgLoad;

    winImg.src = 'assets\\winText.png'
    winImg.onload = onImgLoad;
}

class Sprite {
    constructor({position, image, sprites = {}}) {
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

class GiftSprite {
    constructor({position}) {
        this.position = position
        this.width = 36
        this.height = 45
        this.clipy = 0
        this.frames = 0
        this.opened = false
    }

    draw() {
        ctx.drawImage(
            giftImg,
            this.frames * this.width,
            0,
            this.width,
            this.height,
            this.position.x,
            this.position.y,
            this.width,
            this.height
        )
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

const gifts = []
for(let i = 0; i < giftCoors.length; i++){
    const giftbox = new GiftSprite({
        position: {
            x: giftCoors[i][0],
            y: giftCoors[i][1]
        }
    })
    gifts.push(giftbox)
}

var playWin = true

function animate() {
    console.log(firstAnimate)
    if (firstAnimate){
        gameTheme.play()
    }
    window.requestAnimationFrame(animate)
    ctx.drawImage(map, 0, 0)
    boundaries.forEach(boundary => {
        boundary.draw()
    })
    ctx.fillStyle = "#905920"
    ctx.fillRect(0, 0, 310, 60)
    ctx.fillStyle = "#D7C9AE"
    ctx.fillRect(5, 5, 300, 50)
    ctx.drawImage(keyText, 13, 13)
    keysCollected = 0
    keyCoor = 120
    gifts.forEach(gift => {
        gift.draw()
        if(gift.opened){
            ctx.drawImage(keyImg, keyCoor, 5)
            keyCoor += 25
            keysCollected++
        }
    })
    player.draw()

    if(keysCollected === 7){
        if(playWin){
            winEff.play()
            playWin = false
        }
        ctx.fillStyle = "#905920"
        ctx.fillRect(230, 130, 500, 280)
        ctx.fillStyle = "#D7C9AE"
        ctx.fillRect(235, 135, 490, 270)
        ctx.drawImage(winImg, 275, 165)

        canvas.addEventListener('click', (e) => {
            const mouse = {
              x: e.clientX - 155,
              y: e.clientY - 25
            }
            if (mouse.x > 235 && mouse.x < 725 && mouse.y > 135 && mouse.y < 405){
                window.location = "https://youtu.be/2gsMPL3dBfU?si=7yzdtfGAlLzaznxl"
            }
        });
        return
    }

    let moving = true
    player.moving = false
    giftPhrases = ["Click to open!", "You got a key!"]
    for (let i = 0; i < giftCoors.length; i++) {
        const gift = gifts[i]
        if (rectangularCollision({
            rect1: player,
            rect2: {...gift,
                position: {
                    x: gift.position.x,
                    y: gift.position.y
                }
            }})
        ) {
            myFont.load().then((font) => {
                document.fonts.add(font);
            
                ctx.font = '15px Pangolin';
                ctx.fillStyle = 'white';
                ctx.fillText(giftPhrases[gift.frames], gift.position.x - 25, gift.position.y);
            });

            if (gift.frames === 0){
                canvas.addEventListener('click', function(e) {
                    var mousePos = getMousePos(canvas, e);
                    if (mousePos.x > gift.position.x && mousePos.x < (gift.position.x + gift.width) && mousePos.y > gift.position.y && mousePos.y < (gift.position.y + gift.height)){
                        gift.frames = 1
                        giftOpenEff.play()
                        gift.opened = true
                    }
                }, false);
            }
            break
        }
    }

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
