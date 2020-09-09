#!/bin/sh

REPOS="$1"
TXN="$2"
echo -e "注释信息不能为空且不少于5个字!"
#必须填写注释且不少于5个字
# Make sure that the log message contains some text.
# SVNLOOK=/usr/bin/svnlook
SVNLOOK=C:/svnlook.exe
 
LOGMSG=`$SVNLOOK log -t "$TXN" "$REPOS" | grep "[a-zA-Z0-9]" | wc -c` 
if [ "$LOGMSG" -lt 5 ]; #要求注释不能少于5个字符，您可自定义 
then 
  echo -e "注释信息不能为空且不少于5个字!" 1>&2 
  exit 1 
fi

# Committing to tags is not allowed
$SVNLOOK changed -t "$TXN" "$REPOS" | grep "^U\W.*\/tags\/" && /bin/echo "tags版本不接受修改!" 1>&2 && exit 1

log=`$SVNLOOK changed -t "$TXN" "$REPOS"`
echo "log --> $log"

invalid="\.iml$|\.class$|\/logs|\/target|\/classes|.settings|.classpath$|.project$|.factorypath$"

# Committing logs or target or classes is not allowed
echo $log | grep "^[AU]" | grep -E "$invalid" \
        && /bin/echo "请不要提交非法文件!  $log" 1>&2 && exit 1


# All checks passed, so allow the commit.
exit 0
/////////////////////////
@echo off
setlocal
set REPOS=%1
set TXN=%2  
rem check that logmessage contains at least 10 characters
svnlook log "%REPOS%" -t "%TXN%" | findstr " ." > nul
if %errorlevel% gtr 0 goto err
exit 0
:err
echo Empty log message not allowed. Commit aborted! 1>&2
exit 1
//////////////////
@ECHO OFF

REM pre commit script
REM 限制提交修改时必须填写日志信息

set svnlook="%SVN_HOME%/bin/svnlook.exe"

setlocal
set REPOS=%1
set TXN=%2

rem check that logmessage contains at least 8 characters
%svnlook% log "%REPOS%" -t "%TXN%" | findstr "........" > nul
if %errorlevel% gtr 0 goto :ERROR_ACTION

goto :SUCCESS_EXIT

:ERROR_ACTION
echo 请输入一条有用的日志信息(8个字符以上)，如表示您对代码作了哪些更改等。>&2
echo 日志是跟踪版本的重要信息，您必须输入它，谢谢合作。：）>&2
goto ERROR_EXIT

:ERROR_EXIT
exit 1

:SUCCESS_EXIT
exit 0
、、、、、、、、、、、、、、、
@echo off
setlocal
set REPOS=%1
set TXN=%2  
rem check that logmessage contains at least 10 characters
svnlook log "%REPOS%" -t "%TXN%" | findstr " ." > nul
set LOGMSG=`svnlook log -t "%TXN%" "%REPOS%" | findstr "[a-zA-Z0-9]" > nul` 
if [ "%LOGMSG%" -lt 5 ]
then
  echo -e "注释信息不能为空且不少于5个字!" 1>&2 
  exit 1
fi
if %errorlevel% gtr 0 goto err
exit 0
:err
echo No empty log! 1>&2
exit 1
////////////python脚本
set PYTHON="C:/Users/lijiawei/AppData/Local/Programs/Python/Python38/python.exe"
set REPOS=%1
set TXN=%2
set MESSAGEFILE=%3
set CWD=%4
set CWDD=%5
set SVNBIN="C:\Program Files\TortoiseSVN\bin"
set PY_CHECK="E:/NGTOSV2_1/wuhan_version/hook/synchk.py"

%PYTHON% %PY_CHECK% %SVNBIN% %REPOS% %TXN% %MESSAGEFILE% %CWD% %CWDD%

if errorlevel 1 exit 1
exit 0
