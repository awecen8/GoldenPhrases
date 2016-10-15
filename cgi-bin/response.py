#! /usr/bin/python
# -*- coding: utf-8 -*-
import os
import cgi
import sys

if os.environ['REQUEST_METHOD'] != "POST":
    print 'Access Denied.'
    sys.exit()

form = cgi.FieldStorage()
print form
if not form.has_key("inputv"):
    print 'No input value'
    sys.exit()

if not form.has_key("tabId"):
    print 'No input value'
    sys.exit()

inputv  = form["inputv"].value
tabId   = form['tabId'].value

#Procedure
outputv = inputv

#Output
print "Content-Type:text/javascript"
print
print "Python.responseCallBack({'output':'%s','tabId':'%s'});"%(str(outputv),str(tabId))
