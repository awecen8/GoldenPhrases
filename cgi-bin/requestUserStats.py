#! /usr/bin/python
# -*- coding: utf-8 -*-
import os
import cgi
import sys
import base64
import random
import MySQLdb
from datetime import datetime
from Crypto.Cipher import AES

#Debug Lod
fw = open('./src/debug.log','a')
fw.write("\n%s"%"---------requestUserStats.py(" + datetime.now().strftime('%Y/%m/%d %H:%M:%S') + ")----------")
form = cgi.FieldStorage()

if os.environ['REQUEST_METHOD'] != "POST":
    print 'Access Denied.'
    sys.exit()

try:
    #Check Values#Check Values
    if not form.has_key("level"):
        fw.write("\n%s"%"No input value")
        sys.exit()
    if not form.has_key("user"):
        fw.write("\n%s"%"No input value")
        sys.exit()

    #Set Values
    l = form["level"].value
    u = form["user"].value
    fw.write("\nlevel:%s/user:%s"%(str(l),str(u)))

    if l == "1":
        maxq = 400
    elif l == "2":
        maxq = 300
    elif l == "3":
        maxq = 200
    elif l == "4":
        maxq = 100
    else:
        maxq = 319

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
        g = int(row[1])
        q = int(row[2])
        if g == int(l):
            rec.append(row)


    seletsql = "SELECT * FROM score WHERE user = \'" + u + "\' AND examtype = " + l + " ;"
    cursor.execute(seletsql)
    seletresult = cursor.fetchall()
    encScore = seletresult[0][3]
    fw.write("\nencScore:%s"%str(encScore))
    secret_key = 'this is secret:)'
    crypto = AES.new(secret_key)
    decip = crypto.decrypt(encScore.decode('hex'))
    decScore = decip.replace(" ","")
    fw.write("\ndecScore:%s"%str(decScore))

    cursor.close()
    connector.close()

    resplist = []
    counter = 0
    fw.write("\nlen(rec):%s"%str(len(rec)))

    while counter < len(rec):
        d_id = str(rec[counter][0])
        d_genre = str(rec[counter][1])
        d_qnum = str(rec[counter][2])
        d_qjp = str(rec[counter][3].encode('utf_8'))
        d_qst  = str(rec[counter][4].encode('utf_8'))
        d_ans = str(rec[counter][5].encode('utf_8'))
        d_dtl = str(rec[counter][6].encode('utf_8'))
        d_usr = str(decScore[counter])
        resplistitem = "{\"id\":\"" + d_id + "\" " + ",\"genre\":\"" + d_genre + "\" " + ",\"qnum\":\"" + d_qnum + "\" " + ",\"qjp\":\"" + d_qjp + "\" " + ",\"qst\":\"" + d_qst + "\" " + ",\"ans\":\"" + d_ans + "\" " + ",\"com\":\"" + d_dtl + "\", \"usr\":\"" + d_usr +"\" }"
        resplist.append(resplistitem)
        counter += 1

    result = "true"
    response = "[" + ",".join(resplist) + "]"
    # fw.write("\nresponse:%s"%str(response))

except:
    fw.write("\nlen(rec):%s"%str("**EXCEPTION**"))
    result = "false"
    response = "{}"
finally:
    fw.close()

print "Content-Type:text/javascript"
print
print "Python.responseUserStats({'result':%s,'response':[%s]});"%(str(result),str(response))
