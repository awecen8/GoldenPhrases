# -*- coding: utf-8 -*-

class test_class:

	def __init__(self,code,name):
		self.code	=	code
		self.name	=	name

if __name__ == "__main__":

	classList	=	[]
	classList.append(test_class(1,"テスト1"))
	classList.append(test_class(2,"テスト2"))

	for value in classList:
		print "===== class ====="
		print "code --> " + str(value.code)
		print "name --> " + value.name
