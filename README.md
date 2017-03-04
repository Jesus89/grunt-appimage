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
        dest: 'path/to/dist'
      },
      src: 'path/to/myapp',
      bin: 'myapp'
    }
  }
});
```

## Examples

```js
grunt.initConfig({
  appimage: {
    myapp: {
      options: {
        dest: 'dist'
      },
      src: 'test/MyApp',
      bin: 'myapp'
    }
  }
});
```
