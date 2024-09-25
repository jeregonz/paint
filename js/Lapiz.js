export class Lapiz {
    
    constructor(ctx, x, y, color, width) {
        this.ctx = ctx
        this.x = x
        this.y = y
        this.ctx.strokeStyle = color
        this.ctx.lineWidth = width
        this.ctx.lineCap = 'round'
    }

    setPosition(newX, newY) {
        this.x = newX
        this.y = newY
    }

    setWidth(newWidth){
        this.ctx.lineWidth = newWidth
    }

    setColor(newColor){
        this.ctx.strokeStyle = newColor
    }

    draw(x, y) {
        this.ctx.beginPath()
        this.ctx.moveTo(this.x, this.y)
        this.ctx.lineTo(x, y)
        this.ctx.stroke()
        this.setPosition(x, y)

    }

}
