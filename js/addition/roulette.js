// 共通変数
var v = {
	// ナビゲーションメニュー
	// nav: new Navi(1,'tab2',['roulette'],[]),

	auth : new Auth(),
	// ライブラリ
	cu : new CommonUtil(),
};

// 設定用変数
var sys = {

	// まわしたかいすう
	playCount : 0,
	// まわしたかいすうイベントタイミング
	playPrize : [ {
		'get' : false,
		'count' : 20,
		'rate' : 1.5,
	}, {
		'get' : false,
		'count' : 50,
		'rate' : 2,
	}, {
		'get' : false,
		'count' : 100,
		'rate' : 3,
	}, {
		'get' : false,
		'count' : 150,
		'rate' : 4,
	}, {
		'get' : false,
		'count' : 200,
		'rate' : 5,
	} ],
	// りせっとかいすう
	reset : 0,
	// なんいど
	mode : 'normal',


	/**** あたり／はずれ かうんと ****/
	// あたり(すべて)
	trueCount : 0,
	// あたり(よわい)
	trueEasyCount : 0,
	// あたり(ふつう)
	trueNormalCount : 0,
	// あたり(つよい)
	trueHardCount : 0,
	// あたり(やばい)
	trueMadCount : 0,
	// あたり(じごく)
	trueHellCount : 0,
	// はずれ
	falseCount : 0,

	// あたりはんてい開始角度
	trueStart : 0,
	// あたりはんてい終了角度
	trueEnd : 360,


	/**** ひつよう けいけんち ****/
	// レベル2必要経験値
	level2 : 500,
	// レベル3必要経験値
	level3 : 1000,
	// レベル4必要経験値
	level4 : 2000,
	// レベル5必要経験値
	level5 : 5000,
	// レベル6必要経験値
	level6 : 10000,


	/**** けいけんち ばいりつ ****/
	// 獲得経験値倍率
	expRate : 1,
	// やさしい
	expEasy : 1,
	// ふつう
	expNormal : 5,
	// むずい
	expHard : 10,
	// やばい
	expMad : 20,
	// じごく
	expHell : 50,


	/**** ずかん ****/
	// ずかんないよう
	biography : [{'level':1, 'monster':[{'type': 1,'name':'たまご',     'src': '../img/monster/01_egg.png','open': true},]},
	             {'level':2, 'monster':[{'type': 1,'name':'ひよっこ',    'src': '../img/monster/02_puppy.png', 'open': false},]},
	             {'level':3, 'monster':[{'type': 1,'name':'いっぱし',    'src': '../img/monster/03_normal.png', 'open': false},
	                         	        {'type': 2,'name':'えいようぶそく', 'src': '../img/monster/03_malnut.png', 'open': false},]},
	             {'level':4, 'monster':[{'type': 1,'name':'つの',       'src': '../img/monster/04_tsuno.png', 'open': false},
	                         	        {'type': 2,'name':'にほんつの',  'src': '../img/monster/04_double.png', 'open': false},
	                        	        {'type': 3,'name':'とげとげ',    'src': '../img/monster/04_spiky.png', 'open': false},]},
	             {'level':5, 'monster':[{'type': 1,'name':'はね',      'src': '../img/monster/05_hane.png', 'open': false},
	                         	        {'type': 2,'name':'あしなが',   'src': '../img/monster/05_long.png', 'open': false},
	                        	        {'type': 3,'name':'とさか',     'src': '../img/monster/05_crest.png', 'open': false},
	                        	        {'type': 4,'name':'ぞんび',    'src': '../img/monster/05_zombie.png', 'open': false},]},
	             {'level':6, 'monster':[{'type': 1,'name':'おとな',     'src': '../img/monster/06_last.png', 'open': false},
	                         	        {'type': 2,'name':'きんぐ',     'src': '../img/monster/06_king.png', 'open': false},
	                        	        {'type': 3,'name':'ごっど',     'src': '../img/monster/06_god.png', 'open': false},
	                        	        {'type': 4,'name':'むてき',     'src': '../img/monster/06_invi.png', 'open': false},
	                        	        {'type': 5,'name':'でんせつ',   'src': '../img/monster/06_legend.png', 'open': false},]},],

};

// モンスター用変数
var monster = {

	// けいけんち
	exp : 0,

	// そうかくとく けいけんち
	allexp : 0,

	// レベル
	level : 0,

	// けいとう
	type : 1,

	// たいぷ
	typeName: 'たまご',

};

// ルーレット 用変数
var roulette = {
	context : undefined,
	next : 3, // 次角度
	speed : 5, // スピード
	right : 0, // 右位置
	top : 0, // 上位置
	r : 0, // 半径
	start : 0, // 当たり開始角度
	end : 0, // 当たり終了角度
	angle : 0, // 現在角度
};

// canvas描画
var draw = {

	// 扇形
	sector : function(right, top, r, start, end, rotate, color, angle) {
		/* パスリセット */
		roulette.context.beginPath();
		/* 円弧の中心点をパスの始点にする */
		roulette.context.moveTo(right, top)
		/* 円弧を指定。パスの始点から円弧の始点まで自動的にパスが引かれる */
		roulette.context.arc(right, top, r, (start / 180) * Math.PI,
				(end / 180) * Math.PI, rotate);
		roulette.context.rotate((angle / 180) * Math.PI);
		/* 円弧のパスを終わらせると、自動的に始点に線を引いてパスを閉じてくれる */
		roulette.context.closePath();
		/* 色を指定して塗りつぶす */
		roulette.context.fillStyle = color;
		roulette.context.fill();
	},

	// ルーレット
	roulette : function(level, angle) {

		// 当たり角度
		var rd = 0;
		switch (level) {
		case 'easy':
			rd = roulette.next * 30;
			break;
		case 'normal':
			rd = roulette.next * 20;
			break;
		case 'hard':
			rd = roulette.next * 10;
			break;
		case 'mad':
			rd = roulette.next * 5;
			break;
		case 'hell':
			rd = roulette.next * 2;
			break;
		}

		// あたり角度
		roulette.start = 360 - (rd / 2);
		roulette.end = 0 + (rd / 2);

		// canvasエリア
		var ra = $('#div-roulette-area');
		var raw = ra.css('width');
		var rah = 200;
		var r = ((rah / 10) * 9) / 2;
		raw = parseInt(raw.substring(0, raw.length - 2), 10);
		$('#canvas-roulette').attr({
			'width' : raw,
			'height' : rah,
		});

		// 描画角度
		var startrd = 90 - (rd / 2) + angle;
		var endrd = 90 + (rd / 2) + angle;
		draw.sector(raw / 2, (rah / 2) + (rah / 2 - r), r, startrd, endrd,
				false, '#4466FF');
		draw.sector(raw / 2, (rah / 2) + (rah / 2 - r), r, endrd,
				360 + startrd, false, '#FF4466');

	},

};

// イベント
var ev = {

	/** **** ルーレット関連 ***** */
	// ルーレットボタン押下処理
	pressRouletteButton : function() {
		ev.funcRoulette();
	},

	// ルーレット回転ON/OFF
	funcRoulette : function() {
		if (v.rouletteId) {
			// ルーレットOFF
			clearInterval(v.rouletteId);
			v.rouletteId = '';
			if (ev.judgeRoulette()) {
				// あたり
				ev.prizeDisplay();
				// あたった回数ふやす
				sys.trueCount += 1;
				// $('.span-true-count')[0].innerText = sys.trueCount;
				// けいけんちふやす
				monster.exp += ev.getExperience();
				monster.allexp += ev.getExperience();
				$('.span-exp-count').text(monster.exp);
				$('.span-exp-all-count').text(monster.allexp);
				// 詳細データ計算
				switch (sys.mode) {
				case 'easy':
					sys.trueEasyCount += 1;
					$('.span-true-easy-count').text(sys.trueEasyCount);
					break;
				case 'normal':
					sys.trueNormalCount += 1;
					$('.span-true-normal-count').text(sys.trueNormalCount);
					break;
				case 'hard':
					sys.trueHardCount += 1;
					$('.span-true-hard-count').text(sys.trueHardCount);
					break;
				case 'mad':
					sys.trueMadCount += 1;
					$('.span-true-mad-count').text(sys.trueMadCount);
					break;
				case 'hell':
					sys.trueHellCount += 1;
					$('.span-true-hell-count').text(sys.trueHellCount);
					break;
				}
				// 進化 判定
				ev.checkEvolution(false);
				$('.span-level-count').text(monster.level);
				$('.span-level-type').text(monster.typeName);
			} else {
				// はずれ
				sys.falseCount += 1;
				$('.span-false-count').text(sys.falseCount);
			}

			// まわしたかいすう 判定
			ev.checkPlayCount();

			// あたったかくりつ
			$('.span-true-rate').text(
					Math.round((sys.trueCount / sys.playCount) * 100));
		} else {
			// ルーレットON
			sys.playCount += 1;
			$('.span-play-count').text(sys.playCount);
			v.rouletteId = setInterval(function() {
				ev.rotateRoulette();
			}, roulette.speed);
		}
	},

	// 当たり時、画面効果
	prizeDisplay : function() {
		var ov = $('<div></div>');
		var h = window.innerHeight * 0.9;
		var w = window.innerWidth * 0.95;
		ov.css({
			'opacity' : '0.0',
			'position' : 'absolute',
			'width' : w + 'px',
			'height' : h + 'px',
			'top' : '0',
			'left' : '0',
			'background-color' : '#FFFFBB',
		}).appendTo('body');
		ov.animate({
			'opacity' : '0.6',
		}, 150, 'swing', function() {
			ov.animate({
				'opacity' : '0.0',
			}, 150, 'swing', function() {
				ov.remove();
			})
		});
	},

	// ルーレット回転
	rotateRoulette : function() {
		// var c = $('#roulette');
		// var rttStr = 'rotate(0deg)';
		// var tfm = c.css('transform');
		//
		// if (tfm !== "none") {
		// var temp = c[0].style.cssText;
		// temp = temp.substring(temp.indexOf('rotate('), temp.length);
		// temp = parseInt(temp.substring('rotate('.length, temp
		// .indexOf('deg')), 10);
		// temp += 5;
		// if (temp >= 360) {
		// temp = 0;
		// }
		// rttStr = 'rotate(' + temp + 'deg)';
		// }
		//
		// c.css('transform', rttStr);
		roulette.angle += roulette.angle !== 360 ? roulette.next : -360;
		draw.roulette(sys.mode, roulette.angle);

	},

	// ルーレット判定
	judgeRoulette : function() {
		// var c = $('#roulette');
		// var temp = c[0].style.cssText;
		// temp = temp.substring(temp.indexOf('rotate('), temp.length);
		// temp = parseInt(temp.substring('rotate('.length,
		// temp.indexOf('deg')),
		// 10);
		// if (v.trueStart <= temp && temp <= v.trueEnd) {
		// return true;
		// }
		if ((roulette.start <= roulette.angle && roulette.angle <= 360)
				|| (0 <= roulette.angle && roulette.angle <= roulette.end)) {
			return true;
		}
		return false;
	},

	/** **** 設定関連 ***** */
	// まわしたかいすう判定
	checkPlayCount : function() {
		var result = false;
		var count = 0;
		var newRate = 0;
		for (var i = 0; i < sys.playPrize.length; i++) {
			var pp = sys.playPrize[i];
			if (!pp.get) {
				if (pp.count <= sys.playCount) {
					pp.get = true;
					count = pp.count;
					newRate = pp.rate;
					result = true;
				}
			}
		}

		// ごほうび
		if (result) {
			// けいけんち かくとく ばいりつ
			sys.expRate = newRate;
			var str = 'まわしたかいすうが' + count + 'かい を こえました。<br>'
					+ 'かくとくけいけんち が   ' + sys.expRate
					+ ' ばいになります。'
			$('.span-exp-rate').text(sys.expRate);

			// 難易度表示ボタン表示変更
			ev.resetDifficultyButton();

			// めっせーじ
			ev.addInformation(str);
			// v.cu.showMessage('info', str, $('nav'))
		}

		return result;
	},

	// 難易度変更
	setDifficulty : function(dif) {
		// switch (dif) {
		// case 'easy':
		// v.rouletteSrc = '../img/roulette/color-easy.png';
		// v.mode = 'easy';
		// v.trueStart = 90;
		// v.trueEnd = 180;
		// break;
		// case 'normal':
		// v.rouletteSrc = '../img/roulette/color-normal.png';
		// v.mode = 'normal';
		// v.trueStart = 135;
		// v.trueEnd = 180;
		// break;
		// case 'hard':
		// v.rouletteSrc = '../img/roulette/color-hard.png';
		// v.mode = 'hard';
		// v.trueStart = 157;
		// v.trueEnd = 180;
		// break;
		// case 'mad':
		// v.rouletteSrc = '../img/roulette/color-mad.png';
		// v.mode = 'mad';
		// v.trueStart = 169;
		// v.trueEnd = 180;
		// break;
		// }
		sys.mode = dif;
		// roulette.angle = 0;
		roulette.context = document.getElementById('canvas-roulette')
				.getContext('2d');
		draw.roulette(sys.mode, roulette.angle);

		// $('#roulette').attr('src', v.rouletteSrc);
	},

	// 難易度ボタン表示値(経験値表示)変更
	resetDifficultyButton : function() {
		$('#span-disp-exp-easy')[0].innerText = Math.round(sys.expRate * sys.expEasy);
		$('#span-disp-exp-normal')[0].innerText = Math.round(sys.expRate * sys.expNormal);
		$('#span-disp-exp-hard')[0].innerText = Math.round(sys.expRate * sys.expHard);
		$('#span-disp-exp-mad')[0].innerText = Math.round(sys.expRate * sys.expMad);
		$('#span-disp-exp-hell')[0].innerText = Math.round(sys.expRate * sys.expHell);

	},

	// 経験値獲得
	getExperience : function() {
		switch (sys.mode) {
		case 'easy':
			return Math.round(sys.expRate * sys.expEasy);
		case 'normal':
			return Math.round(sys.expRate * sys.expNormal);
		case 'hard':
			return Math.round(sys.expRate * sys.expHard);
		case 'mad':
			return Math.round(sys.expRate * sys.expMad);
		case 'hell':
			return Math.round(sys.expRate * sys.expHell);
		default:
			return 0;
		}
	},

	// ろーど
	dataLoad : function() {


		if (v.loadData !== undefined) {
			sys.playCount = parseInt(v.loadData.play);
			for (var i = 0; i < parseInt(v.loadData.prize); i++) {
				var pp = sys.playPrize[i];
				pp.get = true;
			}
			sys.trueEasyCount = parseInt(v.loadData.tecnt);
			sys.trueNormalCount = parseInt(v.loadData.tncnt);
			sys.trueHardCount = parseInt(v.loadData.thcnt);
			sys.trueMadCount = parseInt(v.loadData.tmcnt);
			sys.trueHellCount = parseInt(v.loadData.tzcnt);
			sys.trueCount = parseInt(v.loadData.tecnt)
				+ parseInt(v.loadData.tncnt) + parseInt(v.loadData.thcnt)
				+ parseInt(v.loadData.tmcnt) + parseInt(v.loadData.tzcnt);
			sys.falseCount = parseInt(v.loadData.fcnt);
			sys.expRate = parseInt(v.loadData.exprate);
			monster.exp = parseInt(v.loadData.exp);
			monster.allexp = parseInt(v.loadData.allexp);
			monster.level = parseInt(v.loadData.level);
			monster.type = parseInt(v.loadData.type);
			sys.reset = parseInt(v.loadData.reset);
			ev.generateBioOpenLoadFlag(v.loadData.bio);


			// でーた 表示変更
			// まわしたかいすう
			$('.span-play-count').text(sys.playCount);
			// りせっとかいすう
			$('.span-reset-count').text(sys.reset);
			// けいけんち ばいりつ
			$('.span-exp-rate').text(sys.expRate);
			// けいけんち
			$('.span-exp-count').text(monster.exp);
			// けいけんち(ぜんぶ)
			$('.span-exp-all-count').text(monster.allexp);
			// あたり
			$('.span-true-easy-count').text(sys.trueEasyCount);
			$('.span-true-normal-count').text(sys.trueNormalCount);
			$('.span-true-hard-count').text(sys.trueHardCount);
			$('.span-true-mad-count').text(sys.trueMadCount);
			$('.span-true-hell-count').text(sys.trueHellCount);
			// はずれ
			$('.span-false-count').text(sys.falseCount);
			// かくりつ
			$('.span-true-rate').text(Number.isNaN(Math.round((sys.trueCount / sys.playCount) * 100)) ? 0: Math.round((sys.trueCount / sys.playCount) * 100));
			// 進化 判定
			ev.checkEvolution(true);
			$('.span-level-count').text(monster.level);
			$('.span-level-type').text(monster.typeName);

			// 難易度表示ボタン
			ev.resetDifficultyButton();

			// めっせーじ
			// ev.clearInformation();
			ev.addInformation('ろーど しました。');
			// v.cu.showMessage('info', 'ろーど しました。', $('nav'));
		}
	},

	// せーぶ
	dataSave : function() {

		// まわしたかいすうぷらいず値
		var playCountPrizeIndex = 0;
		for (var i = 0; i < sys.playPrize.length; i++) {
			var pp = sys.playPrize[i];
			if (pp.get) {
				playCountPrizeIndex += 1;
			}
		}

		var saveJson = {
			'user':docCookies.getItem("auth"),
			'play':sys.playCount,
			'prize':playCountPrizeIndex,
			'tecnt':sys.trueEasyCount,
			'tncnt':sys.trueNormalCount,
			'thcnt':sys.trueHardCount,
			'tmcnt':sys.trueMadCount,
			'tzcnt':sys.trueHellCount,
			'fcnt':sys.falseCount,
			'exp':monster.exp,
			'allexp': monster.allexp,
			'exprate':sys.expRate,
			'level':monster.level,
			'type':monster.type,
			'bio':ev.generateBioOpenSaveFlag(),
			'reset':	sys.reset,
		};

		Python.requestSaveMonsterData(saveJson);

		// v.cu.showMessage('info', 'せーぶ しました。', $('nav'));
	},

	// じさつ
	dataReset : function() {
		if (confirm('たまごにもどります。よろしいですか？\r（※「まわしたかいすう」いがいがりせっとされます。）')) {
			sys.playCount = 0;
			sys.trueEasyCount = 0;
			sys.trueNormalCount = 0;
			sys.trueHardCount = 0;
			sys.trueMadCount = 0;
			sys.trueHellCount = 0;
			sys.trueCount = 0;
			sys.falseCount = 0;
			monster.exp = 0;
			monster.level = 1;
			sys.reset += 1;

			// でーた 表示変更
			// まわしたかいすう
			$('.span-play-count').text(sys.playCount);
			// りせっとかいすう
			$('.span-reset-count').text(sys.reset);
			// けいけんち ばいりつ
			$('.span-exp-rate').text(sys.expRate);
			// けいけんち
			$('.span-exp-count').text(monster.exp);
			// あたり
			$('.span-true-easy-count').text(sys.trueEasyCount);
			$('.span-true-normal-count').text(sys.trueNormalCount);
			$('.span-true-hard-count').text(sys.trueHardCount);
			$('.span-true-mad-count').text(sys.trueMadCount);
			$('.span-true-hell-count').text(sys.trueHellCount);
			// はずれ
			$('.span-false-count').text(sys.falseCount);
			// かくりつ
			$('.span-true-rate').text(Number.isNaN(Math.round((sys.trueCount / sys.playCount) * 100)) ? 0: Math.round((sys.trueCount / sys.playCount) * 100));
			// 進化 判定
			ev.checkEvolution(true);
			$('.span-level-count').text(monster.level);
			$('.span-level-type').text(monster.typeName);

			// 難易度表示ボタン
			ev.resetDifficultyButton();

			// めっせーじ
			// ev.clearInformation();
			ev.addInformation('あたらしいいのちに みらいをたくしました。');
		}
	},

	// いんふぉ削除
	clearInformation : function(msg) {
		// $('#panel-body-info').empty();
		$('#tbody-info').empty();
	},

	// いんふぉ追加
	addInformation : function(msg) {

		var msgCount = $('#tbody-info').children('tr').length;
		var now = v.cu.convertDateToDetailString(new Date());
		var appendTr = $('<tr></tr>');
		appendTr.css({
			'display' : 'none',
			'opacity' : '0.0',
		}).append('<td style="font-weight:bold;">' + now + '</td>').append(
				'<td>' + msg + '</td>');
		if (msgCount >= 3) {

			$('#tbody-info').children('tr:last').animate({
				'opacity' : '0.0',
			}, 'fast', 'linear', function() {
				$('#tbody-info').children('tr:last').remove();
				$('#tbody-info').prepend(appendTr);
				appendTr.show().animate({
					'opacity' : '1.0',
				}, 'fast', 'linear');
			});

		} else {
			$('#tbody-info').prepend(appendTr);
			appendTr.show().animate({
				'opacity' : '1.0',
			});
		}

	},

	/****** モンスター関連 ******/
	// 進化判定
	checkEvolution : function(isLoad) {

		if (monster.exp < sys.level2) {
		// ■れべる1
			ev.changeMonster(1, isLoad, false);
			monster.level = 1;
		} else if (sys.level2 <= monster.exp && monster.exp < sys.level3) {
		// ■れべる2
			if (monster.level === 1) {
				ev.changeMonster(2, isLoad, true);
			} else {
				ev.changeMonster(2, isLoad, false);
			}
			monster.level = 2;
		} else if (sys.level3 <= monster.exp && monster.exp < sys.level4) {
		// ■れべる3
		  if (monster.level === 2) {
			    /*
			     * [1:いっぱし] それ以外
			     * [2:えいようぶそく] M か Z が 0
			     */
			    // 分岐(1:いっぱし)
		    	monster.type = 1;

		    	// 分岐(2:えいようぶそく)
				if (sys.trueMadCount === 0 || sys.trueHellCount === 0) {
				  monster.type = 2;
				}

				ev.changeMonster(3, isLoad, true);
		  } else {
				ev.changeMonster(3, isLoad, false);
		  }
		  monster.level = 3;

		} else if (sys.level4 <= monster.exp && monster.exp < sys.level5) {
		// ■れべる4
			if (monster.level === 3) {
				/*
				 * [1:つの] それ以外
			     * [2:にほんつの] rate >= 90
			     * [3:とげとげ] Eが30回,Nが20回,Hが10回,Mが5回,Zが1回以上
			     */

				// 分岐(1:つの)
		    	monster.type = 1;

		    	// 分岐(2:にほんつの)
			    if (Math.round((sys.trueCount / sys.playCount) * 100) >= 90
			    		&& monster.type === 1) {
			      monster.type = 2;
				}

			    // 分岐(3:とげとげ)
			    if(30 <= sys.trueEasyCount
			    	&& 20 <= sys.trueNormalCount
			    	&& 10 <= sys.trueHardCount
			    	&& 5 <= sys.trueMadCount
			    	&& 1 <= sys.trueHellCount
		    		&& monster.type === 2){
					monster.type = 3;
			    }

				ev.changeMonster(4, isLoad, true);
			} else {
				ev.changeMonster(4, isLoad, false);
			}
			monster.level = 4;
		} else if (sys.level5 <= monster.exp && monster.exp < sys.level6) {
		// ■れべる5
			if (monster.level === 4) {
				/*
				   * [1:はね] それ以外
			     * [2:あしなが] play <= 200
			     * [3:とさか] Eが70回,Nが50回,Hが20回,Mが10回,Zが5回以上
			     * [4:ぞんび] rate <= 40
			     */

				// 分岐(1:はね)
		    	monster.type = 1;

		    	// 分岐(2:あしなが)
			    if (sys.playCount <= 200
			    		&& monster.type === 1) {
			      monster.type = 2;
				}

                // 分岐(3:とさか)
			    if(70 <= sys.trueEasyCount
			    	&& 50 <= sys.trueNormalCount
			    	&& 20 <= sys.trueHardCount
			    	&& 10 <= sys.trueMadCount
			    	&& 5 <= sys.trueHellCount
		    		&& monster.type === 2){
					// 分岐(3:とげとげ)
			    	monster.type = 3;
			    }

			    // 分岐(4:ぞんび)
			    if (Math.round((sys.trueCount / sys.playCount) * 100) <= 40) {
			      monster.type = 4;
				}

				ev.changeMonster(5, isLoad, true);
			} else {
				ev.changeMonster(5, isLoad, false);
			}
			monster.level = 5;
		} else if (sys.level6 <= monster.exp) {
		// ■れべる6
			if (monster.level === 5) {
				/*
				 * [1:おとな] それ以外
			     * [2:きんぐ] play <= 300
			     * [3:ごっど] 90 <= rate
			     * [4:むてき] Eが100回,Nが70回,Hが50回,Mが25回,Zが10回以上
			     * [5:でんせつ] 他種コンプ AND 65535 <= ALLEXP
			     */
				// 分岐(1:おとな)
		    	monster.type = 1;

		    	// 分岐(2:きんぐ)
			    if (sys.playCount <= 300
			    		&& monster.type === 1) {
			      monster.type = 2;
					}

          // 分岐(3:ごっど)
			    if(90 <= Math.round((sys.trueCount / sys.playCount) * 100)
						&& monster.type === 2){
			    	monster.type = 3;
			    }

			    // 分岐(4:むてき)
			    if (100 <= sys.trueEasyCount
			    	&& 70 <= sys.trueNormalCount
			    	&& 50 <= sys.trueHardCount
			    	&& 25 <= sys.trueMadCount
			    	&& 10 <= sys.trueHellCount
		    		&& monster.type === 3) {
			      monster.type = 4;
				}

			    // 分岐(5:でんせつ)
					if(sys.biography[0].monster[0].open === true
						&& sys.biography[1].monster[0].open === true
						&& sys.biography[2].monster[0].open === true
						&& sys.biography[2].monster[1].open === true
						&& sys.biography[3].monster[0].open === true
						&& sys.biography[3].monster[1].open === true
						&& sys.biography[3].monster[2].open === true
						&& sys.biography[4].monster[0].open === true
						&& sys.biography[4].monster[1].open === true
						&& sys.biography[4].monster[2].open === true
						&& sys.biography[4].monster[3].open === true
						&& sys.biography[5].monster[0].open === true
						&& sys.biography[5].monster[1].open === true
						&& sys.biography[5].monster[2].open === true
						&& sys.biography[5].monster[3].open === true
						&& 65535 <= monster.allexp) {
			      monster.type = 5;
				}

				ev.changeMonster(6, isLoad, true);
			} else {
				ev.changeMonster(6, isLoad, false);
			}
			monster.level = 6;
		} else {
			return;
		}
	},

	// モンスター変更
	changeMonster : function(mId, isLoad, isEvol) {

		if (v.monsterAnimateId) {
			clearInterval(v.monsterAnimateId);
		}

		var intervalFunc = ev.animateMonsterEgg;
		var interval = 800;
		var typeName = sys.biography[0].monster[0].name;
		var srcPathKey = '01_egg';

		switch (mId) {
		case 1:
			ev.animateMonsterEgg();
			break;
		case 2:
		    srcPathKey = '02_puppy';
			interval = 1000;
			ev.animateMonsterBeat('../img/monster/' + srcPathKey + '.png', '../img/monster/' + srcPathKey + '_r.png');
			intervalFunc = function() {
			  ev.animateMonsterBeat('../img/monster/' + srcPathKey + '.png', '../img/monster/' + srcPathKey + '_r.png');
			};
			sys.biography[1].monster[0].open = true;
			typeName = sys.biography[1].monster[0].name;
			break;
		case 3:
			interval = 800;
			switch (monster.type) {
				case 1:
					srcPathKey = '03_normal';
					ev.animateMonsterBeat('../img/monster/' + srcPathKey + '.png', '../img/monster/' + srcPathKey + '_r.png');
					intervalFunc = function() {
					  ev.animateMonsterBeat('../img/monster/' + srcPathKey + '.png', '../img/monster/' + srcPathKey + '_r.png');
					};
					sys.biography[2].monster[0].open = true;
					typeName = sys.biography[2].monster[0].name;
					break;
				case 2:
					srcPathKey = '03_malnut';
					ev.animateMonsterBeat('../img/monster/' + srcPathKey + '.png', '../img/monster/' + srcPathKey + '_r.png');
					intervalFunc = function() {
					  ev.animateMonsterBeat('../img/monster/' + srcPathKey + '.png', '../img/monster/' + srcPathKey + '_r.png');
					};
					sys.biography[2].monster[1].open = true;
					typeName = sys.biography[2].monster[1].name;
					break;
			};
			break;
		case 4:
			interval = 700;
			switch (monster.type) {
				case 1:
					srcPathKey = '04_tsuno';
					ev.animateMonsterBeat('../img/monster/' + srcPathKey + '.png', '../img/monster/' + srcPathKey + '_r.png');
					intervalFunc = function() {
					  ev.animateMonsterBeat('../img/monster/' + srcPathKey + '.png', '../img/monster/' + srcPathKey + '_r.png');
					};
					sys.biography[3].monster[0].open = true;
					typeName = sys.biography[3].monster[0].name;
					break;
				case 2:
					srcPathKey = '04_double';
					ev.animateMonsterBeat('../img/monster/' + srcPathKey + '.png', '../img/monster/' + srcPathKey + '_r.png');
					intervalFunc = function() {
					  ev.animateMonsterBeat('../img/monster/' + srcPathKey + '.png', '../img/monster/' + srcPathKey + '_r.png');
					};
					sys.biography[3].monster[1].open = true;
					typeName = sys.biography[3].monster[1].name;
					break;
				case 3:
					srcPathKey = '04_spiky';
					ev.animateMonsterBeat('../img/monster/' + srcPathKey + '.png', '../img/monster/' + srcPathKey + '_r.png');
					intervalFunc = function() {
					  ev.animateMonsterBeat('../img/monster/' + srcPathKey + '.png', '../img/monster/' + srcPathKey + '_r.png');
					};
					sys.biography[3].monster[2].open = true;
					typeName = sys.biography[3].monster[2].name;
					break;
			}
			break;
		case 5:
			interval = 600;
			switch(monster.type){
				case 1:
					srcPathKey = '05_hane';
					ev.animateMonsterBeat('../img/monster/' + srcPathKey + '.png', '../img/monster/' + srcPathKey + '_r.png');
					intervalFunc = function() {
					  ev.animateMonsterBeat('../img/monster/' + srcPathKey + '.png', '../img/monster/' + srcPathKey + '_r.png');
					};
					sys.biography[4].monster[0].open = true;
					typeName = sys.biography[4].monster[0].name;

					break;
				case 2:
					srcPathKey = '05_long';
					ev.animateMonsterBeat('../img/monster/' + srcPathKey + '.png', '../img/monster/' + srcPathKey + '_r.png');
					intervalFunc = function() {
					  ev.animateMonsterBeat('../img/monster/' + srcPathKey + '.png', '../img/monster/' + srcPathKey + '_r.png');
					};
					sys.biography[4].monster[1].open = true;
					typeName = sys.biography[4].monster[1].name;
					break;
				case 3:
					srcPathKey = '05_crest';
					ev.animateMonsterBeat('../img/monster/' + srcPathKey + '.png', '../img/monster/' + srcPathKey + '_r.png');
					intervalFunc = function() {
					  ev.animateMonsterBeat('../img/monster/' + srcPathKey + '.png', '../img/monster/' + srcPathKey + '_r.png');
					};
					sys.biography[4].monster[2].open = true;
					typeName = sys.biography[4].monster[2].name;
					break;
				case 4:
					srcPathKey = '05_zombie';
					ev.animateMonsterBeat('../img/monster/' + srcPathKey + '.png', '../img/monster/' + srcPathKey + '_r.png');
					intervalFunc = function() {
					  ev.animateMonsterBeat('../img/monster/' + srcPathKey + '.png', '../img/monster/' + srcPathKey + '_r.png');
					};
					sys.biography[4].monster[3].open = true;
					typeName = sys.biography[4].monster[3].name;
					break;
			}
			break;
		case 6:
			interval = 500;
			switch(monster.type){
				case 1:
					srcPathKey = '06_last';
					ev.animateMonsterBeat('../img/monster/' + srcPathKey + '.png', '../img/monster/' + srcPathKey + '_r.png');
					intervalFunc = function() {
					  ev.animateMonsterBeat('../img/monster/' + srcPathKey + '.png', '../img/monster/' + srcPathKey + '_r.png');
					};
					sys.biography[5].monster[0].open = true;
					typeName = sys.biography[5].monster[0].name;
					break;
				case 2:
					srcPathKey = '06_king';
					ev.animateMonsterBeat('../img/monster/' + srcPathKey + '.png', '../img/monster/' + srcPathKey + '_r.png');
					intervalFunc = function() {
					  ev.animateMonsterBeat('../img/monster/' + srcPathKey + '.png', '../img/monster/' + srcPathKey + '_r.png');
					};
					sys.biography[5].monster[1].open = true;
					typeName = sys.biography[5].monster[1].name;
					break;
				case 3:
					srcPathKey = '06_god';
					ev.animateMonsterBeat('../img/monster/' + srcPathKey + '.png', '../img/monster/' + srcPathKey + '_r.png');
					intervalFunc = function() {
					  ev.animateMonsterBeat('../img/monster/' + srcPathKey + '.png', '../img/monster/' + srcPathKey + '_r.png');
					};
					sys.biography[5].monster[2].open = true;
					typeName = sys.biography[5].monster[2].name;
					break;
				case 4:
					srcPathKey = '06_invi';
					ev.animateMonsterBeat('../img/monster/' + srcPathKey + '.png', '../img/monster/' + srcPathKey + '_r.png');
					intervalFunc = function() {
					  ev.animateMonsterBeat('../img/monster/' + srcPathKey + '.png', '../img/monster/' + srcPathKey + '_r.png');
					};
					sys.biography[5].monster[3].open = true;
					typeName = sys.biography[5].monster[3].name;
					break;
				case 5:
					srcPathKey = '06_legend';
					ev.animateMonsterBeat('../img/monster/' + srcPathKey + '.png', '../img/monster/' + srcPathKey + '_r.png');
					intervalFunc = function() {
					  ev.animateMonsterBeat('../img/monster/' + srcPathKey + '.png', '../img/monster/' + srcPathKey + '_r.png');
					};
					sys.biography[5].monster[4].open = true;
					typeName = sys.biography[5].monster[4].name;
					break;
			break;
			}
		}

		$('#monster').attr('src','../img/monster/' + srcPathKey + '.png');
		v.monsterAnimateId = setInterval(intervalFunc, interval);
		monster.typeName = typeName;
		if (!isLoad && isEvol) {
          ev.addInformation(typeName + ' に しんかした。');
		}
		//process.generateBiography();

	},

	// モンスター動作(eggのみ)
	animateMonsterEgg : function() {
		// 動作フラグ
		if (v.m001flag === undefined) {
			v.m001flag = 0;
		} else {
			v.m001flag += 1;
		}
		if (v.m001flag > 3) {
			v.m001flag = 0;
		}

		// 横(真ん中)
		var fieldWidth = $('.monster-field').css('width');
		fieldWidth = parseInt(fieldWidth.substring(0, fieldWidth.length - 2),
				10) / 2 - 50;

		// 縦(真ん中)
		var fieldHeight = $('.monster-field').css('height');
		fieldHeight = parseInt(
				fieldHeight.substring(0, fieldHeight.length - 2), 10) / 2 - 50;

		switch (v.m001flag) {
		case 0:
			fieldWidth += 0;
			break;
		case 1:
			fieldWidth += -5;
			break;
		case 2:
			fieldWidth += 0;
			break;
		case 3:
			fieldWidth += 5;
			break;
		}

		$('#monster').css('left', fieldWidth + 'px');
		$('#monster').css('top', fieldHeight + 'px');

	},

	// モンスター動作(egg以外)
	animateMonsterBeat : function(imgSrc, imgrSrc) {
		// 動作フラグ
		if (v.motionflag === undefined) {
			v.motionflag = 0;
			// 横(真ん中)
			var fieldWidthPx = $('.monster-field').css('width');
			var fieldWidth = parseInt(fieldWidthPx.substring(0,
					fieldWidthPx.length - 2), 10);
			var posY = fieldWidth / 2 - 50;
			// 縦(真ん中)
			var fieldHeightPx = $('.monster-field').css('height');
			var fieldHeight = parseInt(fieldHeightPx.substring(0,
					fieldHeightPx.length - 2), 10);
			var posX = fieldHeight / 2 - 50;

		} else {
			v.motionflag += 1
			if (v.motionflag > 17) {
				v.motionflag = 0;
			}
			// 横(真ん中)
			var fieldWidthPx = $('.monster-field').css('width');
			var fieldWidth = parseInt(fieldWidthPx.substring(0,
					fieldWidthPx.length - 2), 10) - 100;
			var yRate = fieldWidth / 10;
			var posYnowPx = $('#monster').css('left');
			var posYnow = parseInt(
					posYnowPx.substring(0, posYnowPx.length - 2), 10);
			var posY = posYnow;
			if ((1 <= v.motionflag && v.motionflag <= 4)
					|| (14 <= v.motionflag && v.motionflag <= 17)) {
				posY += yRate;
				var uri = imgSrc;
			} else if (0 === v.motionflag) {
				posY = fieldWidth / 2;
			} else {
				posY -= yRate;
				var uri = imgrSrc;
			}

			// 縦(真ん中)
			var fieldHeightPx = $('.monster-field').css('height');
			var fieldHeight = parseInt(fieldHeightPx.substring(0,
					fieldHeightPx.length - 2), 10) - 50;
			var xRate = fieldHeight / 10;
			var posXnowPx = $('#monster').css('top');
			var posXnow = parseInt(
					posXnowPx.substring(0, posXnowPx.length - 2), 10);
			var posX = posXnow;
			// 上下(true:上／false:下)
			var updownflag = Math.round(Math.random() * 10) > 4 ? true : false;
			if (posXnow - xRate < 0) {
				updownflag = false;
			}
			if (posXnow + xRate + 100 > fieldHeight) {
				updownflag = true;
			}
			if (updownflag) {
				posX -= xRate;
			} else {
				posX += xRate;
			}
		}

		$('#monster').attr('src', uri);
		$('#monster').css('left', posY + 'px');
		$('#monster').css('top', posX + 'px');

	},

	/**** ずかん 関連 ****/
	// もんすたーぱねる
	generateBioPanel: function(id,name, imgSrc){
	  var divBase = $('<div></div>');
	  divBase.addClass('panel panel-default panel-bio');
	  var divHead = $('<div></div>');
	  divHead.addClass('panel-heading　panel-monster-info')
	         .attr('info-id',id)
	         .append(name)
	         .appendTo(divBase);
	  var divBody = $('<div></div>');
	  divBody.addClass('panel-body')
	         .append('<img src="' + imgSrc + '">')
	         .appendTo(divBase);
	  return divBase;
	},
	// セーブ用値に変換
	// type1とtype3が開放済み⇒ 2の(1-1)乗 + 2の(3-1)乗 ⇒ 1 + 4 = 5
	// (L1)+(L2)+(L3)+(L4)+(L5)+(L6) ※文字列(ex.135110)
	generateBioOpenSaveFlag:function(){
	  var tempArray = [];
	  for(var i = 0; i < sys.biography.length; i++){
	    var biolevel = sys.biography[i].level;
	    var monsters = sys.biography[i].monster;
	    var val = 0;
	    for(var j = 0; j < monsters.length; j++){
	      var mon = monsters[j];
	      if(mon.open){
	        val += Math.pow(2, j)
	      }
	    }
	    tempArray.push(val.toString());
      }
	  return tempArray.join('-');
    },

    // セーブ用値を図鑑変数に反映(ロード)
    generateBioOpenLoadFlag:function(val){
	  // 数列分解
      var array = val.split('-');

	  // さらに分解
	  var result = [];
	  array.forEach(function(ar){
        var resultArray = [];
        var temp = parseInt(ar,10);
		while(temp > 0){
	      var pcnt = 0;
	      var pow = Math.pow(2,pcnt);
	      while(temp - pow >= 0){
	    	pcnt += 1;
	        pow = Math.pow(2,pcnt);
	      }
	      temp -= Math.pow(2,pcnt-1);
	      resultArray.push(pcnt);
	    }
		result.push(resultArray);
	  });

	  // ずかんに反映
	  for(var i = 0; i < sys.biography.length; i++){
		 var monsters = sys.biography[i].monster;
		 for(var j = 0; j < monsters.length; j++){
		   var mon = monsters[j];
		   mon.open = false;
		   for(var k = 0; k < result[i].length; k++){
			 if(mon.type === result[i][k]){
		    	 mon.open = true;
		     }
		   }
		 }
	  }

    },


};

var Python = {

	requestMonsterInfo: function(){
		$.post('/cgi-bin/requestMonsterInfo.py',
			{

			},function(data){

			});
	},

	responseMonsterInfo: function(json){

			var ao = JSON.parse(json.response);

			sys.monsterinfo = ao;

	},

	requestSaveMonsterData: function(json){
		$.post('/cgi-bin/requestSaveMonsterData.py',
			json,function(data){

			});
	},

	responseSaveMonsterData: function(json){
		if(json.result === "true"){
			ev.addInformation('せーぶ しました。');
		}
	},

	requestLoadMonsterData: function(user){
		$.post('/cgi-bin/requestLoadMonsterData.py',
			{
				'user':user,
			},function(data){

			});

	},

	responseLoadMonsterData: function(json){
		if(json.result != 'nodate' && json.result != 'error'){
			v.loadData = JSON.parse(json.result)[0];
		}
		ev.dataLoad();
	},

};


// 処理
var process = {

	// 開始時
	start : function() {

		ev.setDifficulty('normal');

		// スペースキー処理
		// $('body').keypress(function(e) {
		// var code = e.originalEvent.code;
		// if (code === 'Space') {
		// //ev.pressSpace();
		//
		// }
		// });
		$('#span-difficulty-label').on('click', {
			label : $('#span-difficulty-label')
		}, function(e) {
			if (roulette.speed === 5) {
				e.data.label.removeClass('label-info');
				e.data.label.addClass('label-danger');
				roulette.speed = 100;
			} else {
				e.data.label.removeClass('label-danger');
				e.data.label.addClass('label-info');
				roulette.speed = 5;
			}
		});

		// 統計パネルヘッダー
		// $('#panel-head-statistic').css('cursor', 'pointer').on('click',
		// function() {
		// $('.list-detail').slideToggle();
		// });
		// $('.list-detail').hide();

		// ルーレットボタン
		$('#btn-roulette').on(
				'click',
				function() {
					var btn = $(this);
					if (btn.hasClass('btn-primary')) {
						btn.empty().removeClass('btn-primary').append('すとっぷ')
								.addClass('btn-warning');
					} else {
						btn.empty().removeClass('btn-warning').append('すたーと')
								.addClass('btn-primary');
					}
					ev.pressRouletteButton();

				});

		// 難易度ボタン
		$('.btn-dif').on('click', function() {
			var $btn = $(this);
			$('.btn-dif').removeClass('active');
			$btn.addClass('active');
			var id = $btn.attr('id');
			switch (id) {
			case 'label-dif-easy':
				ev.setDifficulty('easy');
				break;
			case 'label-dif-normal':
				ev.setDifficulty('normal');
				break;
			case 'label-dif-hard':
				ev.setDifficulty('hard');
				break;
			case 'label-dif-mad':
				ev.setDifficulty('mad');
				break;
			case 'label-dif-hell':
				ev.setDifficulty('hell');
				break;
			}
		});

		// 初期モンスター動作
		ev.changeMonster(1);
		// 開始メッセージ
		ev.addInformation('いらっしゃい');

		// ろーど
		Python.requestLoadMonsterData(docCookies.getItem("auth"));

		// せーぶ
		$('#btn-monster-data-save').on('click', function() {
			ev.dataSave();
		});
		// ろーど
		$('#btn-monster-data-load').on('click', function() {
			Python.requestLoadMonsterData(docCookies.getItem("auth"));
		});
		// じさつ
		$('#btn-monster-data-reset').on('click', function() {
			ev.dataReset();
		});

		// 難易度表示値変更
		ev.resetDifficultyButton();

		$('#a-log-out').on('click',function(){
			v.auth.logout();
		});

		$('#tab-menu-bio').on('click',function(){
			process.generateBiography();
		});

	},

	// 図鑑生成
	generateBiography:function(){
	  // クリア
	  $('.panel-bio').remove();

	  // DBから
		Python.requestMonsterInfo();
	  //sys.monsterinfo = alasql('SELECT * FROM monsterinfo ;');

	  // 未発見
	  var dummyName = '？？？';
	  var dummyImgSrc = "../img/monster/00_dummy.png";

	  // Level
	  var monsterCount = 0;
	  var openCount = 0;
	  for(var i = 0; i < sys.biography.length; i++){
        var biolevel = sys.biography[i].level;
        var monsters = sys.biography[i].monster;
        for(var j = 0; j < monsters.length; j++){
          var mon = monsters[j];
          monsterCount += 1;
          if(mon.open){
        	openCount += 1;
            $('#div-bio-level-' + biolevel).append(ev.generateBioPanel(i,mon.name, mon.src));
          }else{
        		$('#div-bio-level-' + biolevel).append(ev.generateBioPanel(i,dummyName, dummyImgSrc));
          }
      }
	  }

	  // こんぷりつ 表示
	  var comprate = Math.round((openCount / monsterCount)*100);
	  $('#span-bio-comp-now-rate').text(comprate);
	  $('#div-prog-bio-comp-bar').css('width', comprate + '%');

      // ずかん詳細
	  $('.panel-monster-info').css('cursor','pointer').on('click', function(){
			var header = $(this);
			var id = header.attr('info-id');
			var name = header.text();
			var mon = undefined;
			sys.monsterinfo.forEach(function(m){
		  	if(m.name === name){
          mon = m;
		  	}
			});
			if(mon){
			  $('#modal-monster-title').html(mon.name);
			  $('#modal-monster-body-detail').html(mon.detail);
			  $('#modal-monster-body-condition').html(mon.condi);
			  $('#modal-monster-info').modal();
			}
	  });
	},

};

// 処理開始
process.start();
