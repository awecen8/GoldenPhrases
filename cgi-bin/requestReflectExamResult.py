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
fw.write("\n%s"%"---------requestReflectExamResult.py(" + datetime.now().strftime('%Y/%m/%d %H:%M:%S') + ")----------")
form = cgi.FieldStorage()

if os.environ['REQUEST_METHOD'] != "POST":
    print 'Access Denied.'
    sys.exit()

### Check Values#Check Values
if not form.has_key("examtype"):
    fw.write("\n%s"%"No input value")
    sys.exit()
if not form.has_key("user"):
    fw.write("\n%s"%"No input value")
    sys.exit()

try:
    #Set Values
    e = form["examtype"].value
    u = form["user"].value
    minq = 0
    maxq = 0

    if e == "1":
        minq = 1
        maxq = 400
    elif e == "2":
        minq = 1
        maxq = 300
    elif e == "3":
        minq = 1
        maxq = 200
    elif e == "4":
        minq = 1
        maxq = 100
    else :
        minq = 1
        maxq = 319
    fw.write("\nexamtype:%s/user:%s"%(str(e),str(u)))

    #Procedure

    ##### AES Tools #####
    secret_key = 'this is secret:)'
    crypto = AES.new(secret_key)

    ##### DB LOGIN #####
    # localhostの場合は省略可
    connector = MySQLdb.connect(host="localhost", db="gphrases", user="root", passwd="mysql", charset="utf8")
    cursor = connector.cursor()

    ###### Temp Exam result #####
    sql = "SELECT * FROM examtemp WHERE user = \'" + str(u) + "\' AND examtype = " + e + " ;"
    cursor.execute(sql)
    result = cursor.fetchall()

    encQuests = result[0][3]
    encScore = result[0][4]

    decQuests = crypto.decrypt(encQuests.decode('hex'))
    decScore = crypto.decrypt(encScore.decode('hex'))
    questsStr = decQuests.replace(" ","")
    questsArray = questsStr.split(":")
    score = decScore.replace(" ","")
    fw.write("\nquests:%s"%str(questsStr))
    fw.write("\nscore:%s"%str(score))

    ##### already score #####
    scoresql = "SELECT * FROM score WHERE user = \'" + u + "\' AND examtype = " + e + " ;"
    cursor.execute(scoresql)
    scoreresult = cursor.fetchall()
    fw.write("\nSearchAlreadyScore:%s"%str(scoresql))

    ## For Result Display
    responseScoreArray = []

    if len(scoreresult) == 0:
        sqlmaxid = "SELECT IFNULL((SELECT MAX(id) + 1 FROM score),1); "
        cursor.execute(sqlmaxid)
        resultmaxid = cursor.fetchall()
        maxid = str(resultmaxid[0][0])

        newBaseScoreArray = []
        count = 0
        while count < maxq:
            newBaseScoreArray.append("0")
            count += 1
        fw.write("\ncreated newscore ")
        fw.write("\nnewBaseScoreArray:%s"%str(newBaseScoreArray))

        count = 0
        while count < len(questsArray):

            if score[count] == "1":
                newBaseScoreArray[int(questsArray[count]) - 1] = "1"
                responseScoreArray.append("\"0 → 1\"")
            else:
                responseScoreArray.append("\"0 → 0\"")
            count += 1
        fw.write("\nnewBaseScoreArray:%s"%str(newBaseScoreArray))
        newscore = "".join(newBaseScoreArray)
        fw.write("\nnewscore:%s"%str(newscore))

        if len(newscore)%16 != 0:
            m = 16-(len(newscore)%16)
            msg = newscore + (" " * m)
        else:
            msg = newscore
        cipher = crypto.encrypt(msg).encode('hex')

        inssql = "INSERT INTO score VALUES(" + maxid + ",\'" + u + "\', " + e + ",\'" + cipher + "\');"

    else:
        sqlmaxid = "SELECT IFNULL((SELECT MAX(id) + 1 FROM score),1); "
        cursor.execute(sqlmaxid)
        resultmaxid = cursor.fetchall()
        maxid = str(resultmaxid[0][0])

        r = []
        for res in score:
            if res == "1":
                r.append("1")
            else:
                r.append("0")
        examScore = "".join(r)
        fw.write("\nexamScore:%s"%str(examScore))

        encScore = scoreresult[0][3]
        fw.write("\nencScore:%s"%str(scoreresult[0][3]))
        decScore = crypto.decrypt(encScore.decode('hex'))
        scoreNow = decScore.replace(" ","")
        fw.write("\nscoreNow:%s"%str(scoreNow))

        tempScoreArray = []
        tempScoreArray.append(scoreNow)
        cnt = 0
        while cnt < len(questsArray):
            latestScore = tempScoreArray[len(tempScoreArray)-1]
            # fw.write("\nlatestScore:%s"%str(latestScore))
            sn = latestScore[int(questsArray[cnt])-1]
            ts = examScore[cnt]
            plu = int(sn) + int(ts)
            if 5 < plu:
                plus = 5
                responseScoreArray.append("\"5 → 5\"")
            else:
                plus = plu
                responseScoreArray.append("\"" + str(sn) + " → " + str(plus) + "\"")

            newScoreNow = str(latestScore[0:int(questsArray[cnt])-1]) + str(plus) + str(latestScore[int(questsArray[cnt]): len(latestScore)])
            tempScoreArray.append(newScoreNow)
            cnt += 1

        fw.write("\nnewScore:%s"%str(tempScoreArray[len(tempScoreArray)-1]))
        newScore = tempScoreArray[len(tempScoreArray)-1]
        # score = "".join(tempScoreArray)
        # fw.write("\nscore:%s"%str(score))

        if len(newScore)%16 != 0:
            m = 16-(len(newScore)%16)
            msg = newScore + (" " * m)
        else:
            msg = newScore

        cipher = crypto.encrypt(msg).encode('hex')

        inssql = "UPDATE score SET detail = \'" + cipher + "\' WHERE examtype = " + e + " AND user = \'" + u + "\' ;"

    cursor.execute(inssql)
    fw.write("\ninssql:%s"%str((inssql)))
    rows = cursor.fetchall()

    if rows > 0:
        connector.commit()
        delsql = "DELETE FROM examtemp WHERE user = \'" + u + "\' AND examtype = " + e + " ;"
        fw.write("\ndelsql:%s"%str((delsql)))
        cursor.execute(delsql)
        connector.commit()

    response = "[" + ",".join(responseScoreArray) + "]"
    result = "true"
except:
    fw.write("\n%s"%str("******EXCEPTION*******"))
    response = "[]"
    result = "false"

finally:
    cursor.close()
    connector.close()
    fw.close()

print "Content-Type:text/javascript"
print
print "Python.responseReflectExamResult({'result':%s,'response':%s});"%(str(result),str(response))
