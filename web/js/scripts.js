/**
 * 
 * @param {canvasElement} ctx 
 * @param {Array} points 
 * @param {boolean} isClosed 
 */
function myDrawContour(
    ctx,
    points,
    isClosed = false
)
{
    ctx.beginPath()

    points.slice(1).forEach(({ x, y }, prevIdx) =>
    {
        const from = points[prevIdx]
        ctx.moveTo(from.x, from.y)
        ctx.lineTo(x, y)
    })

    if (isClosed)
    {
        const from = points[points.length - 1]
        const to = points[0]
        if (!from || !to)
        {
            return
        }

        ctx.moveTo(from.x, from.y)
        ctx.lineTo(to.x, to.y)
    }

    ctx.stroke()
}

/**
 * 
 */
class MyFaceLandmarks
{
    constructor(positions)
    {
        this.positions = positions;
    }
    getJawOutline()
    {
        return this.positions.slice(0, 17)
    }

    getLeftEyeBrow()
    {
        return this.positions.slice(17, 22)
    }

    getRightEyeBrow()
    {
        return this.positions.slice(22, 27)
    }

    getNose()
    {
        return this.positions.slice(27, 36)
    }

    getLeftEye()
    {
        return this.positions.slice(36, 42)
    }

    getRightEye()
    {
        return this.positions.slice(42, 48)
    }

    getMouth()
    {
        return this.positions.slice(48, 68)
    }
}

/**
 * 
 */
class MyDrawFaceLandmarks
{
    constructor(faceLandmarks)
    {
        this.faceLandmarks = faceLandmarks
    }

    draw(ctx)
    {
        
        myDrawContour(ctx, this.faceLandmarks.getJawOutline())
        myDrawContour(ctx, this.faceLandmarks.getLeftEyeBrow())
        myDrawContour(ctx, this.faceLandmarks.getRightEyeBrow())
        myDrawContour(ctx, this.faceLandmarks.getNose())
        myDrawContour(ctx, this.faceLandmarks.getLeftEye(), true)
        myDrawContour(ctx, this.faceLandmarks.getRightEye(), true)
        myDrawContour(ctx, this.faceLandmarks.getMouth(), true)
    }
}