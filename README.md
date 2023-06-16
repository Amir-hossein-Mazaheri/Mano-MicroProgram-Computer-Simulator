# Mano Micro Program Computer Simulator

This is a simulator for computer with power of micro program introduced in Moris Mano book

## Demo

A simple preview of running project:

![preview](https://github.com/Amir-hossein-Mazaheri/Mano-MicroProgram-Computer-Simulator/blob/main/preview.gif)

## Features

- Pretty Micro Program and Assembly Syntax Highlighting Theme Just Like an IDE
- Ability to Run Each Step or Micro Operation
- Error Handling When Assembling Code
- Gathering Warnings While Trying to Assemble
- As Close as Possible to Morris Mano Introduced Micro Program Computer
- Pretty and High Performance Simulator
- Fully Responsive

## How to Use

At first install NodeJS from [here](https://nodejs.org/) and then install "pnpm" like:

```bash
  npm i -g pnpm
```

Then you should cd into the cloned project and run following command(this step may take a while):

```bash
  pnpm i
```

After installing all of dependencies you have to build the project:

```bash
  pnpm build
```

At the end you could do two thing first:

```bash
  pnpm preview
```

After doing all of these steps correctly you should be able to see project at "http://localhost:4173" by you favorite browser.

Or follow these commands to build a desktop app:

```bash
  pnpm package
```

And the output in the "out" folder contains an executable which act like the web version