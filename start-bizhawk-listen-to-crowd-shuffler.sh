#!/bin/bash
export HOST=127.0.0.1
export PORT=7070
export BIZHAWK_PATH="${HOME}/Games/PC Games/BizHawk-2.9.1"
export LUA_SCRIPT="$(realpath $(dirname ${BASH_SOURCE}))/bizhawk-crowd-shuffler.lua"

bash "${BIZHAWK_PATH}/EmuHawkMono.sh" "--socket_ip=${HOST}" "--socket_port=${PORT}" "--lua=${LUA_SCRIPT}"
