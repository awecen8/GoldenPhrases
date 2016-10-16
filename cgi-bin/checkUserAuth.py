#! /usr/bin/python
# -*- coding: utf-8 -*-
import os
import cgi
import sys
import base64
import datetime
import MySQLdb
import ConfigParser
import os,cgi,cgitb,Cookie; cgitb.enable()
from Cookie import SimpleCookie
from Crypto.Cipher import AES

fw = open('./src/debug_' + datetime.datetime.now().strftime('%Y%m%d') + '.log','a')
fw.write("\n%s"%"---------" + datetime.datetime.now().strftime('%H:%M:%S') + "----------")

if os.environ['REQUEST_METHOD'] != "POST":
    print 'Access Denied.'
    sys.exit()

#Check Values#Check Values
form = cgi.FieldStorage()

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

try:
    # Decrypt
    secret_key = 'this is secret:)'
    crypto = AES.new(secret_key)
    hx = rec[0][2]
    cipher_data = crypto.decrypt(hx.decode('hex'))
    cip = cipher_data.replace(" ","")
    fw.write("\n%s"%str(cip))

    if len(rec) > 0 and p == cip:
        response = "true"
        c = SimpleCookie()
        expires =  datetime.datetime.now() +  datetime.timedelta(hours = 1)
        c['auth'] = u
        c['auth']['expires'] = expires.strftime("%a, %d-%b-%Y %H:%M:%S GMT")
        c['auth']['path']='/'
        fw.write("\n%s"%str(c.output()))
        print c

    else:
        response = "false"

except:
    response = "false"

finally:
    fw.write("\n%s"%str(response))
    fw.close()
    print "Content-Type:text/javascript"
    print
    print "Python.responseLogin({'result':'%s'});"%(response)
