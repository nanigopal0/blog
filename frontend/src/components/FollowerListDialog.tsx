import { useEffect, useState } from "react";
import FollowerCard from "./FollowerCard";
import apiErrorHandle, { type APIError } from "@/util/APIErrorHandle";
import { useAuth } from "@/contexts/AuthContext";
import Dialog from "./Dialog";

import { useNavigate } from "react-router-dom";
import type { DialogProps } from "@/types/DialogProps";
import type { UserOverview } from "@/types/user/UserOverview";
import type { PaginatedResponse } from "@/types/Page";
import LoadingIndicator from "./LoadingIndicator";
import { getFollowers, getFollowings } from "@/util/api-request/FollowUtil";

interface FollowerListDialogProps extends DialogProps {
  userId: number;
  isFollowers?: boolean;
}

export default function FollowerListDialog({
  isOpen,
  onClose,
  userId,
  isFollowers = true,
}: FollowerListDialogProps) {
  const { logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [followers, setFollowers] =
    useState<PaginatedResponse<UserOverview> | null>(null);
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
      apiErrorHandle(error as APIError, logout);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
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
          {followers && followers.page.totalElements === 0 && (
            <h2 className="text-center my-4">
              No {isFollowers ? "followers" : "followings"} found
            </h2>
          )}
        </div>
      )}
    </Dialog>
  );
}
