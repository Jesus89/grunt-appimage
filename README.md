# grunt-appimage [![Build Status](https://travis-ci.org/Jesus89/grunt-appimage.svg?branch=master)](https://travis-ci.org/Jesus89/grunt-appimage)

> Grunt task to create AppImages.

A simple way to automate the creation of GNU/Linux AppImages (http://appimage.org).

[![NPM](https://nodei.co/npm/grunt-appimage.png?)](https://nodei.co/npm/grunt-appimage/)

## Install

```
$ npm install grunt-appimage --save-dev
```

## Usage

```js
grunt.initConfig({
  appimage: {
    myapp: {
      options: {
        name: 'MyApp',
        exec: 'myapp',
        arch: '64bit',
        comment: 'Awesome App',
        icons: 'path/to/icons',
        archive: 'path/to/dist/MyApp.AppImage'
      },
      files: [{
        expand: true,
        src: 'path/to/myapp',
        dest: 'dest/path'
      }]
    }
  }
});
```

## Options

#### archive

*Required*<br>
Type: `String` `Function`<br>
Modes: `AppImage`

This is used to define where to output the archive. Each target can only have one output file. If the type is a Function it must return a String.

#### name
Type: `String`<br>
Default: `MyApp`

Application name.

#### exec
Type: `String`<br>
Default: `myapp`

Executable file path.

#### arch
Type: `String`<br>
Default: `64bit`

AppImage architecture: `32bit`, `64bit`.

#### comment
Type: `String`<br>
Default: `MyApp`

Comments about the application.

#### icons
Type: `String`<br>
Default: `<empty>`

Path to the icons file structure. See [default](https://github.com/Jesus89/grunt-appimage/tree/master/res/icons).

## Examples

```js
grunt.initConfig({
  appimage: {
    myapp: {
      options: {
        exec: 'app',
        arch: '32bit'
        archive: 'dist/MyApp.AppImage'
      },
      files: [{
        src: 'dist/MyApp'
      }]
    }
  }
});
```

```js
grunt.initConfig({
  appimage: {
    myapp: {
      options: {
        exec: 'app',
        arch: '32bit'
        archive: 'dist/MyApp.AppImage'
      },
      files: [
        {src: 'dist/MyApp'},
        {src: 'extra/data'}
      ]
    }
  }
});
```

```js
grunt.initConfig({
  appimage: {
    myapp: {
      options: {
        exec: 'app',
        arch: '32bit'
        archive: 'dist/MyApp.AppImage'
      },
      src: 'dist/MyApp'
    }
  }
});
```
