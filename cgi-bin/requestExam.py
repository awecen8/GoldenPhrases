#! /usr/bin/python
# -*- coding: utf-8 -*-
import os
import cgi
import sys
import base64
import random
import MySQLdb
import ConfigParser
from datetime import datetime
from Crypto.Cipher import AES

#Debug Lod
fw = open('./src/debug.log','a')
fw.write("\n%s"%"---------requestExam.py(" + datetime.now().strftime('%Y/%m/%d %H:%M:%S') + ")----------")
form = cgi.FieldStorage()

if os.environ['REQUEST_METHOD'] != "POST":
    print 'Access Denied.'
    sys.exit()

if not form.has_key("examtype"):
    fw.write("\n%s"%"No input value")
    sys.exit()
if not form.has_key("user"):
    fw.write("\n%s"%"No input value")
    sys.exit()

#Set Values
t = str(form["examtype"].value)
u = str(form["user"].value)
if t == "1":
    g = 1
    qmin = 1
    qmax = 400
    num = 10
elif t == "2":
    g = 2
    qmin = 1
    qmax = 300
    num = 10
elif t == "3":
    g = 3
    qmin = 1
    qmax = 200
    num = 10
elif t == "4":
    g = 4
    qmin = 1
    qmax = 100
    num = 10
else:
    g = 5
    qmin = 1
    qmax = 319
    num = 10

fw.write("\nexamtype:%s/user:%s"%(str(t),str(u)))

# DBへログイン
# localhostの場合は省略可
inifile = ConfigParser.SafeConfigParser()
inifile.read('./config.ini')
host = inifile.get('mysql', 'host')
db = inifile.get('mysql', 'db')
user = inifile.get('mysql', 'user')
passwd = inifile.get('mysql', 'passwd')
charset = inifile.get('mysql', 'charset')

connector = MySQLdb.connect(host=host, db=db, user=user, passwd=passwd, charset=charset)
cursor = connector.cursor()

##### AES Util #####
secret_key = 'this is secret:)'
crypto = AES.new(secret_key)

##### temp data ######
alrsql = "SELECT * FROM examtemp WHERE user = \'" + str(u) + "\' AND examtype = \'" + t + "\' ;"
cursor.execute(alrsql)
alrtemp = cursor.fetchall()

if len(alrtemp) > 0:
    encQuests = alrtemp[0][3]
    encScore = alrtemp[0][4]
    fw.write("\nencQuests:%s / encScore:%s"%(str(encQuests),str(encScore)))
    # Decrypt

    decQuests = crypto.decrypt(encQuests.decode('hex'))
    quests = decQuests.replace(" ","")
    decScore = crypto.decrypt(encScore.decode('hex'))
    score = decScore.replace(" ","")
    fw.write("\nquests:%s / score:%s"%(str(quests),str(score)))
else:
    ### MAX ID ###
    sqlmaxid = "SELECT IFNULL((SELECT MAX(id) + 1 FROM examtemp),1); "
    fw.write("\nsqlmaxid:%s"%str(sqlmaxid))
    cursor.execute(sqlmaxid)
    resultmaxid = cursor.fetchall()
    maxid = str(resultmaxid[0][0])

    ### Default Ramdom Quests ###

    # user score
    sqluserscore = "SELECT * FROM score WHERE user = \'" + str(u) + "\' AND examtype = " + str(g) + ";"
    fw.write("\nsqluserscore:%s"%str(sqluserscore))
    cursor.execute(sqluserscore)
    encResultUserScore = cursor.fetchall()
    decUserScore = crypto.decrypt(encResultUserScore[0][3].decode('hex')).replace(" ","")
    decUserScoreArray = []
    for dus in decUserScore:
        decUserScoreArray.append(dus)
    fw.write("\nDecUserScoreArray:%s"%str(decUserScoreArray))

    # weighting
    randomWeightingArray = []
    ucaIndex = 0
    while ucaIndex < len(decUserScoreArray):
        weight = 5 - int(decUserScoreArray[ucaIndex])
        while weight > 0:
            randomWeightingArray.append(int(ucaIndex) + 1)
            weight -= 1
        ucaIndex += 1
    fw.write("\nRandomWeightArrayLength:%s"%str(len(randomWeightingArray)))

    # kind narrowing
    randomWeightingKindArray = []
    for rwk in randomWeightingArray:
        if rwk not in randomWeightingKindArray :
            randomWeightingKindArray.append(rwk)

    # quests Array
    tempQuestsArrayInt = []
    if 10 <= len(randomWeightingKindArray):
        while len(tempQuestsArrayInt) < num:
            rndn = random.randint(0, len(randomWeightingArray)-1)
            rndq = int(randomWeightingArray[rndn])

            if rndq not in tempQuestsArrayInt :
                # fw.write("\nrndq(true):%s"%str(rndq))
                tempQuestsArrayInt.append(rndq)
            # else:
                # fw.write("\nrndq(false):%s"%str(rndq))
    else:
        for rwa in randomWeightingArray:
            if rwa not in tempQuestsArrayInt:
                tempQuestsArrayInt.append(rwa)

        while len(tempQuestsArrayInt) < num:
            rndq = random.randint(0, len(decUserScoreArray)-1)
            if rndq not in tempQuestsArrayInt :
                tempQuestsArrayInt.append(rndq)

    tempQuestsArrayInt.sort()
    # fw.write("\nTempQuestsArrayInt:%s"%str(tempQuestsArrayInt))

    tempQuestsArray = []
    for tqai in tempQuestsArrayInt:
        tempQuestsArray.append(str(tqai))

    # encode
    questsStr = ":".join(tempQuestsArray)
    # fw.write("\nquestsStr:%s"%str(questsStr))
    if len(questsStr)%16 != 0:
        m = 16-(len(questsStr)%16)
        quests = questsStr + (" " * m)
    else:
        quests = questsStr
    encQuests = crypto.encrypt(quests).encode('hex')

    ### Default Score ###
    baseScore = "0" * num
    if len(baseScore)%16 != 0:
        m = 16-(len(baseScore)%16)
        score = baseScore + (" " * m)
    else:
        score = baseScore
    encScore = crypto.encrypt(score).encode('hex')

    ### DB Insert ###
    sqlins = "INSERT INTO examtemp VALUES(" + maxid + ",\'" + str(u) + "\'," + t + ",\'" + encQuests +"\',\'" + encScore + "\');"
    # fw.write("\nsqlins:%s"%str(sqlins))
    cursor.execute(sqlins)
    resultins = cursor.fetchall()
    connector.commit()

##### Randomize Response Questions #####
questsArray = quests.replace(" ","").split(":")
randg = g
count = 0
rem = 0
tcnt = 0
fcnt = 0
while count < len(score):
    if score[count] == "0":
        rem += 1
    elif score[count] == "1":
        tcnt += 1
    elif score[count] == "2":
        fcnt += 1
    count += 1
# fw.write("\nt=1,rem=%s,tcnt=%s,fcnt=%s"%(str(rem),str(tcnt),str(fcnt)))

randq = 0
if rem > 0:
    isFinish = 0
    isFirst = 0
    # fw.write("\nquestsArray:%s"%str(questsArray))
    while isFirst == 0:
        rand = random.randint(0,num-1)
        if score[rand] == "0":
            isFirst += 1
            # fw.write("\nrandq:%s"%str(rand))
            randq += int(questsArray[rand])
else:
    randq += 0
    isFinish = 1

if isFinish == 0:
    # DBへログイン
    # localhostの場合は省略可
    connector = MySQLdb.connect(host="localhost", db="gphrases", user="root", passwd="mysql", charset="utf8")
    cursor = connector.cursor()
    # SQL
    sql = "SELECT * FROM goldenPhrases WHERE genre = \'" + str(randg) + "\' AND qnumber = \'" + str(randq) + "\' ;"
    # fw.write("\nselect_gp_sql:%s"%str(sql))
    cursor.execute(sql)
    result = cursor.fetchall()
    rec = []

    for row in result:
        rec.append(row)
        # fw.write("\nselectRecord:%s"%str(row))

    cursor.close()
    connector.close()

    if len(rec) > 0:
        ctx = rec[0][3].encode('utf_8')
        qst = rec[0][4].encode('utf_8')
        response = "true"
    else:
        ctx = "ERROR"
        qst = "-"
        response = "false"
else :
    ctx = "FINISH"
    qst = "-"
    response = "finish"

newctx = ctx.replace("\'","\\\'")
newqst = qst.replace("\'","\\\'")

fw.write("\nctx:%s"%str(newctx))
fw.write("\nqst:%s"%str(newqst))
fw.write("\nresponse:%s"%str(response))
fw.close()

print "Content-Type:text/javascript"
print
print "Python.responseExam({'result':'%s','genre':'%s','qnum':'%s','examtype':'%s','ctx':'%s',qst:'%s',rem:'%s',tcnt:'%s',fcnt:'%s'});"%(response,str(randg),str(randq),str(t),str(newctx),str(newqst),rem,tcnt,fcnt)
