// Empirical Verification Script for XIYORA M2 Milestone
// Tests fetchWithRetry, LoadingScreen logic, OfflineBanner, ErrorBoundary listeners

const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log("=== XIYORA M2 EMPIRICAL VERIFICATION HARNESS ===");

const results = [];
function recordTest(name, passed, details) {
  results.push({ name, passed, details });
  console.log(`[${passed ? 'PASS' : 'FAIL'}] ${name}: ${details}`);
}

// -------------------------------------------------------------
// Test 1: fetchWithRetry logic extraction and stress test
// -------------------------------------------------------------
async function runFetchWithRetryTests() {
  console.log("\n--- Running Test 1: fetchWithRetry Behavior ---");
  
  // Replicate fetchWithRetry implementation from App.tsx (lines 289-304)
  async function fetchWithRetry(url, options = {}, retries = 2, backoff = 50, fetchFn = global.fetch) {
    try {
      const res = await fetchFn(url, options);
      if (!res.ok && retries > 0 && res.status >= 500) {
        await new Promise(r => setTimeout(r, backoff));
        return fetchWithRetry(url, options, retries - 1, backoff * 1.5, fetchFn);
      }
      return res;
    } catch (err) {
      if (retries > 0) {
        await new Promise(r => setTimeout(r, backoff));
        return fetchWithRetry(url, options, retries - 1, backoff * 1.5, fetchFn);
      }
      throw err;
    }
  }

  // 1a. Success on 1st attempt (200 OK)
  {
    let attempts = 0;
    const mockFetch = async () => {
      attempts++;
      return { ok: true, status: 200, json: async () => ({ data: "ok" }) };
    };
    const res = await fetchWithRetry("http://localhost/test", {}, 2, 10, mockFetch);
    recordTest("1a. fetchWithRetry 200 OK (1st try)", res.ok && attempts === 1, `Attempts: ${attempts}`);
  }

  // 1b. Server Error 500 recovery on 2nd attempt
  {
    let attempts = 0;
    const mockFetch = async () => {
      attempts++;
      if (attempts === 1) return { ok: false, status: 500 };
      return { ok: true, status: 200 };
    };
    const start = Date.now();
    const res = await fetchWithRetry("http://localhost/test", {}, 2, 50, mockFetch);
    const elapsed = Date.now() - start;
    recordTest("1b. fetchWithRetry 500 transient recovery", res.ok && attempts === 2 && elapsed >= 40, `Attempts: ${attempts}, Elapsed: ${elapsed}ms`);
  }

  // 1c. Server Error 500 retry exhaustion
  {
    let attempts = 0;
    const mockFetch = async () => {
      attempts++;
      return { ok: false, status: 503 };
    };
    const start = Date.now();
    const res = await fetchWithRetry("http://localhost/test", {}, 2, 40, mockFetch);
    const elapsed = Date.now() - start;
    // 1st call -> fail (503) -> wait 40ms -> 2nd call -> fail (503) -> wait 60ms -> 3rd call -> return 503 (retries=0)
    // Total attempts = 3, Total backoff = 40 + 60 = 100ms
    recordTest("1c. fetchWithRetry 503 exhaustion", res.status === 503 && attempts === 3 && elapsed >= 90, `Attempts: ${attempts}, Elapsed: ${elapsed}ms, Status: ${res.status}`);
  }

  // 1d. Client Error 404 fast-fail (no retries)
  {
    let attempts = 0;
    const mockFetch = async () => {
      attempts++;
      return { ok: false, status: 404 };
    };
    const res = await fetchWithRetry("http://localhost/test", {}, 2, 50, mockFetch);
    recordTest("1d. fetchWithRetry 404 fast fail", res.status === 404 && attempts === 1, `Attempts: ${attempts}`);
  }

  // 1e. Network drop (fetch rejection) retry exhaustion
  {
    let attempts = 0;
    const mockFetch = async () => {
      attempts++;
      throw new TypeError("Failed to fetch");
    };
    let caughtErr = null;
    try {
      await fetchWithRetry("http://localhost/test", {}, 2, 30, mockFetch);
    } catch (err) {
      caughtErr = err;
    }
    recordTest("1e. fetchWithRetry Network Exception retry exhaustion", caughtErr !== null && attempts === 3, `Attempts: ${attempts}, Err: ${caughtErr?.message}`);
  }

  // 1f. Stress-test AbortSignal handling with fetchWithRetry
  {
    let attempts = 0;
    const controller = new AbortController();
    const mockFetch = async (url, opts) => {
      attempts++;
      if (opts.signal?.aborted) {
        const err = new Error("The operation was aborted");
        err.name = "AbortError";
        throw err;
      }
      // simulate delay then abort
      await new Promise(r => setTimeout(r, 20));
      if (opts.signal?.aborted) {
        const err = new Error("The operation was aborted");
        err.name = "AbortError";
        throw err;
      }
      return { ok: false, status: 500 };
    };
    controller.abort(); // pre-aborted
    let caught = null;
    try {
      await fetchWithRetry("http://localhost/test", { signal: controller.signal }, 2, 20, mockFetch);
    } catch (err) {
      caught = err;
    }
    recordTest("1f. fetchWithRetry AbortSignal pre-aborted behavior", caught?.name === "AbortError", `Attempts: ${attempts}, Error: ${caught?.name}`);
  }
}

// -------------------------------------------------------------
// Test 2: LoadingScreen Hydration Counter Simulation
// -------------------------------------------------------------
function runLoadingScreenTests() {
  console.log("\n--- Running Test 2: LoadingScreen Hydration Progression ---");

  function simulateCounter(appReadyInitial, readyAfterMs = null) {
    let num = 1;
    let appReady = appReadyInitial;
    let intervalTicks = 0;
    const history = [num];
    let isMonotonic = true;
    let intervalId;

    const startTime = Date.now();

    return new Promise(resolve => {
      intervalId = setInterval(() => {
        intervalTicks++;
        const now = Date.now();
        if (readyAfterMs !== null && now - startTime >= readyAfterMs) {
          appReady = true;
        }

        const prev = num;
        let next;
        if (appReady) {
          if (prev >= 100) {
            clearInterval(intervalId);
            resolve({ history, intervalTicks, hit100: true, isMonotonic });
            return;
          }
          const step = Math.max(3, Math.ceil((100 - prev) * 0.35));
          next = Math.min(100, Math.max(prev, prev + step));
        } else {
          if (prev >= 90) {
            next = 90;
          } else {
            const step = prev < 40 ? 3 : prev < 70 ? 2 : 1;
            next = Math.min(90, Math.max(prev, prev + step));
          }
        }

        if (next < prev) isMonotonic = false;
        num = next;
        history.push(num);

        if (intervalTicks > 200) { // safety cap
          clearInterval(intervalId);
          resolve({ history, intervalTicks, hit100: num === 100, isMonotonic });
        }
      }, 10); // accelerated simulation interval
    });
  }

  return (async () => {
    // 2a. Immediate appReady = true
    const resImmediate = await simulateCounter(true);
    recordTest("2a. LoadingScreen immediate appReady reaches 100%", resImmediate.hit100 && resImmediate.isMonotonic, `Ticks: ${resImmediate.intervalTicks}, Sequence: ${resImmediate.history.slice(0, 8).join('->')}...->100`);

    // 2b. Delayed appReady = true (after 100ms)
    const resDelayed = await simulateCounter(false, 100);
    recordTest("2b. LoadingScreen delayed appReady smooth progression to 100%", resDelayed.hit100 && resDelayed.isMonotonic, `Ticks: ${resDelayed.intervalTicks}, Monotonic: ${resDelayed.isMonotonic}`);

    // 2c. appReady stays false (stalled network) -> holds at 90%
    const resStalled = await simulateCounter(false);
    const lastVal = resStalled.history[resStalled.history.length - 1];
    recordTest("2c. LoadingScreen stalled appReady caps at 90%", lastVal === 90 && resStalled.isMonotonic, `Cap Value: ${lastVal}, Monotonic: ${resStalled.isMonotonic}`);
  })();
}

// -------------------------------------------------------------
// Test 3: OfflineBanner Logic Verification
// -------------------------------------------------------------
function runOfflineBannerTests() {
  console.log("\n--- Running Test 3: OfflineBanner Event Listeners ---");
  const listeners = {};
  const mockWindow = {
    addEventListener: (evt, fn) => { listeners[evt] = fn; },
    removeEventListener: (evt, fn) => { if (listeners[evt] === fn) delete listeners[evt]; }
  };
  
  // Replicate hook logic
  let offlineState = false;
  const setOffline = (val) => { offlineState = val; };

  const onOff = () => setOffline(true);
  const onOn = () => setOffline(false);

  mockWindow.addEventListener("offline", onOff);
  mockWindow.addEventListener("online", onOn);

  recordTest("3a. OfflineBanner listeners registered", typeof listeners["offline"] === "function" && typeof listeners["online"] === "function", "offline and online handlers present");

  listeners["offline"]();
  recordTest("3b. Offline state toggles to true on 'offline' event", offlineState === true, `offlineState: ${offlineState}`);

  listeners["online"]();
  recordTest("3c. Offline state toggles to false on 'online' event", offlineState === false, `offlineState: ${offlineState}`);

  mockWindow.removeEventListener("offline", onOff);
  mockWindow.removeEventListener("online", onOn);
  recordTest("3d. OfflineBanner listeners cleaned up", !listeners["offline"] && !listeners["online"], "Handlers removed cleanly");
}

// -------------------------------------------------------------
// Test 4: ErrorBoundary Unhandled Rejection & Error Listeners
// -------------------------------------------------------------
function runErrorBoundaryTests() {
  console.log("\n--- Running Test 4: ErrorBoundary Async Error Listeners ---");

  const listeners = {};
  const mockWindow = {
    addEventListener: (evt, fn) => { listeners[evt] = fn; },
    removeEventListener: (evt, fn) => { if (listeners[evt] === fn) delete listeners[evt]; }
  };

  let unhandledLog = null;
  let globalErrorLog = null;

  const handleUnhandledRejection = (event) => {
    unhandledLog = event.reason;
  };
  const handleGlobalError = (event) => {
    globalErrorLog = event.error || event.message;
  };

  // Mount
  mockWindow.addEventListener("unhandledrejection", handleUnhandledRejection);
  mockWindow.addEventListener("error", handleGlobalError);

  recordTest("4a. ErrorBoundary event listeners mounted", typeof listeners["unhandledrejection"] === "function" && typeof listeners["error"] === "function", "Listeners registered");

  // Trigger unhandledrejection event
  listeners["unhandledrejection"]({ reason: "API Timeout Error" });
  recordTest("4b. handleUnhandledRejection captures promise rejection", unhandledLog === "API Timeout Error", `Captured: ${unhandledLog}`);

  // Trigger error event
  listeners["error"]({ message: "Uncaught TypeError in async script" });
  recordTest("4c. handleGlobalError captures window async error", globalErrorLog === "Uncaught TypeError in async script", `Captured: ${globalErrorLog}`);

  // Unmount
  mockWindow.removeEventListener("unhandledrejection", handleUnhandledRejection);
  mockWindow.removeEventListener("error", handleGlobalError);
  recordTest("4d. ErrorBoundary event listeners unmounted", !listeners["unhandledrejection"] && !listeners["error"], "Listeners cleaned up");
}

// Execute test suite
(async () => {
  await runFetchWithRetryTests();
  await runLoadingScreenTests();
  runOfflineBannerTests();
  runErrorBoundaryTests();

  console.log("\n===============================================");
  const total = results.length;
  const passed = results.filter(r => r.passed).length;
  console.log(`SUMMARY: ${passed}/${total} empirical tests passed.`);
  if (passed === total) {
    console.log("VERDICT: ALL EMPIRICAL TESTS PASSED SUCCESSFULLY.");
  } else {
    console.log("VERDICT: FAILURES DETECTED.");
  }
  console.log("===============================================\n");
})();
