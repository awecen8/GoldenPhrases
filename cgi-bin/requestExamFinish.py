#! /usr/bin/python
# -*- coding: utf-8 -*-
import os
import cgi
import sys
import base64
import random
import MySQLdb
from datetime import datetime
from Crypto.Cipher import AES

#Debug Lod
fw = open('./src/debug.log','a')
fw.write("\n%s"%"---------requestExamFinish.py(" + datetime.now().strftime('%Y/%m/%d %H:%M:%S') + ")----------")
form = cgi.FieldStorage()

if os.environ['REQUEST_METHOD'] != "POST":
    print 'Access Denied.'
    sys.exit()

#Check Values#Check Values
if not form.has_key("user"):
    fw.write("\n%s"%"No input value")
    sys.exit()
if not form.has_key("examtype"):
    fw.write("\n%s"%"No input value")
    sys.exit()
if not form.has_key("genre"):
    fw.write("\n%s"%"No input value")
    sys.exit()

#Set Values
e = form["examtype"].value
u = form["user"].value
g = form["genre"].value

fw.write("\nexamtype:%s/user:%s"%(str(e),str(u)))

#Procedure

##### AES Tools #####
secret_key = 'this is secret:)'
crypto = AES.new(secret_key)

##### DB Login #####
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

resplist = []
counter = 0
while counter < len(questsArray) :
    qa = questsArray[counter]
    gpselectsql = "SELECT * FROM goldenPhrases WHERE genre = " + str(g) + " AND qnumber = " + qa + " ;"
    cursor.execute(gpselectsql)
    gpr = cursor.fetchall()
    d_id = str(gpr[0][0])
    d_genre = str(gpr[0][1])
    d_qnum = str(gpr[0][2])
    d_qjp = str(gpr[0][3].encode('utf_8'))
    d_qst  = str(gpr[0][4].encode('utf_8'))
    d_ans = str(gpr[0][5].encode('utf_8'))
    d_dtl = str(gpr[0][6].encode('utf_8'))
    d_usr = str(score[counter])
    resplistitem = "{\"id\":\"" + d_id + "\" " + ",\"genre\":\"" + d_genre + "\" " + ",\"qnum\":\"" + d_qnum + "\" " + ",\"qjp\":\"" + d_qjp + "\" " + ",\"qst\":\"" + d_qst + "\" " + ",\"ans\":\"" + d_ans + "\" " + ",\"com\":\"" + d_dtl + "\", \"usr\":\"" + d_usr +"\" }"
    resplist.append(resplistitem)
    counter += 1

response = "[" + ",".join(resplist) + "]"
# fw.write("\nresponse:%s"%str(response))

cursor.close()
connector.close()
fw.close()

print "Content-Type:text/javascript"
print
print "Python.responseExamFinish({'response':[%s]});"%(str(response))
