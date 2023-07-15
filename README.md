# conways-game-of-life

A simulation of Conways Game of Life I wrote for the purpose of learning the HTML Canvas API

### Simple rules

For a space that is populated:

    Each cell with one or no neighbors dies, as if by solitude.

    Each cell with four or more neighbors dies, as if by overpopulation.

    Each cell with two or three neighbors survives.

For a space that is empty or unpopulated:

    Each cell with three neighbors becomes populated.

### Note to self

- `draw()` function will be used to actually render the context
- it is possible to delay/set a timer for the `draw()` function
