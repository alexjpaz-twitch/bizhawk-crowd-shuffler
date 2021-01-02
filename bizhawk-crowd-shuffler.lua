local config = {}

config.gamePath = ".\\CurrentROMs\\"
config.savePath = ".\\CurrentSaves\\"

local state = {}

local frame = 0

local frame_check_mod = 10 -- check every X frames

local function isempty(s)
  return s == nil or s == ''
end

local commands = {}

function commands.switchRom(rom)
    savestate.save(config.savePath .. state.currentGame .. ".save")

    state.currentGame = rom

    client.openrom(config.gamePath .. state.currentGame)
    savestate.load(savePath .. currentGame .. ".save")
end

local function parseAndExecuteResponse(response)
    if sep == nil then
        sep = "\n"
    end

    local t={}

    for str in string.gmatch(response, "([^"..sep.."]+)") do
        table.insert(t, str)
    end

    local input = {
        command = t[1],
        args = t[2]
    }

    commands[input.command](input.args)
end

local function main()
   while true do -- The main cycle that causes the emulator to advance and trigger a game switch.
        frame = frame + 1

        if (frame % frame_check_mod) == 0 then
            local response = comm.socketServerResponse()

            if isempty(response) == false then
                parseAndExecuteCommand(response)
            end
        end
        emu.frameadvance()
    end

    print("loaded, checking every " .. frame_check_mod .. " frames")
end

if emu then
    main()
end
