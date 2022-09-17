# eslint-plugin-better-eslint

Standard ESLint rules with max length capabilities 

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, install `eslint-plugin-better-eslint`:

```sh
npm install eslint-plugin-better-eslint --save-dev
```

## Usage

Add `better-eslint` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "better-eslint"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "better-eslint/rule-name": 2
    }
}
```

## Supported Rules

* Fill in provided rules here


