import * as process from "process"
import * as cp from "child_process"
import * as path from "path"
import {promises as fs} from "fs"
import tempWrite from "temp-write"

beforeAll(async () => {
  process.env["INPUT_PATH"] = await tempWrite(`{
  "files": [
    {
      "path": "file1",
      "offenses": [
        {
          "severity": "error",
          "message": "Error message",
          "cop_name": "Cop",
          "location": {
            "line": 1,
            "column": 1
          }
        }
      ]
    },{
      "path": "file2",
      "offenses": [
        {
          "severity": "convention",
          "message": "Error message 2",
          "cop_name": "Cop2",
          "location": {
            "line": 2,
            "column": 2
          }
        }
      ]
    }
  ]
}`)
})
afterAll(async () => {
  if (!process.env["INPUT_PATH"]) {
    return
  }
  await fs.unlink(process.env["INPUT_PATH"])
})

test("main run", () => {
  const ip = path.join(__dirname, "..", "lib", "main.js")
  const options: cp.ExecSyncOptions = {
    env: process.env
  }
  expect(cp.execSync(`node ${ip}`, options).toString()).toEqual(
    "::error file=file1,col=1,line=1,cop_name=Cop::[Cop] Error message\n" +
      "::convention file=file2,col=2,line=2,cop_name=Cop2::[Cop2] Error message 2\n"
  )
})
test("sets error", () => {
  const ip = path.join(__dirname, "..", "lib", "main.js")
  const options: cp.ExecSyncOptions = {
    env: {...process.env, INPUT_PATH: "/asd"}
  }
  cp.exec(`node ${ip}`, options, (error, stdout) => {
    expect(error).not.toBeUndefined()
    expect(stdout).toEqual("::error::File '/asd' doesn't exist\n")
  })
})
test("uses rubocop.json as a default path", () => {
  const ip = path.join(__dirname, "..", "lib", "main.js")
  const options: cp.ExecSyncOptions = {
    env: {...process.env, INPUT_PATH: undefined}
  }
  cp.exec(`node ${ip}`, options, (error, stdout) => {
    const fullpath = path.resolve("rubocop.json")
    expect(error).not.toBeUndefined()
    expect(stdout).toEqual(`::error::File '${fullpath}' doesn't exist\n`)
  })
})
