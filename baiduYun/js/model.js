/**根据指定的id，返回其下一级所有的数据
 * @param id 要查找的id
 *@return {Array} 包含一级子数据的数组
 */
 //返回data.list中pid是id的数据
function getChildren(id) {
  return data.list.filter(function(item) {
    return item.pid == id
  })
}

//  查找所有子级并返回树结构
function getTree(id,level) {
  var level = level||0;
  var children = getChildren(id);
  var treeData = [];
  children.forEach(function(item) {
    item.level = level;
    treeData.push(item);
    treeData = treeData.concat(getTree(item.id,level+1));
  });
  return treeData
}
function viewTree() {
  var allChildren = getTree(0);
  tree.innerHTML = '';
  allChildren.forEach(function(item) {
    var name = item.name + item.extname;
    var id = item.id;
    var li = document.createElement('li');
    var strong = document.createElement('strong');
    li.appendChild(strong)
    for(var i=0;i<item.level;i++) {
      strong.style.marginLeft = ((i+1)*20) + 'px';
    }
    strong.innerHTML = name;
    li.setAttribute("treeid",id)
    tree.appendChild(li);
  })
}
/**
 * 获取指定id的信息
 *@param  id 要查找的id
 *@return {object} 满足数据的条件
 */
function getInfo(id) {
  return data.list.filter(function(item) {
    return item.id == id
  })[0];
}

/**
 * 获取指定id父级的info
 */
function getParent(id) {
  var info = getInfo(id);
  if(info) {
    return getInfo(info.pid)
  }
}
/**
 * 获取指定id的所有父级（不包括自己）
 * @param id
 * @return {Array} 返回一个包含所有父级数据的数组
 */
function getParents(id) {
  //  保存所有父级数据
  var parents = [];
  //  获取父级
  var parentInfo = getParent(id);
  if(parentInfo) {
    parents.push(parentInfo);
    var more = getParents(parentInfo.id);
    parents = more.concat(parents);
    //  将当前父级的信息保存到parents中
  }
  return parents;
}
//  添加新数据
function addData(newData) {
  newData.extname = '';
  newData.id = getMaxId()+1;
  var existFiles = checkName(newData);
  if(existFiles) {
      for(var i = 1;i <= existFiles.length;i++) {
        //find,数组中满足条件的第一个元素的值,返回值是布尔值
          var x = existFiles.find(function(ele) {
            return ele.extname == (i+1)
          });// 用来判断
          if(x === undefined) {
            newData.extname = (i+1);
            break;
          }
      }
  }
  data.list.push(newData);
}
//  获取数据中最大的id
function getMaxId() {
  var maxId = 0;
  data.list.forEach(function(item) {
    if(item.id>maxId) {
      maxId = item.id;
    }
  });
  return maxId;
}
//  利用递归获取当前id的所有子级元素
function getAllChildren(id) {
  var childrenInfo = getChildrenValue(id);
  var childs = [];
  childrenInfo.forEach(function(item) {
    //  如果存在子级,递归调用
    if(item) {
      childs.push(item);
      var moreChild = getAllChildren(item.id);
      childs = moreChild.concat(childs);
    }
  });
  return childs;
}
//  找到当前id下的子级元素
function getChildrenValue(id) {
  var arr = [];
  arr = data.list.filter(function(item) {
    if(item.pid == id) {
      return true;
    }
    return false;
  });
  return arr;
}


/**
 * 粘贴
 *treeClick 是点击的树里面的那项的id
 *allChilds 是父级的所有子级
 */
function stickFile(stickArr) {
  var stick = stickArr;
  stick.forEach(function(item) {
    item.pid = treeClick;
  })
//  获取我当前选中的下面有哪些子级
  var allChilds = [];
  for(var i = 0;i < stickLi.length;i++) {
    (getAllChildren(stickLi[i].item.id)).forEach(function(elements) {
      allChilds.push(elements);
    });
  }
  allChilds = allChilds.concat(stick);

  var arr = [];
  allChilds.forEach(function(item) {
    arr.push(deepCopy(item));
  });
  getStickArr(arr);
}

//  修改当前获取到的子级们的id和pid,并返回，使之不与原来的冲突
function getStickArr(info) {
  //  将id赋值给cId
  info.forEach(function(item) {
      item.cId = item.id;
  });
  //  id根据当前最大值依次加一
  var idNub = getMaxId();
  info.forEach(function(item) {
      item.id = idNub++;
  });
  var arr = [];
  info.forEach(function(item) {
    arr.push(deepCopy(item));
  });

  for(var i=0;i<info.length;i++) {
    for(var j=0;j<arr.length;j++) {
      if(info[i].pid == arr[j].cId) {
        info[i].pid = arr[j].id;
      }
    }
  }
  info.forEach(function(item) {
     data.list.push(item);
  });
  view(_ID)
}
//  深拷贝对象 ？？？？？？？？？？
function deepCopy(p, c) {
    var c = c || {};
    for (var i in p) {
        if (typeof p[i] === 'object' &&i != 'newClass') {
            c[i] = (p[i].constructor === Array) ? [] : {};
            deepCopy(p[i], c[i]);
        } else {
            c[i] = p[i];
        }
    }
    return c;
}
