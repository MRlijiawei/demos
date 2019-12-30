;(function(_global) {
	var AliCloud = function(file, fileName, accId, accKey, host, signature, policy) {
		this.upParams = {
			name: fileName,
			OSSAccessKeyId: accId,
			key: accKey,///////////
			policy,
			signature,
			success_action_status: '200',
			file,
			host
		}
		this.g_object_name_type = 'local_name'
		this.g_object_name = ''
		this.suffix = ''
		this.g_dirname = ''
		this.fileIndex = 0
	}
	AliCloud.prototype = {
		contructor: AliCloud,
		calculate_object_name: function(filename) {
		    if (this.g_object_name_type == 'local_name')
		    {
		    	this.g_object_name += "${filename}"
		    }
		    else if (this.g_object_name_type == 'random_name')
		    {
		    	this.suffix = this.get_suffix(filename)
		        this.g_object_name = this.g_dirname + this.random_string(10) + this.suffix
		    }
		    return ''
		},
		random_string: function(len = 32) {
			var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
			var maxPos = chars.length
			var pwd = ''
			for (i = 0; i < len; i++) {
				pwd += chars.charAt(Math.floor(Math.random() * maxPos))
			}
		    return pwd
		},
		get_suffix: function(filename) {
		    pos = filename.lastIndexOf('.')
		    var suffix = ''
		    if (pos != -1) {
		        suffix = filename.substring(pos)
		    }
		    return suffix;
		},
		set_upload_param: function(up, filename, ret) {
			this.g_object_name = this.g_dirname;
		    if (filename != '') {
		        this.suffix = this.get_suffix(filename)
		        this.calculate_object_name(filename)
		    }
		    var new_multipart_params = {
		    	// key--路径+名称
		        'key' : this.g_object_name,
		        'policy': this.upParams.policy,
		        'OSSAccessKeyId': this.upParams.OSSAccessKeyId, 
		        'success_action_status' : '200' //让服务端返回200,不然，默认会返回204
		        ,'signature': this.upParams.signature,
		    };

		    up.setOption({
		        'url': this.upParams.host,
		        'multipart_params': new_multipart_params
		    });

		    up.start();
		},
		successCallback: function(file) {
			alert('success')
		},
		failedCallback: function(file, info) {
			alert('error')
		},
		install: function(selId, containerId, upId, multi = false) {
			var _that = this
			var aliUploader = new plupload.Uploader({
				runtimes : 'html5,flash,silverlight,html4',
				browse_button : selId, 
			    multi_selection: multi,
				container: document.getElementById(containerId),
			    url : 'http://oss.aliyuncs.com',

				init: {
					PostInit: function() {
						// document.getElementById('ossfile').innerHTML = '';
						if (upId) {
							document.getElementById(upId).onclick = function() {
								_that.set_upload_param(aliUploader, '', false);
					            return false;
							};
						}
					},

					FilesAdded: function(up, files) {
						/*plupload.each(files, function(file) {
							document.getElementById('ossfile').innerHTML += '<div id="' + file.id + '">' + file.name + ' (' + plupload.formatSize(file.size) + ')<b></b>'
							+'<div class="progress"><div class="progress-bar" style="width: 0%"></div></div>'
							+'</div>';
						});*/
						if (!upId) {
							_that.set_upload_param(aliUploader, '', false)
						}
					},

					BeforeUpload: function(up, file) {
			            /*check_object_radio();
			            get_dirname();*/
						_that.set_upload_param(up, file.name, true);
						if (window.upProgress) {
							_that.fileIndex = window.upProgress.newFileAdded(file)
						}
			        },

					UploadProgress: function(up, file) {
						/*var d = document.getElementById(file.id);
						d.getElementsByTagName('b')[0].innerHTML = '<span>' + file.percent + "%</span>";
			            var prog = d.getElementsByTagName('div')[0];
						var progBar = prog.getElementsByTagName('div')[0]
						progBar.style.width= 2*file.percent+'px';
						progBar.setAttribute('aria-valuenow', file.percent);*/
						if (window.upProgress) {
							window.upProgress.uptProgress(_that.fileIndex, file.percent)
						}
					},

					FileUploaded: function(up, file, info) {
			            if (info.status == 200)
			            {
			                // document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = 'upload to oss success, object name:' + get_uploaded_object_name(file.name);
			            	_that.successCallback(file)
			            }
			            else
			            {
			                // document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = info.response;
			            	_that.failedCallback(info, file)
			            } 
					},

					Error: function(up, err) {
						// document.getElementById('console').appendChild(document.createTextNode("\nError xml:" + err.response));
						_that.failedCallback(err)
					}
				}
			})
			aliUploader.init()
		}
	}
	// _global = (function(){ return this || (0, eval)('this'); }());
	if (typeof module !== "undefined" && module.exports) {
		module.exports = AliCloud;
	} else if (typeof define === "function" && define.amd) {
		define(function(){return AliCloud;});
	} else {
		!('AliCloud' in _global) && (_global.AliCloud = AliCloud);
	}
})(this)