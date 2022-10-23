import {InputOptions} from '@actions/core'

import {Input} from './types'

declare module '@actions/core' {
  export declare function getInput<T extends keyof Input>(
    name: T,
    options?: InputOptions
  ): Input[T]
}
