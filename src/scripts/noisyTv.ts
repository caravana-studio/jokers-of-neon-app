export const noisyTv = (time: number) => {
  var main = document.querySelector("main");
  var canvas: HTMLCanvasElement = document.getElementById(
    "canvas"
  ) as HTMLCanvasElement;
  var ctx = canvas.getContext("2d");
  var ww = window.innerWidth;
  var menu = document.querySelector(".menu");
  var ul = menu?.querySelector("ul");
  var count;

  if (ul) {
    count = ul?.childElementCount - 1;
  }
  var frame;

  // Set canvas size
  canvas.width = ww / 3;
  canvas.height = (ww * 0.5625) / 3;

  // Generate CRT noise
  function snow(ctx: CanvasRenderingContext2D) {
    var w = ctx.canvas.width,
      h = ctx.canvas.height,
      d = ctx.createImageData(w, h),
      b = new Uint32Array(d.data.buffer),
      len = b.length;

    for (var i = 0; i < len; i++) {
      b[i] = ((255 * Math.random()) | 0) << 24;
    }

    ctx.putImageData(d, 0, 0);
  }

  function animate() {
    if (ctx) {
      snow(ctx);
      frame = requestAnimationFrame(animate);
    }
  }

  setTimeout(function () {
    if (main) {
      main.classList.add("on");
      main.classList.remove("off");
      animate();
    }
  }, time);
};
