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
if not form.has_key("user"):
    print 'No input value'
    sys.exit()

fw = open('./src/debug.log','a')
fw.write("\n%s"%"---------requestLoadMonsterData.py(" + datetime.now().strftime('%Y/%m/%d %H:%M:%S') + ")----------")
try:

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

    sql = "SELECT * FROM monster WHERE user = \'" + str(form["user"].value) + "\';"
    fw.write("\n%s"%(str(sql)))
    cursor.execute(sql)
    result = cursor.fetchall()
    fw.write("\n%s"%(str(result)))

    if len(result) > 0:
        id_play = str(result[0][2])
        id_prize = str(result[0][3])
        id_tecnt = str(result[0][4])
        id_tncnt = str(result[0][5])
        id_thcnt = str(result[0][6])
        id_tmcnt = str(result[0][7])
        id_tzcnt = str(result[0][8])
        id_fcnt = str(result[0][9])
        id_exp = str(result[0][10])
        id_allexp = str(result[0][11])
        id_exprate = str(result[0][12])
        id_level = str(result[0][13])
        id_type = str(result[0][14])
        id_bio = str(result[0][15])
        id_reset = str(result[0][16])
        response = "[{\"play\":\"" + id_play + "\",\"prize\":\"" + id_prize + "\",\"tecnt\":\"" + id_tecnt + "\",\"tncnt\":\"" + id_tncnt + "\",\"thcnt\":\"" + id_thcnt + "\",\"tmcnt\":\"" + id_tmcnt + "\",\"tzcnt\":\"" + id_tzcnt + "\",\"fcnt\":\"" + id_fcnt + "\",\"exp\":\""+ id_exp + "\",\"allexp\":\"" + id_allexp + "\",\"exprate\":\"" + id_exprate + "\",\"level\":\"" + id_level + "\",\"type\":\"" + id_type  + "\",\"bio\":\"" + id_bio + "\",\"reset\":\"" + id_reset + "\"}]"
        fw.write("\n%s"%(str(response)))
    else:
        response = 'nodata'

except:
    response = 'error'

finally:
    cursor.close()
    connector.close()
    fw.close()
    print "Content-Type:text/javascript"
    print
    print "Python.responseLoadMonsterData({'result':'%s'});"%(response)
