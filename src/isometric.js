let cartToIso = (point) => {
  let isoX = point.x - point.y
  let isoY = (point.x + point.y) / 2
  return { x: isoX, y: isoY }
}

let isoToCart = (point) => {
  let cartX = point.y + (point.x / 2)
  let cartY = point.y - (point.x / 2)
  return { x: cartX, y: cartY }
}

// let getIsoTileCoordinates(isoTo2D(screen point), tile height);

export default { cartToIso, isoToCart }
