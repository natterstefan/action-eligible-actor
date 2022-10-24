export type Input = {
  ruleId: string
  /**
   * @default "eligible-actors.json"
   */
  rulesFile?: string
}

export type InputValues = {
  ruleId: string
  rulesFile: string
}

export type Rule = {
  /**
   * id of the rule
   */
  id: string
  /**
   * Array of GitHub usernames who are eligible actors of the Workflow using
   * this rule.
   */
  eligibleActors: string[]
  /**
   * Custom description to explain the rule in more detail.
   */
  description?: string
  /**
   * Message to display in the GitHub Action logs when eligible check fails.
   */
  failureMessage?: string
  /**
   * Whether or not the GitHub action should exit with status code 1 or not.
   */
  failSilently?: boolean
}

export type Rules = Rule[]
