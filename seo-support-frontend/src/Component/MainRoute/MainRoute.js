import React, { useCallback } from "react";
import { Switch, Route, useLocation } from "react-router-dom";
import Campaign from "../campaign/Campaign.js";
import Login from "../login/Login.js";
import LoginSuccess from "../login/LoginSuccess.js";
import LoginFail from "../login/LoginFail.js";
import Report from "../report/Report.js";
import DetailCampaign from "../detail_campaign/DetailCampaign.js";
import DetailLandingPage from "../detail_landingpage/DetailLandingPage.js";
import Keyword from "../keyword/Keyword.js";
import Site from "../site/Site.js";
import SiteDetail from "../site/SiteDetail.js";
import Post from "../post/Post.js";
import AutoPost from "../post/AutoPost.js";
import SpinPost from "../post/SpinPost.js";
import PostResult from "../post/PostResult.js";
import AddPost from "../post/AddPost.js";
import EditPost from "../post/EditPost.js";
import SelectSite from "../site/SelectSite.js";
import SelectSiteLv3 from "../site/SelectSiteLv3.js";
import EditKeyword from "../keyword/EditKeyword.js";
import Register from "../login/Register.js";
import ClosedCampaign from "../campaign/ClosedCampaign.js";
import Schedule from "../schedule/Schedule.js";
import ScheduleDetails from "../schedule/ScheduleDetails.js";
import Topbar from "../Topbar.js";
import Navbar from "../Navbar.js";
import Home from "../Home.js";
import PrivateRoute from "../PrivateRoute.js";
import PostResultDetails from "../post/PostResultDetails.js";
import PageNotFound from "../PageNotFound.js";
import RedirectTo404 from "../RedirectTo404.js";

const MainRoute = () => {
  const location = useLocation();

  const checkPath = useCallback(() => {
    if (location.pathname.includes("login")) return false;
    if (location.state && location.state.from.includes("login")) return false;
    return true;
  }, [location]);
  return (
    <div className={checkPath() ? "my-app" : "my-app--no-grid"}>
      {checkPath() && (
        <>
          <Topbar />
          <Navbar />
        </>
      )}
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>

        <Route exact path="/login">
          <Login />
        </Route>

        <Route exact path="/login/success">
          <LoginSuccess />
        </Route>

        <Route exact path="/login/fail">
          <LoginFail />
        </Route>

        <Route exact path="/register">
          <Register />
        </Route>

        <PrivateRoute exact path="/campaign" component={Campaign} />

        <PrivateRoute
          exact
          path="/campaign/closed"
          component={ClosedCampaign}
        />

        <PrivateRoute
          exact
          path="/detail-campaign/:campaign_id"
          component={DetailCampaign}
        />

        <PrivateRoute
          exact
          path="/detail-lp/:lp_id"
          component={DetailLandingPage}
        />

        <PrivateRoute exact path="/keyword" component={Keyword} />

        <PrivateRoute
          exact
          path="/edit-keyword/:keyword_id"
          component={EditKeyword}
        />

        <PrivateRoute exact path="/back-link" component={Site} />

        <PrivateRoute
          exact
          path="/site-detail/:sat_site_id"
          component={SiteDetail}
        />

        <PrivateRoute exact path="/report" component={Report} />

        <PrivateRoute exact path="/post" component={Post} />

        <PrivateRoute exact path="/spin-post" component={AutoPost} />

        <PrivateRoute exact path="/post/results" component={PostResult} />

        <PrivateRoute
          exact
          path="/post/results/:result_id"
          component={PostResultDetails}
        />

        <PrivateRoute
          exact
          path="/post/spinner/:post_id"
          component={SpinPost}
        />

        <PrivateRoute
          exact
          path="/post/back-link/:post_id"
          component={SelectSite}
        />

        <PrivateRoute
          exact
          path="/post/back-link-lv3/:post_id"
          component={SelectSiteLv3}
        />

        <PrivateRoute exact path="/add-post" component={AddPost} />

        <PrivateRoute exact path="/edit-post/:post_id" component={EditPost} />

        <PrivateRoute exact path="/schedule" component={Schedule} />

        <PrivateRoute
          exact
          path="/schedule-detail/:schedule_id"
          component={ScheduleDetails}
        />

        <PrivateRoute exact path="/report" component={Report} />

        <Route exact path="/error" component={PageNotFound} />

        <Route path="*" component={RedirectTo404} /> {/* This route is always at the end */}
      </Switch>
    </div>
  );
};

export default MainRoute;
