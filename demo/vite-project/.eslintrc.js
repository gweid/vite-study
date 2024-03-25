module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:react/recommended",
        // 接入 prettier 的规则
        "prettier",
        "plugin:prettier/recommended"
    ],
    "overrides": [
        {
            "env": {
                "node": true
            },
            "files": [
                ".eslintrc.{js,cjs}"
            ],
            "parserOptions": {
                "sourceType": "script"
            }
        }
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "settings": {
        "react": {
            "version": "detect"
        }
    },
    "plugins": [
        "@typescript-eslint",
        "react",
        "prettier" // 加入 prettier 的 eslint 插件
    ],
    "rules": {
        "prettier/prettier": "error", // 开启 prettier 自动修复的功能
        "indent": ["error", 2],
        "linebreak-style": ["error", "unix"],
        "quotes": ["error", "single"],
        "semi": ["error", "always"],
        "react/react-in-jsx-scope": ["off"],
        "@typescript-eslint/no-explicit-any": ["off"]
    }
}
