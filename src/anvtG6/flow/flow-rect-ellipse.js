import G6 from "@antv/g6/build/g6";
import { uniqueId } from "../utils";
import _ from "lodash";
// import Shape from "@antv/g/src/shapes";
const customNode = {
  init() {
    // 定义基础 颜色，形状，尺寸
    let fillColor = "#f7effd"; //填充色
    let fillHoverColor = "#d2aef5"; //选中和hover填充色
    let strokeColor = "#7b3ad5"; //边的颜色
    let mainId = uniqueId(); //边的颜色
    G6.registerNode("flow-rect-ellipse", {
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
        /**
         * 1、画个蓝色矩形 
         * 2、画一条线加个箭头
         * 3、画一个椭圆 
         * 4、蓝色矩形 没有出的锚点，椭圆 没有进的锚点
         */
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
        if (_.isArray(cfg.label)) {
          group.addShape("text", {
            attrs: {
              id: "label" + uniqueId(),
              x: offsetX + (width / 2),
              y: offsetY + (height / 2),
              textAlign: "center",
              textBaseline: "middle",
              text: cfg.label[0],
              parent: mainId,
              fill: "#565758"
            }
          });
        }
        /**
         * 第二步  画线和箭头  将矩形和椭圆连接上
         */
        const DISTANCE = 200; //矩形与椭圆之间的距离 DISTANCE
        let lineWidth = 1;
        const MIN_ARROW_SIZE = 3;
        lineWidth = lineWidth > MIN_ARROW_SIZE ? lineWidth : MIN_ARROW_SIZE;
        const arrowWidth = lineWidth * 10 / 3;
        const halfHeight = lineWidth * 4 / 3;
        const radius = lineWidth * 4;
        const endArrowPath = [
          ["M", -arrowWidth, halfHeight],
          ["L", 0, 0],
          ["L", -arrowWidth, -halfHeight],
          ["A", radius, radius, 0, 0, 1, -arrowWidth, halfHeight],
          ["Z"]
        ];
        let start = {
          x: offsetX + width,
          y: offsetY + (height / 2),
        };
        let end = {
          x: offsetX + DISTANCE,
          y: offsetY + (height / 2),
        };
        const linePath = [
          ["M", start.x, start.y], // 横坐标 和 纵坐标
          // ["L", (end.x / 3) + (2 / 3 * start.x), start.y], 
          // ["L", (end.x / 3) + (2 / 3 * start.x), end.y], 
          [
            "L",
            end.x,
            end.y
          ]
        ];
        group.addShape("path", {
          attrs: {
            id: "edge" + uniqueId(),
            path: linePath,
            stroke: "#b8c3ce",
            lineAppendWidth: 10,
            endArrow: {
              path: endArrowPath,
            }
          }
        });
        /**
         *第三步  画椭圆
         */
        group.addShape("ellipse", {
          attrs: {
            id: mainId,
            x: offsetX + DISTANCE + (width / 2),
            y: offsetY + (height / 2),
            rx: width / 2,
            ry: height / 2,
            stroke: strokeColor,
            fill: fillColor, //此处必须有fill 不然不能触发事件
          }
        });
        if (_.isArray(cfg.label)) {
          group.addShape("text", {
            attrs: {
              id: "label" + uniqueId(),
              x: offsetX + DISTANCE + (width / 2),
              y: offsetY + (height / 2),
              textAlign: "center",
              textBaseline: "middle",
              text: cfg.label[1],
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
        //输出的锚点  放在椭圆上
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
                  x: x + offsetX + DISTANCE,
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
                  x: x + offsetX + DISTANCE,
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
                  x: x + offsetX + DISTANCE + (width * 0.5), // width
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
                  x: x + offsetX + DISTANCE + (width * 0.5),
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
        const shapeEllipse = group.get("children")[3]; // 顺序根据 draw 时确定

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
          shapeEllipse.attr("fill", fillHoverColor);
          shapeEllipse.attr("stroke", strokeColor);
          shapeEllipse.attr("cursor", "move");
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
          shapeEllipse.attr("fill", fillColor);
          shapeEllipse.attr("stroke", strokeColor);
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
