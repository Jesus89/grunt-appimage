# grunt-appimage

> Grunt task to create AppImages.

A simple way to automate the creation of GNU/Linux AppImages (http://appimage.org).

### NOTE: this plugin is under development

## Install

```
$ npm install grunt-appimage --save-dev
```

## Usage

```js
grunt.initConfig({
  appimage: {
    options: {
      dest: 'path/to/dist'
    },
    src: 'path/to/myapp',
    bin: 'myapp'
  }
});
```

## Examples

```js
grunt.initConfig({
  appimage: {
    options: {
      dest: 'dist'
    },
    src: 'test/MyApp',
    bin: 'myapp'
  }
});
```
