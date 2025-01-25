enum env {
    PROD = "production",
    DEV = "development"
}

const currentContext = env.DEV

export {
    env,
    currentContext
}