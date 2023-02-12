import G6 from "@antv/g6";
const getWidth = (text, font = "normal 14px Arial") => {
  //复用canvas提升性能
  let canvas =
    getWidth.canvas || (getWidth.canvas = document.createElement("canvas"));
  var context = canvas.getContext("2d");
  context.font = font;
  let metrics = context.measureText(text);
  return Math.ceil(metrics.width);
};
const extToIcon = {
  gitignore: "\ue799",
  html:"\ue68c",
  css:"\ue653",
  vue:"\ue79a",
  dir: "\ueac5",
  yml: "\ue607",
  md:"\ue672",
  ts:"\ue6a3",
  js:"\uebd8",
  json:"\ue618",
  unknown: "\ue858",
}
const extColors = {
  gitignore: "#E73F1D",
  html:"#DF6E3C",
  css:"#9876B4",
  vue:"#2FAE7B",
  dir: "#0093DE",
  yml: "#849AA4",
  md:"#2D9EF0",
  ts:"#5B8FF9",
  js:"#FFC038",
  json:"#7EB94C",
  unknown: "#5B8FF9",
}
export default function registerNode() {
  G6.registerNode("card-node", {
    draw: function drawShape(cfg, group) {
      const { name, children, ftype } = cfg;
      const ext = Object.keys(extToIcon).includes(ftype) ? ftype : "unknown";
      const r = 2;
      const color = "#5B8FF9";
      const w = getWidth(name) + 30 + (children?.length ? 20 : 0);
      const h = 30;
      const shape = group.addShape("rect", {
        attrs: {
          x: -w / 2,
          y: -h / 2,
          width: w, //200,
          height: h, // 60
          stroke: extColors[ext],
          radius: r,
          fill: "#fff",
        },
        name: "main-box",
        draggable: true,
      });

      group.addShape("rect", {
        attrs: {
          x: -w / 2,
          y: -h / 2,
          width: h, //200,
          height: h, // 60
          radius: [r, r, 0, 0],
        },
        name: "title-box",
        draggable: true,
      });

      // icon text
      group.addShape("text", {
        attrs: {
          x: -w / 2 +16,
          y: -h / 2 + 8,
          lineHeight: 20,
          fontFamily: "iconfont",
          textAlign: "center",
          textBaseline: "top",
          text: extToIcon[ext],
          fontSize: 14,
          fill: extColors[ext], //字体图标颜色
        },
        name: "title",
      });
      cfg.children &&
        group.addShape("marker", {
          attrs: {
            x: w / 2,
            y: 0,
            r: 6,
            cursor: "pointer",
            symbol: G6.Marker.collapse,
            stroke: "#666",
            lineWidth: 1,
            fill: "#fff",
          },
          name: "collapse-icon",
        });
      group.addShape("text", {
        attrs: {
          textBaseline: "top",
          x: -(w - 30) / 2 + 16,
          y: -h / 2 + 8,
          lineHeight: 20,
          text: cfg.name,
          fill: "rgba(0,0,0, 1)",
        },
        name: `description`,
      });
      return shape;
    },
    setState(name, value, item) {
      if (name === "collapsed") {
        const marker = item
          .get("group")
          .find((ele) => ele.get("name") === "collapse-icon");
        const icon = value ? G6.Marker.expand : G6.Marker.collapse;
        marker.attr("symbol", icon);
      }
    },
  });
}
