window.onload = function () {
	(function () {
        //login登录页部分
		//登录按钮
		$('#lof1_bt').on('click',function () {
			if (!checkValue($('.login_form1 .a1'))) {
				alert("用户名和密码不能为空~~")
			}else{
				clearValue($('.login_form1 .a1'));//将登录信息清空
				window.open("index.html","_self");//跳转到百度云首页
			}
		})
		
		//注册按钮
		$('.lof1_bt1').on('click',function () {
			$('.logion_mask').show();//z注册弹窗出现
			clearValue($('.register .a2'));//将注册信息清空
			$('.register1_bt').on('click',function () {
				if (!checkValue($('.register .a2'))) {
					alert("用户名和密码不能为空~~")
				}else{
					$('.logion_mask').fadeOut();
				}
			})
			
			//关闭注册弹窗
			$('#register_hd').on('click',function () {
				$('.logion_mask').hide();
			})
		})
		
		//百度云主页面
	    var BaiDuYun = {
	    	//默认的顶层数据
	    	currentId:0,

			//设定的开关判断值
			status:{
	    		isCreateFloder:false,
				isCreateBtnOver:false,
				isMove:false,
				isSearch:false
			},

			//获取容器
			element:{
	    		//新建文件夹的按钮
                creat_floder:document.querySelector('#creat_floder'),
	    		//容器
                container_wrap:document.querySelector('.container_wrap'),
				//全选按钮
                total:document.querySelector('.check_coin'),
				//已选文件夹个数
				count:document.querySelector('#count'),
				//所有文件的总数
                countTotal:document.querySelector('#total'),
				//删除按钮
				delet:document.querySelector('#delet'),
                //删除按钮
                rename:document.querySelector('#rename'),
				//搜索文本框
                ser_text:document.querySelector('#ser_text'),
				//搜索按钮
                ser_btn:document.querySelector('#ser_btn'),
                //面包屑导航
                nav_container:document.querySelector('#nav_container'),
                //全部文件夹
                counts_head:document.querySelector('#counts_head'),
                //移动到按钮
                take_move:document.querySelector('#take_move'),
                //移动到弹窗
                my_mask:document.querySelector('#my_mask'),
                //弹窗选项
                min_filelist:document.querySelector('#min_filelist'),
                //移动到确定按钮
                makeSure:document.querySelector('#sure'),
                //移动到取消按钮
                makeCancle:document.querySelector('#cancle'),
                //拖拽按钮
                tips:document.getElementById('tips'),
                //页面数据重置按钮
                reset_btn:document.getElementById('reset_btn')
            },


			//页面中的文件
			fileItem:[],
			//被选中的文件
			fileCheckedItem:[],
            //面包屑导航的文件夹数组
            fileNav:[],
            //移动到弹窗临时存储变量的数组
            fileWinD:[],
            //本地存储声明的数组
            dataArr:[],
	    	
	    	//初始化函数
	    	init:function () {
                var _this = this;
                if (localStorage.getItem('dta')) {
                    //从一个字符串中解析出jason对象
                    datas = JSON.parse(localStorage.getItem('dta'));
                }else{
                    //从对象中解析出字符串
                    localStorage.setItem('dta', JSON.stringify(datas));
                    if(!localStorage.getItem('daa')){
                        localStorage.setItem('daa', JSON.stringify(datas));
                    }
                }

	    		//设置容器的高
				this.element.container_wrap.style.height = window.innerHeight - 220 + 'px';
                this.element.container_wrap.style.width = window.innerWidth - 194 + 'px';
				var data = model.getChilden(this.currentId);

				//页面刚开始加载时渲染页面
				this.renderContainer(data);
				//点击新建文件夹
				this.element.creat_floder.onclick = function (e) {
                    _this.creatFloder();
                    localStorage.setItem('dta', JSON.stringify(datas));
                    e.stopPropagation();
                }

                //重命名
                this.element.rename.onclick = function (e) {
                    _this.rename(_this.fileCheckedItem);
                    localStorage.setItem('dta', JSON.stringify(datas));
                    e.stopPropagation();
                }

                //删除
                this.element.delet.onclick = function (e) {
                    _this.deleteFn(_this.fileCheckedItem);
                    localStorage.setItem('dta', JSON.stringify(datas));
                    e.stopPropagation();
                }

                //搜索
                this.element.ser_btn.onclick = function (e) {
                    _this.searchFile(e);
                    localStorage.setItem('dta', JSON.stringify(datas));
                }
                //页面样式重置
                this.element.reset_btn.onclick = function () {
                    // localStorage.clear();
                    localStorage.removeItem('dta');
                    if (localStorage.getItem('daa')) {
                        //从一个字符串中解析出jason对象
                        datas = JSON.parse(localStorage.getItem('daa'));
                    }
                    _this.renderContainer(model.getChilden(0));
                }
                //全部文件夹
                this.element.counts_head.onclick = function () {
                    _this.element.fileItem = [];
                    _this.fileNav = [];
                    _this.element.container_wrap.innerHTML = '';
                    _this.element.fileItem = model.setPid();
                    datas = model.setPid();
                    _this.renderContainer(_this.element.fileItem);
                    _this.renderHeadNav(_this.fileNav);
                    localStorage.setItem('dta', JSON.stringify(datas));
                }

                //面包屑导航
                this.element.nav_container.onclick = function (e) {
                    _this.currentId = parseInt(model.getPid(e.target.innerHTML)[0].id);
                    if (model.getIndex(_this.currentId,_this.fileNav) != -1){
                        var _index = model.getIndex(_this.currentId,_this.fileNav);
                        _this.fileNav.splice(_index+1);
                        _this.renderContainer(model.getChilden(_this.currentId));
                        _this.renderHeadNav(_this.fileNav);
                        localStorage.setItem('dta', JSON.stringify(datas));
                    }
                }

                //移动到
                this.element.take_move.onclick = function () {
                    _this.element.my_mask.style.display = 'block';
                    _this.renderMask(datas);
                    var lis = min_filelist.getElementsByTagName('li');
                    // console.log(lis)
                    for (let i=0;i<lis.length;i++){
                        lis[i].onclick = function () {
                            for(let i=0;i<lis.length;i++){
                                lis[i].className = '';
                            }
                            lis[i].className = 'active3';
                            if (_this.fileWinD.length){
                                _this.fileWinD.shift();
                            }
                            _this.fileWinD.push(lis[i]);
                        }
                    }
                }

                //移动到：确定按钮
                this.element.makeSure.onclick = function () {
				    if (!_this.fileCheckedItem.length){
                        alert('请选中需要移动的文件夹')
                    }else{
				        if(!_this.fileWinD.length){
                            alert('请选中需要移动的目标文件夹')
                        }else{
                            var data = model.changeNum(_this.fileCheckedItem,_this.fileWinD);
                            model.resetDatas(data,datas);
                            //将_this.currentId设为默认的值
                            if(_this.fileCheckedItem.length == _this.fileItem.length && model.makeCurrentId(_this.fileCheckedItem)){
                                console.log(_this.fileWinD[0].getAttribute('_id'))
                                _this.currentId = _this.fileWinD[0].getAttribute('_pid');
                            }else{
                                _this.currentId = 0;
                            }
                            _this.fileCheckedItem = [];
                            _this.fileWinD = [];
                            _this.fileNav = [];
                            _this.renderContainer(model.getChilden(_this.currentId));
                            _this.renderHeadNav(_this.fileNav);
                            _this.element.my_mask.style.display = 'none';
                            localStorage.setItem('dta', JSON.stringify(datas));
                        }
                    }
                }

                //移动到：取消按钮
                this.element.makeCancle.onclick = function () {
                    _this.fileCheckedItem = [];
                    _this.fileWinD = [];
                    _this.renderContainer(model.getChilden(_this.currentId));
                    _this.element.my_mask.style.display = 'none';
                }

                //鼠标按下、拖拽、碰撞检测和点击
                document.onmousedown = function (e) {
                    var flag = _this.fileCheckedItem.indexOf(e.target) == -1 ? false : true;
					var x = e.clientX;
					var y = e.clientY;
                    var box = document.createElement('div');
                    box.id = 'box';
                    box.style.left = x + 'px';
                    box.style.top = y + 'px';
                    document.body.appendChild(box);

                    document.onmousemove = function (e) {
                        e.stopPropagation();
                        if(flag){
                            _this.element.tips.style.display = 'block';
                            _this.element.tips.innerHTML = _this.fileCheckedItem.length;
                            _this.element.tips.style.left = e.clientX + 20 + 'px';
                            _this.element.tips.style.top = e.clientY + 20 + 'px';
                        }else{
                            box.style.width = Math.abs((e.clientX - x)) + 'px';
                            box.style.height = Math.abs((e.clientY - y)) + 'px';
                            box.style.left = Math.min(x,e.clientX) + 'px';
                            box.style.top = Math.min(y,e.clientY) + 'px';

                            var wp_lis = document.querySelectorAll('.container_wrap li');

                            //box画框的位置
                            var L1 = box.offsetLeft - 194;
                            var T1 = box.offsetTop - 200;
                            var R1 = L1 + box.offsetWidth;
                            var B1 = T1 + box.offsetHeight;

                            for (var i=0;i<wp_lis.length;i++){

                                var L2 = wp_lis[i].offsetLeft;
                                var T2 = wp_lis[i].offsetTop;
                                var R2 = L2 + wp_lis[i].offsetWidth;
                                var B2 = T2 + wp_lis[i].offsetHeight;

                                var _index = _this.fileCheckedItem.indexOf(wp_lis[i]);
                                if (R1 < L2 || B1 < T2 || L1 > R2 || T1 > B2){
                                    //没有碰上
                                    if (_index != -1) {
                                        _this.fileCheckedItem.splice(_index, 1);
                                    }
                                    tools.removeClass(wp_lis[i],'active1');
                                }else{
                                    //碰上
                                    if (_index == -1){
                                        _this.fileCheckedItem.push(wp_lis[i]);
                                    }
                                    tools.addClass(wp_lis[i],'active1');
                                }

                                if (_this.fileItem.length == _this.fileCheckedItem.length){
                                    tools.addClass(_this.element.total,'active2');
                                }else {
                                    tools.removeClass(_this.element.total,'active2');
                                }
                            }
                        }
						_this.status.isMove = true;
                        //数据计算
                        _this.element.countTotal.innerHTML = datas.length;
                        _this.element.count.innerHTML = _this.fileCheckedItem.length;
                    }
                    document.onmouseup = function (e) {
                    	if(!_this.status.isMove || (e.clientX - x < 15) || (e.clientY - y < 15)){

                            if (tools.hasClass(e.target,'coin')){
                    			//多选按钮
                                _this.setFileStyle(e.target.parentNode);
							}else{
                            	//点击文件夹
                            	var iElement = tools.getParent(e.target,'item');
                            	if (iElement){
                            		_this.currentId = parseInt(iElement.getAttribute('_id'));
                                    _this.fileNav.push(_this.currentId);
                            		_this.renderContainer(model.getChilden(_this.currentId));
                            		//渲染面包屑导航
                                    _this.renderHeadNav(_this.fileNav)
								}
                                _this.status.isMove = false;
							}
						}
                        _this.element.tips.style.display = 'none';
                        document.onmousemove = null;
                    	if (box){
                            document.body.removeChild(box);
                        }
                    }
                    return _this.status.isCreateFloder;
                }
	    	},

			//渲染并加载页面
	    	renderContainer:function (data) {
	    		var html = '';
	    		for (var i=0;i<data.length;i++){
	    			html += `
						<li class="floder item" _id="${data[i].id}" _pid="${data[i].pid}">
							<span class="coin"></span>
							<img src="imges/login/04.png"/>
							<input type="text" name="" id="" value="" class = "text_inpt"/>
							<div class="text_content">${data[i].name}</div>
						</li>
					`
				}
                this.element.container_wrap.innerHTML = html;

				//把生成的li存入到fileItem数组中
				var lis = this.element.container_wrap.querySelectorAll('li');
				this.fileItem = [];
                this.fileCheckedItem = [];

				for (var i=0;i<lis.length;i++){
                    this.fileItem.push(lis[i]);
				}

				//数据计算
                this.element.countTotal.innerHTML = datas.length;
                this.element.count.innerHTML = this.fileCheckedItem.length;
                //判断是否全选,点击的页面特殊，需要加上fileCheckedItem.length不为0
                if (this.fileItem.length == this.fileCheckedItem.length && this.fileCheckedItem.length != 0){
                    tools.addClass(this.element.total,'active2');
                }else {
                    tools.removeClass(this.element.total,'active2');
                }
	    	},

			//新建文件夹
			creatFloder:function () {

				var _this = this;
				//阻止多次连续点击
				if (this.status.isCreateFloder){
					return
				}
                this.status.isCreateFloder = true;
				var html = `
					<li class="floder item">
						<span class="coin"></span>
						<img src="imges/login/04.png"/>
						<input type="text" name="" id="" class = "text_inpt" value="" style="display: block"/>
						<div style="display: none" class="text_content"></div>
					</li>
				`
                this.element.container_wrap.innerHTML = html + this.element.container_wrap.innerHTML;
				var input = this.element.container_wrap.querySelector('input');

                input.focus();//获得焦点
				//失去焦点的时候
                input.onblur = function() {
                    //是否移入了创建文件夹的按钮--isCreateBtnOver
                    // //elements.head.newfile._isOver是为了处理失去焦点的时候不同的行为
					if(this.value == ''){
                        _this.element.container_wrap.removeChild(_this.element.container_wrap.querySelector('li'))
					}else {
                        model.add(_this.currentId,this.value,'folder');
                        _this.renderContainer(model.getChilden(_this.currentId));
					}
                    _this.status.isCreateFloder = false;
                }
            },

			//设置新建文件夹样式

			setFileStyle:function (li) {
                // console.log(li)
                var _index = this.fileCheckedItem.indexOf(li);
				if (_index == -1){
					//选中的数组集合中没有传进来的li，所以要给当前的li添加样式
                    tools.addClass(li,'active1');
                    this.fileCheckedItem.push(li);
				}else {
					//选中的数组集合中有传进来的li，所以要把数组中的li删除
                    tools.removeClass(li,'active1');
                    this.fileCheckedItem.splice(_index,1);
				}

				//判断是否全选
				if (this.fileItem.length == this.fileCheckedItem.length){
                    tools.addClass(this.element.total,'active2');
				}else {
                    tools.removeClass(this.element.total,'active2');
				}
                //数据计算
                this.element.countTotal.innerHTML = datas.length;
                this.element.count.innerHTML = this.fileCheckedItem.length;
            },

			//删除文件夹

			deleteFn:function (arr) {
                var data = model.getArr(arr);
                var temp = [];
                for(var i=0;i<data.length;i++){
                    temp = temp.concat(model.getAllChilden(data[i].id));
                }
                data = data.concat(temp);
                for(var i=0;i<data.length;i++){
                    for(var j=0;j<datas.length;j++){
                        if(data[i].id == datas[j].id){
                            datas.splice(j,1);
                            j--;
                        }
                    }
                }
				if (this.fileCheckedItem.length){
                    var data = model.getChilden(this.fileCheckedItem[0].getAttribute('_pid'));
                    this.renderContainer(data);
                }else{
                    alert("请选中要删除的文件")
                }
            },

            //重命名
			rename:function (arr,e) {
	    		var _this = this;
				if(arr.length == 1){
                    var active1 = document.querySelector('.active1');
					var text_inpt = document.querySelector('.active1 .text_inpt');
                    var text_content = document.querySelector('.active1 .text_content');
                    text_inpt.value = text_content.innerHTML;
                    text_inpt.style.display = 'block';
                    text_inpt.select();
                    text_content.style.display = 'none';
                    document.ondblclick = function () {
                        for (var j=0;j<datas.length;j++){
                            if (active1.getAttribute('_id') == datas[j].id){
                                datas[j].name = text_inpt.value;
                            }
                        }
                        text_content.innerHTML = text_inpt.value;
                        text_inpt.style.display = 'none';
                        text_content.style.display = 'block';
                        tools.removeClass(active1,'active1');
                        _this.fileCheckedItem = [];
                        if(_this.fileCheckedItem.length == 0){
                            _this.element.count.innerHTML = 0;
						}
                    }
				}else {
                    alert('请选中需要更改的文件夹')
				}
            },

            //搜索文件
            searchFile:function (e) {
                this.element.ser_text.focus();
                this.element.ser_text.style.width = '178px';
                e.stopPropagation();
                var val = this.element.ser_text.value;
                // var _index = datas.
                if(val){
                    if(model.findName(val).length != 0){
                        this.fileItem = [];
                        this.fileItem = model.findName(val);
                        this.renderContainer(this.fileItem);
                    }
                }
            },

            //生成面包屑导航
            renderHeadNav:function (data) {
                var html = '';
	    	    var arr = [];
                for (var i=0;i<data.length;i++){
                    arr.push(model.getName(data[i]));
                }
                if(arr.length){
                    for (var i=0;i<arr.length;i++){
                        html += `
                        <div class="fl counts_text">${arr[i].name}</div>
                    `
                    }
                    this.element.nav_container.innerHTML = html;
                }else{
                    this.element.nav_container.innerHTML = '';
                }
            },

            //生成移动到弹窗
            renderMask:function (data) {
                var html = '';
                for (var i=0;i<data.length;i++){
                    html += `
                        <li _id="${data[i].id}" _pid="${data[i].pid}">
                            <em class="fl"></em>
                            <span class="fl"></span>
                            ${data[i].name}
                        </li>
                    `
                }
                this.element.min_filelist.innerHTML = html;
            }
	    }
	    
	    BaiDuYun.init();

    }())

}