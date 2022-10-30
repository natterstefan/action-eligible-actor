import path from 'path'
import fs from 'fs'

import * as core from '@actions/core'

import {InputValues, Rules} from './types'

const DEFAULT_RULES_FILE = 'eligible-actors-rules.json'

const getInput = (): InputValues => {
  const ruleId = core.getInput('ruleId', {required: true})
  const rulesFile = core.getInput('rulesFile') || DEFAULT_RULES_FILE

  return {
    ruleId,
    rulesFile
  }
}

async function run(): Promise<void> {
  // debug is only output if you set the secret `ACTIONS_STEP_DEBUG` to true
  core.debug(`Starting ...`)

  try {
    core.debug(`Reading input ...`)
    const {rulesFile, ruleId} = getInput()

    const fileUrl = path.join(
      process.env.GITHUB_WORKSPACE as string,
      '.github',
      rulesFile
    )

    core.debug(`Reading rules ...`)

    /**
     * @see https://docs.github.com/en/actions/learn-github-actions/environment-variables#default-environment-variables
     * @see https://docs.github.com/en/actions/learn-github-actions/contexts#github-context
     */
    const actor = process.env.GITHUB_ACTOR as string
    core.debug(`Got actor: ${actor}`)

    const rules: Rules = JSON.parse(fs.readFileSync(fileUrl).toString())
    core.debug(`Got all rules from file ${fileUrl}`)

    const activeRule = rules.find(a => a.id === ruleId)
    core.debug(
      `Found active rule: ${activeRule ? JSON.stringify(activeRule) : '-'}`
    )

    const isEligibleActor = activeRule?.eligibleActors.includes(actor)
    core.setOutput('isEligibleActor', isEligibleActor)

    if (!isEligibleActor && !activeRule?.failSilently) {
      core.setFailed(
        activeRule?.failureMessage ||
          'Actor is not eligible to trigger this Workflow.'
      )
    }

    core.debug(`Read rules and validated actor ...`)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }

  core.debug(`Ended ...`)
}

run()
