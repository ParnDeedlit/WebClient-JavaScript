﻿var webpack = require('webpack');
var path = require('path');

var HappyPack = require('happypack');//多线程loader 加快编译速度
const uglify = require('uglifyjs-webpack-plugin');
var os = require('os');
var happyThreadPool = HappyPack.ThreadPool({size: os.cpus().length});

module.exports = {
    // mode: 'production',
    mode: 'none',
    entry: path.join(__dirname, '.', 'openlayers_main.js'),//已多次提及的唯一入口文件
    output: {
        path: path.join(__dirname, '.', 'output'),//打包后的文件存放的地方
        filename: "webclient-openlayers-framework.min.js"//打包后输出文件的文件名
    },
    devtool: "sourcemap", //生成用来调试的map

    // devtool:"cheap-module-source-map",
    externals: {
        'leaflet': 'L'
    },
    module: {
        // rules: [
        //     {
        //         test: /(\.js)$/,
        //         use: {
        //             loader: "babel-loader",
        //             options: {
        //                 presets: ["es2015"]
        //             }
        //         },
        //         exclude: [/node_modules/,/mapgislayerForMapbox/,/clientThemeMapbox/]
        //     }
        // ]
        rules: [
            {
                test: /(\.js)$/,
                use: 'happypack/loader?id=js',
                exclude: [/node_modules/, /leaflet/, /mapboxgl/]
            }
        ]
    },
    plugins: [
        new HappyPack({
            id: 'js',
            // threads: 4,
            threadPool: happyThreadPool,
            loaders: [{
                loader: 'babel-loader',
                options: {
                    presets: ['es2015'],
                    cacheDirectory: true,
                    plugins: ['transform-runtime', 'transform-decorators-legacy', 'transform-class-properties']
                }
            }]
        }),
        new uglify(),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.AggressiveMergingPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV)
            }
        })
    ]
}