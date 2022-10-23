import * as process from 'process'

import * as core from '@actions/core'

import {Input, Rules} from '../src/types'

let mockRules: Rules = []
jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  readFileSync: () => JSON.stringify(mockRules)
}))

let mockInput: Partial<Input> = {}
const mockSetFailed = jest.fn((message: string | Error) => {
  return jest.requireActual('@actions/core').setFailed(message)
})
const mockSetOutput = jest.fn((name: string, value: string) => {
  return jest.requireActual('@actions/core').setOutput(name, value)
})
jest.mock('@actions/core', () => ({
  ...jest.requireActual('@actions/core'),
  getInput: jest.fn((name: keyof Input, options?: core.InputOptions) => {
    const input = mockInput[name]

    if (!input && options && options.required) {
      throw new Error(`Input missing: ${name}`)
    }

    return input
  }),
  setFailed: (message: string | Error) => mockSetFailed(message),
  setOutput: (name: string, value: string) => mockSetOutput(name, value)
}))

const mockJoin = jest.fn((...args) => jest.requireActual('path').join(...args))
jest.mock('path', () => ({
  join: (...args: string[]) => mockJoin(...args)
}))

describe('action-entitled-actor', () => {
  beforeEach(() => {
    process.env.GITHUB_WORKSPACE = 'github-workspace'
    process.env.GITHUB_ACTOR = 'someactor'
    mockInput = {}
    mockRules = [
      {
        id: '1',
        eligibleActors: ['octocat'],
        description: 'only the octocat can do this',
        failureMessage: '',
        /**
         * should exit if actor is not eligible
         */
        failSilently: false
      }
    ]

    jest.clearAllMocks()
    // because we use require() our code
    jest.resetModules()
  })

  it('uses workflow inputs', () => {
    mockInput = {
      rulesFile: 'rules.json',
      ruleId: '1'
    }

    // eslint-disable-next-line global-require, @typescript-eslint/no-require-imports
    require('../src/main.ts')

    expect(mockJoin).toHaveBeenNthCalledWith(
      1,
      'github-workspace',
      '.github',
      'rules.json'
    )
  })

  it('sets output', () => {
    mockInput = {
      ruleId: '1'
    }

    mockRules = [
      {
        id: '1',
        eligibleActors: ['someactor'],
        failureMessage: ''
      }
    ]

    // eslint-disable-next-line global-require, @typescript-eslint/no-require-imports
    require('../src/main.ts')

    expect(mockSetFailed).toHaveBeenCalledTimes(0)
    expect(mockSetOutput).toHaveBeenCalledWith('isEligibleActor', true)
  })

  it('fails silently if failSilently is true', () => {
    mockInput = {
      ruleId: '1'
    }

    mockRules = [
      {
        id: '1',
        eligibleActors: ['octocat'],
        failureMessage: 'only Octocat can do this!',
        failSilently: true
      }
    ]

    // eslint-disable-next-line global-require, @typescript-eslint/no-require-imports
    require('../src/main.ts')

    expect(mockSetFailed).toHaveBeenCalledTimes(0)
    expect(mockSetOutput).toHaveBeenCalledWith('isEligibleActor', false)
  })

  it('reports failures with default error message', () => {
    mockInput = {
      ruleId: '1'
    }

    // eslint-disable-next-line global-require, @typescript-eslint/no-require-imports
    require('../src/main.ts')

    expect(mockSetFailed).toHaveBeenCalledWith(
      'Actor is not eligible to trigger this Workflow.'
    )
    expect(mockSetOutput).toHaveBeenCalledWith('isEligibleActor', false)
  })

  it('reports failures with custom error message', () => {
    mockInput = {
      ruleId: '1'
    }

    mockRules = [
      {
        id: '1',
        eligibleActors: ['octocat'],
        failureMessage: 'only Octocat can do this!'
      }
    ]

    // eslint-disable-next-line global-require, @typescript-eslint/no-require-imports
    require('../src/main.ts')

    expect(mockSetFailed).toHaveBeenCalledWith('only Octocat can do this!')
    expect(mockSetOutput).toHaveBeenCalledWith('isEligibleActor', false)
  })
})
