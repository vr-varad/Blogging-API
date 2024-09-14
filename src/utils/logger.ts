/* eslint-disable no-console */
import chalk from 'chalk'
import moment from 'moment'

export default class Logger {
    static log(message: string) {
        console.log(
            `${chalk.blue('[LOG]')} ${chalk.blue(
                moment().format('YYYY-MM-DD HH:mm:ss')
            )} - ${message}`
        )
    }

    static error(message: string) {
        console.log(
            `${chalk.blue('[LOG]')} ${chalk.blue(
                moment().format('YYYY-MM-DD HH:mm:ss')
            )} - ${chalk.red(message)}`
        )
    }
}
