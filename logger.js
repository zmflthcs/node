const {createLogger , format, transports} = require('winston');
// if use with winston-daily-rotate-file, can manage time of log. divide in time wise.
const logger = createLogger({
    level: 'info', // show how serious log is. there are error, warn, info, verbosae, debug, silly. if choose info, show more serious logs like error, warn.
    format: format.json(), // tehre are json, label, timestamp, printf, simple, combine. if want log time, use timestamp.
    transports: [ // select how to store log.  File mean store in file. 
        new transports.File({filename: 'combined.log'}),
        new transports.File({filename: 'error.log', level: 'error'})
    ]
});

if(process.env.NODE_ENV !== 'production'){
    logger.add(new transports.Console({foramt: format.simple()}))
}

module.exports = logger;