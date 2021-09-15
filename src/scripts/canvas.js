import { CanvasSpace, Create } from "pts";

const space = new CanvasSpace("#pts").setup({
  bgcolor: "#1c292e",
  resize: true,
  retina: true,
});
const form = space.getForm();

let pts = [];
let ratio = {};
let fraction;

const getRatio = (area) => {
  return {
    count: (area[0] * area[1]) / 17000,
    h: area[1],
    w: area[0],
  };
};

const getValue = (max, fraction) => {
  return max - max * fraction;
};

const getRGBValue = (fraction) => {
  return fraction * (255 - 50) + 50;
};

const getColor = (p, area) => {
  const red = getRGBValue(p[0] / area.w);
  const green = getRGBValue(p[1] / area.h);
  const blue = getRGBValue(p[0] / area.w);
  const opacity = 0.5;
  return `rgba(${red}, ${green}, ${blue}, ${opacity})`;
};

space.add({
  start: function (time, ftime) {
    ratio = getRatio(space.innerBound.size);
    pts = Create.distributeRandom(space.innerBound, ratio.count);
    console.log(pts);
  },
  animate: function (time, ftime) {
    if (space.pointer.id === "move" || space.pointer.id === "click") {
      pts.sort(
        (a, b) =>
          a.$subtract(space.pointer).magnitudeSq() -
          b.$subtract(space.pointer).magnitudeSq()
      );
    }
    pts.forEach((p, i) => {
      fraction = i / pts.length;
      form
        .fillOnly(getColor(p, ratio))
        .point(p, getValue(9, fraction), "square");
      p.rotate2D(0.0003 / fraction, space.pointer);
    });
  },
  action: function (type, x, y, event) {
    if (type == "click") {
      console.log(getColor(pts[1], ratio));
      pts[pts.length - 1] = space.pointer;
    }
  },
  resize: function (size, event) {
    ratio = getRatio(space.innerBound.size);
    pts = Create.distributeRandom(space.innerBound, ratio.count);
  },
});

space.bindMouse().bindTouch().play();
