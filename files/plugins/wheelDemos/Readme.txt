�������ϴ���װdemo
ʹ��ʾ����
window.iCloud = new ICloud()
	iCloud.getUploadParam().then(data => {
		iCloud.uploadInit(null, '', data.accessid, data.accesskey, data.host, data.signature, data.policy)
		aliCloud.install('selectfiles', 'container')
	})