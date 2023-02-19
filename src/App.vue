<script setup>
import G6 from '@antv/g6';
import * as echarts from 'echarts';
import { onMounted } from 'vue';
import registerNode from './registerNode'
import { ref, watch ,nextTick } from 'vue'
let agraph = null;
let egraph = null;
let acontainer = null;
let econtainer = null;
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
  const width = acontainer.scrollWidth;
  const height = acontainer.scrollHeight || 600;
  return new G6.TreeGraph({
    container:acontainer,
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

//监听图类型变化
watch(graphType, (val) => {
  graphTypeMap[val]()
})
//生成随机id
const randomId = (count = 8) => {
  return Math.random()
    .toString(36)
    .substring(2, 2 + count);
};
const directoryData = {
  id: randomId(),
  name: '',
  children: []
}
const onSelectDir = async () => {
  const dirHandle = await window.showDirectoryPicker()
  await getDirData(dirHandle, directoryData)
  graphTypeMap[graphType.value]()
}
//图形类型对应的策略
const graphTypeMap = {
  '缩进树图': () => {
    agraph.read(directoryData);
    // agraph.fitView()
  },
  '矩形树图': () => {
    treemapOption.series[0].data = directoryData.children
    egraph.setOption(treemapOption)
  },
  '旭日图': () => {
    sunburstOption.series[0].data = directoryData.children
    egraph.setOption(sunburstOption)
  }
}
/*递归获取文件夹下的所有文件, 并生成树状结构 
 {
"id": "o6ukw45e",
"name": "core",
"ftype": "dir",
"children": [
  {
    "id": "bc41wb16",
    "name": ".eslintrc.cjs",
    "ftype": "cjs"
  },]
}
*/
let exclude = ["node_modules", ".git", ".vscode", ".prettierignore", "dist"]; //排除的文件夹
const getDirData = async (dirHandle, dirData) => {
  for await (const entry of dirHandle.values()) {
    let { name, kind } = entry
    //文件大小
    if (kind === 'file') {
      const size = await entry.getFile().then(file => file.size || 0)
      const ftype = name.split('.').length > 1 ? name.split('.')[1] : 'unknown'
      dirData.children.push({
        id: randomId(),
        name,
        size,
        value: size,
        ftype
      })
    } else if (kind === 'directory') {
      if (exclude.includes(name)) continue;
      const children = {
        id: randomId(),
        name,
        ftype: 'dir',
        children: []
      }
      dirData.children.push(children)
      await getDirData(entry, children)
    }
  }
}
//注册节点,初始化图
onMounted(() => {
    registerNode();
    acontainer = document.getElementById('agraph');
    agraph = initGraph()
    econtainer = document.getElementById('egraph');
    egraph = echarts.init(econtainer);
})

</script>

<template>
  <div class="wrap">
    <div id="agraph" v-show="graphType == '缩进树图'"></div>
    <div id="egraph" v-show="graphType != '缩进树图'"></div>
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
#agraph,#egraph {
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
