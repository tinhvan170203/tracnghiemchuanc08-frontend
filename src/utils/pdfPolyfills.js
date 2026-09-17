/**
 * Polyfill API mà pdf.js 5.x cần — WebView/Zalo/Chrome cũ thường thiếu.
 */
(function applyPdfPolyfills() {
  if (typeof Promise !== "undefined" && typeof Promise.withResolvers !== "function") {
    Promise.withResolvers = function withResolvers() {
      let resolve;
      let reject;
      const promise = new Promise((res, rej) => {
        resolve = res;
        reject = rej;
      });
      return { promise, resolve, reject };
    };
  }

  if (typeof Map !== "undefined") {
    if (typeof Map.prototype.getOrInsert !== "function") {
      Object.defineProperty(Map.prototype, "getOrInsert", {
        value(key, defaultValue) {
          if (this.has(key)) return this.get(key);
          this.set(key, defaultValue);
          return defaultValue;
        },
        writable: true,
        configurable: true,
      });
    }
    if (typeof Map.prototype.getOrInsertComputed !== "function") {
      Object.defineProperty(Map.prototype, "getOrInsertComputed", {
        value(key, callbackFn) {
          if (this.has(key)) return this.get(key);
          const value = callbackFn(key);
          this.set(key, value);
          return value;
        },
        writable: true,
        configurable: true,
      });
    }
  }

  if (typeof WeakMap !== "undefined") {
    if (typeof WeakMap.prototype.getOrInsert !== "function") {
      Object.defineProperty(WeakMap.prototype, "getOrInsert", {
        value(key, defaultValue) {
          if (this.has(key)) return this.get(key);
          this.set(key, defaultValue);
          return defaultValue;
        },
        writable: true,
        configurable: true,
      });
    }
    if (typeof WeakMap.prototype.getOrInsertComputed !== "function") {
      Object.defineProperty(WeakMap.prototype, "getOrInsertComputed", {
        value(key, callbackFn) {
          if (this.has(key)) return this.get(key);
          const value = callbackFn(key);
          this.set(key, value);
          return value;
        },
        writable: true,
        configurable: true,
      });
    }
  }
})();
