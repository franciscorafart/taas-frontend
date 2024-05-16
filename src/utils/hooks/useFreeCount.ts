import freebies from "atoms/freebies";
import { useCallback, useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { getFreeCount } from "requests/auth";

const useFreeCount = () => {
  const setFreebies = useSetRecoilState(freebies);

  const findFreebies = useCallback(async () => {
    const res = await getFreeCount();
    setFreebies(Number(res?.count || 0));
  }, [setFreebies]);

  useEffect(() => {
    findFreebies();
  }, [findFreebies]);
};

export default useFreeCount;
