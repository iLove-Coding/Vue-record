  //1.先从localStorage中取值
    let dataArr = JSON.parse(localStorage.getItem('todoData')) || [];
    //自定义指令解决输入框自动获取焦点问题
    // Vue.directive('focus', {
    //     update(el, binding) {
    //         console.log('update')
    //         el.focus();
    //     }
    // })
    let vm = new Vue({
        el: '#wrap',
        data: {
            list: dataArr,
            todo: '',
            editId: -1,
            editTitle: '',
            hash: 'active' //active completed
        },
        //深度监控list的变化，当list改变更新localStorage中的数据
        watch: {
            list: {
                deep: true,
                handler() {
                    console.log('list发生了变化');
                    localStorage.setItem('todoData', JSON.stringify(this.list));
                }
            }
        },
        computed: {
            // isCheckedAll: {
            //     get() {
            //         return this.list.every((elt) => elt.completed);
            //     },
            //     set(newValue) {
            //         this.list.forEach(elt => item.completed = newValue);
            //     }

            // }
            //是否全部选中
            isCheckedAll() {
                return this.list.every((elt) => elt.completed);
            },
            //计算未选中的todo的长度
            unCheckNum() {
                return this.list.filter((elt) => !elt.completed).length;
            },
            //根据hash过滤数据
            filterList() {
                switch (this.hash) {
                    case 'all':
                        return this.list;
                        break;
                    case 'active':
                        return this.list.filter((elt) => !elt.completed);
                    case 'completed':
                        return this.list.filter((elt) => elt.completed);
                    default:
                        break;
                }
            },
            //是否存在todo
            haveTodo() {
                return Boolean(this.list.length);
            }
        },
        methods: {
            //添加todo
            addTodo() {
                if (this.todo) {
                    this.list.push({
                        id: Math.random() + Date.now(),
                        title: this.todo,
                        completed: false
                    })
                }

                console.log(localStorage)
                this.todo = "";
            },
            //删除todo
            delTodo(id) {
                this.list = this.list.filter((elt) => elt.id != id);
            },
            //编辑
            editTodo(item, index) {
                //保存id
                this.editId = item.id;
                //保存title
                this.editTitle = item.title;
                //自动获取焦点
                this.$nextTick(() => {
                    console.log(this.$refs[index])
                    this.$refs.editInput[index].focus();
                })
            },
            //编辑完成
            editDone(item) {
                this.editId = -1;
                //判断是否为空,trim():去掉首尾空格
                if (item.title.trim() === '') {
                    this.delTodo(item.id);
                }
            },
            //取消编辑
            cancelEdit(item) {
                this.editId = -1;
                //如果要取消编辑，把保存编辑之前的值给到现在取消编辑的数据的title
                item.title = this.editTitle;
            },
            //完成/未完成状态切换
            isComplete(id) {
                this.list.map((elt) => {
                    if (elt.id === id) {
                        elt.completed = !elt.completed;
                    }
                })
            },
            //全选/取消全选
            checkAll() {
                if (this.isCheckedAll) {
                    this.list.forEach((elt) => elt.completed = false);
                } else {
                    this.list.forEach((elt) => elt.completed = true);
                }
            },
            //删除已完成
            delAllCompleted() {
                this.list = this.list.filter(elt => !elt.completed);
            }
        }
    })
    //监听hash的变化
    window.onhashchange = function () {
        let hash = window.location.hash.slice(1);
        if (hash) {
            vm.hash = hash;
        } else {
            vm.hash = 'all';
        }
    }
    window.onhashchange();