#! /usr/bin/python
# -*- coding: utf-8 -*-
import os
import cgi
import sys
import base64
import MySQLdb
import datetime
import ConfigParser
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
