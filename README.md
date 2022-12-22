# kdu-codemod

**Experimental**

This repository contains a collection of codemod scripts for use with [JSCodeshift](https://github.com/facebook/jscodeshift) that help update Kdu.js APIs.

Inspired by [react-codemod](https://github.com/reactjs/react-codemod).

## Command Line Usage

`npx kdu-codemod <path> -t <transformation> --params [transformation params] [...additional options]`

- `transformation` (required) - name of transformation, see available transformations below; or you can provide a path to a custom transformation module.
- `path` (required) - files or directory to transform.
- `--params` (optional) - additional transformation specific args.
<!-- - use the `--dry` options for a dry-run. -->

## Programmatic API

- `runTransformation(fileInfo, transformation, params)`

## Custom Transformation

See https://github.com/facebook/jscodeshift#transform-module

## Post Transformation

- Running transformations will generally ruin the formatting of your files. A recommended way to solve that problem is by using [Prettier](https://prettier.io/) or `eslint --fix`.
- Even after running prettier its possible to have unnecessary new lines added/removed. This can be solved by ignoring white spaces while staging the changes in git.

```sh
git diff --ignore-blank-lines | git apply --cached
```
