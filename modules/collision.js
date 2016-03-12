let intersects = (obj, point, tolerance = 0, relative = false) => {
  let objectPosition = relative ? obj.relativePos : obj.pos
  let xIntersect = (point.x + tolerance) > objectPosition.x && (point.x - tolerance) < (objectPosition.x + obj.width)
  let yIntersect = (point.y + tolerance) > objectPosition.y && (point.y - tolerance) < (objectPosition.y + obj.height)
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

let vectorProduct = (constant, vector) => {
  let newVector = {}
  for(let key of Object.keys(vector))
    newVector[key] = vector[key] * constant

  return newVector
}

let pointsAreEqual = (point1, point2) => {
  return point1.x == point2.x && point1.y == point2.y
}

export { intersects, vectorSum, vectorDifference, vectorProduct, pointsAreEqual }
