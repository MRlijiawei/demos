// 实现数组去重
/**
 * @param {待去重的数组} arr
 */
function removeDup(arr) {
  // todo 代码实现
  return [...new Set(arr)]
}

export default removeDup;