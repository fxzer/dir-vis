const fs = require("fs");
const path = require("path");

const getCatalog = (dir) => {
  let filesNameArr = [];
  // 用个hash队列保存每个目录的深度
  let mapDeep = {};
  mapDeep[dir] = 0;
  // 先遍历一遍给其建立深度索引
  const getMap = (dir, curIndex) => {
    let files = fs.readdirSync(dir); //同步拿到文件目录下的所有文件名
    files.map(function (file) {
      //let subPath = path.resolve(dir, file) //拼接为绝对路径
      let subPath = path.join(dir, file); //拼接为相对路径
      let stats = fs.statSync(subPath); //拿到文件信息对象
      // 必须过滤掉文件夹
      let exclude = ["node_modules", ".git", ".prettierignore"];
      if (!exclude.includes(file)) {
        mapDeep[file] = curIndex + 1;
        if (stats.isDirectory()) {
          //判断是否为文件夹类型
          return getMap(subPath, mapDeep[file]); //递归读取文件夹
        }
      }
    });
  };
  //生成随机id
  const generateRandomId = (count = 8) => {
    return Math.random().toString(36).substring(2, 2 + count);
  };
  getMap(dir, mapDeep[dir]);
  const readdirs = (dir, folderName, myroot) => {
    let result = {
      //构造文件夹数据
      id:generateRandomId(),
      path: dir,
      name: path.basename(dir),
      type: "directory",
      deep: mapDeep[folderName],
    };
    let files = fs.readdirSync(dir); //同步拿到文件目录下的所有文件名
    result.children = files.map(function (file) {
      //let subPath = path.resolve(dir, file) //拼接为绝对路径
      let subPath = path.join(dir, file); //拼接为相对路径
      let stats = fs.statSync(subPath); //拿到文件信息对象
      if (stats.isDirectory()) {
        //判断是否为文件夹类型
        return readdirs(subPath, file, file); //递归读取文件夹
      }
      return {
        //构造文件数据
        id:generateRandomId(),   
        path: subPath,
        name: file,
        type: "file",
      };
    });
    return result; //返回数据
  };
  filesNameArr.push(readdirs(dir, dir));
  return filesNameArr;
};

let dir = path.join("/Users/fanxj/Program/ProjectPractice/Vue3/core");
const data = getCatalog(dir);
//写入文件
const dataStr = JSON.stringify(data[0], null, 2);
const dataPath = path.resolve(__dirname, "dirData.js");
fs.writeFileSync(dataPath, `export default ${dataStr}`);
