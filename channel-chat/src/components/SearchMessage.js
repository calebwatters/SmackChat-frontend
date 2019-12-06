import React from "react";

export const SearchMessage = () => (
  <div className="search-popout">
    <div className="ui feed">
      {this.props.messages.map(message => (
        <div key={message.id} className="event">
          <div className="label">
            <i className="user icon"> </i>
          </div>
          <div className="content">
            <div className="summary">
              <a href="#">{message.user_name}</a>
              <div className="date">{message.created_at}</div>
              <div className="extra text">{message.content}</div>
            </div>
            <div className="extra images"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);
