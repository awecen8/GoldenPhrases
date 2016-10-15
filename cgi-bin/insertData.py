#! /usr/bin/python
# -*- coding: utf-8 -*-
import os
import cgi
import sys
import base64
import MySQLdb
import ConfigParser
from datetime import datetime

if os.environ['REQUEST_METHOD'] != "POST":
    print 'Access Denied.'
    sys.exit()

form = cgi.FieldStorage()
fw = open('./src/debug.log','a')
fw.write("\n%s"%"---------" + datetime.now().strftime('%Y/%m/%d %H:%M:%S') + "----------")

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

fw.write("\n%s"%(str(form)))

sql = "SELECT MAX(id) FROM goldenPhrases ;"
cursor.execute(sql)
result = cursor.fetchall()
mid = result[0][0]
maxid = int(mid)

# SQL
inputData = []
count = int(form["num"].value)
counter = 0
while counter < count:
    maxid += 1
    id_genre = form["inputs[" + str(counter) + "][genre]"].value
    id_qnum = form[("inputs[" + str(counter) + "][qnum]")].value
    id_qjp = (form["inputs[" + str(counter) + "][qjp]"].value).decode('utf-8')
    id_qst = (form[("inputs[" + str(counter) + "][qst]")].value).decode('utf-8')
    id_ans = (form[("inputs[" + str(counter) + "][ans]")].value).decode('utf-8')
    id_com = (form[("inputs[" + str(counter) + "][com]")].value).decode('utf-8')
    inputData.append("INSERT INTO goldenPhrases VALUES("+ str(maxid) + "," + str(id_genre) + "," + str(id_qnum) + ",\'" + id_qjp + "\',\'" + id_qst + "\',\'" + id_ans + "\',\'" + id_com + "\');")
    counter += 1



for idt in inputData:
    fw.write("\n%s"%idt.encode('utf-8'))
    cursor.execute(idt)
connector.commit()

cursor.close()
connector.close()
fw.close()

print "Content-Type:text/javascript"
print
print "Python.responseInsertData({'result':'%s'});"%('true')
