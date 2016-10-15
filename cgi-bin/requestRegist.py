#! /usr/bin/python
# -*- coding: utf-8 -*-
import os
import cgi
import sys
import base64
import MySQLdb
import ConfigParser
import datetime
import os,cgi,cgitb,Cookie; cgitb.enable()
from Cookie import SimpleCookie
from Crypto.Cipher import AES

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

if not form.has_key("pass"):
    print 'No input value'
    sys.exit()

#Set Values
u = form["user"].value
p = form["pass"].value
fw.write("\nuser:%s/pass:%s"%(u,p))

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

# Encrypt
secret_key = 'this is secret:)'
crypto = AES.new(secret_key)
message = p
if len(message)%16 != 0:
    m = 16-len(message)
    msg = message + (" " * m)
cipher_data = crypto.encrypt(msg)

# original_message = crypto.decrypt(cipher_data)

if len(rec) == 0:
    # DBへログイン
    # localhostの場合は省略可
    connector = MySQLdb.connect(host="localhost", db="gphrases", user="root", passwd="mysql", charset="utf8")
    cursor = connector.cursor()
    # SQL
    sql = "SELECT MAX(id) + 1 FROM users ;"
    fw.write("\n%s"%str(sql))
    cursor.execute(sql)
    resultid = cursor.fetchall()
    recid = []

    for rowid in resultid:
        recid.append(rowid)
        fw.write("\n%s"%str(rowid))

    maxid = recid[0][0]

    cursor.close()
    connector.close()

    # DBへログイン
    # localhostの場合は省略可
    connector = MySQLdb.connect(host="localhost", db="gphrases", user="root", passwd="mysql", charset="utf8")
    cursor= connector.cursor()
    fw.write("\n%s"%str("ｰｰｰｰｰｰ"))

    # sqls = "SELECT * FROM users ;"
    data = (maxid,u.decode('utf-8'),cipher_data.encode('hex'),"a".decode('utf-8'))
    sqls = "INSERT INTO users VALUES (%s,%s,%s,%s);"
    r = cursor.execute(sqls, data)
    if r > 0:
        connector.commit()

    cursor.close()
    connector.close()
    response = "true"

else:
    response = "false"

fw.write("\n%s"%str(response))
fw.close()

print "Content-Type:text/javascript"
print
print "Python.responseRegist({'result':'%s'});"%(response)
