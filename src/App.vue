<script setup>
import G6 from '@antv/g6';
import { onMounted } from 'vue';
import data from '../scripts/dirData';
import registerNode from './registerNode'
let graph = null;
const initGraph = () => {
  const container = document.getElementById('graph');
  const width = container.scrollWidth;
  const height = container.scrollHeight || 600;
  return new G6.TreeGraph({
    container,
    width,
    height,
    // fitCenter: true,
    // fitViewPadding: 20,
    modes: {
      default: ['drag-canvas', 'zoom-canvas'],
    },
    defaultNode: {
      type: 'card-node',
    },
    defaultEdge: {
      type: 'cubic-horizontal',
      style: {
        endArrow: true,
      },
    },
    layout: {
      type: 'indented',
      direction: 'LR',
      dropCap: false,
      indent: 300,
      getHeight: () => {
        return 20;
      },
    },
  });
}


onMounted(() => {
  registerNode();
  graph = initGraph()
  graph.read(data);
  // graph.fitCenter();
  graph.fitView()
})
</script>

<template>
  <div id="graph" ></div>
</template>

<style scoped>
#graph {
  width: 100%;
  height: calc(100vh - 10px);
}
</style>
