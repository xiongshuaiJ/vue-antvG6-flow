<template>
  <div class="detailpannel">
    <div>
      <div v-if="status=='node-selected'" class="pannel" id="node_detailpannel">
        <div class="pannel-title">模型详情</div>
        <div class="block-container">
          <el-row :gutter="10">
            <el-col :span="8">名称：</el-col>
            <el-col :span="16">
              <el-input v-model="node.label" @change="handleChangeName" />
            </el-col>
            <el-col :span="4">宽：</el-col>
            <el-col :span="8">
              <el-input v-model="size[0]" @change="handleChangeWidth" />
            </el-col>
            <el-col :span="4">高：</el-col>
            <el-col :span="8">
              <el-input v-model="size[1]" @change="handleChangeHeight" />
            </el-col>
          </el-row>
        </div>
      </div>
      <div v-if="status==='canvas-selected'" class="pannel" id="canvas_detailpannel">
        <div class="pannel-title">画布</div>
        <div class="block-container">
          <el-checkbox v-model="showGrid" @change="changeGridState">网格对齐</el-checkbox>
        </div>
      </div>
      <!-- <div v-if="status==='group-selected'" class="pannel" id="node_detailpannel">
        <div class="pannel-title">群组详情</div>
        <div class="block-container">
          <div class="p">
            名称：
            <el-input v-model="name" />
          </div>
          <div class="p">
            任意属性：
            <el-input v-model="color" />
          </div>
        </div>
      </div>
      -->
    </div>
  </div>
</template>

<script>
import eventBus from "@/anvtG6/utils/eventBus";
import Grid from "@antv/g6/build/grid";
export default {
  data() {
    return {
      status: "canvas-selected",
      showGrid: false,
      page: {},
      graph: {},
      item: {},
      node: {},
      grid: null,
      size: null
    };
  },
  created() {
    this.bindEvent();
  },
  beforeUpdate() {
    if (this.node) {
      this.node.label = this.node.label.toString();
    }
  },
  methods: {
    bindEvent() {
      let self = this;
      eventBus.$on("afterAddPage", page => {
        self.page = page;
        self.graph = self.page.graph;
        eventBus.$on("nodeselectchange", item => {
          if (item.select === true && item.target.getType() === "node") {
            self.status = "node-selected";
            self.item = item.target;
            self.node = item.target.getModel();
            self.node.label = self.node.label.toString();
            self.size = self.node.size.split("*");
          } else {
            self.status = "canvas-selected";
            self.item = null;
            self.node = null;
          }
        });
      });
    },
    handleChangeName(e) {
      //flow-rect-ellipse节点的label是数组，
      let arr = e.split(",");
      const model = {};
      if (arr.length > 1) {
        model.label = arr;
      } else {
        model.label = e;
      }
      this.graph.updateItem(this.item, model);
    },
    handleChangeWidth(e) {
      const model = {
        size: `${e} * ${this.size[1]}`
      };
      this.graph.updateItem(this.item, model);
    },
    handleChangeHeight(e) {
      const model = {
        size: `${this.size[0]} * ${e}`
      };
      this.graph.updateItem(this.item, model);
    },
    changeGridState(value) {
      if (value) {
        this.grid = new Grid();
        this.graph.addPlugin(this.grid);
      } else {
        this.graph.removePlugin(this.grid);
      }
    }
  }
};
</script>

<style scoped>
.detailpannel {
  height: 100%;
  position: absolute;
  right: 0px;
  z-index: 2;
  background: #f7f9fb;
  width: 200px;
  border-left: 1px solid #e6e9ed;
}
.detailpannel .block-container {
  padding: 16px 8px;
}
.block-container .el-col {
  height: 28px;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.pannel-title {
  height: 32px;
  border-top: 1px solid #dce3e8;
  border-bottom: 1px solid #dce3e8;
  background: #ebeef2;
  color: #000;
  line-height: 28px;
  padding-left: 12px;
}
</style>
