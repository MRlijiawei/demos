import sys

def err(msg):
    sys.stderr.write(msg+'\n')

svnRepos = sys.argv[1]#提交文件列表
#svnMessageFile = sys.argv[3]
#sys.stderr.write(sys.argv[0]+'\n'+sys.argv[1]+'\n'+sys.argv[2]+'\n'+sys.argv[3]+'\n'+sys.argv[4]+'\n')参数依次为脚本路径、文件列表文件、depth、提交的message文件、提交文件的路径
errMsgTable = []

with open(svnRepos) as submitFiles:
  for submitFile in submitFiles:
    submitFile = submitFile.replace('\n', '')#去掉文件列表缓存文件中的换行
    fp = open(submitFile, 'r', encoding='utf-8')
    frontLine = ''
    lNum = 0
    for line in fp.readlines():#逐行读取
      lNum += 1
      line = line.strip().replace(' ','')
      if (',]' in line) or (',}' in line):
        errMsgTable.append([submitFile, lNum, 'Illegal Comma'])
      if len(frontLine) > 0 and len(line) > 0:
        if (frontLine[-1] == ',') and (line[0] == ']' or line[0] == '}'):
          errMsgTable.append([submitFile, lNum, 'Illegal Comma'])
      if len(line) > 0:
        frontLine = line
    fp.close()

# errMsgTable.append(['', '', 'test'])
if errMsgTable:
    err('===================== error begin ========================================')
    for msgArr in errMsgTable:
        err('File:%s   line:%s    msg :%s' % (msgArr[0], msgArr[1], msgArr[2]))
    err('===================== error end ==========================================')
    sys.exit(1)
else:
    sys.exit(0)
