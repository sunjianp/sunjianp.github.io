//数据模型，进行数据操作

var model = {
	//获取最大的id值
	getMaxId:function () {
		var maxid = 0;
		for (var i=0;i<datas.length;i++) {
			if (datas[i].id > maxid) {
				maxid = datas[i].id;
			}
		}
		return maxid;
	},
	
	//获取同一级所有的子数据
	getChilden:function (pid) {
		var result = [];
		for (var i=0;i<datas.length;i++) {
			if (datas[i].pid == pid) {
				result.push(datas[i]);
			}
		}
		return result;
	},

	//将元素数组转成类似于datas的对象数组

	getArr:function (arr) {

		var res = [];
		for (var i=0;i<arr.length;i++){
			for (var j=0;j<datas.length;j++){
                // console.log(arr[i].getAttribute('_id'))
				if (arr[i].getAttribute('_id') == datas[j].id){
					res.push(datas[j])
				}
			}
		}
		return res
    },

	//递归获取子数据
    getAllChilden:function (id) {
        var result = this.getChilden(id);//获取同一级所有的子数据
        for (var i=0;i<result.length;i++) {
            var arr = this.getAllChilden(result[i].id);
            result = result.concat(arr);
        }
        return result;
    },
	
	//为datas添加数据
	add:function (pid,name,type) {
		datas.push({
			id: this.getMaxId()+1,
	        pid: pid,
	        name: name,
	        type: type
		})
	},

	//数据查重

	findName:function (v) {
		var res = [];
		for (var i=0;i<datas.length;i++){
			if (v == datas[i].name){
				res.push(datas[i])
			}
		}
		return res
    },

    //点击全部文件，设置所有的文件的pid为0
	setPid:function () {
		var res = [];
        for (var i=0;i<datas.length;i++){
            datas[i].pid = 0;
			res.push(datas[i]);
        }
		return res
    },

	//获取data的name
    getName:function (v) {
        for (var i=0;i<datas.length;i++){
            if (v == datas[i].id){
                return datas[i];
            }
        }
    },

	//获得相同name的所有的pid集合
    getPid:function (v) {
		var res = [];
        for (var i=0;i<datas.length;i++){
            if (v == datas[i].name){
                res.push(datas[i])
            }
        }
        return res
    },

	//数组查重
	getIndex:function (v,arr) {
        for (var i=0;i<arr.length;i++){
            if (v == arr[i]){
                return i;
            }
        }
        return -1
    },

	//调换数据,重新设置传入的数据的pid
	changeNum:function (data1,data2) {
		var a = data2[0].getAttribute('_id');
		// console.log(a)
		for (var i=0;i<data1.length;i++){
			if (data1[i].getAttribute('_id') != a){
                data1[i].setAttribute('_pid',a);
			}
		}
		return data1;
    },

	//datas数据重置
	resetDatas:function (data1,data2) {
		for (var i=0;i<data1.length;i++){
			for (var j=0;j<data2.length;j++){
				if (data1[i].getAttribute('_id') == data2[j].id){
                    data2[j].pid = data1[i].getAttribute('_pid');
				}
			}
		}
		return data2
    },

	//确认是否选中的是根目录pid为0的时候的数据
	makeCurrentId:function (data1) {

		for(var i=0;i<data1.length;i++){
			if(data1[i].getAttribute('_pid') == 0){
				return false
			}
		}
		return true
    }

};
