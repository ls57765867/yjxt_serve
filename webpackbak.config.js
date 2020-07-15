/*
const {resolve} = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin')

const {CleanWebpackPlugin} = require('clean-webpack-plugin');

// const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const path = require('path');

module.exports = {
    // 入口
    entry: './src/App.js',
    // 出口
    output: {
        // 输出的文件名
        filename: 'js/dist.js',
        // 输出路径 （绝对路径）
        path: resolve(__dirname, 'build')
    },
    resolve: {
        // Add `.ts` and `.tsx` as a resolvable extension.
        extensions: [".ts", ".tsx", ".js"]
    },
    // loader的配置
    module: {

        // 规则
        rules: [
            {
                // 匹配哪些文件
                test: /\.css$/,
                // 使用哪些loader来处理这些匹配到的css文件
                use: [
                    // use中loader的加载顺序： 从下到上，从右到左，依次执行
                    // 创建style标签，将js中的样式资源添加到页面的头部标签中
                    'style-loader',
                    // 将css文件转成commonJS模块， 加载到js中， 内容都是“样式字符串”
                    'css-loader',
                ]
            },
            {test: /\.tsx?$/, loader: "ts-loader"},
            {
                test: /\.scss$/,
                use: ['css-loader', 'sass-loader']
            },

            {
                test: /\.less$/,
                use: [
                    'style-loader',
                    //修改
                    //MiniCssExtractPlugin.loader,
                    // {
                    //     loader:MiniCssExtractPlugin.loader,
                    //     options:{
                    //         publicPath: '../'
                    //     }
                    // },

                    'css-loader',
                    // 把less的代码转成css的代码
                    // less less-loader
                    'less-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            ident: 'postcss',
                            plugins: (loader) => [
                                require('postcss-preset-env')()
                            ],
                            publicPath: '../',

                        }

                    }
                ]
            },
            {
                test: /\.html$/,
                // html-loader 负责引入img url-loader就能处理了！
                loader: 'html-loader',
            },
            {
                test: /\.(jpg|png|gif)$/,
                loader: 'url-loader',
                //设置
                options: {
                    //设置60kb以下的图片都进行base64处理
                    limit: 60 * 1024,
                    //给图片重命名: (hash:6表示保留哈希字符后面6位, ext代表保留原来的后缀名)
                    name: '[hash:8].[ext]',
                    outputPath: 'img',
                    //publicPath: '../img',
                    hmr: process.env.NODE_ENV === 'development',

                }
            },
            {
                test: /\.(js|jsx)$/,
                use:['babel-loader'],
                exclude: /node_modules/
            },

            {
                exclude: /\.(js|css|html|json|less|png|jpg|gif|ts|tsx)$/,
                // html-loader 负责引入img url-loader就能处理了！
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    outputPath: 'source'
                }
            },
            // {
            //     //注意:语法检查不要检查第三方的js
            //     test: /\.js$/,
            //     exclude: /node_modules|font_b4mc7lqi5mv/,
            //     loader: 'eslint-loader',
            //     //自动修复js语法
            //     options: {
            //         fix: true
            //     }
            // },
        ]
    },
    // plugin的配置
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './public/index.html'
        }),
        new CleanWebpackPlugin(),
        // new MiniCssExtractPlugin({
        //     filename: './public/css/[name].css',
        //     chunkFilename: '[id].css',
        // }),
        new OptimizeCssAssetsPlugin()
    ],
    //  模式
    // mode: 'development',

    mode: 'production',
    devServer: {
        // 项目构建后的路径
        contentBase: resolve(__dirname, 'build'),
        // 启动的端口号
        port: 3000,
        // 自动打开浏览器
        // open: true
        // 启用gzip压缩
        compress: true
    },
    stats: {
        children: false
    }
};*/

const {resolve} = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// 公共的代码
const commonCssLoader = [
    'css-loader',
    {
        loader: 'postcss-loader',
        options: {
            ident: 'postcss',
            plugins: (loader) => [
                require('postcss-preset-env')()
            ]
        }
    }
];

module.exports = {
    entry: './src/index.js',
    output: {
        // 常规操作
        filename: 'js/[name].js',
        path: resolve(__dirname, 'build'),
    },
    module: {
        rules: [
            // 1. 样式相关
            {
                test: /\.css$/,
                use: [...commonCssLoader]
            },
            {
                test: /\.less$/,
                use: [...commonCssLoader, 'less-loader']
            },
            // 2. JS相关

            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    presets: [
                        [
                            '@babel/preset-env',
                            {
                                useBuiltIns: 'usage',
                                corejs: {
                                    version: 3
                                },
                                targets: {
                                    chrome: '60',
                                    firefox: '60',
                                    ie: '9',
                                    edge: '16',
                                    safari: '12'
                                }
                            }
                        ]
                    ]
                }
            },
            // 3. 图片相关
            {
                test: /\.(jpg|png|gif)$/,
                loader: 'url-loader',
                options: {
                    limit: 60 * 1024,
                    name: '[hash:12].[name]',
                    outputPath: 'img'
                }
            },
            {
                test: /\.html$/,
                loader: 'html-loader'
            },
            // 4. 其它资源
            {
                exclude: /\.(js|json|css|less|jpg|png|gif|html)/,
                loader: 'file-loader',
                options: {
                    name: '[hash:12].[ext]',
                    outputPath: 'source'
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html',
            minify: {
                collapseWhitespace: true,
                removeComments: true
            }
        }),
        new CleanWebpackPlugin(),
    ],
    mode: 'development',
    devServer: {
        contentBase: resolve(__dirname, 'build'),
        port: 3000,
        compress: true
    },
    resolve: {
        // 1. 配置解析模块路径别名
        // ./../../../../../src/js/other.js
        // $myJS/other.js
        /*
          - 优点： 简写
          - 缺点： 没有提示， 不能跳转
        */
        alias: {
            $myJs: resolve(__dirname, ' ./../../../../../src/js')
        },

        /*
          配置默认后缀名
          // import "main"
          - js/json
        */
        // extensions: ['.js', '.json', '.css', '.less']

        // 告诉webpack在解析模块时，直接去对应的目录寻找
        modules: [resolve(__dirname, '../../../../node_modules'), 'node_modules']
    }
};

