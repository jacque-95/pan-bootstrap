// We are using node's native package 'path'
// https://nodejs.org/api/path.html
const path = require('path');

const webpack = require('webpack'); // reference to webpack Object

// Including our UglifyJS
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

// using the newer beta version for >= Webpack 4
// the current version is only good for <= Webpack 3
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const extractSass = new ExtractTextPlugin({
    filename: "style.min.css",
});

// Constant with our paths
const paths = {
    DIST: path.resolve(__dirname, 'dist'),
    SRC: path.resolve(__dirname, 'src')
};

// Webpack configuration
module.exports = {
    entry: {
        main: path.join(paths.SRC, 'index.js'),
        home: path.join(paths.SRC, 'home.js')
    },
    output: {
        path: paths.DIST,
        filename: '[name].bundle.js'
    },
    watch: true,
	// Adding jQuery as external library
	externals: {
	  jquery: 'jQuery'
	},
    // Tell webpack to use html plugin -> ADDED IN THIS STEP
    // index.html is used as a template in which it'll inject bundled app.
    plugins: [
        new webpack.ProvidePlugin({
          $: 'jquery',
          jQuery: 'jquery',
          Popper: 'popper.js'
        }),
        new UglifyJSPlugin(),
        extractSass
    ],
    // Loaders configuration -> ADDED IN THIS STEP
    // We are telling webpack to use "babel-loader" for .js and .jsx files
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: [
                'babel-loader'
                ],
            },
            {
            	test: /\.scss$/,
            	use: extractSass.extract({
            		use: [
                        {
            			    loader: "css-loader"
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                ident: 'postcss',
                                plugins: [
                                    require('autoprefixer')({}),
                                    require('cssnano')({ preset: 'default' })
                                ],
                                minimize: true
                            }
                        },
                        {
            			    loader: "sass-loader"
                        }
                    ],
					// use style-loader in development
					fallback: "style-loader"
				})
            }, 
            {
                test: /\.css$/, // 針對所有.css 的檔案作預處理，這邊是用 regular express 的格式
                use: [
                    {
                        loader: "style-loader"
                    },
                    {
            			loader: "css-loader"
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            ident: 'postcss',
                            plugins: [
                                require('autoprefixer')({}),
                                require('cssnano')({ preset: 'default' })
                            ],
                            minimize: true
                        }
                    },
                ]
            },
        ],
    },
    // Enable importing JS files without specifying their's extenstion -> ADDED IN THIS STEP
    //
    // So we can write:
    // import MyComponent from './my-component';
    //
    // Instead of:
    // import MyComponent from './my-component.jsx';
    resolve: {
        extensions: ['.js', '.jsx'],
    },
};