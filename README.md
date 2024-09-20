# bizhawk-crowd-shuffler

> A script for Bizhawk to allow Twitch chat to shuffle the current ROM 

![Shuffler Demo](/examples/demo_gifs/bizhawk-crowd-shuffler.gif)

## Setup

Note this has only been tested with Bizhawk 2.9.1.

1. Install a [2.9.x version](https://github.com/TASVideos/BizHawk/releases/tag/2.9.1) of BizHawk.

2. Download the latest release of this project [bizhawk-crowd-shuffler](https://github.com/alexjpaz-twitch/bizhawk-crowd-shuffler/releases/latest).

3. Create a folder called `bizhawk-crowd-shuffler` where the BizHawk is installed in from **step 1** and unzip the release file from **step 2** inside of the newly created folder.

4. Open the `bizhawk-crowd-shuffler` folder and copy any roms that you want shuffled into the `sessions/default/CurrentROMs` folder 

5. Edit the `bizhawk-crowd-shuffler-win.bat` (for Windows) or `bizhawk-crowd-shuffler-linux.sh` (for Linux) to fill in the `CHANNEL` with your Twitch channel name.

**Note:** You may have a popup saying "Windows protected your PC". Click *more info* and click "Run anyway"

**Note:** You may have a popup about the "Windows Firewall". You will need to allow access for the applications to work.

**Note:** On Linux, you need to manually run `start-bizhawk-listen-to-crowd-shuffler.sh` to start BizHawk.

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

**Note:** Treat the token like a password and do not share that with anyone.
 
10. Copy the OAuth token into the `bizhawk-crowd-shuffler-win.bat` (for Windows) or `bizhawk-crowd-shuffler-win.sh` (for Linux) file in the `TWITCH_TOKEN` field

11. Create redemption named "swap"

## Configuration

The shuffler can be configured by adding a `config.json` file (an example is provided)

#### chatCommand

> Configures the swap chat command (e.g !swap) to respond to. Set to `null` to disable (default: ^swap$)

#### chatSuppressMessages

> Suppresses the chat messages in twitch chat (default: false)

#### chatListCommand

> Configures the list chat command (e.g !list) to respond to (default: ^list$)

#### ignoreRomsPattern

> Filter out certain files in the current roms folder from being listed and used

#### redemptionName

> Configures the redpemption name to respond to (default: ^swap$)

#### randomOnly

> Ignore any user filter and just uses a random rom

#### randomIfNoMatch

> Choose a random rom if there is no match rather than ignore the command

#### chatCooldownGlobal

> Global chat cooldown (default: 60000)

#### chatCooldownUser

> User chat cooldown (default: 60000)

#### redepmtionRandomText

> Text that is used for a random game via redemption (default: ^rng$)

#### timer

> timer options

Note: Set this null to disable the timer

##### min

> timer minimum

##### max

> timer maximum

### Twitch Event Configuration

These parameters control when the ROM should be swapped based on different Twitch events:

- `swapOnChat`: Swap when a chat message triggers the swap command (default: `true`)
- `swapOnCheer`: Swap when someone cheers bits (default: `false`)
- `swapOnCheerMinimumBits`: Minimum number of bits required to trigger a swap (default: `100`)
- `swapOnSub`: Swap when someone subscribes (default: `false`)
- `swapOnResub`: Swap when someone resubscribes (default: `false`)
- `swapOnSubGift`: Swap when someone gifts a sub (default: `false`)
- `swapOnSubMysteryGift`: Swap when someone gives mystery gift subs (default: `false`)
- `swapOnGiftSubContinue`: Swap when someone continues a gifted sub (default: `false`)


## Miscellaneous

## [Donation](https://streamlabs.com/alexjpaz/tip)

## [Contributing](./CONTRIBUTING.md)
