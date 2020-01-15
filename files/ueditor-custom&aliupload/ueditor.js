/**
 * 自定义指令（图片上传到阿里云并插入）
*/
UE.commands['cstimgup'] = {
    execCommand : function( cmdName) {
        var me = this
        if (ICloud) {
        	function selUpFile() {
        		var dmfile = document.createElement('input')
        		dmfile.type = 'file'
        		dmfile.accept = 'image/*'
        		dmfile.onchange = function() {
        			var file = this.files[0]
        			if (file.type.indexOf('image/') < 0) {
        				alert('仅可以上传图片')
        				return false
        			}
        			UE.icloud.upAliNoProgress(file, false, fileback)
        			this.remove()
        		}
        		dmfile.click()
        	}
        	if (UE.icloud) {
        		selUpFile()
        	} else {
        		UE.icloud = new ICloud({baseRoot})
        		UE.icloud.getUploadParam().then(res => {
        			selUpFile()
        		})
        	}
        } else {
        	alert('缺少插件')
        	return false
        }
        function fileback(url) {
        	// TODO 可以加上文件名的title和alt，以及loading加载中
        	const img = `<img src=${url}>`
            me.focus();
            me.execCommand('inserthtml',img);
        }
    }
}

/*css是直接使用的原上传图片的icon*/
/*.edui-default  .edui-for-simpleupload  .edui-icon, .edui-default  .edui-for-cstimgup .edui-icon {
    background-position: -380px 0px;
}*/