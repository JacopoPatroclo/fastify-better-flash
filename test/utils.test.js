'use strict'

const { describe, it } = require('node:test')
const assert = require('node:assert')
const utils = require('../utils')

describe('utils', () => {
  it('should throw when a path is not provided', () => {
    assert.throws(() => utils.attachThingToObjectGivenPath(undefined, {}, 'test'), Error, 'Path must be a string, unable to attach value to object')
  })

  it('should throw if an empty path is given', () => {
    assert.throws(() => utils.attachThingToObjectGivenPath('', {}, 'value'), Error, 'Path cannot be empty, provide at least one property')
  })

  it('should walk correctly the path creating the object as we go', () => {
    const obj = {}
    utils.attachThingToObjectGivenPath('a.b.c', obj, 'value')
    assert.deepEqual(obj, { a: { b: { c: 'value' } } })
  })

  it('should walk correctly the path creating the object as we go attaching object', () => {
    const obj = {}
    utils.attachThingToObjectGivenPath('a.b', obj, { m: 'value' })
    assert.deepEqual(obj, { a: { b: { m: 'value' } } })
  })

  it('should walk correctly the path and attach the value to the object', () => {
    const obj = { a: { b: { c: 'value' } } }
    utils.attachThingToObjectGivenPath('a.b.d', obj, 'value')
    assert.deepEqual(obj, { a: { b: { c: 'value', d: 'value' } } })
  })

  it('should concat an element if the target is an array', () => {
    const obj = { a: { b: ['one', 'two'] } }
    utils.attachThingToObjectGivenPath('a.b', obj, ['three'])
    assert.deepEqual(obj, { a: { b: ['one', 'two', 'three'] } })
  })

  it('should walk correctly an array', () => {
    const obj = { a: { b: ['one', 'two'] } }
    utils.attachThingToObjectGivenPath('a.b.2', obj, 'three')
    assert.deepEqual(obj, { a: { b: ['one', 'two', 'three'] } })
  })

  it('should walk correctly an array and edit a current property', () => {
    const obj = { a: { b: ['one', 'two'] } }
    utils.attachThingToObjectGivenPath('a.b.0', obj, 'three')
    assert.deepEqual(obj, { a: { b: ['three', 'two'] } })
  })

  it('should retrive the hole object when an empty path is given', () => {
    const obj = { a: { b: { c: 'value' } } }
    assert.deepEqual(utils.retriveThingFromObjectGivenPath('', obj), obj)
  })

  it('should walk correctly an object and retrive', () => {
    const obj = { a: { b: { c: 'value' } } }
    assert.strictEqual(utils.retriveThingFromObjectGivenPath('a.b.c', obj), 'value')
  })

  it('should walk correctly an array and retrive', () => {
    const obj = { a: { b: ['one', 'two'] } }
    assert.strictEqual(utils.retriveThingFromObjectGivenPath('a.b.1', obj), 'two')
  })

  it('should walk correctly to an object but with missing values, should return undefined', () => {
    const obj = { a: { b: { c: 'value' } } }
    assert.strictEqual(utils.retriveThingFromObjectGivenPath('a.m.d', obj), undefined)
  })

  it('should delete a given path', () => {
    const obj = { a: { b: { c: 'value' } } }
    utils.deleteThingFromObjectGivenPath('a.b.c', obj)
    assert.deepEqual(obj, { a: { b: {} } })
  })

  it('should delete a given path with array', () => {
    const obj = { a: { b: ['one', 'two', 'three'] } }
    utils.deleteThingFromObjectGivenPath('a.b.2', obj)
    assert.deepEqual(obj, { a: { b: ['one', 'two'] } })
  })

  it('should throw when a path is not provided', () => {
    assert.throws(() => utils.deleteThingFromObjectGivenPath(undefined, {}), Error, 'Path must be a string, unable to delete value on object')
  })

  it('should avoid prototipe pollution by throwing', () => {
    const obj = { a: { b: { c: 'value' } } }
    assert.throws(() => utils.attachThingToObjectGivenPath('__proto__.polluted', obj, 'value'), Error, 'The property name __proto__')
  })
})
