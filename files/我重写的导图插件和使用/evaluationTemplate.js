/*
 * 1.template部分方法集
 * author：lijw
 */
var t = null;
//新增的没有id的，自动拼接id避免重复
//var countNum = 0;
//树的深度广度，计算canvas需要的宽度和高度使用
var treeDepth = 0;
var treeWidth = 0;
var weightReg = /^[0-9]+$/;
//权重计算正确标志，提交时校验使用
var weightOK = true;

function focusInput(e){
	e.stopPropagation()
}

function getDepth(dataArr) {
    var arr = [];
    //arr.push(json);
    arr = dataArr;
    var depth = 0;
    while (arr.length > 0) {
        var temp = [];
        for(var i = 0 ; i < arr.length ; i++){
            temp.push(arr[i]);
        }
        arr = [];
        for(var i = 0 ; i < temp.length ; i++){
            for(var j = 0 ; j < temp[i].childList.length ; j++){
                arr.push(temp[i].childList[j]);
            }
        }
        if(arr.length >= 0){
            depth++;
        }
    }
    return depth;
}

function getLeafCountTree(dataJson) {
    if(dataJson.childList.length == 0){
        //json.colspan = 1;
        return 1;
    }else{
        var leafCount = 0;
        for(var i = 0 ; i < dataJson.childList.length ; i++){
            leafCount = leafCount + getLeafCountTree(dataJson.childList[i]);
        }
        //json.colspan = leafCount;
        return leafCount;
    }
}

function changeTemplateName() {
	templateObj['templateName'] = $("#templateName")[0].value.trim();
}

function changeContent(thisObj) {
	//内容长度暂时限制100
	if(0 == thisObj.value.trim().length || 100 < thisObj.value.trim().length) {
		layer.msg("请输入长度不超过100的指标内容");
		return;
	}
	//缓存，用于切换保存1-内容
	sessionStorage.setItem("scont", thisObj.value.trim());
	saveParam('content', thisObj.id.substring(16, thisObj.id.length), thisObj.value.trim(), paramData)
}
//编辑时仅保存不校验，最后点击确定按钮时再一并校验权重
function changeWeight(thisObj) {
	//根据id取到paramData中对应位置
	if(!weightReg.test(thisObj.value) || '0' == thisObj.value || 100 < thisObj.value) {
		layer.msg("请输入大于0不大于100的正数权重");
		return;
	}
	//缓存，用于切换保存2-权重
	sessionStorage.setItem("swet", thisObj.value.trim());
	saveParam('weight', thisObj.id.substring(18, thisObj.id.length), thisObj.value.trim(), paramData)
}

function saveParam(type, id, content, dataList) {
	for(var i=0;i<dataList.length;i++) {
		if(dataList[i].id == id || dataList[i].tid == id) {
			if('weight' == type) {
				dataList[i].weight = content / 100;
			} else if('content' == type) {
				dataList[i].content = content;
			}
			break;
		} else if(dataList[i].childList && 0 < dataList[i].childList.length) {
			saveParam(type, id, content, dataList[i].childList);
		}
	}
}

function createTree() {
	t = new ECOTree('t','treeDiv');		
	t.config.expandedImage =  baseRoot + 'starcm/plugins/ecotree/img/less.gif';
	t.config.collapsedImage = baseRoot + 'starcm/plugins/ecotree/img/plus.gif';
	//t.config.colorStyle = ECOTree.CS_LEVEL;  
    t.config.nodeFill = ECOTree.NF_FLAT;  
    t.config.useTarget = false;  	
    t.config.iRootOrientation = ECOTree.RO_LEFT;	
    t.config.topXAdjustment = 20;
	t.config.topYAdjustment = -20;	
	t.config.linkType = "B";						
	t.config.linkColor = "#555";
	t.config.nodeColor = "#f5f5f5";
	//t.config.nodeFill = ECOTree.NF_GRADIENT;
	t.config.nodeBorderColor = "black";
	t.config.selectMode = ECOTree.SL_SINGLE;
	t.config.nodeSelColor = "#cedbec";
	
	//动态设置宽高
	if(0 < treeDepth && 900 < 240 * treeDepth) {
		t.config.canvasWidth = 240 * treeDepth;
	}
	if(0 < treeWidth && 500 < 70 * treeWidth) {
		t.config.canvasHeight = 70 * treeWidth;
	}
}

function drawTree() {
	t = null;
	//countNum = 0;
	treeDepth = getDepth(paramData);
	//一并计算广度
	var sumTree = {
			'id':'-1',
			'childList': paramData
	}
	treeWidth = getLeafCountTree(sumTree);
	createTree();
	initTree(paramData);
}

function initTree(arr) {
	for(var i=0;i<arr.length;i++) {
		if('0' == arr[i].isdelete) {
			if(arr[i].id) {
				arr[i].tid = arr[i].id;
			} else if(!arr[i].tid) {
				//不加id而统一在绘制时加pid，会导致每次绘制统一节点时id不同
				//arr[i].tid = 'temp' + countNum;
				arr[i].tid = 'temp' + new Date().getTime();
			}
			//新增多个时，要实现仅最后一个编辑，需要新增变量并递归
			//暂时不默认编辑
			/*if(!arr[i].isEdt) {
				arr[i].isEdt = false;
			}*/
			arr[i].isEdt = false;
			if('0' == arr[i].fatherId) {
				t.add(arr[i].tid, '-1', arr[i].content, arr[i].weight * 100, arr[i].isEdt);
			} else {
				t.add(arr[i].tid, arr[i].fatherId, arr[i].content, arr[i].weight * 100, arr[i].isEdt);
			}
			//countNum ++;
			if(arr[i].childList && 0 < arr[i].childList.length) {
				initTree(arr[i].childList);
			}
		}
	}
	t.UpdateTree();
} 

function updData(flag, id, pid, content, weight, isEdt, dataList) {
	if("delete" == flag) {
		for(var i=0;i<dataList.length;i++) {
			if(dataList[i].id == id || dataList[i].tid == id) {
				//dataList[i].isdelete = '1';
				//改标志后后台未区分
				dataList.splice(i, 1);
				drawTree();
				break;
			} else if(dataList[i].childList && 0 < dataList[i].childList.length) {
				updData(flag, id, pid, content, weight, isEdt, dataList[i].childList);
			}
		}

	} else if("update" == flag) {
		for(var i=0;i<dataList.length;i++) {
			//新增后编辑，没有id的情况，根据上边初始化时拼接的pid判断
			if(dataList[i].id == id || dataList[i].tid == id) {
				dataList[i].content = content;
				dataList[i].weight = weight;
				break;
			} else if(dataList[i].childList && 0 < dataList[i].childList.length) {
				updData(flag, id, pid, content, weight, isEdt, dataList[i].childList);
			}
		}
	} else if("add" == flag) {
		//加根
		if('-1' == pid) {
			paramData.push({
				'id' : null,
				'content' : content,
				'fatherId': '-1',
				'isdelete': '0',
				'weight': weight,
				'isEdt': isEdt,
				'childList': [],
				'canCollapse': false,
				"templateOrder":paramData.length + 1
			})
			drawTree();
		} else {
			for(var i=0;i<dataList.length;i++) {
				//结合画树时生成的tid，以区分给新增的根节点添加子节点场景
				if(dataList[i].id == pid || dataList[i].tid == pid) {
					dataList[i].childList.push({
						'id' : null,
						'content' : content,
						'fatherId': pid,
						'isdelete': '0',
						'weight': weight,
						'isEdt': isEdt,
						'childList': [],
						'canCollapse': false,
						"templateOrder":dataList[i].childList.length + 1
					});
					drawTree();
					break;
				} else if(dataList[i].childList && 0 < dataList[i].childList.length) {
					updData(flag, id, pid, content, weight, isEdt, dataList[i].childList);
				}
			}
		}

	}
	//t.UpdateTree();
}

function checkTemplateParam() {
	if(undefined == templateObj['templateName'] || null == templateObj['templateName'] || 0 == templateObj['templateName'].trim().length) {
		layer.msg("请输入模板名称");
		return false;
	}
	if(100 < templateObj['templateName'].trim().length) {
		layer.msg("模板名称不得超过100位");
		return false;
	}
	return true;
}

//树校验
var contentEmpty = false;
var weightEmpty = false;
var weightNaN = false;
var weightInv = false;
var weightNotEq = false;
function checkTemplateParamData(dataList) {
	var sumWeight = 0;
	dataList.forEach(function(e) {
		if('0' == e.isdelete) {
			sumWeight = (sumWeight*10 + Number(e.weight)*10)/10;
		}
	});
	for(var i=0;i<dataList.length;i++) {
		if(undefined == dataList[i].content || null == dataList[i].content || 0 == dataList[i].content.trim().length) {
			contentEmpty = true;
			break;
		} else if(undefined == dataList[i].weight || null == dataList[i].weight || 0 == dataList[i].content.trim().weight) {
			weightEmpty = true;
			break;
		} else if(isNaN(dataList[i].weight)) {
			weightNaN = true;
			break;
		} else if(100 < Number(dataList[i].weight)) {
			weightInv = true;
			break;
		} else if(1 != sumWeight) {
			weightNotEq = true;
			break;
		} else if(dataList[i].childList && 0 < dataList[i].childList.length) {
			checkTemplateParamData(dataList[i].childList);
		}
	}
	if(contentEmpty || weightEmpty || weightNaN || weightNotEq) {
		return false;
	} else {
		return true;
	}
}


/*
 * 2.level部分方法集
 * author：lijw
 */
var levelData = [];
var levelObj = {};
var scoreReg = /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,1})?$/;
//根据等级详情初始化
function initLevelHtml() {
	var htmlStr = '';
	for(var i=0;i<levelData.length;i++) {
		htmlStr += '<div class="level_cls" id="level_list_' + (levelData[i].id || levelData[i].tid) + '">' +
			'<input type="text" class="layui-input level_cont_cls" maxlength="20" value="' + (levelData[i].content||'') + '" onchange="changeLevel(this, 1)">' + 
		'分值<input type="text" class="layui-input level_score_cls" maxlength="8" value="' + (levelData[i].indicatorGradeScore||0) + '" onchange="changeLevel(this, 2)">' + 
		'范围<input type="text" class="layui-input level_score_cls" maxlength="8" value="' + (levelData[i].minScore||0) + '" onchange="changeLevel(this, 3)">' + 
		'到<input type="text" class="layui-input level_score_cls" maxlength="8" value="' + (levelData[i].maxScore||0) + '" onchange="changeLevel(this, 4)">' + 
		'<button class="del_level_btn"><span>×</span></button>' +
		'</div>';
	}
	$("#levelDiv").html(htmlStr);
	$(".del_level_btn").unbind().click(function() {
		//确认删除
		var delId = $(this).parent().attr("id").substring(11);
		levelData.splice(levelData.findIndex(function(data) {
			return data.id == delId || data.tid == delId;
		}), 1);
		initLevelHtml();
	})
}

function changeLevel(obj, type) {
	var changeId = $(obj).parent().attr("id").substring(11);
	var changeIndex = levelData.findIndex(function(data) {
		return data.id == changeId || data.tid == changeId;
	});
	if(1 != type && 3 != type) {
		if(!scoreReg.test(obj.value.trim())) {
			layer.msg("请输入最多一位小数的正数分值");
			return;
		}
	}
	if(1 == type) {
		levelData[changeIndex].content = obj.value.trim();
	} else if(2 == type) {
		levelData[changeIndex].indicatorGradeScore = obj.value.trim();
	} else if(3 == type) {
		if(!scoreReg.test(obj.value.trim()) && 0 != obj.value.trim()) {
			layer.msg("请输入最多一位小数的非负数分值");
			return;
		}
		levelData[changeIndex].minScore = obj.value.trim();
	} else if(4 == type) {
		levelData[changeIndex].maxScore = obj.value.trim();
	}
	//修改时不校验，统一放到提交校验
}

//等级指标参数校验
var levelNameInv = false;
var levelScoreEmpt = false;
var levelScoreInv = false;
function checkLevelParamData() {
	for(var i=0;i<levelData.length;i++) {
		if(null == levelData[i].content || undefined == levelData[i].content || "" == levelData[i].content.trim()) {
			levelNameInv = true;
			break;
		} else if(isNaN(levelData[i].indicatorGradeScore) || null == levelData[i].indicatorGradeScore || isNaN(levelData[i].maxScore) ||
				null == levelData[i].maxScore || isNaN(levelData[i].minScore) || null == levelData[i].minScore) {
			levelScoreEmpt = true;
			break;
		} else if(Number(levelData[i].maxScore) < Number(levelData[i].minScore) || Number(levelData[i].indicatorGradeScore) < Number(levelData[i].minScore)
				|| Number(levelData[i].maxScore) < Number(levelData[i].indicatorGradeScore)) {
			levelScoreInv = true;
			break;
			//当前对比下一个
		} else if(i < levelData.length - 1) {
			 if(Number(levelData[i].minScore) < Number(levelData[i+1].maxScore)) {
				 //请从高到低设置
				 layer.msg("请按分数从高到低设置");
				 return;
				 levelScoreInv = true;
				break;
			 }
		}
	}
	if(levelNameInv || levelScoreEmpt || levelScoreInv) {
		return false;
	} else {
		return true;
	}
}
/*
 * 3.类型--角色
 */
var allRoles = [];
var typeObj = {};
function setDefaultType(rowId, flag) {
	var url = baseRoot + 'defaultValue/setDefaultCourseType/' + rowId;
	layer.load();
	$.ajax({
        type : "get",
        url : url,
        async : true,
        dataType : 'JSON',
        success : function(data) {
            if('1' == data.code) {
	        	layer.closeAll();
	        	$("#dicTable").bootstrapTable('refresh');
	        	layer.msg("操作成功");
            } else {
            	layer.msg("操作失败");
            }
            	
        },
        error: function() {
        	layer.closeAll();
        	layer.msg("服务异常");
        }
    })
}
/*
 * 4.课程类型
 */

function dicFomatter(value, row, index) {  
	//是否是id????
	if(row.isDefaultValue && row.isDefaultValue == '1') {
	    return "<div onclick=\"setDefaultType('"+ row.dicKey + "','" + row.isDefaultValue + "')\"><input type=\"checkbox\" checked>" + 
	     "<a href='###' >设为默认</a></div>";
	} else {

	    return "<div onclick=\"setDefaultType('"+ row.dicKey + "','" + row.isDefaultValue + "')\"><input type=\"checkbox\">" + 
	     "<a href='###' >设为默认</a></div>";
	}
}
//对于原有的，删除时只改状态？？对于新增的，由于删除后就再也看不到了，所有在下发前需要对isdelete==1且id为空的做删除
function ajaxRequestTemplate(params) {
    // 分页查询活动列表
    var url = baseRoot + "evaluationTemplate/get"
    
    var list;
    var total=0; 
    $.ajax({
        type : "get",
        url : url,
        async : false,
        dataType : 'JSON',
        success : function(data) {
            list=data.data;
            total=data.data.total;
        }
    });

    params.success({
        total: total,
        rows: list
    }); 

    params.complete();    
} 

function ajaxRequestLevel(params) {
    // 分页查询活动列表
    var url = baseRoot + "evaluationIndicatorGrade/get"

    var list;
    var total=0; 
    $.ajax({
        type : "get",
        url : url,
        async : false,
        dataType : 'JSON',
        success : function(data) {
            list=data.data;
            total=data.data.total;
        }
    });

    params.success({
        total: total,
        rows: list
    }); 

    params.complete();    
} 

function ajaxRequestType(params) {
    // 分页查询活动列表
    var url = baseRoot + "evaluationType/get"
    var list;
    var total=0; 
    $.ajax({
        type : "get",
        url : url,
        async : false,
        dataType : 'JSON',
        success : function(data) {
            list=data.data;
            total=data.data.total;
        }
    });

    params.success({
        total: total,
        rows: list
    }); 

    params.complete();    
} 
function ajaxRequestDic(params) {
    // 分页查询活动列表
    var url = baseRoot + "courseType/getCourseTypeList";
    var list;
    var total=0; 
    $.ajax({
        type : "get",
        url : url,
        async : false,
        dataType : 'JSON',
        success : function(data) {
            list=data.data;
            total=list.length;
        }
    });

    params.success({
        total: total,
        rows: list
    }); 

    params.complete();    
} 

var paramData = [];
var templateObj = {};
/*$(function(){*/
	starc.use(['layer'], function(){ 
		
		$("#templateTable").bootstrapTable('destroy').bootstrapTable({    
	        columns:[
	                 {
	                     checkbox:'true',
	                 },
	                 {
	                     title:"id",
	                     field:"id",
	                     align:'center',
	                     visible:false
	                 },{
	                     title:"模板名称",
	                     field:"templateName",
	                     align:'center',
	                     width:'320px',
	                     cellStyle:{
		                 		css:{"text-decoration":"underline","cursor":"pointer",}
		                 	}/*,
		                 	formatter:function(value, row, index) {
		                 		return "<a href=\"###\" data-toggle=\"modal\" data-target=\"#templateModalTable\" onclick=\"onTemplateDetail('" + value + 
		                 		"')\" title=\""+ row.templateName + "\" class=\"table_over_cls\">" + row.templateName + "</a>";
		                 	}*/
	                 },{
	                     title:"操作",
	                     field:"operation",
	                     align:'center',
	                     cellStyle:{
		                 		css:{"cursor":"pointer"}
		                 	},
	                 	formatter:function(value, row, index) {
	                 		return "<a href=\"###\" onclick=\"del_template('" + row.id + 
	                 		"')\" class=\"table_over_cls\"><i class='glyphicon glyphicon-remove'></i>删除</a>";
	                 	}
	                 }
	                ],singleSelect: true,
	                maintainSelected: false
		});
		
		$("#levelTable").bootstrapTable('destroy').bootstrapTable({    
	        columns:[
	                 {
	                     checkbox:'true',
	                 },
	                 {
	                     title:"id",
	                     field:"id",
	                     align:'center',
	                     visible:false
	                 },{
	                     title:"等级名称",
	                     field:"indicatorGradeName",
	                     align:'center',
	                     cellStyle:{
		                 		css:{"width":"320px", "text-decoration":"underline","cursor":"pointer"}
		                 	}/*,
		                 	formatter:function(value, row, index) {
		                 		return "<a href=\"###\" data-toggle=\"modal\" data-target=\"#levelModalTable\" onclick=\"onLevelDetail('" + value + 
		                 		"')\" title=\""+ row.indicatorGradeName + "\" class=\"table_over_cls\">" + row.indicatorGradeName + "</a>";
		                 	}*/
	                 },{
	                     title:"操作",
	                     field:"operation",
	                     align:'center',
	                     cellStyle:{
		                 		css:{"cursor":"pointer"}
		                 	},
	                 	formatter:function(value, row, index) {
	                 		return "<a href=\"###\" onclick=\"del_level('" + row.id + 
	                 		"')\" class=\"table_over_cls\"><i class='glyphicon glyphicon-remove'></i>删除</a>";
	                 	}
	                 }
	                ],singleSelect: true,
	                maintainSelected: false
		});
		
		$("#typeTable").bootstrapTable('destroy').bootstrapTable({    
	        columns:[
	                 {
	                     checkbox:'true',
	                 },
	                 {
	                     title:"id",
	                     field:"id",
	                     align:'center',
	                     visible:false
	                 },{
	                     title:"评价类型",
	                     field:"evaluationTypeName",
	                     align:'center',
	                     cellStyle:{
	                 		css:{"text-decoration":"underline","cursor":"pointer"}
	                 	}
	                 },{
	                     title:"操作",
	                     field:"operation",
	                     align:'center',
	                     cellStyle:{
		                 		css:{"cursor":"pointer"}
		                 	},
	                 	formatter:function(value, row, index) {
	                 		return "<a href=\"###\" onclick=\"del_type('" + row.id + 
	                 		"')\" class=\"table_over_cls\"><i class='glyphicon glyphicon-remove'></i>删除</a>";
	                 	}
	                 }
	                ],singleSelect: true,
	                maintainSelected: false
		});
		
		$("#dicTable").bootstrapTable('destroy').bootstrapTable({    
	        columns:[
	                 {
	                     checkbox:'true',
	                 },
	                 {
	                     title:"id",
	                     field:"id",
	                     align:'center',
	                     visible:false
	                 },{
	                     title:"课程类型",
	                     field:"dicValue",
	                     align:'center'
	                 },{
	                     title:"操作",
	                     field:"operation",
	                     align:'center',
	                     formatter:dicFomatter
	                 }
	                ],singleSelect: true,
	                maintainSelected: false,
		});
		
		/*
		 * 模板
		 */
		$(".add_root_lev").click(function() {
			//统一绘制入口；新增默认编辑，不默认选中
			updData('add', '', '-1', '', 0, true, paramData);
		})
		
		$(".add_same_lev").click(function() {
			if(0 == t.nDatabaseNodes.length) {
				layer.msg("请先添加一级指标");
				return;
			} else {
				if(0 == t.getSelectedNodes().length) {
					layer.msg("请先选择目标指标");
					return;
				} else {
					updData('add', '', t.getSelectedNodes()[0].parent, '', 0, true, paramData);
				}
			}
		})

		$(".add_next_lev").click(function() {
			if(19 < treeDepth) {
				layer.msg("最多添加二十级指标");
				return;
			} else if(0 == t.nDatabaseNodes.length) {
				layer.msg("请先添加一级指标");
				return;
			} else {
				if(0 == t.getSelectedNodes().length) {
					layer.msg("请先选择目标指标");
					return;
				} else {
					updData('add', '', t.getSelectedNodes()[0].id, '', 0, true, paramData);
				}
			}
		})
		
		$(".edt_lev").click(function() {
			if(0 == t.nDatabaseNodes.length) {
				layer.msg("请先添加指标");
				return;
			} else {
				if(0 == t.getSelectedNodes().length) {
					layer.msg("请先选择目标指标");
					return;
				} else {
					t.nDatabaseNodes[t.mapIDs[t.getSelectedNodes()[0].id]].isEdt = true;
					//缓存，用于切换保存3-id/tid/获取选中节点已适配新增节点id=tid
					sessionStorage.setItem("stid", t.getSelectedNodes()[0].id);
					t.UpdateTree();
				}
			}
		})
		
		$(".del_lev").click(function() {
			if(0 == t.getSelectedNodes().length) {
				layer.msg("请先选择目标指标");
				return;
			} else {
				/*t.nDatabaseNodes.splice(t.nDatabaseNodes.findIndex(function(el){
					return el.id == t.getSelectedNodes()[0].id;
				}), 1);*/
				//t.nDatabaseNodes.splice(t.mapIDs[t.getSelectedNodes()[0].id], 1);
				//delete(t.mapIDs[t.getSelectedNodes()[0].id]);
				//t.UpdateTree();
				updData('delete', t.getSelectedNodes()[0].id, '', '', 0, false, paramData);
			}
		})
		
		//行点击
		$('#templateTable').on('click-row.bs.table', function (e, row, element) {
			//名称不允许标签
			if(row.id && "bs-checkbox" != element.prevObject.context.className && -1 == element.prevObject.context.innerHTML.indexOf(">删除</a>")) {
    			templateObj = row;
    			layer.load();
				$.ajax({
			        type : "get",
			        url : baseRoot + 'evaluationTemplate/get/'+row.id,
			        async : true,
			        dataType : 'JSON',
			        success : function(data) {
			        	layer.closeAll();
			            if('1' == data.code && data.data.contentList) {
			            	paramData = data.data.contentList;
			            	//第一次时需要初始化树配置
			            	//if(null == t) {
			            		drawTree();
			            	//}
			            	$('#templateModalTable').modal('show');
			    			$("#templateName")[0].value = templateObj.templateName || "";
			            	//initTree(paramData);
			            } else {
			            	layer.msg(data.msg || "服务异常");
			            }
			        },
			        error:function(err) {
			        	layer.closeAll();
			        }
			    });
			}
		});
		
		$("#add_template").click(function() {
			t = null;
			paramData = [];
			templateObj = {};
			createTree();
			initTree([]);
			$("#templateName")[0].value = '';
		});	
		
		$(".btn_submit_template").click(function() {
			if(!checkTemplateParam()) {
				return;
			}
			if(0 == paramData.length) {
				layer.msg("请添加模板指标");
				return;
			}
			if(!checkTemplateParamData(paramData)) {
				if(contentEmpty) {
					layer.msg("模板指标内容不能为空");
				} else if(weightEmpty) {
					layer.msg("模板指标权重不能为空");
				} else if(weightNaN) {
					layer.msg("模板指标权重只能为数字");
				} else if(weightInv) {
					layer.msg("请输入大于0不大于100的正数权重");
				} else if(weightNotEq) {
					layer.msg("模板指标权重分配有误");
				}
				contentEmpty = false;
				weightEmpty = false;
				weightNaN = false;
				weightInv = false;
				weightNotEq = false;
				return;
			}
			templateObj['contentList'] = paramData;
			if(templateObj.id) {
				var url = baseRoot + 'evaluationTemplate/update'
			} else {
				var url = baseRoot + 'evaluationTemplate/add'
			}
			layer.load();
			$.ajax({
		        url : url,
		        type: 'POST',
				dataType: 'json',
				contentType: 'application/json',
		        data: JSON.stringify(templateObj),
		        success : function(data) {
		        	if(1 == data.code) {
			        	layer.closeAll();
			        	layer.msg("操作成功");
						$("#templateModalTable").modal("hide");
						$("#templateTable").bootstrapTable('refresh');
		        	} else {
		        		layer.msg("操作失败");
		        	}
		        },
				error: function(err) {
					layer.msg("服务异常");
					layer.closeAll();
				}
		    });
		})
		
		/*$('#templateModalTable').on('hidden.bs.modal', function () {
			
		})	*/
		
		/*
		 * 等级
		 */
		
		$("#add_level").click(function() {
			levelData = [];
			levelObj = {};
			$("#levelName")[0].value = "";
			//levelData = initLevelData.data.gradeContentList;
			//模拟点击表格--查询数据，然后初始化树//添加事件paramData = []
			initLevelHtml();
		});	
		
		$(".add_level").click(function() {
			levelData.push({
				id: null,
				content: '',
				indicatorGradeScore: 0,
				maxScore: 0,
				minScore: 0,
				//新增对象识别符
				tid: 'temp' + new Date().getTime(),
				indicatorGradeOrder: levelData.length + 1
			});
			initLevelHtml();
		});
		
		//行点击
		$('#levelTable').on('click-row.bs.table', function (e, row, element) {
			if(row.id && "bs-checkbox" != element.prevObject.context.className && -1 == element.prevObject.context.innerHTML.indexOf(">删除</a>")) {
				layer.load();
				$.ajax({
			        type : "get",
			        url : baseRoot + 'evaluationIndicatorGrade/get/'+row.id,
			        async : true,
			        dataType : 'JSON',
			        success : function(data) {
			        	layer.closeAll();
			            if('1' == data.code && data.data.gradeContentList) {
			            	levelData = data.data.gradeContentList;
			            	levelObj = data.data;
			            	$('#levelModalTable').modal('show');
			    			$("#levelName")[0].value = levelObj.indicatorGradeName || "";
			            	initLevelHtml();
			            } else {
			            	layer.msg(data.msg || "服务异常");
			            }
			        },
			        error: function(err) {
			        	layer.closeAll();
			        	layer.msg("服务异常");
			        }
			    });
			}
		});
		
		$('input[id=levelName]').change(function() {
			levelObj['indicatorGradeName'] = $("#levelName")[0].value.trim();
		});
		
		$(".btn_submit_level").click(function() {
			if(null == levelObj['indicatorGradeName'] || undefined == levelObj['indicatorGradeName'] || "" == levelObj['indicatorGradeName'].trim()) {
				layer.msg("请输入指标等级名称");
				return;
			} else if(100 < levelObj['indicatorGradeName'].trim().length) {
				layer.msg("指标等级名称长度不得超过100");
				return;
			}
			if(!checkLevelParamData()) {
				if(levelNameInv) {
					layer.msg("等级指标内容不能为空");
				} else if(levelScoreEmpt) {
					layer.msg("等级指标分值设置有误");
				} else if(levelScoreInv) {
					layer.msg("等级指标分值区间设置有误");
				}
				levelNameInv = false;
				levelScoreEmpt = false;
				levelScoreInv = false;
				return;
			}
			//order重新排序
			levelObj['gradeContentList'] = sortOrder(levelData);
			if(levelObj.id) {
				var url = baseRoot + 'evaluationIndicatorGrade/update'
			} else {
				var url = baseRoot + 'evaluationIndicatorGrade/add'
			}
			layer.load();
			$.ajax({
		        url : url,
		        type: 'POST',
				dataType: 'json',
				contentType: 'application/json',
		        data: JSON.stringify(levelObj),
		        success : function(data) {
		        	if(1 == data.code) {
			        	layer.closeAll();
			        	layer.msg("操作成功");
						$("#levelModalTable").modal("hide");
						$("#levelTable").bootstrapTable('refresh');
		        	} else {
		        		layer.msg("操作失败");
		        	}
		        },
				error: function(err) {
					layer.msg("服务异常");
					layer.closeAll();
				}
		    });
		})
		
		/*
		 * 类型
		 */
		function renderForm(){
		  layui.use('form', function(){
		   var form = layui.form();
		   form.render();
		  });
		 }
		$("#add_type").click(function() {
			if(0 == allRoles.length) {
				//初始化查询，其余情况直接拼接
				var url = baseRoot + 'dataDictionaryController/getListByType?type=1';
			    $.ajax({
			        type : "post",
			        url : url,
			        async : true,
			        dataType : 'json',
			        contentType: 'application/json',
			        data:JSON.stringify({"pageNum":1,"pageSize":0}),
			        success : function(data) {
			        	allRoles = data.data.list;
			            //循环拼接
			        	var str = '';
			            str += '<option value="0">请选择</option>';
		              $.each(allRoles, function (index, el) {
		                 
		            	  str += '<option value=' + el.dicKey + '>' + el.dicValue +
		                      '</option>'
		              });
		              $('select[name="participation"]').empty().append(str);
		              $('select[name="participation"]').val('0');
		              $('select[name="evaluated"]').empty().append(str);
		              $('select[name="evaluated"]').val('0');
		              $("#typeName")[0].value = "";
		              renderForm();
			        }
			    });
			} else {
				//非初始化时，是否不需要重新赋值,只需要设置默认选中
				var str = '';
	            str += '<option value="0">请选择</option>';
              $.each(allRoles, function (index, el) {
                 
            	  str += '<option value=' + el.dicKey + '>' + el.dicValue +
                      '</option>'
              });
              $('select[name="participation"]').empty().append(str);
              $('select[name="participation"]').val('0');
              $('select[name="evaluated"]').empty().append(str);
              $('select[name="evaluated"]').val('0');
              $("#typeName")[0].value = "";
              renderForm();
			}
		});	
		
		//行点击
		$('#typeTable').on('click-row.bs.table', function (e, row, element) {
			//不需要查询，根据行数据渲染
			if("bs-checkbox" == element.prevObject.context.className || -1 < element.prevObject.context.innerHTML.indexOf(">删除</a>")) {
				return;
			}
			typeObj = row;
			if(0 == allRoles.length) {
				//初始化查询，其余情况直接拼接
				var url = baseRoot + 'dataDictionaryController/getListByType?type=1';
			    $.ajax({
			        type : "post",
			        url : url,
			        async : false,
			        dataType : 'json',
			        contentType: 'application/json',
			        data:JSON.stringify({"pageNum":1,"pageSize":0}),
			        success : function(data) {
			        	allRoles = data.data.list;
			            //循环拼接
			        	var str = '';
		              $.each(allRoles, function (index, el) {
		                 
		            	  str += '<option value=' + el.dicKey + '>' + el.dicValue +
		                      '</option>'
		              });
		              
		              $('select[name="participation"]').empty().append(str);
		              $('select[name="evaluated"]').empty().append(str);
		              renderForm();
			        }
			    });
			} else {
				//非初始化时，是否不需要重新赋值,只需要设置默认选中
				
			}
			$('#typeModalTable').modal('show');
			$("#typeName")[0].value = row.evaluationTypeName || "";
			$('select[name="participation"]').val(row.participationRole);
            $('select[name="evaluated"]').val(row.evaluatedRole);
            renderForm();
		});
		
		$(".btn_submit_type").click(function() {
			if(null == $("#typeName")[0].value || "" == $("#typeName")[0].value.trim()) {
				layer.msg("请输入类型名称");
				return;
			}
			if($('select[name="participation"]').val() == '0' || $('select[name="participation"]').val() == '' || $('select[name="participation"]').val() == null) {
				layer.msg("请选择参评对象");
				return;
			}
			if($('select[name="evaluated"]').val() == '0' || $('select[name="evaluated"]').val() == '' || $('select[name="evaluated"]').val() == null) {
				layer.msg("请选择评价对象");
				return;
			}
			if($('select[name="evaluated"]').val() == $('select[name="participation"]').val()) {
				layer.msg("参评对象和评价对象不能相同");
				return;
			}
			
			typeObj['evaluationTypeName'] = $("#typeName")[0].value.trim();
			typeObj['participationRole'] = $('select[name="participation"]').val();
			typeObj['evaluatedRole'] = $('select[name="evaluated"]').val();
			if(typeObj.id) {
				var url = baseRoot + 'evaluationType/update'
			} else {
				var url = baseRoot + 'evaluationType/add'
			}
			layer.load();
			$.ajax({
		        url : url,
		        type: 'POST',
				dataType: 'json',
				contentType: 'application/json',
		        data: JSON.stringify(typeObj),
		        success : function(data) {
		        	if(1 == data.code) {
			        	layer.closeAll();
			        	layer.msg("操作成功");
						$("#typeModalTable").modal("hide");
						$("#typeTable").bootstrapTable('refresh');
		        	} else {
		        		layer.msg("操作失败");
		        	}
		        },
				error: function(err) {
					layer.msg("服务异常");
					layer.closeAll();
				}
		    });
		})
		
		
		/*
		 * 字典
		 */
		
		
		
		//创建
		$("#create").click(function() {
			if(0 == $("#templateTable").bootstrapTable('getSelections').length) {
				layer.msg("请选择评价指标模板");
				return;
			}
			if(0 == $("#levelTable").bootstrapTable('getSelections').length) {
				layer.msg("请选择指标等级");
				return;
			}
			if(0 == $("#typeTable").bootstrapTable('getSelections').length) {
				layer.msg("请选择评价类型");
				return;
			}
			if(0 == $("#dicTable").bootstrapTable('getSelections').length) {
				layer.msg("请选择课程类型");
				return;
			}
			$("#sysModalTable").modal("show");
			$("#sysName")[0].value = "";
			$(".temp_name")[0].innerText = $("#templateTable").bootstrapTable('getSelections')[0].templateName;
			$(".level_name")[0].innerText = $("#levelTable").bootstrapTable('getSelections')[0].indicatorGradeName;
			$(".type_name")[0].innerText = $("#typeTable").bootstrapTable('getSelections')[0].evaluationTypeName;
			$(".site_type_name")[0].innerText = $("#dicTable").bootstrapTable('getSelections')[0].dicValue;
		})
		
		$(".btn_submit_sys").click(function() {
			if('' == $("#sysName")[0].value.trim() || null == $("#sysName")[0].value.trim()) {
				layer.msg("请输入评价体系名称");
				return;
			}

			layer.load();
			var url = baseRoot + 'evaluationSystem/add';
			var evaObj = {"isAdviceRequired":"1"};
			evaObj['evaluationSystemName'] = $("#sysName")[0].value.trim();
			evaObj['evaluationTemplateId'] = $("#templateTable").bootstrapTable('getSelections')[0].id;
			evaObj['indicatorGradeId'] = $("#levelTable").bootstrapTable('getSelections')[0].id;
			evaObj['evaluationTypeId'] = $("#typeTable").bootstrapTable('getSelections')[0].id;
			evaObj['courseTypeCode'] = $("#dicTable").bootstrapTable('getSelections')[0].dicKey;
			$.ajax({
			    type : "post",
			    url : url,
			    async : true,
			    dataType : 'JSON',
				contentType: 'application/json',
		        data: JSON.stringify(evaObj),
			    success : function(data) {
			    	layer.closeAll();
			    	if(1 == data.code) {
				    	$("#sysModalTable").modal("hide");
				    	layer.confirm("创建成功，是否回到评价指标体系列表页面？", {
							btn: ['确定', '取消'],
							yes: function (index, layero) {
								////成功是否跳转到列表页面？evaluation/evaluationSysList
						    	window.history.go(-1);
							},
							btn2: function (index, layero) {

							},
							cancel: function () {

							}
						});
			    	}
			    },
			    error: function(err) {
			    	layer.closeAll();
			    	layer.msg("服务异常");
			        }
			    });
		});
	})
/*})*/

function del_template(id) {
	layer.confirm("是否确认删除该评价指标模板？", {
		btn: ['确定', '取消'],
		yes: function (index, layero) {
			layer.load();
			var url = baseRoot + 'evaluationTemplate/delete/' + id;
			$.ajax({
			    type : "get",
			    url : url,
			    async : true,
			    dataType : 'JSON',
			    success : function(data) {
			    	if(1 == data.code) {
				    	layer.closeAll();
				    	layer.msg("删除成功");
						$("#templateTable").bootstrapTable('refresh');
			    	} else {
			    		layer.msg("删除失败");
			    	}
			    },
			    error: function(err) {
			    	layer.closeAll();
			    	layer.msg("服务异常");
			        }
			    })
		},
		btn2: function (index, layero) {

		},
		cancel: function () {

		}
	})
}
	

function del_level(id) {
	layer.confirm("是否确认删除该评价指标等级？", {
		btn: ['确定', '取消'],
		yes: function (index, layero) {
			layer.load();
			var url = baseRoot + 'evaluationIndicatorGrade/delete/' + id;
			$.ajax({
			    type : "get",
			    url : url,
			    async : true,
			    dataType : 'JSON',
			    success : function(data) {
			    	if(1 == data.code) {
				    	layer.closeAll();
				    	layer.msg("删除成功");
						$("#levelTable").bootstrapTable('refresh');
			    	} else {
			    		layer.msg("删除失败");
			    	}
			    },
			    error: function(err) {
			    	layer.closeAll();
			    	layer.msg("服务异常");
			        }
			    })
		},
		btn2: function (index, layero) {

		},
		cancel: function () {

		}
	})
}

function del_type(id) {
	layer.confirm("是否确认删除该评价类型？", {
		btn: ['确定', '取消'],
		yes: function (index, layero) {
			layer.load();
			var url = baseRoot + 'evaluationType/delete/' + id;
			$.ajax({
			    type : "get",
			    url : url,
			    async : true,
			    dataType : 'JSON',
			    success : function(data) {
			    	if(1 == data.code) {
				    	layer.closeAll();
				    	layer.msg("删除成功");
						$("#typeTable").bootstrapTable('refresh');
			    	} else {
			    		layer.msg("删除失败");
			    	}
			    },
			    error: function(err) {
			    	layer.closeAll();
			    	layer.msg("服务异常");
			        }
			    })
		},
		btn2: function (index, layero) {

		},
		cancel: function () {

		}
	})
}

function sortOrder(data) {
	$.each(data, function(index,e) {
		e.indicatorGradeOrder = index +1;
	});
	return data;
}