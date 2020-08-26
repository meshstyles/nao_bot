# channels.json

## info
- this is for multiple guilds at once.
- to update the conts you need to restart the bot.
- keep these files as short as possible. for use in many guilds you should use an actual database.

## object
### the root object
the name needs to be the guild id
#### vcCategory
name of the category they new voice channels will be moved to (casesensitive).
#### stickyChannelsVC 
array of channel names that will not be removed via remove commmand

a sample is provided in ./src/settings/channel_sample.json
