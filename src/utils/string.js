const rand = function () {
  return Math.random().toString(36).substr(2) // remove `0.`
}

export const generateEasyToken = function () {
  return rand() + rand()
}
