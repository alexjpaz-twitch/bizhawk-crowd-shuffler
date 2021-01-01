frame = 0

frame_check_mod = 10 -- check every X frames

local function isempty(s)
  return s == nil or s == ''
end

local function handle_chat_command(command)
        print("chat said - " .. command)
end

while true do -- The main cycle that causes the emulator to advance and trigger a game switch.
        frame = frame + 1

        if (frame % frame_check_mod) == 0 then
                local response = comm.socketServerResponse()

                if isempty(response) == false then
                        print(response)
                end
        end
        emu.frameadvance()
end

print("loaded, checking every " .. frame_check_mod .. " frames")
