export const noisyTv = (time: number) => {
    var main = document.querySelector("main");
    var canvas: HTMLCanvasElement = document.getElementById(
      "canvas"
    ) as HTMLCanvasElement;
    var ctx = canvas.getContext("2d");
    var av1 = document.querySelector(".av1");
    var strk = document.querySelector(".strk");
    // var press = document.querySelector(".press");
    var ww = window.innerWidth;
    var menu = document.querySelector(".menu");
    var ul = menu?.querySelector("ul");
    var count;

    if (ul) {
      count = ul?.childElementCount - 1;
    }
    var toggle = true;
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

    // Glitch
    for (let i = 0; i < 4; i++) {
      if (av1?.firstElementChild) {
        var av1Span = av1.firstElementChild.cloneNode(true);
        av1.appendChild(av1Span);
      }
      if (strk?.firstElementChild) {
        var strkSpan = strk.firstElementChild.cloneNode(true);
        strk.appendChild(strkSpan);
      }
/*       if (press?.firstElementChild) {
        var pressSpan = press.firstElementChild.cloneNode(true);
        press.appendChild(pressSpan);
      } */
    }

    setTimeout(function () {
      if (main) {
        main.classList.add("on");
        main.classList.remove("off");
        animate();
      }
    }, time);
}