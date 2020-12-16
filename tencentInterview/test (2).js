import findIndex from "./binary_search";
import removeDup from "./remove_dup";
import findNum from "./find_number";

let a = [1, 2, 3, 7, 12, 25, 33, 54];

console.log("========二分查找=========");
console.log(findIndex(a, 3)); // 2
console.log(findIndex(a, 33)); // 6
console.log(findIndex(a, 28)); // -1

console.log("========数组去重=========");
console.log(removeDup([1, 2, 3, 4, 2, 8, 1, 5])); // [1,2,3,4,8,5]

console.log("========数字提取=========");
console.log(findNum("asfs123fasde;lkjjiwdf2;kj;;l;io55fsa")); // [123,2,55]
 

 


 
