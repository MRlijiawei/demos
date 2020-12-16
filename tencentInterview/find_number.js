
// 在字符串中找到数字并返回
/**
 * @param {待检索的字符串} str
 */
function findNum(str) {
    // todo 代码实现
    const ar = []
    let isNum = true
    let numStr = ''
    for(let i=0;i<str.length;i++) {
        //48~57
        if (str.charCodeAt(i) > 47 && str.charCodeAt(i) < 58) {
            if (!isNum) {
                if (numStr.length) {
                    ar.push(numStr)
                }
                numStr = ''
            }
            numStr += str[i]
            isNum = true
        } else {
            isNum = false
        }
    }
    if (numStr.length) {
        ar.push(numStr)
    }
    return ar;
    // reduce
  }
  
  export default findNum;