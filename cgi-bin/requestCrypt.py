#! /usr/bin/python
# -*- coding: utf-8 -*-
import os
import cgi
import sys
import base64
import random
import MySQLdb
import ConfigParser
from datetime import datetime
from Crypto.Cipher import AES

form = cgi.FieldStorage()

if os.environ['REQUEST_METHOD'] != "POST":
    print 'Access Denied.'
    sys.exit()


if not form.has_key("crypttype"):
    fw.write("\n%s"%"No input value")
    sys.exit()
if not form.has_key("ctx"):
    fw.write("\n%s"%"No input value")
    sys.exit()
if not form.has_key("key"):
    fw.write("\n%s"%"No input value")
    sys.exit()

#Set Values
crypttype = str(form["crypttype"].value)
c = str(form["ctx"].value)
k = str(form["key"].value)

#Debug Lod
fw = open('./src/debug.log','a')
fw.write("\n%s"%"---------requestCrypt.py(" + datetime.now().strftime('%Y/%m/%d %H:%M:%S') + ")----------")
fw.write("\n◆%s||ctx: %s / key: %s"%(crypttype,c,k))


if crypttype == "Decrypt":
    crypto = AES.new(k)
    decip = crypto.decrypt(c.decode('hex'))
    result = decip.replace(" ","")
    # fw.write("\ndecrypt:%s"%str(result))
else:
    crypto = AES.new(k)
    if (len(c) % 16) != 0:
        m = 16 - (len(c) % 16)
        msg = c + (" " * m)
        # fw.write("\n◆◆len(c): %s / m: %s / len(msg): %s"%(str(len(c)),str(m),str(len(msg))))
    else:
        msg = c
    result = crypto.encrypt(msg).encode('hex')
    # fw.write("\nencrypt:%s"%str(result))

fw.close()

print "Content-Type:text/javascript"
print
print "Python.responseCrypt({'result':'%s'});"%(str(result))
