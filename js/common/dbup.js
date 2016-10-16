var DB = {};

DB.init = function() {
	if (window.confirm('DBが初期化されます。よろしいですか？')) {
		DB.load();
	}
};

DB.load = function() {
	alasql.options.joinstar = 'overwrite';

	// 分類
	alasql('DROP TABLE IF EXISTS kind;');
	alasql('CREATE TABLE kind(id INT IDENTITY, text STRING);');
	var pkind = alasql.promise('SELECT MATRIX * FROM CSV("../data/MASTER-KIND.csv", {headers: true})').then(function(kinds) {
//		for (var i = 0; i < kinds.length; i++) {
//			var kind = kinds[i];
//			alasql('INSERT INTO kind VALUES(?,?);', kind);
//		}
		var sql = 'INSERT INTO kind VALUES ';
		var params = [];
		var vals = [];
		for (var i = 0; i < kinds.length; i++) {
		  var kind = kinds[i];
		  var qms = [];
		  for(var j = 0; j < kind.length; j++){
		    params.push(kind[j]);
		    qms.push('?');
		  }
		  vals.push('(' + qms.join(',') + ')');		  
		}
		alasql(sql + vals.join(','), params);
	});

	// アイテム
	alasql('DROP TABLE IF EXISTS item;');
	alasql('CREATE TABLE item(id INT IDENTITY, code STRING, kind INT, detail STRING, maker STRING, price INT, unit STRING );');
	var pitem = alasql.promise('SELECT MATRIX * FROM CSV("../data/MASTER-ITEM.csv", {headers: true})').then(function(items) {
//		for (var i = 0; i < items.length; i++) {
//			var item = items[i];
//			alasql('INSERT INTO item VALUES(?,?,?,?,?,?,?);', item);
//		}
		var sql = 'INSERT INTO item VALUES ';
		var params = [];
		var vals = [];
		for (var i = 0; i < items.length; i++) {
		  var item = items[i];
		  var qms = [];
		  for(var j = 0; j < item.length; j++){
		    params.push(item[j]);
		    qms.push('?');
		  }
		  vals.push('(' + qms.join(',') + ')');		  
		}
		alasql(sql + vals.join(','), params);
	});

	// 倉庫
	alasql('DROP TABLE IF EXISTS whouse;');
	alasql('CREATE TABLE whouse(id INT IDENTITY, code STRING, name STRING, addr STRING, tel STRING);');
	var pwhouse = alasql.promise('SELECT MATRIX * FROM CSV("../data/MASTER-WHOUSE.csv", {headers: true})').then(
			function(whouses) {
//				for (var i = 0; i < whouses.length; i++) {
//					var whouse = whouses[i];
//					alasql('INSERT INTO whouse VALUES(?,?,?,?);', whouse);
//				}
				var sql = 'INSERT INTO whouse VALUES ';
				var params = [];
				var vals = [];
				for (var i = 0; i < whouses.length; i++) {
				  var whouse = whouses[i];
				  var qms = [];
				  for(var j = 0; j < whouse.length; j++){
				    params.push(whouse[j]);
				    qms.push('?');
				  }
				  vals.push('(' + qms.join(',') + ')');		  
				}
				alasql(sql + vals.join(','), params);
			});

	// 在庫
	alasql('DROP TABLE IF EXISTS stock;');
	alasql('CREATE TABLE stock(id INT IDENTITY, item INT, whouse INT, balance INT, chkflag INT);');
	var pstock = alasql.promise('SELECT MATRIX * FROM CSV("../data/MASTER-STOCK.csv", {headers: true})').then(
			function(stocks) {
//				for (var i = 0; i < stocks.length; i++) {
//					var stock = stocks[i];
//					alasql('INSERT INTO stock VALUES(?,?,?,?,?);', stock);
//				}
				var sql = 'INSERT INTO stock VALUES ';
				var params = [];
				var vals = [];
				for (var i = 0; i < stocks.length; i++) {
				  var stock = stocks[i];
				  var qms = [];
				  for(var j = 0; j < stock.length; j++){
				    params.push(stock[j]);
				    qms.push('?');
				  }
				  vals.push('(' + qms.join(',') + ')');		  
				}
				alasql(sql + vals.join(','), params);
			});

	// トランザクション
	alasql('DROP TABLE IF EXISTS trans;');
	alasql('CREATE TABLE trans(id INT IDENTITY, stock INT, date DATE, qty INT, balance INT, memo STRING);');
	var ptrans = alasql.promise('SELECT MATRIX * FROM CSV("../data/TRANS-LIST.csv", {headers: true})').then(
			function(transs) {
//				for (var i = 0; i < transs.length; i++) {
//					var trans = transs[i];
//					alasql('INSERT INTO trans VALUES(?,?,?,?,?,?);', trans);
//				}
				var sql = 'INSERT INTO trans VALUES ';
				var params = [];
				var vals = [];
				for (var i = 0; i < transs.length; i++) {
				  var trans = transs[i];
				  var qms = [];
				  for(var j = 0; j < trans.length; j++){
				    params.push(trans[j]);
				    qms.push('?');
				  }
				  vals.push('(' + qms.join(',') + ')');		  
				}
				alasql(sql + vals.join(','), params);
			});
	
	// 上下限値
	alasql('DROP TABLE IF EXISTS limits;');
	alasql('CREATE TABLE limits(id INT, item INT, whouse INT, ul INT, ll INT );');
	var plimit = alasql.promise('SELECT MATRIX * FROM CSV("../data/SETTING-LIMITS.csv", {headers: true})').then(
			function(limits) {
//				for (var i = 0; i < limits.length; i++) {
//					var limit = limits[i];
//					alasql('INSERT INTO limits VALUES(?,?,?,?);', limit);
//				}
				var sql = 'INSERT INTO limits VALUES ';
				var params = [];
				var vals = [];
				for (var i = 0; i < limits.length; i++) {
				  var limit = limits[i];
				  var qms = [];
				  for(var j = 0; j < limit.length; j++){
				    params.push(limit[j]);
				    qms.push('?');
				  }
				  vals.push('(' + qms.join(',') + ')');		  
				}
				alasql(sql + vals.join(','), params);
			});
	
	// 設定
	alasql('DROP TABLE IF EXISTS setting;');
	alasql('CREATE TABLE setting(id INT, ckey STRING, svalue STRING);');
	var psetting = alasql.promise('SELECT MATRIX * FROM CSV("../data/SETTING-SETTING.csv", {headers: true})').then(
			function(settings) {
//				for (var i = 0; i < settings.length; i++) {
//					var setting = settings[i];
//					alasql('INSERT INTO setting VALUES(?,?,?);', setting);
//				}	
				var sql = 'INSERT INTO setting VALUES ';
				var params = [];
				var vals = [];
				for (var i = 0; i < settings.length; i++) {
				  var setting = settings[i];
				  var qms = [];
				  for(var j = 0; j < setting.length; j++){
				    params.push(setting[j]);
				    qms.push('?');
				  }
				  vals.push('(' + qms.join(',') + ')');		  
				}
				alasql(sql + vals.join(','), params);
			});
	
	// チェック結果一覧
	alasql('DROP TABLE IF EXISTS checklist;');
	alasql('CREATE TABLE checklist(id INT, whouse STRING, chkname STRING, chkdate DATE, cfmname STRING, cfmdate DATE, cfmflag INT);');
	var pchecklist = alasql.promise('SELECT MATRIX * FROM CSV("../data/CHECK-LIST.csv", {headers: true})').then(
			function(checklists) {
//				for (var i = 0; i < checklists.length; i++) {
//					var checklist = checklists[i];
//					alasql('INSERT INTO checklist VALUES(?,?,?,?,?,?,?);', checklist);
//				}
				var sql = 'INSERT INTO checklist VALUES ';
				var params = [];
				var vals = [];
				for (var i = 0; i < checklists.length; i++) {
				  var checklist = checklists[i];
				  var qms = [];
				  for(var j = 0; j < checklist.length; j++){
				    params.push(checklist[j]);
				    qms.push('?');
				  }
				  vals.push('(' + qms.join(',') + ')');		  
				}
				alasql(sql + vals.join(','), params);
			});
	
	// チェック結果詳細
	alasql('DROP TABLE IF EXISTS checkdetail;');
	alasql('CREATE TABLE checkdetail(id INT, stock INT, operate STRING, qty INT);');
	var pcheckdetail = alasql.promise('SELECT MATRIX * FROM CSV("../data/CHECK-DETAIL.csv", {headers: true})').then(
			function(checkdetails) {
//				for (var i = 0; i < checkdetails.length; i++) {
//					var checkdetail = checkdetails[i];
//					alasql('INSERT INTO checkdetail VALUES(?,?,?,?);', checkdetail);
//				}	
				var sql = 'INSERT INTO checkdetail VALUES ';
				var params = [];
				var vals = [];
				for (var i = 0; i < checkdetails.length; i++) {
				  var checkdetail = checkdetails[i];
				  var qms = [];
				  for(var j = 0; j < checkdetail.length; j++){
				    params.push(checkdetail[j]);
				    qms.push('?');
				  }
				  vals.push('(' + qms.join(',') + ')');		  
				}
				alasql(sql + vals.join(','), params);	
			});
	
	// 入庫予定一覧
	alasql('DROP TABLE IF EXISTS whinlist;');
	alasql('CREATE TABLE whinlist(id INT, whouse INT,orderdate DATE, orderto STRING, orderno STRING,plandate DATE);');
	var pwhinlist = alasql.promise('SELECT MATRIX * FROM CSV("../data/WHIN-LIST.csv", {headers: true})').then(
			function(whinlists) {
//				for (var i = 0; i < whinlists.length; i++) {
//					var whinlist = whinlists[i];
//					alasql('INSERT INTO whinlist VALUES(?,?,?,?,?);', whinlist);
//				}
				var sql = 'INSERT INTO whinlist VALUES ';
				var params = [];
				var vals = [];
				for (var i = 0; i < whinlists.length; i++) {
				  var whinlist = whinlists[i];
				  var qms = [];
				  for(var j = 0; j < whinlist.length; j++){
				    params.push(whinlist[j]);
				    qms.push('?');
				  }
				  vals.push('(' + qms.join(',') + ')');		  
				}
				alasql(sql + vals.join(','), params);		
			});
	
	// 入庫予定詳細
	alasql('DROP TABLE IF EXISTS whindetail;');
	alasql('CREATE TABLE whindetail(id INT, item INT, qty INT, inflag INT, trans INT);');
	var pwhindetail = alasql.promise('SELECT MATRIX * FROM CSV("../data/WHIN-DETAIL.csv", {headers: true})').then(
			function(whindetails) {
//				for (var i = 0; i < whindetails.length; i++) {
//					var whindetail = whindetails[i];
//					alasql('INSERT INTO whindetail VALUES(?,?,?,?,?);', whindetail);
//				}
				var sql = 'INSERT INTO whindetail VALUES ';
				var params = [];
				var vals = [];
				for (var i = 0; i < whindetails.length; i++) {
				  var whindetail = whindetails[i];
				  var qms = [];
				  for(var j = 0; j < whindetail.length; j++){
				    params.push(whindetail[j]);
				    qms.push('?');
				  }
				  vals.push('(' + qms.join(',') + ')');		  
				}
				alasql(sql + vals.join(','), params);			
			});
	
	// 取り寄せ請求一覧
	alasql('DROP TABLE IF EXISTS reqlist;');
	alasql('CREATE TABLE reqlist(id INT IDENTITY,num STRING, total INT, fromsp INT,towh INT, reqdate DATE, ttlflag INT);');
	var preqlist = alasql.promise('SELECT MATRIX * FROM CSV("../data/REQUEST-LIST.csv", {headers: true})').then(
			function(reqlists) {
//				for (var i = 0; i < reqlists.length; i++) {
//					var reqlist = reqlists[i];
//					alasql('INSERT INTO reqlist VALUES(?,?,?,?,?,?,?);', reqlist);
//				}
				var sql = 'INSERT INTO reqlist VALUES ';
				var params = [];
				var vals = [];
				for (var i = 0; i < reqlists.length; i++) {
				  var reqlist = reqlists[i];
				  var qms = [];
				  for(var j = 0; j < reqlist.length; j++){
				    params.push(reqlist[j]);
				    qms.push('?');
				  }
				  vals.push('(' + qms.join(',') + ')');		  
				}
				alasql(sql + vals.join(','), params);		
			});
	// 取り寄せ請求詳細
	alasql('DROP TABLE IF EXISTS reqdetail;');
	alasql('CREATE TABLE reqdetail(id INT, item INT, qty INT, mdfqty INT);');
	var preqdetail = alasql.promise('SELECT MATRIX * FROM CSV("../data/REQUEST-DETAIL.csv", {headers: true})').then(
			function(reqdetails) {
//				for (var i = 0; i < reqdetails.length; i++) {
//					var reqdetail = reqdetails[i];
//					alasql('INSERT INTO reqdetail VALUES(?,?,?,?);', reqdetail);
//				}
				var sql = 'INSERT INTO reqdetail VALUES ';
				var params = [];
				var vals = [];
				for (var i = 0; i < reqdetails.length; i++) {
				  var reqdetail = reqdetails[i];
				  var qms = [];
				  for(var j = 0; j < reqdetail.length; j++){
				    params.push(reqdetail[j]);
				    qms.push('?');
				  }
				  vals.push('(' + qms.join(',') + ')');		  
				}
				alasql(sql + vals.join(','), params);
			
			});
	
	// 販売店舗マスタ
	alasql('DROP TABLE IF EXISTS mshop;');
	alasql('CREATE TABLE mshop(id INT, code STRING, name STRING, whouse INT, addr STRING);');
	var pmshop = alasql.promise('SELECT MATRIX * FROM CSV("../data/MASTER-SHOP.csv", {headers: true})').then(
			function(mshops) {
//				for (var i = 0; i < mshops.length; i++) {
//					var mshop = mshops[i];
//					alasql('INSERT INTO mshop VALUES(?,?,?,?);', mshop);
//				}
				var sql = 'INSERT INTO mshop VALUES ';
				var params = [];
				var vals = [];
				for (var i = 0; i < mshops.length; i++) {
				  var mshop = mshops[i];
				  var qms = [];
				  for(var j = 0; j < mshop.length; j++){
				    params.push(mshop[j]);
				    qms.push('?');
				  }
				  vals.push('(' + qms.join(',') + ')');		  
				}
				alasql(sql + vals.join(','), params);
			
			});
	
	// 集計一覧
	alasql('DROP TABLE IF EXISTS totallist;');
	alasql('CREATE TABLE totallist(id INT IDENTITY, startday DATE, endday DATE, totaldate DATE, whouse INT, shopnum INT, status INT);');
	var ptotallist = alasql.promise('SELECT MATRIX * FROM CSV("../data/TOTAL-LIST.csv", {headers: true})').then(
			function(totallists) {
//				for (var i = 0; i < totallists.length; i++) {
//					var totallist = totallists[i];
//					alasql('INSERT INTO totallist VALUES(?,?,?,?,?,?);', totallist);
//				}
				var sql = 'INSERT INTO totallist VALUES ';
				var params = [];
				var vals = [];
				for (var i = 0; i < totallists.length; i++) {
				  var totallist = totallists[i];
				  var qms = [];
				  for(var j = 0; j < totallist.length; j++){
				    params.push(totallist[j]);
				    qms.push('?');
				  }
				  vals.push('(' + qms.join(',') + ')');		  
				}
				alasql(sql + vals.join(','), params);
			
			});
	
	// 出庫予定一覧
	alasql('DROP TABLE IF EXISTS whoutlist;');
	alasql('CREATE TABLE whoutlist(id INT IDENTITY, total INT, whouse INT, plandate DATE);');
	var pwhoutlist = alasql.promise('SELECT MATRIX * FROM CSV("../data/WHOUT-LIST.csv", {headers: true})').then(
			function(whoutlists) {
//				for (var i = 0; i < whoutlists.length; i++) {
//					var whoutlist = whoutlists[i];
//					alasql('INSERT INTO whoutlist VALUES(?,?,?,?);', whoutlist);
//				}
				var sql = 'INSERT INTO whoutlist VALUES ';
				var params = [];
				var vals = [];
				for (var i = 0; i < whoutlists.length; i++) {
				  var whoutlist = whoutlists[i];
				  var qms = [];
				  for(var j = 0; j < whoutlist.length; j++){
				    params.push(whoutlist[j]);
				    qms.push('?');
				  }
				  vals.push('(' + qms.join(',') + ')');		  
				}
				alasql(sql + vals.join(','), params);
			
			});
	
	// 出庫予定詳細
	alasql('DROP TABLE IF EXISTS whoutdetail;');
	alasql('CREATE TABLE whoutdetail(id INT, item INT, qty INT, mdfqty INT, outflag INT, outname STRING, outdate DATE, outcomment STRING);');
	var pwhoutdetail = alasql.promise('SELECT MATRIX * FROM CSV("../data/WHOUT-DETAIL.csv", {headers: true})').then(
			function(whoutdetails) {
//				for (var i = 0; i < whoutdetails.length; i++) {
//					var whoutdetail = whoutdetails[i];
//					alasql('INSERT INTO whoutdetail VALUES(?,?,?,?,?,?,?,?);', whoutdetail);
//				}	
				var sql = 'INSERT INTO whoutdetail VALUES ';
				var params = [];
				var vals = [];
				for (var i = 0; i < whoutdetails.length; i++) {
				  var whoutdetail = whoutdetails[i];
				  var qms = [];
				  for(var j = 0; j < whoutdetail.length; j++){
				    params.push(whoutdetail[j]);
				    qms.push('?');
				  }
				  vals.push('(' + qms.join(',') + ')');		  
				}
				alasql(sql + vals.join(','), params);
			});
	
	// 配送予定一覧
	alasql('DROP TABLE IF EXISTS delivlist;');
	alasql('CREATE TABLE delivlist(id INT, total INT, shop INT, whouse INT, plandate DATE, delivno STRING);');
	var pdelivlist = alasql.promise('SELECT MATRIX * FROM CSV("../data/DELIV-LIST.csv", {headers: true})').then(
			function(delivlists) {
//				for (var i = 0; i < delivlists.length; i++) {
//					var delivlist = delivlists[i];
//					alasql('INSERT INTO delivlist VALUES(?,?,?,?,?);', delivlist);
//				}
				var sql = 'INSERT INTO delivlist VALUES ';
				var params = [];
				var vals = [];
				for (var i = 0; i < delivlists.length; i++) {
				  var delivlist = delivlists[i];
				  var qms = [];
				  for(var j = 0; j < delivlist.length; j++){
				    params.push(delivlist[j]);
				    qms.push('?');
				  }
				  vals.push('(' + qms.join(',') + ')');		  
				}
				alasql(sql + vals.join(','), params);
			
			});

	// 配送予定詳細
	alasql('DROP TABLE IF EXISTS delivdetail;');
	alasql('CREATE TABLE delivdetail(id INT, item INT, qty INT, delivname STRING, delivdate DATE, delivflag INT, trans INT);');
	var pdelivdetail = alasql.promise('SELECT MATRIX * FROM CSV("../data/DELIV-DETAIL.csv", {headers: true})').then(
			function(delivdetails) {
//				for (var i = 0; i < delivdetails.length; i++) {
//					var delivdetail = delivdetails[i];
//					alasql('INSERT INTO delivdetail VALUES(?,?,?,?,?,?,?);', delivdetail);
//				}
				var sql = 'INSERT INTO delivdetail VALUES ';
				var params = [];
				var vals = [];
				for (var i = 0; i < delivdetails.length; i++) {
				  var delivdetail = delivdetails[i];
				  var qms = [];
				  for(var j = 0; j < delivdetail.length; j++){
				    params.push(delivdetail[j]);
				    qms.push('?');
				  }
				  vals.push('(' + qms.join(',') + ')');		  
				}
				alasql(sql + vals.join(','), params);
			
			});

	// パスワードマスタ
	alasql('DROP TABLE IF EXISTS password;');
	alasql('CREATE TABLE password(id INT, username STRING, pass STRING, ope STRING);');
	var ppassword = alasql.promise('SELECT MATRIX * FROM CSV("../data/MASTER-PASSWORD.csv", {headers: true})').then(
			function(passwords) {
//				for (var i = 0; i < delivdetails.length; i++) {
//					var delivdetail = delivdetails[i];
//					alasql('INSERT INTO delivdetail VALUES(?,?,?,?,?,?,?);', delivdetail);
//				}
				var sql = 'INSERT INTO password VALUES ';
				var params = [];
				var vals = [];
				for (var i = 0; i < passwords.length; i++) {
				  var password = passwords[i];
				  var qms = [];
				  for(var j = 0; j < password.length; j++){
				    params.push(password[j]);
				    qms.push('?');
				  }
				  vals.push('(' + qms.join(',') + ')');		  
				}
				alasql(sql + vals.join(','), params);
			
			});
	// モンスターデータ
	alasql('DROP TABLE IF EXISTS monster;');
	alasql('CREATE TABLE monster(id INT, play INT,prize INT,tecnt INT,tncnt INT,thcnt INT,tmcnt INT,tzcnt INT,fcnt INT,exp INT, allexp INT, exprate INT,level INT,type INT, bio STRING, reset INT);');
	var pmonster = alasql.promise('SELECT MATRIX * FROM CSV("../data/MONSTER-DATA.csv", {headers: true})').then(
			function(monsters) {
//				for (var i = 0; i < delivdetails.length; i++) {
//					var delivdetail = delivdetails[i];
//					alasql('INSERT INTO delivdetail VALUES(?,?,?,?,?,?,?);', delivdetail);
//				}
				var sql = 'INSERT INTO monster VALUES ';
				var params = [];
				var vals = [];
				for (var i = 0; i < monsters.length; i++) {
				  var monster = monsters[i];
				  var qms = [];
				  for(var j = 0; j < monster.length; j++){
				    params.push(monster[j]);
				    qms.push('?');
				  }
				  vals.push('(' + qms.join(',') + ')');		  
				}
				alasql(sql + vals.join(','), params);
			
			});
	
	// モンスター情報
	alasql('DROP TABLE IF EXISTS monsterinfo;');
	alasql('CREATE TABLE monsterinfo(id INT, level INT,name STRING,srckey STRING,condition STRING,detail STRING, openflag INT);');
	var pmonsterinfo = alasql.promise('SELECT MATRIX * FROM CSV("../data/MONSTER-INFO.csv", {headers: true})').then(
			function(monsterinfos) {
//				for (var i = 0; i < delivdetails.length; i++) {
//					var delivdetail = delivdetails[i];
//					alasql('INSERT INTO delivdetail VALUES(?,?,?,?,?,?,?);', delivdetail);
//				}
				var sql = 'INSERT INTO monsterinfo VALUES ';
				var params = [];
				var vals = [];
				for (var i = 0; i < monsterinfos.length; i++) {
				  var monsterinfo = monsterinfos[i];
				  var qms = [];
				  for(var j = 0; j < monsterinfo.length; j++){
				    params.push(monsterinfo[j]);
				    qms.push('?');
				  }
				  vals.push('(' + qms.join(',') + ')');		  
				}
				alasql(sql + vals.join(','), params);
			
			});
	// リロード
	Promise.all([ pkind, 
	              pitem, 
	              pwhouse, 
	              pstock, 
	              ptrans, 
	              plimit, // 上下限値
	              psetting, //　設定
	              pchecklist, // チェック結果一覧
	              pcheckdetail, // チェック結果詳細
	              pwhinlist, // 入庫予定一覧
	              pwhindetail, // 入庫予定詳細
	              preqlist, // 取寄せ請求一覧
	              preqdetail,//　取寄せ請求詳細
	              pmshop,//販売店舗マスタ
	              ptotallist, //集計一覧
	              pwhoutlist, //出庫予定一覧
	              pwhoutdetail, //出庫予定詳細
	              pdelivlist, //配送予定一覧
	              pdelivdetail, //配送予定詳細
	              ppassword,//パスワードマスタ
	              pmonster,//モンスター
	              pmonsterinfo,//モンスター
              ]).then(function() {
		window.location.reload(true);
	});
};

DB.remove = function() {
	if (window.confirm('DBが削除されます。よろしいですか？')) {
		alasql('DROP localStorage DATABASE STK')
	}
};

// 桁区切り
function numberWithCommas(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// DO NOT CHANGE!
alasql.promise = function(sql, params) {
	return new Promise(function(resolve, reject) {
		alasql(sql, params, function(data, err) {
			if (err) {
				reject(err);
			} else {
				resolve(data);
			}
		});
	});
};

// データベース接続
try {
	alasql('ATTACH localStorage DATABASE STK;');
	alasql('USE STK;');
	// MUST ADD LINE WHEN CREATING NEW TABLE!
	alasql.options.joinstar = 'json';
	alasql('SELECT * FROM kind WHERE id = 1;');
	alasql('SELECT * FROM item WHERE id = 1;');
	alasql('SELECT * FROM whouse WHERE id = 1;');
	alasql('SELECT * FROM stock WHERE id = 1;');
	alasql('SELECT * FROM trans WHERE id = 1;');
	alasql('SELECT * FROM limits WHERE id = 1;');
	alasql('SELECT * FROM setting WHERE id = 1;');
	alasql('SELECT * FROM checklist WHERE id = 1;');
	alasql('SELECT * FROM checkdetail WHERE id = 1;');
	alasql('SELECT * FROM whinlist WHERE id = 1;');
	alasql('SELECT * FROM whindetail WHERE id = 1;');
	alasql('SELECT * FROM reqlist WHERE id = 1;');
	alasql('SELECT * FROM reqdetail WHERE id = 1;');
	alasql('SELECT * FROM mshop WHERE id = 1;');
	alasql('SELECT * FROM totallist WHERE id = 1;');
	alasql('SELECT * FROM whoutlist WHERE id = 1;');
	alasql('SELECT * FROM whoutdetail WHERE id = 1;');
	alasql('SELECT * FROM delivlist WHERE id = 1;');
	alasql('SELECT * FROM delivdetail WHERE id = 1;');
	alasql('SELECT * FROM password WHERE id = 1;');
	alasql('SELECT * FROM monster WHERE id = 1;');
	alasql('SELECT * FROM monsterinfo WHERE id = 1;');
} catch (e) {
//	alasql('CREATE localStorage DATABASE STK;');
//	alasql('ATTACH localStorage DATABASE STK;');
//	alasql('USE STK;');
//	var dbcnt = parseInt(localStorage.getItem('dbcnt'),10);
//	var _t =  dbcnt ? dbcnt : 0;
//	if(_t > 0){
//      DB.load();
//	}
//	if(_t == 0){
//      localStorage.setItem('dbcnt',1);
//	}
	setTimeout(function(){
	      alasql('CREATE localStorage DATABASE STK;');
	      alasql('ATTACH localStorage DATABASE STK;');
	      alasql('USE STK;');
	      DB.load();
		},150);
}
