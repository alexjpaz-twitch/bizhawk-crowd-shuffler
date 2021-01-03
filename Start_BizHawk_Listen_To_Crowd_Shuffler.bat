@echo off
start /B %BIZHAWK_PATH%\\EmuHawk.exe --socket_ip=%HOST% --socket_port=%PORT% --lua=%~dp0bizhawk-crowd-shuffler.lua
