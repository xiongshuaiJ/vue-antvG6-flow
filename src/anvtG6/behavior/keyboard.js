// import eventBus from "../utils/eventBus";
export default {
  getDefaultCfg() {
    return {
      backKeyCode: 8,
      deleteKeyCode: 46
    };
  },
  getEvents() {
    return {
      keyup: "onKeyUp",
      keydown: "onKeyDown"
    };
  },
  /**
   * 按下del 或 backspace 删除节点会有bug，在编辑属性的时候，如果按了，会将节点删除，
   * 后面换成 组合键 删除
   */
  onKeyDown(e) {
    const code = e.keyCode || e.which;
    switch (code) {
      case this.deleteKeyCode:
      case this.backKeyCode:
        // eventBus.$emit("deleteItem");
        break;
    }
  },
  onKeyUp() {
    this.keydown = false;
  }
};
