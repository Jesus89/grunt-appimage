# grunt-appimage [![Build Status](https://travis-ci.org/Jesus89/grunt-appimage.svg?branch=master)](https://travis-ci.org/Jesus89/grunt-appimage)

> Grunt task to create AppImages.

A simple way to automate the creation of GNU/Linux AppImages (http://appimage.org).

[![NPM](https://nodei.co/npm/grunt-appimage.png?)](https://nodei.co/npm/grunt-appimage/)

### NOTE: this plugin is under development

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
        comment: 'Awesome App',
        icons: 'path/to/icons',
        dest: 'path/to/dist'
      },
      src: 'path/to/myapp'
    }
  }
});
```

## Config

#### src

*Required*<br>
Type: `String`

Application directory.

## Options

#### name
Type: `String`<br>
Default: `MyApp`

Application name.

#### exec
Type: `String`<br>
Default: `myapp`

Executable file name.

#### comment
Type: `String`<br>
Default: `MyApp`

Comments about the application.

#### icons
Type: `String`<br>
Default: `<empty>`

Path to the icons file structure. See [default](https://github.com/Jesus89/grunt-appimage/tree/master/res/icons).

#### dest
Type: `String`<br>
Default: `dist`

Destiny of the output AppImage.

## Examples

```js
grunt.initConfig({
  appimage: {
    myapp: {
      options: {
        exec: 'app'
      },
      src: 'dist/MyApp'
    }
  }
});
```
