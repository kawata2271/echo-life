const store = {}

class MMKV {
  constructor() {}
  getString(key) { return store[key] ?? undefined }
  set(key, value) { store[key] = value }
  delete(key) { delete store[key] }
  clearAll() { Object.keys(store).forEach(k => delete store[k]) }
}

module.exports = { MMKV }
