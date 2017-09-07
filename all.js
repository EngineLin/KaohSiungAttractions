// 宣告全域變數
var app;
var map;
var jsonData = [];
var zoneData = [];
var filerData = [];

// 高雄旅遊景點JSON
var xhr = new XMLHttpRequest();
xhr.open('get','http://data.kcg.gov.tw/api/action/datastore_search?resource_id=92290ee5-6e61-456f-80c0-249eae2fcc97',true);
xhr.send(null);

// 等待JSON載入後設定下方程序
xhr.onload = function(){
	jsonData = JSON.parse(xhr.responseText).result.records;
	var len = jsonData.length;
	//初始的filer放入第一頁資料
	function enterFilerData(){
		for (var i=0; i<20; i++){
			filerData.push(jsonData[i]);
		};
	};
	enterFilerData()
	
	//為資料插入自定義ID序號
	function countIdNum(){
		for (var i=0; i<len; i++){
			jsonData[i].idNum = i
		};
	};
	countIdNum();

	//整理出不重複的ZoneList
	function countZoneData(){
		for (var i=0; i<len; i++){
			var j = zoneData.indexOf(jsonData[i].Zone);
			if ( j == -1){
				zoneData.push(jsonData[i].Zone);
			};
		};
	};
	countZoneData();

	// Vue.js建立
	app = new Vue({
		el: '#app',
		data: {
			database : jsonData,
			filer: filerData,
			zoneList : zoneData,
			zoneBtn : ['苓雅區','三民區','新興區','鹽埕區'],
			showPageList : true,
			pageNum : 1,
			title : "所有景點 第一頁"
		},
		//methods搭配v-on做監聽反應
		methods:{
			// 選單切換資料方式
			changeContentBySelector: function(thisValue){
				this.filer = [];
				this.showPageList = false;
				this.title = thisValue;
				for (var i=0; i<len; i++){
					if (thisValue == jsonData[i].Zone){
						this.filer.push(jsonData[i]);
					};
				};
				filerData = this.filer;
				initMap()
			},
			// 熱門按鈕切換資料方式
			changeContentByBtn: function(btnNum){
				this.filer = [];
				this.showPageList = false;
				this.title = this.zoneBtn[btnNum];
				for (var i=0; i<len; i++){
					if (this.zoneBtn[btnNum] == jsonData[i].Zone){
						this.filer.push(jsonData[i])
					};
				};
				filerData = this.filer;
				initMap()
			},
			// 頁數按鈕切換資料方式
			changeContentByPageBtn: function(num){
				this.filer = [];
				this.pageNum = ((num/20)+1);
				this.title = "所有景點 第" + this.pageNum + "頁";
				for(i=num;i<(num+20);i++){
					this.filer.push(jsonData[i])
				};
				filerData = this.filer;
				initMap()
			},
			// 往前一頁按鈕切換資料方式
			changeContentByPageBack: function(e){
				if (this.pageNum !== 1){
					this.filer = [];
					var num = (this.pageNum);
					num = ((num-2)*20);
					for(i=num;i<(num+20);i++){
						this.filer.push(jsonData[i])
					};
					this.pageNum -= 1;
					filerData = this.filer;
					initMap()	
				}else{
					alert('這已經是最前面一頁囉:D');
				};
			},
			// 往後一頁按鈕切換資料方式
			changeContentByPageNext: function(e){
				if (this.pageNum !==5){
					this.filer = [];
					var num = (this.pageNum);
					num = (num*20);
					for(i=num;i<(num+20);i++){
						this.filer.push(jsonData[i])
					};
					this.pageNum += 1;
					filerData = this.filer;
					initMap()
				}else{
					alert('這已經是最後一頁囉:D');
				};
			},
		},
		//邏輯運算即時更動數據
		computed:{}, 
	});

	// Google Map API 設定
	function initMap(){
		map = new google.maps.Map(document.getElementById('map'), {
			center: {lat: 22.716052, lng: 120.423959},
			zoom: 11,
		  });
		for (var i=0;i<filerData.length;i++){
			var marker = new google.maps.Marker({
				position : {lat: parseFloat(filerData[i].Py),lng: parseFloat(filerData[i].Px)},
				map: map,
				title : filerData[i].Name
			});
		}
	};
	initMap();
};

