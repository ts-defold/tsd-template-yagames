# Yandex Games TypeScript Template
<a href="https://discord.gg/eukcq5m"><img alt="Chat with us!" src="https://img.shields.io/discord/766898804896038942.svg?colorB=7581dc&logo=discord&logoColor=white"></a>

A dev environment for [Defold](https://defold.com/) pre-configured to use the Yandex Games SDK that transpiles TypeScript into lua using [TypeScriptToLua](https://github.com/TypeScriptToLua/TypeScriptToLua).

## Features
- Full Lua and Defold API type definitions for TypeScript auto-complete and type checking
- Eslint config for handling the caveats of TypeScriptToLua and keeping your code correct
- Handles script, gui_script, and module exports using familiar ES6 export syntax
- Full BoilerPlate game project ready to transpile and go
- File watcher via `npm run dev` to transpile on save

## Bonus
- Throwback retro console frame with virtual dpad and buttons that work with touch input on mobile
- Online and ofline Leaderboards

*Note that you will need to have [Node.js](https://nodejs.org) installed.*

## Quick Start
- Use `npm run dev` to start a watcher that compiles and emits lua and script when you save  
- Use `npm run build` to just compile your ts, sans watcher  

## Installation
1. Use `npx @ts-defold/create my-gamejam-masterpiece --template yagames`

2. Generate
```bash
npm run build # Transpile the TypeScript files to lua
# or
npm run dev # Watch for changes and regenerate files on save
```

3. Code
```
code .
```

4. Open `app/game.project` in Defold
- Craft your next banger with the help of Typescript types!

<p align="center" class="h4">
  TypeScript :heart: Defold
</p>
