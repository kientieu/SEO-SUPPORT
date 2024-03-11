require('dotenv').config();
const { FE_URL } = process.env
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const db = require('./db');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');

const userRouter = require('./routes/user_router');
const campaignRouter = require('./routes/campaign_router');
const landingPageRouter = require('./routes/landing_page_router');
const keywordRouter = require('./routes/keyword_router');
const postRouter = require('./routes/post_router');
const topicRouter = require('./routes/topic_router');
const satSiteRouter = require('./routes/sat_site_router');
const scheduleRouter = require('./routes/schedule_router');

const app = express();
db.connect();

/*app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');*/

app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
    secret: process.env.SESSION_SECRET
}));
app.use(passport.initialize());
app.use(passport.session());

//Main
app.use(cors({ origin: FE_URL, credentials: true }));
app.use('/', userRouter);
app.use('/api', campaignRouter);
app.use('/api', landingPageRouter);
app.use('/api', keywordRouter);
app.use('/api', postRouter);
app.use('/api', topicRouter);
app.use('/api', satSiteRouter);
app.use('/api', scheduleRouter);

// catch 404 and forward to error handler
/*app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});*/

module.exports = app;
