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
fw.write("\n%s"%"---------requestSaveMonsterData.py(" + datetime.now().strftime('%Y/%m/%d %H:%M:%S') + ")----------")

try:

    # DBへログイン
    # localhostの場合は省略可
    connector = MySQLdb.connect(host="localhost", db="gphrases", user="root", passwd="mysql", charset="utf8")
    cursor = connector.cursor()

    fw.write("\n%s"%(str(form)))

    sql = "SELECT * FROM monster WHERE user = \'" + str(form["user"].value) + "\';"
    fw.write("\n%s"%(str(sql)))
    cursor.execute(sql)
    result = cursor.fetchall()

    id_play = form["play"].value
    id_prize = form["prize"].value
    id_tecnt = form["tecnt"].value
    id_tncnt = form["tncnt"].value
    id_thcnt = form["thcnt"].value
    id_tmcnt = form["tmcnt"].value
    id_tzcnt = form["tzcnt"].value
    id_fcnt = form["fcnt"].value
    id_exp = form["exp"].value
    id_allexp = form["allexp"].value
    id_exprate = form["exprate"].value
    id_level = form["level"].value
    id_type = form["type"].value
    id_bio = (form[("bio")].value).decode('utf-8')
    id_reset = form["reset"].value

    if len(result) == 0:
        sqlmaxid = "SELECT MAX(id) + 1 FROM monster;"
        usnm = str(form["user"].value)
        fw.write("\n%s"%(str(sqlmaxid)))
        cursor.execute(sqlmaxid)
        resultmaxid = cursor.fetchall()
        maxid = str(resultmaxid[0][0])
        if maxid == "None":
            maxid = "1"
        id_id = maxid
        sqlins = "INSERT INTO monster VALUES (" + id_id + ",\'" + usnm + "\'," + id_play + "," + id_prize + "," + id_tecnt + "," + id_tncnt + "," + id_thcnt + "," + id_tmcnt + "," + id_tzcnt + "," + id_fcnt + "," + id_exp + "," + id_allexp + "," + id_exprate + "," + id_level + "," + id_type + ",\'" + id_bio + "\'," + id_reset  + ") ;"
        fw.write("\n%s"%(str(sqlins)))
        r = cursor.execute(sqlins)

    else:
        fw.write("\n%s"%(str("UPDATE")))
        id_id = str(result[0][0])
        fw.write("\n%s"%(id_id))
        sqlupd = "UPDATE monster SET play = " + id_play + ", prize = " + id_prize + ", tecnt = " + id_tecnt + ", tncnt = " + id_tncnt + ", thcnt = " + id_thcnt + ",tmcnt = " + id_tmcnt + ", tzcnt = " + id_tzcnt + ", fcnt = " + id_fcnt + ", exp = " + id_exp + ", allexp = " + id_allexp + ", exprate = " + id_exprate + ", level = " + id_level + ", type = " + id_type + ", bio = \'" + id_bio + "\', reset = " + id_reset + " WHERE id = " + id_id + " ;"
        fw.write("\n%s"%(str(sqlupd)))
        r = cursor.execute(sqlupd)

    if r > 0:
        connector.commit()

    response = 'true'

except:
    response = 'false'

finally:
    cursor.close()
    connector.close()
    fw.close()
    print "Content-Type:text/javascript"
    print
    print "Python.responseSaveMonsterData({'result':'%s'});"%(response)
