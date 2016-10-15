#! /usr/bin/python
# -*- coding: utf-8 -*-
import os
import cgi
import sys
import MySQLdb
import ConfigParser

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

g   = form["genre"].value
q   = form["qNumber"].value
v   = form["inputAnswerValue"].value

#Procedure

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
# SQL
sql = "SELECT * FROM goldenPhrases WHERE genre = " + g + " AND qnumber = \'" + q + "\' ;"
cursor.execute(sql)
result = cursor.fetchall()
rec = []

for row in result:
    rec.append(row)

cursor.close()
connector.close()

ans = rec[0][5].encode('utf_8').replace("\'","\\\'")
comment = rec[0][6].encode('utf_8').replace("\'","\\\'")
if v == ans:
    result = "true"
    # comment = rec[0][6].encode('utf_8')
else:
    result = "false"
    # comment = "You’re no match for my brains."

#Output
print "Content-Type:text/javascript"
print
print "Python.responseAnswer({'genre':'%s','qnumber':'%s','result':'%s','ans':'%s','comment':'%s'});"%(str(g),str(q),str(result),str(ans),str(comment))
