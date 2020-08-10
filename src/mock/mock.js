/**
 * 数据源 矩形 node
 */
import { uniqueId } from "@/anvtG6/utils";
export const blueNode = {
  id: "blue" + uniqueId(),
  name: "蓝色矩形",
  label: "蓝色矩形",
  size: "120*48",
  type: "node",
  x: 100,
  y: 100,
  shape: "customNode",
  color: "#1890ff", //左边的柱形蓝条颜色
  fillColor: "#e7f8ff", //填充色
  fillHoverColor: "#94D5FD", //选中和hover填充色
  strokeColor: "#6ab7ff", //边的颜色填充色
  inPoints: [
    [0, 0.5],
    [3, 0.5]
  ],
  outPoints: [
    [2, 0.5],
    [1, 0.5]
  ]
};
/**
 * 数据预处理 矩形 node
 */
export const greenNode = {
  id: "green" + uniqueId(),
  name: "绿色矩形",
  label: "绿色矩形",
  size: "120*48",
  type: "node",
  x: 100,
  y: 100,
  shape: "flow-rect",
  color: "#1890ff", //左边的柱形蓝条颜色
  inPoints: [
    [0, 0.5],
    [3, 0.5]
  ],
  outPoints: [
    [2, 0.5],
    [1, 0.5]
  ]
};
/**
 * 算法库 圆角矩形 node
 */
export const capsuleNode = {
  id: "zs" + uniqueId(),
  name: "紫色矩形",
  label: "紫色矩形",
  size: "120*48",
  type: "node",
  x: 100,
  y: 100,
  shape: "flow-capsule",
  color: "#1890ff", //左边的柱形蓝条颜色
  inPoints: [
    [0, 0.5],
    [3, 0.5]
  ],
  outPoints: [
    [2, 0.5],
    [1, 0.5]
  ]
};
/**
 * 算法库 椭圆 node
 */
export const ellipseNode = {
  id: "zs" + uniqueId(),
  label: ["矩形", "椭圆"],
  size: "120*48",
  type: "node",
  x: 100,
  y: 100,
  shape: "flow-rect-ellipse",
  color: "#1890ff", //左边的柱形蓝条颜色
  inPoints: [
    [0, 0.5],
    [3, 0.5]
  ],
  outPoints: [
    [2, 0.5],
    [1, 0.5]
  ]
};