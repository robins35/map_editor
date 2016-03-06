let intersects = (obj, point, tolerance = 0) => {
  let xIntersect = (point.x + tolerance) > obj.pos.x && (point.x - tolerance) < (obj.pos.x + obj.width)
  let yIntersect = (point.y + tolerance) > obj.pos.y && (point.y - tolerance) < (obj.pos.y + obj.height)
  return  xIntersect && yIntersect;
}

let vectorSum = (vector1, vector2) => {
  return {
    x: vector1.x + vector2.x,
    y: vector1.y + vector2.y
  }
}

let vectorDifference = (vector1, vector2) => {
  return {
    x: vector1.x - vector2.x,
    y: vector1.y - vector2.y
  }
}

let pointsAreEqual = (point1, point2) => {
  return point1.x == point2.x && point1.y == point2.y
}

export { intersects, vectorSum, vectorDifference, pointsAreEqual }
