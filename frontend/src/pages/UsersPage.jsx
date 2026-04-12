import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import UserCard from "../components/users/UserCard";
import { fetchFollowing, fetchUsers, followUser, unfollowUser } from "../store/slices/usersSlice";

const UsersPage = () => {
  const dispatch = useDispatch();
  const { users, following } = useSelector((state) => state.users);
  const authUser = useSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(fetchUsers());
    if (authUser?._id || authUser?.id) {
      dispatch(fetchFollowing(authUser._id || authUser.id));
    }
  }, [authUser, dispatch]);

  const followingSet = new Set((following || []).map((user) => user._id || user.id));

  return (
    <section className="space-y-3">
      <h2 className="text-xl font-black text-slate-50">Discover people</h2>
      {!authUser ? <p className="rounded-2xl border border-white/10 bg-card/70 p-4 text-sm text-slate-300">Login to follow people.</p> : null}
      <div className="grid gap-3 sm:grid-cols-2">
        {users.map((user) => {
          const id = user.id || user._id;
          const isSelf = id === (authUser?.id || authUser?._id);
          if (isSelf) return null;

          return (
            <UserCard
              key={id}
              user={user}
              isFollowing={followingSet.has(id)}
              onFollow={(userId) => dispatch(followUser(userId)).then(() => dispatch(fetchFollowing(authUser._id || authUser.id)))}
              onUnfollow={(userId) => dispatch(unfollowUser(userId)).then(() => dispatch(fetchFollowing(authUser._id || authUser.id)))}
            />
          );
        })}
      </div>
    </section>
  );
};

export default UsersPage;
