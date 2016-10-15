#! /usr/bin/python
# -*- coding: utf-8 -*-
import os
import cgi
import sys
import base64
import random
import MySQLdb
from datetime import datetime


if os.environ['REQUEST_METHOD'] != "POST":
    print 'Access Denied.'
    sys.exit()

#Check Values#Check Values
form = cgi.FieldStorage()

fw = open('./src/debug.log','a')
fw.write("\n%s"%"---------" + datetime.now().strftime('%Y/%m/%d %H:%M:%S') + "----------")

if not form.has_key("examtype"):
    fw.write("\n%s"%"No input value")
    sys.exit()


#Set Values
t = form["examtype"].value

#Randomize Response Questions
if t == "1":
    randg = 1
    randq = random.randint(1,100)
elif t == "2":
    randg = 1
    randq = random.randint(101,200)
elif t == "3":
    randg = 1
    randq = random.randint(201,300)
elif t == "4":
    randg = 1
    randq = random.randint(301,400)
elif t == "5":
    randg = 2
    randq = random.randint(1,100)
elif t == "6":
    randg = 2
    randq = random.randint(101,200)
elif t == "7":
    randg = 2
    randq = random.randint(201,300)
elif t == "8":
    randg = 3
    randq = random.randint(1,100)
elif t == "9":
    randg = 3
    randq = random.randint(101,200)
elif t == "10":
    randg = 4
    randq = random.randint(1,100)
elif t == "11":
    randg = 5
    randq = random.randint(1,100)
elif t == "12":
    randg = 5
    randq = random.randint(101,200)
elif t == "13":
    randg = 5
    randq = random.randint(201,319)
else:
    randg = 0
    randq = 0

# DBへログイン
# localhostの場合は省略可
connector = MySQLdb.connect(host="localhost", db="gphrases", user="root", passwd="mysql", charset="utf8")
cursor = connector.cursor()
# SQL
sql = "SELECT * FROM goldenPhrases WHERE genre = \'" + str(randg) + "\' AND qnumber = \'" + str(randq) + "\' ;"
cursor.execute(sql)
result = cursor.fetchall()
rec = []

for row in result:
    rec.append(row)
    fw.write("\n%s"%str(row))

cursor.close()
connector.close()

if len(rec) > 0:
    ctx = rec[0][3].encode('utf_8').replace("\'","\\\'")
    qst = rec[0][4].encode('utf_8').replace("\'","\\\'")
    response = "true"
else:
    ctx = "ERROR"
    qst = "-"
    response = "false"

fw.close()

print "Content-Type:text/javascript"
print
print "Python.responseQuestion({'result':'%s','genre':'%s','qnum':'%s','examtype':'%s','ctx':'%s',qst:'%s'});"%(response,str(randg),str(randq),str(t),ctx,qst)
