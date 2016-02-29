var intersects = (obj, point, tolerance = 0) => {
  let xIntersect = (point.x + tolerance) > obj.pos.x && (point.x - tolerance) < (obj.pos.x + obj.width)
  let yIntersect = (point.y + tolerance) > obj.pos.y && (point.y - tolerance) < (obj.pos.y + obj.height)
  return  xIntersect && yIntersect;
}

export { intersects }
