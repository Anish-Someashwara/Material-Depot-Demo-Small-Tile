const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");
// const WebpackObfuscator = require("webpack-obfuscator");

const crypto = require("crypto");
const crypto_orig_createHash = crypto.createHash;
crypto.createHash = (algorithm) =>
	crypto_orig_createHash(algorithm == "md4" ? "sha256" : algorithm);

module.exports = {
	entry: path.resolve(__dirname, "../src/script.js"),
	output: {
		filename: "bundle.[hash].js",
		path: path.resolve(__dirname, "../dist"),
	},
	// devtool: "source-map",
	plugins: [
		new CopyWebpackPlugin([
			{
				from: path.resolve(__dirname, "../static"),
				to: "../dist/static",
			},
		]),
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, "../src/index.html"),
			minify: false,
		}),
		new MiniCssExtractPlugin(),
		// new WebpackObfuscator(
		// 	{ rotateStringArray: true, reservedStrings: ["s*"] },
		// 	[]
		// ),
	],

	module: {
		rules: [
			
			// Obfuscation Rules
			// {
			// 	test: /\.js$/,
			// 	exclude: [path.resolve(__dirname, "../node_modules")],
			// 	enforce: "post",
			// 	use: {
			// 		loader: WebpackObfuscator.loader,
			// 		options: {
			// 			rotateStringArray: true,
			// 		},
			// 	},
			// },

			// HTML
			{
				test: /\.(html)$/,
				use: ["html-loader"],
			},

			// JS
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: ["babel-loader"],
			},

			// CSS
			{
				test: /\.css$/,
				use: [
					'style-loader',
					MiniCssExtractPlugin.loader,
					"css-loader",
				],
			},
			

			// Images
			{
				test: /\.(jpg|png|gif|svg|woff|hdr)$/,
				use: [
					{
						loader: "file-loader",
						options: {
							outputPath: "static/images/",
						},
					},
				],
			},

			// Shaders
			{
				test: /\.(glsl|vs|fs|vert|frag)$/,
				exclude: /node_modules/,
				use: ["raw-loader", "glslify-loader"],
			},
		],
	},
};
