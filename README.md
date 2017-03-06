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
        src: 'path/to/myapp'
      }]
    }
  }
});
```

## Files

Standard grunt files. [More information](https://gruntjs.com/configuring-tasks#files).

## Options

#### name
*Required*<br>
Type: `String`<br>

Application name.

#### exec
*Required*<br>
Type: `String`<br>

Executable file path.

#### arch
Type: `String`<br>
Default: `64bit`

AppImage architecture: `32bit`, `64bit`.

#### comment
Type: `String`<br>
Default: `<empty>`

Comments about the application.

#### icons
Type: `String`<br>
Default: `<empty>`

Icons path. See [default](https://github.com/Jesus89/grunt-appimage/tree/master/res/icons).

#### archive
*Required*<br>
Type: `String` `Function`<br>
Mode: `AppImage`

This is used to define where to output the archive. Each target can only have one output file. If the type is a Function it must return a String.

## Examples

```js
grunt.initConfig({
  appimage: {
    myapp: {
      options: {
        name: 'MyApp'
        exec: 'myapp',
        archive: 'dist/MyApp.AppImage'
      },
      src: 'dist/MyApp/myapp'
    }
  }
});
```

```js
grunt.initConfig({
  appimage: {
    myapp32: {
      options: {
        name: 'MyApp'
        exec: 'app',
        arch: '32bit'
        archive: 'dist/MyApp-32.AppImage'
      },
      files: [{
        src: 'dist/MyApp/*'
      }]
    },
    myapp64: {
      options: {
        name: 'MyApp'
        exec: 'app',
        arch: '64bit'
        archive: 'dist/MyApp-64.AppImage'
      },
      files: [{
        src: 'dist/MyApp/*'
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
        name: 'MyApp'
        exec: 'app',
        comment: 'Awesome App',
        icons: 'resources/icons',
        archive: 'dist/MyApp.AppImage'
      },
      files: [
        {src: 'dist/MyApp/*', dot: true},
        {src: 'dist/extra/*', dest: 'extra/', filter: 'isFile'}
      ]
    }
  }
});
```
