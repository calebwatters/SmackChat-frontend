import React from "react";
import moment from "moment";

export const Message = ({ message }) => {
  const userImage = message.user.img_url;
  const content = message.content;
  const userName = message.user.username;
  const createdAt =
    moment(message.created_at).format("ddd MMM DD YYYY") +
    " @ " +
    moment(message.created_at).format("hh:mm a");
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
          {userName}
          <div className="date">{createdAt}</div>
        </div>
        <div className="extra text">
          {content.substring(0, 4) === "http" ? (
            <a href={content} target="_blank">
              {content.split("//")[1]}
            </a>
          ) : (
            <p>{content}</p>
          )}
        </div>
      </div>
    </div>
  );
};
