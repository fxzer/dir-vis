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
//生成随机id
const randomId = (count = 8) => {
  return Math.random()
    .toString(36)
    .substring(2, 2 + count);
};

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
export default getDirData