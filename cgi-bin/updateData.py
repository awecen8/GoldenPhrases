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

form = cgi.FieldStorage()
fw = open('./src/debug.log','a')
fw.write("\n%s"%"---------" + datetime.now().strftime('%Y/%m/%d %H:%M:%S') + "----------")
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


fw.write("\n%s"%(str(form)))

# SQL
updateData = []
count = int(form["num"].value)
counter = 0
while counter < count:
    id_genre = form["inputs[" + str(counter) + "][genre]"].value
    id_qnum = form[("inputs[" + str(counter) + "][qnum]")].value
    id_qjp = (form["inputs[" + str(counter) + "][qjp]"].value).decode('utf-8')
    id_qst = (form[("inputs[" + str(counter) + "][qst]")].value).decode('utf-8')
    id_ans = (form[("inputs[" + str(counter) + "][ans]")].value).decode('utf-8')
    id_com = (form[("inputs[" + str(counter) + "][com]")].value).decode('utf-8')
    updateData.append("UPDATE goldenPhrases SET questjp = \'" + id_qjp + "\', quest = \'" + id_qst + "\', ans = \'" + id_ans + "\',dtl = \'" + id_com + "\' WHERE genre = " + str(id_genre) + " AND qnumber = " + str(id_qnum) + ";")
    counter += 1

for idt in updateData:
    fw.write("\n%s"%idt.encode('utf-8'))
    cursor.execute(idt)
connector.commit()

cursor.close()
connector.close()
fw.close()

print "Content-Type:text/javascript"
print
print "Python.responseUpdate({'result':'%s'});"%('true')
