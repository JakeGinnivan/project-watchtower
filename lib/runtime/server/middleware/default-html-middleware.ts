import * as fs from 'fs'
import * as path from 'path'
import * as express from 'express'
import { addAssetsToHtml } from '../assets'
import { RuntimeConfig } from '../../../'
import { Logger } from '../../universal'

const isProduction = process.env.NODE_ENV === 'production'

export const expressNoop: express.RequestHandler = (_res, _req, next) => next()

export const getDefaultHtmlMiddleware = (
    log: Logger,
    runtimeConfig: RuntimeConfig,
    logNotFound = false,
) => {
    // on production we just serve the generated index.html
    if (isProduction) {
        const indexPath = path.resolve(runtimeConfig.BASE, 'index.html')
        const productionMiddleware: express.RequestHandler = (_req, res) => {
            res.status(200).sendFile(indexPath)
        }
        return productionMiddleware
    }

    // for development we grab the source index.html and add the assets
    let indexContent: string

    if (runtimeConfig.SERVER_PUBLIC_DIR) {
        try {
            const indexPath = path.resolve(runtimeConfig.SERVER_PUBLIC_DIR, 'index.html')
            indexContent = fs.readFileSync(indexPath, 'utf8')
        } catch (e) {
            if (logNotFound) {
                log.error({ err: e }, 'Reading index.html failed!')
            }
            return expressNoop
        }
    } else {
        return expressNoop
    }

    const middleware: express.RequestHandler = (_req, res) => {
        const indexWithAssets = addAssetsToHtml(indexContent, runtimeConfig)
        res
            .status(200)
            .contentType('text/html')
            .send(indexWithAssets)
    }

    return middleware
}