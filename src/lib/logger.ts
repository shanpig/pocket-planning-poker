const log: Console["log"] = (...args) => {
  if (typeof window === "undefined") {
    console.log(...args);
  } else {
    const isDebuggerOpened = window.localStorage.getItem("debug");

    if (isDebuggerOpened === "true") {
      console.log(...args);
    }
  }
};

const logger = { log };

export default logger;
