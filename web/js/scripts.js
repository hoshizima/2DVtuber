//各要素を取得
const loader = document.getElementById('loader');
const videosizeslider = document.getElementById('videosizeslider');
const loadingimg = document.getElementById('loadingimg');
const imgsizeslider = document.getElementById('imgsizeslider');
const maincontents = document.getElementById('maincontents');
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx2d = canvas.getContext('2d');
const relativepositionX = document.getElementById('relativepositionX');
const relativepositionY = document.getElementById('relativepositionY');
//
const img = new Image();
let fileReader = new FileReader();
//
let imgsizeratio = 1.00;

/**
 * ローディング表示を除去します。
 */
function removeLoadingScene()                                                                                                                                                                                                                                                                                                                                                                                                                                               
{
    //ビデオ要素をCanvasの後ろへ移動
    video.style.zIndex = "0";
    //高さ調整
    maincontents.style.height = canvas.height + "px";
    //ローディング画面を除去
    loader.remove();
}
/**
 * カメラからの入力映像を隠します。
 */
function displayChange()
{
    if (document.settings.hidevideo.checked)
    {
        canvas.style.backgroundColor = "rgba(255,255,2550,0)";
        videosizeslider.setAttribute("disable", true);

    }
    else
    {
        canvas.style.backgroundColor = "rgba(255,255,2550,1)";
    }
}
/**
 * カメラ映像のサイズを調整します。
 */
function videoSizeChange()
{
    video.style.width = videosizeslider.value + "%";
}

function changeImage()
{
    fileReader.onload = (function (){
        img.src = fileReader.result;
    });
    fileReader.readAsDataURL(obj.files[0]);
}

/**
 * 画像を中央に固定します。
 */
function imgPositionLock()
{
    if (document.settings.lockimgposition.checked)
    {
        canvas.style.backgroundColor = "rgba(255,255,2550,0)";
        videosizeslider.setAttribute("disable", true);

    }
    else
    {
        canvas.style.backgroundColor = "rgba(255,255,2550,1)";
    }
}

/**
 * 画像のサイズを調整します。
 */
function imgSizeChange()
{
    imgsizeratio = imgsizeslider.value / 100;
}

function adjustPositions()
{
    
}

/**
 * 座標とキャンバスコンテキストを受け取り線を描画する。
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
    ctx.beginPath();

    points.slice(1).forEach(({ x, y }, prevIdx) =>
    {
        const from = points[prevIdx];
        ctx.moveTo(from._x, from._y);
        ctx.lineTo(x, y);
    })

    if (isClosed)
    {
        const from = points[points.length - 1];
        const to = points[0];
        if (!from || !to)
        {
            return;
        }

        ctx.moveTo(from._x, from._y);
        ctx.lineTo(to._x, to._y);
    }

    ctx.stroke();
}

/**
 * 顔パーツの座標を切り取る際に利用する。
 */
class MyFaceLandmarks
{
    constructor(positions)
    {
        this.positions = positions;
    }
    getJawOutline()
    {
        return this.positions.slice(0, 17);
    }

    getLeftEyeBrow()
    {
        return this.positions.slice(17, 22);
    }

    getRightEyeBrow()
    {
        return this.positions.slice(22, 27);
    }

    getNose()
    {
        return this.positions.slice(27, 36);
    }

    getLeftEye()
    {
        return this.positions.slice(36, 42);
    }

    getRightEye()
    {
        return this.positions.slice(42, 48);
    }

    getMouth()
    {
        return this.positions.slice(48, 68);
    }
}

/**
 * キャンバスへ顔を描画する。
 * 
 */
class MyDrawFaceLandmarks
{
    constructor(faceLandmarks)
    {
        this.faceLandmarks = new MyFaceLandmarks(faceLandmarks);
    }

    draw(ctx)
    {
        //myDrawContour(ctx, this.faceLandmarks.getJawOutline());
        myDrawContour(ctx, this.faceLandmarks.getLeftEyeBrow());
        myDrawContour(ctx, this.faceLandmarks.getRightEyeBrow());
        myDrawContour(ctx, this.faceLandmarks.getNose());
        myDrawContour(ctx, this.faceLandmarks.getLeftEye(), true);
        myDrawContour(ctx, this.faceLandmarks.getRightEye(), true);
        myDrawContour(ctx, this.faceLandmarks.getMouth(), true);
    }
}


async function onPlay()
{
    img.src = 'img/unchi.png';
    const result = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks();

    if (result)
    {
        const dims = faceapi.matchDimensions(canvas, video, true);
        const resizedResults = faceapi.resizeResults(result, dims);
        const resizedResultsBox = resizedResults['alignedRect']['_box'];
        
        //初期化処理は別で一回実行でよいのでは
        
        removeLoadingScene();
        //canvas初期化
        ctx2d.fillStyle = 'rgb(255,255,255)';
        ctx2d.fillRect(0, 0, ctx2d.width, ctx2d.height);
        //画像を描画
        ctx2d.drawImage(img, resizedResultsBox['x'], resizedResultsBox['y'], resizedResultsBox['width']*imgsizeratio, resizedResultsBox['height']*imgsizeratio);
        //顔を描画
        await new MyDrawFaceLandmarks(resizedResults['landmarks']['_positions']).draw(ctx2d);
    }
    setTimeout(() => onPlay());
}

async function run()
{
    // load face detection and face landmark models
    await faceapi.nets.tinyFaceDetector.load("models/");
    await faceapi.nets.faceLandmark68Net.load("models/");
    // try to access users webcam and stream the images
    // to the video element
    const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
    video.srcObject = stream;
}

document.addEventListener('DOMContentLoaded', function ()
{
    run();
})