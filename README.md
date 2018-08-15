# PicPlacer
![PicPlacer](https://raw.githubusercontent.com/HerrHerklotz/herrherklotz.github.io/master/img/picplacer.jpg)

# How to use
1. Build & run the app
2. select your target location
   Option 1: Insert an address
   Option 2: right click into the map view
3. Drag & Drop a jpg file into the map view
4. PicPlacer will now write the location into the corresponding EXIF fields.. finish!

# How to build
1. Get all dependencies
```shell
# Clone this repository
> git clone https://github.com/HerrHerklotz/PicPlacer
# Go into the repository
> cd PicPlacer

# Install dependencies
PicPlacer> npm install
PicPlacer/src> npm install

# Run the app
PicPlacer> npm run src
# Build the app
PicPlacer> npm run dist
```
2. Go to https://msdn.microsoft.com/en-us/library/ff428642.aspx?f=255&MSPPError=-2147217396 and get your private API key 
3. Past your key into PicPlacer/src/key.js
