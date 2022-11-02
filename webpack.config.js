const currentTask = process.env.npm_lifecycle_event
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {
    CleanWebpackPlugin
} = require('clean-webpack-plugin')

const config = {
    output: {
        filename: 'main.[contenthash].js',
        path: path.resolve(__dirname, 'docs')
    },
    plugins: [new HtmlWebpackPlugin({
        template: './src/index.html'
    })],
    mode: 'development',
    devtool: 'eval-cheap-source-map',
    devServer: {
        port: 8080,
        contentBase: path.resolve(__dirname, 'docs'),
        hot: true
    },
    module: {
        rules: [{
            test: /\.scss$/,
            use: ['style-loader', 'css-loader', 'sass-loader']
        }, {
            test: /\.js$/,
            exclude: /(node_modules)/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: [
                        ['@babel/preset-env', {
                            "useBuiltIns": "usage",
                            "corejs": 3,
                            "targets": "defaults"
                        }]
                    ]
                }
            }
        }]
    }
}

if (currentTask === 'build') {
    config.mode = 'production'
    config.module.rules[0].use[0] = MiniCssExtractPlugin.loader
    config.plugins.push(new MiniCssExtractPlugin({
        filename: 'main.[contenthash].css'
    }), new CleanWebpackPlugin())
}

module.exports = config