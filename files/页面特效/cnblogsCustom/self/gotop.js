var topTimer = setInterval(function(){
if (document.documentElement.scrollTop || document.body.scrollTop) {
$(".go-top").fadeIn()
}else{
$(".go-top").fadeOut(800)
}
}, 300)
 let gototop = document.getElementsByClassName("go-top")[0];

    gototop .onclick = function () {
// �����ʱ��
            clearInterval(timer);  
            // ���嶨ʱ��
            var timer = setInterval(function() {  
                // ��ȡ��������
                let scrollHeight = document.documentElement.scrollTop || document.body.scrollTop;  
                // ���岽��
                let speed = -(scrollHeight / 14);    
                // �жϲ�����ȡ�� 
                speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);  
                // �����������Ϊ0��֤��������Ļ�����������ʱ��
                if (scrollHeight === 0) clearInterval(timer);                             
                // ��ʼ���������������������
                document.documentElement.scrollTop = scrollHeight + speed;    
                document.body.scrollTop = scrollHeight + speed;      
            }, 14); 
            // ��������ֹ������жϹ���
            window.onmousewheel = function(){
                clearInterval(timer);
            }
}