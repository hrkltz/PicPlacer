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
> To build this application you will also need [electron 2.0.4](https://www.npmjs.com/package/electron) and [electron-builder 20.20.4](https://www.npmjs.com/package/electron-builder).
```shell
# Clone this repository
> git clone https://github.com/HerrHerklotz/PicPlacer
# Go into the repository
> cd PicPlacer

# Install dependencies
PicPlacer/src> npm install

# Run the app
PicPlacer> npm run src
# Build the app
PicPlacer> npm run dist
```
