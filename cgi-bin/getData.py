#! /usr/bin/python
# -*- coding: utf-8 -*-
import os
import cgi
import sys
import base64
import MySQLdb

if os.environ['REQUEST_METHOD'] != "POST":
    print 'Access Denied.'
    sys.exit()

#Check Values#Check Values

#Set Values

#Procedure

# DBへログイン
# localhostの場合は省略可
connector = MySQLdb.connect(host="localhost", db="gphrases", user="root", passwd="mysql", charset="utf8")
cursor = connector.cursor()
# SQL
sql = "SELECT * FROM goldenPhrases ;"
cursor.execute(sql)
result = cursor.fetchall()
rec = []

for row in result:
    rec.append(row)

cursor.close()
connector.close()

resplist = []

for r in rec:
    d_id = str(r[0])
    d_genre = str(r[1])
    d_qnum = str(r[2])
    d_qjp = str(r[3].encode('utf_8'))
    d_qst  = str(r[4].encode('utf_8'))
    d_ans = str(r[5].encode('utf_8'))
    d_dtl = str(r[6].encode('utf_8'))
    resplistitem = "{\"id\":\"" + d_id + "\" " + ",\"genre\":\"" + d_genre + "\" " + ",\"qnum\":\"" + d_qnum + "\" " + ",\"qjp\":\"" + d_qjp + "\" " + ",\"qst\":\"" + d_qst + "\" " + ",\"ans\":\"" + d_ans + "\" " + ",\"com\":\"" + d_dtl + "\"}"
    resplist.append(resplistitem)

response = ",".join(resplist)

print "Content-Type:text/javascript"
print
print "Python.responseDbData({'result':[%s]});"%(response)
