const options = [
  {
    "value": "330000",
    "label": "浙江省",
    "children": [
      {
        "value": "330100",
        "label": "杭州市",
        "children": [
          {
            "value": "330106",
            "label": "西湖区"
          },
          {
            "value": "330107",
            "label": "余杭区"
          }
        ]
      },
      {
        "value": "330200",
        "label": "温州市",
        "children": [
          {
            "value": "330206",
            "label": "龙湾区"
          }
        ]
      }
    ]
  },
  {
    "value": "120000",
    "label": "新疆维吾尔自治区",
    "children": [
      {
        "value": "120100",
        "label": "博尔塔拉蒙古自治州",
        "children": [
          {
            "value": "120111",
            "label": "阿拉山口市"
          }
        ]
      }
    ]
  }
]

// let arr2 = []
function flattenTree(objArr, arr1=[], arr2=[]) {// , arr3=[]
	for(let i in objArr) {
	// for(let i=0;i<objArr.length;i++) {
		if (objArr[i].children) {
			/*if (depth == 0) {
				arr2 = []
			}*/
			arr2.push(delChildren(objArr[i]))
			//arr2.concat(flattenTree(objArr[i].children, arr1, arr3))
			flattenTree(objArr[i].children, arr1, arr2)
		} else {
			// arr1.push(arr2.concat(objArr[i]))
			arr2.push(objArr[i])
			arr1.push(JSON.parse(JSON.stringify(arr2)))
			// arr1.push(arr2)
			if (i == objArr.length - 1) {
				// console.log(JSON.parse(JSON.stringify(arr1)))
				arr2 = []
			} else {
				arr2.pop()
			}
		}
	}
	return arr1
			// console.log(arr1)
}

function flattenTree1(objArr, arr1=[], arr2=[]) {
	if (objArr) {
		for(let i in objArr) {
			arr2.push(delChildren(objArr[i]))
			arr1.push(JSON.parse(JSON.stringify(arr2)))
			if (i == objArr.length - 1) {
				arr2 = []
			} else {
				arr2.pop()
			}
			flattenTree(objArr[i].children, arr1, arr2)
		}
	return arr1
	}
}

function delChildren(ar) {
	const arr = JSON.parse(JSON.stringify(ar))
	delete(arr.children)
	return arr
}

function flattenTree(objArr, arr1=[], arr2=[]) {
	for(let i in objArr) {
		if (objArr[i].children) {
			arr2.push(delChildren(objArr[i]))
			flattenTree(objArr[i].children, arr1, arr2)
		} else {
			arr2.push(objArr[i])
			arr1.push(JSON.parse(JSON.stringify(arr2)))
			if (i == objArr.length - 1) {
				arr2 = []
			} else {
				arr2.pop()
			}
		}
	}
	return arr1
}

flattenTree(options)