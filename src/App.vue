<script setup>
import G6 from '@antv/g6';
import { onMounted } from 'vue';
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
  console.log('[ dirData ]-68', directoryData)
  graph.read(directoryData);
  graph.fitView()
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
    if (kind === 'file') {
      const ftype = name.split('.').length > 1 ? name.split('.')[1] : 'unknown'
      dirData.children.push({
        id: randomId(),
        name,
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
  graph = initGraph()
})

</script>

<template>
  <div class="wrap">
    <div id="graph"></div>
    <button @click="onSelectDir" class="select-btn">选择文件夹</button>
  </div>
</template>

<style scoped  >
#graph {
  width: 100%;
  height: calc(100vh - 10px);
  position: relative;
}

.select-btn {
  position: absolute;
  top: 10px;
  left: 10px;
}
</style>
