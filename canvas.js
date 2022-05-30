window.addEventListener("load",()=>{
    const canvas = document.querySelector("#canvas");
    const ctx = canvas.getContext("2d");

    //resizing
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;

    //variables
    let painting = false;

    function startPosition(e){
        painting=true;
        draw(e);
    }

    function endPosition(){
        painting=false;
        ctx.beginPath();
    }

    function draw(e){
        if(!painting){
            return;
        }

        ctx.lineWidth = 10;
        ctx.lineCap = "round";

        
        ctx.lineTo(e.clientX,e.clientY);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(e.clientX,e.clientY);
    }
    //Event listeners
    canvas.addEventListener("mousedown",startPosition);
    canvas.addEventListener("mouseup",endPosition);
    canvas.addEventListener("mousemove",draw);

});

window.addEventListener("resize", ()=>{
    const canvas = document.querySelector("#canvas");

    //resizing
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;

});

//TODO implemt canvas rezise

function clearcanvas()
{
    var canvas = document.querySelector("#canvas"),
        ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

document.getElementById('download').addEventListener('click', function(e) {
    var canvas = document.querySelector("#canvas");
    console.log(canvas.toDataURL());
    const link = document.createElement('a');
    link.download = 'download.png';
    link.href = canvas.toDataURL();
    link.click();
    link.delete;
  });