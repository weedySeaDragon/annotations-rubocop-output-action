import Annotation from "./annotation"

import {mockProcessStdout} from "jest-mock-process"

interface RestoresMock {
  mockRestore(): void
}

let mockStdout: RestoresMock

beforeEach(() => {
  mockStdout = mockProcessStdout()
})
afterEach(() => {
  mockStdout.mockRestore()
})

describe(".write", () => {
  test("with message only", () => {
    const annotation = new Annotation("yo")
    annotation.write()

    expect(mockStdout).toHaveBeenCalledWith("::error::yo\n")
  })
  test("with file", () => {
    const annotation = new Annotation("yo", {file: "file.rb"})
    annotation.write()

    expect(mockStdout).toHaveBeenCalledWith("::error file=file.rb::yo\n")
  })
  test("with line", () => {
    const annotation = new Annotation("yo", {line: 1})
    annotation.write()

    expect(mockStdout).toHaveBeenCalledWith("::error line=1::yo\n")
  })
  test("with col", () => {
    const annotation = new Annotation("yo", {col: 1})
    annotation.write()

    expect(mockStdout).toHaveBeenCalledWith("::error col=1::yo\n")
  })
  test("with warning level", () => {
    const annotation = new Annotation("is a warning")
    annotation.level = "warning"
    annotation.write()

    expect(mockStdout).toHaveBeenCalledWith("::warning::is a warning\n")
  })
  test("with convention level", () => {
    const annotation = new Annotation("is a convention")
    annotation.level = "convention"
    annotation.write()

    expect(mockStdout).toHaveBeenCalledWith("::convention::is a convention\n")
  })
  test("with everything", () => {
    const annotation = new Annotation("yo", {file: "file.rb", line: 1, col: 1})
    annotation.level = "warning"
    annotation.write()

    expect(mockStdout).toHaveBeenCalledWith(
      "::warning file=file.rb,line=1,col=1::yo\n"
    )
  })
})
