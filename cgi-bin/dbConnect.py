#! /usr/bin/python
# -*- coding: utf-8 -*-
import MySQLdb

# localhostの場合は省略可
def getConnecter():
    fw = open('./src/debug.log','a')
    fw.write("\n%s"%"---------dbConnect(" + datetime.datetime.now().strftime('%Y/%m/%d %H:%M:%S') + ")----------")
    fw.close()
    return MySQLdb.connect(host="localhost", db="gphrases", user="root", passwd="Awecen8flash", charset="utf8")

def closeConnector(con):
    con.close()
