#! /usr/bin/python
# -*- coding: utf-8 -*-
import os
import cgi
import sys
import base64
import MySQLdb
from datetime import datetime

if os.environ['REQUEST_METHOD'] != "POST":
    print 'Access Denied.'
    sys.exit()

#Debuglog
fw = open('./src/debug.log','a')
fw.write("\n%s"%"---------requestMonsterInfo.py(" + datetime.now().strftime('%Y/%m/%d %H:%M:%S') + ")----------")

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


sql = "SELECT * FROM monsterinfo ;"
cursor.execute(sql)
result = cursor.fetchall()
resplist = []

for row in result:
    # fw.write("\n%s"%str(row))
    d_id = str(row[0])
    d_level = str(row[1])
    d_name = str(row[2].encode('utf_8'))
    d_srckey = str(row[3].encode('utf_8'))
    d_condi  = str(row[4].encode('utf_8'))
    d_detail = str(row[5].encode('utf_8'))
    d_openflag = str(row[6])

    resplistitem = "{\"id\":\"" + d_id + "\" " + ",\"level\":\"" + d_level + "\" " + ",\"name\":\"" + d_name + "\" " + ",\"srckey\":\"" + d_srckey + "\" " + ",\"condi\":\"" + d_condi + "\" " + ",\"detail\":\"" + d_detail + "\" " + ",\"openflag\":\"" + d_openflag + "\"}"
    # fw.write("\n%s"%str(resplistitem))
    resplist.append(resplistitem)

response = "[" + ",".join(resplist) + "]"

cursor.close()
connector.close()
fw.close()

print "Content-Type:text/javascript"
print
print "Python.responseMonsterInfo({'response':'%s'});"%(response)
