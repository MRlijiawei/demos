阿里云上传封装demo
使用示例：
window.iCloud = new ICloud()
	iCloud.getUploadParam().then(data => {
		iCloud.uploadInit(null, '', data.accessid, data.accesskey, data.host, data.signature, data.policy)
		aliCloud.install('selectfiles', 'container')
	})