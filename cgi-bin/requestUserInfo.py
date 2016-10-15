#! /usr/bin/python
# -*- coding: utf-8 -*-
import os
import cgi
import sys
import base64
import MySQLdb
import datetime
import os,cgi,cgitb,Cookie; cgitb.enable()
from Cookie import SimpleCookie

if os.environ['REQUEST_METHOD'] != "POST":
    print 'Access Denied.'
    sys.exit()

#Check Values#Check Values
form = cgi.FieldStorage()

fw = open('./src/debug.log','a')
fw.write("\n%s"%"---------" + datetime.datetime.now().strftime('%Y/%m/%d %H:%M:%S') + "----------")

if not form.has_key("user"):
    print 'No input value'
    sys.exit()

#Set Values
u = form["user"].value
fw.write("\nuser:%s"%(u))

# DBへログイン
# localhostの場合は省略可
connector = MySQLdb.connect(host="localhost", db="gphrases", user="root", passwd="mysql", charset="utf8")
cursor = connector.cursor()

# SQL
sql = "SELECT * FROM users WHERE name = \'" + u + "\' ;"
fw.write("\n%s"%str(sql))
cursor.execute(sql)
result = cursor.fetchall()
rec = []

for row in result:
    rec.append(row)
    fw.write("\n%s"%str(row))

cursor.close()
connector.close()

uid = str(rec[0][0])
uname = str(rec[0][1])
upass = str(rec[0][2])
uperm = str(rec[0][3])

fw.close()

print "Content-Type:text/javascript"
print
print "Python.responseUserInfo({'id':'%s','name':'%s','pass':'%s',permission:'%s'});"%(uid,uname,upass,uperm)
