
// 通过二分查找法实现对数组的搜索函数，返回找到元素的下标
// 没有找到元素则返回 -1
/**
 * @param {待搜索的数组} arr
 * @param {待查找的数字} num
 */
function findIndex(arr, num) {
    // todo 代码实现
    let _max = arr.length
    let _min = 0
    while(_min <= _max) {
        let _mid = Math.floor((_max+_min)/2)
        if (num < arr[_mid]) {
            _max = _mid + 1
        } else if (num > arr[_mid]) {
            _min = _mid + 1
        } else {
            return _mid
        }
    }
    return -1;
  }
  
  export default findIndex;