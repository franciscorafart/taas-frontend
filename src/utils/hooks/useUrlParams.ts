import { useLocation } from "react-router-dom";

function useUrlParams() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  return {
    videoId: searchParams.get("videoId") || undefined,
    newsId: searchParams.get("newsId") || undefined,
    albumId: searchParams.get("albumID") || undefined,
  };
}

export default useUrlParams;
