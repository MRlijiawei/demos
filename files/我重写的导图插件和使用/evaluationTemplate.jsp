<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
	<!DOCTYPE HTML>
	<html xmlns="http://www.w3.org/1999/xhtml">

	<head>
		<meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
		<jsp:include page="/WEB-INF/template/common.jsp" />
		<title>创建评价体系</title>
		<link rel="stylesheet" href="${webRoot}style/css/evaluation.css?build-revision=${svn.revision}" />
		<script src="${webRoot}template/evaluation/evaluationTemplate.js?build-revision=${svn.revision}"></script>
		<link rel="stylesheet" href="${webRoot}starcm/plugins/ecotree/ECOTree.css?build-revision=${svn.revision}" />
		<script src="${webRoot}starcm/plugins/ecotree/ECOTree.js?build-revision=${svn.revision}"></script>
		<script src="${webRoot}starcm/plugins/layim/layui.js?build-revision=${svn.revision}"></script>
		<script src="${webRoot}template/evaluation/evaluationCommon.js?build-revision=${svn.revision}"></script>
	</head>

	<body style="padding: 30px;">

		<div style="display: grid;">
		
			<a href="${webRoot}evaluation/evaluationSysList" class="pull-left" style="line-height: 33px;width: 80px;">
				<img src="${webRoot}style/images/next.png" alt="返回" class="back pull-left" />返回
			 </a>
			<p class="note_cls">评价体系由以下四个模块组成，请勾选创建</p>
		</div>
		<div class="tables_cls">
			<div class="table_cls">
				<div class="tab_head">评价指标模板
					<!-- <a id="del_template" class="layui-btn layui-btn-small layui-btn-danger pull-right" href="###">删除</a> -->
					<button id="add_template" class="layui-btn layui-btn-small layui-btn-normal pull-right" data-toggle="modal" data-target="#templateModalTable">添加</button>
				</div>
				<div class="inner_tab">
					<table id="templateTable"
	                  data-toolbar="#toolbarTemplate"
	                  data-pagination="false"
	                  data-page-size="10"
	                  data-page-list="[10, 25, ALL]"
	                  data-id-field="id"
	                  data-side-pagination="server"
	                  data-ajax="ajaxRequestTemplate"
	                  data-search-text="title"
	                  data-query-params-type=""
	                  >
	               </table>
				</div>
			</div>
			<div class="table_cls">
				<div class="tab_head">指标等级和量化分值
					<!-- <a id="del_level" class="layui-btn layui-btn-small layui-btn-danger pull-right" href="###">删除</a> -->
					<a id="add_level" class="layui-btn layui-btn-small layui-btn-normal pull-right" href="###" data-toggle="modal" data-target="#levelModalTable">添加</a>
				</div>
				<div class="inner_tab">
					<table id="levelTable"
	                  data-toolbar="#toolbarLevel"
	                  data-pagination="false"
	                  data-page-size="10"
	                  data-page-list="[10, 25, ALL]"
	                  data-id-field="id"
	                  data-side-pagination="server"
	                  data-ajax="ajaxRequestLevel"
	                  data-search-text="title"
	                  data-query-params-type=""
	                  >
	               </table>
				</div>
			</div>
			<div class="table_cls">
				<div class="tab_head">评价类型
					<!-- <a id="del_type" class="layui-btn layui-btn-small layui-btn-danger pull-right" href="###">删除</a> -->
					<a id="add_type" class="layui-btn layui-btn-small layui-btn-normal pull-right" href="###" data-toggle="modal" data-target="#typeModalTable">添加</a>
				</div>
				<div class="inner_tab">
					<table id="typeTable"
	                  data-toolbar="#toolbarType"
	                  data-pagination="false"
	                  data-page-size="10"
	                  data-page-list="[10, 25, ALL]"
	                  data-id-field="id"
	                  data-side-pagination="server"
	                  data-ajax="ajaxRequestType"
	                  data-search-text="title"
	                  data-query-params-type=""
	                  >
	               </table>
				</div>
			</div>
			<div class="table_cls" style="margin-right: 0px;">
				<div class="tab_head">课程类型
					
				</div>
				<div class="inner_tab">
					<div class="inner_tab">
					<table id="dicTable"
	                  data-toolbar="#toolbarDic"
	                  data-pagination="false"
	                  data-page-size="10"
	                  data-page-list="[10, 25, ALL]"
	                  data-id-field="id"
	                  data-side-pagination="server"
	                  data-ajax="ajaxRequestDic"
	                  data-search-text="title"
	                  data-query-params-type=""
	                  >
	               </table>
				</div>
				</div>
			</div>
			
		</div>
		<div>
			<a id="create" class="layui-btn layui-btn-small layui-btn-normal pull-left create_btn" href="###">创建评价体系</a>
		</div>
		<!-- 新增/编辑评价模板弹窗 -->
		<div class="modal fade" id="templateModalTable" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content" style="min-width: 1000px;">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span></button>
                        <h4 class="modal-title">评价指标模板</h4>
                    </div>
                    <div class="modal-body">
                        <form class="form-horizontal" role="form" id="addTemplateForm">
                          <div class="form-group">
                          	<label class="col-sm-2 control-label">模板名称</label>
                            <div class="col-sm-6 ">
                            	<input type="hidden" name="applyBatchId" >
                                <input type="text" class="form-control" name="templateName" id="templateName" max-length="100" onchange="changeTemplateName()" placeholder="请输入内容">
                            </div>
                          </div>
                          <div class="form-group">
                          	<label class="col-sm-2 control-label">添加指标</label>
                            <div class="col-sm-6 ">
                            	<a  class="btn btn-default btn-border add_root_lev">添加一级指标</a>
                            	<a  class="btn btn-default btn-border add_same_lev">添加同级指标</a>
                            	<a  class="btn btn-default btn-border add_next_lev">添加下级指标</a>
                            	<a  class="btn btn-default btn-border edt_lev">编辑</a>
                            	<a  class="btn btn-default btn-border del_lev">删除</a>
                            </div>
                          </div>
                          <div class="form-group">
                          	<div id="treeDiv"></div>
                          </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <a class="btn btn-default btn_submit_template">提交</a>
                        <button type="button" class="btn btn-default btn_close_template" data-dismiss="modal">关闭</button>
                    </div>
                </div>
            </div>
        </div>
        <!-- 新增/编辑评价等级弹窗 -->
		<div class="modal fade" id="levelModalTable" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content" style="min-width: 1000px;">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span></button>
                        <h4 class="modal-title">管理指标等级和量化分值</h4>
                    </div>
                    <div class="modal-body">
                        <form class="form-horizontal" role="form" id="addLevelForm">
                          <div class="form-group">
                          	<label class="col-sm-2 control-label">等级名称</label>
                            <div class="col-sm-6 ">
                                <input type="text" class="form-control" max-length="100" name="levelName" id="levelName" placeholder="请输入内容">
                            </div>
                          </div>
                          <div class="form-group">
                          	<label class="col-sm-2 control-label">等级内容</label>
                            <div class="col-sm-6 ">
                            	<a  class="btn btn-default btn-border add_level">添加等级</a>
                            </div>
                          </div>
                          <div class="form-group">
                          	<label class="col-sm-2 control-label"></label>
                          	<div id="levelDiv"></div>
                          </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <a  class="btn btn-default btn_submit_level">提交</a>
                        <button type="button" class="btn btn-default btn_close_level" data-dismiss="modal">关闭</button>
                    </div>
                </div>
            </div>
        </div>
        <!-- 新增/编辑评价类型弹窗 -->
		<div class="modal fade" id="typeModalTable" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content" style="min-width: 1000px;">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span></button>
                        <h4 class="modal-title">管理评价类型</h4>
                    </div>
                    <div class="modal-body">
                        <form class="form-horizontal" role="form" id="addTypeForm">
                          <div class="form-group">
                          	<label class="col-sm-2 control-label">评价类型</label>
                            <div class="col-sm-6 ">
                                <input type="text" class="form-control" max-length="100" name="typeName" id="typeName" placeholder="请输入内容">
                            </div>
                          </div>
                          <div class="form-group">
                          	  <label class="col-sm-2 control-label">参评对象</label>
						      <div class="col-sm-6 layui-input-inline layui-form" lay-filter="roleFilter">
						        <select name="participation" lay-verify="required" title="请选择">
						          
						        </select>
						      </div>
                          </div>
                          <div class="form-group">
                          	<label class="col-sm-2 control-label">评价对象</label>
                            <div class="col-sm-6 layui-input-inline layui-form" lay-filter="roleFilter">
						        <select name="evaluated" lay-verify="required" title="请选择"></select>
						    </div>
                          </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <a  class="btn btn-default btn_submit_type">提交</a>
                        <button type="button" class="btn btn-default btn_close_type" data-dismiss="modal">关闭</button>
                    </div>
                </div>
            </div>
        </div>
        <!-- 新增评价体系弹窗 -->
		<div class="modal fade" id="sysModalTable" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content" style="min-width: 1000px;">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span></button>
                        <h4 class="modal-title">创建评价体系</h4>
                    </div>
                    <div class="modal-body">
                        <form class="form-horizontal" role="form" id="addTypeForm">
                          <div class="form-group">
                          	<label class="col-sm-2 control-label">评价体系名称</label>
                            <div class="col-sm-6 ">
                                <input type="text" class="form-control" max-length="100" name="sysName" id="sysName" placeholder="请输入内容">
                            </div>
                          </div>
                          <div class="form-group">
                          	  <label class="col-sm-2 control-label">评价指标模板</label>
						      <div class="col-sm-6 layui-input-inline" style="padding-top: 7px;">
						        <span class="temp_name"></span>
						      </div>
                          </div>
                          <div class="form-group">
                          	<label class="col-sm-2 control-label">评价指标等级</label>
                            <div class="col-sm-6 layui-input-inline" style="padding-top: 7px;">
						        <span class="level_name"></span>
						    </div>
                          </div>
                          <div class="form-group">
                          	<label class="col-sm-2 control-label">评价类型</label>
                            <div class="col-sm-6 layui-input-inline" style="padding-top: 7px;">
						        <span class="type_name"></span>
						    </div>
                          </div>
                          <div class="form-group">
                          	<label class="col-sm-2 control-label">课程类型</label>
                            <div class="col-sm-6 layui-input-inline" style="padding-top: 7px;">
						        <span class="site_type_name"></span>
						    </div>
                          </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <a  class="btn btn-default btn_submit_sys">提交</a>
                        <button type="button" class="btn btn-default btn_close_type" data-dismiss="modal">关闭</button>
                    </div>
                </div>
            </div>
        </div>
	</body>

	</html>