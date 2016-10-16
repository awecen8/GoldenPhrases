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

if os.environ['REQUEST_METHOD'] != "POST":
    print 'Access Denied.'
    sys.exit()

form = cgi.FieldStorage()
print form
if not form.has_key("genre"):
    print 'No input value'
    sys.exit()

if not form.has_key("qNumber"):
    print 'No input value'
    sys.exit()

if not form.has_key("inputAnswerValue"):
    print 'No input value'
    sys.exit()

if not form.has_key("user"):
    print 'No input value'
    sys.exit()

if not form.has_key("examtype"):
    print 'No input value'
    sys.exit()

g   = form["genre"].value
q   = form["qNumber"].value
v   = form["inputAnswerValue"].value
u   = form["user"].value
t   = form["examtype"].value

fw = open('./src/debug.log','a')
fw.write("\n%s"%"---------requestAnswerExam.py(" + datetime.now().strftime('%Y/%m/%d %H:%M:%S') + ")----------")

fw.write("\ngenre: %s / qnum: %s / answer: %s / user: %s / examtype: %s"%(str(g),str(q),str(v),str(u),str(t)))

#Procedure

##### Read Setting File #####
inifile = ConfigParser.SafeConfigParser()
inifile.read('./config.ini')

##### AES Tool #####
secret_key = inifile.get('pycrypto', 'key')
crypto = AES.new(secret_key)

# DBへログイン
# localhostの場合は省略可
host = inifile.get('mysql', 'host')
db = inifile.get('mysql', 'db')
user = inifile.get('mysql', 'user')
passwd = inifile.get('mysql', 'passwd')
charset = inifile.get('mysql', 'charset')

connector = MySQLdb.connect(host=host, db=db, user=user, passwd=passwd, charset=charset)
cursor = connector.cursor()

###### Temp Exam result #####
sql = "SELECT * FROM examtemp WHERE user = \'" + str(u) + "\' AND examtype = " + t + " ;"
fw.write("\nSearchTempSql:%s"%str(sql))
cursor.execute(sql)
result = cursor.fetchall()

encQuests = result[0][3]
encScore = result[0][4]

decQuests = crypto.decrypt(encQuests.decode('hex'))
decScore = crypto.decrypt(encScore.decode('hex'))
questsStr = decQuests.replace(" ","")
questsArray = questsStr.split(":")
score = decScore.replace(" ","")
fw.write("\nscore:%s"%str(score))

##### ANSWER Check #####
sql = "SELECT * FROM goldenPhrases WHERE genre = " + g + " AND qnumber = \'" + q + "\' ;"
fw.write("\nselect:%s"%str(sql))
cursor.execute(sql)
result = cursor.fetchall()
rec = []

for row in result:
    rec.append(row)

ans = rec[0][5].encode('utf_8').replace("\'","\\\'")
comment = rec[0][6].encode('utf_8').replace("\'","\\\'")

sindex = questsArray.index(str(q))

if v == ans:
    newScore = score[0:int(sindex)] + "1" + score[int(sindex)+1:len(score)]
    result = "true"
    # comment = rec[0][6].encode('utf_8')
else:
    newScore = score[0:int(sindex)] + "2" + score[int(sindex)+1:len(score)]
    result = "false"
    # comment = "You’re no match for my brains."

# encrypt
fw.write("\nnew:%s"%str(newScore))
baseScore = newScore
if (len(baseScore ) % 16) != 0:
    m = 16 - (len(baseScore ) % 16)
    insertScore = baseScore  + (" " * m)
else:
    insertScore = baseScore
encUpdateScore = crypto.encrypt(insertScore).encode('hex')

sqlupd = "UPDATE examtemp SET score = \'" + encUpdateScore + "\' WHERE user = \'" + str(u) + "\' AND examtype = " + t + " ;"
fw.write("\nsqlupd:%s"%str(sqlupd))

cursor.execute(sqlupd)
resultupd = cursor.fetchall()
connector.commit()

cursor.close()
connector.close()

#Output
print "Content-Type:text/javascript"
print
print "Python.responseAnswer({'genre':'%s','qnumber':'%s','result':'%s','ans':'%s','comment':'%s'});"%(str(g),str(q),str(result),str(ans),str(comment))
