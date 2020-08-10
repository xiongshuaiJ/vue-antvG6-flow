<template>
  <div id="mountNode" :style="{width:width}">
    <div class="editor">
      <context-menu />
      <!--toolbar-->
      <toolbar />
      <div style="height: 42px;"></div>
      <el-button class="add_node1" type="primary" size="mini" @click="handleClick1">蓝色矩形</el-button>
      <el-button class="add_node2" type="primary" size="mini" @click="handleClick2">绿色矩形</el-button>
      <el-button class="add_node3" type="primary" size="mini" @click="handleClick3">紫色矩形</el-button>
      <el-button class="add_node4" type="primary" size="mini" @click="handleClick4">紫色椭圆</el-button>
      <div class="bottom-container">
        <!--itempannel-->
        <item-panel />
        <!--detailpannel-->
        <detail-panel />
        <!--miniMap-->
        <minimap />
        <!--page-->
        <!-- <page :height="height" :width="width" :data="data" /> -->
        <div class="page">
          <div id="graph-container" class="graph-container" ref="flow" style="position: relative;"></div>
        </div>
      </div>
    </div>
    <Flow />
  </div>
</template>

<script>
import Toolbar from "./Toolbar";
import ItemPanel from "./ItemPanel";
import DetailPanel from "./DetailPanel";
import Minimap from "./Minimap";
// import Page from "./Page";
import Flow from "./Flow";
import ContextMenu from "./ContextMenu";
import Editor from "@/anvtG6/Base/Editor";
import command from "@/anvtG6/command";
import eventBus from "@/anvtG6/utils/eventBus";
import { initBehavors } from "@/anvtG6/behavior";
import G6 from "@antv/g6/build/g6";
import { blueNode, greenNode, capsuleNode, ellipseNode } from "@/mock/mock";
export default {
  name: "G6Editor",
  components: {
    Toolbar,
    ItemPanel,
    DetailPanel,
    Minimap,
    ContextMenu,
    Flow
  },
  props: {
    height: {
      type: Number,
      default: document.documentElement.clientHeight
    },
    width: {
      type: Number,
      default: document.documentElement.clientWidth
    },
    data: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    blueNode() {
      return blueNode;
    },
    greenNode() {
      return greenNode;
    },
    capsuleNode() {
      return capsuleNode;
    },
    ellipseNode() {
      return ellipseNode;
    },
  },
  created() {
    initBehavors();
    this.init();
    this.bindEvent();
  },
  data() {
    return {
      editor: {},
      command: null,
      graph: null
    };
  },
  mounted() {
    this.initPage();
    this.$nextTick(() => {
      this.initListener();
    });
  },
  methods: {
    init() {
      this.editor = new Editor();
      this.command = new command(this.editor);
    },
    initPage() {
      const height = this.height - 42;
      const width = this.width - 400;

      this.graph = new G6.Graph({
        container: "graph-container",
        height: height,
        width: width,
        modes: {
          // 支持的 behavior
          default: [
            "drag-canvas",
            "zoom-canvas",
            "hover-node",
            "select-node",
            "hover-edge",
            "keyboard",
            "customer-events",
            "add-menu"
          ],
          mulitSelect: ["mulit-select"],
          addEdge: ["add-edge"],
          moveNode: ["drag-item"]
        }
      });
      this.editor.emit("afterAddPage", {
        graph: this.graph,
        command: this.command
      });

      this.readData();
    },
    readData() {
      let data = this.data;
      if (data) {
        this.graph.read(data);
      }
    },
    initListener() {
      this.graph = this.editor.getGrpah();
      // eslint-disable-next-line no-console
      // console.log(this.graph);
      // this.graph.on("edge:mouseup", e => {
      //   // eslint-disable-next-line no-console
      //   console.log(e);
      // });
    },
    bindEvent() {
      // let self = this;
      eventBus.$on("edgeonMouseup", e => {
        // eslint-disable-next-line no-console
        console.log(e);
        // eslint-disable-next-line no-console
        console.log(e.target._attrs);
      });
    },
    // 蓝色
    handleClick1() {
      // eslint-disable-next-line no-console
      let params = { ...blueNode };
      this.graph.add("node", params);
    },
    // 绿色
    handleClick2() {
      // eslint-disable-next-line no-console
      let params = { ...greenNode };
      this.graph.add("node", params);
    },
    // 紫色
    handleClick3() {
      // eslint-disable-next-line no-console
      let params = { ...capsuleNode };
      this.graph.add("node", params);
    },
    // 紫色椭圆
    handleClick4() {
      // eslint-disable-next-line no-console
      let params = { ...ellipseNode };
      this.graph.add("node", params);
    },
  }
};
</script>

<style scoped>
.editor {
  position: relative;
  width: 100%;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
}
.add_node1 {
  position: absolute;
  z-index: 10;
  left: 30px;
  top: 230px;
}
.add_node2 {
  position: absolute;
  z-index: 10;
  left: 30px;
  top: 270px;
}
.add_node3 {
  position: absolute;
  z-index: 10;
  left: 30px;
  top: 310px;
}
.add_node4 {
  position: absolute;
  z-index: 10;
  left: 30px;
  top: 350px;
}
.bottom-container {
  position: relative;
}
.page {
  margin-left: 200px;
  margin-right: 200px;
}
</style>