# Palette Texture Generator
Quick and handy palette texture generator from swatches. This small project was originally meant to see what [Electron](https://www.electronjs.org/) is all about and because I was bored during one of the quarantine weekends.

I use these palettes as textures for small Blender projects. I learned about this texturing technique from this great Youtuber [Imphenzia](https://www.youtube.com/user/ImphenziaMusic) - here's one of his videos explaining his texturing method: [https://www.youtube.com/watch?v=BlxiCd0Upg4](https://www.youtube.com/watch?v=BlxiCd0Upg4). Make sure to check out his channel, he's great.

Using this tool I can add as many colors as I like (and even import them from an existing palette), brighten, saturate, and then generate a PNG file that I can then use in Blender.

The code is not meant to be treated as state-of-the-art and bugs are expected. It is a rather rudimentary application and a very quick attempt at Electron, but it serves my purposes well.

##Running
Make sure you have Node running on your machine (I used `10.15.0`) and just `npm start` the heck of it. :)

##Software used
* Node 10.15.0
* Electron 8.2.3
* jQuery 3.4.1
* Bootstrap 4.4.1
* A bunch of small and not-so-small JS libraries for both the front-end and the back-end part