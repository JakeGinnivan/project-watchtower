import * as path from 'path'
import * as express from 'express'
import { findFreePort } from '../util/network'
import { getConfig } from '../config/config'
import { BuildConfig } from '../../types'
import { getBaseDir } from '../../../lib/runtime/server/base-dir'
import { getDefaultHtmlMiddleware } from './middleware/default-html-middleware'
import { Logger } from '../universal'
import { createEnsureRequestLogMiddleware } from './middleware/ensure-request-log-middleware'

export { getDefaultHtmlMiddleware }

const isProduction = process.env.NODE_ENV === 'production'

export const getPort = (buildConfig: BuildConfig, fallbackPort?: number) =>
    parseInt(process.env.PORT || '', 10) || fallbackPort || buildConfig.PORT

export const isWatchMode = () => process.env.START_WATCH_MODE === 'true'

export const isFastMode = () => process.env.START_FAST_MODE === 'true'

export type CreateServerOptions = {
    log: Logger

    /**
     * Early middleware hook is before static middleswares etc
     */
    earlyMiddlewareHook?: (app: express.Express) => void
    middlewareHook?: (app: express.Express) => void
    callback?: () => void
    startListening?: boolean
}
export type CreateServerType = (options: CreateServerOptions) => express.Express

export const createServer: CreateServerType = options => {
    const config = getConfig(options.log, getBaseDir())
    const { earlyMiddlewareHook, middlewareHook, callback, startListening = true } = options
    const app = express()
    app.disable('x-powered-by')
    const buildConfig = getConfig(options.log, process.env.PROJECT_DIR || process.cwd())

    if (process.env.NODE_ENV !== 'production' && isWatchMode()) {
        // tslint:disable-next-line no-var-requires
        const { getHotReloadMiddleware } = require('../../server/dev')
        app.use(getHotReloadMiddleware(options.log, buildConfig))
    }

    app.use(createEnsureRequestLogMiddleware(options.log))

    if (earlyMiddlewareHook) {
        earlyMiddlewareHook(app)
    }

    // Express route prefixes have to start with /
    const assetsPathPrefixWithLeadingSlash =
        config.ASSETS_PATH_PREFIX[0] === '/'
            ? config.ASSETS_PATH_PREFIX
            : `/${config.ASSETS_PATH_PREFIX}`
    app.use(
        assetsPathPrefixWithLeadingSlash,
        express.static(path.join(config.BASE, config.ASSETS_PATH_PREFIX), {
            index: false,
        }),
    )

    if (config.SERVER_PUBLIC_DIR) {
        app.use(
            express.static(config.SERVER_PUBLIC_DIR, {
                index: false,
            }),
        )
    }

    if (middlewareHook) {
        middlewareHook(app)
    }

    // if the server does not use server-side rendering, just respond with index.html
    // for each request not handled in other middlewares
    app.get('*', getDefaultHtmlMiddleware(options.log, buildConfig))

    if (!startListening) {
        return app
    }

    const listen = (usePort: number) => {
        const server = app.listen(usePort, () => {
            options.log.info(`Server listening on port ${usePort}`)
            if (process.env.NODE_ENV !== 'production' && isWatchMode()) {
                // tslint:disable-next-line no-var-requires
                const { openBrowser } = require('../../server/dev')
                openBrowser(config, usePort)
            }
            if (callback) {
                callback()
            }
        })

        app.set('server', server)
    }

    const port = getPort(config)

    if (isProduction) {
        listen(port)
    } else {
        findFreePort(port).then(usePort => listen(usePort))
    }

    return app
}
