import { Filter } from "./Filters.js"
import { Lapiz } from "./Lapiz.js"

/** @type { HTMLCanvasElement} */
let canvas = document.getElementById('canvas')
/** @type {CanvasRenderingContext2D} */
let ctx = canvas.getContext('2d')
let canvasWidth = canvas.width
let canvasHeight = canvas.height

let mouseDown = false
let mousePos = 0

let lapiz = new Lapiz(ctx, 0, 0, 'black', 5)
let lapizSelected = true
let gomaSelected = false

let filtro = new Filter(ctx)

let penBtn = document.getElementById('pen-btn')
let eraserBtn = document.getElementById('eraser-btn')
let colorPicker = document.getElementById('color-picker')

let img = new Image()
let uploadImg = document.getElementById('upload-img')
let downloadButton = document.getElementById('download-button')
let downlink = document.getElementById('download-link')

/**obtener posision de mouse para dibujar */
function getMousePos(e) {
    let x = e.offsetX
    let y = e.offsetY
    return { x, y }
}

/**obtener color de fondo del canvas para usarlo con la goma */
function getCanvasBackground() {
    const computedStyle = window.getComputedStyle(canvas)
    const backgroundColor = computedStyle.backgroundColor
    return backgroundColor
}

/**seleccionar lapiz o goma y cambiar los estilos del botón según cual está activo */
function setTool(isLapiz, isGoma) {
    lapizSelected = isLapiz
    gomaSelected = isGoma

    if (lapizSelected) {   
        penBtn.classList.add('active')
        eraserBtn.classList.remove('active')
        lapiz.setColor(colorPicker.value)
        lapiz.setWidth(5)
    }
    if (gomaSelected) {
        penBtn.classList.remove('active')
        eraserBtn.classList.add('active')
        lapiz.setColor(getCanvasBackground())
        lapiz.setWidth(10)
    }
}
penBtn.addEventListener('click', ()=> setTool(true, false))
eraserBtn.addEventListener('click', ()=> setTool(false, true))

/**seleccionar color del lapiz */
document.getElementById('btn-color').addEventListener('input',()=>
    lapizSelected && lapiz.setColor(colorPicker.value)
)

/**eventos para dibujar */
canvas.addEventListener('mousedown', (e) => {
    mouseDown = true
    mousePos = getMousePos(e)
    lapiz.setPosition(mousePos.x, mousePos.y)
    lapiz.draw(mousePos.x, mousePos.y)
})
canvas.addEventListener('mousemove', (e) => {
    mousePos = getMousePos(e)
    if(mouseDown) {
        lapiz.draw(mousePos.x, mousePos.y)
    }
})
canvas.addEventListener('mouseup', () => {
    mouseDown = false
})

/**reiniciar canvas */
document.getElementById('clear-btn').addEventListener('click', () => 
    ctx.clearRect(0, 0, canvasWidth, canvasHeight)
)

/**cargar imagen desde archivo */
uploadImg.addEventListener('change', (e) => {
        let file = e.target.files[0]

        let fileReader = new FileReader()
        fileReader.readAsDataURL(file)

        fileReader.onload = (e) => {
            img.src = e.target.result
        }

        uploadImg.value=''
        
        img.onload = () => {
            drawImage(img)
        }
    }
)

/**dibujar imagen en el canvas */
function drawImage(img){
    let imageWidth = img.width
    let imageHeight = img.height

    const scale = Math.min(canvasWidth / imageWidth, canvasHeight / imageHeight)

    const newWidth = imageWidth * scale
    const newHeight = imageHeight * scale

    ctx.drawImage(
        img, (canvasWidth - newWidth) / 2, (canvasHeight - newHeight) / 2, newWidth, newHeight
    )
}

/**recargar la imagen eliminando filtros o dibujos */
document.getElementById('reload-image').addEventListener('click', () => drawImage(img))

/**descargar imagen */
downloadButton.addEventListener('click', ()=> {
    const dataURL = canvas.toDataURL('image/png')
    downlink.href = dataURL
    downlink.click()
})

/************     filtros  ****************/
document.getElementById('grey-scale-filter').addEventListener('click', () => filtro.greyScale())

document.getElementById('blur-filter').addEventListener('click', () => filtro.blur())

document.getElementById('negative-filter').addEventListener('click', () => filtro.negative())

document.getElementById('binarize-filter').addEventListener('click', () => filtro.binarize())

document.getElementById('sepia-filter').addEventListener('click', () => filtro.sepia())

document.getElementById('bright-filter').addEventListener('click', () => filtro.bright())

document.getElementById('edge-detection-filter').addEventListener('click', () => filtro.edgeDetection())

document.getElementById('saturation-filter').addEventListener('click', () => filtro.saturation())
