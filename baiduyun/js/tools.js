//工具函数，查找父级，操作classname
var tools = {
	
	//找到父级
	getParent:function (element,classname) {
		
		var parent = element.parentNode;
		
		if (!parent || parent == document) {
			return null
		}
		
		if (this.hasClass(parent,classname)) {
			return parent;
		}
		return this.getParent(parent,classname);
	},
	
	//判断是否有class
	hasClass:function (element,classname) {
		
		//把className转成数组
		var classes = element.className.split(' ');
		
		//为-1的时候是没有，不为-1的时候为有
		return classes.indexOf(classname) == -1 ? false : true;
	},
	
	//添加class
	addClass:function (element,classname) {
		var classes = element.className.split(' ');
		if (classes.indexOf(classname) == -1) {
			classes.push(classname);
			element.className = classes.join(' ');
		}
	},
	
	//删除class
	removeClass:function (element,classname) {
		var classes = element.className.split(' ');
		var _index = classes.indexOf(classname);
		if (_index != -1) {
			classes.splice(_index,1);
			element.className = classes.join(' ');
		}
	}
};



