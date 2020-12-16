class ExplorerUtils {
	constructor() {

	}
}

// 防抖——在事件被触发n秒后再执行回调，如果在这n秒内又被触发，则重新计时
ExplorerUtils.prototype.debounce = (fn, delay=500) => {
	let _timer = null
	return (...args) => {
		clearTimeout(_timer)
		_timer = setTimeout(() => {
			fn.apply(this, args)
		}, delay)
	}
}
// 节流——n秒内，只能触发1次函数
ExplorerUtils.prototype.throttle = (fn, delay=500) => {
	let flag = true
	return (...args) => {
		if (!flag) return;
		flag = false;
		setTimeout(() => {
			fn.apply(this, args)
			flag = true
		}, delay)
	}
}
// 简单数据简单深拷贝
ExplorerUtils.prototype.easyDeepClone = (a) => {
	return JSON.parse(JSON.stringify(a))
}
// 深拷贝
const deepClone = (obj) => {
  // 先检测是不是数组和Object
  // let isArr = Object.prototype.toString.call(obj) === '[object Array]';
  let isArr = Array.isArray(obj);
  let isJson = Object.prototype.toString.call(obj) === '[object Object]';
  if (isArr) {
    // 克隆数组
    let newObj = [];
    for (let i = 0; i < obj.length; i++) {
      newObj[i] = deepClone(obj[i]);
    }
    return newObj;
  } else if (isJson) {
    // 克隆Object
    let newObj = {};
    for (let i in obj) {
      newObj[i] = deepClone(obj[i]);
    }
    return newObj;
  }
  // 不是引用类型直接返回
  return obj;
};
ExplorerUtils.prototype.deepClone = deepClone
Object.prototype.deepClone = function() {
  return deepClone(this);
};
Object.defineProperty(Object.prototype, 'deepClone', {enumerable: false});

// instanceof
ExplorerUtils.prototype.instanceof = (l, r) => {
	if (l === null || r === null) return false
	return l.__proto__ === r.prototype
}
// new
ExplorerUtils.prototype.new = () => {
	const obj = new Object()
	const _constructor = [].shift.call(arguments)
	obj.__proto__ = _constructor.prototype
	const resp = _constructor.apply(obj, arguments)
	return typeof resp === 'object' ? resp : obj
}
// call,apply,bind

// Object.create

// 类的继承(call)

// 排序