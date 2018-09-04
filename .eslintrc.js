module.exports = {
	"parser"       : "babel-eslint",
	"env"          : {
		"browser" : true,
		"commonjs": true,
		"es6"     : true
	},
	"extends"      : ["airbnb", 'prettier', 'prettier/react'],
	"plugins"      : [
    'prettier',
		"react"
	],
	"rules"        : {
    "prettier/prettier": 'error',
    "react/prop-types": 1,
	}
};