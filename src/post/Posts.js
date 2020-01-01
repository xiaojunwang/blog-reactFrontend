import React, { Component } from "react";
import { list } from "./apiPost";
import DefaultPost from "../images/mountain.jpg";
import { Link } from "react-router-dom";

class Posts extends Component {
  constructor() {
    super();
    this.state = {
      posts: []
    };
  }

  componentDidMount() {
    list().then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ posts: data });
      }
    });
  }

  renderPosts = posts => {
    return (
      <div className="row">
        {posts.map((post, i) => {
          const posterId = post.postedBy ? `/user/${post.postedBy._id}` : "";
          const posterName = post.postedBy ? post.postedBy.name : "Unknown";
          return (
            <>
              <div className="row col-md-12" key={i}>
                <div className="col-md-8">
                  <h5 className="card-title">{post.title}</h5>
                  <p className="card-text">{post.body.substring(0, 100)}</p>
                  <br />
                  <p className="card-text text-muted">
                    Posted by: <Link to={`${posterId}`}>{posterName}</Link> on{" "}
                    {new Date(post.created).toDateString()}
                  </p>
                  <Link
                    className="btn btn-sm btn-primary"
                    to={`/post/${post._id}`}
                  >
                    Read More
                  </Link>
                </div>
                <div className="col-md-4 mr-0">
                  <img
                    src={`${process.env.REACT_APP_API_URL}/post/photo/${post._id}`}
                    onError={i => (i.target.src = `${DefaultPost}`)}
                    alt={post.title}
                    className="img-thumbnail "
                    style={{ height: "200px", width: "100%" }}
                  />
                </div>
              </div>
              <div className="col-md-12 mb-2 mt-2">
                <hr />
              </div>
            </>
          );
        })}
      </div>
    );
  };

  render() {
    const { posts } = this.state;
    return (
      <div className="container">
        <h2 className="mt-5 mb-5">
          {!posts.length ? "Loading..." : "Recent Posts"}
        </h2>
        {this.renderPosts(posts)}
      </div>
    );
  }
}

export default Posts;
