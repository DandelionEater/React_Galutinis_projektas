import mongoose, { Int32 } from 'mongoose';

export const enum WatchStatus {
  Planned,
  Watching,
  Paused,
  Dropped,
  Completed
}

export class Anime {
  animeId: number = -1;
  completedEpisodes: number = 0;
  score: number = 0;
  status: WatchStatus = WatchStatus.Planned;
}

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatarUrl: {
    type: String,
  },
  animeList: {
    type: Array<Anime>
  }
});

const User = mongoose.model('User', userSchema);

export default User;
