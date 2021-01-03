local config = {}

config.gamePath = ".\\CurrentROMs\\"
config.savePath = ".\\CurrentSaves\\"

local frame = 0

local frame_check_mod = 10 -- check every X frames

local function isempty(s)
  return s == nil or s == ''
end

local commands = {}

function commands.switchRom(rom)
    local currentGame = userdata.get("currentGame")

    print("DEBUG: switchRom=" .. rom)

    if(currentGame ) then
       savestate.save(config.savePath .. currentGame  .. ".save")
    end

    local nextGame = rom

    client.openrom(config.gamePath .. nextGame)
    savestate.load(config.savePath ..  nextGame .. ".save")

    userdata.set("currentGame", nextGame)
end

function commands.ping()
    -- print("DEBUG: heartbeat received")
    comm.socketServerSend("pong");
end

local function parseAndExecuteResponse(response)
    for line in string.gmatch(response, "([^\n]+)") do
        local t={}

        for str in string.gmatch(line, "([^\t]+)") do
            table.insert(t, str)
        end

        local input = {
            command = t[1],
            args = t[2]
        }

        -- print("DEBUG: command=" .. input.command)

        local command = commands[input.command]

        if(command) then
            commands[input.command](input.args)
        end
    end
end

local function main()
   -- purge socket data
   comm.socketServerResponse()

   while true do -- The main cycle that causes the emulator to advance and trigger a game switch.
        frame = frame + 1

        if (frame % frame_check_mod) == 0 then
            local response = comm.socketServerResponse()

            if isempty(response) == false then
                parseAndExecuteResponse(response)
            end
        end
        emu.frameadvance()
    end

    print("loaded, checking every " .. frame_check_mod .. " frames")
end

if emu then
    main()
end
