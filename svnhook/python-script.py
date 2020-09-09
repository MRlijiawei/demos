import sys
import re
import time
from os import popen
from os.path import join

def charCountOutQuote(source, c):
    stack = []
    quoteNum = 0 # 0 or 1
    i = -1
    for s in source:
       i += 1
       if s == '"':
           if i - 1 >= 0 and source[i - 1] == '\\':
               continue
           stack.append(s)
           quoteNum += 1
           if quoteNum == 2:
               quoteNum = 0
               stack.pop()
               while True:
                   item = stack.pop()
                   if item == '"':
                       break
       elif quoteNum == 0 and s == c:
           stack.append(c)

    return stack.count(c)
       
def err(msg):
    sys.stderr.write(msg+'\n')
   
svnBin = sys.argv[1]
svnRepos = sys.argv[2]
svnTxn = sys.argv[3]

errMsgTable = []

REG_SINGLE_CHAR_METHOD = r'\s*[a-zA-Z]\s*\('
singleCharMethod = re.compile(REG_SINGLE_CHAR_METHOD)
svnlook = join(svnBin, 'svnlook.exe')

svnlook_changed = '"%s" changed -t %s %s' % (svnlook, svnTxn, svnRepos)
errMsgTable.append([popen(svnRepos), popen(svnRepos).readlines(), sum(1 for _ in svnlook_changed)])#108??
# skip deleting file
def filt(x):
    errMsgTable.append([x, x[:2], x[2:].strip()])
    if x[:2] != 'D ':
       return x[2:].strip()
#errMsgTable.append([popen(svnlook_changed).readlines(), svnTxn, svnRepos])#[],svnTxn:3??,svnRepos:存放提交文件路径的tmp文件
changedFiles = map(filt, popen(svnlook_changed).readlines())
#errMsgTable.append([svnlook_changed, sum(1 for _ in changedFiles), len(list(svnlook_changed))])#0,108??
#time.sleep(20)
for relPath in changedFiles:
    errMsgTable.append([relPath, '', 'relPath'])
    # only handle .java files
   
    # if relPath is None or relPath.endswith('.js') == False:
    #    continue

    # file name rules
   
    i = 0
    for c in relPath:
       if c.isupper():
           if c != 'I' \
           and len(relPath) > i + 1 \
           and relPath[i + 1].isupper():
               errMsgTable.append([relPath, '', 'file name not beauty'])
               break
       i += 1
   
    # file content rules
   
    svnlook_catFile = '"%s" cat -t %s %s %s' % (svnlook, svnTxn, svnRepos, relPath)
    print('catLen:' + len(svnlook_catFile))
    time.sleep(20)
    lineNum = 0
    for line in popen(svnlook_catFile):
       lineNum += 1

       line = line.lstrip()
       print(line)
       time.sleep(20)
       print(charCountOutQuote(line, '{'))
       # skip comment line
       
       if line[:2] == '//' \
       or line[:2].count('*') > 0:
            continue
       
       # rule: forbidden multi statments per line
       
       if charCountOutQuote(line, ';') > 1 \
       and line[:3] != 'for':
            errMsgTable.append([relPath, lineNum, 'at most one statement per line'])

       # rule: forbidden multi blocks per line
       
       if charCountOutQuote(line, '{') > 1:
            errMsgTable.append([relPath, lineNum, 'at most one block per line'])
       
       # rule: forbidden single character method
       
       if singleCharMethod.match(line):
            errMsgTable.append([relPath, lineNum, 'single character method is forbidden'])
       

errMsgTable.append(['', '', 'file name not beauty111'])
if errMsgTable:
    # here is error message
    err('===================== begin ========================================')
    for msgArr in errMsgTable:
        err('File:%s   line:%s    msg :%s' % (msgArr[0], msgArr[1], msgArr[2]))
    err('===================== end ========================================')
    sys.exit(1)
else:
    sys.exit(0)
