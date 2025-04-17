import { useAuth } from '../context/AuthContext';

const Account = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="container py-5 text-center">
        <h4>You are not logged in.</h4>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="mb-4">Account Info</h2>
      <div className="card p-4 shadow-sm rounded-3">
        <p className="mb-2"><strong>Username:</strong> {user.username}</p>
        <p className="mb-0"><strong>User ID:</strong> {user.id}</p>
      </div>
    </div>
  );
};

export default Account;
