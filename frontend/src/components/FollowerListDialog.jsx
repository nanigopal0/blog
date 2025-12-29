import { useContext, useEffect, useState } from "react";
import FollowerCard from "./FollowerCard";
import apiErrorHandle from "@/util/APIErrorHandle";
import { AuthContext } from "@/contexts/AuthContext";
import { getFollowers, getFollowings } from "@/util/UserUtil";
import Dialog from "./Dialog";
import LoadingIndicator from "./LoadingIndicator";
import { useNavigate } from "react-router-dom";

export default function FollowerListDialog({
  open,
  onClose,
  userId,
  isFollowers = true,
}) {
  const { logout } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [followers, setFollowers] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFollowers();
  }, []);

  const fetchFollowers = async () => {
    setLoading(true);
    try {
      const result = isFollowers
        ? await getFollowers(userId)
        : await getFollowings(userId);
      setFollowers(result);
    } catch (error) {
      const retry = await apiErrorHandle(error, logout);
      if(retry) fetchFollowers();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      isOpen={open}
      onClose={onClose}
      title={isFollowers ? "Followers" : "Followings"}
    >
      {loading ? (
        <LoadingIndicator />
      ) : (
        <div className="overflow-auto gap-4 flex flex-col ">
          {followers &&
            followers.content.map((follower) => (
              <FollowerCard
                key={follower.id}
                follower={follower}
                onclick={() => {
                  onClose();
                  navigate(`/user/${follower.id}`);
                }}
              />
            ))}
          {followers && followers.empty && (
            <h2 className="text-center my-4">
              No {isFollowers ? "followers" : "followings"} found
            </h2>
          )}
        </div>
      )}
    </Dialog>
  );
}
