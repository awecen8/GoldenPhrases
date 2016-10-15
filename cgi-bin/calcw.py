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
if not form.has_key("name"):
    print 'No input name value'
    sys.exit()

if not form.has_key("e-mail"):
    print 'No input e-mail value'
    sys.exit()

name   = form["name"].value
email  = form["e-mail"].value

print "Content-Type:text/javascript"
print
print "response({'name':'%s','e-mail':'%s'});"%(str(name),str(email))
