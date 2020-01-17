var transCoding = function () {
    var _self = this;
    //加码对象
    this.htmlEncode = function(html){
    	if(typeof(html) == "object") {
    		for (var key in html){
    			html[key] = this.htmlEncode(html[key]);
    		}
    		return html;
    	} else if(typeof(html) == "string") {
    		return _self.htmlEncodeByReg(html);
    	} else {
    		return html;
    	}
   }
    //解码对象
    this.htmlDecode = function(text){
    	if(typeof(text) == "object") {
    		for (var key in text){
    			text[key] = this.htmlDecode(text[key]);
    		}
    		return text;
    	} else if(typeof(text) == "string") {
    		return _self.htmlDecodeByReg(text);
    	} else {
    		return text;
    	}
    }
    this.htmlEncodeByReg = function(str){  
        var s = "";
        if(str.length == 0) return "";
        s = str.replace(/&/g,"&amp;");
        s = s.replace(/</g,"&lt;");
        s = s.replace(/>/g,"&gt;");
        s = s.replace(/ /g,"&nbsp;");
       s = s.replace(/\'/g,"&#39;");
       s = s.replace(/\"/g,"&quot;");
       return s;  
    }
    this.htmlDecodeByReg = function(str){  
    	var s = "";
    	if(str.length == 0) return "";
    	s = str.replace(/&amp;/g,"&");
    	s = s.replace(/&lt;/g,"<");
    	s = s.replace(/&gt;/g,">");
    	s = s.replace(/&nbsp;/g," ");
    	s = s.replace(/&#39;/g,"\'");
    	s = s.replace(/&quot;/g,"\"");
    	return s;  
    }
    this.transSprit = function(aimStr, filterStr) {
    	//取第一个，限参数不重复的场景使用
    	var filterIndex = aimStr.indexOf(filterStr);
    	return aimStr.substring(0, filterIndex) + aimStr.substring(filterIndex)
    	.replace(/\\\\/g, "\\")
    	;
    }
    window.htmlEncode = this.htmlEncode;
    window.htmlDecode = this.htmlDecode;
    window.htmlEncodeByReg = this.htmlEncodeByReg;
    window.htmlDecodeByReg = this.htmlDecodeByReg;
    window.transSprit = this.transSprit;
}