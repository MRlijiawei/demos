;(function() {
	var ICloud = function(fileType='aliCloud', model='upload', showProgress=false) {
		this.fileType = fileType,// default--默认，aliCloud--阿里云
		this.model = model,// 上传，下载，预览
		this.showProgress = showProgress// 是否显示进度
	}
	ICloud.prototype = {
		constructor: ICloud,
		getDownloadUrl: function() {
			return ''
		},
		getUploadParam: function() {
			if (this.fileType === 'aliCloud') {
				return new Promise((resolve, reject) => {
					$.ajax({
						method: 'get',
						url: baseRoot + 'getYunInformation',
						dataType: 'json',
						success: function(data) {
							resolve(data.data)
						},
						error: function(err) {
							console.error('get AliCloud error')
						}
					})
				})
			}
		},
		uploadInit: function(file, fileName, accId, accKey, host, signature, policy) {
			if (this.fileType === 'aliCloud') {
				//
				if (this.showProgress) {
					window.upProgress = new UpProgress()
				}
				window.aliCloud = new AliCloud(file, fileName, accId, accKey, host, signature, policy)
			}
		}
	}
	//window.iCloud = new ICloud()
	_global = (function(){ return this || (0, eval)('this'); }());
	if (typeof module !== "undefined" && module.exports) {
		module.exports = ICloud;// 兼容CommonJs规范
	} else if (typeof define === "function" && define.amd) {
		define(function(){return ICloud;});// 兼容AMD/CMD规范
	} else {
		// 注册到this，即全局window
		!('ICloud' in _global) && (_global.ICloud = ICloud);
	}
}())