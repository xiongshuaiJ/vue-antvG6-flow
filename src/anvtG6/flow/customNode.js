import G6 from "@antv/g6/build/g6";
import { uniqueId } from "../utils";
// import Shape from "@antv/g/src/shapes";
const customNode = {
  init() {
    // 定义基础 颜色，形状，尺寸
    let fillColor = "#f3f9ff"; //填充色
    let fillHoverColor = "#94D5FD"; //选中和hover填充色
    let strokeColor = "#6ab7ff"; //边的颜色
    let mainId = uniqueId(); //边的颜色
    G6.registerNode("customNode", {
      draw(cfg, group) {
        if (cfg.fillColor) {
          fillColor = cfg.fillColor;
        }
        if (cfg.fillHoverColor) {
          fillHoverColor = cfg.fillHoverColor;
        }
        if (cfg.strokeColor) {
          strokeColor = cfg.strokeColor;
        }
        if (cfg.id) {
          mainId = cfg.id;
        }
        let size = cfg.size;
        if (!size) {
          size = [120, 48];
        } else if (cfg.size.constructor === String) {
          size = size.split("*");
        }
        // 此处必须是NUMBER 不然bbox不正常
        const width = parseInt(size[0]);
        const height = parseInt(size[1]);
        // const color = cfg.color;
        // 此处必须有偏移 不然drag-node错位
        const offsetX = -width / 2;
        const offsetY = -height / 2;
        // const mainId = "rect" + uniqueId();
        const shape = group.addShape("rect", {
          attrs: {
            id: mainId,
            x: offsetX,
            y: offsetY,
            width: width,
            height: height,
            stroke: strokeColor,
            fill: fillColor, //此处必须有fill 不然不能触发事件
            radius: 4
          }
        });
        if (cfg.label) {
          group.addShape("text", {
            attrs: {
              id: "label" + uniqueId(),
              x: offsetX + (width / 2),
              y: offsetY + (height / 2),
              textAlign: "center",
              textBaseline: "middle",
              text: cfg.label,
              parent: mainId,
              fill: "#565758"
            }
          });
        }
        //进入的锚点
        if (cfg.inPoints) {
          for (let i = 0; i < cfg.inPoints.length; i++) {
            //0为顶 1为右 2为底 3为左
            let x, y;
            if (cfg.inPoints[i][0] === 0) {
              y = 0;
              x = width * cfg.inPoints[i][1];
              let id = "circle" + uniqueId();
              group.addShape("circle", {
                attrs: {
                  id: "circle" + uniqueId(),
                  parent: id,
                  x: x + offsetX, //0
                  y: y + offsetY, //负 高的一半
                  r: 10,
                  isInPointOut: true,
                  fill: "#1890ff",
                  opacity: 0
                }
              });
              group.addShape("circle", {
                attrs: {
                  id: id,
                  x: x + offsetX,
                  y: y + offsetY,
                  r: 3,
                  isInPoint: true,
                  label: cfg.label,
                  fill: "#fff",
                  stroke: "#1890ff",
                  opacity: 0
                }
              });
            } else if (cfg.inPoints[i][0] === 3) {
              y = height * cfg.inPoints[i][1];
              let id = "circl" + uniqueId();
              group.addShape("circle", {
                attrs: {
                  id: "circle" + uniqueId(),
                  parent: id,
                  x: offsetX, //负 宽的一半
                  y: y + offsetY, //0
                  r: 10,
                  isInPointOut: true,
                  fill: "#1890ff",
                  opacity: 0
                }
              });
              group.addShape("circle", {
                attrs: {
                  id: id,
                  x: offsetX,
                  y: y + offsetY,
                  r: 3,
                  isInPoint: true,
                  label: cfg.label,
                  fill: "#fff",
                  stroke: "#1890ff",
                  opacity: 0
                }
              });
            }
          }
        }
        //输出的锚点
        if (cfg.outPoints) {
          for (let i = 0; i < cfg.outPoints.length; i++) {
            let x, y;
            //0为顶 1为右 2为底 3为左
            if (cfg.outPoints[i][0] === 2) {
              //底部锚点
              y = height;
              x = width * cfg.outPoints[i][1];
              let id = "circle" + uniqueId();
              group.addShape("circle", {
                attrs: {
                  id: "circle" + uniqueId(),
                  parent: id,
                  x: x + offsetX,
                  y: y + offsetY,
                  r: 10,
                  isOutPointOut: true,
                  fill: "#1890ff",
                  opacity: 0//默認0 需要時改成0.3
                }
              });
              group.addShape("circle", {
                attrs: {
                  id: id,
                  x: x + offsetX,
                  y: y + offsetY,
                  r: 3,
                  isOutPoint: true,
                  fill: "#fff",
                  stroke: "#1890ff",
                  opacity: 0
                }
              });
            } else if (cfg.outPoints[i][0] === 1) {
              //右边锚点
              x = width * cfg.outPoints[i][1];
              let id = "circle" + uniqueId();
              group.addShape("circle", {
                attrs: {
                  id: "circle" + uniqueId(),
                  parent: id,
                  x: x, // width的正一半
                  y: 0,
                  r: 10,
                  isOutPointOut: true,
                  fill: "#1890ff",
                  opacity: 0//默認0 需要時改成0.3
                }
              });
              group.addShape("circle", {
                attrs: {
                  id: id,
                  x: x,
                  y: 0,
                  r: 3,
                  isOutPoint: true,
                  fill: "#fff",
                  stroke: "#1890ff",
                  opacity: 0
                }
              });
            }
            
          }
        }
        //group.sort()
        // 添加文本、更多图形
        return shape;
      },
      //设置状态
      setState(name, value, item) {
        const group = item.getContainer();
        const shape = group.get("children")[0]; // 顺序根据 draw 时确定

        const children = group.findAll(g => {
          return g._attrs.parent === shape._attrs.id;
        });
        const circles = group.findAll(circle => {
          return circle._attrs.isInPoint || circle._attrs.isOutPoint;
        });
        //鼠标hover和选中的样式
        const selectStyles = () => {
          shape.attr("fill", fillHoverColor);
          shape.attr("stroke", strokeColor);
          shape.attr("cursor", "move");
          children.forEach(child => {
            child.attr("cursor", "move");
          });
          circles.forEach(circle => {
            circle.attr("opacity", 1);
          });
        };
        //普通样式 （未选中的样式）
        const unSelectStyles = () => {
          shape.attr("fill", fillColor);
          shape.attr("stroke", strokeColor);
          circles.forEach(circle => {
            circle.attr("opacity", 0);
          });
        };
        switch (name) {
          case "selected":
          case "hover":
            if (value) {
              selectStyles();
            } else {
              unSelectStyles();
            }
            break;
        }
      }
    });
  }
};

export default customNode;
