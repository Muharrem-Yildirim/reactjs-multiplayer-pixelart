class Pixel {
  constructor(color) {
    // this.x = x;
    // this.y = y;
    this.color = color;
  }

  setColor = (newCol) => {
    this.color = newCol;
  };

  getColor = () => this.color;

  toString = () => {
    return this.color;
  };
}

module.exports = Pixel;
