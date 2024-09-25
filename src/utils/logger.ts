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

    static warn(message: string) {
        console.log(
            `${chalk.blue('[LOG]')} ${chalk.blue(
                moment().format('YYYY-MM-DD HH:mm:ss')
            )} - ${chalk.yellow(message)}`
        )
    }

    static success(message: string) {
        console.log(
            `${chalk.green('[LOG]')} ${chalk.green(
                moment().format('YYYY-MM-DD HH:mm:ss')
            )} - ${chalk.yellow(message)}`
        )
    }
}
