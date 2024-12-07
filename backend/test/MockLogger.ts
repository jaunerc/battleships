import logger from "../src/Logger";

jest.mock('../src/Logger', () => ({
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    log: jest.fn()
}))

export default logger