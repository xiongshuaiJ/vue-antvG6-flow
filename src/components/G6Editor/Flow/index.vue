<template>
  <div />
</template>

<script>
import customNode from "@/anvtG6/flow/customNode";
import flowRect from "@/anvtG6/flow/flow-rect";
import flowCapsule from "@/anvtG6/flow/flow-capsule";
import flowEllipse from "@/anvtG6/flow/flow-ellipse";
import flowRectEllipse from "@/anvtG6/flow/flow-rect-ellipse";
import customEdge from "@/anvtG6/flow/customEdge";
import teamNode from "@/anvtG6/flow/teamNode";
export default {
  name: "Flow",
  data() {
    return {
      page: null
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      customNode.init();
      flowRect.init();
      flowRectEllipse.init();
      flowCapsule.init();
      flowEllipse.init();
      customEdge.init();
      teamNode.init();
    }
  }
};
</script>


