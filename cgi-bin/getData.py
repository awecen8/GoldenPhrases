#! /usr/bin/python
# -*- coding: utf-8 -*-
import os
import cgi
import sys
import base64
import MySQLdb
import ConfigParser

if os.environ['REQUEST_METHOD'] != "POST":
    print 'Access Denied.'
    sys.exit()

#Check Values#Check Values

#Set Values

#Procedure

##### DB Login #####
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
