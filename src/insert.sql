-- CREATE TABLE eigo.questions(
--   id int NOT NULL,
--   ctx VARCHAR(255),
--   ans VARCHAR(255),
--   dtl VARCHAR(255),
--   PRIMARY KEY(id)
-- );

-- INSERT INTO questions VALUES
-- (1,'[adverb] immediately afterwards','next','---'),
-- (2,'[determiner,sdjective,pronoun] used to refer to the second of two people or things, which is not the one you already have or the one you have already mentioned','other','---'),
-- (3,'[verb] if you use a particular tool, method, service, ability etc, you do something with that tool, by means of that method etc, for a ','use','---'),
-- (4,'[determiner, predeterminer, pronoun] of the same kind as the thing or person which has already been mentioned','such','---'),
-- (5,'[verb] also	have got [not in progressive]	especially British English used to say what someone or something looks like, what qualities or features they possess etc ','have','---'),
-- (6,'[pronoun] a number of people or things or an amount of something, when the exact number or amount is not stated','some','---'),
-- (7,'[adjective] used to say that there is one person, thing, or group in a particular situation and no others','only','---'),
-- (8,'[adverb] used to emphasize something that is unexpected or surprising in what you are saying','even','---'),
-- (9,'[determiner] every one of two or more things or people, considered separately','each','---'),
-- (10,'[verb] used with a noun instead of using a verb to describe an action. For example, if you take a walk, you walk somewhere','take','---');

-- ALTER TABLE questions ADD genre varchar(255) AFTER id;
-- ALTER TABLE questions ADD qnumber varchar(255) AFTER genre;
-- ALTER TABLE questions DROP qnumber;
-- ALTER TABLE questions ADD qnumber INT AFTER genre;

-- UPDATE questions SET genre = 'A01';
-- UPDATE questions SET qnumber = 1 WHERE id = 1;
-- UPDATE questions SET qnumber = 2 WHERE id = 2;
-- UPDATE questions SET qnumber = 3 WHERE id = 3;
-- UPDATE questions SET qnumber = 4 WHERE id = 4;
-- UPDATE questions SET qnumber = 5 WHERE id = 5;
-- UPDATE questions SET qnumber = 6 WHERE id = 6;
-- UPDATE questions SET qnumber = 7 WHERE id = 7;
-- UPDATE questions SET qnumber = 8 WHERE id = 8;
-- UPDATE questions SET qnumber = 9 WHERE id = 9;
-- UPDATE questions SET qnumber = 10 WHERE id = 10;

-- CREATE TABLE goldenPhrases(
--   id int NOT NULL,
--   genre int NOT NULL,
--   qnumber int NOT NULL,
--   questjp varchar(255) NOT NULL,
--   quest VARCHAR(255) NOT NULL,
--   ans VARCHAR(255) NOT NULL,
--   dtl VARCHAR(255) NOT NULL,
--   PRIMARY KEY(id)
-- );
-- ALTER TABLE goldenPhrases ADD questjp varchar(255) AFTER id;
--
-- INSERT INTO goldenPhrases VALUES
-- (1,1,1,'とにかくやってみよう。','Let\\\'s try a-------.','anywhere','Q001:(略)'),
-- (2,1,2,'注文を出荷する準備が出来ました。','We are ready to s------- your order.','shipment','Q002:(略)'),
-- (3,1,3,'研修に参加する。','a----- a workshop','attend','Q003:(略)'),
-- (4,1,4,'そのイベントは成功だった。','The event was s-------','success','Q004:(略)');
--
-- UPDATE goldenPhrases SET quest = 'Let\\\'s try a-------.' WHERE id = 1;

CREATE TABLE users(
  id int NOT NULL,
  name varchar(255) NOT NULL,
  pass varchar(255) NOT NULL,
  PRIMARY KEY(id)
);

INSERT INTO users VALUES (1, 'admin','admin','A');
INSERT INTO users VALUES (2, 'manabe','manabe','A');
INSERT INTO users VALUES (3, 'arakawa','arakawa','A');
ALTER TABLE users ADD permission varchar(255) AFTER pass;

UPDATE users SET permission = 'A';
INSERT INTO users VALUES (4, 'inoue','inoue','a');

CREATE TABLE score(
  id int NOT NULL,
  user varchar(255) NOT NULL,
  examtype int NOT NULL,
  detail varchar(255) NOT NULL,
  PRIMARY KEY(id)
);

INSERT INTO score VALUES(1, 'admin','1','c84b10e3505dd1c90c4d6bdc27986b31c84b10e3505dd1c90c4d6bdc27986b31c84b10e3505dd1c90c4d6bdc27986b31c84b10e3505dd1c90c4d6bdc27986b31c84b10e3505dd1c90c4d6bdc27986b31c84b10e3505dd1c90c4d6bdc27986b31c84b10e3505dd1c90c4d6bdc27986b31c84b10e3505dd1c90c4d6bdc27986b31c84b10e3505dd1c90c4d6bdc27986b31c84b10e3505dd1c90c4d6bdc27986b31c84b10e3505dd1c90c4d6bdc27986b31c84b10e3505dd1c90c4d6bdc27986b31c84b10e3505dd1c90c4d6bdc27986b31c84b10e3505dd1c90c4d6bdc27986b31c84b10e3505dd1c90c4d6bdc27986b31c84b10e3505dd1c90c4d6bdc27986b31c84b10e3505dd1c90c4d6bdc27986b31c84b10e3505dd1c90c4d6bdc27986b31c84b10e3505dd1c90c4d6bdc27986b31c84b10e3505dd1c90c4d6bdc27986b31c84b10e3505dd1c90c4d6bdc27986b31c84b10e3505dd1c90c4d6bdc27986b31c84b10e3505dd1c90c4d6bdc27986b31c84b10e3505dd1c90c4d6bdc27986b31c84b10e3505dd1c90c4d6bdc27986b31')

-- ALTER TABLE monster ADD user varchar(255) AFTER id;
-- CREATE TABLE monster(
--   id int NOT NULL,
--   user varchar(255) NOT NULL,
--   play int NOT NULL ,
--   prize int NOT NULL,
--   tecnt int NOT NULL,
--   tncnt int NOT NULL,
--   thcnt int NOT NULL,
--   tmcnt int NOT NULL,
--   tzcnt int NOT NULL,
--   fcnt int NOT NULL,
--   exp int NOT NULL,
--   allexp int NOT NULL,
--   exprate int NOT NULL,
--   level int NOT NULL,
--   type int NOT NULL,
--   bio varchar(255),
--   reset int NOT NULL,
--   PRIMARY KEY(id)
-- );
--
-- CREATE TABLE monsterinfo(
--   id int NOT NULL,
--   level int NOT NULL,
--   name varchar(255) NOT NULL,
--   srckey varchar(255) NOT NULL,
--   condi varchar(255) NOT NULL,
--   detail varchar(255) NOT NULL,
--   openflag int NOT NULL,
--   PRIMARY KEY(id)
-- );
--
-- INSERT INTO monsterinfo VALUES(1,1,'たまご','01_egg','-','ただのたまご。<br>うずうず<br>もすもす',1),
-- (2,2,'ひよっこ','02_puppy','-','うまれたて。<br>あるくのもやっと。<br>かけまわりたい。',0),
-- (3,3,'いっぱし','03_normal','-','あるくのになれてきた。<br>きずだらけ。<br>かさぶたぶたぶ。',0),
-- (4,3,'えいようぶそく','03_malnut','M = 0 OR Z = 0','もっといいものを たべたほうがいい。<br>つよいてきに たちむかうべき。',0),
-- (5,4,'つの','04_tsuno','-','わりと ししゅんき。<br>でも とうふ めんたる。<br>けっか めんどくさいやつ。',0),
-- (6,4,'にほんつの','04_double','RATE >= 80','なんにでも つっかかるかんじ。<br>そんなじぶんに よっちゃう。<br>いわゆる さとりせだい。',0),
-- (7,4,'とげとげ','04_spiky','にほんつの AND E >= 30 AND N >= 20 AND H >= 10 AND M >= 5 AND Z >= 1' ,'ひねくれてるのが<br>かっこいいとおもっちゃう。<br>おとなになって こうかいすればいい。',0),
-- (8,5,'はね','05_hane','-','ちかごろ ゆめみがちな はつげんがふえる。<br>かるい めんへら。<br>ぽえむとか かいちゃう。',0),
-- (9,5,'あしなが','05_long','PLAY <= 200','げんじつから にげるのだけは だれにもまけない。<br>じぶんにとって つごうがわるいものは みない。',0),
-- (10,5,'とさか','05_crest','あしなが AND E >= 70 AND N >= 50 AND H >= 20 AND M >= 10 AND Z >= 5','そろそろ わるめだちにも あきてきた。<br>まじめけい ひとりおおかみ。<br>あと きゅうりが にがて。',0),
-- (11,5,'ぞんび','05_zombie','RATE <= 40','ざせつを くりかえして む のきょうち。<br>とりあえず こわいものは ない。<br>でも それで ほんとに しあわせなの ？',0),
-- (12,6,'おとな','06_last','-','しゃかいの はぐるまでも いいじゃない。<br>かいがい どらまに むちゅう。',0),
-- (13,6,'きんぐ','06_king','PLAY <= 300','みえっぱりだけど どこかうすっぺらい。<br>もうそうへき。 こちょうへき。 きょげんへき。',0),
-- (14,6,'ごっど','06_god','きんぐ AND E >= 100 AND N >= 70 AND H >= 50 AND M >= 20 AND Z >= 5','むかしはよかった とか いっちゃうんだよ。<br>わかいめを つむんだよ。',0),
-- (15,6,'むてき','06_invi','ごっど AND RATE >= 80','じどうどあが あいてくれない そんざいかん。<br>だいじょうぶ。 いるのは しってる。',0),
-- (16,6,'でんせつ','06_legend','むてき AND ALLEXP >= 30000','「でんきせつび」の りゃくだから。<br>たいしたこと ないんだから。<br>おつかれさまでした。',0);

CREATE TABLE examtemp(
  id int NOT NULL,
  user varchar(255) NOT NULL,
  val varchar(255) NOT NULL,
  PRIMARY KEY(id)
);

ALTER TABLE examtemp ADD examtype int AFTER user;
ALTER TABLE examtemp CHANGE val score varchar(2048);
