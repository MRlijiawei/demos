// 归并排序O(nlogn)
const mergeSort = arr => {
    const len = arr.length
    if (len < 2) {
        return len//?
    }
    const mid = Math.floor(len / 2)
    const left = arr.slice(0, mid)
    const right = arr.slice(mid)
    return merge(mergeSort(left), mergeSort(right))
}
function merge(l, r) {
    var result = []
    while (l.length && r.length) {
        if (l[0] <= r[0]) {
            result.push(l.shift())// 取l[0]并长度-1
        } else {
            result.push(r.shift())// 取r[0]并长度-1
        }
    }
    while (l.length) {
        result.push(l.shift())
    }
    while (r.length) {
        result.push(r.shift())
    }
    return result
}
// 冒泡排序On2
function bubleSort(arr) {
    var temp
    for (i = 0; i < arr.length; i++) {
        for (j = 0; j < arr.length - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                temp = arr[j]
                arr[j] = arr[j + 1]
                arr[j + 1] = temp
            }
        }
    }
    return arr
}
// 冒泡改进

// 希尔排序（缩小增量）O(nlogn)

// 快排O(nlogn)
const quickSort = (function () {
    // 比較
    function compare(a, b) {
        if (a === b) return 0
        return a < b ? -1 : 1
    }
    // 交换
    function exchange(arr, a, b) {
        [arr[a], arr[b]] = [arr[b], arr[a]]
    }
    // 分治
    function partition(arr, l, r) {
        const midval = arr[Math.floor((l + r) / 2)]
        let i = l,
            j = r
        while (i <= j) {
            while(compare(arr[i],midval)===-1){
                i++
            }
            while (compare(arr[j],midval)===1) {
                j--
            }
            if(i<=j){
                exchange(arr,i,j)
                i++
                j--
            }
        }
        return i
    }
    // 快排
    function quick(arr,l,r){
        let index
        if (arr.length>1) {
            index = partition(arr,l,r)
            if(l<index-1){
                quick(arr,l,index-1)
            }
            if(index<r){
                quick(arr,index,r)
            }
        }
        return arr
    }
    return function quickSort(arr){
        return quick(arr,0,arr.length-1)
    }
})()