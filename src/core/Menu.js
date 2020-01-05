import React from "react";
// withRouter is a higher order component that takes another component as parameter
import { Link, withRouter } from "react-router-dom";
import { signout, isAuthenticated } from "../auth";

const isActive = (history, path) => {
  if (history.location.pathname === path) {
    return "nav-link active";
  } else {
    return "nav-link";
  }
};

const Menu = ({ history }) => (
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="collapse navbar-collapse" id="navbarText">
      <ul class="navbar-nav mr-auto">
        <li className="nav-item">
          <Link className={isActive(history, "/")} to="/">
            Home
          </Link>
        </li>

        {isAuthenticated() && (
          <>
            <li className="nav-item">
              <Link
                to={`/findpeople`}
                className={isActive(history, `/findpeople`)}
              >
                View Users
              </Link>
            </li>
          </>
        )}
      </ul>
      <ul class="navbar-nav">
        <li className="nav-item">
          <Link
            to={`/post/create`}
            className={isActive(history, `/post/create`)}
          >
            Create Post
          </Link>
        </li>
        {!isAuthenticated() && (
          // react fragments
          <>
            <li className="nav-item">
              <Link className={isActive(history, "/signin")} to="/signin">
                Sign In
              </Link>
            </li>
            <li className="nav-item">
              <Link className={isActive(history, "/signup")} to="/signup">
                Sign Up
              </Link>
            </li>
          </>
        )}

        {isAuthenticated() && (
          <>
            <li className="nav-item">
              <Link
                to={`/user/${isAuthenticated().user._id}`}
                className={isActive(
                  history,
                  `/user/${isAuthenticated().user._id}`
                )}
              >
                My Profile
              </Link>
            </li>
            <li className="nav-item">
              <span
                className={isActive(history, "/signout")}
                style={{ cursor: "pointer" }}
                onClick={() => signout(() => history.push("/"))}
              >
                Sign Out
              </span>
            </li>
          </>
        )}
      </ul>
    </div>
  </nav>
);

export default withRouter(Menu);
