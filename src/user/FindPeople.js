import React, { Component } from "react";
import { findPeople, follow } from "./apiUser";
import DefaultProfile from "../images/avatar.jpeg";
import { Link } from "react-router-dom";
import { isAuthenticated } from "../auth";

class FindPeople extends Component {
  constructor() {
    super();
    this.state = {
      users: [],
      error: "",
      open: false
    };
  }

  componentDidMount() {
    const id = isAuthenticated().user._id;
    const token = isAuthenticated().token;
    findPeople(id, token).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ users: data });
      }
    });
  }

  clickFollow = (user, i) => {
    const userId = isAuthenticated().user._id;
    const token = isAuthenticated().token;
    follow(userId, token, user._id).then(data => {
      if (data.error) {
        this.setState({ error: data.error });
      } else {
        let toFollow = this.state.users;
        toFollow.splice(i, 1);
        this.setState({
          users: toFollow,
          open: true,
          followMessage: `Following ${user.name}`
        });
      }
    });
  };

  renderUsers = users => (
    <div className="row">
      {users.map((user, i) => (
        <div
          className="card col-md-3 ml-1 mr-1 mt-1 mb-1"
          style={{ width: "18rem;" }}
        >
          <img
            className="card-img-top"
            style={{ height: "220px", width: "auto" }}
            src={`${process.env.REACT_APP_API_URL}/user/photo/${user._id}`}
            onError={i => (i.target.src = `${DefaultProfile}`)}
            alt={user.name}
          ></img>
          <div className="card-body">
            <h5 className="card-title">{user.name}</h5>
            <p className="card-text">{`Joined ${new Date(
              user.created
            ).toDateString()}`}</p>
          </div>

          <div className="card-body">
            <Link className="card-link" to={`/user/${user._id}`}>
              View Profile
            </Link>

            <Link
              onClick={() => this.clickFollow(user, i)}
              className="card-link float-right"
            >
              Follow
            </Link>
          </div>
        </div>
      ))}
    </div>
  );

  render() {
    const { users, open, followMessage } = this.state;
    return (
      <div className="container">
        <h2 className="mt-5 mb-5">Find People</h2>

        {open && (
          <div className="alert alert-success">
            <p>{followMessage}</p>
          </div>
        )}

        {this.renderUsers(users)}
      </div>
    );
  }
}

export default FindPeople;
