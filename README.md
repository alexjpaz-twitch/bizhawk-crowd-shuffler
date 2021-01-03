# bizhawk-crowd-shuffler

> A script for Bizhawk to allow Twitch chat to shuffle the current ROM 

![Shuffler Demo](/examples/demo_gifs/bizhawk-crowd-shuffler.gif)

## Setup

1. Install the [latest development version](https://ci.appveyor.com/project/zeromus/bizhawk-udexo/build/artifacts) of BizHawk (> 2.5.3)

2. Download the latest release of this project [bizhawk-crowd-shuffler](https://github.com/alexjpaz-twitch/bizhawk-crowd-shuffler/releases/latest).

3. Unzip `bizhawk-crowd-shuffler` inside of the folder that BizHawk is installed in from step 1

4. Open the `bizhawk-crowd-shuffler` folder and copy any roms that you want shuffled into the `CurrenRoms` folder 

5. Edit the `Start.bat` to fill in the `CHANNEL` with your Twitch channel name.

**Note:** You may have a popup saying "Windows protected your PC". Click *more info* and click "Run anyway"
**Note:** You may have a popup about the "Windows Firewall". You will need to allow access for the applications to work.


## Advanced Setup

If you would like the shuffler to be able to respond with the next rom in chat and/or users to use reward redemptions to swap you will  need to do aquire an OAuth Token.

### Acquiring an OAuth Token

1. Navtivate to https://dev.twitch.tv/console/apps/create

2. Enter a name for the application (e.g. MyUserNameRomShuffler)

3. Enter `https://twitchapps.com/tokengen/` for the *OAuth Redirect URLs* field

4. Click *create*

5. Click *manage* next to your newly created application

6. Copy the value in the *clientID* field 

7. Navigate to https://twitchapps.com/tokengen/

8. Enter your *clientID* from step 6

9. Enter the following scopes string in to the scopes field

```
channel:manage:redemptions channel:read:redemptions user:read:email chat:edit chat:read
```

10. Copy the OAuth token into the `Start.bat` file in the `TWITCH_TOKEN` field

11. Create redemption named "swap"

**Note:** There is a [current limiation](https://github.com/alexjpaz-twitch/bizhawk-crowd-shuffler/issues/9) that you *must* name the redemption swap.


## Miscellaneous
### [Contributing](./CONTRIBUTING.md)
