class ICloud {
	constructor({
		baseRoot,
		fileType = 'aliCloud',// default--默认，aliCloud--阿里云
		showProgress=false,// 是否显示进度
		model='upload',// 上传，下载，预览
		publicDomain = 'http://xxx.oss-cn-beijing.aliyuncs.com',
		storageId,
		policy,
		OSSAccessKeyId,
		success_action_status= '200',
		signature,
		host,
		g_object_name_type = 'random_name',
		g_dirname = ''
	}){
        this.fileType = fileType
        this.showProgress = showProgress
        this.model = model
        this.publicDomain = publicDomain
        this.storageId = storageId
        this.policy = policy
        this.OSSAccessKeyId = OSSAccessKeyId
        this.success_action_status = success_action_status
        this.signature = signature
        this.baseRoot = baseRoot
        this.host = host
        this.g_object_name_type = g_object_name_type
        this.g_dirname = g_dirname
        this.storageId = storageId
    }
	//文件大小处理，单位换算
	dealWithSize(size) {
		let dw = "B";
		if(!size) {
			size = 0;
		}
		let filesize_show = parseInt(size);
		if (filesize_show >= 1024) {
			dw = "K";
			filesize_show = (filesize_show / 1024).toFixed(1);
		}
		if (filesize_show >= 1024) {
			dw = "M";
			filesize_show = (filesize_show / 1024).toFixed(1);
		}
		if (filesize_show >= 1024) {
			dw = "G";
			filesize_show = (filesize_show / 1024).toFixed(1);
		}
		return filesize_show + dw;
	}
	//时间处理（处理.0）
	dealWithTime(time) {
		if (time) {
			let date = new Date(time);
			let y = date.getFullYear();
			let m = date.getMonth() + 1;
			m = m < 10 ? ('0' + m) : m;
			let d = date.getDate();
			d = d < 10 ? ('0' + d) : d;
			let h = date.getHours();
			h = h < 10 ? ('0' + h) : h;
			let minute = date.getMinutes();
			let second = date.getSeconds();
			minute = minute < 10 ? ('0' + minute) : minute;
			second = second < 10 ? ('0' + second) : second;
			return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
		} else {
			return time;
		}
	}
	get_suffix(filename) {
	    let pos = filename.lastIndexOf('.')
	    let suffix = ''
	    if (pos != -1) {
	        suffix = filename.substring(pos)
	    }
	    return suffix;
	}
	random_string(len = 32) {
		let chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
		let maxPos = chars.length
		let pwd = ''
		for (let i = 0; i < len; i++) {
			pwd += chars.charAt(Math.floor(Math.random() * maxPos))
		}
	    return pwd
	}
	calculate_object_name(filename) {
		let g_object_name = ''
	    if (this.g_object_name_type == 'local_name')
	    {
	    	g_object_name += "${filename}"
	    }
	    else if (this.g_object_name_type == 'random_name')
	    {
	    	let suffix = this.get_suffix(filename)
			// 文件名称生成唯一，避免同名被覆盖。便于查找，规则：时间+名称+随机码
	    	g_object_name = this.g_dirname + +(new Date()) + filename + this.random_string(10) + suffix
	    }
	    // return ''
	    return g_object_name// 网盘使用
	}
	successCallback(file) {
		let _that = this
		return new Promise((resolve, reject) => {
			let loading
			$.ajax({
				type: 'post',
				url: _that.baseRoot + 'yunUploadFile',
				dataType: 'json',
				contentType: 'application/json',
				data: JSON.stringify({
					attachmentName: file.name,
					"fileSize": file.size,
				    "mimeType": file.type,
				    "storageId": _that.storageId,
				    "bizType": "2"
				}),
				beforeSend: function() {
					if (layer) {
						loading = layer.load()
					}
				},
				success: function(data) {
					resolve(data)
				},
				error: function(err) {
					console.error('AliCloud upload error')
					reject(err)
				}
			}).always(function() {
				if (layer) {
					layer.close(loading)
				}
			})
		})
	}
	getUploadParam() {
		let loading,
			_that = this
		if (this.fileType === 'aliCloud') {
			return new Promise((resolve, reject) => {
				$.ajax({
					method: 'get',
					url: _that.baseRoot + 'getYunInformation',
					dataType: 'json',
					beforeSend: function() {
						if (layer) {
							loading = layer.load()
						}
					},
					success: function(data) {
						_that.policy = data.data.policy
						_that.OSSAccessKeyId = data.data.accessid
						_that.signature = data.data.signature
						_that.host = data.data.host
						resolve(data.data)// 使用promise可以兼容签名过期的情况
					},
					error: function(err) {
						console.error('get AliCloud error')
						reject(err)
					}
				}).always(function() {
					if (layer) {
						layer.close(loading)
					}
				})
			})
		}
	}
    downAliNoProgress(id) {
    	window.open(this.baseRoot + 'yunDownloadFile?attachmentId=' + id)
    }
    upAliNoProgress(file, needBind = true, callback) {
    	let fd = new FormData(),
			_that = this,
			time = new Date().getTime(),
			size_loaded = 0
			//,layer = layer||window
		_that.storageId = _that.calculate_object_name(file.name)
		let params = {
	    	// key--路径+名称
	        'key' : this.storageId,
	        'policy': this.policy,
	        'OSSAccessKeyId': this.OSSAccessKeyId, 
	        'success_action_status' : this.success_action_status //让服务端返回200,不然，默认会返回204
	        ,'signature': this.signature,
	        file
	    }
		for(let key in params) {
			fd.append(key, params[key])
		}
		let xhr = new XMLHttpRequest();
	
		xhr.upload.onprogress = function (e) {
			
		}
		//成功完成事件
		xhr.onload = function (e) {
			if(xhr.status == 200) {
				// 绑定
				if (needBind) {
					_that.successCallback(file).then(res => {
						if (callback) {
							callback(res)
						}
					})
				} else {
					if (callback) {
						// 如果不需要绑定，则直接返回地址（）
						callback(_that.host + _that.g_dirname + '/' + _that.storageId)
					}
				}
			} else {
				// layer.alert(res.msg);
			}
	
		}
		 xhr.ontimeout = function(e) {
			 console.log('超时')
		 };
		//发生错误
		xhr.onerror = function (e) {
			console.log("发生错误");
		}
		//取消时
		xhr.onabort = function (e) {
			
		}
		//停止上传时
		xhr.onloadend = function (e) {
			console.log("停止上传");
		}
		//发起ajax请求
		xhr.open("POST", _that.host, true);
		xhr.send(fd);
    }
    upAliWithProgress(file, num, this_parentId, needBind=true) {
    	let fd = new FormData(),
			_that = this,
			time = new Date().getTime(),
			size_loaded = 0,
			layer = layer||window
		_that.storageId = _that.calculate_object_name(file.name)
    	let params = {
        	// key--路径+名称
            'key' : this.storageId,
            'policy': this.policy,
            'OSSAccessKeyId': this.OSSAccessKeyId, 
            'success_action_status' : this.success_action_status //让服务端返回200,不然，默认会返回204
            ,'signature': this.signature,
            file
        }
    	for(let key in params) {
    		fd.append(key, params[key])
    	}
    	let xhr = new XMLHttpRequest();

    	xhr.upload.onprogress = function (e) {
    		if (e.lengthComputable) { //文件长度是否可计算
    			let percent = Math.round(e.loaded * 99 / e.total);
    			$("#sc_" + num).find(".precent").text(percent + "%");
    			let _time = new Date().getTime();
    			console.log(e.loaded);
    			if (_time - time > 500) {
    				$("#sc_" + num).find(".speedLab").html("(" + _that.dealWithSize((e.loaded - size_loaded) * 1000 / (_time - time)) + "/s)");
    				time = _time;
    			}
    			size_loaded = e.loaded;
    			$("#sc_" + num).find(".process").css("width", percent + "%");

    		} else {
    			console.log("文件长度不可计算");
    		}
    	}

    	$("#sc_" + num).find(".cancel-icon").off().on("click", function () {
    		xhr.abort();

    		$(this).hide();
    		$(this).parent().prev().children('.cancel').css('display', 'block').siblings().css('display', 'none');
    	});
    	//成功完成事件
    	xhr.onload = function (e) {
    		if(xhr.status == 200) {
    			// 99%
    			$("#sc_" + num).find(".precent").text("99%");
    			$("#sc_" + num).find(".process").css("width", "99%")
    			// 绑定
    			if (needBind) {
					_that.successCallback(file).then(res => {
						if (res.code === 1) {
							$("#sc_" + num).find(".process").css("display", "none");
							$("#sc_" + num).find(".file-status>.uploading").css("display", "none");
							$("#sc_" + num).find(".file-status>.transcoding").css("display", "none");
							$("#sc_" + num).find(".file-status>.success-upload").css("display", "block");
							$("#sc_" + num).find(".file-operate2").css("display", "none");
						}
						if (callback) {
							callback(res)
						}
					})
				} else {
					if (callback) {
						callback(res)
					}
				}
    		} else {
    			//alert("信息写入失败");
                $("#sc_" + num).find(".process").css("display", "none");
                $("#sc_" + num).find(".file-status>.uploading").css("display", "none");
                $("#sc_" + num).find(".file-status>.transcoding").css("display", "none");
                $("#sc_" + num).find(".file-status>.success-upload").css("display", "none");
                $("#sc_" + num).find(".file-status>.fail-upload").css("display", "block");
                $("#sc_" + num).find(".file-operate2").css("display", "none");
    			layer.alert(ret.msg);
    		}

    	}
    	 xhr.ontimeout = function(e) {
    		 console.log('超时')
    	 };
    	//发生错误
    	xhr.onerror = function (e) {
    		console.log("发生错误");
    	}
    	//取消时
    	xhr.onabort = function (e) {
    		$("#sc_" + num).find(".process").css("display", "none");
    	}
    	//停止上传时
    	xhr.onloadend = function (e) {
    		console.log("停止上传");
    	}
    	//发起ajax请求
    	xhr.open("POST", _that.host, true);
    	xhr.send(fd);
    }                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
}