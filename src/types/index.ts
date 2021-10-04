import * as core from 'express-serve-static-core'

declare global{
    namespace Express {
        interface Request {
            user:any
        }
    }
}