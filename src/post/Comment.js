import React, { Component } from "react";
import { comment, uncomment } from "./apiPost";
import { isAuthenticated } from "../auth";
import { Link } from "react-router-dom";
import DefaultProfile from "../images/avatar.jpeg";

class Comment extends Component {
  state = {
    text: "",
    error: "",
    showAlert: ""
  };

  handleChange = event => {
    this.setState({ error: "" });
    this.setState({ text: event.target.value });
  };

  isValid = () => {
    const { text } = this.state;
    if (!text.length > 0 || text.legnth > 150) {
      this.setState({
        error: "Comment should not be enpty and less than 150 characters long."
      });
      return false;
    }
    return true;
  };

  deleteConfirmed = comment => {
    let answer = window.confirm(
      "Are you sure you want to delete this comment?"
    );
    if (answer) {
      this.deleteComment(comment);
    }
  };

  deleteComment = comment => {
    const userId = isAuthenticated().user._id;
    const token = isAuthenticated().token;
    const postId = this.props.postId;

    uncomment(userId, token, postId, comment).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        // need to pass the new comment back to the parent
        // dispatch fresh list of comment to parent (SinglePost - parent)
        this.props.updateComments(data.comments);
      }
    });
  };

  addComment = event => {
    event.preventDefault();
    if (!isAuthenticated()) {
      this.setState({ error: "Please sign in to leave a comment" });
      return false;
    }

    if (this.isValid()) {
      const userId = isAuthenticated().user._id;
      const token = isAuthenticated().token;
      const postId = this.props.postId;
      const actualComment = { text: this.state.text };

      comment(userId, token, postId, actualComment).then(data => {
        if (data.error) {
          console.log(data.error);
        } else {
          this.setState({ text: "" });
          // need to pass the new comment back to the parent
          // dispatch fresh list of comment to parent (SinglePost - parent)
          this.props.updateComments(data.comments);
        }
      });
    }
  };

  render() {
    const { comments } = this.props;
    const { error } = this.state;

    return (
      <div>
        <div
          className="alert alert-danger"
          style={{ display: error ? "" : "none" }}
        >
          {error}
        </div>

        <div className="col-md-12">
          <h3 className="text-primary">{comments.length} Comments</h3>
          <hr />
          {comments.map((comment, i) => (
            <div key={i}>
              <div className="mb-4">
                <Link to={`/user/${comment.postedBy._id}`}>
                  <img
                    style={{ borderRadius: "50%", border: "1px solid black" }}
                    className="float-left mr-2"
                    height="30px"
                    width="30px"
                    src={`${process.env.REACT_APP_API_URL}/user/photo/${comment.postedBy._id}`}
                    onError={i => (i.target.src = `${DefaultProfile}`)}
                    alt={comment.postedBy.name}
                  />
                </Link>
                <div>
                  <p className="lead">{comment.text}</p>
                  <p className="text-muted">
                    Posted by:{" "}
                    <Link to={`/user/${comment.postedBy._id}`}>
                      {comment.postedBy.name}
                    </Link>{" "}
                    on {new Date(comment.created).toDateString()}
                    <span>
                      {isAuthenticated().user &&
                        isAuthenticated().user._id === comment.postedBy._id && (
                          <>
                            <span
                              onClick={() => {
                                this.deleteConfirmed(comment);
                              }}
                              className="text-danger float-right mr-1"
                              style={{ cursor: "pointer" }}
                            >
                              Delete Post
                            </span>
                          </>
                        )}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <h3 className="mt-5 mb-4 ml-4">Leave a comment</h3>

        <form onSubmit={this.addComment}>
          <div className="row ml-2">
            <div className="form-group col-md-10">
              <textarea
                class="form-control"
                id="commentInput"
                value={this.state.text}
                onChange={this.handleChange}
                rows="2"
                placeholder="What is on your mind..."
              ></textarea>
            </div>
            <div className="col-md-2">
              <button className="btn btn-raised btn-success mt-2">Post</button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default Comment;
