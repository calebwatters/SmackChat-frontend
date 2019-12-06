import React, { useState, useEffect } from "react";
import { Reply } from "./Reply.js";
import { API_ROOT } from "../constants/index";
import { fetchJson } from "../util/request";
import moment from "moment";

export const Message = ({ message, toggleThread, likeOrUnlike }) => {
  const [userImage, setUserImage] = useState(null);

  const handleImage = async () => {
    const imageUrl = fetchJson(`${API_ROOT}/users/${message.user_id})`);

    setUserImage(imageUrl);
  };

  useEffect(() => {
    handleImage();
  }, []);

  const openThread = () => {
    toggleThread(message);
  };

  const showReplies = () => {
    message.replies.map(m => <Reply key={m.id} message={m} />);
  };

  const content = message.content;
  const userName = message.user_name;
  const createdAt = moment(message.created_at).format("ddd hh:mm a");

  return (
    <div className="event message">
      <div className="label">
        {userImage ? (
          <img className="ui medium circular image" src={userImage} alt="" />
        ) : (
          <i className="user icon"> </i>
        )}
      </div>
      <div className="content">
        <div className="summary">
          <a>{userName} </a>
          <div className="date">{createdAt}</div>
          <div className="extra text">
            {content.substring(0, 4) === "http" ? (
              <a href={content} target="_blank">
                {content.split("//")[1]}
              </a>
            ) : (
              content
            )}
          </div>
        </div>
        <div className="extra images"> </div>
        <div className="meta">
          <a onClick={likeOrUnlike} className="like">
            <i className="like icon"></i>
          </a>
          <a onClick={openThread} className="comments-link">
            {message.replies.length !== 0
              ? message.replies.length === 1
                ? `1 reply`
                : `${message.replies.length} replies`
              : "reply to this"}
          </a>
        </div>
      </div>
      {/* <div className="ui segments">
                {props.message.replies ? showReplies() : null}
            </div> */}
    </div>
  );
};
