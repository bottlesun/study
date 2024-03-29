import axios from "axios";
import { useRouter } from "next/router";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import useSWR from "swr";
import { useAuthState } from "../../../../context/auth";
import { Post } from "../../../../types/user";
import PostCard from "../../../atoms/box/postCard/postCard";
import SubpagesView from "./subpages.view";

const SubPages = () => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [ownSub, setOwnSub] = useState(false);
  const { authenticated, user } = useAuthState();
  const subName = router.query.sub;
  const { data: sub, error, mutate } = useSWR(subName ? `/subs/${subName}` : null);

  useEffect(() => {
    if (!sub || !user) return;
    setOwnSub(authenticated && user.username === sub.username);
  }, [sub]);

  const uploadImage = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files === null) return;
    const file = event.target.files[0];
    console.log("file", file);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", fileInputRef.current!.name);

    try {
      await axios.post(`/subs/${sub.name}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const openFileInput = (type: string) => {
    if (!ownSub) return;
    const fileInput = fileInputRef.current;
    if (fileInput) {
      fileInput.name = type;
      fileInput.click();
    }
  };

  let renderPosts = null;
  if (!sub) {
    renderPosts = <p className={"text-lg text-center"}>커뮤니티가 존재하지 않습니다.</p>;
  } else if (sub.posts.length === 0) {
    renderPosts = <p className={"text-lg text-center"}>게시글이 존재하지 않습니다.</p>;
  } else {
    renderPosts = sub.posts.map((post: Post) => {
      return <PostCard key={post.identifier} post={post} mutate={mutate} />;
    });
  }

  const props = {
    sub,
    fileInputRef,
    uploadImage,
    openFileInput,
    ownSub,
    renderPosts
  };

  return <>{sub && <SubpagesView {...props} />}</>;
};
export default SubPages;
