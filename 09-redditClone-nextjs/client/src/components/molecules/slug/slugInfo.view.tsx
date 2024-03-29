import dayjs from "dayjs";
import Link from "next/link";
import React from "react";

const SlugInfoView = ({ ...post }) => {
  return (
    <div className={"py-2 pr-2"}>
      <div className={"flex items-center"}>
        <p className={"text-xs text-gray-400"}>
          Posted by
          <i className={"fas fa-history ml-1 mr-1"}></i>
          <Link className={"mx-1 hover:underline"} href={`/u/${post.username}`}>
            /u/{post.username}
          </Link>
          <Link className={"mx-1 hover:underline"} href={post.url}>
            {dayjs(post.createdAt).format("YYYY-MM-DD HH:mm")}
          </Link>
        </p>
      </div>
      <h1 className={"my-1 text-xl font-medium"}>{post.title}</h1>
      <p className={"my-3 text-sm"}>{post.body}</p>
      <div className={"flex"}>
        <button>
          <i className={"mr-1 fas fa-comment-alt fa-xs"}></i>
          <span className={"font-bold"}>{post.commentCount} Comments</span>
        </button>
      </div>
    </div>
  );
};

export default SlugInfoView;
