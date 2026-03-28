declare module 'react-native-mmkv' {
  export class MMKV {
    constructor(config?: { id?: string; path?: string; encryptionKey?: string })
    getString(key: string): string | undefined
    set(key: string, value: string | number | boolean): void
    delete(key: string): void
    clearAll(): void
    getAllKeys(): string[]
    contains(key: string): boolean
    getNumber(key: string): number | undefined
    getBoolean(key: string): boolean | undefined
  }
}
