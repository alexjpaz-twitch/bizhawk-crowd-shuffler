local config = {}

config.sessionPath = os.getenv("session") and os.getenv("session") or 'default'

config.gamePath = ".\\sessions\\" .. config.sessionPath .. "\\CurrentROMs\\"
config.savePath = ".\\sessions\\" .. config.sessionPath .. "\\CurrentSaves\\"

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
       savestate.save(config.savePath .. currentGame  .. ".state")
    end

    local nextGame = rom

    client.openrom(config.gamePath .. nextGame)
    savestate.load(config.savePath ..  nextGame .. ".state")

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
else
    print("Running tests") 
    -- run tests
    comm = {}

    local function test_ping()
        local called = false
        comm.socketServerSend = function()
            called = true
        end

        commands.ping()

        assert(called)
    end

    local function test_parseAndExecuteResponse()
        local called = false
        commands.test = function()
            called = true
        end

        assert(called == false)

        parseAndExecuteResponse("test")

        assert(called)
    end

    local function test_parseAndExecuteResponse_withArgs()
        local called = false
        local args
        commands.test = function(input)
            called = true
            args = input
        end

        assert(called == false)

        parseAndExecuteResponse("test\tfoo")

        assert(called)

        assert(args == "foo")
    end

    local function test_parseAndExecuteResponse_withMultipleCommands()
        local called = 0
        commands.test = function(input)
            called = called + 1
        end

        assert(called == 0)

        parseAndExecuteResponse("test\ntest\n")

        assert(called == 2)
    end

    local function test_switchRom()
        userdata = {}
        savestate = {}
        client = {}

        client.openrom = function(args)
            client.openrom__args = args
        end

        savestate.load = function(args)
            savestate.load__args = args
        end

        savestate.save = function(args)
            savestate.save__args = args
        end

        userdata.get = function()
            return "foo.nes"
        end

        userdata.set = function(key, value)
            userdata.set__value = value
        end

        commands.switchRom("bar.nes")

        assert(savestate.load__args == config.savePath .. "bar.nes.state")
        assert(userdata.set__value == "bar.nes")
        assert(savestate.save__args == config.savePath .. "foo.nes.state")
        assert(client.openrom__args == config.gamePath .. "bar.nes")
    end

    test_ping()
    test_parseAndExecuteResponse()
    test_parseAndExecuteResponse_withArgs()
    test_parseAndExecuteResponse_withMultipleCommands()
    test_switchRom();
end
