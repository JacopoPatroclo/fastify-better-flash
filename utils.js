// Regex to check if the property name is a reserved word
// avoiding prototype pollution and reassigning common functionalities
const reservedAccessorRegex = /^(constructor|prototype|__proto__|hasOwnProperty|isPrototypeOf|propertyIsEnumerable|toLocaleString|toString|valueOf)$/
/**
* Given a path, an object, and a value, attach the value to the object at the given path.
* @param {string} path
* @param {object} referenceObject
* @param {any} valueToAttach
*/
function attachThingToObjectGivenPath (path, referenceObject, valueToAttach) {
  if (typeof path !== 'string') {
    throw new Error('Path must be a string, unable to attach value to object')
  }

  if (path === '') {
    throw new Error('Path cannot be empty, provide at least one property')
  }

  const pathArray = path.split('.')
  // Use this to keep the instance of the object we are currently working with
  let currentObject = referenceObject
  for (let i = 0; i < pathArray.length; i++) {
    if (reservedAccessorRegex.test(pathArray[i])) {
      throw new Error(`The property name ${pathArray[i]} is a reserved word and cannot be used`)
    }
    if (i === pathArray.length - 1) {
      if (Array.isArray(currentObject[pathArray[i]])) {
        if (Array.isArray(valueToAttach)) {
          currentObject[pathArray[i]].push(...valueToAttach)
        } else {
          currentObject[pathArray[i]].push(valueToAttach)
        }
      } else {
        currentObject[pathArray[i]] = valueToAttach
      }
    } else {
      if (!currentObject[pathArray[i]]) {
        currentObject[pathArray[i]] = {}
      }
      currentObject = currentObject[pathArray[i]]
    }
  }
}

/**
* Given a path and an object, retrieve the value at the given path.
* @param {string} path
* @param {object} referenceObject
*/
function retriveThingFromObjectGivenPath (path, referenceObject) {
  if (typeof path !== 'string') {
    throw new Error('Path must be a string, unable to retrive value from object')
  }

  if (path === '') {
    return referenceObject
  }

  const pathArray = path.split('.')
  let currentObject = referenceObject
  for (let i = 0; i < pathArray.length; i++) {
    if (reservedAccessorRegex.test(pathArray[i])) {
      throw new Error(`The property name ${pathArray[i]} is a reserved word and cannot be used`)
    }
    if (i === pathArray.length - 1) {
      return currentObject[pathArray[i]]
    } else {
      if (!currentObject[pathArray[i]]) {
        return undefined
      }
      currentObject = currentObject[pathArray[i]]
    }
  }
  return currentObject
}

/**
* Delete given path from object
* @param {string} path
* @param {object} referenceObject
*/
function deleteThingFromObjectGivenPath (path, referenceObject) {
  if (typeof path !== 'string') {
    throw new Error('Path must be a string, unable to delete value on object')
  }

  if (path === '') {
    throw new Error('Path cannot be empty, provide at least one property')
  }

  const pathArray = path.split('.')
  let currentObject = referenceObject
  for (let i = 0; i < pathArray.length; i++) {
    if (reservedAccessorRegex.test(pathArray[i])) {
      throw new Error(`The property name ${pathArray[i]} is a reserved word and cannot be used`)
    }
    if (i === pathArray.length - 1) {
      if (Array.isArray(currentObject)) {
        currentObject.splice(pathArray[i], 1)
      } else {
        delete currentObject[pathArray[i]]
      }
    } else {
      if (!currentObject[pathArray[i]]) {
        return
      }
      currentObject = currentObject[pathArray[i]]
    }
  }
}

module.exports = {
  attachThingToObjectGivenPath,
  retriveThingFromObjectGivenPath,
  deleteThingFromObjectGivenPath
}
