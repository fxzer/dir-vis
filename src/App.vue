<script setup>
import G6 from '@antv/g6';
import * as echarts from 'echarts';
import { onMounted } from 'vue';
import registerNode from './registerNode'
import  getDirData from './getDirData'
import { ref, watch  } from 'vue'
let graph = null;
let container = null;
const graphType = ref('缩进树图')
const treemapOption = {
  series: [
    {
      type: 'treemap',
      id: 'echarts-package-size',
      animationDurationUpdate: 1000,
      roam: false,
      nodeClick: undefined,
      data: [],
      universalTransition: true,
      label: {
        show: true
      },
      breadcrumb: {
        show: false
      }
    }
  ]
};
const sunburstOption = {
  series: [
    {
      type: 'sunburst',
      id: 'echarts-package-size',
      radius: ['20%', '90%'],
      animationDurationUpdate: 1000,
      nodeClick: undefined,
      data: [],
      universalTransition: true,
      itemStyle: {
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,.5)'
      },
      label: {
        show: false,
      }
    }
  ]
};
const initGraph = () => {
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
const directoryData = {
  id: 'root',
  name: '',
  children: []
}
//监听图类型变化
watch(graphType, (val,oldVal) => {
    oldVal =='缩进树图' ? graph?.destroy():graph?.dispose()
    if(directoryData.children.length) graphTypeMap[val]()
})


const onSelectDir = async () => {
  const dirHandle = await window.showDirectoryPicker()
  await getDirData(dirHandle, directoryData)
  graphTypeMap[graphType.value]()
}
const treeGraphDraw = () =>{
  graph = initGraph()
  graph.read(directoryData);
  graph.fitView()
}
const echartDraw = (option) =>{
  return () =>{
    graph = null
    graph = echarts.init(container);
    option.series[0].data = directoryData.children
    graph.setOption(option)
  }
  
}
//图形类型对应的策略
const graphTypeMap = {
  '缩进树图': treeGraphDraw,
  '矩形树图': echartDraw(treemapOption),
  '旭日图':  echartDraw(sunburstOption)
}
//注册节点,初始化图
onMounted(() => {
  registerNode();
  container = document.getElementById('graph');
})

</script>

<template>
  <div class="wrap">
    <div id="graph" ></div>
    <div class="opts-wrap">
      <button @click="onSelectDir" class="select-btn">选择文件夹</button>
      <input type="radio" id="缩进树图" value="缩进树图" v-model="graphType" />
      <label for="缩进树图">缩进树图</label>
      <input type="radio" id="矩形树图" value="矩形树图" v-model="graphType" />
      <label for="矩形树图">矩形树图</label>
      <input type="radio" id="旭日图" value="旭日图" v-model="graphType" />
      <label for="旭日图">旭日图</label>
    </div>

  </div>
</template>

<style scoped  >
#graph,#graph {
  width: 100%;
  height: calc(100vh - 10px);
  position: relative;
}

.opts-wrap {
  position: absolute;
  top: 10px;
  left: 0;
  right: 0;
  margin: 0 auto;
  width: 380px;
  text-align: center;
}

.select-btn {
  padding: 4px 10px;
  outline: none;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;
}

label {
  margin-right: 5px;
}
</style>
