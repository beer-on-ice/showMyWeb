var data = {
	menu:{
		'deskMenu':[
			{
				name:'新建(W)',
				children:[
					{
						callBackName:'createFloder',
						name:'新建文件夹'
					},{
						callBackName:'createHtml',
						name:'新建网页'
					},{
						callBackName:'createExe',
						name:'新建启动器'
					}
				]
			},
			{
				name:'刷新(E)'
			},
			{
				name:'排序方式(O)',
				children:[
					{
						callBackName:'nameSort',
						name:'按照名称排序'
					},
					{
						name:'按照时间排序',
						children:[
							{
								name:'按时间倒序',
								callBackName:'timeSortB'
							},
							{
								name:'按时间正序',
								callBackName:'timeSortA',
							}
						]
					},{
						callBackName:'typeSort',
						name:'按照类型排序'
					}
				]
			},
			{
				callBackName:'uploadFile',
				name:'上传文件(U)'
			}
		],
		'fileMenu':[
			{
				callBackName:'openFile',
				name:'打开'
			},
			{
				callBackName:'renameFile',
				name:'重命名'
			},
			{
				callBackName:'deleteFile',
				name:'删除'
			},
			{
				callBackName:'copyFile',
				name:'复制到'
			},
			{
				callBackName:'moveFile',
				name:'移动到'
			}
		],
		'trashMenu':[
			{
				callBackName:'deleteAbsolute',
				name:'彻底删除'
			},
			{
				callBackName:'restore',
				name:'还原'
			}
		]
	},
	list: [
	    {
	        id: 1,
	        pid: 0,
	        type: 'floder',
	        name: '我的应用数据',
					extname:''
	    },
	    {
	        id: 2,
	        pid: 0,
	        type: 'floder',
	        name: '我的资源',
					extname:''
	    },
	    {
	        id: 4,
	        pid: 0,
	        type: 'floder',
	        name: '我的世界',
					extname:''
	    },
	    {
	        id: 5,
	        pid: 0,
	        type: 'exe',
	        name: '启动器',
					extname:''
	    },
	    {
	        id: 6,
	        pid: 0,
	        type: 'html',
	        name: '自由门',
					extname:''
	    },
	    {
	        id: 7,
	        pid: 1,
	        type: 'floder',
	        name: '前端',
					extname:''
	    },
	    {
	        id: 8,
	        pid: 1,
	        type: 'floder',
	        name: '后端',
					extname:''
	    },
	    {
	        id: 9,
	        pid: 7,
	        type: 'floder',
	        name: 'javascript',
					extname:''
	    },
	    {
	        id: 10,
	        pid: 9,
	        type: 'floder',
	        name: 'ECMAScript',
					extname:''
	    },
	    {
	        id: 11,
	        pid: 10,
	        type: 'floder',
	        name: 'ECMAScript2015',
					extname:''
	    }
	]
};
